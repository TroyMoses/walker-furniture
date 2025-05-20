import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface CategoryCardProps {
  title: string;
  description: string;
  image: string;
  href: string;
}

export function CategoryCard({
  title,
  description,
  image,
  href,
}: CategoryCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:shadow-xl">
      <Image
        src={image || "/placeholder.svg"}
        alt={title}
        width={400}
        height={300}
        className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      <div className="absolute bottom-0 p-6 text-white">
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="mb-4 text-sm opacity-90">{description}</p>
        <Button
          variant="outline"
          className="border-white text-white hover:bg-white/10"
          asChild
        >
          <Link href={href}>View Collection</Link>
        </Button>
      </div>
    </div>
  );
}
