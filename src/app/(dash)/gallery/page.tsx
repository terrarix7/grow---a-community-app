"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { cn } from "~/lib/utils";
import { Skeleton } from "~/components/ui/skeleton";

interface GalleryClientProps {
  className?: string;
}

export function GalleryClient({ className }: GalleryClientProps) {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch("/api/images");
        if (!response.ok) {
          throw new Error("Failed to fetch images");
        }
        const data = await response.json();
        setImages(data.images || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load images");
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading) {
    return (
      <div className={cn("container mx-auto px-4 py-8", className)}>
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Gallery</h1>
          <p className="text-gray-600">Your uploaded images</p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {Array.from({ length: 9 }).map((_, index) => (
            <div key={index} className="aspect-square">
              <Skeleton className="h-full w-full rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("container mx-auto px-4 py-8", className)}>
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Gallery</h1>
          <p className="text-gray-600">Your uploaded images</p>
        </div>
        <div className="flex flex-col items-center justify-center py-12">
          <div className="mb-4 text-red-500">
            <svg
              className="mx-auto h-16 w-16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            Failed to load images
          </h3>
          <p className="text-center text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!images.length) {
    return (
      <div className={cn("container mx-auto px-4 py-8", className)}>
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Gallery</h1>
          <p className="text-gray-600">Your uploaded images</p>
        </div>
        <div className="flex flex-col items-center justify-center py-12">
          <div className="mb-4 text-gray-400">
            <svg
              className="mx-auto h-16 w-16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            No images found
          </h3>
          <p className="text-center text-gray-600">
            Upload some images to see them here in your gallery
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("container mx-auto px-4 py-8", className)}>
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">Gallery</h1>
        <p className="text-gray-600">Your uploaded images ({images.length})</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {images.map((imageUrl, index) => (
          <Dialog key={index}>
            <DialogTrigger asChild>
              <button className="group relative aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-50 transition-all duration-200 hover:border-gray-300 hover:shadow-md focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none">
                <Image
                  src={imageUrl}
                  alt={`Image ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-200 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/0 transition-colors duration-200 group-hover:bg-black/10" />
              </button>
            </DialogTrigger>
            <DialogContent className="w-full max-w-4xl">
              <DialogHeader>
                <DialogTitle>Image {index + 1}</DialogTitle>
              </DialogHeader>
              <div className="relative max-h-[70vh] w-full overflow-hidden rounded-lg">
                <Image
                  src={imageUrl}
                  alt={`Full size image ${index + 1}`}
                  width={800}
                  height={600}
                  className="h-auto max-h-[70vh] w-full object-contain"
                  priority
                />
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  );
}
