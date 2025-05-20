import Image from "next/image";
import { ProductRating } from "@/components/product-rating";

interface TestimonialCardProps {
  name: string;
  quote: string;
  image: string;
  rating: number;
}

export function TestimonialCard({
  name,
  quote,
  image,
  rating,
}: TestimonialCardProps) {
  return (
    <div className="rounded-lg bg-gradient-to-b from-white to-amber-50 p-6 shadow-md transition-all duration-300 hover:shadow-lg">
      <div className="mb-4 flex items-center gap-4">
        <Image
          src={image || "/placeholder.svg"}
          alt={name}
          width={50}
          height={50}
          className="rounded-full"
        />
        <h3 className="font-semibold">{name}</h3>
      </div>
      <p className="italic text-gray-700 mb-4">
        {"'"}
        {quote}
        {"'"}
      </p>
      <ProductRating rating={rating} showText />
    </div>
  );
}
