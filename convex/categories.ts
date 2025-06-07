import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getAllCategories = query({
  args: {},
  handler: async (ctx) => {
    const categories = await ctx.db
      .query("categories")
      .withIndex("by_display_order")
      .collect();

    // Convert image storage IDs to URLs
    const categoriesWithImageUrls = await Promise.all(
      categories.map(async (category) => {
        try {
          const imageUrl = await ctx.storage.getUrl(category.image);
          return {
            ...category,
            image: imageUrl || "/placeholder.png",
          };
        } catch {
          return {
            ...category,
            image: "/placeholder.png",
          };
        }
      })
    );

    return categoriesWithImageUrls;
  },
});

export const getActiveCategories = query({
  args: {},
  handler: async (ctx) => {
    const categories = await ctx.db
      .query("categories")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();

    // Sort by display order
    categories.sort((a, b) => a.displayOrder - b.displayOrder);

    // Convert image storage IDs to URLs
    const categoriesWithImageUrls = await Promise.all(
      categories.map(async (category) => {
        try {
          const imageUrl = await ctx.storage.getUrl(category.image);
          return {
            ...category,
            image: imageUrl || "/placeholder.png",
          };
        } catch {
          return {
            ...category,
            image: "/placeholder.png",
          };
        }
      })
    );

    return categoriesWithImageUrls;
  },
});

export const getCategoryForEdit = query({
  args: { categoryId: v.id("categories") },
  handler: async (ctx, args) => {
    const category = await ctx.db.get(args.categoryId);
    if (!category) return null;

    // Return category with original storage ID (not converted to URL)
    return category;
  },
});

export const createCategory = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    slug: v.string(),
    image: v.id("_storage"),
    displayOrder: v.number(),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("categories", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateCategory = mutation({
  args: {
    categoryId: v.id("categories"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    slug: v.optional(v.string()),
    image: v.optional(v.id("_storage")),
    displayOrder: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { categoryId, ...updates } = args;
    const now = Date.now();
    return await ctx.db.patch(categoryId, {
      ...updates,
      updatedAt: now,
    });
  },
});

export const deleteCategory = mutation({
  args: { categoryId: v.id("categories") },
  handler: async (ctx, args) => {
    // Check if any products use this category
    const productsWithCategory = await ctx.db
      .query("products")
      .filter((q) => q.eq(q.field("category"), args.categoryId))
      .first();

    if (productsWithCategory) {
      throw new Error(
        "Cannot delete category that has products assigned to it"
      );
    }

    return await ctx.db.delete(args.categoryId);
  },
});

export const getCategoryBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const category = await ctx.db
      .query("categories")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (!category) return null;

    try {
      const imageUrl = await ctx.storage.getUrl(category.image);
      return {
        ...category,
        image: imageUrl || "/placeholder.png",
      };
    } catch {
      return {
        ...category,
        image: "/placeholder.png",
      };
    }
  },
});
