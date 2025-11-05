"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input"; // ✅ added import for Input
import type { DeepLink, ShareableLink, MobileAppHandoff, SearchFilters } from "@/lib/types";

import {
  Share2,
  Smartphone,
  ExternalLink,
  Copy,
  MessageCircle,
  Mail,
  Facebook,
  Twitter,
  Download,
} from "lucide-react";

interface ShareableData {
  restaurantId?: string;
  tableId?: string;
  bookingId?: string;
  restaurantName?: string;
  tableNumber?: string;
  bookingDate?: string;
  searchParams?: SearchFilters;
}

interface DeepLinkHandlerProps {
  children: React.ReactNode;
}

const MOBILE_APP_CONFIG: MobileAppHandoff = {
  isAvailable: true,
  appStoreUrl: "https://apps.apple.com/app/tablein",
  playStoreUrl: "https://play.google.com/store/apps/details?id=com.tablein.app",
  universalLink: "tablein://app",
  fallbackUrl: "https://tablein.uz",
};

export function DeepLinkHandler({ children }: DeepLinkHandlerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showMobilePrompt, setShowMobilePrompt] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareableLink, setShareableLink] = useState<ShareableLink | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [hasAppInstalled, setHasAppInstalled] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const userAgent =
          navigator.userAgent || navigator.vendor || (window as unknown as { opera: string }).opera;
      const mobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Check for app installation (simplified detection)
  useEffect(() => {
    const checkAppInstallation = async () => {
      try {
        const timeout = setTimeout(() => {
          setHasAppInstalled(false);
        }, 1000);

        if (MOBILE_APP_CONFIG.universalLink) {
          window.location.href = MOBILE_APP_CONFIG.universalLink;
        }

        setTimeout(() => {
          clearTimeout(timeout);
          setHasAppInstalled(false);
        }, 100);
      } catch (error) {
        setHasAppInstalled(false);
      }
    };

    if (isMobile) {
      checkAppInstallation();
    }
  }, [isMobile]);

  // Handle UTM parameters and deep link parsing
  useEffect(() => {
    const utm_source = searchParams.get("utm_source");
    const utm_medium = searchParams.get("utm_medium");
    const utm_campaign = searchParams.get("utm_campaign");
    const utm_content = searchParams.get("utm_content");

    const table = searchParams.get("table");
    const restaurant = searchParams.get("restaurant");
    const booking = searchParams.get("booking");

    if (restaurant || table || booking) {
      const deepLink: DeepLink = {
        type: booking ? "booking" : table ? "table" : "restaurant",
        restaurantId: restaurant || undefined,
        tableId: table || undefined,
        bookingId: booking || undefined,
        utm: utm_source
            ? {
              source: utm_source,
              medium: utm_medium || undefined,
              campaign: utm_campaign || undefined,
              content: utm_content || undefined,
            }
            : undefined,
      };

      handleDeepLink(deepLink);
    }

    if (isMobile && !hasAppInstalled && !sessionStorage.getItem("mobile_prompt_shown")) {
      setShowMobilePrompt(true);
      sessionStorage.setItem("mobile_prompt_shown", "true");
    }
  }, [searchParams, isMobile, hasAppInstalled]);

  const handleDeepLink = useCallback(
      (deepLink: DeepLink) => {
        switch (deepLink.type) {
          case "restaurant":
            if (deepLink.restaurantId) {
              router.push(`/restaurant/${deepLink.restaurantId}`);
            }
            break;

          case "table":
            if (deepLink.restaurantId && deepLink.tableId) {
              router.push(`/restaurant/${deepLink.restaurantId}?table=${deepLink.tableId}`);
            }
            break;

          case "booking":
            if (deepLink.bookingId) {
              router.push(`/booking/${deepLink.bookingId}`);
            }
            break;

          case "search":
            if (deepLink.searchParams) {
              const params = new URLSearchParams();
              if (deepLink.searchParams.location) params.set("location", deepLink.searchParams.location);
              if (deepLink.searchParams.date)
                params.set("date", deepLink.searchParams.date.toISOString());
              if (deepLink.searchParams.time) params.set("time", deepLink.searchParams.time);
              if (deepLink.searchParams.guests)
                params.set("guests", deepLink.searchParams.guests.toString());
              router.push(`/restaurants?${params.toString()}`);
            }
            break;
        }
      },
      [router]
  );

  const generateShareableLink = useCallback(
      (
          type: DeepLink["type"],
          data: {
            restaurantId?: string;
            tableId?: string;
            bookingId?: string;
            restaurantName?: string;
            tableNumber?: string;
            bookingDate?: string;
          }
      ): ShareableLink => {
        const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://tablein.uz";
        const params = new URLSearchParams();

        if (data.restaurantId) params.set("restaurant", data.restaurantId);
        if (data.tableId) params.set("table", data.tableId);
        if (data.bookingId) params.set("booking", data.bookingId);

        params.set("utm_source", "share");
        params.set("utm_medium", "web");
        params.set("utm_campaign", "user_sharing");

        const url = `${baseUrl}?${params.toString()}`;

        let title = "Check out this restaurant on Tablein";
        let description = "Discover amazing Uzbek cuisine in Tashkent";

        switch (type) {
          case "restaurant":
            title = `${data.restaurantName || "Restaurant"} on Tablein`;
            description = `Book a table at ${data.restaurantName || "this restaurant"} in Tashkent`;
            break;

          case "table":
            title = `Table ${data.tableNumber || ""} at ${data.restaurantName || "Restaurant"}`;
            description = `I've selected this table for our dining experience`;
            break;

          case "booking":
            title = `Booking confirmed at ${data.restaurantName || "Restaurant"}`;
            description = `Join me for dinner on ${data.bookingDate || "this date"}`;
            break;
        }

        return {
          url,
          title,
          description,
          image: "/tablein-logo.png",
          metadata: {
            restaurantName: data.restaurantName,
            tableNumber: data.tableNumber,
            bookingDate: data.bookingDate,
          },
        };
      },
      []
  );

  const handleShare = useCallback((shareData: ShareableLink, method: string) => {
    switch (method) {
      case "copy":
        navigator.clipboard.writeText(shareData.url);
        break;

      case "native":
        if (navigator.share) {
          navigator.share({
            title: shareData.title,
            text: shareData.description,
            url: shareData.url,
          });
        }
        break;

      case "whatsapp":
        window.open(
            `https://wa.me/?text=${encodeURIComponent(
                `${shareData.title}\n${shareData.description}\n${shareData.url}`
            )}`
        );
        break;

      case "telegram":
        window.open(
            `https://t.me/share/url?url=${encodeURIComponent(shareData.url)}&text=${encodeURIComponent(
                shareData.title
            )}`
        );
        break;

      case "email":
        window.open(
            `mailto:?subject=${encodeURIComponent(shareData.title)}&body=${encodeURIComponent(
                `${shareData.description}\n\n${shareData.url}`
            )}`
        );
        break;

      case "facebook":
        window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}`
        );
        break;

      case "twitter":
        window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                shareData.title
            )}&url=${encodeURIComponent(shareData.url)}`
        );
        break;
    }
  }, []);

  const openMobileApp = useCallback(() => {
    const universalLink = MOBILE_APP_CONFIG.universalLink;
    const fallbackUrl = MOBILE_APP_CONFIG.fallbackUrl;

    if (hasAppInstalled && universalLink) {
      window.location.href = universalLink;
    } else {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const appStoreUrl = isIOS ? MOBILE_APP_CONFIG.appStoreUrl : MOBILE_APP_CONFIG.playStoreUrl;

      if (appStoreUrl) {
        window.location.href = appStoreUrl;
      } else {
        window.location.href = fallbackUrl;
      }
    }

    setShowMobilePrompt(false);
  }, [hasAppInstalled]);

  useEffect(() => {
    const globalWindow = window as unknown as {
      tableinShare?: (type: DeepLink["type"], data: ShareableData) => void;
    };
    globalWindow.tableinShare = (type: DeepLink["type"], data: ShareableData) => {
      const shareData = generateShareableLink(type, data);
      setShareableLink(shareData);
      setShowShareDialog(true);
    };

    return () => {
      globalWindow.tableinShare = undefined;
    };
  }, [generateShareableLink]);

  return (
      <>
        {children}

        {/* Mobile App Prompt */}
        <Dialog open={showMobilePrompt} onOpenChange={setShowMobilePrompt}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Get the Tablein App
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Get a better experience with our mobile app! Book tables faster, get real-time updates,
                and exclusive mobile-only deals.
              </p>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">✨ Faster booking</Badge>
                  <Badge variant="secondary">🔔 Push notifications</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">📱 Offline mode</Badge>
                  <Badge variant="secondary">🎯 Exclusive deals</Badge>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                    onClick={openMobileApp}
                    className="flex-1 bg-tablein-blue hover:bg-tablein-blue/90"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {hasAppInstalled ? "Open App" : "Download App"}
                </Button>
                <Button variant="outline" onClick={() => setShowMobilePrompt(false)}>
                  Continue in Browser
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Share Dialog */}
        <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                Share
              </DialogTitle>
            </DialogHeader>
            {shareableLink && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">{shareableLink.title}</h3>
                    <p className="text-sm text-muted-foreground">{shareableLink.description}</p>
                  </div>

                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <Input value={shareableLink.url} readOnly className="flex-1 text-xs" />
                      <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleShare(shareableLink, "copy")}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-4 gap-2">
                    {(
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex flex-col gap-1 h-auto py-3"
                            onClick={() => handleShare(shareableLink, "native")}
                        >
                          <Share2 className="h-4 w-4" />
                          <span className="text-xs">Share</span>
                        </Button>
                    )}

                    <Button
                        variant="outline"
                        size="sm"
                        className="flex flex-col gap-1 h-auto py-3"
                        onClick={() => handleShare(shareableLink, "whatsapp")}
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-xs">WhatsApp</span>
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        className="flex flex-col gap-1 h-auto py-3"
                        onClick={() => handleShare(shareableLink, "email")}
                    >
                      <Mail className="h-4 w-4" />
                      <span className="text-xs">Email</span>
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        className="flex flex-col gap-1 h-auto py-3"
                        onClick={() => handleShare(shareableLink, "telegram")}
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span className="text-xs">Telegram</span>
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleShare(shareableLink, "facebook")}
                    >
                      <Facebook className="h-4 w-4 mr-2" />
                      Facebook
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleShare(shareableLink, "twitter")}
                    >
                      <Twitter className="h-4 w-4 mr-2" />
                      Twitter
                    </Button>
                  </div>
                </div>
            )}
          </DialogContent>
        </Dialog>
      </>
  );
}

// Utility function to generate deep links
export const createDeepLink = (
    type: DeepLink["type"],
    data: {
      restaurantId?: string;
      tableId?: string;
      bookingId?: string;
      searchParams?: SearchFilters;
    },
    utm?: DeepLink["utm"]
): string => {
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://tablein.uz";
  const params = new URLSearchParams();

  if (data.restaurantId) params.set("restaurant", data.restaurantId);
  if (data.tableId) params.set("table", data.tableId);
  if (data.bookingId) params.set("booking", data.bookingId);

  if (utm) {
    if (utm.source) params.set("utm_source", utm.source);
    if (utm.medium) params.set("utm_medium", utm.medium);
    if (utm.campaign) params.set("utm_campaign", utm.campaign);
    if (utm.content) params.set("utm_content", utm.content);
  }

  return `${baseUrl}?${params.toString()}`;
};

// Share button component
interface ShareButtonProps {
  type: DeepLink["type"];
  data: {
    restaurantId?: string;
    tableId?: string;
    bookingId?: string;
    restaurantName?: string;
    tableNumber?: string;
    bookingDate?: string;
  };
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
  children?: React.ReactNode;
}

export function ShareButton({
                              type,
                              data,
                              variant = "outline",
                              size = "default",
                              children,
                            }: ShareButtonProps) {
  const handleClick = () => {
    const globalWindow = window as unknown as {
      tableinShare?: (type: DeepLink["type"], data: ShareableData) => void;
    };
    if (typeof window !== "undefined" && globalWindow.tableinShare) {
      globalWindow.tableinShare(type, data);
    }
  };

  return (
      <Button variant={variant} size={size} onClick={handleClick}>
        {children || (
            <>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </>
        )}
      </Button>
  );
}
