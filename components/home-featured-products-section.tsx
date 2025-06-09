"use client";

import { usePreloadedQuery } from "convex/react";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import type { Preloaded } from "convex/react";
import type { api } from "@/convex/_generated/api";

interface HomeFeaturedProductsSectionProps {
  preloadedProducts: Preloaded<typeof api.products.getFeaturedProducts>;
}

export function HomeFeaturedProductsSection({
  preloadedProducts,
}: HomeFeaturedProductsSectionProps) {
  const products = usePreloadedQuery(preloadedProducts);

  if (!products || products.length === 0) {
    return null;
  }

  // Show only first 4 products on homepage
  const displayProducts = products.slice(0, 4);

  return (
    <section
      id="products"
      className="bg-gradient-to-b from-amber-50/30 to-white pt-16 pb-4 md:pb-8 px-3 md:px-10"
    >
      <div className="container">
        <SectionHeading
          title="Featured Products"
          subtitle="Our most popular handcrafted pieces"
        />
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {displayProducts.map((product) => (
            <ProductCard
              key={product._id}
              id={product._id}
              name={product.name}
              price={`UGX ${product.price.toLocaleString("en-UG")}`}
              image={product.images[0] || "/placeholder.png"}
              rating={product.rating}
              category={product.category}
            />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Button variant="outline" className="gap-2 border-amber-800" asChild>
            <Link href="/products">
              View All Products <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
