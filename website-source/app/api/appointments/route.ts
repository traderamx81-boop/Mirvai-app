import { env } from "cloudflare:workers";
import { getChatGPTUser } from "../../chatgpt-auth";

const ADMIN = "stevenraechelle@gmail.com";
const SLOTS = ["09:00", "11:00", "13:00", "15:00"];
const clean = (value: unknown, max = 300) => String(value || "").trim().slice(0, max);
async function isAdmin() { const user = await getChatGPTUser(); return !!user && user.email.toLowerCase() === ADMIN; }
function lagosToday() {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Lagos", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date());
  const value = Object.fromEntries(parts.map(part => [part.type, part.value]));
  return `${value.year}-${value.month}-${value.day}`;
}

export async function GET(request: Request) {
  const date = clean(new URL(request.url).searchParams.get("date"), 10);
  if (date) {
    const result = await env.DB.prepare("SELECT appointment_time FROM appointments WHERE appointment_date=? AND status!='cancelled'").bind(date).all();
    return Response.json({ bookedTimes: result.results.map((row: Record<string, unknown>) => row.appointment_time) });
  }
  if (!(await isAdmin())) return new Response("Unauthorized", { status: 401 });
  const result = await env.DB.prepare("SELECT * FROM appointments ORDER BY appointment_date ASC, appointment_time ASC LIMIT 250").all();
  return Response.json(result.results);
}

export async function POST(request: Request) {
  const body = await request.json() as Record<string, unknown>;
  if (clean(body.website)) return Response.json({ ok: true });
  const name = clean(body.name, 80), contact = clean(body.contact, 120), purpose = clean(body.purpose, 120), date = clean(body.date, 10), time = clean(body.time, 5), notes = clean(body.notes, 500);
  if (!name || !contact || !purpose || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !SLOTS.includes(time)) return new Response("Please complete the booking details.", { status: 400 });
  if (date < lagosToday() || new Date(`${date}T12:00:00Z`).getUTCDay() === 0) return new Response("Please choose a future Monday–Saturday date.", { status: 400 });
  try {
    await env.DB.prepare("INSERT INTO appointments (name,contact,purpose,appointment_date,appointment_time,status,notes,created_at) VALUES (?,?,?,?,?,'pending',?,?)")
      .bind(name, contact, purpose, date, time, notes || null, new Date().toISOString()).run();
  } catch {
    const existing = await env.DB.prepare("SELECT id,status FROM appointments WHERE appointment_date=? AND appointment_time=?")
      .bind(date, time).first<{ id: number; status: string }>();
    if (existing?.status === "cancelled") {
      await env.DB.prepare("UPDATE appointments SET name=?,contact=?,purpose=?,status='pending',notes=?,created_at=? WHERE id=?")
        .bind(name, contact, purpose, notes || null, new Date().toISOString(), existing.id).run();
      return Response.json({ ok: true });
    }
    return new Response("That time has just been booked. Please choose another slot.", { status: 409 });
  }
  return Response.json({ ok: true });
}

export async function PATCH(request: Request) {
  if (!(await isAdmin())) return new Response("Unauthorized", { status: 401 });
  const body = await request.json() as Record<string, unknown>;
  const id = Number(body.id), status = clean(body.status, 30);
  if (!id || !["pending", "confirmed", "completed", "cancelled"].includes(status)) return new Response("Invalid update", { status: 400 });
  await env.DB.prepare("UPDATE appointments SET status=? WHERE id=?").bind(status, id).run();
  return Response.json({ ok: true });
}
