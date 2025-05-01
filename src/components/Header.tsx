"use client";

import { motion } from "framer-motion";
import { QrCode } from "lucide-react";

export function Header() {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="w-full py-8 px-4"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="neobrutalism-yellow p-6 rotate-[-2deg]">
            <div className="flex items-center justify-center gap-3">
              <QrCode className="w-10 h-10 text-white" />
              <h1 className="text-3xl font-black text-white tracking-tight">
                ImgToQR.io
              </h1>
            </div>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg font-medium text-white bg-[#8E7DBE] px-4 py-2 neobrutalism rotate-[1deg]"
          >
            Upload an image and generate a QR code instantly
          </motion.p>
        </div>
      </div>
    </motion.header>
  );
}
