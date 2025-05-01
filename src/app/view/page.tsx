"use client";

import { Suspense } from "react";
import { Card } from "@/components/ui/card";
import ViewContent from "./view-content";

export default function ViewPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4">
      <Suspense
        fallback={
          <div className="max-w-2xl mx-auto">
            <Card className="p-6 bg-gray-100 rounded-2xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]">
              <div className="text-center">
                <p className="text-gray-600">Loading...</p>
              </div>
            </Card>
          </div>
        }
      >
        <ViewContent />
      </Suspense>
    </main>
  );
}
