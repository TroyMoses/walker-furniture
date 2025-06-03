import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUser } from "./users";

export const createTestimonial = mutation({
  args: {
    customerName: v.string(),
    customerEmail: v.string(),
    content: v.string(),
    rating: v.number(),
    category: v.string(),
    featured: v.optional(v.boolean()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    let userId = undefined;

    if (identity) {
      const user = await getUser(ctx, identity.tokenIdentifier);
      userId = user._id;
    }

    const testimonialId = await ctx.db.insert("testimonials", {
      userId,
      customerName: args.customerName,
      customerEmail: args.customerEmail,
      content: args.content,
      rating: args.rating,
      category: args.category,
      featured: args.featured || false,
      status: args.status || "pending",
      createdAt: Date.now(),
    });

    return testimonialId;
  },
});

export const getAllTestimonials = query({
  args: {
    status: v.optional(v.string()),
    category: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Not authenticated");
    }

    const user = await getUser(ctx, identity.tokenIdentifier);
    if (user.role !== "admin") {
      throw new ConvexError("Not authorized");
    }

    let testimonials = await ctx.db.query("testimonials").order("desc").collect();

    // Apply filters
    if (args.status) {
      testimonials = testimonials.filter((t) => t.status === args.status);
    }

    if (args.category) {
      testimonials = testimonials.filter((t) => t.category === args.category);
    }

    if (args.featured !== undefined) {
      testimonials = testimonials.filter((t) => t.featured === args.featured);
    }

    return testimonials.slice(0, args.limit || 100);
  },
});

export const getApprovedTestimonials = query({
  args: {
    category: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let testimonials = await ctx.db.query("testimonials").collect();

    // Filter for approved testimonials
    testimonials = testimonials.filter((t) => t.status === "approved");

    // Apply additional filters
    if (args.category) {
      testimonials = testimonials.filter((t) => t.category === args.category);
    }

    if (args.featured !== undefined) {
      testimonials = testimonials.filter((t) => t.featured === args.featured);
    }

    // Sort by creation date (newest first)
    testimonials.sort((a, b) => b.createdAt - a.createdAt);

    return testimonials.slice(0, args.limit || 20);
  },
});

export const updateTestimonial = mutation({
  args: {
    testimonialId: v.id("testimonials"),
    customerName: v.optional(v.string()),
    customerEmail: v.optional(v.string()),
    content: v.optional(v.string()),
    rating: v.optional(v.number()),
    category: v.optional(v.string()),
    featured: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Not authenticated");
    }

    const user = await getUser(ctx, identity.tokenIdentifier);
    if (user.role !== "admin") {
      throw new ConvexError("Not authorized");
    }

    const { testimonialId, ...updateData } = args;

    await ctx.db.patch(testimonialId, updateData);
  },
});

export const updateTestimonialStatus = mutation({
  args: {
    testimonialId: v.id("testimonials"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Not authenticated");
    }

    const user = await getUser(ctx, identity.tokenIdentifier);
    if (user.role !== "admin") {
      throw new ConvexError("Not authorized");
    }

    await ctx.db.patch(args.testimonialId, {
      status: args.status,
    });
  },
});

export const deleteTestimonial = mutation({
  args: { testimonialId: v.id("testimonials") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Not authenticated");
    }

    const user = await getUser(ctx, identity.tokenIdentifier);
    if (user.role !== "admin") {
      throw new ConvexError("Not authorized");
    }

    await ctx.db.delete(args.testimonialId);
  },
});