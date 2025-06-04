import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    tokenIdentifier: v.string(),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    role: v.optional(v.string()),
  }).index("by_tokenIdentifier", ["tokenIdentifier"]),

  products: defineTable({
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
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_category", ["category"])
    .index("by_rating", ["rating"])
    .index("by_price", ["price"]),

  orders: defineTable({
    userId: v.id("users"),
    items: v.array(
      v.object({
        productId: v.id("products"),
        quantity: v.number(),
        price: v.number(),
        color: v.optional(v.string()),
      })
    ),
    totalAmount: v.number(),
    status: v.string(), // "pending", "processing", "completed", "cancelled"
    customerInfo: v.object({
      name: v.string(),
      email: v.string(),
      phone: v.optional(v.string()),
      address: v.optional(v.string()),
    }),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_created_at", ["createdAt"]),

  cart: defineTable({
    userId: v.id("users"),
    productId: v.id("products"),
    quantity: v.number(),
    color: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_product", ["userId", "productId"]),

  reviews: defineTable({
    productId: v.id("products"),
    productName: v.string(),
    userId: v.id("users"),
    customerName: v.string(),
    customerEmail: v.string(),
    rating: v.number(),
    title: v.string(),
    comment: v.string(),
    verified: v.boolean(),
    status: v.string(), // "pending", "approved", "rejected"
    helpfulVotes: v.number(),
    unhelpfulVotes: v.number(),
    createdAt: v.number(),
  })
    .index("by_product", ["productId"])
    .index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_rating", ["rating"]),

  testimonials: defineTable({
    userId: v.optional(v.id("users")),
    customerName: v.string(),
    customerEmail: v.string(),
    content: v.string(),
    rating: v.number(),
    category: v.string(),
    featured: v.boolean(),
    status: v.string(), // "pending", "approved", "rejected"
    createdAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_category", ["category"])
    .index("by_featured", ["featured"])
    .index("by_created_at", ["createdAt"]),

  contacts: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    subject: v.string(),
    message: v.string(),
    status: v.string(), // "new", "read", "responded", "closed"
    createdAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_created_at", ["createdAt"]),

    newsletter: defineTable({
    email: v.string(),
    name: v.optional(v.string()),
    status: v.string(), // "active", "unsubscribed"
    source: v.optional(v.string()), // "footer", "popup", "page"
    createdAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_status", ["status"])
    .index("by_created_at", ["createdAt"]),
});
