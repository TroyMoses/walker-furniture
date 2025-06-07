"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ShoppingCart, User, Settings, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart-provider";
import { useAuth, UserButton } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const { isSignedIn } = useAuth();
  const currentUser = useQuery(api.users.getMe);
  const isAdmin = currentUser?.role === "admin";

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "About", href: "/about" },
    { name: "Testimonials", href: "/testimonials" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-amber-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/logo.png"
              alt="Exit Walker Furniture"
              width={40}
              height={40}
              className="h-10 w-10"
            />
            <span className="text-xl font-bold text-amber-800">
              Exit Walker
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-amber-800 transition-colors font-medium"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Admin Dashboard - Only visible to admins */}
            {isSignedIn && isAdmin && (
              <Link href="/admin">
                <Button
                  variant="outline"
                  size="icon"
                  className="border-amber-800 text-amber-800 hover:bg-amber-50 cursor-pointer"
                >
                  <Settings className="h-5 w-5" />
                </Button>
              </Link>
            )}

            {/* Orders - Only visible to signed-in customers (not admins) */}
            {isSignedIn && !isAdmin && (
              <Link href="/orders">
                <Button variant="ghost" size="icon" className="text-gray-700 hover:text-amber-800 cursor-pointer">
                  <Package className="h-5 w-5" />
                </Button>
              </Link>
            )}

            {/* Cart */}
            <Link href="/cart" className="relative">
              <Button variant="ghost" size="icon" className="relative cursor-pointer">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-800 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>

            {/* User Authentication */}
            {isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <Link href="/sign-in">
                <Button variant="ghost" size="icon" className="cursor-pointer">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-amber-100">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-gray-700 hover:text-amber-800 transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile Orders Link - Only for customers */}
              {isSignedIn && !isAdmin && (
                <Link
                  href="/orders"
                  className="block px-3 py-2 text-gray-700 hover:text-amber-800 transition-colors font-medium border-t border-amber-100 mt-2 pt-3"
                  onClick={() => setIsMenuOpen(false)}
                >
                  📦 My Orders
                </Link>
              )}

              {/* Mobile Admin Link */}
              {isSignedIn && isAdmin && (
                <Link
                  href="/admin"
                  className="block px-3 py-2 text-amber-800 hover:text-amber-900 transition-colors font-semibold border-t border-amber-100 mt-2 pt-3 cursor-pointer"
                  onClick={() => setIsMenuOpen(false)}
                >
                  🛠️ Admin Dashboard
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
