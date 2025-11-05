"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface RestaurantGalleryProps {
  images: string[];
  name: string;
}

export function RestaurantGallery({ images, name }: RestaurantGalleryProps) {
  const [currentImage, setCurrentImage] = useState(0);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  if (images.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
        <Image
          src={images[currentImage]}
          alt={`${name} - Image ${currentImage + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
        />

        {images.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
              onClick={prevImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((image, index) => (
                <button
                  key={`dot-${image}`}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentImage ? "bg-white" : "bg-white/50"
                  }`}
                  onClick={() => setCurrentImage(index)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnail Grid */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.slice(0, 4).map((image, index) => (
            <button
              key={`thumb-${image}`}
              className={`relative aspect-square overflow-hidden rounded-md border-2 transition-all ${
                index === currentImage
                  ? "border-tablein-blue shadow-lg"
                  : "border-transparent hover:border-muted-foreground"
              }`}
              onClick={() => setCurrentImage(index)}
            >
              <Image
                src={image}
                alt={`${name} - Thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 25vw, 150px"
              />
              {index === 3 && images.length > 4 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-semibold text-sm">
                  +{images.length - 4}
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
