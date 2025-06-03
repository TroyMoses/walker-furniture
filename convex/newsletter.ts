import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";

// Subscribe to newsletter
export const subscribeToNewsletter = mutation({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    source: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if email already exists
    const existingSubscription = await ctx.db
      .query("newsletter")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existingSubscription) {
      if (existingSubscription.status === "unsubscribed") {
        // Reactivate subscription
        await ctx.db.patch(existingSubscription._id, {
          status: "active",
          name: args.name || existingSubscription.name,
          source: args.source || existingSubscription.source,
        });
        return {
          success: true,
          message: "Welcome back! Your subscription has been reactivated.",
        };
      } else {
        throw new ConvexError("Email is already subscribed to our newsletter");
      }
    }

    // Create new subscription
    await ctx.db.insert("newsletter", {
      email: args.email,
      name: args.name,
      status: "active",
      source: args.source || "unknown",
      createdAt: Date.now(),
    });

    return {
      success: true,
      message: "Successfully subscribed to our newsletter!",
    };
  },
});

// Unsubscribe from newsletter
export const unsubscribeFromNewsletter = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const subscription = await ctx.db
      .query("newsletter")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!subscription) {
      throw new ConvexError("Email not found in our newsletter list");
    }

    await ctx.db.patch(subscription._id, {
      status: "unsubscribed",
    });

    return {
      success: true,
      message: "Successfully unsubscribed from our newsletter",
    };
  },
});

// Get all newsletter subscriptions (admin only)
export const getAllNewsletterSubscriptions = query({
  args: {
    status: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(internal.users.internalGetMe, {});
    if (!user || user.role !== "admin") {
      throw new ConvexError("Only admins can view newsletter subscriptions");
    }

    let subscriptions;
    if (args.status) {
      subscriptions = await ctx.db
        .query("newsletter")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .order("desc")
        .take(args.limit || 1000);
    } else {
      subscriptions = await ctx.db
        .query("newsletter")
        .order("desc")
        .take(args.limit || 1000);
    }
    return subscriptions;
  },
});

// Get newsletter statistics (admin only)
export const getNewsletterStats = query({
  args: {},
  handler: async (ctx) => {
    const user = await ctx.runQuery(internal.users.internalGetMe, {});
    if (!user || user.role !== "admin") {
      throw new ConvexError("Only admins can view newsletter statistics");
    }

    const allSubscriptions = await ctx.db.query("newsletter").collect();

    const activeSubscriptions = allSubscriptions.filter(
      (sub) => sub.status === "active"
    );
    const unsubscribed = allSubscriptions.filter(
      (sub) => sub.status === "unsubscribed"
    );

    // Get subscriptions by source
    const sourceStats = activeSubscriptions.reduce(
      (acc, sub) => {
        const source = sub.source || "unknown";
        acc[source] = (acc[source] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    // Get recent subscriptions (last 30 days)
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const recentSubscriptions = activeSubscriptions.filter(
      (sub) => sub.createdAt > thirtyDaysAgo
    );

    return {
      total: allSubscriptions.length,
      active: activeSubscriptions.length,
      unsubscribed: unsubscribed.length,
      recent: recentSubscriptions.length,
      sourceStats,
    };
  },
});

// Update subscription status (admin only)
export const updateSubscriptionStatus = mutation({
  args: {
    subscriptionId: v.id("newsletter"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(internal.users.internalGetMe, {});
    if (!user || user.role !== "admin") {
      throw new ConvexError("Only admins can update subscription status");
    }

    await ctx.db.patch(args.subscriptionId, {
      status: args.status,
    });
  },
});

// Delete subscription (admin only)
export const deleteSubscription = mutation({
  args: {
    subscriptionId: v.id("newsletter"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(internal.users.internalGetMe, {});
    if (!user || user.role !== "admin") {
      throw new ConvexError("Only admins can delete subscriptions");
    }

    await ctx.db.delete(args.subscriptionId);
  },
});
