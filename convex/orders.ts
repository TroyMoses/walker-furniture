import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUser } from "./users";

export const createOrder = mutation({
  args: {
    items: v.array(
      v.object({
        productId: v.id("products"),
        quantity: v.number(),
        price: v.number(),
        color: v.optional(v.string()),
      })
    ),
    customerInfo: v.object({
      name: v.string(),
      email: v.string(),
      phone: v.optional(v.string()),
      address: v.optional(v.string()),
    }),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Not authenticated");
    }

    const user = await getUser(ctx, identity.tokenIdentifier);

    const totalAmount = args.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const now = Date.now();

    const orderId = await ctx.db.insert("orders", {
      userId: user._id,
      items: args.items,
      totalAmount,
      status: "pending",
      customerInfo: args.customerInfo,
      notes: args.notes,
      createdAt: now,
      updatedAt: now,
    });

    // Clear user's cart after order is placed
    const cartItems = await ctx.db
      .query("cart")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    for (const item of cartItems) {
      await ctx.db.delete(item._id);
    }

    return orderId;
  },
});

export const getUserOrders = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const user = await getUser(ctx, identity.tokenIdentifier);

    const orders = await ctx.db
      .query("orders")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();

    // Get product details for each order
    const ordersWithProducts = await Promise.all(
      orders.map(async (order) => {
        const itemsWithProducts = await Promise.all(
          order.items.map(async (item) => {
            const product = await ctx.db.get(item.productId);

            // Convert storage IDs to URLs for images
            let productWithUrls = product;
            if (product && product.images) {
              const imageUrls = await Promise.all(
                product.images.map(async (imageId) => {
                  if (typeof imageId === "string" && imageId.startsWith("kg")) {
                    // This is a storage ID, convert to URL
                    return await ctx.storage.getUrl(imageId as string);
                  }
                  // This is already a URL
                  return imageId;
                })
              );

              productWithUrls = {
                ...product,
                images: imageUrls.filter(Boolean) as string[],
              };
            }

            return {
              ...item,
              product: productWithUrls,
            };
          })
        );

        return {
          ...order,
          items: itemsWithProducts,
        };
      })
    );

    return ordersWithProducts;
  },
});

export const getAllOrders = query({
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

    const ordersQueryInitializer = ctx.db.query("orders");
    let query;
    if (args.status) {
      query = ordersQueryInitializer.withIndex("by_status", (q) =>
        q.eq("status", args.status as string)
      );
    } else {
      query = ordersQueryInitializer;
    }

    const orders = await query.order("desc").take(args.limit || 100);

    // Get product and user details for each order
    const ordersWithDetails = await Promise.all(
      orders.map(async (order) => {
        const customer = await ctx.db.get(order.userId);
        const itemsWithProducts = await Promise.all(
          order.items.map(async (item) => {
            const product = await ctx.db.get(item.productId);

            // Convert storage IDs to URLs for images
            let productWithUrls = product;
            if (product && product.images) {
              const imageUrls = await Promise.all(
                product.images.map(async (imageId) => {
                  if (typeof imageId === "string" && imageId.startsWith("kg")) {
                    // This is a storage ID, convert to URL
                    return await ctx.storage.getUrl(imageId as string);
                  }
                  // This is already a URL
                  return imageId;
                })
              );

              productWithUrls = {
                ...product,
                images: imageUrls.filter(Boolean) as string[],
              };
            }

            return {
              ...item,
              product: productWithUrls,
            };
          })
        );

        return {
          ...order,
          customer,
          items: itemsWithProducts,
        };
      })
    );

    return ordersWithDetails;
  },
});

export const updateOrderStatus = mutation({
  args: {
    orderId: v.id("orders"),
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

    await ctx.db.patch(args.orderId, {
      status: args.status,
      updatedAt: Date.now(),
    });
  },
});
