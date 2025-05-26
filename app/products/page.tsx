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

export default function ProductsPage() {
  // Mock product data
  const products = [
    {
      id: "oakwood-sofa",
      name: "Oakwood Sofa",
      price: "$1,299",
      image: "/images/couches/couches.jpeg",
      rating: 4.8,
      category: "Living Room",
    },
    {
      id: "maple-dining-table",
      name: "Maple Dining Table",
      price: "$899",
      image: "/images/dining/diningtable3.jpeg",
      rating: 4.5,
      category: "Dining",
    },
    {
      id: "walnut-bed-frame",
      name: "Walnut Bed Frame",
      price: "$1,499",
      image: "/images/beds/bed4.jpeg",
      rating: 4.9,
      category: "Bedroom",
    },
    {
      id: "cherry-bookcase",
      name: "Cherry Wood Bookcase",
      price: "$749",
      image: "/images/library/library.jpeg",
      rating: 4.6,
      category: "Living Room",
    },
    {
      id: "teak-coffee-table",
      name: "Teak Coffee Table",
      price: "$499",
      image: "/images/dining/diningtable3.jpeg",
      rating: 4.3,
      category: "Living Room",
    },
    {
      id: "mahogany-dresser",
      name: "Mahogany Dresser",
      price: "$1,199",
      image: "/images/mirrors/dressingmirror.jpeg",
      rating: 4.7,
      category: "Bedroom",
    },
    {
      id: "oak-dining-chairs",
      name: "Oak Dining Chairs (Set of 4)",
      price: "$799",
      image: "/images/dining/diningtable.jpeg",
      rating: 4.4,
      category: "Dining",
    },
    {
      id: "pine-nightstand",
      name: "Pine Nightstand",
      price: "$349",
      image: "/images/beds/bedlamp.jpeg",
      rating: 4.2,
      category: "Bedroom",
    },
    {
      id: "walnut-chair",
      name: "Walnut Chair",
      price: "$899",
      image: "/images/chairs/chair.jpeg",
      rating: 4.8,
      category: "Office",
    },
    {
      id: "baby-crib",
      name: "Baby Crib",
      price: "$1,099",
      image: "/images/beds/babycrib.jpeg",
      rating: 4.9,
      category: "Living Room",
    },
    {
      id: "teak-outdoor-set",
      name: "Teak Outdoor Dining Set",
      price: "$1,899",
      image: "/images/dining/diningtable.jpeg",
      rating: 4.7,
      category: "Outdoor",
    },
    {
      id: "bamboo-shelf",
      name: "Bamboo Bookshelf",
      price: "$599",
      image: "/images/library/library1.jpeg",
      rating: 4.5,
      category: "Living Room",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 to-white">
      <Header />

      <HeroSection
        title="Our Furniture Collection"
        description="Browse our complete collection of handcrafted furniture pieces designed for comfort, style, and durability."
        imageSrc="/images/bg/bgimg2.jpg"
        primaryButtonText="Shop Now"
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
                      {[
                        "Living Room",
                        "Bedroom",
                        "Dining",
                        "Office",
                        "Outdoor",
                      ].map((category) => (
                        <div
                          key={category}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox id={`category-${category}`} />
                          <Label htmlFor={`category-${category}`}>
                            {category}
                          </Label>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-sm font-medium">Price Range</h3>
                      <Slider
                        defaultValue={[0, 2000]}
                        min={0}
                        max={5000}
                        step={100}
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-sm">$0</span>
                        <span className="text-sm">$5,000+</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-sm font-medium">Rating</h3>
                      {[4, 3, 2, 1].map((rating) => (
                        <div
                          key={rating}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox id={`rating-${rating}`} />
                          <Label htmlFor={`rating-${rating}`}>
                            {rating}+ Stars
                          </Label>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4">
                      <Button className="cursor-pointer w-full bg-amber-800 hover:bg-amber-900">
                        Apply Filters
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              <Select defaultValue="featured">
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

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                image={product.image}
                rating={product.rating}
                category={product.category}
              />
            ))}
          </div>

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
        </div>
      </section>

      <Footer />
    </div>
  );
}
