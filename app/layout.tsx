import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { CartProvider } from "@/components/cart-provider";
import { Toaster } from "sonner";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Exit Walker Furniture - Handcrafted Quality Furniture",
  description:
    "Discover our collection of handcrafted furniture pieces designed for comfort, style, and durability. From sofas to dining sets, find the perfect piece for your home.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <ConvexClientProvider>
          <CartProvider>
            {children}
            <Toaster position="top-right" />
          </CartProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
