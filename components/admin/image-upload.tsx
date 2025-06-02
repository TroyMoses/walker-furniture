"use client";

import type React from "react";

import { useState, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Upload, X, Loader2 } from "lucide-react";
import type { Id } from "@/convex/_generated/dataModel";
import Image from "next/image";

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

export function ImageUpload({
  images,
  onImagesChange,
  maxImages = 5,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{
    [key: string]: number;
  }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const deleteFile = useMutation(api.files.deleteFile);

  // Helper function to handle file uploads from both input and drop
  const uploadFiles = async (files: File[]) => {
    if (files.length === 0) return;

    // Check if adding these files would exceed the limit
    if (images.length + files.length > maxImages) {
      alert(`You can only upload up to ${maxImages} images`);
      return;
    }

    setUploading(true);

    try {
      const uploadPromises = files.map(async (file, index) => {
        const fileId = `${Date.now()}-${index}`;
        setUploadProgress((prev) => ({ ...prev, [fileId]: 0 }));

        // Validate file type
        if (!file.type.startsWith("image/")) {
          throw new Error(`${file.name} is not an image file`);
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`${file.name} is too large. Maximum size is 5MB`);
        }

        // Get upload URL
        const uploadUrl = await generateUploadUrl();

        // Upload file with progress tracking
        return new Promise<string>((resolve, reject) => {
          const xhr = new XMLHttpRequest();

          xhr.upload.addEventListener("progress", (event) => {
            if (event.lengthComputable) {
              const progress = Math.round((event.loaded / event.total) * 100);
              setUploadProgress((prev) => ({ ...prev, [fileId]: progress }));
            }
          });

          xhr.addEventListener("load", () => {
            if (xhr.status === 200) {
              const response = JSON.parse(xhr.responseText);
              const storageId = response.storageId;
              // Convert storage ID to URL format that Convex expects
              resolve(
                `https://your-convex-site.convex.cloud/api/storage/${storageId}`
              );
            } else {
              reject(new Error(`Upload failed: ${xhr.statusText}`));
            }
          });

          xhr.addEventListener("error", () => {
            reject(new Error(`Upload failed: ${xhr.statusText}`));
          });

          xhr.open("POST", uploadUrl);
          xhr.send(file);
        });
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      onImagesChange([...images, ...uploadedUrls]);
    } catch (error) {
      console.error("Upload failed:", error);
      alert(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
      setUploadProgress({});
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);
    uploadFiles(files);
  };

  const removeImage = async (index: number) => {
    const imageUrl = images[index];

    // Extract storage ID from URL if it's a Convex storage URL
    if (imageUrl.includes("convex.cloud/api/storage/")) {
      try {
        const storageId = imageUrl.split("/").pop() as Id<"_storage">;
        await deleteFile({ storageId });
      } catch (error) {
        console.error("Failed to delete file:", error);
      }
    }

    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      uploadFiles(files);
    }
  };

  return (
    <div className="space-y-4">
      <Label>Product Images (Max {maxImages})</Label>

      {/* Upload Area */}
      <Card
        className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors cursor-pointer"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <CardContent className="flex flex-col items-center justify-center py-8">
          <div className="text-center">
            {uploading ? (
              <div className="space-y-2">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400" />
                <p className="text-sm text-gray-600">Uploading images...</p>
                {Object.entries(uploadProgress).map(([fileId, progress]) => (
                  <div
                    key={fileId}
                    className="w-full bg-gray-200 rounded-full h-2"
                  >
                    <div
                      className="bg-amber-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <>
                <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-1">
                  Click to upload or drag and drop images here
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG, JPEG up to 5MB each
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading || images.length >= maxImages}
        title="Upload product images"
      />

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <Card key={index} className="relative group">
              <CardContent className="p-2">
                <div className="relative aspect-square">
                  <Image
                    fill
                    src={image || "/placeholder.svg"}
                    alt={`Product image ${index + 1}`}
                    className="w-full h-full object-cover rounded"
                    onError={(e) => {
                      // Fallback for broken images
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder.svg?height=150&width=150";
                    }}
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(index);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                  {index === 0 && (
                    <div className="absolute bottom-1 left-1 bg-amber-600 text-white text-xs px-1 py-0.5 rounded">
                      Main
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Upload Status */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          {images.length} of {maxImages} images uploaded
        </span>
        {images.length >= maxImages && (
          <span className="text-amber-600">Maximum images reached</span>
        )}
      </div>
    </div>
  );
}
