import { Star, StarHalf } from "lucide-react";

interface ProductRatingProps {
  rating: number;
  showText?: boolean;
}

export function ProductRating({
  rating,
  showText = false,
}: ProductRatingProps) {
  // Calculate full stars, half stars, and empty stars
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center">
      <div className="flex text-amber-500">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="h-4 w-4 fill-current" />
        ))}

        {hasHalfStar && (
          <StarHalf key="half" className="h-4 w-4 fill-current" />
        )}

        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
        ))}
      </div>

      {showText && (
        <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
      )}
    </div>
  );
}
