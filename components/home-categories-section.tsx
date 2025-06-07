"use client";

import { usePreloadedQuery } from "convex/react";
import { CategoryCard } from "@/components/category-card";
import { SectionHeading } from "@/components/section-heading";
import type { Preloaded } from "convex/react";
import type { api } from "@/convex/_generated/api";

interface HomeCategoriesSectionProps {
  preloadedCategories: Preloaded<typeof api.categories.getActiveCategories>;
}

export function HomeCategoriesSection({
  preloadedCategories,
}: HomeCategoriesSectionProps) {
  const categories = usePreloadedQuery(preloadedCategories);

  if (!categories || categories.length === 0) {
    return null;
  }

  // Show only first 3 categories on homepage
  const displayCategories = categories.slice(0, 3);

  return (
    <section className="pt-16 pb-4 md:pb-8 px-3 md:px-10 bg-gradient-to-b from-white to-amber-50/30">
      <div className="container">
        <SectionHeading
          title="Our Collections"
          subtitle="Explore our carefully curated furniture collections"
        />
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {displayCategories.map((category) => (
            <CategoryCard
              key={category._id}
              title={category.name}
              description={category.description}
              image={category.image}
              href={`/products?category=${category.slug}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
