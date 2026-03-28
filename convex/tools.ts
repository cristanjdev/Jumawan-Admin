import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tools").collect();
  },
});

export const listActive = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("tools").collect();
    return all.filter((t) => t.is_active);
  },
});

export const getById = query({
  args: { id: v.id("tools") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    icon_url: v.string(),
    category: v.string(),
    description: v.optional(v.string()),
    is_active: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("tools", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("tools"),
    name: v.optional(v.string()),
    icon_url: v.optional(v.string()),
    category: v.optional(v.string()),
    description: v.optional(v.string()),
    is_active: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const cleanUpdates: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) cleanUpdates[key] = value;
    }
    await ctx.db.patch(id, cleanUpdates);
    return await ctx.db.get(id);
  },
});

export const remove = mutation({
  args: { id: v.id("tools") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const toggleActive = mutation({
  args: { id: v.id("tools"), is_active: v.boolean() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { is_active: args.is_active });
    return await ctx.db.get(args.id);
  },
});
