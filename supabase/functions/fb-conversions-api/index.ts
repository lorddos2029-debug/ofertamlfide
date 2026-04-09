import { corsHeaders } from '@supabase/supabase-js/cors'

const FB_API_VERSION = "v21.0";
const PIXEL_ID = "1151522863787864";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const accessToken = Deno.env.get("FB_CAPI_ACCESS_TOKEN");
  if (!accessToken) {
    return new Response(JSON.stringify({ error: "FB_CAPI_ACCESS_TOKEN not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();
    const { events } = body;

    if (!events || !Array.isArray(events) || events.length === 0) {
      return new Response(JSON.stringify({ error: "events array is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Build Facebook CAPI payload
    const payload = {
      data: events.map((evt: any) => ({
        event_name: evt.event_name,
        event_time: evt.event_time || Math.floor(Date.now() / 1000),
        action_source: "website",
        event_source_url: evt.event_source_url || "",
        event_id: evt.event_id || crypto.randomUUID(),
        user_data: {
          ...(evt.email ? { em: [await hashSHA256(evt.email.toLowerCase().trim())] } : {}),
          ...(evt.phone ? { ph: [await hashSHA256(evt.phone.replace(/\D/g, ""))] } : {}),
          ...(evt.name ? { fn: [await hashSHA256(evt.name.toLowerCase().trim().split(" ")[0])] } : {}),
          ...(evt.name && evt.name.includes(" ") ? { ln: [await hashSHA256(evt.name.toLowerCase().trim().split(" ").slice(-1)[0])] } : {}),
          ...(evt.cpf ? { external_id: [await hashSHA256(evt.cpf.replace(/\D/g, ""))] } : {}),
          ...(evt.client_ip_address ? { client_ip_address: evt.client_ip_address } : {}),
          ...(evt.client_user_agent ? { client_user_agent: evt.client_user_agent } : {}),
          ...(evt.fbc ? { fbc: evt.fbc } : {}),
          ...(evt.fbp ? { fbp: evt.fbp } : {}),
        },
        custom_data: evt.custom_data || {},
      })),
    };

    const url = `https://graph.facebook.com/${FB_API_VERSION}/${PIXEL_ID}/events?access_token=${accessToken}`;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    return new Response(JSON.stringify(data), {
      status: res.status,
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

async function hashSHA256(value: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(value);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
