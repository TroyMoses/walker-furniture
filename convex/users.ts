import { ConvexError, v } from "convex/values";
import {
  type MutationCtx,
  type QueryCtx,
  internalMutation,
  query,
} from "./_generated/server";

export async function getUser(
  ctx: QueryCtx | MutationCtx,
  tokenIdentifier: string
) {
  const user = await ctx.db
    .query("users")
    .withIndex("by_tokenIdentifier", (q) =>
      q.eq("tokenIdentifier", tokenIdentifier)
    )
    .first();

  if (!user) {
    throw new ConvexError("expected user to be defined");
  }

  return user;
}

export const createUser = internalMutation({
  args: {
    tokenIdentifier: v.string(),
    name: v.string(),
    image: v.string(),
    email: v.string(),
    role: v.optional(v.string()),
  },
  async handler(ctx, args) {
    await ctx.db.insert("users", {
      tokenIdentifier: args.tokenIdentifier,
      name: args.name,
      email: args.email,
      role: args.role,
      image: args.image,
    });
  },
});

export const updateUser = internalMutation({
  args: {
    tokenIdentifier: v.string(),
    name: v.string(),
    image: v.string(),
    email: v.string(),
    role: v.optional(v.string()),
  },
  async handler(ctx, args) {
    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", args.tokenIdentifier)
      )
      .first();

    if (!user) {
      throw new ConvexError("no user with this token found");
    }

    await ctx.db.patch(user._id, {
      name: args.name,
      image: args.image,
      email: args.email,
      role: args.role,
    });
  },
});

export const getUserProfile = query({
  args: { userId: v.id("users") },
  async handler(ctx, args) {
    const user = await ctx.db.get(args.userId);

    return {
      name: user?.name,
      image: user?.image,
    };
  },
});

export const getMe = query({
  args: {},
  async handler(ctx) {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      return null;
    }

    const user = await getUser(ctx, identity.tokenIdentifier);

    if (!user) {
      return null;
    }

    return user;
  },
});

// New functions for user management

export const getAllUsers = query({
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();

    // Map the users to the format expected by the UI
    return users.map((user) => ({
      id: user._id,
      name: user.name || "No Name",
      email: user.email || "No Email",
      role: user.role || "No Role",
      tokenIdentifier: user.tokenIdentifier,
      image: user.image,
    }));
  },
});

// Add a new function to get a user by their Clerk ID
export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  async handler(ctx, args) {
    const tokenIdentifier = `https://model-wombat-12.clerk.accounts.dev|${args.clerkId}`;

    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", tokenIdentifier)
      )
      .first();

    return user;
  },
});

