import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

http.route({
  path: "/health",
  method: "GET",
  handler: httpAction(async () => {
    return new Response(
      JSON.stringify({ ok: true, service: "mirvai-convex" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }),
});

http.route({
  path: "/api/properties",
  method: "GET",
  handler: httpAction(async (ctx) => {
    const items = await ctx.runQuery(api.properties.list, { includeDrafts: false });
    return new Response(JSON.stringify(items), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }),
});

http.route({
  path: "/api/enquiries",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const body = await request.json();
    const id = await ctx.runMutation(api.requests.create, {
      externalId: body.id,
      kind: body.kind || "Enquiry",
      title: body.title || "MIRVAI",
      summary: body.summary || "",
      location: body.location,
      timeline: body.timeline,
      propertyType: body.propertyType,
      budget: body.budget,
      clientName: body.clientName,
      clientContact: body.clientContact,
      basedIn: body.basedIn,
      notes: body.notes,
      propertyId: body.propertyId,
    });
    return new Response(JSON.stringify({ id }), {
      status: 201,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }),
});

http.route({
  path: "/api/enquiries",
  method: "OPTIONS",
  handler: httpAction(async () => {
    return new Response(null, { status: 204, headers: corsHeaders });
  }),
});

export default http;
