import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/hero-section";
import { SectionHeading } from "@/components/section-heading";
import { TestimonialCard } from "@/components/testimonial-card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TestimonialsPage() {
  // Mock testimonial data
  const testimonials = [
    {
      name: "Sarah Johnson",
      quote:
        "The quality of our dining table is exceptional. It's become the centerpiece of our home where we gather for family meals. The craftsmanship is evident in every detail, and the finish is even more beautiful in person than in the photos.",
      image: "/placeholder.svg?height=100&width=100",
      rating: 5.0,
      category: "Dining",
    },
    {
      name: "Michael Chen",
      quote:
        "I've purchased furniture from many stores, but Walker's craftsmanship is unmatched. Their attention to detail is evident in every piece. The bedroom set we ordered has transformed our space into a luxurious retreat. Worth every penny!",
      image: "/placeholder.svg?height=100&width=100",
      rating: 4.7,
      category: "Bedroom",
    },
    {
      name: "Emily Rodriguez",
      quote:
        "The custom bookshelf they built fits perfectly in our living room. The team was professional from design to delivery. They listened to our needs and created exactly what we envisioned, with some thoughtful suggestions that made the final piece even better.",
      image: "/placeholder.svg?height=100&width=100",
      rating: 4.9,
      category: "Living Room",
    },
    {
      name: "David Thompson",
      quote:
        "Our Walker coffee table is not just functional but a true work of art. The wood grain is stunning, and the craftsmanship is impeccable. We receive compliments from everyone who visits our home.",
      image: "/placeholder.svg?height=100&width=100",
      rating: 5.0,
      category: "Living Room",
    },
    {
      name: "Jennifer Lee",
      quote:
        "The office desk I purchased has made working from home a joy. It's sturdy, beautiful, and perfectly sized for my space. The drawers slide smoothly, and the finish is resistant to scratches and water marks.",
      image: "/placeholder.svg?height=100&width=100",
      rating: 4.8,
      category: "Office",
    },
    {
      name: "Robert Garcia",
      quote:
        "We furnished our entire dining room with Walker pieces, and the cohesive look is stunning. The chairs are comfortable for long dinner parties, and the table expands easily to accommodate extra guests.",
      image: "/placeholder.svg?height=100&width=100",
      rating: 4.9,
      category: "Dining",
    },
    {
      name: "Olivia Wilson",
      quote:
        "The outdoor furniture set has withstood two seasons of harsh weather and still looks brand new. The teak has developed a beautiful patina, and the cushions have remained vibrant despite sun exposure.",
      image: "/placeholder.svg?height=100&width=100",
      rating: 4.6,
      category: "Outdoor",
    },
    {
      name: "James Miller",
      quote:
        "Our king bed frame is not only gorgeous but incredibly sturdy. No squeaks or wobbles, even after years of use. The headboard design is exactly what we wanted - elegant but not overstated.",
      image: "/placeholder.svg?height=100&width=100",
      rating: 4.8,
      category: "Bedroom",
    },
    {
      name: "Sophia Brown",
      quote:
        "The customer service at Walker Furnitures is as exceptional as their products. When we had a small issue with our delivery, they resolved it immediately and with genuine care for our satisfaction.",
      image: "/placeholder.svg?height=100&width=100",
      rating: 4.7,
      category: "Service",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 to-white">
      <Header />

      <HeroSection
        title="Customer Testimonials"
        description="Hear what our customers have to say about their Walker Furnitures experience."
        imageSrc="/placeholder.svg?height=500&width=1200"
        primaryButtonText="Share Your Story"
        primaryButtonHref="#share-story"
      />

      <section className="py-16 bg-gradient-to-b from-white to-amber-50/30">
        <div className="container">
          <SectionHeading
            title="What Our Customers Say"
            subtitle="Real experiences from real customers"
          />

          <Tabs defaultValue="all" className="mb-8">
            <TabsList className="mx-auto">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="living-room">Living Room</TabsTrigger>
              <TabsTrigger value="bedroom">Bedroom</TabsTrigger>
              <TabsTrigger value="dining">Dining</TabsTrigger>
              <TabsTrigger value="office">Office</TabsTrigger>
              <TabsTrigger value="outdoor">Outdoor</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {testimonials.map((testimonial, index) => (
                  <TestimonialCard
                    key={index}
                    name={testimonial.name}
                    quote={testimonial.quote}
                    image={testimonial.image}
                    rating={testimonial.rating}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="living-room" className="mt-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {testimonials
                  .filter((t) => t.category === "Living Room")
                  .map((testimonial, index) => (
                    <TestimonialCard
                      key={index}
                      name={testimonial.name}
                      quote={testimonial.quote}
                      image={testimonial.image}
                      rating={testimonial.rating}
                    />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="bedroom" className="mt-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {testimonials
                  .filter((t) => t.category === "Bedroom")
                  .map((testimonial, index) => (
                    <TestimonialCard
                      key={index}
                      name={testimonial.name}
                      quote={testimonial.quote}
                      image={testimonial.image}
                      rating={testimonial.rating}
                    />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="dining" className="mt-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {testimonials
                  .filter((t) => t.category === "Dining")
                  .map((testimonial, index) => (
                    <TestimonialCard
                      key={index}
                      name={testimonial.name}
                      quote={testimonial.quote}
                      image={testimonial.image}
                      rating={testimonial.rating}
                    />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="office" className="mt-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {testimonials
                  .filter((t) => t.category === "Office")
                  .map((testimonial, index) => (
                    <TestimonialCard
                      key={index}
                      name={testimonial.name}
                      quote={testimonial.quote}
                      image={testimonial.image}
                      rating={testimonial.rating}
                    />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="outdoor" className="mt-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {testimonials
                  .filter((t) => t.category === "Outdoor")
                  .map((testimonial, index) => (
                    <TestimonialCard
                      key={index}
                      name={testimonial.name}
                      quote={testimonial.quote}
                      image={testimonial.image}
                      rating={testimonial.rating}
                    />
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Featured Video Testimonials */}
      <section className="py-16 bg-gradient-to-b from-amber-50/30 to-white">
        <div className="container">
          <SectionHeading
            title="Video Testimonials"
            subtitle="See and hear from our satisfied customers"
          />

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="overflow-hidden rounded-lg shadow-md">
              <div className="aspect-video bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500">Video Testimonial Placeholder</p>
              </div>
              <div className="bg-gradient-to-b from-white to-amber-50 p-4">
                <h3 className="text-lg font-semibold">The Johnson Family</h3>
                <p className="text-sm text-gray-700">
                  {"'"}Watch how Walker Furnitures transformed our living space
                  with custom-designed pieces that perfectly match our style and
                  needs.{"'"}
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg shadow-md">
              <div className="aspect-video bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500">Video Testimonial Placeholder</p>
              </div>
              <div className="bg-gradient-to-b from-white to-amber-50 p-4">
                <h3 className="text-lg font-semibold">
                  The Martinez Home Renovation
                </h3>
                <p className="text-sm text-gray-700">
                  {"'"}See the before and after of our complete home makeover
                  featuring Walker Furnitures throughout every room.{"'"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Share Your Story */}
      <section
        id="share-story"
        className="py-16 bg-gradient-to-b from-white to-amber-50/30"
      >
        <div className="container">
          <SectionHeading
            title="Share Your Story"
            subtitle="We'd love to hear about your experience with Walker Furnitures"
          />

          <div className="mx-auto max-w-2xl rounded-lg bg-gradient-to-b from-white to-amber-50 p-8 shadow-md">
            <form className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    className="w-full rounded-md border border-gray-300 p-2 focus:border-amber-800 focus:outline-none focus:ring-1 focus:ring-amber-800"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="w-full rounded-md border border-gray-300 p-2 focus:border-amber-800 focus:outline-none focus:ring-1 focus:ring-amber-800"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="product" className="block text-sm font-medium">
                  Product Purchased
                </label>
                <input
                  id="product"
                  type="text"
                  className="w-full rounded-md border border-gray-300 p-2 focus:border-amber-800 focus:outline-none focus:ring-1 focus:ring-amber-800"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="rating" className="block text-sm font-medium">
                  Your Rating
                </label>
                <select
                  id="rating"
                  className="w-full rounded-md border border-gray-300 p-2 focus:border-amber-800 focus:outline-none focus:ring-1 focus:ring-amber-800"
                >
                  <option value="5">5 Stars - Excellent</option>
                  <option value="4">4 Stars - Very Good</option>
                  <option value="3">3 Stars - Good</option>
                  <option value="2">2 Stars - Fair</option>
                  <option value="1">1 Star - Poor</option>
                </select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="testimonial"
                  className="block text-sm font-medium"
                >
                  Your Testimonial
                </label>
                <textarea
                  id="testimonial"
                  rows={4}
                  className="w-full rounded-md border border-gray-300 p-2 focus:border-amber-800 focus:outline-none focus:ring-1 focus:ring-amber-800"
                  placeholder="Tell us about your experience with our furniture..."
                ></textarea>
              </div>

              <div className="space-y-2">
                <label htmlFor="photo" className="block text-sm font-medium">
                  Upload a Photo (Optional)
                </label>
                <input
                  id="photo"
                  type="file"
                  className="w-full rounded-md border border-gray-300 p-2 focus:border-amber-800 focus:outline-none focus:ring-1 focus:ring-amber-800"
                />
                <p className="text-xs text-gray-500">
                  Share a photo of your Walker Furniture in your home.
                </p>
              </div>

              <Button className="w-full bg-amber-800 hover:bg-amber-900">
                Submit Your Testimonial
              </Button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
