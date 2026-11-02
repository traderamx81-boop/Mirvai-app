import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const properties = sqliteTable("properties", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  reference: text("reference").notNull().unique(),
  title: text("title").notNull(),
  location: text("location").notNull(),
  type: text("type").notNull(),
  price: integer("price").notNull(),
  status: text("status").notNull().default("available"),
  description: text("description").notNull(),
  imageKey: text("image_key"),
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  verified: integer("verified", { mode: "boolean" }).notNull().default(false),
  createdAt: text("created_at").notNull(),
});

export const leads = sqliteTable("leads", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  contact: text("contact").notNull(),
  source: text("source").notNull().default("website"),
  desiredLocation: text("desired_location"),
  budget: text("budget"),
  propertyType: text("property_type"),
  stage: text("stage").notNull().default("new"),
  followUp: text("follow_up"),
  diaspora: integer("diaspora", { mode: "boolean" }).notNull().default(false),
  notes: text("notes"),
  createdAt: text("created_at").notNull(),
}, (table) => [index("idx_leads_stage_created").on(table.stage, table.createdAt)]);

export const appointments = sqliteTable("appointments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  contact: text("contact").notNull(),
  purpose: text("purpose").notNull(),
  appointmentDate: text("appointment_date").notNull(),
  appointmentTime: text("appointment_time").notNull(),
  status: text("status").notNull().default("pending"),
  notes: text("notes"),
  createdAt: text("created_at").notNull(),
}, (table) => [
  uniqueIndex("appointments_date_time_unique").on(table.appointmentDate, table.appointmentTime),
  index("idx_appointments_status_date").on(table.status, table.appointmentDate),
]);

export const conversations = sqliteTable("conversations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  visitorToken: text("visitor_token").notNull().unique(),
  name: text("name").notNull(),
  contact: text("contact").notNull(),
  status: text("status").notNull().default("open"),
  adminReadAt: text("admin_read_at"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
}, (table) => [index("idx_conversations_updated").on(table.updatedAt)]);

export const chatMessages = sqliteTable("chat_messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  conversationId: integer("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
  sender: text("sender").notNull(),
  body: text("body").notNull(),
  createdAt: text("created_at").notNull(),
}, (table) => [index("idx_chat_messages_conversation").on(table.conversationId, table.id)]);

export const analyticsEvents = sqliteTable("analytics_events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  event: text("event").notNull(),
  path: text("path").notNull(),
  sessionId: text("session_id").notNull(),
  createdAt: text("created_at").notNull(),
}, (table) => [index("idx_analytics_event_created").on(table.event, table.createdAt)]);
