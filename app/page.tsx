import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { api } from "@/convex/_generated/api";
import { preloadQuery } from "convex/nextjs";
import { HomeCategoriesSection } from "@/components/home-categories-section";
import { HomeFeaturedProductsSection } from "@/components/home-featured-products-section";
import { HomeTestimonialsSection } from "@/components/home-testimonials-section";

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
  const testimonialsQuery = await preloadQuery(
    api.testimonials.getApprovedTestimonials,
    { limit: 3 }
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
      <HomeTestimonialsSection preloadedTestimonials={testimonialsQuery} />

      <Footer />
    </div>
  );
}
