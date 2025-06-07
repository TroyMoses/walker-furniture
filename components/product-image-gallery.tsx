"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

export function ProductImageGallery({
  images,
  productName,
}: ProductImageGalleryProps) {
  // Ensure we have at least one image
  const validImages =
    images && images.length > 0 ? images : ["/placeholder.png"];
  const [mainImage, setMainImage] = useState(validImages[0]);
  console.log("Valid Images:", validImages);

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-white shadow-md">
        <Image
          unoptimized
          src={mainImage || "/placeholder.png"}
          alt={productName}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder.png";
          }}
        />
      </div>
      {validImages.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {validImages.map((image, index) => (
            <button
              key={index}
              className={`cursor-pointer relative aspect-square overflow-hidden rounded-md bg-white shadow-sm transition-all hover:opacity-80 ${
                mainImage === image ? "ring-2 ring-amber-800" : ""
              }`}
              onClick={() => setMainImage(image)}
              title={`Show image ${index + 1} of ${productName}`}
            >
              <Image
                src={image || "/placeholder.svg"}
                alt={`${productName} - View ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 25vw, 10vw"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder.png";
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
