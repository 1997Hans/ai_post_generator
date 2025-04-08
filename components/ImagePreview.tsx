"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { VisualStyle, Platform } from "../lib/types";
import { generateImage } from "../app/actions/generateImage";

interface ImagePreviewProps {
  prompt: string;
  visualStyle?: VisualStyle;
  platform?: Platform;
  imageUrl?: string;
  className?: string;
  onRegenerateClick?: () => void;
  isLoading?: boolean;
}

export function ImagePreview({
  prompt,
  visualStyle = "realistic",
  platform = "instagram",
  imageUrl,
  className = "",
  onRegenerateClick,
  isLoading: controlledLoading,
}: ImagePreviewProps) {
  const [image, setImage] = useState<string | null>(imageUrl || null);
  const [isLoading, setIsLoading] = useState<boolean>(!!controlledLoading);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (imageUrl) {
      setImage(imageUrl);
      setIsLoading(false);
      setError(null);
    }
  }, [imageUrl]);

  const generateNewImage = async () => {
    if (!prompt) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await generateImage({
        prompt,
        visualStyle,
        platform,
      });
      
      if (result.imageUrl) {
        setImage(result.imageUrl);
      } else {
        setError(result.error || "Failed to generate image");
      }
    } catch (err) {
      setError("An error occurred while generating the image");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = () => {
    if (onRegenerateClick) {
      onRegenerateClick();
    } else {
      generateNewImage();
    }
  };

  // Helper to check if the image is a data URL or a path
  const getImageProps = () => {
    if (!image) return {};
    
    // If it's a data URL, use the full URL
    if (image.startsWith('data:')) {
      return { src: image };
    }
    
    // If it's a path URL (starts with /), handle it appropriately
    return { src: image };
  };

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex aspect-square w-full items-center justify-center bg-muted">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="flex aspect-square w-full flex-col items-center justify-center space-y-4 bg-muted p-4 text-center">
            <p className="text-sm text-destructive">{error}</p>
            <Button size="sm" onClick={generateNewImage}>
              Try Again
            </Button>
          </div>
        ) : image ? (
          <div className="relative aspect-square w-full">
            <Image
              {...getImageProps()}
              alt={prompt || "Generated image"}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              className="object-cover transition-all"
              onError={() => setError("Failed to load image")}
            />
            <Button
              variant="secondary"
              size="icon"
              className="absolute bottom-2 right-2 h-8 w-8 rounded-full opacity-80 backdrop-blur-sm hover:opacity-100"
              onClick={handleRegenerate}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Skeleton className="aspect-square w-full" />
        )}
      </CardContent>
    </Card>
  );
} 