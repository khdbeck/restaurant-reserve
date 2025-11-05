import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { RestaurantCard } from "@/components/restaurant-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  getRecentlyBookedRestaurants,
  getBestRatedRestaurants,
  getNewlyJoinedRestaurants,
  mockStatistics,
  mockBlogPosts
} from "@/lib/mock-data";
import { Calendar, Mail, Star, TrendingUp, Users, MapPin, ExternalLink, Award, Clock, ChefHat, Utensils } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  const recentlyBookedRestaurants = getRecentlyBookedRestaurants();
  const bestRatedRestaurants = getBestRatedRestaurants();
  const newlyJoinedRestaurants = getNewlyJoinedRestaurants();

  // Get top restaurants for mobile featured section
  const featuredRestaurants = bestRatedRestaurants.slice(0, 4);

  return (
    <div className="min-h-screen bg-background dark:bg-black">
      <Header />
      <HeroSection />

      {/* Mobile Featured Restaurants - Show immediately after hero */}
      <section className="py-8 lg:hidden dark:bg-black bg-gray-50">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold">Featured Restaurants</h2>
            <p className="text-muted-foreground">Popular choices in Tashkent</p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {featuredRestaurants.map((restaurant, index) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} index={index} />
            ))}
          </div>
          <div className="text-center mt-6">
            <Button asChild className="bg-tablein-blue hover:bg-tablein-blue/90">
              <Link href="/restaurants">
                View All Restaurants
                <ChefHat className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <main className="dark:bg-black mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-12">

        <section className="mb-12 lg:mb-16">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight lg:text-3xl">Recently Booked</h2>
              <p className="text-muted-foreground">Popular restaurants with recent reservations</p>
            </div>
            <Button variant="outline" asChild className="hidden lg:flex">
              <Link href="/restaurants">
                View All
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {recentlyBookedRestaurants.map((restaurant, index) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} index={index} />
            ))}
          </div>

          <div className="mt-6 text-center lg:hidden">
            <Button asChild className="bg-tablein-blue hover:bg-tablein-blue/90">
              <Link href="/restaurants">
                View All Restaurants
              </Link>
            </Button>
          </div>
        </section>

        <section className="mb-12 lg:mb-16">
          <Card className="bg-gradient-to-r from-tablein-blue to-blue-600 text-white">
            <CardContent className="p-6 lg:p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2 lg:text-3xl">Tablein Tashkent</h2>
                <p className="text-blue-100">Connecting food lovers with amazing restaurants</p>
              </div>
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-300 lg:text-3xl">
                    {mockStatistics.totalRestaurants}
                  </div>
                  <div className="text-sm text-blue-100">Restaurants</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-300 lg:text-3xl">
                    {(mockStatistics.totalGuests / 1000000).toFixed(1)}M+
                  </div>
                  <div className="text-sm text-blue-100">Happy Guests</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-300 lg:text-3xl">
                    {(mockStatistics.guestsLastMonth / 1000).toFixed(0)}K
                  </div>
                  <div className="text-sm text-blue-100">This Month</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-300 lg:text-3xl">9.4</div>
                  <div className="text-sm text-blue-100">Avg Rating</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mb-12 hidden lg:block lg:mb-16">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight lg:text-3xl">
                <Award className="mr-2 inline h-6 w-6 text-yellow-500" />
                Award Winners 2024
              </h2>
              <p className="text-muted-foreground">Best rated restaurants in Tashkent</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/restaurants?rating=9">
                View All Winners
                <Star className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {bestRatedRestaurants.slice(0, 8).map((restaurant, index) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} index={index} />
            ))}
          </div>
        </section>



        {/* Newly Joined Section */}
        <section className="mb-12 lg:mb-16">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight lg:text-3xl">
                <TrendingUp className="mr-2 inline h-6 w-6 text-green-500" />
                New on Tablein
              </h2>
              <p className="text-muted-foreground">Recently joined restaurants you should try</p>
            </div>
            <Button variant="outline" asChild className="hidden lg:flex">
              <Link href="/restaurants">
                Explore All
                <MapPin className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {newlyJoinedRestaurants.map((restaurant, index) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} index={index} />
            ))}
          </div>

          {/* Mobile View All Button */}
          <div className="mt-6 text-center lg:hidden">
            <Button asChild variant="outline">
              <Link href="/restaurants">
                Explore All New Restaurants
              </Link>
            </Button>
          </div>
        </section>

        {/* Quick Actions for Mobile */}
        <section className="mb-12 lg:hidden">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Button asChild variant="outline" className="h-16 flex-col">
              <Link href="/restaurants?location=Traditional Uzbek">
                <Utensils className="h-6 w-6 mb-1" />
                <span className="text-sm">Traditional</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-16 flex-col">
              <Link href="/restaurants?priceRange=₩₩₩">
                <Star className="h-6 w-6 mb-1" />
                <span className="text-sm">Fine Dining</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-16 flex-col">
              <Link href="/restaurants?location=Tea House">
                <Clock className="h-6 w-6 mb-1" />
                <span className="text-sm">Tea Houses</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-16 flex-col">
              <Link href="/add-restaurant">
                <Award className="h-6 w-6 mb-1" />
                <span className="text-sm">Add Restaurant</span>
              </Link>
            </Button>
          </div>
        </section>

        <section className="mb-12 lg:mb-16">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight lg:text-3xl">Food & Culture</h2>
              <p className="text-muted-foreground">Discover Uzbek culinary traditions</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {mockBlogPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video relative">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-4 lg:p-6">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <h3 className="font-semibold mb-2 line-clamp-2 lg:text-lg">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{post.author}</span>
                    <span>{post.publishedDate.toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
