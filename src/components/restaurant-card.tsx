"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Clock, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Restaurant } from "@/lib/types";
import { motion } from "framer-motion";

interface RestaurantCardProps {
  restaurant: Restaurant;
  showBookingInfo?: boolean;
  index?: number;
}

export function RestaurantCard({ restaurant, showBookingInfo = false, index = 0 }: RestaurantCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-0 shadow-md">
        <Link href={`/restaurant/${restaurant.slug}`}>
          <div className="relative">
            <div className="aspect-[4/3] relative overflow-hidden">
              <Image
                src={restaurant.image}
                alt={restaurant.name}
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>

            {restaurant.isMichelinGuide && (
              <Badge className="absolute top-3 left-3 bg-tablein-gold hover:bg-tablein-gold/90 text-white font-semibold">
                <Award className="h-3 w-3 mr-1" />
                Guide Michelin
              </Badge>
            )}

            {restaurant.isNewlyJoined && (
              <Badge className="absolute top-3 right-3 bg-green-600 hover:bg-green-600/90 text-white">
                New
              </Badge>
            )}
          </div>

          <CardContent className="p-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg line-clamp-1">{restaurant.name}</h3>

              <p className="text-sm text-muted-foreground line-clamp-2">
                {restaurant.address}
              </p>

              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">{restaurant.cuisine.join(", ")}</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">{restaurant.priceRange}</span>
              </div>

              {restaurant.rating > 0 && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{restaurant.rating.toFixed(2)}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {restaurant.reviewCount} reviews
                  </span>
                </div>
              )}

              {showBookingInfo && restaurant.recentlyBooked && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>Booked {restaurant.recentlyBooked}</span>
                </div>
              )}

              {restaurant.features && restaurant.features.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {restaurant.features.slice(0, 3).map((feature) => (
                    <Badge key={feature} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Link>
      </Card>
    </motion.div>
  );
}
