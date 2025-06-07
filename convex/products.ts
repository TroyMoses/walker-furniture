import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { Id } from "./_generated/dataModel";

export const getAllProducts = query({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db.query("products").collect();

    // Convert image storage IDs to URLs
    const productsWithImageUrls = await Promise.all(
      products.map(async (product) => {
        const imageUrls = await Promise.all(
          (product.images || []).map(async (imageId) => {
            try {
              const url = await ctx.storage.getUrl(imageId as Id<"_storage">);
              return url || "/placeholder.png";
            } catch {
              return "/placeholder.png";
            }
          })
        );
        return {
          ...product,
          images: imageUrls.filter(Boolean) as string[],
        };
      })
    );

    return productsWithImageUrls;
  },
});

// Add a new query to get product with storage IDs for editing
export const getProductForEdit = query({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.productId);
    if (!product) return null;

    // Return product with original storage IDs (not converted to URLs)
    return product;
  },
});

export const getProductById = query({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.productId);
    if (!product) return null;

    // Convert image storage IDs to URLs
    const imageUrls = await Promise.all(
      (product.images || []).map(async (imageId) => {
        try {
          const url = await ctx.storage.getUrl(imageId as Id<"_storage">);
          return url || "/placeholder.png";
        } catch {
          return "/placeholder.png";
        }
      })
    );

    return {
      ...product,
      images: imageUrls.filter(Boolean) as string[],
    };
  },
});

export const getProductsByCategory = query({
  args: {
    category: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("products");

    if (args.category && args.category !== "all") {
      query = query.filter((q) => q.eq(q.field("category"), args.category));
    }

    const products = args.limit
      ? await query.take(args.limit)
      : await query.collect();

    // Convert image storage IDs to URLs
    const productsWithImageUrls = await Promise.all(
      products.map(async (product) => {
        const imageUrls = await Promise.all(
          (product.images || []).map(async (imageId) => {
            try {
              const url = await ctx.storage.getUrl(imageId as Id<"_storage">);
              return url || "/placeholder.png";
            } catch {
              return "/placeholder.png";
            }
          })
        );
        return {
          ...product,
          images: imageUrls.filter(Boolean) as string[],
        };
      })
    );

    return productsWithImageUrls;
  },
});

export const searchProducts = query({
  args: {
    searchTerm: v.optional(v.string()),
    category: v.optional(v.string()),
    minPrice: v.optional(v.number()),
    maxPrice: v.optional(v.number()),
    minRating: v.optional(v.number()),
    sortBy: v.optional(v.string()),
    inStock: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let products = await ctx.db.query("products").collect();

    // Filter by search term
    if (args.searchTerm && args.searchTerm.trim()) {
      const searchLower = args.searchTerm.toLowerCase();
      products = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower) ||
          product.category.toLowerCase().includes(searchLower) ||
          (product.features || []).some((feature) =>
            feature.toLowerCase().includes(searchLower)
          )
      );
    }

    // Filter by category
    if (args.category && args.category !== "all") {
      products = products.filter(
        (product) => product.category === args.category
      );
    }

    // Filter by price range
    if (args.minPrice !== undefined) {
      products = products.filter((product) => product.price >= args.minPrice!);
    }
    if (args.maxPrice !== undefined) {
      products = products.filter((product) => product.price <= args.maxPrice!);
    }

    // Filter by minimum rating
    if (args.minRating !== undefined) {
      products = products.filter(
        (product) => (product.rating || 0) >= args.minRating!
      );
    }

    // Filter by stock status
    if (args.inStock !== undefined) {
      products = products.filter((product) => product.inStock === args.inStock);
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
          products.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          break;
        case "newest":
          products.sort((a, b) => b._creationTime - a._creationTime);
          break;
        case "name":
          products.sort((a, b) => a.name.localeCompare(b.name));
          break;
        default:
          // Default sort by featured/bestsellers first, then by name
          products.sort((a, b) => {
            if (a.isBestseller && !b.isBestseller) return -1;
            if (!a.isBestseller && b.isBestseller) return 1;
            return a.name.localeCompare(b.name);
          });
      }
    }

    // Convert image storage IDs to URLs
    const productsWithImageUrls = await Promise.all(
      products.map(async (product) => {
        const imageUrls = await Promise.all(
          (product.images || []).map(async (imageId) => {
            try {
              const url = await ctx.storage.getUrl(imageId as Id<"_storage">);
              return url || "/placeholder.png";
            } catch {
              return "/placeholder.png";
            }
          })
        );
        return {
          ...product,
          images: imageUrls.filter(Boolean) as string[],
        };
      })
    );

    return productsWithImageUrls;
  },
});

export const getFeaturedProducts = query({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db
      .query("products")
      .filter((q) => q.eq(q.field("isBestseller"), true))
      .take(8);

    // Convert image storage IDs to URLs
    const productsWithImageUrls = await Promise.all(
      products.map(async (product) => {
        const imageUrls = await Promise.all(
          (product.images || []).map(async (imageId) => {
            try {
              const url = await ctx.storage.getUrl(imageId as Id<"_storage">);
              return url || "/placeholder.png";
            } catch {
              return "/placeholder.png";
            }
          })
        );
        return {
          ...product,
          images: imageUrls.filter(Boolean) as string[],
        };
      })
    );

    return productsWithImageUrls;
  },
});

export const getCategories = query({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db.query("products").collect();
    const categories = [
      ...new Set(products.map((product) => product.category)),
    ];
    return categories;
  },
});

export const createProduct = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    longDescription: v.string(),
    price: v.number(),
    category: v.string(),
    images: v.array(v.id("_storage")),
    colors: v.array(v.string()),
    specifications: v.array(
      v.object({
        name: v.string(),
        value: v.string(),
      })
    ),
    features: v.array(v.string()),
    care: v.array(v.string()),
    inStock: v.boolean(),
    isNew: v.optional(v.boolean()),
    isBestseller: v.optional(v.boolean()),
    rating: v.optional(v.number()),
    reviewCount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("products", {
      ...args,
      rating: args.rating || 0,
      reviewCount: args.reviewCount || 0,
      isNew: args.isNew || false,
      isBestseller: args.isBestseller || false,
      createdAt: now,
      updatedAt: now,
    });
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
    images: v.optional(v.array(v.id("_storage"))),
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
    inStock: v.optional(v.boolean()),
    isNew: v.optional(v.boolean()),
    isBestseller: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { productId, ...updates } = args;
    return await ctx.db.patch(productId, updates);
  },
});

export const deleteProduct = mutation({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.productId);
  },
});

export const updateProductRating = mutation({
  args: {
    productId: v.id("products"),
    rating: v.number(),
    reviewCount: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.productId, {
      rating: args.rating,
      reviewCount: args.reviewCount,
    });
  },
});
