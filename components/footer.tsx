"use client";

import type React from "react";

import { useState } from "react";
import { useMutation } from "convex/react";
import Link from "next/link";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";

export function Footer() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const subscribeToNewsletterMutation = useMutation(api.newsletter.subscribeToNewsletter);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const result = await subscribeToNewsletterMutation({
        email,
        source: "footer",
      });
      setMessage(result.message);
      setEmail("");
    } catch (error) {
      setMessage((error as Error)?.message || "Failed to subscribe. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Newsletter */}
      <section className="bg-gradient-to-r from-amber-800 to-amber-700 py-12 px-3 md:px-10 text-white">
        <div className="container">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div>
              <h2 className="text-[22px] md:text-2xl font-bold">
                Subscribe to Our Newsletter
              </h2>
              <p>
                Stay updated with our latest collections and exclusive offers.
              </p>
            </div>
            <div className="w-full max-w-md">
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 rounded-md border-0 bg-white/10 p-2 text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                  required
                  disabled={isSubmitting}
                />
                <Button
                  type="submit"
                  variant="outline"
                  className="border-white cursor-pointer text-gray-800 hover:bg-white/10"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "..." : "Subscribe"}
                </Button>
              </form>
              {message && (
                <p
                  className={`mt-2 text-sm ${message.includes("success") || message.includes("Welcome") ? "text-green-200" : "text-red-200"}`}
                >
                  {message}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-gray-800 to-gray-900 py-12 px-4 md:px-10 text-gray-300">
        <div className="container">
          {/* Desktop Menu */}
          <div className="hidden md:grid grid-cols-4 gap-8">
            {/* Overview */}
            <div>
              <h3 className="mb-4 text-lg font-bold text-white">
                Exit Walker Furniture
              </h3>
              <p className="mb-2">
                Crafting quality furniture for generations.
              </p>
              <div>
                <p className="mb-2">Opposite Club Guvnors, 1st Street Industrial Area.</p>
                <p>
                  <a href="tel:+256757601694 " className="mb-4">
                    +256 757 601694
                  </a>
                </p>
                <p>
                  <a href="tel:+256780884633 " className="mb-4">
                    +256 780 884633
                  </a>
                </p>
                <p>
                  <a href="mailto:kingabbey80@gmail.com">
                    kingabbey80@gmail.com
                  </a>
                </p>
              </div>
              <div className="flex gap-4 mt-4">
                <Link href="https://wwww.instagram.com/exit_walker_furniture_concepts" className="hover:text-amber-800">
                  <Instagram className="h-5 w-5" />
                </Link>
                <Link href="https://wwww.twitter.com/Abelexit" className="hover:text-amber-800">
                  <Twitter className="h-5 w-5" />
                </Link>
              </div>
            </div>

            {/* About */}
            <div>
              <h3 className="mb-4 text-lg font-bold text-white">About Us</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="hover:text-amber-800">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-amber-800">
                    Our Story
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="hover:text-amber-800">
                    Products
                  </Link>
                </li>
                <li>
                  <Link href="/testimonials" className="hover:text-amber-800">
                    Testimonials
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-amber-800">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Shop */}
            <div>
              <h3 className="mb-4 text-lg font-bold text-white">Shop</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/products?category=living-room"
                    className="hover:text-amber-800"
                  >
                    Living Room
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products?category=bedroom"
                    className="hover:text-amber-800"
                  >
                    Bedroom
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products?category=dining-room"
                    className="hover:text-amber-800"
                  >
                    Dining Room
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products?category=office"
                    className="hover:text-amber-800"
                  >
                    Office
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products?category=outdoor"
                    className="hover:text-amber-800"
                  >
                    Outdoor
                  </Link>
                </li>
              </ul>
            </div>

            {/* Customer Services */}
            <div>
              <h3 className="mb-4 text-lg font-bold text-white">
                Customer Service
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/contact" className="hover:text-amber-800">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-amber-800">
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-amber-800">
                    Shipping & Returns
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-amber-800">
                    Warranty
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-amber-800">
                    Care Instructions
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden grid grid-cols-1 gap-8 md:grid-cols-4">
            {/* Overview */}
            <div>
              <h3 className="mb-4 text-lg font-bold text-white">
                Exit Walker Furniture
              </h3>
              <p className="mb-2">
                Crafting quality furniture for generations.
              </p>
              <div>
                <p className="mb-2">Industrial Area, Kampala.</p>
                <p>
                  <a href="tel:+256757601694" className="mb-4">
                    +256 757 601694
                  </a>
                </p>
                <p>
                  <a href="mailto:exitwalkerfurniture@gmail.com">
                    exitwalkerfurniture@gmail.com
                  </a>
                </p>
              </div>
              <div className="flex gap-4 mt-4">
                <Link href="#" className="hover:text-amber-800">
                  <Facebook className="h-5 w-5" />
                </Link>
                <Link href="https://wwww.instagram.com/exit_walker_furniture_concepts" className="hover:text-amber-800">
                  <Instagram className="h-5 w-5" />
                </Link>
                <Link href="https://wwww.twitter.com/Abelexit" className="hover:text-amber-800">
                  <Twitter className="h-5 w-5" />
                </Link>
                <Link href="#" className="hover:text-amber-800">
                  <Linkedin className="h-5 w-5" />
                </Link>
              </div>
            </div>

            {/* About and Shop */}
            <div className="grid grid-cols-2 gap-4">
              {/* About */}
              <div>
                <h3 className="mb-4 text-lg font-bold text-white">About Us</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/" className="hover:text-amber-800">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" className="hover:text-amber-800">
                      Our Story
                    </Link>
                  </li>
                  <li>
                    <Link href="/products" className="hover:text-amber-800">
                      Products
                    </Link>
                  </li>
                  <li>
                    <Link href="/testimonials" className="hover:text-amber-800">
                      Testimonials
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="hover:text-amber-800">
                      Contact Us
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Shop */}
              <div>
                <h3 className="mb-4 text-lg font-bold text-white">Shop</h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/products?category=living-room"
                      className="hover:text-amber-800"
                    >
                      Living Room
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/products?category=bedroom"
                      className="hover:text-amber-800"
                    >
                      Bedroom
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/products?category=dining-room"
                      className="hover:text-amber-800"
                    >
                      Dining Room
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/products?category=office"
                      className="hover:text-amber-800"
                    >
                      Office
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/products?category=outdoor"
                      className="hover:text-amber-800"
                    >
                      Outdoor
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Customer Service */}
            <div>
              <h3 className="mb-4 text-lg font-bold text-white">
                Customer Service
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/contact" className="hover:text-amber-800">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-amber-800">
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link href="/shipping" className="hover:text-amber-800">
                    Shipping & Returns
                  </Link>
                </li>
                <li>
                  <Link href="/warranty" className="hover:text-amber-800">
                    Warranty
                  </Link>
                </li>
                <li>
                  <Link href="/care" className="hover:text-amber-800">
                    Care Instructions
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-700 pt-8 text-center">
            <p>
              &copy; {new Date().getFullYear()} Exit Walker Furniture. All
              rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
