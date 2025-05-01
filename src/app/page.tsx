"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import ImageUpload from "@/components/ImageUpload";

export default function Home() {
  return (
    <>
      <div className="grid-background" />
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container max-w-4xl mx-auto p-8">
          <ImageUpload onImageSelect={() => {}} />
        </main>
        <Footer />
      </div>
    </>
  );
}
