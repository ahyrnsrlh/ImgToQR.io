"use client";

import { motion } from "framer-motion";
import { Github } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <motion.footer
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="w-full py-8 px-4 mt-auto"
    >
      <div className="max-w-md mx-auto">
        <div className="flex flex-row items-center justify-between gap-1">
          <div className="neobrutalism-yellow px-2 py-1.5">
            <p className="text-black font-medium text-sm">
              © {new Date().getFullYear()} ImgToQR.io
            </p>
          </div>
          <Link
            href="https://github.com/yourusername/qr-generator"
            target="_blank"
            rel="noopener noreferrer"
            className="neobrutalism bg-[#8E7DBE] text-white px-3 py-1.5 flex items-center gap-1.5 transform transition-transform hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            <Github className="w-5 h-5" />
            <span className="font-bold">View on GitHub</span>
          </Link>
        </div>
      </div>
    </motion.footer>
  );
}
