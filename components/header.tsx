"use client";

import Link from "next/link";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useMobile } from "@/hooks/use-mobile";
import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import Image from "next/image";

export function Header() {
  const { user } = useUser();

  // Get the user from Convex database
  const convexUser = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : "skip"
  );

  // Check user roles from Convex database
  const isAdmin = convexUser?.role === "admin";

  const isMobile = useMobile();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-amber-50 to-white">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              width={32}
              height={32}
              src="/logo.png"
              alt="Exit Walker Furniture Logo"
              className="h-8 w-8 md:h-10 md:w-10"
            />
          </Link>
          <Link href="/" className="hidden md:flex items-center gap-2">
            <span className="text-lg md:text-3xl font-bold text-amber-800">
              Exit Walker Furniture
            </span>
          </Link>
          <Link href="/" className="flex flex-col md:hidden">
            <span className="text-lg md:text-3xl font-bold text-amber-800">
              Exit Walker
            </span>
            <span className="text-lg md:text-3xl font-bold text-amber-800">
              Furniture
            </span>
          </Link>
        </div>

        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="cursor-pointer">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-amber-50 w-[250px]">
              <SheetTitle>
                <div className="flex items-center justify-between">
                  <Link
                    href="/"
                    className="px-4 mt-2 text-2xl font-bold text-amber-800"
                  >
                    Exit Walker Furniture
                  </Link>
                </div>
              </SheetTitle>
              <nav className="flex flex-col gap-4 mt-3 px-4">
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
              <SheetFooter>
                <div className="flex flex-col gap-4 mt-8">
                  <Button
                    variant="outline"
                    className="border-amber-800 cursor-pointer"
                  >
                    Sign In
                  </Button>
                  <Button className="bg-amber-800 hover:bg-amber-900 cursor-pointer">
                    Admin
                  </Button>
                </div>
              </SheetFooter>
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
          <Button
            variant="outline"
            className="hidden border-amber-800 md:flex cursor-pointer"
          >
            Sign In
          </Button>
          <Button className="bg-amber-800 hover:bg-amber-900 cursor-pointer">
            Order Now
          </Button>
          <Button className="hidden md:block bg-amber-800 hover:bg-amber-900 cursor-pointer">
            Admin
          </Button>
        </div>
      </div>
    </header>
  );
}
