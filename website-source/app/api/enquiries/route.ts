import { env } from "cloudflare:workers";
import { getChatGPTUser } from "../../chatgpt-auth";

const ADMIN = "stevenraechelle@gmail.com";
const clean = (value: unknown, max = 300) => String(value || "").trim().slice(0, max);
async function isAdmin() {
  const user = await getChatGPTUser();
  return !!user && user.email.toLowerCase() === ADMIN;
}

export async function GET() {
  if (!(await isAdmin())) return new Response("Unauthorized", { status: 401 });
  const result = await env.DB.prepare("SELECT * FROM leads ORDER BY id DESC LIMIT 250").all();
  return Response.json(result.results);
}

export async function POST(request: Request) {
  const body = await request.json() as Record<string, unknown>;
  if (clean(body.website)) return Response.json({ ok: true });
  const name = clean(body.name, 80);
  const contact = clean(body.contact, 120);
  const requestSummary = clean(body.request, 600);
  const location = clean(body.location, 120) || "To be discussed";
  const budget = clean(body.budget, 80) || "To be discussed";
  const propertyType = clean(body.propertyType, 100) || "Not specified";
  const timeline = clean(body.timeline, 80) || "Not specified";
  const basedIn = clean(body.basedIn, 80) || "Not specified";
  if (!name || !contact || !requestSummary) {
    return new Response("Please complete your name, contact details and property request.", { status: 400 });
  }
  const diaspora = basedIn.toLowerCase() === "not specified" || basedIn.toLowerCase() === "nigeria" ? 0 : 1;
  await env.DB.prepare("INSERT INTO leads (name,contact,source,desired_location,budget,property_type,stage,diaspora,notes,created_at) VALUES (?,?,?,?,?,?,'new',?,?,?)")
    .bind(name, contact, "website", location, budget, propertyType, diaspora, `Request: ${requestSummary}; Timeline: ${timeline}; Based in: ${basedIn}`, new Date().toISOString()).run();
  return Response.json({ ok: true });
}

export async function PATCH(request: Request) {
  if (!(await isAdmin())) return new Response("Unauthorized", { status: 401 });
  const body = await request.json() as Record<string, unknown>;
  const id = Number(body.id);
  const stage = clean(body.stage, 30);
  if (!id || !["new", "contacted", "qualified", "closed", "archived"].includes(stage)) return new Response("Invalid update", { status: 400 });
  await env.DB.prepare("UPDATE leads SET stage=? WHERE id=?").bind(stage, id).run();
  return Response.json({ ok: true });
}
