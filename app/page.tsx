import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { SectionHeading } from "@/components/section-heading";
import { TestimonialCard } from "@/components/testimonial-card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { api } from "@/convex/_generated/api";
import { preloadQuery } from "convex/nextjs";
import { HomeCategoriesSection } from "@/components/home-categories-section";
import { HomeFeaturedProductsSection } from "@/components/home-featured-products-section";

export default async function Home() {
  // Preload data for better performance
  const categoriesQuery = await preloadQuery(
    api.categories.getActiveCategories,
    {}
  );
  const featuredProductsQuery = await preloadQuery(
    api.products.getFeaturedProducts,
    {}
  );

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
      <HomeCategoriesSection preloadedCategories={categoriesQuery} />

      {/* Featured Products */}
      <HomeFeaturedProductsSection preloadedProducts={featuredProductsQuery} />

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
                className="object-cover h-full w-full"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="mb-6 text-3xl font-bold text-center md:text-start">
                About Exit Exit Walker Furniture
              </h2>
              <p className="mb-4 text-gray-700">
                Since 2017, Exit Walker Furniture has been crafting
                high-quality, sustainable furniture that stands the test of
                time. Our master craftsmen combine traditional woodworking
                techniques with modern design to create pieces that are both
                functional and beautiful.
              </p>
              <p className="mb-6 text-gray-700">
                We source our materials responsibly, working with local
                suppliers to ensure the highest quality woods and fabrics while
                minimizing our environmental impact. Every piece that leaves our
                workshop is built to become a cherished part of your home for
                generations.
              </p>
              <div className="flex justify-center md:justify-start">
                <Button
                  className="w-fit bg-amber-800 hover:bg-amber-900"
                  asChild
                >
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
