import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const settings = await ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", "main"))
      .first();
    return settings;
  },
});

export const update = mutation({
  args: {
    announcement: v.optional(v.string()),
    showAnnouncement: v.optional(v.boolean()),
    heroHeadlineMain: v.optional(v.string()),
    heroHeadlineEm: v.optional(v.string()),
    heroCopy: v.optional(v.string()),
    whatsappPhone: v.optional(v.string()),
    conciergeEmail: v.optional(v.string()),
    officeLocation: v.optional(v.string()),
    usdRate: v.optional(v.number()),
    gbpRate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", "main"))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, args);
      return existing._id;
    } else {
      return await ctx.db.insert("settings", {
        key: "main",
        announcement: args.announcement || "",
        showAnnouncement: args.showAnnouncement ?? false,
        heroHeadlineMain: args.heroHeadlineMain || "Come home",
        heroHeadlineEm: args.heroHeadlineEm || "to Lagos.",
        heroCopy: args.heroCopy || "Thoughtfully selected homes.",
        whatsappPhone: args.whatsappPhone || "2349011081436",
        conciergeEmail: args.conciergeEmail || "concierge@mirvaigroup.com",
        officeLocation: args.officeLocation || "Lagos, Nigeria",
        usdRate: args.usdRate || 1500,
        gbpRate: args.gbpRate || 1900,
      });
    }
  },
});
