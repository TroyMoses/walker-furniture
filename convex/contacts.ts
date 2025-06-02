import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUser } from "./users";

export const createContact = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    subject: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const contactId = await ctx.db.insert("contacts", {
      ...args,
      status: "new",
      createdAt: Date.now(),
    });

    return contactId;
  },
});

export const getAllContacts = query({
  args: {
    status: v.optional(v.string()),
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

    const contactsQueryInitializer = ctx.db.query("contacts");

    let query;
    if (args.status) {
      query = contactsQueryInitializer.withIndex("by_status", (q) =>
        q.eq("status", args.status as string)
      );
    } else {
      query = contactsQueryInitializer;
    }

    const contacts = await query.order("desc").take(args.limit || 100);

    return contacts;
  },
});

export const updateContactStatus = mutation({
  args: {
    contactId: v.id("contacts"),
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

    await ctx.db.patch(args.contactId, {
      status: args.status,
    });
  },
});
