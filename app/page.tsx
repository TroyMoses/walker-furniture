import { CategoryCard } from "@/components/category-card";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { TestimonialCard } from "@/components/testimonial-card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 to-white">
      <Header />

      <HeroSection
        title="Crafting Comfort for Your Home"
        description="Discover our handcrafted furniture collection designed to bring elegance and comfort to your living spaces."
        imageSrc="/images/bg/bgimg2.jpg"
        primaryButtonText="Explore Collection"
        secondaryButtonText="Book Consultation"
        primaryButtonHref="/products"
      />

      {/* Featured Categories */}
      <section className="pt-16 pb-4 md:pb-8 px-3 md:px-10 bg-gradient-to-b from-white to-amber-50/30">
        <div className="container">
          <SectionHeading
            title="Our Collections"
            subtitle="Explore our carefully curated furniture collections"
          />
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                title: "Living Room",
                description: "Elegant sofas, coffee tables, and accent pieces",
                image: "/images/living/product2.jpeg",
                href: "/products?category=living-room",
              },
              {
                title: "Bedroom",
                description: "Comfortable beds, dressers, and nightstands",
                image: "/images/beds/bed1.jpeg",
                href: "/products?category=bedroom",
              },
              {
                title: "Dining",
                description: "Stylish dining tables, chairs, and buffets",
                image: "/images/dining/diningtable.jpeg",
                href: "/products?category=dining",
              },
            ].map((category, index) => (
              <CategoryCard
                key={index}
                title={category.title}
                description={category.description}
                image={category.image}
                href={category.href}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
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
            {[
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
            ].map((product) => (
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
          <div className="mt-12 text-center">
            <Button variant="outline" className="gap-2 border-amber-800" asChild>
              <Link href="/products">
                View All Products <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="pt-16 pb-2 md:pb-8 px-3 md:px-10 bg-gradient-to-b from-white to-amber-50/30"
      >
        <div className="container">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            <div className="relative h-full md:h-[400px] overflow-hidden rounded-lg shadow-md">
              <Image
                width={800}
                height={800}
                src="/images/flyer.jpeg"
                alt="Our workshop"
                className="object-fill h-full w-full"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="mb-6 text-3xl font-bold text-center md:text-start">
                About Exit Walker Furnitures
              </h2>
              <p className="mb-4 text-gray-700">
                Since 2017, Walker Furnitures has been crafting high-quality,
                sustainable furniture that stands the test of time. Our master
                craftsmen combine traditional woodworking techniques with modern
                design to create pieces that are both functional and beautiful.
              </p>
              <p className="mb-6 text-gray-700">
                We source our materials responsibly, working with local
                suppliers to ensure the highest quality woods and fabrics while
                minimizing our environmental impact. Every piece that leaves our
                workshop is built to become a cherished part of your home for
                generations.
              </p>
              <div className="flex justify-center md:justify-start">
              <Button className="w-fit bg-amber-800 hover:bg-amber-900" asChild>
                <a href="/about">Learn Our Story</a>
              </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section
        id="testimonials"
        className="bg-gradient-to-b from-amber-50/30 to-white py-8 md:py-16 px-3 md:px-10"
      >
        <div className="container">
          <SectionHeading title="What Our Customers Say" />
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                name: "Sarah Johnson",
                quote:
                  "The quality of our dining table is exceptional. It's become the centerpiece of our home where we gather for family meals.",
                image: "/images/testimonials/shuga.jpg",
                rating: 5.0,
              },
              {
                name: "Michael Chen",
                quote:
                  "I've purchased furniture from many stores, but Walker's craftsmanship is unmatched. Their attention to detail is evident in every piece.",
                image: "/images/testimonials/shuga.jpg",
                rating: 4.7,
              },
              {
                name: "Emily Rodriguez",
                quote:
                  "The custom bookshelf they built fits perfectly in our living room. The team was professional from design to delivery.",
                image: "/images/testimonials/shuga.jpg",
                rating: 4.9,
              },
            ].map((testimonial, index) => (
              <TestimonialCard
                key={index}
                name={testimonial.name}
                quote={testimonial.quote}
                image={testimonial.image}
                rating={testimonial.rating}
              />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
