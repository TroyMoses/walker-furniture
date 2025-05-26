"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductRating } from "@/components/product-rating";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThumbsDown, ThumbsUp } from "lucide-react";

interface ProductReviewsProps {
  productId: string;
  rating: number;
  reviewCount: number;
}

export function ProductReviews({
  //   productId,
  rating,
  reviewCount,
}: ProductReviewsProps) {
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Mock review distribution data
  const ratingDistribution = [
    { stars: 5, percentage: 70, count: Math.round(reviewCount * 0.7) },
    { stars: 4, percentage: 20, count: Math.round(reviewCount * 0.2) },
    { stars: 3, percentage: 5, count: Math.round(reviewCount * 0.05) },
    { stars: 2, percentage: 3, count: Math.round(reviewCount * 0.03) },
    { stars: 1, percentage: 2, count: Math.round(reviewCount * 0.02) },
  ];

  // Mock reviews data
  const reviews = [
    {
      id: 1,
      author: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      date: "2 months ago",
      rating: 5,
      title: "Exceptional quality and comfort",
      content:
        "I've had this piece for two months now and I'm extremely impressed with the quality. The craftsmanship is evident in every detail, and it's even more comfortable than I expected. It's become the centerpiece of our living room and we've received numerous compliments from guests.",
      helpful: 24,
      unhelpful: 2,
      verified: true,
    },
    {
      id: 2,
      author: "Michael Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      date: "1 month ago",
      rating: 4,
      title: "Beautiful but delivery took longer than expected",
      content:
        "The furniture itself is gorgeous and exactly as pictured. The wood grain is beautiful and the construction feels very solid. My only complaint is that delivery took almost 3 weeks longer than the initial estimate. That said, the delivery team was professional and careful when setting it up in my home.",
      helpful: 15,
      unhelpful: 3,
      verified: true,
    },
    {
      id: 3,
      author: "Emily Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40",
      date: "3 weeks ago",
      rating: 5,
      title: "Worth every penny",
      content:
        "After searching for months for the perfect piece, I finally found it with Exit Walker Furniture. The attention to detail is remarkable, and you can tell this is built to last generations. The customer service was also excellent throughout the entire process. Highly recommend!",
      helpful: 18,
      unhelpful: 0,
      verified: true,
    },
  ];

  return (
    <div className="max-w-4xl">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Rating Summary */}
        <div className="rounded-lg bg-gradient-to-r from-white to-amber-50 p-6 shadow-sm">
          <div className="mb-4 text-center">
            <div className="text-5xl font-bold text-amber-800">
              {rating.toFixed(1)}
            </div>
            <div className="mt-2 justify-center flex">
              <ProductRating rating={rating} />
            </div>
            <div className="mt-1 text-sm text-gray-500">
              Based on {reviewCount} reviews
            </div>
          </div>

          <div className="space-y-2">
            {ratingDistribution.map((dist) => (
              <div key={dist.stars} className="flex items-center gap-1">
                <div className="w-[70px] text-sm">{dist.stars} stars</div>
                <Progress value={dist.percentage} className="h-2" />
                <div className="w-[24px] text-right text-sm text-gray-500">
                  {dist.count}
                </div>
              </div>
            ))}
          </div>

          <Button
            className="mt-6 w-full bg-amber-800 hover:bg-amber-900 cursor-pointer"
            onClick={() => setShowReviewForm(!showReviewForm)}
          >
            Write a Review
          </Button>
        </div>

        {/* Reviews List */}
        <div className="md:col-span-2">
          {showReviewForm && (
            <div className="mb-8 rounded-lg bg-gradient-to-r from-white to-amber-50 p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold">Write Your Review</h3>
              <form className="space-y-4">
                <div>
                  <Label htmlFor="review-rating">Your Rating</Label>
                  <div className="mt-1 flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className="text-gray-300 hover:text-amber-500"
                        aria-label={`Rate ${star} stars`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="h-6 w-6"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="review-title">Review Title</Label>
                  <Input
                    id="review-title"
                    className="mt-1"
                    placeholder="Summarize your experience"
                  />
                </div>

                <div>
                  <Label htmlFor="review-content">Your Review</Label>
                  <Textarea
                    id="review-content"
                    className="mt-1"
                    rows={4}
                    placeholder="What did you like or dislike? How was the quality and comfort?"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="review-name">Your Name</Label>
                    <Input
                      id="review-name"
                      className="mt-1"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="review-email">Email Address</Label>
                    <Input
                      id="review-email"
                      type="email"
                      className="mt-1"
                      placeholder="Your email (not published)"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button className="cursor-pointer bg-amber-800 hover:bg-amber-900">
                    Submit Review
                  </Button>
                  <Button
                    className="cursor-pointer"
                    variant="outline"
                    onClick={() => setShowReviewForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          )}

          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="rounded-lg bg-gradient-to-r from-white to-amber-50 p-6 shadow-sm"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarImage
                        src={review.avatar || "/placeholder.svg"}
                        alt={review.author}
                      />
                      <AvatarFallback>{review.author.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{review.author}</h4>
                        {review.verified && (
                          <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800">
                            Verified Purchase
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">{review.date}</div>
                    </div>
                  </div>
                  <ProductRating rating={review.rating} />
                </div>

                <h5 className="mb-2 font-medium">{review.title}</h5>
                <p className="text-gray-700">{review.content}</p>

                <div className="mt-4 flex items-center gap-6">
                  <div className="flex items-center gap-1">
                    <button className="cursor-pointer flex items-center gap-1 text-sm text-gray-500 hover:text-amber-800">
                      <ThumbsUp className="h-4 w-4" /> {review.helpful}
                    </button>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="cursor-pointer flex items-center gap-1 text-sm text-gray-500 hover:text-amber-800">
                      <ThumbsDown className="h-4 w-4" /> {review.unhelpful}
                    </button>
                  </div>
                  <button className="cursor-pointer text-sm text-amber-800 hover:underline">
                    Report
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-8 flex justify-center">
            <div className="flex items-center gap-2">
              <Button
                className="cursor-pointer"
                variant="outline"
                size="icon"
                disabled
              >
                &lt;
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="bg-amber-800 text-white hover:bg-amber-900"
              >
                1
              </Button>
              <Button className="cursor-pointer" variant="outline" size="icon">
                2
              </Button>
              <Button className="cursor-pointer" variant="outline" size="icon">
                3
              </Button>
              <Button className="cursor-pointer" variant="outline" size="icon">
                &gt;
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
