import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { Id } from "./_generated/dataModel";

export const getAllCategories = query({
  args: {},
  handler: async (ctx) => {
    const categories = await ctx.db.query("categories").order("asc").collect();

    // Convert image storage IDs to URLs and sort by display order
    const categoriesWithImageUrls = await Promise.all(
      categories.map(async (category) => {
        let imageUrl = "/placeholder.svg";
        if (category.image) {
          try {
            const url = await ctx.storage.getUrl(
              category.image as Id<"_storage">
            );
            imageUrl = url || "/placeholder.svg";
          } catch {
            imageUrl = "/placeholder.svg";
          }
        }
        return {
          ...category,
          image: imageUrl,
        };
      })
    );

    // Sort by display order
    return categoriesWithImageUrls.sort(
      (a, b) => a.displayOrder - b.displayOrder
    );
  },
});

export const getActiveCategories = query({
  args: {},
  handler: async (ctx) => {
    const categories = await ctx.db
      .query("categories")
      .filter((q) => q.eq(q.field("isActive"), true))
      .order("asc")
      .collect();

    // Convert image storage IDs to URLs and sort by display order
    const categoriesWithImageUrls = await Promise.all(
      categories.map(async (category) => {
        let imageUrl = "/placeholder.svg";
        if (category.image) {
          try {
            const url = await ctx.storage.getUrl(
              category.image as Id<"_storage">
            );
            imageUrl = url || "/placeholder.svg";
          } catch {
            imageUrl = "/placeholder.svg";
          }
        }
        return {
          ...category,
          image: imageUrl,
        };
      })
    );

    // Sort by display order
    return categoriesWithImageUrls.sort(
      (a, b) => a.displayOrder - b.displayOrder
    );
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

export const getCategoryBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const category = await ctx.db
      .query("categories")
      .filter((q) => q.eq(q.field("slug"), args.slug))
      .filter((q) => q.eq(q.field("isActive"), true))
      .first();

    if (!category) return null;

    // Convert image storage ID to URL
    let imageUrl = "/placeholder.svg";
    if (category.image) {
      try {
        const url = await ctx.storage.getUrl(category.image as Id<"_storage">);
        imageUrl = url || "/placeholder.svg";
      } catch {
        imageUrl = "/placeholder.svg";
      }
    }

    return {
      ...category,
      image: imageUrl,
    };
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
    // Check if slug already exists
    const existingCategory = await ctx.db
      .query("categories")
      .filter((q) => q.eq(q.field("slug"), args.slug))
      .first();

    if (existingCategory) {
      throw new Error("A category with this slug already exists");
    }

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

    // If updating slug, check if it already exists (excluding current category)
    if (updates.slug) {
      const existingCategory = await ctx.db
        .query("categories")
        .filter((q) => q.eq(q.field("slug"), updates.slug))
        .filter((q) => q.neq(q.field("_id"), categoryId))
        .first();

      if (existingCategory) {
        throw new Error("A category with this slug already exists");
      }
    }

    return await ctx.db.patch(categoryId, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

export const deleteCategory = mutation({
  args: { categoryId: v.id("categories") },
  handler: async (ctx, args) => {
    // Check if any products are using this category
    const productsWithCategory = await ctx.db.query("products").collect();

    const category = await ctx.db.get(args.categoryId);
    if (!category) {
      throw new Error("Category not found");
    }

    const hasProducts = productsWithCategory.some(
      (product) => product.category === category.name
    );

    if (hasProducts) {
      throw new Error(
        "Cannot delete category that has products assigned to it"
      );
    }

    return await ctx.db.delete(args.categoryId);
  },
});
