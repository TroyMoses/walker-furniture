"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductRating } from "@/components/product-rating";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThumbsDown, ThumbsUp, Star } from "lucide-react";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import { format } from "date-fns";

interface ProductReviewsProps {
  productId: string;
  rating: number;
  reviewCount: number;
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const { isSignedIn } = useAuth();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedRating, setSelectedRating] = useState(5);
  const [reviewForm, setReviewForm] = useState({
    title: "",
    comment: "",
  });

  const createReview = useMutation(api.reviews.createReview);
  const voteOnReview = useMutation(api.reviews.voteOnReview);

  const reviews = useQuery(api.reviews.getProductReviews, {
    productId: productId as Id<"products">,
    status: "approved",
  });

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isSignedIn) {
      toast.error("Please sign in to write a review");
      return;
    }

    try {
      await createReview({
        productId: productId as Id<"products">,
        rating: selectedRating,
        title: reviewForm.title,
        comment: reviewForm.comment,
      });

      toast.success(
        "Review submitted successfully! It will be visible after approval."
      );
      setShowReviewForm(false);
      setReviewForm({ title: "", comment: "" });
      setSelectedRating(5);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("already reviewed")
      ) {
        toast.error("You have already reviewed this product.");
      } else {
        toast.error("Failed to submit review. Please try again.");
      }
      console.error("Review submission error:", error);
    }
  };

  const handleVote = async (reviewId: string, helpful: boolean) => {
    if (!isSignedIn) {
      toast.error("Please sign in to vote on reviews");
      return;
    }

    try {
      await voteOnReview({
        reviewId: reviewId as Id<"reviews">,
        voteType: helpful ? "helpful" : "unhelpful",
      });
      toast.success("Thank you for your feedback!");
    } catch (error) {
      if (error instanceof Error && error.message.includes("already voted")) {
        toast.error("You have already voted on this review");
      } else {
        toast.error("Failed to record your vote");
      }
      console.error("Vote error:", error);
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Rating Summary */}
        <div className="rounded-lg bg-gradient-to-r from-white to-amber-50 p-6 shadow-sm">
          <Button
            className="mt-6 w-full bg-amber-800 hover:bg-amber-900 cursor-pointer"
            onClick={() => {
              if (!isSignedIn) {
                toast.error("Please sign in to write a review");
                return;
              }
              setShowReviewForm(!showReviewForm);
            }}
          >
            Write a Review
          </Button>
        </div>

        {/* Reviews List */}
        <div className="md:col-span-2">
          {showReviewForm && (
            <div className="mb-8 rounded-lg bg-gradient-to-r from-white to-amber-50 p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold">Write Your Review</h3>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <Label htmlFor="review-rating">Your Rating</Label>
                  <div className="mt-1 flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={`text-2xl transition-colors ${
                          star <= selectedRating
                            ? "text-amber-500"
                            : "text-gray-300"
                        } hover:text-amber-500`}
                        onClick={() => setSelectedRating(star)}
                        aria-label={`Rate ${star} stars`}
                      >
                        <Star className="h-6 w-6 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="review-title">Review Title</Label>
                  <Input
                    id="review-title"
                    value={reviewForm.title}
                    onChange={(e) =>
                      setReviewForm({ ...reviewForm, title: e.target.value })
                    }
                    className="mt-1"
                    placeholder="Summarize your experience"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="review-content">Your Review</Label>
                  <Textarea
                    id="review-content"
                    value={reviewForm.comment}
                    onChange={(e) =>
                      setReviewForm({ ...reviewForm, comment: e.target.value })
                    }
                    className="mt-1"
                    rows={4}
                    placeholder="What did you like or dislike? How was the quality and comfort?"
                    required
                  />
                </div>

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    className="cursor-pointer bg-amber-800 hover:bg-amber-900"
                  >
                    Submit Review
                  </Button>
                  <Button
                    type="button"
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
            {reviews && reviews.length > 0 ? (
              reviews.map((review) => (
                <ReviewItem
                  key={review._id}
                  review={review}
                  onVote={handleVote}
                  isSignedIn={!!isSignedIn}
                />
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  No reviews yet. Be the first to review this product!
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {reviews && reviews.length > 0 && (
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
                <Button
                  className="cursor-pointer"
                  variant="outline"
                  size="icon"
                >
                  2
                </Button>
                <Button
                  className="cursor-pointer"
                  variant="outline"
                  size="icon"
                >
                  3
                </Button>
                <Button
                  className="cursor-pointer"
                  variant="outline"
                  size="icon"
                >
                  &gt;
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface Review {
  _id: string;
  customerName: string;
  verified: boolean;
  createdAt: string | number | Date;
  rating: number;
  title: string;
  comment: string;
  helpfulVotes: number;
  unhelpfulVotes: number;
}

interface ReviewItemProps {
  review: Review;
  onVote: (reviewId: string, helpful: boolean) => void;
  isSignedIn: boolean;
}

function ReviewItem({ review, onVote, isSignedIn }: ReviewItemProps) {
  const userVote = useQuery(
    api.reviews.getUserVoteForReview,
    isSignedIn ? { reviewId: review._id as Id<"reviews"> } : "skip"
  );

  return (
    <div className="rounded-lg bg-gradient-to-r from-white to-amber-50 p-6 shadow-sm">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Avatar>
            <AvatarImage src="/placeholder.svg" alt={review.customerName} />
            <AvatarFallback>{review.customerName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold">{review.customerName}</h4>
              {review.verified && (
                <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800">
                  Verified Purchase
                </span>
              )}
            </div>
            <div className="text-sm text-gray-500">
              {format(new Date(review.createdAt), "MMMM dd, yyyy")}
            </div>
          </div>
        </div>
        <ProductRating rating={review.rating} />
      </div>

      <h5 className="mb-2 font-medium">{review.title}</h5>
      <p className="text-gray-700">{review.comment}</p>

      <div className="mt-4 flex items-center gap-6">
        <div className="flex items-center gap-1">
          <button
            className={`cursor-pointer flex items-center gap-1 text-sm transition-colors ${
              userVote === "helpful"
                ? "text-amber-800 font-medium"
                : "text-gray-500 hover:text-amber-800"
            }`}
            onClick={() => onVote(review._id, true)}
            disabled={!isSignedIn}
          >
            <ThumbsUp className="h-4 w-4" /> {review.helpfulVotes}
          </button>
        </div>
        <div className="flex items-center gap-1">
          <button
            className={`cursor-pointer flex items-center gap-1 text-sm transition-colors ${
              userVote === "unhelpful"
                ? "text-amber-800 font-medium"
                : "text-gray-500 hover:text-amber-800"
            }`}
            onClick={() => onVote(review._id, false)}
            disabled={!isSignedIn}
          >
            <ThumbsDown className="h-4 w-4" /> {review.unhelpfulVotes}
          </button>
        </div>
      </div>
    </div>
  );
}
