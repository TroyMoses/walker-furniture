"use client";

import type React from "react";
import { createContext, useContext, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";

interface CartItem {
  _id: Id<"cart">;
  productId: Id<"products">;
  quantity: number;
  color?: string;
  product: {
    _id: Id<"products">;
    name: string;
    price: number;
    images: string[];
    inStock: boolean;
  } | null;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: {
    productId: Id<"products">;
    quantity: number;
    color?: string;
  }) => void;
  removeFromCart: (cartItemId: Id<"cart">) => void;
  updateQuantity: (cartItemId: Id<"cart">, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { isSignedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const cartItems = useQuery(api.cart.getCartItems, isSignedIn ? {} : "skip");
  const addToCartMutation = useMutation(api.cart.addToCart);
  const removeFromCartMutation = useMutation(api.cart.removeFromCart);
  const updateQuantityMutation = useMutation(api.cart.updateCartItemQuantity);
  const clearCartMutation = useMutation(api.cart.clearCart);

  const addToCart = async (item: {
    productId: Id<"products">;
    quantity: number;
    color?: string;
  }) => {
    if (!isSignedIn) {
      toast.error("Please sign in to add items to cart");
      return;
    }

    try {
      setIsLoading(true);
      await addToCartMutation(item);
      toast.success("Item added to cart");
    } catch (error) {
      toast.error("Failed to add item to cart");
      console.error("Add to cart error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (cartItemId: Id<"cart">) => {
    try {
      setIsLoading(true);
      await removeFromCartMutation({ cartItemId });
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error("Failed to remove item from cart");
      console.error("Remove from cart error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (cartItemId: Id<"cart">, quantity: number) => {
    try {
      setIsLoading(true);
      await updateQuantityMutation({ cartItemId, quantity });
    } catch (error) {
      toast.error("Failed to update quantity");
      console.error("Update quantity error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setIsLoading(true);
      await clearCartMutation();
      toast.success("Cart cleared");
    } catch (error) {
      toast.error("Failed to clear cart");
      console.error("Clear cart error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const totalItems =
    cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const totalPrice =
    cartItems?.reduce((sum, item) => {
      if (item.product) {
        return sum + item.product.price * item.quantity;
      }
      return sum;
    }, 0) || 0;

  return (
    <CartContext.Provider
      value={{
        items: cartItems || [],
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
