import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { SessionProviderWrapper } from "@/components/session-provider";
import { NotificationProvider } from "@/components/notification-provider";
import { WebSocketProvider } from "@/components/websocket-provider";
import { DeepLinkHandler } from "@/components/deep-link-handler";
import { Suspense } from "react";
import image from "../public/img.png"
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tableuz - Restaurant Booking Platform",
  description: "Discover and book the best restaurants in Tashkent, Uzbekistan",
  keywords: ["restaurant", "booking", "Tashkent", "Uzbekistan", "dining", "plov", "uzbek cuisine"],
  authors: [{ name: "Tablein Team" }],
  openGraph: {
    title: "Tableuz - Restaurant Booking Platform",
    description: "Discover and book the best restaurants in Tashkent, Uzbekistan",
    url: "https://tablein.uz",
    siteName: "Tablein",
    images: [
      {
        url: "image",
        width: 1200,
        height: 630,
        alt: "Tableuz - Restaurant Booking Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tablein - Restaurant Booking Platform",
    description: "Discover and book the best restaurants in Tashkent, Uzbekistan",
    images: ["/tablein-og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProviderWrapper>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NotificationProvider>
              <WebSocketProvider>
                <Suspense fallback={<div>Loading...</div>}>
                    {children}
                </Suspense>
              </WebSocketProvider>
            </NotificationProvider>
          </ThemeProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
