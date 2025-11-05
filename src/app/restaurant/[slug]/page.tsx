import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { RestaurantBooking } from "@/components/restaurant-booking";
import { RestaurantGallery } from "@/components/restaurant-gallery";
import { RestaurantReviews } from "@/components/restaurant-reviews";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { mockRestaurants } from "@/lib/mock-data";
import {
  MapPin,
  Clock,
  Star,
  Award,
  Phone,
  Globe,
  ChefHat,
  Wine,
  Car,
  Wifi,
  CreditCard
} from "lucide-react";
import Link from "next/link";

interface RestaurantPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function RestaurantPage({ params }: RestaurantPageProps) {
  const { slug } = await params;
  const restaurant = mockRestaurants.find(r => r.slug === slug);

  if (!restaurant) {
    notFound();
  }

  const formatOpeningHours = (day: string) => {
    const hours = restaurant.openingHours[day.toLowerCase()];
    if (hours.closed) return "Closed";
    return `${hours.open} - ${hours.close}`;
  };

  const getCurrentDayStatus = () => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const hours = restaurant.openingHours[today];
    if (hours.closed) return "Closed";

    const now = new Date();
    const currentTime = now.getHours() * 100 + now.getMinutes();
    const openTime = Number.parseInt(hours.open.replace(':', ''));
    const closeTime = Number.parseInt(hours.close.replace(':', ''));

    if (currentTime >= openTime && currentTime <= closeTime) {
      return "Open now";
    }
    return `Opens at ${hours.open}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-foreground">Home</Link></li>
            <li>/</li>
            <li><Link href="/restaurants" className="hover:text-foreground">Restaurants</Link></li>
            <li>/</li>
            <li className="text-foreground">{restaurant.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-4xl font-bold">{restaurant.name}</h1>
                {restaurant.isMichelinGuide && (
                  <Badge className="bg-tablein-gold hover:bg-tablein-gold/90 text-white">
                    <Award className="h-4 w-4 mr-1" />
                    Michelin Guide
                  </Badge>
                )}
                {restaurant.isNewlyJoined && (
                  <Badge className="bg-green-600 hover:bg-green-600/90 text-white">
                    New
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-4 text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{restaurant.address}</span>
                </div>
                <span>•</span>
                <span>{restaurant.cuisine.join(", ")}</span>
                <span>•</span>
                <span>{restaurant.priceRange}</span>
              </div>

              {restaurant.rating > 0 && (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-lg">{restaurant.rating.toFixed(2)}</span>
                    <span className="text-muted-foreground">({restaurant.reviewCount} reviews)</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-600">
                    <Clock className="h-4 w-4" />
                    <span className="font-medium">{getCurrentDayStatus()}</span>
                  </div>
                </div>
              )}
            </div>

            <RestaurantGallery images={restaurant.images} name={restaurant.name} />

            {/* Description */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">About</h3>
                <p className="text-muted-foreground">{restaurant.description}</p>
              </CardContent>
            </Card>

            {/* Features */}
            {restaurant.features && restaurant.features.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Features & Amenities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {restaurant.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2 text-sm">
                        <ChefHat className="h-4 w-4 text-tablein-blue" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Opening Hours</h3>
                <div className="space-y-2">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                    <div key={day} className="flex justify-between items-center py-1">
                      <span className="font-medium">{day}</span>
                      <span className="text-muted-foreground">{formatOpeningHours(day)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <RestaurantReviews restaurant={restaurant} />
              </CardContent>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <RestaurantBooking restaurant={restaurant} />

              {/* Contact Info */}
              <Card className="mt-6">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">Address</div>
                        <div className="text-sm text-muted-foreground">{restaurant.address}</div>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">Phone</div>
                        <div className="text-sm text-muted-foreground">+371 123 45678</div>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-center gap-3">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">Website</div>
                        <Link href="#" className="text-sm text-tablein-blue hover:underline">
                          Visit website
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Info */}
              <Card className="mt-6">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Good to Know</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <span>Cards accepted</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Wifi className="h-4 w-4 text-muted-foreground" />
                      <span>Free WiFi</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Car className="h-4 w-4 text-muted-foreground" />
                      <span>Parking available</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Wine className="h-4 w-4 text-muted-foreground" />
                      <span>Wine & cocktails</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return mockRestaurants.map((restaurant) => ({
    slug: restaurant.slug,
  }));
}
