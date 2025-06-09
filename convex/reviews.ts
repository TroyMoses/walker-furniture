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

    const currentReviewCount = product.reviewCount || 0;
    await ctx.db.patch(args.productId, {
      reviewCount: currentReviewCount + 1,
    });

    return reviewId;
  },
});

// Automatically update product review count

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

    const review = await ctx.db.get(args.reviewId);
    if (!review) {
      throw new ConvexError("Review not found");
    }

    const product = await ctx.db.get(review.productId);
    if (!product) {
      throw new ConvexError("Product not found");
    }

    const oldStatus = review.status;
    const newStatus = args.status;

    // Update review status
    await ctx.db.patch(args.reviewId, {
      status: args.status,
    });

    // Update product review count based on status change
    let reviewCountChange = 0;

    // If review was pending and now approved, no change needed (already counted)
    // If review was approved and now rejected, decrease count
    if (oldStatus === "approved" && newStatus === "rejected") {
      reviewCountChange = -1;
    }
    // If review was rejected and now approved, increase count
    else if (oldStatus === "rejected" && newStatus === "approved") {
      reviewCountChange = 1;
    }
    // If review was pending and now rejected, decrease count
    else if (oldStatus === "pending" && newStatus === "rejected") {
      reviewCountChange = -1;
    }

    if (reviewCountChange !== 0) {
      const currentReviewCount = product.reviewCount || 0;
      const newReviewCount = Math.max(
        0,
        currentReviewCount + reviewCountChange
      );

      await ctx.db.patch(review.productId, {
        reviewCount: newReviewCount,
      });
    }
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

    const review = await ctx.db.get(args.reviewId);
    if (!review) {
      throw new ConvexError("Review not found");
    }

    const product = await ctx.db.get(review.productId);
    if (product) {
      // Decrease review count when deleting a review
      const currentReviewCount = product.reviewCount || 0;
      const newReviewCount = Math.max(0, currentReviewCount - 1);

      await ctx.db.patch(review.productId, {
        reviewCount: newReviewCount,
      });
    }

    // Delete all votes for this review
    const votes = await ctx.db
      .query("reviewVotes")
      .withIndex("by_review", (q) => q.eq("reviewId", args.reviewId))
      .collect();

    for (const vote of votes) {
      await ctx.db.delete(vote._id);
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

    const user = await getUser(ctx, identity.tokenIdentifier);

    // Check if user has already voted on this review
    const existingVote = await ctx.db
      .query("reviewVotes")
      .withIndex("by_user_review", (q) =>
        q.eq("userId", user._id).eq("reviewId", args.reviewId)
      )
      .first();

    if (existingVote) {
      // If user is trying to vote the same way, do nothing
      if (existingVote.voteType === args.voteType) {
        throw new ConvexError("You have already voted on this review");
      }

      // If user is changing their vote, update it
      const review = await ctx.db.get(args.reviewId);
      if (!review) {
        throw new ConvexError("Review not found");
      }

      // Update the vote record
      await ctx.db.patch(existingVote._id, {
        voteType: args.voteType,
      });

      // Update review vote counts
      if (
        existingVote.voteType === "helpful" &&
        args.voteType === "unhelpful"
      ) {
        // Changed from helpful to unhelpful
        await ctx.db.patch(args.reviewId, {
          helpfulVotes: Math.max(0, review.helpfulVotes - 1),
          unhelpfulVotes: review.unhelpfulVotes + 1,
        });
      } else if (
        existingVote.voteType === "unhelpful" &&
        args.voteType === "helpful"
      ) {
        // Changed from unhelpful to helpful
        await ctx.db.patch(args.reviewId, {
          helpfulVotes: review.helpfulVotes + 1,
          unhelpfulVotes: Math.max(0, review.unhelpfulVotes - 1),
        });
      }
    } else {
      // User hasn't voted yet, create new vote
      const review = await ctx.db.get(args.reviewId);
      if (!review) {
        throw new ConvexError("Review not found");
      }

      // Create vote record
      await ctx.db.insert("reviewVotes", {
        reviewId: args.reviewId,
        userId: user._id,
        voteType: args.voteType,
        createdAt: Date.now(),
      });

      // Update review vote counts
      const updateData =
        args.voteType === "helpful"
          ? { helpfulVotes: review.helpfulVotes + 1 }
          : { unhelpfulVotes: review.unhelpfulVotes + 1 };

      await ctx.db.patch(args.reviewId, updateData);
    }
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

export const getUserVoteForReview = query({
  args: { reviewId: v.id("reviews") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const user = await getUser(ctx, identity.tokenIdentifier);

    const vote = await ctx.db
      .query("reviewVotes")
      .withIndex("by_user_review", (q) =>
        q.eq("userId", user._id).eq("reviewId", args.reviewId)
      )
      .first();

    return vote?.voteType || null;
  },
});
