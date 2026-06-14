"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FaHome } from "react-icons/fa";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 text-center px-4">
      {/* Big 404 */}
      <h1 className="text-[8rem] md:text-[10rem] font-extrabold text-gray-800 leading-none">
        404
      </h1>

      {/* Message */}
      <div className="max-w-md mx-auto mt-4">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-3">
          Page Not Found
        </h2>
        <p className="text-gray-500 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or may have been
          moved. Try heading back to the homepage to continue exploring Dekora
          Clothings.
        </p>

        {/* Back Home Button */}
        <Button
          type="button"
          asChild
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-2 rounded-lg shadow-md transition-all"
        >
          <Link href="/" className="flex items-center gap-2">
            <FaHome className="text-lg" />
            <span>Back to Home</span>
          </Link>
        </Button>
      </div>

      {/* Footer Note */}
      <div className="absolute bottom-10 text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Dekora Clothings
      </div>
    </div>
  );
}
