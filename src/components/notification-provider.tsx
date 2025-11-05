"use client";

import React, { createContext, useContext, type ReactNode } from "react";
import toast, { Toaster } from "react-hot-toast";
import { CheckCircle, XCircle, AlertCircle, CreditCard, Star } from "lucide-react";

interface NotificationData {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
}

interface NotificationContextType {
  showBookingConfirmation: (restaurantName: string, date: string, time: string) => void;
  showPaymentSuccess: (amount: number, restaurantName: string) => void;
  showPaymentError: (message?: string) => void;
  showReviewSubmitted: (restaurantName: string) => void;
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
  showInfo: (message: string) => void;
  showNotification: (notification: NotificationData) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const showBookingConfirmation = (restaurantName: string, date: string, time: string) => {
    toast.success(
      (t) => (
        <div className="flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
          <div>
            <div className="font-semibold">Booking Confirmed!</div>
            <div className="text-sm text-muted-foreground">
              Your table at {restaurantName} is reserved for {date} at {time}
            </div>
          </div>
        </div>
      ),
      {
        duration: 5000,
        style: {
          background: 'var(--background)',
          color: 'var(--foreground)',
          border: '1px solid var(--border)',
        },
      }
    );
  };

  const showPaymentSuccess = (amount: number, restaurantName: string) => {
    toast.success(
      (t) => (
        <div className="flex items-start gap-3">
          <CreditCard className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
          <div>
            <div className="font-semibold">Payment Successful!</div>
            <div className="text-sm text-muted-foreground">
              ₩{amount.toLocaleString()} paid for {restaurantName}
            </div>
          </div>
        </div>
      ),
      {
        duration: 5000,
        style: {
          background: 'var(--background)',
          color: 'var(--foreground)',
          border: '1px solid var(--border)',
        },
      }
    );
  };

  const showPaymentError = (message = "Payment failed. Please try again.") => {
    toast.error(
      (t) => (
        <div className="flex items-start gap-3">
          <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <div className="font-semibold">Payment Failed</div>
            <div className="text-sm text-muted-foreground">{message}</div>
          </div>
        </div>
      ),
      {
        duration: 6000,
        style: {
          background: 'var(--background)',
          color: 'var(--foreground)',
          border: '1px solid var(--border)',
        },
      }
    );
  };

  const showReviewSubmitted = (restaurantName: string) => {
    toast.success(
      (t) => (
        <div className="flex items-start gap-3">
          <Star className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
          <div>
            <div className="font-semibold">Review Submitted!</div>
            <div className="text-sm text-muted-foreground">
              Thank you for reviewing {restaurantName}
            </div>
          </div>
        </div>
      ),
      {
        duration: 4000,
        style: {
          background: 'var(--background)',
          color: 'var(--foreground)',
          border: '1px solid var(--border)',
        },
      }
    );
  };

  const showError = (message: string) => {
    toast.error(message, {
      style: {
        background: 'var(--background)',
        color: 'var(--foreground)',
        border: '1px solid var(--border)',
      },
    });
  };

  const showSuccess = (message: string) => {
    toast.success(message, {
      style: {
        background: 'var(--background)',
        color: 'var(--foreground)',
        border: '1px solid var(--border)',
      },
    });
  };

  const showInfo = (message: string) => {
    toast(message, {
      icon: <AlertCircle className="h-4 w-4 text-blue-500" />,
      style: {
        background: 'var(--background)',
        color: 'var(--foreground)',
        border: '1px solid var(--border)',
      },
    });
  };

  const showNotification = (notification: NotificationData) => {
    const icons = {
      success: <CheckCircle className="h-5 w-5 text-green-500" />,
      error: <XCircle className="h-5 w-5 text-red-500" />,
      warning: <AlertCircle className="h-5 w-5 text-yellow-500" />,
      info: <AlertCircle className="h-5 w-5 text-blue-500" />,
    };

    const toastFunction = notification.type === 'error' ? toast.error :
                         notification.type === 'success' ? toast.success :
                         toast;

    toastFunction(
      (t) => (
        <div className="flex items-start gap-3">
          {icons[notification.type]}
          <div>
            <div className="font-semibold">{notification.title}</div>
            <div className="text-sm text-muted-foreground">
              {notification.message}
            </div>
          </div>
        </div>
      ),
      {
        duration: notification.type === 'error' ? 6000 : 4000,
        style: {
          background: 'var(--background)',
          color: 'var(--foreground)',
          border: '1px solid var(--border)',
        },
      }
    );
  };

  const value: NotificationContextType = {
    showBookingConfirmation,
    showPaymentSuccess,
    showPaymentError,
    showReviewSubmitted,
    showError,
    showSuccess,
    showInfo,
    showNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--background)',
            color: 'var(--foreground)',
            border: '1px solid var(--border)',
          },
        }}
      />
    </NotificationContext.Provider>
  );
}
