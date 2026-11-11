import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Queries
export const list = query({
  args: {
    includeDrafts: v.optional(v.boolean()),
    area: v.optional(v.string()),
    type: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let properties = await ctx.db.query("properties").collect();
    if (!args.includeDrafts) {
      properties = properties.filter((p) => !p.isDraft);
    }
    if (args.area && args.area !== "all") {
      properties = properties.filter((p) => p.area === args.area);
    }
    if (args.type && args.type !== "all") {
      properties = properties.filter((p) => p.type === args.type);
    }
    return properties;
  },
});

export const getById = query({
  args: { id: v.id("properties") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Mutations
export const add = mutation({
  args: {
    name: v.string(),
    type: v.string(),
    area: v.string(),
    locale: v.string(),
    price: v.number(),
    beds: v.optional(v.number()),
    baths: v.optional(v.number()),
    sqm: v.optional(v.number()),
    photo: v.optional(v.string()),
    photoUrl: v.optional(v.string()),
    description: v.string(),
    status: v.string(),
    isDraft: v.boolean(),
    titleDocument: v.optional(v.string()),
    features: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const slug = args.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const propertyId = await ctx.db.insert("properties", {
      ...args,
      slug,
      createdAt: new Date().toISOString(),
    });
    return propertyId;
  },
});

export const update = mutation({
  args: {
    id: v.id("properties"),
    name: v.optional(v.string()),
    type: v.optional(v.string()),
    area: v.optional(v.string()),
    locale: v.optional(v.string()),
    price: v.optional(v.number()),
    beds: v.optional(v.number()),
    baths: v.optional(v.number()),
    photo: v.optional(v.string()),
    photoUrl: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.optional(v.string()),
    isDraft: v.optional(v.boolean()),
    titleDocument: v.optional(v.string()),
    features: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    await ctx.db.patch(id, rest);
    return true;
  },
});

export const remove = mutation({
  args: { id: v.id("properties") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return true;
  },
});
