"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { HeroSection } from "@/components/hero-section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Search, SlidersHorizontal } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [minRating, setMinRating] = useState<number | undefined>(undefined);
  const [sortBy, setSortBy] = useState("featured");

  const products = useQuery(api.products.getAllProducts, {});
  console.log("Product Images:", products?.map(p => p.images));

  console.log("Products fetched:", products);

  const categories = [
    "Living Room",
    "Bedroom",
    "Dining",
    "Office",
    "Outdoor",
    "Storage",
    "Lighting",
    "Decor",
  ];

  if (!products) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50/50 to-white">
        <Header />
        <div className="container py-20 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-64 mx-auto"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 to-white">
      <Header />

      <HeroSection
        title="Our Furniture Collection"
        description="Browse our complete collection of handcrafted furniture pieces designed for comfort, style, and durability."
        imageSrc="/images/bg/bgimg2.jpg"
        primaryButtonText="Order Now"
      />

      <section className="pt-12 pb-2 px-3 md:px-10">
        <div className="container">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <SectionHeading title="All Products" centered={false} />

            <div className="flex items-center gap-4">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <SlidersHorizontal className="h-4 w-4" />
                    <span className="sr-only">Filter</span>
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filter Products</SheetTitle>
                    <SheetDescription>
                      Narrow down your product search with these filters.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 px-3 md:px-4 space-y-6">
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium">Categories</h3>
                      {categories.map((category) => (
                        <div
                          key={category}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`category-${category}`}
                            checked={categoryFilter === category}
                            onCheckedChange={(checked) => {
                              setCategoryFilter(checked ? category : "all");
                            }}
                          />
                          <Label htmlFor={`category-${category}`}>
                            {category}
                          </Label>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-sm font-medium">Price Range</h3>
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        min={0}
                        max={5000}
                        step={100}
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-sm">${priceRange[0]}</span>
                        <span className="text-sm">${priceRange[1]}+</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-sm font-medium">Rating</h3>
                      {[4, 3, 2, 1].map((rating) => (
                        <div
                          key={rating}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`rating-${rating}`}
                            checked={minRating === rating}
                            onCheckedChange={(checked) => {
                              setMinRating(checked ? rating : undefined);
                            }}
                          />
                          <Label htmlFor={`rating-${rating}`}>
                            {rating}+ Stars
                          </Label>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4">
                      <Button
                        className="cursor-pointer w-full bg-amber-800 hover:bg-amber-900"
                        onClick={() => {
                          // Filters are applied automatically through state
                        }}
                      >
                        Apply Filters
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No products found
              </h3>
              <p className="text-gray-600">
                Try adjusting your filters or search terms.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  id={product._id}
                  name={product.name}
                  price={`$${product.price.toFixed(2)}`}
                  image={product.images[0] || "/placeholder.png"}
                  rating={product.rating}
                  category={product.category}
                />
              ))}
            </div>
          )}

          {products.length > 0 && (
            <div className="mt-12 flex justify-center">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" disabled>
                  &lt;
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-amber-800 text-white hover:bg-amber-900"
                >
                  1
                </Button>
                <Button variant="outline" size="icon">
                  2
                </Button>
                <Button variant="outline" size="icon">
                  3
                </Button>
                <Button variant="outline" size="icon">
                  &gt;
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
