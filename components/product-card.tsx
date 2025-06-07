"use client";

import type React from "react";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductRating } from "@/components/product-rating";
import { useCart } from "@/components/cart-provider";
import type { Id } from "@/convex/_generated/dataModel";

interface ProductCardProps {
  id: string;
  name: string;
  price: string;
  image: string;
  rating: number;
  category?: string;
}

export function ProductCard({
  id,
  name,
  price,
  image,
  rating,
  category,
}: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart({
      productId: id as Id<"products">,
      quantity: 1,
    });
  };

  // Ensure we have a valid image URL
  const imageUrl = image && image !== "" ? image : "/placeholder.png";

  return (
    <div className="group overflow-hidden rounded-lg bg-gradient-to-b from-white to-amber-50 shadow-md transition-all hover:shadow-lg">
      <Link href={`/products/${id}`}>
        <div className="relative h-64 overflow-hidden">
          <Image
            src={imageUrl || "/placeholder.png"}
            alt={name}
            width={300}
            height={300}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.png";
            }}
          />
          {category && (
            <div className="absolute top-2 left-2 bg-amber-800 px-2 py-1 text-xs text-white rounded-md">
              {category}
            </div>
          )}
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/products/${id}`}>
          <h3 className="text-lg font-semibold hover:text-amber-800 transition-colors">
            {name}
          </h3>
        </Link>
        <div className="flex items-center justify-between mt-1">
          <p className="text-amber-800 font-medium">{price}</p>
          <ProductRating rating={rating} />
        </div>
        <Button
          className="mt-4 w-full bg-amber-800 hover:bg-amber-900 cursor-pointer"
          onClick={handleAddToCart}
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
