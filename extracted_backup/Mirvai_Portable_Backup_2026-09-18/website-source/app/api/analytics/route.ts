import { env } from "cloudflare:workers";
import { getChatGPTUser } from "../../chatgpt-auth";

const ADMIN = "stevenraechelle@gmail.com";
const EVENTS = new Set(["page_view", "whatsapp_click", "enquiry_submitted", "booking_submitted", "chat_message"]);
const clean = (value: unknown, max = 120) => String(value || "").trim().slice(0, max);
async function isAdmin() { const user = await getChatGPTUser(); return !!user && user.email.toLowerCase() === ADMIN; }

export async function POST(request: Request) {
  const body = await request.json() as Record<string, unknown>;
  const event = clean(body.event, 40), path = clean(body.path, 120) || "/", sessionId = clean(body.sessionId, 100);
  if (!EVENTS.has(event) || !sessionId) return new Response("Invalid event", { status: 400 });
  await env.DB.prepare("INSERT INTO analytics_events (event,path,session_id,created_at) VALUES (?,?,?,?)").bind(event, path, sessionId, new Date().toISOString()).run();
  return Response.json({ ok: true });
}

export async function GET() {
  if (!(await isAdmin())) return new Response("Unauthorized", { status: 401 });
  const since = new Date(Date.now() - 30 * 86400000).toISOString();
  const totals = await env.DB.prepare("SELECT event,COUNT(*) total,COUNT(DISTINCT session_id) unique_sessions FROM analytics_events WHERE created_at>=? GROUP BY event").bind(since).all();
  const daily = await env.DB.prepare("SELECT substr(created_at,1,10) day,COUNT(*) views FROM analytics_events WHERE event='page_view' AND created_at>=? GROUP BY substr(created_at,1,10) ORDER BY day ASC").bind(since).all();
  return Response.json({ totals: totals.results, daily: daily.results });
}
