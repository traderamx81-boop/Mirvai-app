import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let requests = await ctx.db.query("requests").collect();
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
    kind: v.string(),
    title: v.string(),
    summary: v.string(),
    clientName: v.optional(v.string()),
    clientContact: v.optional(v.string()),
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
    id: v.id("requests"),
    reviewed: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { reviewed: args.reviewed });
    return true;
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
