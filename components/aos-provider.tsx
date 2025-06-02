"use client";

import type React from "react";
import { useEffect } from "react";
import "aos/dist/aos.css";

interface AosProviderProps {
  children: React.ReactNode;
}

export function AosProvider({ children }: AosProviderProps) {
  useEffect(() => {
    // Import AOS only on the client side using dynamic import
    import("aos").then((AOS) => {
      // Initialize AOS
      AOS.init({
        duration: 800,
        once: true,
        easing: "ease-out-cubic",
        offset: 50,
      });

      // Update AOS on window resize
      const handleResize = () => {
        AOS.refresh();
      };
      window.addEventListener("resize", handleResize);

      // Cleanup event listener on unmount
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    });
  }, []);

  return <>{children}</>;
}
