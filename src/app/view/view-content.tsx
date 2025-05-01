"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";

export default function ViewContent() {
  const searchParams = useSearchParams();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const imgId = searchParams.get("img");
    if (imgId) {
      const storedImage = localStorage.getItem(`img_${imgId}`);
      if (storedImage) {
        setImageUrl(storedImage);
      } else {
        setError("Image not found or has expired");
      }
    } else {
      setError("No image ID provided");
    }
  }, [searchParams]);

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="p-6 bg-gray-100 rounded-2xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
            <p className="text-gray-600">{error}</p>
          </div>
        </Card>
      </div>
    );
  }

  if (!imageUrl) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="p-6 bg-gray-100 rounded-2xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]">
          <div className="text-center">
            <p className="text-gray-600">Loading image...</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-6 bg-gray-100 rounded-2xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]">
        <div className="flex flex-col items-center gap-4">
          <img
            src={imageUrl}
            alt="Shared image"
            className="max-w-full h-auto rounded-xl shadow-lg"
          />
        </div>
      </Card>
    </div>
  );
}
