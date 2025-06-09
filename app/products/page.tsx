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
import { Search, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useMemo, useEffect } from "react";

export default function ProductsPage() {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [minRating, setMinRating] = useState<number | undefined>(undefined);
  const [sortBy, setSortBy] = useState("featured");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Debounce search input
  useEffect(() => {
    setIsSearching(true);
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchInput);
      setIsSearching(false);
    }, 1300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Search products with debounced search term
  const products = useQuery(api.products.searchProducts, {
    searchTerm: debouncedSearchTerm || undefined,
    category: categoryFilter !== "all" ? categoryFilter : undefined,
    minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
    maxPrice: priceRange[1] < 5000 ? priceRange[1] : undefined,
    minRating: minRating,
    sortBy: sortBy !== "featured" ? sortBy : undefined,
    inStock: inStockOnly ? true : undefined,
  });

  // Calculate active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (categoryFilter !== "all") count++;
    if (priceRange[0] > 0 || priceRange[1] < 5000) count++;
    if (minRating !== undefined) count++;
    if (inStockOnly) count++;
    return count;
  }, [categoryFilter, priceRange, minRating, inStockOnly]);

  // Clear all filters
  const clearAllFilters = () => {
    setCategoryFilter("all");
    setPriceRange([0, 5000]);
    setMinRating(undefined);
    setInStockOnly(false);
    setSearchInput("");
    setDebouncedSearchTerm("");
    setSortBy("featured");
  };

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
                {isSearching && (
                  <Loader2 className="absolute right-2.5 top-2.5 h-4 w-4 text-gray-500 animate-spin" />
                )}
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="pl-8 pr-8"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>

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
                  <SelectItem value="name">Name A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {products.length === 0
                ? "No products found"
                : `Showing ${products.length} product${products.length !== 1 ? "s" : ""}`}
              {debouncedSearchTerm && ` for "${debouncedSearchTerm}"`}
              {categoryFilter !== "all" && ` in ${categoryFilter}`}
            </p>

            {(debouncedSearchTerm || activeFiltersCount > 0) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-amber-800 hover:text-amber-900"
              >
                Clear all filters
              </Button>
            )}
          </div>

          {products.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No products found
              </h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your filters or search terms.
              </p>
              <Button
                onClick={clearAllFilters}
                className="bg-amber-800 hover:bg-amber-900"
              >
                Clear All Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
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
          )}

          {/* Pagination - You can implement this later */}
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
                <Button variant="outline" size="icon" disabled>
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
