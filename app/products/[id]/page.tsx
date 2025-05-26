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

// This would normally come from a database or API
const getProductData = (id: string) => {
  // Mock product data
  const products = {
    "oakwood-sofa": {
      id: "oakwood-sofa",
      name: "Oakwood Sofa",
      price: "$1,299",
      description:
        "The Oakwood Sofa combines timeless design with exceptional comfort. Handcrafted with solid oak frame and premium upholstery, this sofa will be the centerpiece of your living room for years to come.",
      longDescription:
        "Our Oakwood Sofa is the perfect blend of traditional craftsmanship and modern comfort. Each sofa is meticulously handcrafted by our master woodworkers using solid oak that's been kiln-dried to prevent warping and ensure longevity. The frame is assembled using traditional joinery techniques, reinforced for durability without sacrificing the elegant profile.\n\nThe cushions feature a high-resilience foam core wrapped in a layer of down-alternative fiber for a perfect balance of support and softness. The premium upholstery fabric is available in multiple colors and is treated for stain resistance while maintaining a luxurious feel.\n\nWith its timeless design, the Oakwood Sofa complements both traditional and contemporary interiors, making it a versatile addition to any home. The slightly angled back and perfectly proportioned seat depth ensure optimal comfort for both sitting and lounging.",
      rating: 4.8,
      reviewCount: 124,
      category: "Living Room",
      inStock: true,
      isNew: false,
      isBestseller: true,
      images: [
        "/images/couches/couches.jpeg",
        "/images/couches/couch$tvstand.jpeg",
        "/images/couches/couches.jpeg",
        "/images/couches/couch$tvstand.jpeg",
        "/images/couches/couches.jpeg",
      ],
      colors: ["Charcoal", "Navy Blue", "Beige", "Light Gray"],
      specifications: [
        { name: "Dimensions", value: '84"W x 38"D x 34"H' },
        { name: "Seat Height", value: "18 inches" },
        { name: "Frame Material", value: "Solid Oak" },
        { name: "Upholstery", value: "Premium Polyester Blend" },
        {
          name: "Cushion Fill",
          value: "High-resilience Foam with Down-alternative Wrap",
        },
        { name: "Leg Finish", value: "Natural Oak" },
        { name: "Weight Capacity", value: "800 lbs" },
        { name: "Assembly", value: "Minimal Assembly Required (Legs Only)" },
      ],
      features: [
        "Handcrafted solid oak frame",
        "Premium stain-resistant upholstery",
        "High-resilience foam cushions with down-alternative wrap",
        "Traditional mortise and tenon joinery",
        "Removable and reversible seat cushions",
        "Includes two matching accent pillows",
        "5-year warranty on frame and springs",
      ],
      care: [
        "Vacuum regularly using low suction",
        "Rotate cushions weekly for even wear",
        "Spot clean spills immediately with a clean, dry cloth",
        "Professional cleaning recommended annually",
        "Keep away from direct sunlight to prevent fading",
        "Use furniture protectors under legs to prevent floor damage",
      ],
    },
    "maple-dining-table": {
      id: "maple-dining-table",
      name: "Maple Dining Table",
      price: "$899",
      description:
        "Our Maple Dining Table features a stunning solid maple top with a live edge design that showcases the natural beauty of the wood. Perfect for family gatherings and entertaining guests.",
      longDescription:
        "The Maple Dining Table is a testament to the natural beauty of solid maple wood. Each table features a unique live edge design that preserves the organic character of the tree, making every piece one-of-a-kind. Our craftsmen carefully select premium maple slabs, ensuring beautiful grain patterns and coloration.\n\nThe tabletop is hand-finished with multiple layers of our eco-friendly, food-safe finish that enhances the wood's natural color while providing excellent protection against spills and scratches. The sturdy steel base provides exceptional stability while maintaining a light, airy appearance that complements the substantial wooden top.\n\nDesigned to be both a functional dining surface and a striking centerpiece, this table comfortably seats six people while making a statement in any dining space. The combination of natural wood and modern metal creates a versatile piece that works in both contemporary and transitional interiors.",
      rating: 4.5,
      reviewCount: 86,
      category: "Dining",
      inStock: true,
      isNew: true,
      isBestseller: false,
      images: [
        "/images/dining/diningtable3.jpeg",
        "/images/dining/diningtable.jpeg",
        "/images/dining/diningtable2.jpeg",
        "/images/dining/diningtable3.jpeg",
      ],
      colors: ["Natural", "Walnut Stain", "Ebony"],
      specifications: [
        { name: "Dimensions", value: '72"L x 36"W x 30"H' },
        { name: "Top Material", value: "Solid Maple" },
        { name: "Base Material", value: "Powder-coated Steel" },
        { name: "Top Thickness", value: "1.75 inches" },
        { name: "Edge Type", value: "Live Edge" },
        { name: "Seating Capacity", value: "6 People" },
        { name: "Weight", value: "120 lbs" },
        { name: "Assembly", value: "Partial Assembly Required" },
      ],
      features: [
        "Solid maple top with unique live edge",
        "Eco-friendly, food-safe finish",
        "Sturdy powder-coated steel base",
        "Each piece is one-of-a-kind due to natural wood variations",
        "Seats 6 people comfortably",
        "Handcrafted in our local workshop",
        "5-year warranty",
      ],
      care: [
        "Clean with a soft, damp cloth",
        "Wipe spills immediately",
        "Use coasters for hot and cold beverages",
        "Apply furniture wax every 6 months",
        "Avoid placing in direct sunlight",
        "Use placemats or tablecloths to prevent scratches",
      ],
    },
    "walnut-bed-frame": {
      id: "walnut-bed-frame",
      name: "Walnut Bed Frame",
      price: "$1,499",
      description:
        "Our Walnut Bed Frame showcases the rich, dark beauty of American black walnut. Handcrafted with precision joinery and a minimalist design that emphasizes the natural wood grain.",
      longDescription:
        "The Walnut Bed Frame represents the pinnacle of our woodworking craftsmanship. Made from sustainably sourced American black walnut, each frame showcases the wood's distinctive rich chocolate tones and striking grain patterns that make walnut one of the most prized furniture woods.\n\nOur master craftsmen use traditional mortise and tenon joinery reinforced with modern engineering to create a bed frame that's both beautiful and incredibly strong. The minimalist design philosophy lets the natural beauty of the walnut take center stage while providing a sophisticated foundation for your bedroom.\n\nThe headboard features a subtle live edge detail that adds organic character, while the platform base eliminates the need for a box spring. Hidden steel brackets provide additional support while maintaining the clean lines of the design. This bed frame will develop a beautiful patina over time, becoming even more stunning with age.",
      rating: 4.9,
      reviewCount: 97,
      category: "Bedroom",
      inStock: true,
      isNew: false,
      isBestseller: true,
      images: [
        "/placeholder.svg?height=600&width=600",
        "/placeholder.svg?height=600&width=600",
        "/placeholder.svg?height=600&width=600",
        "/placeholder.svg?height=600&width=600",
      ],
      colors: ["Natural Walnut", "Dark Walnut", "Honey Walnut"],
      specifications: [
        { name: "Dimensions", value: 'King: 80"L x 76"W x 45"H' },
        { name: "Headboard Height", value: "45 inches" },
        { name: "Platform Height", value: "14 inches" },
        { name: "Material", value: "Solid American Black Walnut" },
        { name: "Finish", value: "Natural Oil Finish" },
        {
          name: "Joinery",
          value: "Mortise and Tenon with Steel Reinforcement",
        },
        { name: "Weight Capacity", value: "1,200 lbs" },
        { name: "Assembly", value: "Professional Assembly Recommended" },
      ],
      features: [
        "Solid American black walnut construction",
        "Traditional mortise and tenon joinery",
        "Live edge headboard detail",
        "Platform base eliminates need for box spring",
        "Hidden steel reinforcement brackets",
        "Natural oil finish enhances wood grain",
        "Available in King, Queen, and Full sizes",
        "10-year structural warranty",
      ],
      care: [
        "Dust regularly with a soft, dry cloth",
        "Apply furniture oil every 6-12 months",
        "Avoid direct sunlight to prevent uneven aging",
        "Use felt pads under lamps and accessories",
        "Clean spills immediately with a damp cloth",
        "Professional refinishing available if needed",
      ],
    },
    "cherry-bookcase": {
      id: "cherry-bookcase",
      name: "Cherry Wood Bookcase",
      price: "$749",
      description:
        "Our Cherry Wood Bookcase combines classic design with modern functionality. Featuring adjustable shelves and traditional craftsmanship in beautiful cherry wood.",
      longDescription:
        "The Cherry Wood Bookcase is a testament to timeless design and exceptional craftsmanship. Made from solid American cherry wood, this bookcase showcases the wood's warm reddish-brown tones and fine, straight grain that deepens and enriches with age.\n\nFeaturing five adjustable shelves, this bookcase can accommodate books of all sizes, decorative objects, and personal collections. The traditional design includes subtle crown molding at the top and a solid wood back panel that adds structural integrity while maintaining the classic appearance.\n\nOur craftsmen use traditional dado joints for the shelves and dovetail construction for the case, ensuring this piece will serve your family for generations. The natural cherry finish is hand-rubbed to a smooth, lustrous sheen that highlights the wood's natural beauty while providing protection against daily use.",
      rating: 4.6,
      reviewCount: 73,
      category: "Living Room",
      inStock: true,
      isNew: false,
      isBestseller: false,
      images: [
        "/placeholder.svg?height=600&width=600",
        "/placeholder.svg?height=600&width=600",
        "/placeholder.svg?height=600&width=600",
        "/placeholder.svg?height=600&width=600",
      ],
      colors: ["Natural Cherry", "Dark Cherry", "Antique Cherry"],
      specifications: [
        { name: "Dimensions", value: '36"W x 14"D x 72"H' },
        { name: "Shelf Count", value: "5 Adjustable Shelves" },
        { name: "Shelf Spacing", value: "Adjustable 1-inch increments" },
        { name: "Material", value: "Solid American Cherry" },
        { name: "Back Panel", value: "Solid Wood" },
        { name: "Finish", value: "Hand-rubbed Natural Finish" },
        { name: "Weight", value: "85 lbs" },
        { name: "Assembly", value: "Minimal Assembly Required" },
      ],
      features: [
        "Solid American cherry construction",
        "Five adjustable shelves",
        "Traditional dado joint construction",
        "Crown molding detail",
        "Solid wood back panel",
        "Hand-rubbed finish",
        "Anti-tip safety hardware included",
        "5-year warranty",
      ],
      care: [
        "Dust weekly with a soft cloth",
        "Polish monthly with quality furniture polish",
        "Avoid placing in direct sunlight",
        "Use coasters under plants and decorative items",
        "Rotate books occasionally to prevent shelf sagging",
        "Professional refinishing available",
      ],
    },
  };

  return products[id as keyof typeof products] || null;
};

// Mock related products
const relatedProducts = [
  {
    id: "leather-armchair",
    name: "Leather Armchair",
    price: "$799",
    image: "/images/chairs/chair.jpeg",
    rating: 4.7,
    category: "Living Room",
  },
  {
    id: "coffee-table",
    name: "Walnut Coffee Table",
    price: "$499",
    image: "/images/dining/diningtable3.jpeg",
    rating: 4.6,
    category: "Living Room",
  },
  {
    id: "side-table",
    name: "Oak Side Table",
    price: "$299",
    image: "/images/dining/diningtable2.jpeg",
    rating: 4.5,
    category: "Living Room",
  },
  {
    id: "pine-nightstand",
    name: "Pine Nightstand",
    price: "$249",
    image: "/images/beds/bedlamp.jpeg",
    rating: 4.4,
    category: "Lighting",
  },
];

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProductData(id);

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50/50 to-white">
        <Header />
        <div className="container py-20 text-center">
          <h1 className="text-3xl font-bold">Product Not Found</h1>
          <p className="mt-4 text-gray-600">
            The product you{"'"}re looking for doesn{"'"}t exist or has been
            removed.
          </p>
          <Button className="mt-8 bg-amber-800 hover:bg-amber-900" asChild>
            <Link href="/products">Browse All Products</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

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
                SKU: {product.id.toUpperCase()}
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
                {product.price}
              </span>
              <span className="ml-2 text-sm text-gray-500">Free shipping</span>
            </div>

            <p className="mb-6 text-gray-700">{product.description}</p>

            {/* Color Selection */}
            <div className="mb-6">
              <h3 className="mb-3 text-sm font-medium">Color</h3>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color, index) => (
                  <button
                    key={index}
                    className={`cursor-pointer rounded-md border border-gray-300 px-4 py-2 text-sm transition-all hover:border-amber-800 ${
                      index === 0 ? "border-amber-800 bg-amber-50" : ""
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <h3 className="mb-3 text-sm font-medium">Quantity</h3>
              <div className="flex w-32 items-center">
                <Button
                  variant="outline"
                  size="icon"
                  className="cursor-pointer rounded-r-none"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="flex h-10 w-10 items-center justify-center border-y border-input bg-white">
                  1
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="cursor-pointer rounded-l-none"
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
              <Button className="cursor-pointer flex-1 gap-2 bg-amber-800 hover:bg-amber-900">
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
                productId={product.id}
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
                productId={product.id}
                rating={product.rating}
                reviewCount={product.reviewCount}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        <section className="mt-20">
          <SectionHeading
            title="You May Also Like"
            subtitle="Products that complement your selection"
          />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard
                key={relatedProduct.id}
                id={relatedProduct.id}
                name={relatedProduct.name}
                price={relatedProduct.price}
                image={relatedProduct.image}
                rating={relatedProduct.rating}
                category={relatedProduct.category}
              />
            ))}
          </div>
        </section>

        {/* Recently Viewed */}
        <section className="mt-20">
          <div className="flex items-center justify-between">
            <SectionHeading title="Recently Viewed" centered={false} />
            <Button variant="link" className="text-amber-800">
              View All
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
            {relatedProducts.slice(0, 4).map((relatedProduct) => (
              <ProductCard
                key={relatedProduct.id}
                id={relatedProduct.id}
                name={relatedProduct.name}
                price={relatedProduct.price}
                image={relatedProduct.image}
                rating={relatedProduct.rating}
                category={relatedProduct.category}
              />
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
