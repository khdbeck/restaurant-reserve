"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { RestaurantDashboard } from '@/components/restaurant-dashboard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockRestaurants } from '@/lib/mock-data';
import type { Restaurant, RestaurantLayout } from '@/lib/types';
import { Building2, Plus, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock owner data - in production, this would come from the API
  const isOwner = session?.user?.email === 'admin@tablein.uz';
  const ownedRestaurantIds = ['besh-qozon', 'yujanin']; // Mock owned restaurants

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/auth/signin?callbackUrl=/dashboard');
      return;
    }

    if (!isOwner) {
      router.push('/');
      return;
    }

    const ownedRestaurants = mockRestaurants.filter(r => ownedRestaurantIds.includes(r.id));
    setRestaurants(ownedRestaurants);

    if (ownedRestaurants.length > 0) {
      setSelectedRestaurant(ownedRestaurants[0]);
    }

    setIsLoading(false);
  }, [session, status, router, isOwner]);

  const handleLayoutUpdate = (layout: RestaurantLayout) => {
    if (!selectedRestaurant) return;

    // Update the restaurant with new layout
    const updatedRestaurant = {
      ...selectedRestaurant,
      layout: { ...layout, updatedAt: new Date() }
    };

    setSelectedRestaurant(updatedRestaurant);

    // Update in restaurants list
    setRestaurants(prev =>
      prev.map(r => r.id === selectedRestaurant.id ? updatedRestaurant : r)
    );

    // In production, this would save to the backend
    console.log('Layout updated for restaurant:', selectedRestaurant.id, layout);
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!session || !isOwner) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        {restaurants.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Building2 className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
              <h2 className="text-2xl font-bold mb-4">Welcome to Tablein Dashboard</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                You don't have any restaurants registered yet. Add your first restaurant to start managing bookings and layouts.
              </p>
              <Button asChild className="bg-tablein-blue hover:bg-tablein-blue/90">
                <Link href="/add-restaurant">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Restaurant
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Restaurant Selector */}
            {restaurants.length > 1 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Your Restaurants</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {restaurants.map(restaurant => (
                      <button
                        key={restaurant.id}
                        onClick={() => setSelectedRestaurant(restaurant)}
                        className={`p-4 border-2 rounded-lg text-left transition-all ${
                          selectedRestaurant?.id === restaurant.id
                            ? 'border-tablein-blue bg-blue-50 dark:bg-blue-950'
                            : 'border-muted hover:border-muted-foreground'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <img
                            src={restaurant.image}
                            alt={restaurant.name}
                            className="w-12 h-12 rounded object-cover"
                          />
                          <div className="flex-1">
                            <h3 className="font-medium">{restaurant.name}</h3>
                            <p className="text-sm text-muted-foreground truncate">
                              {restaurant.address}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                                {restaurant.rating} ⭐
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {restaurant.reviewCount} reviews
                              </span>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Restaurant Dashboard */}
            {selectedRestaurant && (
              <RestaurantDashboard
                restaurant={selectedRestaurant}
                onLayoutUpdateAction={handleLayoutUpdate}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
