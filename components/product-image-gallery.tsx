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
  const [mainImage, setMainImage] = useState(images[0]);

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-white shadow-md">
        <Image
          src={mainImage || "/placeholder.svg"}
          alt={productName}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="grid grid-cols-4 gap-4">
        {images.map((image, index) => (
          <button
            key={index}
            className={`relative aspect-square overflow-hidden rounded-md bg-white shadow-sm transition-all hover:opacity-80 ${
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
            />
          </button>
        ))}
      </div>
    </div>
  );
}
