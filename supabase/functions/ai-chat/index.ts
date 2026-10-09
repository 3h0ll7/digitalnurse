import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { PROVIDERS, buildUpstreamRequest, providerOrder, validateChatInput } from "./providers.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
  'Access-Control-Expose-Headers': 'X-AI-Provider, X-AI-Model, X-AI-Fallback, X-RateLimit-Remaining, X-RateLimit-Limit',
};

const getEnv = (name: string) => Deno.env.get(name);

/** Time allowed for a provider to start answering before we try the next one. */
const PROVIDER_TIMEOUT_MS = 20_000;

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

const MAX_REQUESTS_PER_DAY = 10;

function getClientIP(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || req.headers.get('x-real-ip')
    || 'unknown';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, language, provider, modePrompt = '' } = await req.json();
    const isArabic = language === 'ar';

    const invalid = validateChatInput({ messages, modePrompt });
    if (invalid) return json({ error: invalid }, 400);

    const order = providerOrder(provider, getEnv);
    if (order.length === 0) return json({ error: 'AI service is not configured' }, 503);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // IP-based rate limiting (no auth required)
    const clientIP = getClientIP(req);
    const userIdentifier = `ip_${clientIP}`;
    const today = new Date().toISOString().split('T')[0];

    const { data: rateData } = await supabaseAdmin
      .from('ai_rate_limits')
      .select('request_count')
      .eq('user_identifier', userIdentifier)
      .eq('request_date', today)
      .maybeSingle();

    const currentCount = rateData?.request_count ?? 0;

    if (currentCount >= MAX_REQUESTS_PER_DAY) {
      return new Response(
        JSON.stringify({
          error: `Daily limit reached (${MAX_REQUESTS_PER_DAY} messages/day). Try again tomorrow.`,
          rateLimitExceeded: true,
          remaining: 0,
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    await supabaseAdmin
      .from('ai_rate_limits')
      .upsert(
        { user_identifier: userIdentifier, request_date: today, request_count: currentCount + 1, updated_at: new Date().toISOString() },
        { onConflict: 'user_identifier,request_date' }
      );


    const systemPrompt = `${isArabic
      ? `أنت مساعد تمريض ذكي ذو معرفة عالية. قدّم إرشادات سريرية قائمة على الأدلة باللغة العربية الفصحى حول:
- إجراءات وتقنيات التمريض
- آليات عمل الأدوية والجرعات والاعتبارات التمريضية
- التقييم السريري والتوثيق (صيغ SOAP وSBAR)
- تفسير القيم المخبرية والنطاقات الحرجة
- سلامة المرضى وتقييم المخاطر
- بروتوكولات التمريض في العناية المركزة والطوارئ

دائمًا:
- استخدم لغة سريرية مهنية بالعربية الفصحى
- قدّم إرشادات خطوة بخطوة عند الحاجة
- أبرز العلامات التحذيرية ومعايير التصعيد
- ذكّر المستخدمين بالتحقق من السياسات المؤسسية والمتخصصين المؤهلين
- اذكر بوضوح: "للأغراض التعليمية فقط. يُرجى التحقق دائمًا مع متخصصي الرعاية الصحية المؤهلين."
- أجب دائمًا باللغة العربية الفصحى فقط`
      : `You are a highly knowledgeable AI Nursing Assistant. Provide evidence-based, concise clinical guidance on:
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
- State clearly: "For educational purposes only. Always verify with a qualified healthcare professional."`}\n\n${modePrompt}`;

    const upstreamMessages = [{ role: 'system', content: systemPrompt }, ...messages];
    let lastStatus = 500;

    // Requested model first; if it fails before streaming starts (down, rate-limited, out of
    // credits, rejected parameters, slow to respond), try the other one. Once a stream has
    // started we pass it through as is.
    for (const [index, id] of order.entries()) {
      const request = buildUpstreamRequest(id, upstreamMessages, getEnv);
      let response: Response;
      try {
        response = await fetch(request.url, {
          method: 'POST',
          headers: request.headers,
          body: JSON.stringify(request.body),
          signal: AbortSignal.timeout(PROVIDER_TIMEOUT_MS),
        });
      } catch (networkError) {
        console.error(`AI provider ${id} unreachable:`, networkError);
        continue;
      }

      if (response.ok && response.body) {
        return new Response(response.body, {
          headers: {
            ...corsHeaders,
            'Content-Type': 'text/event-stream',
            'X-AI-Provider': id,
            'X-AI-Model': PROVIDERS[id].label,
            'X-AI-Fallback': String(index > 0 || id !== (provider === 'gemini' ? 'gemini' : 'groq')),
            'X-RateLimit-Remaining': String(MAX_REQUESTS_PER_DAY - currentCount - 1),
            'X-RateLimit-Limit': String(MAX_REQUESTS_PER_DAY),
          },
        });
      }

      lastStatus = response.status;
      console.error(`AI provider ${id} error:`, response.status, await response.text());
    }

    const message =
      lastStatus === 429 ? 'AI service rate limit exceeded. Please try again later.'
      : lastStatus === 402 ? 'AI service credits exhausted. Please contact support.'
      : 'AI service temporarily unavailable';
    return json({ error: message, tried: order }, lastStatus === 429 || lastStatus === 402 ? lastStatus : 502);

  } catch (error) {
    console.error('Error in ai-chat function:', error);
    return new Response(
      JSON.stringify({ error: 'An internal error occurred. Please try again later.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
