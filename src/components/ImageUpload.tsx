"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Upload, AlertCircle, ArrowLeft, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";

interface ImageUploadProps {
  onImageSelect: (data: { base64Url: string; fileName: string }) => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

// Function to compress image
const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        try {
          const img = new window.Image();
          img.src = event.target?.result as string;
          img.onload = () => {
            try {
              const canvas = document.createElement("canvas");
              let width = img.width;
              let height = img.height;

              // Calculate new dimensions while maintaining aspect ratio
              const maxDimension = 800;
              if (width > height) {
                if (width > maxDimension) {
                  height = Math.round((height * maxDimension) / width);
                  width = maxDimension;
                }
              } else {
                if (height > maxDimension) {
                  width = Math.round((width * maxDimension) / height);
                  height = maxDimension;
                }
              }

              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext("2d");

              if (!ctx) {
                throw new Error("Could not get canvas context");
              }

              ctx.drawImage(img, 0, 0, width, height);

              // Convert to base64 with lower quality
              const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
              resolve(compressedBase64);
            } catch (err) {
              console.error("Error in image processing:", err);
              reject(
                new Error(
                  "Failed to process image. Please try a different image."
                )
              );
            }
          };
          img.onerror = () =>
            reject(
              new Error("Failed to load image. Please try a different image.")
            );
        } catch (err) {
          console.error("Error in image loading:", err);
          reject(
            new Error("Failed to load image. Please try a different image.")
          );
        }
      };
      reader.onerror = () =>
        reject(new Error("Failed to read image file. Please try again."));
    } catch (err) {
      console.error("Error in file reading:", err);
      reject(new Error("Failed to read image file. Please try again."));
    }
  });
};

export default function ImageUpload({ onImageSelect }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadToImgBB = async (base64Image: string): Promise<string> => {
    // Get API key from environment variable
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

    if (!apiKey) {
      throw new Error("ImgBB API key is not configured");
    }

    try {
      console.log("Preparing ImgBB upload...");
      const formData = new FormData();
      // Remove the data:image prefix from base64
      const base64Data = base64Image.split(",")[1];
      formData.append("image", base64Data);

      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        console.error("ImgBB API error:", {
          status: response.status,
          statusText: response.statusText,
          error: errorData,
        });
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("ImgBB API response:", data);

      if (data.success && data.data.url) {
        return data.data.url;
      } else {
        console.error("ImgBB upload failed:", data);
        throw new Error("Failed to get image URL");
      }
    } catch (error) {
      console.error("Upload error:", error);
      throw new Error("Failed to upload image. Please try again.");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);
    setIsLoading(true);
    setImageUrl(null);

    if (!file) {
      setIsLoading(false);
      return;
    }

    // Check file type
    if (!file.type.match(/^image\/(jpeg|png)$/)) {
      setError("Please upload a JPG or PNG image");
      setIsLoading(false);
      return;
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      setError("File size must be less than 5MB");
      setIsLoading(false);
      return;
    }

    try {
      // Compress the image
      console.log("Starting image compression...");
      const compressedBase64 = await compressImage(file);
      console.log("Image compression successful");
      setPreview(compressedBase64);

      // Upload to ImgBB
      console.log("Starting ImgBB upload...");
      const url = await uploadToImgBB(compressedBase64);
      console.log("ImgBB upload successful:", url);
      setImageUrl(url);

      onImageSelect({
        base64Url: compressedBase64,
        fileName: file.name,
      });
    } catch (err) {
      console.error("Error details:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Error processing image. Please try again."
      );
      setShowQR(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateQR = () => {
    setShowQR(true);
  };

  const handleBack = () => {
    setShowQR(false);
  };

  const handleDownloadQR = () => {
    if (!preview) return;

    const svg = document.querySelector("#qr-code svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new window.Image();

    img.onload = () => {
      if (!ctx) return;
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");

      const downloadLink = document.createElement("a");
      downloadLink.download = "qr-code.png";
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <div className="bg-[#FFFAF0]">
      <div className="flex flex-col items-center gap-8">
        <AnimatePresence mode="wait">
          {!preview ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-64 h-64 neobrutalism-blue flex items-center justify-center"
            >
              <Upload className="w-16 h-16 text-white" />
            </motion.div>
          ) : showQR && imageUrl ? (
            <motion.div
              key="qr"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="w-64 h-64 neobrutalism-yellow flex items-center justify-center p-4"
            >
              <div id="qr-code">
                <QRCodeSVG
                  value={imageUrl}
                  size={200}
                  level="L"
                  includeMargin={true}
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-64 h-64 relative neobrutalism-pink"
            >
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-cover p-2"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col items-center gap-4">
          <AnimatePresence mode="wait">
            {!preview ? (
              <motion.div
                key="upload-button"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="neobrutalism bg-[#FFE14D] hover:bg-[#FFD700] text-black font-bold text-lg px-8 py-6 transform transition-transform hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Upload Image"}
                </Button>
              </motion.div>
            ) : showQR ? (
              <motion.div
                key="qr-buttons"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex gap-4"
              >
                <Button
                  onClick={handleBack}
                  className="neobrutalism bg-white hover:bg-gray-100 text-black font-bold px-6 py-4 flex items-center gap-2 transform transition-transform hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </Button>
                <Button
                  onClick={handleDownloadQR}
                  className="neobrutalism bg-[#8E7DBE] hover:bg-[#7D6CAD] text-black font-bold px-6 py-4 flex items-center gap-2 transform transition-transform hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                  <Download className="w-5 h-5" />
                  Download QR
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="action-buttons"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex gap-4"
              >
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="neobrutalism bg-white hover:bg-gray-100 text-black font-bold px-6 py-4 transform transition-transform hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                  Change Image
                </Button>
                <Button
                  onClick={handleGenerateQR}
                  className="neobrutalism bg-[#FFE14D] hover:bg-[#FFD700] text-black font-bold px-6 py-4 transform transition-transform hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                  Generate QR
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {!showQR && (
            <Label className="text-black font-medium bg-white neobrutalism px-4 py-2">
              Supported formats: JPG, PNG (max 5MB)
            </Label>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex items-center gap-2 bg-red-100 text-red-900 px-4 py-2 neobrutalism"
            >
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
