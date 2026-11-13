import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let requests = await ctx.db.query("requests").order("desc").collect();
    if (args.status === "unreviewed") {
      requests = requests.filter((r) => !r.reviewed);
    } else if (args.status === "reviewed") {
      requests = requests.filter((r) => r.reviewed);
    }
    return requests;
  },
});

export const create = mutation({
  args: {
    externalId: v.optional(v.string()),
    kind: v.string(),
    title: v.string(),
    summary: v.string(),
    location: v.optional(v.string()),
    timeline: v.optional(v.string()),
    propertyType: v.optional(v.string()),
    budget: v.optional(v.string()),
    clientName: v.optional(v.string()),
    clientContact: v.optional(v.string()),
    basedIn: v.optional(v.string()),
    notes: v.optional(v.string()),
    propertyId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("requests", {
      ...args,
      reviewed: false,
      timestamp: new Date().toISOString(),
    });
    return id;
  },
});

export const setReviewed = mutation({
  args: {
    id: v.optional(v.id("requests")),
    externalId: v.optional(v.string()),
    reviewed: v.boolean(),
  },
  handler: async (ctx, args) => {
    if (args.id) {
      const existing = await ctx.db.get(args.id);
      if (existing) {
        await ctx.db.patch(args.id, { reviewed: args.reviewed });
        return true;
      }
    }
    if (args.externalId) {
      const byExt = await ctx.db
        .query("requests")
        .withIndex("by_externalId", (q) => q.eq("externalId", args.externalId!))
        .first();
      if (byExt) {
        await ctx.db.patch(byExt._id, { reviewed: args.reviewed });
        return true;
      }
    }
    return false;
  },
});

export const addTeamNotes = mutation({
  args: {
    id: v.id("requests"),
    notes: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { teamNotes: args.notes });
    return true;
  },
});
