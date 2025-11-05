"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar, Users, MapPin, Clock, Utensils } from "lucide-react";
import Link from "next/link";
import { mockRestaurants } from "@/lib/mock-data";
import type { Restaurant } from "@/lib/types";

// Define reservation type based on restaurant + table
type Reservation = {
    id: string;
    restaurant: Restaurant;
    tableNumber: string;
    seats: number;
    date: Date;
    features?: string[];
};

export default function ReservedTables() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (status === "loading") return;

        if (!session) {
            router.push("/auth/signin?callbackUrl=/reserved-tables");
            return;
        }

        // Simulate "user's reserved tables" by extracting reserved ones from mock data
        const userReservations: Reservation[] = [];
        mockRestaurants.forEach((restaurant) => {
            if (restaurant.layout) {
                restaurant.layout.tables
                    .filter((t) => t.status === "reserved") // only reserved tables
                    .forEach((t, idx) => {
                        userReservations.push({
                            id: `${restaurant.id}-res-${idx}`,
                            restaurant,
                            tableNumber: t.number,
                            seats: t.seats,
                            date: new Date(), // mock current date for demo
                            features: t.features,
                        });
                    });
            }
        });

        setReservations(userReservations);
        setIsLoading(false);
    }, [session, status, router]);

    if (status === "loading" || isLoading) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                        <p className="text-muted-foreground">Loading your reservations...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!session) {
        return null;
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <div className="mx-auto max-w-5xl px-6 py-8 lg:px-8">
                <h1 className="text-2xl font-bold mb-6">My Reserved Tables</h1>

                {reservations.length === 0 ? (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <Utensils className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
                            <h2 className="text-2xl font-bold mb-4">No Reservations Found</h2>
                            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                                You don’t have any reserved tables yet. Browse restaurants and make your first reservation.
                            </p>
                            <Button asChild className="bg-tablein-blue hover:bg-tablein-blue/90">
                                <Link href="/restaurant">Browse Restaurants</Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {reservations.map((res) => (
                            <Card key={res.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                <img
                                    src={res.restaurant.image}
                                    alt={res.restaurant.name}
                                    className="h-40 w-full object-cover"
                                />
                                <CardContent className="p-4 space-y-3">
                                    <h3 className="text-lg font-semibold">{res.restaurant.name}</h3>
                                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                                        <MapPin className="h-4 w-4" /> {res.restaurant.address}
                                    </p>

                                    <div className="space-y-1 text-sm">
                                        <p className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-blue-500" />
                                            {res.date.toLocaleDateString()} at{" "}
                                            {res.date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <Users className="h-4 w-4 text-green-500" />
                                            {res.seats} seats
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-yellow-500" />
                                            Table {res.tableNumber}
                                        </p>
                                    </div>

                                    {res.features && res.features.length > 0 && (
                                        <p className="text-xs text-muted-foreground">
                                            <strong>Features:</strong> {res.features.join(", ")}
                                        </p>
                                    )}

                                    <div className="flex gap-3 pt-2">
                                        <Button asChild variant="outline" size="sm">
                                            <Link href={`/restaurant/${res.restaurant.slug}`}>View Restaurant</Link>
                                        </Button>
                                        <Button asChild variant="outline" size="sm">
                                            <Link href={`/booking/${res.id}`}>View Booking</Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
