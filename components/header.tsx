"use client";

import Link from "next/link";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useMobile } from "@/hooks/use-mobile";

export function Header() {
  const isMobile = useMobile();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-amber-50 to-white">
      <div className="container flex h-16 items-center justify-between px-10">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-3xl font-bold text-amber-800">
              Exit Walker Furniture
            </span>
          </Link>
        </div>

        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-8">
                <Link
                  href="/"
                  className="text-xl font-medium hover:text-amber-800"
                >
                  Home
                </Link>
                <Link
                  href="/products"
                  className="text-xl font-medium hover:text-amber-800"
                >
                  Products
                </Link>
                <Link
                  href="/about"
                  className="text-xl font-medium hover:text-amber-800"
                >
                  About
                </Link>
                <Link
                  href="/testimonials"
                  className="text-xl font-medium hover:text-amber-800"
                >
                  Testimonials
                </Link>
                <Link
                  href="/contact"
                  className="text-xl font-medium hover:text-amber-800"
                >
                  Contact
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        ) : (
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-sm font-medium hover:text-amber-800">
              Home
            </Link>
            <Link
              href="/products"
              className="text-sm font-medium hover:text-amber-800"
            >
              Products
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium hover:text-amber-800"
            >
              About
            </Link>
            <Link
              href="/testimonials"
              className="text-sm font-medium hover:text-amber-800"
            >
              Testimonials
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium hover:text-amber-800"
            >
              Contact
            </Link>
          </nav>
        )}

        <div className="flex items-center gap-4">
          <Button variant="outline" className="hidden md:flex">
            Sign In
          </Button>
          <Button className="bg-amber-800 hover:bg-amber-900">Shop Now</Button>
        </div>
      </div>
    </header>
  );
}
