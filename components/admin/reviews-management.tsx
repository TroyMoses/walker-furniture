"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Eye,
  Star,
  ThumbsUp,
  ThumbsDown,
  Search,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { format } from "date-fns";
import type { Id } from "@/convex/_generated/dataModel";

export function ReviewsManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  type Review = NonNullable<
    ReturnType<typeof useQuery<typeof api.reviews.getAllReviews>>
  >[number];
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  const reviews = useQuery(api.reviews.getAllReviews, {});
  const updateReviewStatus = useMutation(api.reviews.updateReviewStatus);
  const deleteReview = useMutation(api.reviews.deleteReview);

  const filteredReviews = reviews?.filter((review) => {
    const matchesSearch =
      review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || review.status === statusFilter;
    const matchesRating =
      ratingFilter === "all" || review.rating.toString() === ratingFilter;
    return matchesSearch && matchesStatus && matchesRating;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "approved":
        return <CheckCircle className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const handleStatusUpdate = async (
    reviewId: Id<"reviews">,
    newStatus: string
  ) => {
    try {
      await updateReviewStatus({ reviewId, status: newStatus });
    } catch (error) {
      console.error("Failed to update review status:", error);
    }
  };

  const handleDelete = async (reviewId: Id<"reviews">) => {
    if (confirm("Are you sure you want to delete this review?")) {
      try {
        await deleteReview({ reviewId });
      } catch (error) {
        console.error("Failed to delete review:", error);
      }
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
      />
    ));
  };

  if (!reviews) {
    return <div>Loading reviews...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search reviews by customer, product, or content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48 cursor-pointer">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="cursor-pointer">All Reviews</SelectItem>
            <SelectItem value="pending" className="cursor-pointer">Pending</SelectItem>
            <SelectItem value="approved" className="cursor-pointer">Approved</SelectItem>
            <SelectItem value="rejected" className="cursor-pointer">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <Select value={ratingFilter} onValueChange={setRatingFilter}>
          <SelectTrigger className="w-full sm:w-32 cursor-pointer">
            <SelectValue placeholder="Rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="cursor-pointer">All Ratings</SelectItem>
            <SelectItem value="5" className="cursor-pointer">5 Stars</SelectItem>
            <SelectItem value="4" className="cursor-pointer">4 Stars</SelectItem>
            <SelectItem value="3" className="cursor-pointer">3 Stars</SelectItem>
            <SelectItem value="2" className="cursor-pointer">2 Stars</SelectItem>
            <SelectItem value="1" className="cursor-pointer">1 Star</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Product Reviews ({filteredReviews?.length || 0})
          </CardTitle>
          <CardDescription>
            Moderate customer reviews and ratings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Review</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReviews?.map((review) => (
                  <TableRow key={review._id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{review.customerName}</div>
                        <div className="text-sm text-gray-500">
                          {review.customerEmail}
                        </div>
                        {review.verified && (
                          <Badge variant="secondary" className="text-xs mt-1">
                            Verified Purchase
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{review.productName}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {renderStars(review.rating)}
                        <span className="ml-1 text-sm">({review.rating})</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="text-sm truncate">{review.comment}</p>
                        {review.helpfulVotes > 0 && (
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <ThumbsUp className="h-3 w-3" />
                              {review.helpfulVotes}
                            </span>
                            {review.unhelpfulVotes > 0 && (
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <ThumbsDown className="h-3 w-3" />
                                {review.unhelpfulVotes}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(review.status)}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(review.status)}
                          {review.status}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(review._creationTime), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedReview(review)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Review Details</DialogTitle>
                              <DialogDescription>
                                Review by {selectedReview?.customerName}
                              </DialogDescription>
                            </DialogHeader>
                            {selectedReview && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-medium">
                                      Customer Information
                                    </h4>
                                    <p>{selectedReview.customerName}</p>
                                    <p className="text-sm text-gray-500">
                                      {selectedReview.customerEmail}
                                    </p>
                                    {selectedReview.verified && (
                                      <Badge
                                        variant="secondary"
                                        className="text-xs mt-1"
                                      >
                                        Verified Purchase
                                      </Badge>
                                    )}
                                  </div>
                                  <div>
                                    <h4 className="font-medium">Product</h4>
                                    <p>{selectedReview.productName}</p>
                                    <div className="flex items-center gap-1 mt-1">
                                      {renderStars(selectedReview.rating)}
                                      <span className="ml-1">
                                        ({selectedReview.rating}/5)
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-medium">Review</h4>
                                  <div className="p-3 bg-gray-50 rounded-lg">
                                    <h5 className="font-medium mb-2">
                                      {selectedReview.title}
                                    </h5>
                                    <p className="whitespace-pre-wrap">
                                      {selectedReview.comment}
                                    </p>
                                  </div>
                                </div>
                                {(selectedReview.helpfulVotes > 0 ||
                                  selectedReview.unhelpfulVotes > 0) && (
                                  <div>
                                    <h4 className="font-medium">Helpfulness</h4>
                                    <div className="flex items-center gap-4">
                                      <span className="flex items-center gap-1">
                                        <ThumbsUp className="h-4 w-4 text-green-600" />
                                        {selectedReview.helpfulVotes} helpful
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <ThumbsDown className="h-4 w-4 text-red-600" />
                                        {selectedReview.unhelpfulVotes} not
                                        helpful
                                      </span>
                                    </div>
                                  </div>
                                )}
                                <div>
                                  <h4 className="font-medium mb-2">
                                    Update Status
                                  </h4>
                                  <div className="flex gap-2">
                                    <Select
                                      value={selectedReview.status}
                                      onValueChange={(value) =>
                                        handleStatusUpdate(
                                          selectedReview._id,
                                          value
                                        )
                                      }
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="pending">
                                          Pending
                                        </SelectItem>
                                        <SelectItem value="approved">
                                          Approved
                                        </SelectItem>
                                        <SelectItem value="rejected">
                                          Rejected
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <Button
                                      variant="destructive"
                                      onClick={() =>
                                        handleDelete(selectedReview._id)
                                      }
                                    >
                                      Delete Review
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Select
                          value={review.status}
                          onValueChange={(value) =>
                            handleStatusUpdate(review._id, value)
                          }
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
