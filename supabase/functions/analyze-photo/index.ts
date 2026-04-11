import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY")!;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  try {
    const { photo_base64, task_name, criteria } = await req.json();

    if (!photo_base64 || !task_name) {
      return new Response(
        JSON.stringify({ aprovado: false, feedback: "Dados incompletos." }),
        { headers: { "Content-Type": "application/json" }, status: 400 }
      );
    }

    const prompt = `Você é um assistente que ajuda crianças a completar tarefas domésticas.
Analise esta foto e determine se a tarefa "${task_name}" foi concluída corretamente.

Critérios para aprovação: ${criteria || "A tarefa deve parecer concluída de forma razoável."}

Responda APENAS com um JSON no formato:
{
  "aprovado": true | false,
  "feedback": "mensagem curta, encorajadora, em português, max 20 palavras"
}`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 256,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: "image/jpeg",
                  data: photo_base64,
                },
              },
              {
                type: "text",
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Claude API error:", errorText);
      return new Response(
        JSON.stringify({
          aprovado: false,
          feedback: "Não consegui verificar agora. Tente novamente!",
        }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || "";

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0]);
      return new Response(JSON.stringify(result), {
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        aprovado: false,
        feedback: "Não consegui avaliar a foto. Tente tirar outra!",
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        aprovado: false,
        feedback: "Erro ao processar. Tente novamente!",
      }),
      { headers: { "Content-Type": "application/json" }, status: 500 }
    );
  }
});
