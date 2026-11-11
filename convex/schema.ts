import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  properties: defineTable({
    reference: v.optional(v.string()),
    slug: v.string(),
    name: v.string(),
    type: v.string(), // terrace, semi, detached, apartment, off-plan, land
    area: v.string(), // Island, Mainland
    locale: v.string(), // Ikoyi, Lekki, Ikeja, Magodo, etc.
    price: v.number(), // in NGN
    beds: v.optional(v.number()),
    baths: v.optional(v.number()),
    sqm: v.optional(v.number()),
    photo: v.optional(v.string()),
    photoUrl: v.optional(v.string()),
    description: v.string(),
    status: v.string(), // Available, Under Offer, Sold
    isDraft: v.boolean(),
    titleDocument: v.optional(v.string()), // Governor’s Consent, C of O, Gazette
    features: v.array(v.string()),
    createdAt: v.string(),
  })
    .index("by_type", ["type"])
    .index("by_area", ["area"])
    .index("by_status", ["status"]),

  requests: defineTable({
    kind: v.string(), // Viewing, Property brief, Listing enquiry, Enquiry
    title: v.string(),
    summary: v.string(),
    clientName: v.optional(v.string()),
    clientContact: v.optional(v.string()),
    propertyId: v.optional(v.string()),
    reviewed: v.boolean(),
    teamNotes: v.optional(v.string()),
    timestamp: v.string(),
  }).index("by_reviewed", ["reviewed"]),

  settings: defineTable({
    key: v.string(),
    announcement: v.string(),
    showAnnouncement: v.boolean(),
    heroHeadlineMain: v.string(),
    heroHeadlineEm: v.string(),
    heroCopy: stringValidation(),
    whatsappPhone: v.string(),
    conciergeEmail: v.string(),
    officeLocation: v.string(),
    usdRate: v.number(),
    gbpRate: v.number(),
  }).index("by_key", ["key"]),
});

function stringValidation() {
  return v.string();
}
