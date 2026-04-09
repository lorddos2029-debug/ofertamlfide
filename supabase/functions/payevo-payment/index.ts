const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PAYEVO_API = "https://apiv2.payevo.com.br/functions/v1";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const secretKey = Deno.env.get("PAYEVO_SECRET_KEY");
  if (!secretKey) {
    return new Response(JSON.stringify({ error: "PAYEVO_SECRET_KEY not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Base64 encode the secret key for Basic Auth
  const authHeader = "Basic " + btoa(secretKey);

  try {
    const body = await req.json();
    const { action, ...payload } = body;

    if (action === "create-transaction") {
      const res = await fetch(`${PAYEVO_API}/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": authHeader,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      return new Response(JSON.stringify(data), {
        status: res.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "check-status") {
      const { transactionId } = payload;
      const res = await fetch(`${PAYEVO_API}/transactions/${transactionId}`, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Authorization": authHeader,
        },
      });
      const data = await res.json();
      return new Response(JSON.stringify(data), {
        status: res.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
