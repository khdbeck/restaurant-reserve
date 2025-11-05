"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import type { Restaurant, Review } from "@/lib/types";
import { Star, ThumbsUp, Calendar, CheckCircle } from "lucide-react";
import { format } from "date-fns";

interface RestaurantReviewsProps {
  restaurant: Restaurant;
}

export function RestaurantReviews({ restaurant }: RestaurantReviewsProps) {
  const { data: session } = useSession();
  const [newReview, setNewReview] = useState({ rating: 5, title: "", comment: "" });
  const [showReviewForm, setShowReviewForm] = useState(false);

  const reviews = restaurant.reviews || [];
  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(review => review.rating === star).length,
    percentage: reviews.length > 0 ? (reviews.filter(review => review.rating === star).length / reviews.length) * 100 : 0
  }));

  const handleSubmitReview = () => {
    if (!session) return;

    // In a real app, this would submit to the API
    console.log("Submitting review:", newReview);

    // Reset form
    setNewReview({ rating: 5, title: "", comment: "" });
    setShowReviewForm(false);
  };

  const renderStars = (rating: number, size: "sm" | "md" | "lg" = "md") => {
    const starSize = size === "sm" ? "h-3 w-3" : size === "lg" ? "h-6 w-6" : "h-4 w-4";

    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            className={`${starSize} ${
              star <= rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Reviews & Ratings</span>
            {session && (
              <Button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="bg-tablein-blue hover:bg-tablein-blue/90"
              >
                Write Review
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Overall Rating */}
            <div className="text-center">
              <div className="text-4xl font-bold text-tablein-blue mb-2">
                {averageRating.toFixed(1)}
              </div>
              {renderStars(Math.round(averageRating), "lg")}
              <p className="text-muted-foreground mt-2">
                Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="space-y-2">
              {ratingDistribution.map(({ star, count, percentage }) => (
                <div key={star} className="flex items-center gap-3">
                  <span className="text-sm font-medium w-6">{star}</span>
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-8">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {showReviewForm && session && (
        <Card>
          <CardHeader>
            <CardTitle>Write a Review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Rating</label>
              <Select
                value={newReview.rating.toString()}
                onValueChange={(value) => setNewReview(prev => ({ ...prev, rating: Number.parseInt(value) }))}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[5, 4, 3, 2, 1].map(rating => (
                    <SelectItem key={rating} value={rating.toString()}>
                      <div className="flex items-center gap-2">
                        <span>{rating}</span>
                        {renderStars(rating, "sm")}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Review Title</label>
              <input
                type="text"
                placeholder="Summarize your experience..."
                value={newReview.title}
                onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                className="w-full p-2 border rounded-md mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Your Review</label>
              <Textarea
                placeholder="Tell us about your dining experience..."
                value={newReview.comment}
                onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                className="mt-1 min-h-20"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleSubmitReview}
                disabled={!newReview.title || !newReview.comment}
                className="bg-tablein-blue hover:bg-tablein-blue/90"
              >
                Submit Review
              </Button>
              <Button variant="outline" onClick={() => setShowReviewForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No reviews yet. Be the first to share your experience!</p>
            </CardContent>
          </Card>
        ) : (
          reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-10 w-10 bg-tablein-blue text-white">
                      {review.userName.charAt(0).toUpperCase()}
                    </Avatar>
                    <div>
                      <div className="font-medium">{review.userName}</div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {format(review.date, 'MMM dd, yyyy')}
                        {review.verified && (
                          <Badge variant="secondary" className="text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  {renderStars(review.rating)}
                </div>

                <div className="space-y-3">
                  {review.title && (
                    <h4 className="font-medium">{review.title}</h4>
                  )}
                  <p className="text-muted-foreground">{review.comment}</p>

                  {review.photos && review.photos.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-4">
                      {review.photos.slice(0, 3).map((photo, index) => (
                        <img
                          key={index}
                          src={photo}
                          alt="Review photo"
                          className="w-full h-20 object-cover rounded"
                        />
                      ))}
                    </div>
                  )}

                  <Separator />

                  <div className="flex items-center justify-between">
                    <Button variant="ghost" size="sm" className="gap-2">
                      <ThumbsUp className="h-4 w-4" />
                      Helpful ({review.helpful})
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
