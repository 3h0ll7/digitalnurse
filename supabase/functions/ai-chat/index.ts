import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, language, modePrompt = '' } = await req.json();
    const isArabic = language === 'ar';

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

    // --- Call Lovable AI Gateway (Google Gemini built-in connector) ---
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `${isArabic
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
- State clearly: "For educational purposes only. Always verify with a qualified healthcare professional."`}\n\n${modePrompt}` ,
          },
          ...messages.filter((message) => message.role !== 'system'),
        ],
        stream: false,
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

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content?.trim();

    if (!content) {
      return new Response(JSON.stringify({ error: 'Empty AI response' }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ content }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error('Error in ai-chat function:', error);
    return new Response(
      JSON.stringify({ error: 'An internal error occurred. Please try again later.' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
