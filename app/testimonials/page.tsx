"use client";

import type React from "react";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/hero-section";
import { SectionHeading } from "@/components/section-heading";
import { TestimonialCard } from "@/components/testimonial-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TestimonialsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");

  const submitTestimonial = useMutation(api.testimonials.createTestimonial);

  // Fetch all approved testimonials
  const allTestimonials =
    useQuery(api.testimonials.getApprovedTestimonials, {}) || [];

  // Filter testimonials by category
  const getFilteredTestimonials = (category: string) => {
    if (category === "all") return allTestimonials;
    return allTestimonials.filter(
      (t) => t.category.toLowerCase().replace(" ", "-") === category
    );
  };

  const handleTestimonialSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    try {
      await submitTestimonial({
        customerName: formData.get("name") as string,
        customerEmail: formData.get("email") as string,
        content: formData.get("testimonial") as string,
        rating: Number.parseInt(formData.get("rating") as string),
        category: formData.get("product") as string,
      });

      setIsSubmitted(true);
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error("Failed to submit testimonial:", error);
      // You might want to show an error message here
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get unique categories from testimonials
  const categories = Array.from(
    new Set(allTestimonials.map((t) => t.category))
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 to-white">
      <Header />

      <HeroSection
        title="Customer Testimonials"
        description="Hear what our customers have to say about their Exit Walker Furniture experience."
        imageSrc="/images/bg/bgimg2.jpg"
        primaryButtonText="Share Your Story"
        primaryButtonHref="#share-story"
      />

      <section className="pt-16 pb-2 px-3 md:px-10 bg-gradient-to-b from-white to-amber-50/30">
        <div className="container">
          <SectionHeading
            title="What Our Customers Say"
            subtitle="Real experiences from real customers"
          />

          {allTestimonials.length > 0 ? (
            <Tabs
              value={activeCategory}
              onValueChange={setActiveCategory}
              className="mb-8"
            >
              <TabsList className="mx-auto">
                <TabsTrigger value="all">
                  All ({allTestimonials.length})
                </TabsTrigger>
                {categories.map((category) => {
                  const categoryKey = category.toLowerCase().replace(" ", "-");
                  const count = getFilteredTestimonials(categoryKey).length;
                  return (
                    <TabsTrigger key={categoryKey} value={categoryKey}>
                      {category} ({count})
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              <TabsContent value="all" className="mt-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {allTestimonials.map((testimonial) => (
                    <TestimonialCard
                      key={testimonial._id}
                      name={testimonial.customerName}
                      quote={testimonial.content}
                      rating={testimonial.rating}
                    />
                  ))}
                </div>
              </TabsContent>

              {categories.map((category) => {
                const categoryKey = category.toLowerCase().replace(" ", "-");
                const filteredTestimonials =
                  getFilteredTestimonials(categoryKey);

                return (
                  <TabsContent
                    key={categoryKey}
                    value={categoryKey}
                    className="mt-6"
                  >
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {filteredTestimonials.map((testimonial) => (
                        <TestimonialCard
                          key={testimonial._id}
                          name={testimonial.customerName}
                          quote={testimonial.content}
                          rating={testimonial.rating}
                        />
                      ))}
                    </div>
                  </TabsContent>
                );
              })}
            </Tabs>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No testimonials available yet.
              </p>
              <p className="text-gray-400 mt-2">
                Be the first to share your experience!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Featured Video Testimonials */}
      {/* <section className="pt-16 pb-2 px-3 md:px-10 bg-gradient-to-b from-amber-50/30 to-white">
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
                  {"'"}Watch how Exit Walker Furniture transformed our living
                  space with custom-designed pieces that perfectly match our
                  style and needs.{"'"}
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
                  featuring Exit Walker Furniture throughout every room.{"'"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Share Your Story */}
      <section
        id="share-story"
        className="pt-16 pb-2 px-3 md:px-10 bg-gradient-to-b from-white to-amber-50/30"
      >
        <div className="container">
          <SectionHeading
            title="Share Your Story"
            subtitle="We'd love to hear about your experience with Exit Walker Furniture"
          />

          <div className="mx-auto max-w-2xl rounded-lg bg-gradient-to-b from-white to-amber-50 p-8 shadow-md">
            {isSubmitted ? (
              <div className="text-center">
                <div className="rounded-lg bg-green-50 border border-green-200 p-6">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">
                    Thank you for sharing your story!
                  </h3>
                  <p className="text-green-700 mb-4">
                    Your testimonial has been submitted and is pending review.
                    We appreciate your feedback!
                  </p>
                  <Button
                    onClick={() => setIsSubmitted(false)}
                    variant="outline"
                    className="cursor-pointer"
                  >
                    Submit Another Testimonial
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleTestimonialSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      className="w-full rounded-md border border-gray-300 p-2 focus:border-amber-800 focus:outline-none focus:ring-1 focus:ring-amber-800"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      className="w-full rounded-md border border-gray-300 p-2 focus:border-amber-800 focus:outline-none focus:ring-1 focus:ring-amber-800"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="product">Product Category *</Label>
                  <Select name="product" required>
                    <SelectTrigger className="w-full rounded-md border border-gray-300 p-2 focus:border-amber-800 focus:outline-none focus:ring-1 focus:ring-amber-800 cursor-pointer">
                      <SelectValue placeholder="Select product category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Living Room" className="cursor-pointer">Living Room</SelectItem>
                      <SelectItem value="Bedroom" className="cursor-pointer">Bedroom</SelectItem>
                      <SelectItem value="Dining Room" className="cursor-pointer">Dining Room</SelectItem>
                      <SelectItem value="Office" className="cursor-pointer">Office</SelectItem>
                      <SelectItem value="Outdoor" className="cursor-pointer">Outdoor</SelectItem>
                      <SelectItem value="General" className="cursor-pointer">
                        General Experience
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rating">Your Rating *</Label>
                  <Select name="rating" required>
                    <SelectTrigger className="w-full rounded-md border border-gray-300 p-2 focus:border-amber-800 focus:outline-none focus:ring-1 focus:ring-amber-800 cursor-pointer">
                      <SelectValue placeholder="Select your rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5" className="cursor-pointer">5 Stars - Excellent</SelectItem>
                      <SelectItem value="4" className="cursor-pointer">4 Stars - Very Good</SelectItem>
                      <SelectItem value="3" className="cursor-pointer">3 Stars - Good</SelectItem>
                      <SelectItem value="2" className="cursor-pointer">2 Stars - Fair</SelectItem>
                      <SelectItem value="1" className="cursor-pointer">1 Star - Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="testimonial">Your Testimonial *</Label>
                  <Textarea
                    id="testimonial"
                    name="testimonial"
                    rows={4}
                    className="w-full rounded-md border border-gray-300 p-2 focus:border-amber-800 focus:outline-none focus:ring-1 focus:ring-amber-800"
                    placeholder="Tell us about your experience with our furniture..."
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-amber-800 hover:bg-amber-900 cursor-pointer"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Your Testimonial"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
