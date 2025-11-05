"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CalendarIcon, Search, MapPin, Users, Clock, TrendingUp, Star } from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { mockRestaurants } from "@/lib/mock-data";

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState(2);
  const [showQuickResults, setShowQuickResults] = useState(false);
  const router = useRouter();

  // Filter restaurants based on search query for quick results
  const filteredRestaurants = searchQuery.length > 0
    ? mockRestaurants.filter(restaurant =>
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.cuisine.some(c => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
        restaurant.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (searchQuery.toLowerCase().includes("plov") && restaurant.cuisine.includes("Uzbek")) ||
        (searchQuery.toLowerCase().includes("traditional") && restaurant.features.some(f => f.toLowerCase().includes("traditional")))
      ).slice(0, 3)
    : [];

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("location", searchQuery);
    if (date) params.set("date", date.toISOString());
    if (time) params.set("time", time);
    params.set("guests", guests.toString());

    router.push(`/restaurants?${params.toString()}`);
  };

  const handleQuickSelect = (restaurant: typeof mockRestaurants[0]) => {
    setSearchQuery(restaurant.name);
    setShowQuickResults(false);
    router.push(`/restaurant/${restaurant.slug}`);
  };

  const popularSearches = [
    "Traditional Plov",
    "Lagman Noodles",
    "Tea House",
    "Fine Dining",
    "Family Style",
    "Wedding Plov"
  ];

  return (
    <section className="relative text-white">
      <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 " />
      <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Discover Tashkent's Best
            <span className="block text-yellow-400">Uzbek Restaurants</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-blue-100 sm:text-xl lg:mb-12">
            From traditional plov houses to modern Uzbek cuisine, find and book the perfect dining experience in Tashkent
          </p>
        </div>


        <div className="mx-auto max-w-4xl dark:bg-black dark:text-white">
          <Card className="bg-white/95 backdrop-blur-sm shadow-xl dark:bg-black dark:text-white">
            <CardContent className="p-4 lg:p-6">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-2 ">
                <div className="relative lg:col-span-5">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search restaurants, cuisine, or dishes..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowQuickResults(e.target.value.length > 0);
                    }}
                    onFocus={() => setShowQuickResults(searchQuery.length > 0)}
                    className="pl-10 h-12 text-base"
                  />


                  {showQuickResults && filteredRestaurants.length > 0 && (
                    <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      <div className="p-2">
                        {filteredRestaurants.map((restaurant) => (
                          <button
                            key={restaurant.id}
                            onClick={() => handleQuickSelect(restaurant)}
                            className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded text-left"
                          >
                            <div className="w-8 h-8 bg-tablein-blue/10 rounded flex items-center justify-center">
                              <Star className="h-4 w-4 text-tablein-blue" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{restaurant.name}</p>
                              <p className="text-xs text-muted-foreground">{restaurant.cuisine.join(", ")}</p>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-yellow-400 fill-current" />
                              <span className="text-xs font-medium">{restaurant.rating}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>


                <div className="lg:col-span-2 dark:bg-black dark:text-white">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full h-12 justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "MMM dd") : "Date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="lg:col-span-2">
                  <Select value={time} onValueChange={setTime}>
                    <SelectTrigger className="h-12">
                      <Clock className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Time" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 14 }, (_, i) => {
                        const hour = i + 11;
                        const timeStr = `${hour}:00`;
                        return (
                          <SelectItem key={timeStr} value={timeStr}>
                            {timeStr}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="lg:col-span-2">
                  <Select value={guests.toString()} onValueChange={(value) => setGuests(Number.parseInt(value))}>
                    <SelectTrigger className="h-12">
                      <Users className="mr-2 h-4 w-4" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? "guest" : "guests"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>


                <div className="lg:col-span-1">
                  <Button onClick={handleSearch} className="w-full dark:text-white h-12 bg-tablein-blue hover:bg-tablein-blue/90">
                    <Search className="h-4 w-4 lg:mr-0 mr-2" />
                    <span className="lg:hidden">Search</span>
                  </Button>
                </div>
              </div>

              <div className="mt-4 lg:hidden">
                <p className="text-sm text-muted-foreground mb-2">Popular searches:</p>
                <div className="flex flex-wrap gap-2 text-black dark:bg-black dark:text-white">
                  {popularSearches.map((search) => (
                    <button
                      key={search}
                      onClick={() => {
                        setSearchQuery(search);
                        setShowQuickResults(true);
                      }}
                      className="dark:bg-gray-900 dark:text-white text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 lg:hidden">
          <div className="grid grid-cols-2 gap-4">
            <Button asChild variant="secondary" className="dark:text-white dark:bg-black text-black h-12 bg-white/90 text-tablein-blue hover:bg-white">
              <Link href="/restaurants" className="text-black ">
                <TrendingUp className="mr-2 h-4 w-4" />
                Browse All
              </Link>
            </Button>
            <Button asChild variant="secondary" className="dark:text-white dark:bg-black h-12 bg-white/90 text-tablein-blue hover:bg-white">
              <Link href="/restaurants?location=" className="text-black">
                <MapPin className="mr-2 h-4 w-4" />
                Near Me
              </Link>
            </Button>
          </div>
        </div>


        <div className="hidden lg:flex justify-center mt-8 space-x-6">
          <Button asChild variant="ghost" className="text-white hover:text-yellow-300 hover:bg-white/10">
            <Link href="/restaurants?location=Traditional Uzbek">
              Traditional Plov Houses
            </Link>
          </Button>
          <Button asChild variant="ghost" className="text-white hover:text-yellow-300 hover:bg-white/10">
            <Link href="/restaurants?priceRange=₩₩₩">
              Fine Dining
            </Link>
          </Button>
          <Button asChild variant="ghost" className="text-white hover:text-yellow-300 hover:bg-white/10">
            <Link href="/restaurants?location=Tea House">
              Traditional Tea Houses
            </Link>
          </Button>
        </div>


        <div className="mt-12 lg:mt-16 grid grid-cols-2 gap-6 lg:grid-cols-4 lg:gap-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-300 lg:text-3xl">12</div>
            <div className="text-sm text-blue-100">Restaurants</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-300 lg:text-3xl">1200+</div>
            <div className="text-sm text-blue-100">Happy Guests</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-300 lg:text-3xl">1100</div>
            <div className="text-sm text-blue-100">This Month</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-300 lg:text-3xl">9.1</div>
            <div className="text-sm text-blue-100">Avg Rating</div>
          </div>
        </div>
      </div>
    </section>
  );
}
