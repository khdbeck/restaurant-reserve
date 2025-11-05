"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/header";
import { RestaurantCard } from "@/components/restaurant-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { mockRestaurants } from "@/lib/mock-data";
import type { Restaurant, SearchFilters } from "@/lib/types";
import { MapPin, Filter, X, Search, Star, SortAsc, Utensils } from "lucide-react";
import Link from "next/link";

const cuisineOptions = ["Uzbek", "Central Asian", "Uyghur", "Oriental", "Fine Dining", "Home Style", "Tea House", "Silk Road"];
const priceRangeOptions = ["$", "$$", "$$$"];
const sortOptions = [
  { value: "rating", label: "Highest Rated" },
  { value: "reviews", label: "Most Reviews" },
  { value: "name", label: "Name A-Z" },
  { value: "newest", label: "Newest First" }
];

function RestaurantsPageContent() {
  const searchParams = useSearchParams();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState("rating");
  const [filters, setFilters] = useState<SearchFilters>({
    location: searchParams.get("location") || "",
    date: searchParams.get("date") ? new Date(searchParams.get("date") || "") : null,
    time: searchParams.get("time") || "",
    guests: searchParams.get("guests") ? Number.parseInt(searchParams.get("guests") || "2") : 2,
    cuisine: [],
    priceRange: [],
    rating: undefined,
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      // Apply filters to restaurants
      let filtered = mockRestaurants;

      if (filters.location) {
        const searchTerm = filters.location.toLowerCase();
        filtered = filtered.filter(restaurant =>
          restaurant.city.toLowerCase().includes(searchTerm) ||
          restaurant.address.toLowerCase().includes(searchTerm) ||
          restaurant.name.toLowerCase().includes(searchTerm) ||
          restaurant.cuisine.some(c => c.toLowerCase().includes(searchTerm)) ||
          (searchTerm.includes("plov") && restaurant.cuisine.includes("Uzbek")) ||
          (searchTerm.includes("traditional") && restaurant.features.some(f => f.toLowerCase().includes("traditional"))) ||
          (searchTerm.includes("chaykhana") && restaurant.cuisine.includes("Tea House")) ||
          (searchTerm.includes("silk road") && restaurant.cuisine.includes("Silk Road"))
        );
      }

      if (filters.cuisine && filters.cuisine.length > 0) {
        filtered = filtered.filter(restaurant =>
          filters.cuisine?.some(cuisine => restaurant.cuisine.includes(cuisine))
        );
      }

      if (filters.priceRange && filters.priceRange.length > 0) {
        filtered = filtered.filter(restaurant =>
          filters.priceRange?.includes(restaurant.priceRange)
        );
      }

      if (filters.rating) {
        filtered = filtered.filter(restaurant => restaurant.rating >= (filters.rating || 0));
      }

      // Apply sorting
      filtered = filtered.sort((a, b) => {
        switch (sortBy) {
          case "rating":
            return b.rating - a.rating;
          case "reviews":
            return b.reviewCount - a.reviewCount;
          case "name":
            return a.name.localeCompare(b.name);
          case "newest":
            return (b.isNewlyJoined ? 1 : 0) - (a.isNewlyJoined ? 1 : 0);
          default:
            return 0;
        }
      });

      setRestaurants(filtered);
      setIsLoading(false);
    }, 800);
  }, [filters, sortBy]);

  const clearFilters = () => {
    setFilters({
      location: "",
      date: null,
      time: "",
      guests: 2,
      cuisine: [],
      priceRange: [],
      rating: undefined,
    });
  };

  const toggleCuisineFilter = (cuisine: string) => {
    const currentCuisines = filters.cuisine || [];
    const newCuisines = currentCuisines.includes(cuisine)
      ? currentCuisines.filter(c => c !== cuisine)
      : [...currentCuisines, cuisine];

    setFilters({ ...filters, cuisine: newCuisines });
  };

  const togglePriceRangeFilter = (price: string) => {
    const currentPrices = filters.priceRange || [];
    const newPrices = currentPrices.includes(price)
      ? currentPrices.filter(p => p !== price)
      : [...currentPrices, price];

    setFilters({ ...filters, priceRange: newPrices });
  };

  const getSearchResultsText = () => {
    if (isLoading) return "Searching...";

    const count = restaurants.length;
    const location = filters.location;

    if (count === 0) {
      return location ? `No restaurants found for "${location}"` : "No restaurants found";
    }

    if (location) {
      return `${count} restaurant${count !== 1 ? 's' : ''} found for "${location}"`;
    }

    return `${count} restaurant${count !== 1 ? 's' : ''} in Tashkent`;
  };

  const hasActiveFilters = filters.cuisine?.length || filters.priceRange?.length || filters.rating;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Utensils className="h-6 w-6 text-tablein-blue" />
            <h1 className="text-3xl font-bold">Restaurants</h1>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-muted-foreground flex items-center gap-2">
              {isLoading && <div className="animate-spin h-4 w-4 border-2 border-muted-foreground border-t-transparent rounded-full" />}
              {getSearchResultsText()}
            </div>

            <div className="flex items-center gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SortAsc className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          <div className={`w-80 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                  </h3>
                  <Button variant="ghost" size="sm" onClick={clearFilters} disabled={!hasActiveFilters}>
                    Clear all
                  </Button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Search</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Restaurant name, cuisine, etc."
                        value={filters.location}
                        onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>


                  <div>
                    <label className="text-sm font-medium mb-2 block">Cuisine</label>
                    <div className="flex flex-wrap gap-2">
                      {cuisineOptions.map((cuisine) => (
                        <Badge
                          key={cuisine}
                          variant={filters.cuisine?.includes(cuisine) ? "default" : "outline"}
                          className="cursor-pointer hover:bg-primary/20"
                          onClick={() => toggleCuisineFilter(cuisine)}
                        >
                          {cuisine}
                        </Badge>
                      ))}
                    </div>
                  </div>


                  <div>
                    <label className="text-sm font-medium mb-2 block">Price Range</label>
                    <div className="flex gap-2">
                      {priceRangeOptions.map((price) => (
                        <Badge
                          key={price}
                          variant={filters.priceRange?.includes(price) ? "default" : "outline"}
                          className="cursor-pointer hover:bg-primary/20 flex-1 justify-center"
                          onClick={() => togglePriceRangeFilter(price)}
                        >
                          {price}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Minimum Rating</label>
                    <Select value={filters.rating?.toString() || ""} onValueChange={(value) => setFilters({ ...filters, rating: value ? Number.parseFloat(value) : undefined })}>
                      <SelectTrigger>
                        <Star className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Any rating" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any rating</SelectItem>
                        <SelectItem value="8">8.0+ stars</SelectItem>
                        <SelectItem value="9">9.0+ stars</SelectItem>
                        <SelectItem value="9.5">9.5+ stars</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Quick Filters</label>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => setFilters({ ...filters, location: "Traditional Uzbek" })}
                      >
                        Traditional Uzbek Cuisine
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => setFilters({ ...filters, priceRange: ["$$$"] })}
                      >
                        Fine Dining
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => setFilters({ ...filters, location: "Plov houses" })}
                      >
                        Best Plov Houses
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-4">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="w-full"
              >
                <Filter className="h-4 w-4 mr-2" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-2">
                    Active
                  </Badge>
                )}
              </Button>
            </div>

            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium">Active filters:</span>
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="h-4 w-4 mr-1" />
                    Clear all
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {filters.cuisine?.map((cuisine) => (
                    <Badge key={cuisine} variant="secondary" className="cursor-pointer" onClick={() => toggleCuisineFilter(cuisine)}>
                      {cuisine} <X className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                  {filters.priceRange?.map((price) => (
                    <Badge key={price} variant="secondary" className="cursor-pointer" onClick={() => togglePriceRangeFilter(price)}>
                      {price} <X className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                  {filters.rating && (
                    <Badge variant="secondary" className="cursor-pointer" onClick={() => setFilters({ ...filters, rating: undefined })}>
                      {filters.rating}+ stars <X className="h-3 w-3 ml-1" />
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }, (_, i) => (
                  <Card key={`skeleton-placeholder-${Date.now()}-${i}`} className="overflow-hidden">
                    <div className="aspect-[4/3] bg-muted animate-pulse" />
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="h-4 bg-muted rounded animate-pulse" />
                        <div className="h-3 bg-muted rounded animate-pulse w-3/4" />
                        <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Restaurant Grid */}
            {!isLoading && restaurants.length > 0 && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {restaurants.map((restaurant, index) => (
                  <RestaurantCard
                    key={restaurant.id}
                    restaurant={restaurant}
                    index={index}
                  />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!isLoading && restaurants.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Utensils className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No restaurants found</h3>
                <p className="text-muted-foreground mb-6">
                  {filters.location ?
                    `We couldn't find any restaurants matching "${filters.location}". Try adjusting your search or filters.` :
                    "Try adjusting your filters to see more results."
                  }
                </p>
                <div className="flex gap-2 justify-center">
                  <Button onClick={clearFilters} variant="outline">
                    Clear filters
                  </Button>
                  <Button asChild>
                    <Link href="/">Browse all restaurants</Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RestaurantsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background">
        <Header />
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin h-8 w-8 border-2 border-tablein-blue border-t-transparent rounded-full" />
          </div>
        </div>
      </div>
    }>
      <RestaurantsPageContent />
    </Suspense>
  );
}
