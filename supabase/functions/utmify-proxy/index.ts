const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const UTMIFY_API = "https://api.utmify.com.br/api/conversions";
const UTMIFY_TOKEN = "eANG8dEfmyDGlRFUic1anuDu0AOnpYQEfnIw";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
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

    console.log("Calling:", endpoint, "with token format tests");

    // Try with Authorization Bearer header (newer Utmify API format)
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${UTMIFY_TOKEN}`,
        "x-api-token": UTMIFY_TOKEN,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.text();
    console.log("Utmify response:", res.status, data);

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
