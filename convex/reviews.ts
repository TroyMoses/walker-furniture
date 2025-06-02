import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUser } from "./users";

export const createReview = mutation({
  args: {
    productId: v.id("products"),
    rating: v.number(),
    title: v.string(),
    comment: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Not authenticated");
    }

    const user = await getUser(ctx, identity.tokenIdentifier);

    // Get product details
    const product = await ctx.db.get(args.productId);
    if (!product) {
      throw new ConvexError("Product not found");
    }

    // Check if user already reviewed this product
    const existingReview = await ctx.db
      .query("reviews")
      .withIndex("by_product", (q) => q.eq("productId", args.productId))
      .filter((q) => q.eq(q.field("userId"), user._id))
      .first();

    if (existingReview) {
      throw new ConvexError("You have already reviewed this product");
    }

    const reviewId = await ctx.db.insert("reviews", {
      productId: args.productId,
      productName: product.name,
      userId: user._id,
      customerName: user.name || "Anonymous",
      customerEmail: user.email || "",
      rating: args.rating,
      title: args.title,
      comment: args.comment,
      verified: false, // Can be updated based on purchase history
      status: "pending",
      helpfulVotes: 0,
      unhelpfulVotes: 0,
      createdAt: Date.now(),
    });

    return reviewId;
  },
});

export const getProductReviews = query({
  args: {
    productId: v.id("products"),
    status: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("reviews")
      .withIndex("by_product", (q) => q.eq("productId", args.productId));

    if (args.status) {
      query = query.filter((q) => q.eq(q.field("status"), args.status));
    }

    const reviews = await query.order("desc").take(args.limit || 50);

    return reviews;
  },
});

export const getAllReviews = query({
  args: {
    status: v.optional(v.string()),
    rating: v.optional(v.number()),
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

    let reviews;
    if (typeof args.status === "string") {
      reviews = await ctx.db
        .query("reviews")
        .withIndex("by_status", (q) => q.eq("status", args.status as string))
        .order("desc")
        .take(args.limit || 100);
    } else {
      reviews = await ctx.db
        .query("reviews")
        .order("desc")
        .take(args.limit || 100);
    }

    // Filter by rating if specified
    if (args.rating) {
      reviews = reviews.filter((review) => review.rating === args.rating);
    }

    return reviews;
  },
});

export const updateReviewStatus = mutation({
  args: {
    reviewId: v.id("reviews"),
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

    await ctx.db.patch(args.reviewId, {
      status: args.status,
    });
  },
});

export const deleteReview = mutation({
  args: { reviewId: v.id("reviews") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Not authenticated");
    }

    const user = await getUser(ctx, identity.tokenIdentifier);
    if (user.role !== "admin") {
      throw new ConvexError("Not authorized");
    }

    await ctx.db.delete(args.reviewId);
  },
});

export const voteOnReview = mutation({
  args: {
    reviewId: v.id("reviews"),
    voteType: v.union(v.literal("helpful"), v.literal("unhelpful")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Not authenticated");
    }

    const review = await ctx.db.get(args.reviewId);
    if (!review) {
      throw new ConvexError("Review not found");
    }

    const updateData =
      args.voteType === "helpful"
        ? { helpfulVotes: review.helpfulVotes + 1 }
        : { unhelpfulVotes: review.unhelpfulVotes + 1 };

    await ctx.db.patch(args.reviewId, updateData);
  },
});

export const getUserReviews = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const user = await getUser(ctx, identity.tokenIdentifier);

    const reviews = await ctx.db
      .query("reviews")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();

    return reviews;
  },
});
