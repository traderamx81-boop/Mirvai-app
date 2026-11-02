import { env } from "cloudflare:workers";
import { getChatGPTUser } from "../../../chatgpt-auth";

const ADMIN = "stevenraechelle@gmail.com";
const clean = (value: unknown, max = 1000) => String(value || "").trim().slice(0, max);
async function isAdmin() { const user = await getChatGPTUser(); return !!user && user.email.toLowerCase() === ADMIN; }

export async function GET() {
  if (!(await isAdmin())) return new Response("Unauthorized", { status: 401 });
  const conversations = await env.DB.prepare("SELECT c.*, (SELECT body FROM chat_messages m WHERE m.conversation_id=c.id ORDER BY m.id DESC LIMIT 1) last_message FROM conversations c ORDER BY updated_at DESC LIMIT 200").all();
  const messages = await env.DB.prepare("SELECT id,conversation_id,sender,body,created_at FROM chat_messages ORDER BY id ASC LIMIT 1000").all();
  return Response.json({ conversations: conversations.results, messages: messages.results });
}

export async function POST(request: Request) {
  if (!(await isAdmin())) return new Response("Unauthorized", { status: 401 });
  const body = await request.json() as Record<string, unknown>, conversationId = Number(body.conversationId), message = clean(body.message);
  if (!conversationId || !message) return new Response("Message required", { status: 400 });
  const now = new Date().toISOString();
  await env.DB.batch([
    env.DB.prepare("INSERT INTO chat_messages (conversation_id,sender,body,created_at) VALUES (?,'admin',?,?)").bind(conversationId, message, now),
    env.DB.prepare("UPDATE conversations SET updated_at=?,admin_read_at=? WHERE id=?").bind(now, now, conversationId),
  ]);
  return Response.json({ ok: true });
}

export async function PATCH(request: Request) {
  if (!(await isAdmin())) return new Response("Unauthorized", { status: 401 });
  const body = await request.json() as Record<string, unknown>, conversationId = Number(body.conversationId);
  if (!conversationId) return new Response("Invalid conversation", { status: 400 });
  await env.DB.prepare("UPDATE conversations SET admin_read_at=? WHERE id=?").bind(new Date().toISOString(), conversationId).run();
  return Response.json({ ok: true });
}
