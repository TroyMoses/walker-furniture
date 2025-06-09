"use client";

import { SectionHeading } from "@/components/section-heading";
import { TestimonialCard } from "@/components/testimonial-card";
import { Button } from "@/components/ui/button";
import type { api } from "@/convex/_generated/api";
import { type Preloaded, usePreloadedQuery } from "convex/react";
import Link from "next/link";

interface HomeTestimonialsSectionProps {
  preloadedTestimonials: Preloaded<
    typeof api.testimonials.getApprovedTestimonials
  >;
}

export function HomeTestimonialsSection({
  preloadedTestimonials,
}: HomeTestimonialsSectionProps) {
  const testimonials = usePreloadedQuery(preloadedTestimonials);

  return (
    <section
      id="testimonials"
      className="bg-gradient-to-b from-amber-50/30 to-white py-8 md:py-16 px-3 md:px-10"
    >
      <div className="container">
        <SectionHeading title="What Our Customers Say" />

        {testimonials.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {testimonials.map((testimonial) => (
                <TestimonialCard
                  key={testimonial._id}
                  name={testimonial.customerName}
                  quote={testimonial.content}
                  rating={testimonial.rating}
                />
              ))}
            </div>

            <div className="text-center mt-12">
              <Button
                className="bg-amber-800 hover:bg-amber-900 cursor-pointer"
                asChild
              >
                <Link href="/testimonials">View More Testimonials</Link>
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-6">
              No testimonials available yet.
            </p>
            <Button
              className="bg-amber-800 hover:bg-amber-900 cursor-pointer"
              asChild
            >
              <Link href="/testimonials">
                Be the First to Share Your Experience
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
