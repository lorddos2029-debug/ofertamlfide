const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const UTMIFY_API = "https://api.utmify.com.br/api/conversions";
const UTMIFY_TOKEN = "kYryuc7A8NSyg80ZtKaULjEcAm0utu3UQvHT";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    console.log("Received body:", JSON.stringify(body));
    const { action, ...payload } = body;

    let endpoint = "";
    if (action === "create-ic") {
      endpoint = `${UTMIFY_API}/create-ic`;
    } else if (action === "create") {
      endpoint = `${UTMIFY_API}/create`;
    } else {
      return new Response(JSON.stringify({ error: "Invalid action" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Calling Utmify endpoint:", endpoint);
    console.log("Payload:", JSON.stringify(payload));

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-token": UTMIFY_TOKEN,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.text();
    console.log("Utmify response status:", res.status, "body:", data);
    
    return new Response(data, {
      status: res.status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("Error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
