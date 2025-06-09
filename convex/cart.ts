import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUser } from "./users";

export const addToCart = mutation({
  args: {
    productId: v.id("products"),
    quantity: v.number(),
    color: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Not authenticated");
    }

    const user = await getUser(ctx, identity.tokenIdentifier);

    // Check if item already exists in cart
    const existingItem = await ctx.db
      .query("cart")
      .withIndex("by_user_product", (q) =>
        q.eq("userId", user._id).eq("productId", args.productId)
      )
      .filter((q) => q.eq(q.field("color"), args.color))
      .first();

    if (existingItem) {
      // Update quantity
      await ctx.db.patch(existingItem._id, {
        quantity: existingItem.quantity + args.quantity,
      });
      return existingItem._id;
    } else {
      // Add new item
      const cartItemId = await ctx.db.insert("cart", {
        userId: user._id,
        productId: args.productId,
        quantity: args.quantity,
        color: args.color,
        createdAt: Date.now(),
      });
      return cartItemId;
    }
  },
});

export const getCartItems = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const user = await getUser(ctx, identity.tokenIdentifier);

    const cartItems = await ctx.db
      .query("cart")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    // Get product details for each cart item and convert storage IDs to URLs
    const itemsWithProducts = await Promise.all(
      cartItems.map(async (item) => {
        const product = await ctx.db.get(item.productId);

        if (product && product.images) {
          // Convert storage IDs to URLs
          const imageUrls = await Promise.all(
            product.images.map(async (image) => {
              // Check if it's a storage ID (starts with 'kg')
              if (typeof image === "string" && image.startsWith("kg")) {
                try {
                  const url = await ctx.storage.getUrl(image as string);
                  return url;
                } catch (error) {
                  console.error("Error getting image URL:", error);
                  return null;
                }
              }
              // If it's already a URL, return as is
              return image;
            })
          );

          // Filter out any null URLs
          const validImageUrls = imageUrls.filter((url) => url !== null);

          return {
            ...item,
            product: {
              ...product,
              images: validImageUrls,
            },
          };
        }

        return {
          ...item,
          product,
        };
      })
    );

    return itemsWithProducts;
  },
});

export const updateCartItemQuantity = mutation({
  args: {
    cartItemId: v.id("cart"),
    quantity: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Not authenticated");
    }

    const user = await getUser(ctx, identity.tokenIdentifier);

    const cartItem = await ctx.db.get(args.cartItemId);
    if (!cartItem || cartItem.userId !== user._id) {
      throw new ConvexError("Cart item not found or not authorized");
    }

    if (args.quantity <= 0) {
      await ctx.db.delete(args.cartItemId);
    } else {
      await ctx.db.patch(args.cartItemId, {
        quantity: args.quantity,
      });
    }
  },
});

export const removeFromCart = mutation({
  args: { cartItemId: v.id("cart") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Not authenticated");
    }

    const user = await getUser(ctx, identity.tokenIdentifier);

    const cartItem = await ctx.db.get(args.cartItemId);
    if (!cartItem || cartItem.userId !== user._id) {
      throw new ConvexError("Cart item not found or not authorized");
    }

    await ctx.db.delete(args.cartItemId);
  },
});

export const clearCart = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Not authenticated");
    }

    const user = await getUser(ctx, identity.tokenIdentifier);

    const cartItems = await ctx.db
      .query("cart")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    for (const item of cartItems) {
      await ctx.db.delete(item._id);
    }
  },
});
