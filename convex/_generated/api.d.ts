/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as cart from "../cart.js";
import type * as categories from "../categories.js";
import type * as clerk from "../clerk.js";
import type * as contacts from "../contacts.js";
import type * as files from "../files.js";
import type * as http from "../http.js";
import type * as newsletter from "../newsletter.js";
import type * as orders from "../orders.js";
import type * as products from "../products.js";
import type * as reviews from "../reviews.js";
import type * as testimonials from "../testimonials.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  cart: typeof cart;
  categories: typeof categories;
  clerk: typeof clerk;
  contacts: typeof contacts;
  files: typeof files;
  http: typeof http;
  newsletter: typeof newsletter;
  orders: typeof orders;
  products: typeof products;
  reviews: typeof reviews;
  testimonials: typeof testimonials;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
