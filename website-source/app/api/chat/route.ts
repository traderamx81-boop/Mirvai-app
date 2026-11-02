import { env } from "cloudflare:workers";

const clean = (value: unknown, max = 500) => String(value || "").trim().slice(0, max);

export async function GET(request: Request) {
  const token = clean(new URL(request.url).searchParams.get("token"), 100);
  if (!token) return Response.json({ messages: [] });
  const conversation = await env.DB.prepare("SELECT id,name,contact FROM conversations WHERE visitor_token=?").bind(token).first<Record<string, unknown>>();
  if (!conversation) return Response.json({ messages: [] });
  const messages = await env.DB.prepare("SELECT id,sender,body,created_at FROM chat_messages WHERE conversation_id=? ORDER BY id ASC LIMIT 300").bind(conversation.id).all();
  return Response.json({ conversation, messages: messages.results });
}

export async function POST(request: Request) {
  const body = await request.json() as Record<string, unknown>;
  if (clean(body.website)) return Response.json({ ok: true });
  const token = clean(body.token, 100), name = clean(body.name, 80), contact = clean(body.contact, 120), message = clean(body.message, 1000);
  if (!token || !message) return new Response("Please enter your message.", { status: 400 });
  let conversation = await env.DB.prepare("SELECT id FROM conversations WHERE visitor_token=?").bind(token).first<{ id: number }>();
  const now = new Date().toISOString();
  if (!conversation) {
    if (!name || !contact) return new Response("Please enter your name and contact details.", { status: 400 });
    await env.DB.prepare("INSERT INTO conversations (visitor_token,name,contact,status,admin_read_at,created_at,updated_at) VALUES (?,?,?,'open',NULL,?,?)").bind(token, name, contact, now, now).run();
    conversation = await env.DB.prepare("SELECT id FROM conversations WHERE visitor_token=?").bind(token).first<{ id: number }>();
  }
  await env.DB.batch([
    env.DB.prepare("INSERT INTO chat_messages (conversation_id,sender,body,created_at) VALUES (?,'visitor',?,?)").bind(conversation!.id, message, now),
    env.DB.prepare("UPDATE conversations SET updated_at=?,status='open',admin_read_at=NULL WHERE id=?").bind(now, conversation!.id),
  ]);
  return Response.json({ ok: true });
}
