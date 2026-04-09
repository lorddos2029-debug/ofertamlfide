const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { endpoint, ...payload } = body;

    // Support both tracking pixel events and conversions API
    let url = "";
    if (endpoint === "tracking") {
      url = "https://tracking.utmify.com.br/tracking/v1/events";
    } else if (endpoint === "conversions-ic") {
      url = "https://api.utmify.com.br/api/conversions/create-ic";
    } else if (endpoint === "conversions") {
      url = "https://api.utmify.com.br/api/conversions/create";
    } else {
      url = "https://tracking.utmify.com.br/tracking/v1/events";
    }

    console.log("Proxying to:", url);

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.text();
    console.log("Response:", res.status, data);

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
