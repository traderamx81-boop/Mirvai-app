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
    let properties = await ctx.db.query("properties").order("desc").collect();
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
    slug: v.optional(v.string()),
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
    const slug =
      args.slug ||
      args.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") ||
      `listing-${Date.now()}`;
    const existing = await ctx.db
      .query("properties")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, {
        ...args,
        slug,
      });
      return existing._id;
    }
    const propertyId = await ctx.db.insert("properties", {
      ...args,
      slug,
      createdAt: new Date().toISOString(),
    });
    return propertyId;
  },
});

export const upsert = mutation({
  args: {
    slug: v.string(),
    name: v.string(),
    type: v.string(),
    area: v.string(),
    locale: v.string(),
    price: v.number(),
    beds: v.optional(v.number()),
    photo: v.optional(v.string()),
    photoUrl: v.optional(v.string()),
    description: v.string(),
    status: v.string(),
    isDraft: v.boolean(),
    features: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("properties")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        name: args.name,
        type: args.type,
        area: args.area,
        locale: args.locale,
        price: args.price,
        beds: args.beds,
        photo: args.photo,
        photoUrl: args.photoUrl,
        description: args.description,
        status: args.status,
        isDraft: args.isDraft,
        features: args.features ?? existing.features,
      });
      return existing._id;
    }

    return await ctx.db.insert("properties", {
      slug: args.slug,
      name: args.name,
      type: args.type,
      area: args.area,
      locale: args.locale,
      price: args.price,
      beds: args.beds,
      photo: args.photo,
      photoUrl: args.photoUrl,
      description: args.description,
      status: args.status,
      isDraft: args.isDraft,
      features: args.features ?? [],
      createdAt: new Date().toISOString(),
    });
  },
});

export const seedDefaults = mutation({
  args: {
    items: v.array(
      v.object({
        slug: v.string(),
        name: v.string(),
        type: v.string(),
        area: v.string(),
        locale: v.string(),
        price: v.number(),
        beds: v.optional(v.number()),
        photo: v.optional(v.string()),
        photoUrl: v.optional(v.string()),
        description: v.string(),
        status: v.string(),
        isDraft: v.boolean(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("properties").collect();
    if (existing.length > 0) {
      return { seeded: 0 };
    }
    const now = new Date().toISOString();
    for (const item of args.items) {
      await ctx.db.insert("properties", {
        ...item,
        features: [],
        createdAt: now,
      });
    }
    return { seeded: args.items.length };
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

export const removeBySlugOrId = mutation({
  args: {
    id: v.optional(v.id("properties")),
    slug: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.id) {
      const doc = await ctx.db.get(args.id);
      if (doc) {
        await ctx.db.delete(args.id);
        return true;
      }
    }
    if (args.slug) {
      const bySlug = await ctx.db
        .query("properties")
        .withIndex("by_slug", (q) => q.eq("slug", args.slug!))
        .first();
      if (bySlug) {
        await ctx.db.delete(bySlug._id);
        return true;
      }
    }
    return false;
  },
});
