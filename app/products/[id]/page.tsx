"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import Link from "next/link";
import {
  ChevronRight,
  Heart,
  Minus,
  Plus,
  Share2,
  ShoppingCart,
  Star,
} from "lucide-react";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SectionHeading } from "@/components/section-heading";
import { ProductCard } from "@/components/product-card";
import { ProductRating } from "@/components/product-rating";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ProductImageGallery } from "@/components/product-image-gallery";
import { ProductSpecifications } from "@/components/product-specifications";
import { ProductReviews } from "@/components/product-reviews";
import { useCart } from "@/components/cart-provider";
import { useState } from "react";
import { useParams } from "next/navigation";

export default function ProductPage() {
  const params = useParams();
  const productId = params.id as string;
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const product = useQuery(api.products.getProductById, {
    productId: productId as Id<"products">,
  });

  const relatedProducts = useQuery(api.products.getProductsByCategory, {
    category: product?.category || "",
    limit: 4,
  });

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50/50 to-white">
        <Header />
        <div className="container py-20 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-48 mx-auto"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      productId: product._id,
      quantity,
      color: selectedColor || product.colors[0],
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 to-white">
      <Header />

      <div className="container py-8 px-3 md:px-12">
        {/* Breadcrumbs */}
        <div className="mb-6 flex items-center text-sm text-gray-500">
          <Link href="/" className="hover:text-amber-800">
            Home
          </Link>
          <ChevronRight className="mx-2 h-4 w-4" />
          <Link href="/products" className="hover:text-amber-800">
            Products
          </Link>
          <ChevronRight className="mx-2 h-4 w-4" />
          <Link
            href={`/products?category=${product.category.toLowerCase().replace(" ", "-")}`}
            className="hover:text-amber-800"
          >
            {product.category}
          </Link>
          <ChevronRight className="mx-2 h-4 w-4" />
          <span className="text-gray-700">{product.name}</span>
        </div>

        {/* Product Overview */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Product Images */}
          <ProductImageGallery
            images={product.images}
            productName={product.name}
          />

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="mb-2 flex items-center gap-3">
              {product.isNew && (
                <Badge className="bg-blue-500 hover:bg-blue-600">New</Badge>
              )}
              {product.isBestseller && (
                <Badge className="bg-amber-800 hover:bg-amber-900">
                  Bestseller
                </Badge>
              )}
              <span className="text-sm text-gray-500">
                SKU: {product._id.slice(-8).toUpperCase()}
              </span>
            </div>

            <h1 className="mb-2 text-3xl font-bold">{product.name}</h1>

            <div className="mb-4 flex items-center gap-3">
              <ProductRating rating={product.rating} showText />
              <Link
                href="#reviews"
                className="text-sm text-amber-800 hover:underline"
              >
                {product.reviewCount} reviews
              </Link>
            </div>

            <div className="mb-6">
              <span className="text-2xl font-bold text-amber-800">
                ${product.price.toFixed(2)}
              </span>
              <span className="ml-2 text-sm text-gray-500">Free shipping</span>
            </div>

            <p className="mb-6 text-gray-700">{product.description}</p>

            {/* Color Selection */}
            {product.colors.length > 0 && (
              <div className="mb-6">
                <h3 className="mb-3 text-sm font-medium">Color</h3>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color, index) => (
                    <button
                      key={index}
                      className={`cursor-pointer rounded-md border border-gray-300 px-4 py-2 text-sm transition-all hover:border-amber-800 ${
                        selectedColor === color ||
                        (selectedColor === "" && index === 0)
                          ? "border-amber-800 bg-amber-50"
                          : ""
                      }`}
                      onClick={() => setSelectedColor(color)}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <h3 className="mb-3 text-sm font-medium">Quantity</h3>
              <div className="flex w-32 items-center">
                <Button
                  variant="outline"
                  size="icon"
                  className="cursor-pointer rounded-r-none"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="flex h-10 w-10 items-center justify-center border-y border-input bg-white">
                  {quantity}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="cursor-pointer rounded-l-none"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  product.inStock
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {product.inStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="mb-6 flex flex-wrap gap-4">
              <Button
                className="cursor-pointer flex-1 gap-2 bg-amber-800 hover:bg-amber-900"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                <ShoppingCart className="h-4 w-4" /> Add to Cart
              </Button>
              <Button className="cursor-pointer" variant="outline" size="icon">
                <Heart className="h-4 w-4" />
              </Button>
              <Button className="cursor-pointer" variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Delivery Info */}
            <div className="rounded-lg bg-gradient-to-r from-amber-50 to-white p-4 shadow-sm">
              <h3 className="mb-2 font-medium">Delivery & Returns</h3>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>Free shipping on orders over $999</li>
                <li>Estimated delivery: 2-3 weeks</li>
                <li>White glove delivery and setup included</li>
                <li>30-day return policy for stock items</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Desktop Product Details Tabs */}
        <div className="hidden md:block mt-16">
          <Tabs defaultValue="description">
            <TabsList className="w-full justify-start border-b bg-transparent p-0">
              <TabsTrigger
                value="description"
                className="cursor-pointer rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-amber-800 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                Description
              </TabsTrigger>
              <TabsTrigger
                value="specifications"
                className="cursor-pointer rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-amber-800 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                Specifications
              </TabsTrigger>
              <TabsTrigger
                value="features"
                className="cursor-pointer rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-amber-800 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                Features
              </TabsTrigger>
              <TabsTrigger
                value="care"
                className="cursor-pointer rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-amber-800 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                Care Instructions
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="cursor-pointer rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-amber-800 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                Reviews ({product.reviewCount})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <div className="max-w-3xl space-y-4 text-gray-700">
                {product.longDescription
                  .split("\n\n")
                  .map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="specifications" className="mt-6">
              <ProductSpecifications specifications={product.specifications} />
            </TabsContent>

            <TabsContent value="features" className="mt-6">
              <div className="max-w-3xl">
                <ul className="space-y-2 text-gray-700">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Star className="mr-2 h-5 w-5 flex-shrink-0 text-amber-800" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="care" className="mt-6">
              <div className="max-w-3xl">
                <ul className="space-y-2 text-gray-700">
                  {product.care.map((instruction, index) => (
                    <li key={index} className="flex items-start">
                      <div className="mr-2 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-800">
                        {index + 1}
                      </div>
                      <span>{instruction}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6" id="reviews">
              <ProductReviews
                productId={product._id}
                rating={product.rating}
                reviewCount={product.reviewCount}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Mobile Product Details Tabs */}
        <div className="block md:hidden mt-16">
          <Tabs defaultValue="description">
            <TabsList className="w-full justify-start border-b bg-transparent p-0">
              <TabsTrigger
                value="description"
                className="rounded-none border-b-2 border-transparent px-2 py-2 data-[state=active]:border-amber-800 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                Description
              </TabsTrigger>
              <TabsTrigger
                value="specifications"
                className="rounded-none border-b-2 border-transparent px-2 py-2 data-[state=active]:border-amber-800 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                Specifications
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="rounded-none border-b-2 border-transparent px-2 py-2 data-[state=active]:border-amber-800 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                Reviews ({product.reviewCount})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <div className="max-w-3xl space-y-4 text-gray-700">
                {product.longDescription
                  .split("\n\n")
                  .map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="specifications" className="mt-6">
              <ProductSpecifications specifications={product.specifications} />
            </TabsContent>

            <TabsContent value="reviews" className="mt-6" id="reviews">
              <ProductReviews
                productId={product._id}
                rating={product.rating}
                reviewCount={product.reviewCount}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <section className="mt-20">
            <SectionHeading
              title="You May Also Like"
              subtitle="Products that complement your selection"
            />

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {relatedProducts
                .filter((relatedProduct) => relatedProduct._id !== product._id)
                .slice(0, 4)
                .map((relatedProduct) => (
                  <ProductCard
                    key={relatedProduct._id}
                    id={relatedProduct._id}
                    name={relatedProduct.name}
                    price={`$${relatedProduct.price.toFixed(2)}`}
                    image={relatedProduct.images[0] || "/placeholder.png"}
                    rating={relatedProduct.rating}
                    category={relatedProduct.category}
                  />
                ))}
            </div>
          </section>
        )}
      </div>

      <Footer />
    </div>
  );
}
