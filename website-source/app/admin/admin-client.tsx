"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { featuredProperty, formatNaira } from "@/lib/featured-property";

type Property = {
  id: number;
  reference: string;
  title: string;
  location: string;
  type: string;
  price: number;
  status: string;
  verified: number;
};

type Lead = {
  id: number;
  name: string;
  contact: string;
  desired_location: string | null;
  budget: string | null;
  property_type: string | null;
  stage: string;
  diaspora: number;
  notes: string | null;
  created_at: string;
};

type Appointment = {
  id: number;
  name: string;
  contact: string;
  purpose: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  notes: string | null;
  created_at: string;
};

type Conversation = {
  id: number;
  name: string;
  contact: string;
  status: string;
  admin_read_at: string | null;
  updated_at: string;
  last_message: string | null;
};

type ChatMessage = {
  id: number;
  conversation_id: number;
  sender: "visitor" | "admin";
  body: string;
  created_at: string;
};

type Analytics = {
  totals: Array<{ event: string; total: number; unique_sessions: number }>;
  daily: Array<{ day: string; views: number }>;
};

const propertyTypes = [
  "Fully detached duplex",
  "Semi-detached duplex",
  "Terrace duplex",
  "Luxury apartment",
  "Penthouse",
  "Bungalow",
  "Off-plan property",
  "Land",
  "Commercial property",
];

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-NG", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));

export default function AdminClient() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [analytics, setAnalytics] = useState<Analytics>({ totals: [], daily: [] });
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [propertyMessage, setPropertyMessage] = useState("");
  const [dashboardMessage, setDashboardMessage] = useState("");
  const previousAlerts = useRef<{ leads: number; appointments: number; chats: number } | null>(null);

  const loadDashboard = useCallback(async (showBrowserAlert = false) => {
    try {
      const [propertyResponse, leadResponse, appointmentResponse, chatResponse, analyticsResponse] = await Promise.all([
        fetch("/api/properties"),
        fetch("/api/enquiries"),
        fetch("/api/appointments"),
        fetch("/api/chat/admin"),
        fetch("/api/analytics"),
      ]);
      if ([leadResponse, appointmentResponse, chatResponse, analyticsResponse].some((response) => response.status === 401)) {
        setDashboardMessage("Your secure session has expired. Refresh the page to sign in again.");
        return;
      }
      const [propertyData, leadData, appointmentData, chatData, analyticsData] = await Promise.all([
        propertyResponse.json(), leadResponse.json(), appointmentResponse.json(), chatResponse.json(), analyticsResponse.json(),
      ]);
      setProperties(propertyData);
      setLeads(leadData);
      setAppointments(appointmentData);
      setConversations(chatData.conversations || []);
      setMessages(chatData.messages || []);
      setAnalytics(analyticsData);

      const alerts = {
        leads: leadData.filter((lead: Lead) => lead.stage === "new").length,
        appointments: appointmentData.filter((appointment: Appointment) => appointment.status === "pending").length,
        chats: (chatData.conversations || []).filter((conversation: Conversation) => !conversation.admin_read_at).length,
      };
      const previous = previousAlerts.current;
      if (showBrowserAlert && previous && "Notification" in window && Notification.permission === "granted") {
        const additions = [
          alerts.leads > previous.leads ? `${alerts.leads - previous.leads} new enquiry` : "",
          alerts.appointments > previous.appointments ? `${alerts.appointments - previous.appointments} new appointment` : "",
          alerts.chats > previous.chats ? `${alerts.chats - previous.chats} new chat` : "",
        ].filter(Boolean);
        if (additions.length) new Notification("New Mirvai activity", { body: additions.join(" · ") });
      }
      previousAlerts.current = alerts;
      setDashboardMessage("");
    } catch {
      setDashboardMessage("The dashboard could not refresh. Check your connection and try again.");
    }
  }, []);

  useEffect(() => {
    const firstLoad = window.setTimeout(() => void loadDashboard(), 0);
    const timer = window.setInterval(() => void loadDashboard(true), 15000);
    return () => { window.clearTimeout(firstLoad); window.clearInterval(timer); };
  }, [loadDashboard]);

  async function enableAlerts() {
    if (!("Notification" in window)) {
      setDashboardMessage("Browser alerts are not supported on this device. New-item badges will still update here.");
      return;
    }
    const permission = await Notification.requestPermission();
    setDashboardMessage(permission === "granted" ? "Browser alerts are on while this CRM is open." : "Browser alerts were not enabled. New-item badges will still update here.");
  }

  async function saveProperty(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPropertyMessage("Uploading…");
    const form = event.currentTarget;
    const data = new FormData(form);
    const file = data.get("image") as File;
    let imageKey = "";
    if (file?.size) {
      if (!(await validateImage(file))) {
        setPropertyMessage("Image must be at least 1200 × 900 pixels and close to a 4:3 ratio.");
        return;
      }
      const upload = new FormData();
      upload.append("image", file);
      const uploadResponse = await fetch("/api/upload", { method: "POST", body: upload });
      if (!uploadResponse.ok) {
        setPropertyMessage(await uploadResponse.text());
        return;
      }
      imageKey = (await uploadResponse.json()).key;
    }
    const body = Object.fromEntries(data);
    delete body.image;
    Object.assign(body, { imageKey, featured: data.get("featured") === "on", verified: data.get("verified") === "on" });
    const response = await fetch("/api/properties", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    if (response.ok) {
      form.reset();
      setPropertyMessage("Property published successfully.");
      void loadDashboard();
    } else setPropertyMessage(await response.text());
  }

  function validateImage(file: File) {
    return new Promise<boolean>((resolve) => {
      const image = new Image();
      image.onload = () => {
        const ratio = image.width / image.height;
        resolve(image.width >= 1200 && image.height >= 900 && ratio > 1.25 && ratio < 1.42);
        URL.revokeObjectURL(image.src);
      };
      image.onerror = () => resolve(false);
      image.src = URL.createObjectURL(file);
    });
  }

  async function removeProperty(id: number) {
    if (!confirm("Remove this property?")) return;
    await fetch(`/api/properties?id=${id}`, { method: "DELETE" });
    void loadDashboard();
  }

  async function updateLead(id: number, stage: string) {
    await fetch("/api/enquiries", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ id, stage }) });
    void loadDashboard();
  }

  async function updateAppointment(id: number, status: string) {
    await fetch("/api/appointments", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ id, status }) });
    void loadDashboard();
  }

  async function openConversation(id: number) {
    setSelectedConversation(id);
    await fetch("/api/chat/admin", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ conversationId: id }) });
    void loadDashboard();
  }

  async function reply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedConversation) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const response = await fetch("/api/chat/admin", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ conversationId: selectedConversation, message: data.get("message") }) });
    if (response.ok) {
      form.reset();
      void loadDashboard();
    }
  }

  const newLeads = leads.filter((lead) => lead.stage === "new").length;
  const pendingAppointments = appointments.filter((appointment) => appointment.status === "pending").length;
  const unreadChats = conversations.filter((conversation) => !conversation.admin_read_at).length;
  const metric = (event: string, key: "total" | "unique_sessions" = "total") =>
    Number(analytics.totals.find((item) => item.event === event)?.[key] || 0);
  const selected = conversations.find((conversation) => conversation.id === selectedConversation);
  const selectedMessages = messages.filter((message) => message.conversation_id === selectedConversation);

  return (
    <main className="admin">
      <section className="admin-intro">
        <div><p className="section-label">Mirvai control centre</p><h1>Website dashboard</h1><p>Manage client enquiries, appointments, website chat, analytics and property listings.</p></div>
        <div className="upload-guide"><b>New activity</b><span>{newLeads} new enquiries</span><span>{pendingAppointments} pending appointments</span><span>{unreadChats} unread chats</span><button type="button" onClick={enableAlerts}>Enable browser alerts</button></div>
      </section>
      {dashboardMessage && <p className="dashboard-message" aria-live="polite">{dashboardMessage}</p>}

      <section className="metric-grid" aria-label="Website analytics for the last 30 days">
        <article><small>Website visits</small><b>{metric("page_view")}</b><span>{metric("page_view", "unique_sessions")} visitors</span></article>
        <article><small>Enquiries</small><b>{metric("enquiry_submitted")}</b><span>Last 30 days</span></article>
        <article><small>Appointments</small><b>{metric("booking_submitted")}</b><span>Last 30 days</span></article>
        <article><small>WhatsApp taps</small><b>{metric("whatsapp_click")}</b><span>Last 30 days</span></article>
        <article><small>Chat messages</small><b>{metric("chat_message")}</b><span>Last 30 days</span></article>
      </section>

      <section className="crm-section">
        <div className="crm-title"><div><p className="section-label">Client enquiries</p><h2>Property requirements</h2></div><span className="count-badge">{newLeads} new</span></div>
        <div className="crm-table-wrap"><table className="crm-table"><thead><tr><th>Client</th><th>Requirement</th><th>Budget</th><th>Details</th><th>Stage</th></tr></thead><tbody>{leads.length ? leads.map((lead) => <tr key={lead.id}><td><b>{lead.name}</b><a href={lead.contact.includes("@") ? `mailto:${lead.contact}` : `tel:${lead.contact}`}>{lead.contact}</a><small>{formatDate(lead.created_at)}</small></td><td>{lead.property_type}<small>{lead.desired_location}{lead.diaspora ? " · Diaspora" : ""}</small></td><td>{lead.budget || "—"}</td><td>{lead.notes || "—"}</td><td><select value={lead.stage} onChange={(event) => void updateLead(lead.id, event.target.value)}><option value="new">New</option><option value="contacted">Contacted</option><option value="qualified">Qualified</option><option value="closed">Closed</option><option value="archived">Archived</option></select></td></tr>) : <tr><td colSpan={5} className="empty">No enquiries yet.</td></tr>}</tbody></table></div>
      </section>

      <section className="crm-section">
        <div className="crm-title"><div><p className="section-label">Appointments</p><h2>Consultation requests</h2></div><span className="count-badge">{pendingAppointments} pending</span></div>
        <div className="appointment-grid">{appointments.length ? appointments.map((appointment) => <article key={appointment.id}><small>{appointment.appointment_date} · {appointment.appointment_time} WAT</small><h3>{appointment.name}</h3><a href={appointment.contact.includes("@") ? `mailto:${appointment.contact}` : `tel:${appointment.contact}`}>{appointment.contact}</a><p>{appointment.purpose}</p>{appointment.notes && <p>{appointment.notes}</p>}<select value={appointment.status} onChange={(event) => void updateAppointment(appointment.id, event.target.value)}><option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select></article>) : <p className="empty">No appointments yet.</p>}</div>
      </section>

      <section className="crm-section">
        <div className="crm-title"><div><p className="section-label">Website chat</p><h2>Client conversations</h2></div><span className="count-badge">{unreadChats} unread</span></div>
        <div className="chat-inbox"><div className="conversation-list">{conversations.length ? conversations.map((conversation) => <button type="button" className={selectedConversation === conversation.id ? "active" : ""} onClick={() => void openConversation(conversation.id)} key={conversation.id}><span><b>{conversation.name}</b>{!conversation.admin_read_at && <i>New</i>}</span><small>{conversation.contact}</small><p>{conversation.last_message || "No message"}</p></button>) : <p className="empty">No website chats yet.</p>}</div><div className="conversation-thread">{selected ? <><header><b>{selected.name}</b><a href={selected.contact.includes("@") ? `mailto:${selected.contact}` : `tel:${selected.contact}`}>{selected.contact}</a></header><div className="thread-messages">{selectedMessages.map((message) => <p className={message.sender} key={message.id}>{message.body}<small>{formatDate(message.created_at)}</small></p>)}</div><form onSubmit={reply}><textarea required name="message" rows={3} placeholder="Write your reply…"/><button className="button gold" type="submit">Send reply</button></form></> : <p className="empty">Choose a conversation to read and reply.</p>}</div></div>
      </section>

      <section className="admin-grid property-manager">
        <form className="property-form" onSubmit={saveProperty}>
          <h2>Add a property</h2>
          <div className="form-row"><label>Reference<input required name="reference" placeholder="MIR-001"/></label><label>Title<input required name="title" placeholder="4-bedroom detached home"/></label></div>
          <div className="form-row"><label>Location<input required name="location" placeholder="Lekki Phase 1, Lagos"/></label><label>Property type<select name="type">{propertyTypes.map((type) => <option key={type}>{type}</option>)}</select></label></div>
          <div className="form-row"><label>Price (₦)<input required name="price" type="number" min="0"/></label><label>Status<select name="status"><option value="available">Available</option><option value="reserved">Reserved</option><option value="sold">Sold</option></select></label></div>
          <label>Description<textarea required name="description" rows={5} placeholder="Describe the property, location advantages and key features."/></label>
          <label>Property image<input required name="image" type="file" accept="image/jpeg,image/png,image/webp"/></label>
          <div className="checks"><label><input name="verified" type="checkbox"/> Verified</label><label><input name="featured" type="checkbox"/> Feature on homepage</label></div>
          <button className="button gold">Publish property</button><p className="admin-msg">{propertyMessage}</p>
        </form>
        <div className="records">
          <div className="image-standard"><b>Property image standard</b><span>Recommended: 1600 × 1200 px</span><span>Minimum: 1200 × 900 px</span><span>JPG, PNG or WebP · Max 8MB</span><span>Landscape 4:3 · no screenshots</span></div>
          <h2>Published properties <span>{properties.length + 1}</span></h2>
          <article className="managed-property-record"><div><small>{featuredProperty.reference} · Unpublished draft</small><h3>{featuredProperty.title}</h3><p>{featuredProperty.location} · {formatNaira(featuredProperty.price)}</p></div><span>Not shown publicly</span></article>
          {properties.map((property) => <article key={property.id}><div><small>{property.reference} · {property.status}</small><h3>{property.title}</h3><p>{property.location} · {formatNaira(property.price)}</p></div><button onClick={() => void removeProperty(property.id)}>Remove</button></article>)}
        </div>
      </section>
    </main>
  );
}
