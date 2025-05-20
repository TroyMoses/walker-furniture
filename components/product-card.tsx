import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductRating } from "@/components/product-rating";

interface ProductCardProps {
  id: string;
  name: string;
  price: string;
  image: string;
  rating: number;
  category?: string;
}

export function ProductCard({
  id,
  name,
  price,
  image,
  rating,
  category,
}: ProductCardProps) {
  return (
    <div className="group overflow-hidden rounded-lg bg-gradient-to-b from-white to-amber-50 shadow-md transition-all hover:shadow-lg">
      <div className="relative h-64 overflow-hidden">
        <Image
          src={image || "/placeholder.svg"}
          alt={name}
          width={300}
          height={300}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {category && (
          <div className="absolute top-2 left-2 bg-amber-800 px-2 py-1 text-xs text-white rounded-md">
            {category}
          </div>
        )}
      </div>
      <div className="p-4">
        <Link href={`/products/${id}`}>
          <h3 className="text-lg font-semibold hover:text-amber-800 transition-colors">
            {name}
          </h3>
        </Link>
        <div className="flex items-center justify-between mt-1">
          <p className="text-amber-800 font-medium">{price}</p>
          <ProductRating rating={rating} />
        </div>
        <Button className="mt-4 w-full bg-amber-800 hover:bg-amber-900">
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
