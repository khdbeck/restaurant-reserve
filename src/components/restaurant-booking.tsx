"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import TableSelection from "./table-selection";
import { FoodPreorder } from "./food-preorder";
import { PaymentForm } from "./payment-form";
import { ShareButton } from "./deep-link-handler";
import { useRestaurantWebSocket } from "./websocket-provider";
import { useNotifications } from "./notification-provider";
import { cn } from "@/lib/utils";
import type { Restaurant, PreOrder } from "@/lib/types";
import { CalendarIcon, Users, Clock, ChefHat, CreditCard, Check, Share2, MapPin, Phone, Mail } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

const bookingSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  customerEmail: z.string().email("Please enter a valid email address"),
  customerPhone: z.string().min(8, "Please enter a valid phone number"),
  date: z.date({
    required_error: "Please select a date",
  }),
  time: z.string({
    required_error: "Please select a time",
  }),
  guests: z.number().min(1).max(20),
  specialRequests: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface RestaurantBookingProps {
  restaurant: Restaurant;
}

const timeSlots = [
  "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
  "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
  "20:00", "20:30", "21:00", "21:30", "22:00", "22:30"
];

type BookingStep = 'details' | 'table' | 'preorder' | 'payment' | 'confirmation';

export function RestaurantBooking({ restaurant }: RestaurantBookingProps) {
  const { data: session } = useSession();
  const { showNotification } = useNotifications();
  const { updateTable, lastEvent } = useRestaurantWebSocket(restaurant.id);

  const [currentStep, setCurrentStep] = useState<BookingStep>('details');
  const [selectedTableId, setSelectedTableId] = useState<string>();
  const [preOrders, setPreOrders] = useState<PreOrder[]>([]);
  const [bookingId, setBookingId] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      customerName: session?.user?.name ?? "",
      customerEmail: session?.user?.email ?? "",
      customerPhone: "",
      guests: 2,
      specialRequests: "",
    },
  });

  // Listen for real-time table updates
  useEffect(() => {
    if (lastEvent?.type === 'table_status_change') {
      const tableUpdate = lastEvent.data;

    }
  }, [lastEvent, selectedTableId, showNotification]);

  const calculateTotal = () => {
    const preorderTotal = preOrders.reduce((sum, order) => {
      const menuItem = restaurant.menu?.find(item => item.id === order.menuItemId);
      return sum + (menuItem?.price || 0) * order.quantity;
    }, 0);

    const deposit = Math.max(preorderTotal * 0.2, 50000);

    return {
      preorderTotal,
      deposit,
      total: preorderTotal + deposit,
    };
  };

  const onSubmit = async (data: BookingFormData) => {
    if (currentStep === 'details') {
      setCurrentStep('table');
      return;
    }

    if (currentStep === 'table') {
      if (!selectedTableId) {
        showNotification({
          type: 'error',
          title: 'Table Required',
          message: 'Please select a table to continue.',
        });
        return;
      }
      setCurrentStep('preorder');
      return;
    }

    if (currentStep === 'preorder') {
      setCurrentStep('payment');
      return;
    }

    if (currentStep === 'payment') {
      setIsSubmitting(true);

      try {
        await new Promise(resolve => setTimeout(resolve, 2000));

        const newBookingId = `BK${Date.now()}`;
        setBookingId(newBookingId);

        if (selectedTableId) {
          updateTable(selectedTableId, {
            tableId: selectedTableId,
            status: 'reserved',
            bookingId: newBookingId,
            guestCount: data.guests,
            estimatedDuration: 90, // 90 minutes
          });
        }

        showNotification({
          type: 'success',
          title: 'Booking Confirmed!',
          message: `Your table has been reserved for ${format(data.date, "MMM dd")} at ${data.time}.`,
        });

        setCurrentStep('confirmation');
      } catch (error) {
        showNotification({
          type: 'error',
          title: 'Booking Failed',
          message: 'Something went wrong. Please try again.',
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const getStepIcon = (step: BookingStep) => {
    const isActive = currentStep === step;
    const isCompleted = ['details', 'table', 'preorder', 'payment'].indexOf(step) < ['details', 'table', 'preorder', 'payment'].indexOf(currentStep);

    const icons = {
      details: Users,
      table: MapPin,
      preorder: ChefHat,
      payment: CreditCard,
      confirmation: Check,
    };

    const Icon = icons[step];

    return (
      <div className={cn(
        "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors",
        isActive && "border-tablein-blue bg-tablein-blue text-white",
        isCompleted && "border-green-500 bg-green-500 text-white",
        !isActive && !isCompleted && "border-muted-foreground text-muted-foreground"
      )}>
        <Icon className="h-4 w-4" />
      </div>
    );
  };

  if (!session) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <h3 className="text-lg font-semibold mb-4">Sign in to make a reservation</h3>
          <p className="text-muted-foreground mb-6">
            Please sign in to your account to book a table at this restaurant.
          </p>
          <Button asChild className="bg-tablein-blue hover:bg-tablein-blue/90">
            <Link href="/auth/signin">Sign In</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (currentStep === 'confirmation' && bookingId) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Booking Confirmed!</h2>
          <p className="text-muted-foreground mb-6">
            Your reservation at {restaurant.name} has been confirmed.
          </p>

          <div className="bg-muted/30 rounded-lg p-6 mb-6 text-left">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">Booking ID:</span>
                <span className="font-mono">{bookingId}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Restaurant:</span>
                <span>{restaurant.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Date & Time:</span>
                <span>
                  {format(form.getValues('date'), "MMM dd, yyyy")} at {form.getValues('time')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Guests:</span>
                <span>{form.getValues('guests')} people</span>
              </div>
              {selectedTableId && (
                <div className="flex justify-between">
                  <span className="font-medium">Table:</span>
                  {selectedTableId && (
                      <span>Table {selectedTableId.replace("t", "")}</span>
                  )}
                </div>
              )}
              {preOrders.length > 0 && (
                <div className="flex justify-between">
                  <span className="font-medium">Pre-orders:</span>
                  <span>{preOrders.length} items</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <Button variant="outline" asChild>
              <Link href="/">Return Home</Link>
            </Button>
            <ShareButton
              type="booking"
              data={{
                bookingId,
                restaurantId: restaurant.id,
                restaurantName: restaurant.name,
                bookingDate: format(form.getValues('date'), "MMM dd, yyyy"),
              }}
              variant="outline"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share Booking
            </ShareButton>
          </div>
        </CardContent>
      </Card>
    );
  }
  const steps: BookingStep[] = ['details', 'table', 'preorder', 'payment'];


  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const isActive = currentStep === step;
              const currentIndex = steps.indexOf(currentStep);

              const canNavigate = index <= currentIndex;

              return (
                  <button
                      key={step}
                      type="button"
                      onClick={() => canNavigate && setCurrentStep(step)}
                      disabled={!canNavigate}
                      className={cn(
                          "flex items-center gap-2 focus:outline-none transition-opacity",
                          !canNavigate && "opacity-50 cursor-not-allowed"
                      )}
                  >
                    {getStepIcon(step)}
{/*
                    <span className="text-sm font-medium capitalize">{step}</span>
*/}
                  </button>
              );
            })}
          </div>
        </CardContent>
      </Card>


      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

          {/* Booking Details Step */}
          {currentStep === 'details' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Booking Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="customerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="customerEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="customerPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+998 90 123 45 67" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start truncate text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4  w-fit" />
                                {field.value ? format(field.value, "MMM dd, yyyy") : "Date"}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <Clock className="mr-2 h-4 w-4" />
                              <SelectValue placeholder="Select time" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {timeSlots.map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="guests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Guests</FormLabel>
                      <Select onValueChange={(value) => field.onChange(Number.parseInt(value))} defaultValue={field.value?.toString()}>
                        <FormControl>
                          <SelectTrigger>
                            <Users className="mr-2 h-4 w-4" />
                            <SelectValue placeholder="Select guests" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} {num === 1 ? 'guest' : 'guests'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="specialRequests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Special Requests (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Any special dietary requirements, allergies, or other requests..."
                          className="min-h-20"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end">
                  <Button type="submit" className="bg-tablein-blue hover:bg-tablein-blue/90">
                    Continue to Table Selection
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Table Selection Step */}
          {currentStep === 'table' && restaurant.layout && (
            <div className="space-y-6">
              <TableSelection
                layout={restaurant.layout}
                selectedGuests={form.getValues('guests')}
                selectedTableId={selectedTableId}
                onTableSelect={setSelectedTableId}
              />

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep('details')}>
                  Back to Details
                </Button>
                <div className="flex gap-2">
                  {selectedTableId && (
                    <ShareButton
                      type="table"
                      data={{
                        restaurantId: restaurant.id,
                        tableId: selectedTableId,
                        restaurantName: restaurant.name,
                        tableNumber: selectedTableId.replace('t', ''),
                      }}
                      variant="outline"
                      size="default"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Table
                    </ShareButton>
                  )}
                  <Button type="submit" className="bg-tablein-blue hover:bg-tablein-blue/90">
                    Continue to Menu
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Food Preorder Step */}
          {currentStep === 'preorder' && restaurant.menu && (
            <div className="space-y-6">
              <FoodPreorder
                  menu={restaurant.menu}
                  preOrders={preOrders}
                  onPreOrderAction={setPreOrders} // ✅ fixed prop name
              />

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep('table')}>
                  Back to Table Selection
                </Button>
                <Button type="submit" className="bg-tablein-blue hover:bg-tablein-blue/90">
                  Continue to Payment
                </Button>
              </div>
            </div>
          )}

          {/* Payment Step */}
          {currentStep === 'payment' && (
            <div className="space-y-6">
              <PaymentForm
                amount={calculateTotal().total}
                restaurant={restaurant}
                bookingDetails={{
                  ...form.getValues(),
                  selectedTableId,
                  preOrders,
                }}
                onSuccess={() => {}}
                onError={() => {}}
              />

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep('preorder')}>
                  Back to Menu
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-tablein-blue hover:bg-tablein-blue/90"
                >
                  {isSubmitting ? "Processing..." : "Confirm Booking"}
                </Button>
              </div>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
