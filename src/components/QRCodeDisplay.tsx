"use client";

import { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Download } from "lucide-react";
import { motion } from "framer-motion";

interface QRCodeDisplayProps {
  value: { base64Url: string; fileName: string };
}

export default function QRCodeDisplay({ value }: QRCodeDisplayProps) {
  const qrRef = useRef<HTMLDivElement>(null);

  // Create a shorter URL that can be used to reconstruct the image
  const createShortUrl = (base64Url: string, fileName: string) => {
    // Create a unique identifier for the image
    const timestamp = Date.now();
    const shortId = btoa(`${timestamp}-${fileName}`).replace(
      /[^a-zA-Z0-9]/g,
      ""
    );

    // Store the base64 data in localStorage with the short ID
    localStorage.setItem(`img_${shortId}`, base64Url);

    // Return a URL that can be used to retrieve the image
    return `${window.location.origin}/view?img=${shortId}`;
  };

  const downloadQRCode = () => {
    if (!qrRef.current) return;

    const svg = qrRef.current.querySelector("svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);

      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = "qr-code.png";
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const shortUrl = createShortUrl(value.base64Url, value.fileName);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6 bg-gray-100 rounded-2xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]">
        <div className="flex flex-col items-center gap-4">
          <div ref={qrRef} className="bg-white p-4 rounded-xl shadow-inner">
            <QRCodeSVG
              value={shortUrl}
              size={200}
              level="H"
              includeMargin={true}
            />
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              Scan this QR code to view the image
            </p>
            <Button
              onClick={downloadQRCode}
              className="bg-white shadow-md hover:shadow-lg transition-shadow"
            >
              <Download className="w-4 h-4 mr-2" />
              Download QR Code
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
