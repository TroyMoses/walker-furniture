import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getAllProducts = query({
  args: {
    category: v.optional(v.string()),
    minPrice: v.optional(v.number()),
    maxPrice: v.optional(v.number()),
    minRating: v.optional(v.number()),
    search: v.optional(v.string()),
    sortBy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let products = await ctx.db.query("products").collect();

    // Filter by category
    if (args.category && args.category !== "all") {
      products = products.filter(
        (product) =>
          product.category.toLowerCase() === args.category?.toLowerCase()
      );
    }

    // Filter by price range
    if (args.minPrice !== undefined) {
      products = products.filter((product) => product.price >= args.minPrice!);
    }
    if (args.maxPrice !== undefined) {
      products = products.filter((product) => product.price <= args.maxPrice!);
    }

    // Filter by rating
    if (args.minRating !== undefined) {
      products = products.filter(
        (product) => product.rating >= args.minRating!
      );
    }

    // Search functionality
    if (args.search) {
      const searchTerm = args.search.toLowerCase();
      products = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm) ||
          product.category.toLowerCase().includes(searchTerm) ||
          product.features.some((feature) =>
            feature.toLowerCase().includes(searchTerm)
          )
      );
    }

    // Sort products
    if (args.sortBy) {
      switch (args.sortBy) {
        case "price-low":
          products.sort((a, b) => a.price - b.price);
          break;
        case "price-high":
          products.sort((a, b) => b.price - a.price);
          break;
        case "rating":
          products.sort((a, b) => b.rating - a.rating);
          break;
        case "newest":
          products.sort((a, b) => b.createdAt - a.createdAt);
          break;
        default:
          // Featured - sort by bestseller, then rating
          products.sort((a, b) => {
            if (a.isBestseller && !b.isBestseller) return -1;
            if (!a.isBestseller && b.isBestseller) return 1;
            return b.rating - a.rating;
          });
      }
    }

    return products;
  },
});

export const getProductById = query({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.productId);
    if (!product) {
      throw new ConvexError("Product not found");
    }
    return product;
  },
});

export const getProductByName = query({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const products = await ctx.db.query("products").collect();
    const product = products.find(
      (p) =>
        p.name.toLowerCase().replace(/\s+/g, "-") === args.name.toLowerCase()
    );
    return product;
  },
});

export const getFeaturedProducts = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const products = await ctx.db.query("products").collect();
    const featured = products
      .filter((product) => product.isBestseller || product.isNew)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, args.limit || 8);

    return featured;
  },
});

export const getProductsByCategory = query({
  args: { category: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const products = await ctx.db
      .query("products")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .take(args.limit || 20);

    return products;
  },
});

export const createProduct = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    longDescription: v.string(),
    price: v.number(),
    category: v.string(),
    rating: v.number(),
    reviewCount: v.number(),
    inStock: v.boolean(),
    isNew: v.boolean(),
    isBestseller: v.boolean(),
    images: v.array(v.string()),
    colors: v.array(v.string()),
    specifications: v.array(
      v.object({
        name: v.string(),
        value: v.string(),
      })
    ),
    features: v.array(v.string()),
    care: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .first();

    if (!user || user.role !== "admin") {
      throw new ConvexError("Not authorized");
    }

    const now = Date.now();

    const productId = await ctx.db.insert("products", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });

    return productId;
  },
});

export const updateProduct = mutation({
  args: {
    productId: v.id("products"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    longDescription: v.optional(v.string()),
    price: v.optional(v.number()),
    category: v.optional(v.string()),
    rating: v.optional(v.number()),
    reviewCount: v.optional(v.number()),
    inStock: v.optional(v.boolean()),
    isNew: v.optional(v.boolean()),
    isBestseller: v.optional(v.boolean()),
    images: v.optional(v.array(v.string())),
    colors: v.optional(v.array(v.string())),
    specifications: v.optional(
      v.array(
        v.object({
          name: v.string(),
          value: v.string(),
        })
      )
    ),
    features: v.optional(v.array(v.string())),
    care: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .first();

    if (!user || user.role !== "admin") {
      throw new ConvexError("Not authorized");
    }

    const { productId, ...updateData } = args;

    await ctx.db.patch(productId, {
      ...updateData,
      updatedAt: Date.now(),
    });

    return productId;
  },
});

export const deleteProduct = mutation({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .first();

    if (!user || user.role !== "admin") {
      throw new ConvexError("Not authorized");
    }

    await ctx.db.delete(args.productId);
  },
});
