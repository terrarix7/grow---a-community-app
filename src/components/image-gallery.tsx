import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { cn } from "~/lib/utils";

interface ImageGalleryProps {
  images: string[];
  className?: string;
}

export function ImageGallery({ images, className }: ImageGalleryProps) {
  if (!images.length) {
    return null;
  }

  return (
    <div className={cn("mt-3 flex flex-wrap gap-2", className)}>
      {images.map((imageUrl, index) => (
        <Dialog key={index}>
          <DialogTrigger asChild>
            <button className="relative h-12 w-12 overflow-hidden rounded-md border border-gray-200 transition-colors hover:border-gray-300 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none">
              <img
                src={imageUrl}
                alt={`Attached image ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          </DialogTrigger>
          <DialogContent className="w-full max-w-4xl">
            <DialogHeader>
              <DialogTitle>Image Preview</DialogTitle>
            </DialogHeader>
            <div className="relative max-h-[70vh] w-full overflow-hidden rounded-lg">
              <img
                src={imageUrl}
                alt="Full size preview"
                className="h-auto max-h-[70vh] w-full object-contain"
              />
            </div>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );
}
