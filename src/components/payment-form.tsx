// Patched PaymentForm.tsx to format date properly

"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Lock, Shield } from "lucide-react";
import { useNotifications } from "@/components/notification-provider";
import type { Restaurant, PreOrder } from "@/lib/types";
import { format } from "date-fns";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_demo');

interface PaymentFormProps {
  restaurant: Restaurant;
  bookingDetails: {
    date: Date;
    time: string;
    guests: number;
    selectedTableId?: string;
    preOrders?: PreOrder[];
    customerName: string;
    customerEmail: string;
  };
  amount: number;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
}

const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: 'var(--foreground)',
      '::placeholder': {
        color: 'var(--muted-foreground)',
      },
    },
    invalid: {
      color: '#ef4444',
    },
  },
};

function CheckoutForm({
                        restaurant,
                        bookingDetails,
                        amount,
                        onSuccess = () => {},
                        onError = () => {},
                      }: PaymentFormProps) {

  const stripe = useStripe();
  const elements = useElements();
  const { showPaymentSuccess, showPaymentError } = useNotifications();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardholderName, setCardholderName] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) return;
    setIsProcessing(true);

    const cardNumber = elements.getElement(CardNumberElement);
    if (!cardNumber) {
      onError("Card information is incomplete");
      setIsProcessing(false);
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const isSuccess = Math.random() > 0.1;

      if (isSuccess) {
        const mockPaymentIntentId = `pi_${Date.now()}_demo`;
        showPaymentSuccess(amount, restaurant.name);
        onSuccess(mockPaymentIntentId);
      } else {
        throw new Error("Your card was declined. Please try a different payment method.");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Payment failed. Please try again.";
      showPaymentError(errorMessage);
      onError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
      <div className="space-y-6">
        <div className="bg-muted/30 p-4 rounded-lg space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm">Reservation deposit</span>
            <span className="font-semibold">₩{amount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>{restaurant.name}</span>
            <span>{format(bookingDetails.date, "MMM dd, yyyy")} at {bookingDetails.time}</span>
          </div>
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>{bookingDetails.guests} guest{bookingDetails.guests !== 1 ? 's' : ''}</span>
            <span>Refundable until 24h before</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cardholderName">Cardholder Name</Label>
          <Input
              id="cardholderName"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              placeholder="Name on card"
              required
          />
        </div>

        <div className="space-y-2">
          <Label>Card Number</Label>
          <div className="border rounded-md p-3 bg-background">
            <CardNumberElement options={cardElementOptions} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Expiry Date</Label>
            <div className="border rounded-md p-3 bg-background">
              <CardExpiryElement options={cardElementOptions} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>CVC</Label>
            <div className="border rounded-md p-3 bg-background">
              <CardCvcElement options={cardElementOptions} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
          <Shield className="h-4 w-4 text-green-600" />
          <span>Your payment information is secure and encrypted</span>
        </div>

        <Button
            onClick={handleSubmit}
            disabled={!stripe || isProcessing || !cardholderName.trim()}
            className="w-full bg-tablein-blue hover:bg-tablein-blue/90"
            size="lg"
        >
          {isProcessing ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                Processing...
              </>
          ) : (
              <>
                <Lock className="h-4 w-4 mr-2" />
                Pay ₩{amount.toLocaleString()}
              </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          By proceeding, you agree to our terms and conditions.
          Your deposit will be refunded if you cancel at least 24 hours before your reservation.
        </p>
      </div>
  );
}

export function PaymentForm(props: PaymentFormProps) {
  return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Secure Payment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Elements stripe={stripePromise}>
            <CheckoutForm {...props} />
          </Elements>
        </CardContent>
      </Card>
  );
}
