import Link from "next/link";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <>
      {/* Newsletter */}
      <section className="bg-gradient-to-r from-amber-800 to-amber-700 py-12 px-10 text-white">
        <div className="container">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div>
              <h2 className="text-2xl font-bold">
                Subscribe to Our Newsletter
              </h2>
              <p>
                Stay updated with our latest collections and exclusive offers.
              </p>
            </div>
            <div className="flex w-full max-w-md gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full rounded-md border-0 bg-white/10 p-2 text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <Button
                variant="outline"
                className="border-white cursor-pointer text-gray-800 hover:bg-white/10"
              >
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-gray-800 to-gray-900 py-12 px-10 text-gray-300">
        <div className="container">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div>
              <h3 className="mb-4 text-lg font-bold text-white">
                Exit Walker Furniture
              </h3>
              <p className="mb-4">
                Crafting quality furniture for generations.
              </p>
              <div className="flex gap-4">
                <Link href="#" className="hover:text-amber-800">
                  <Facebook className="h-5 w-5" />
                </Link>
                <Link href="#" className="hover:text-amber-800">
                  <Instagram className="h-5 w-5" />
                </Link>
                <Link href="#" className="hover:text-amber-800">
                  <Twitter className="h-5 w-5" />
                </Link>
                <Link href="#" className="hover:text-amber-800">
                  <Linkedin className="h-5 w-5" />
                </Link>
              </div>
            </div>
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
            <div>
              <h3 className="mb-4 text-lg font-bold text-white">About Us</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="hover:text-amber-800">
                    Our Story
                  </Link>
                </li>
                <li>
                  <Link href="/craftsmen" className="hover:text-amber-800">
                    Craftsmen
                  </Link>
                </li>
                <li>
                  <Link href="/sustainability" className="hover:text-amber-800">
                    Sustainability
                  </Link>
                </li>
                <li>
                  <Link href="/showrooms" className="hover:text-amber-800">
                    Showrooms
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-amber-800">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-700 pt-8 text-center">
            <p>
              &copy; {new Date().getFullYear()} Exit Walker Furniture. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
