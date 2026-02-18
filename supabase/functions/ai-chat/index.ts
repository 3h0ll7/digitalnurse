import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const MAX_REQUESTS_PER_DAY = 10;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();

    // Validate input
    if (!Array.isArray(messages) || messages.length === 0 || messages.length > 50) {
      return new Response(JSON.stringify({ error: 'Invalid messages array' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate each message
    for (const msg of messages) {
      if (!msg.role || !msg.content || typeof msg.content !== 'string' || msg.content.length > 10000) {
        return new Response(JSON.stringify({ error: 'Invalid message format' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Determine user identifier (use auth token sub if available, fallback to IP)
    const authHeader = req.headers.get('Authorization');
    let userIdentifier = req.headers.get('x-forwarded-for') || 'anonymous';

    // Create Supabase service client for rate limiting
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Try to get authenticated user ID for more accurate rate limiting
    if (authHeader?.startsWith('Bearer ')) {
      const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
      const supabaseUser = createClient(supabaseUrl, anonKey, {
        global: { headers: { Authorization: authHeader } },
      });
      const { data: { user } } = await supabaseUser.auth.getUser();
      if (user) {
        userIdentifier = `user_${user.id}`;
      }
    }

    // --- Rate Limiting ---
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    const { data: rateData, error: rateError } = await supabaseAdmin
      .from('ai_rate_limits')
      .select('request_count')
      .eq('user_identifier', userIdentifier)
      .eq('request_date', today)
      .maybeSingle();

    if (rateError) {
      console.error('Rate limit check error:', rateError);
    }

    const currentCount = rateData?.request_count ?? 0;

    if (currentCount >= MAX_REQUESTS_PER_DAY) {
      return new Response(
        JSON.stringify({
          error: `Daily limit reached. You can send up to ${MAX_REQUESTS_PER_DAY} messages per day. Try again tomorrow.`,
          rateLimitExceeded: true,
          remaining: 0,
        }),
        {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Increment request count (upsert)
    await supabaseAdmin
      .from('ai_rate_limits')
      .upsert(
        {
          user_identifier: userIdentifier,
          request_date: today,
          request_count: currentCount + 1,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_identifier,request_date' }
      );

    // --- Call Lovable AI Gateway (Google Gemini 3 Flash) ---
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('AI service is not configured');
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          {
            role: 'system',
            content: `You are a highly knowledgeable AI Nursing Assistant. Provide evidence-based, concise clinical guidance on:
- Nursing procedures and techniques
- Medication mechanisms, dosages, and nursing considerations
- Clinical assessment and documentation (SOAP, SBAR formats)
- Lab value interpretation and critical ranges
- Patient safety and risk assessment
- ICU and emergency nursing protocols

Always:
- Use clinical, professional language
- Provide step-by-step guidance when appropriate
- Highlight red flags or escalation criteria
- Remind users to verify with institutional policies and qualified professionals
- State clearly: "For educational purposes only. Always verify with a qualified healthcare professional."`,
          },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);

      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'AI service rate limit exceeded. Please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'AI service credits exhausted. Please contact support.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ error: 'AI service temporarily unavailable' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Stream response back
    return new Response(response.body, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'X-RateLimit-Remaining': String(MAX_REQUESTS_PER_DAY - currentCount - 1),
        'X-RateLimit-Limit': String(MAX_REQUESTS_PER_DAY),
      },
    });

  } catch (error) {
    console.error('Error in ai-chat function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
