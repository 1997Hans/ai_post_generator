"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { UploadCloud, X, Image as ImageIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

interface ImageUploaderProps {
  onImageSelect: (imageFile: File) => void;
  onImageClear: () => void;
  className?: string;
  previewUrl?: string;
}

export function ImageUploader({
  onImageSelect,
  onImageClear,
  className = "",
  previewUrl,
}: ImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | undefined>(previewUrl);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle drag events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // Handle file input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  // Process the selected file
  const handleFile = (file: File) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }
    
    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreview(url);
    
    // Pass file to parent component
    onImageSelect(file);
  };

  // Clear the selected image
  const clearImage = () => {
    setPreview(undefined);
    if (inputRef.current) inputRef.current.value = "";
    onImageClear();
  };

  // Trigger file browser
  const onButtonClick = () => {
    if (inputRef.current) inputRef.current.click();
  };

  return (
    <Card
      className={`relative ${
        dragActive ? "border-primary" : "border-border"
      } ${className}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />

      {preview ? (
        <div className="relative aspect-square w-full overflow-hidden rounded-md">
          <Image
            src={preview}
            alt="Uploaded image"
            fill
            className="object-cover"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute right-2 top-2 h-8 w-8 rounded-full"
            onClick={clearImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className="flex h-64 w-full flex-col items-center justify-center space-y-2 rounded-md border-2 border-dashed p-4 text-center"
          onClick={onButtonClick}
        >
          <UploadCloud className="h-10 w-10 text-muted-foreground" />
          <div className="space-y-1">
            <p className="text-sm font-medium">
              Drag & drop an image or click to browse
            </p>
            <p className="text-xs text-muted-foreground">
              JPG, PNG or GIF, up to 4MB
            </p>
          </div>
          <Button variant="outline" size="sm" className="mt-4">
            <ImageIcon className="mr-2 h-4 w-4" />
            Select image
          </Button>
        </div>
      )}
    </Card>
  );
} 