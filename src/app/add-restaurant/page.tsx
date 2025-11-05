"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Upload, MapPin, Phone, Globe, Check, Utensils } from "lucide-react";

const addRestaurantSchema = z.object({
  name: z.string().min(2, "Restaurant name must be at least 2 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  address: z.string().min(10, "Please provide a complete address"),
  city: z.string().min(2, "City is required"),
  phone: z.string().min(8, "Please provide a valid phone number"),
  email: z.string().email("Please provide a valid email address"),
  website: z.string().url("Please provide a valid website URL").optional().or(z.literal("")),
  cuisine: z.array(z.string()).min(1, "Please select at least one cuisine type"),
  priceRange: z.enum(["₩", "₩₩", "₩₩₩"]),
  features: z.array(z.string()),
  ownerName: z.string().min(2, "Owner name is required"),
  ownerEmail: z.string().email("Please provide a valid owner email"),
  ownerPhone: z.string().min(8, "Please provide a valid owner phone"),
});

type AddRestaurantForm = z.infer<typeof addRestaurantSchema>;

const cuisineOptions = [
  "Uzbek", "Central Asian", "Uyghur", "Oriental", "Traditional",
  "Plov House", "Tea House", "Silk Road", "European", "Fine Dining",
  "Home Style", "Fusion", "International", "Vegetarian"
];

const featureOptions = [
  "Traditional Kazan Cooking", "Wedding Plov", "Hand-pulled Noodles", "Tandoor Bread",
  "Live Entertainment", "Hookah Lounge", "Traditional Seating", "Cultural Shows",
  "Private Dining", "Family Style", "Wine Pairing", "Seasonal Menu",
  "Vegetarian Options", "Halal", "Parking", "WiFi", "Terrace"
];

export default function AddRestaurantPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  const form = useForm<AddRestaurantForm>({
    resolver: zodResolver(addRestaurantSchema),
    defaultValues: {
      name: "",
      description: "",
      address: "",
      city: "Tashkent",
      phone: "",
      email: "",
      website: "",
      cuisine: [],
      priceRange: "₩₩",
      features: [],
      ownerName: "",
      ownerEmail: "",
      ownerPhone: "",
    },
  });

  const onSubmit = async (values: AddRestaurantForm) => {
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log("Restaurant submission:", values);
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const toggleCuisine = (cuisine: string) => {
    const newCuisines = selectedCuisines.includes(cuisine)
      ? selectedCuisines.filter(c => c !== cuisine)
      : [...selectedCuisines, cuisine];

    setSelectedCuisines(newCuisines);
    form.setValue("cuisine", newCuisines);
  };

  const toggleFeature = (feature: string) => {
    const newFeatures = selectedFeatures.includes(feature)
      ? selectedFeatures.filter(f => f !== feature)
      : [...selectedFeatures, feature];

    setSelectedFeatures(newFeatures);
    form.setValue("features", newFeatures);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="mx-auto max-w-2xl px-6 py-16 lg:px-8">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold mb-4">Application Submitted!</h1>
              <p className="text-muted-foreground mb-6">
                Thank you for your interest in joining Tablein. We'll review your application and get back to you within 2-3 business days.
              </p>
              <Button asChild>
                <Link href="/">Return to Homepage</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="mx-auto max-w-4xl px-6 py-8 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Join Tablein</h1>
          <p className="text-muted-foreground">
            Partner with us to reach more customers and grow your restaurant business in Tashkent
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Utensils className="h-5 w-5" />
                  Restaurant Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Restaurant Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your restaurant name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select city" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Tashkent">Tashkent</SelectItem>
                            <SelectItem value="Samarkand">Samarkand</SelectItem>
                            <SelectItem value="Bukhara">Bukhara</SelectItem>
                            <SelectItem value="Khiva">Khiva</SelectItem>
                            <SelectItem value="Andijan">Andijan</SelectItem>
                            <SelectItem value="Namangan">Namangan</SelectItem>
                            <SelectItem value="Nukus">Nukus</SelectItem>
                            <SelectItem value="Fergana">Fergana</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Address</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="Street address, district, postal code" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your restaurant, cuisine, atmosphere, specialties like plov, lagman, manta..."
                          className="min-h-24"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <FormLabel>Cuisine Type</FormLabel>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {cuisineOptions.map((cuisine) => (
                        <Badge
                          key={cuisine}
                          variant={selectedCuisines.includes(cuisine) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleCuisine(cuisine)}
                        >
                          {cuisine}
                        </Badge>
                      ))}
                    </div>
                    {form.formState.errors.cuisine && (
                      <p className="text-sm text-destructive mt-1">{form.formState.errors.cuisine.message}</p>
                    )}
                  </div>

                  <FormField
                    control={form.control}
                    name="priceRange"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price Range (UZS)</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select price range" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="₩">₩ - Budget (Under 50,000 UZS)</SelectItem>
                            <SelectItem value="₩₩">₩₩ - Mid-range (50,000-150,000 UZS)</SelectItem>
                            <SelectItem value="₩₩₩">₩₩₩ - Fine dining (150,000+ UZS)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  <FormLabel>Features & Specialties</FormLabel>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {featureOptions.map((feature) => (
                      <Badge
                        key={feature}
                        variant={selectedFeatures.includes(feature) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => toggleFeature(feature)}
                      >
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Restaurant Phone</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="+998 12 345 67 89" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Restaurant Email</FormLabel>
                        <FormControl>
                          <Input placeholder="restaurant@example.uz" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website (Optional)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="https://yourrestaurant.uz" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Owner Information */}
            <Card>
              <CardHeader>
                <CardTitle>Owner Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">

                <FormField
                  control={form.control}
                  name="ownerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Owner/Manager Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="ownerEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Owner Email</FormLabel>
                        <FormControl>
                          <Input placeholder="your.email@example.uz" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ownerPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Owner Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="+998 90 123 45 67" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-tablein-blue hover:bg-tablein-blue/90 px-8"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting Application..." : "Submit Application"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
