"use client";
import React, { useState } from "react";
const hoodie = "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600&auto=format&fit=crop";
import Image from "next/image";
import { renderStars } from "@/utils/renderStars";
import { Button } from "@/components/ui/button";
import { FaMinus, FaPlus } from "react-icons/fa";

function SingleProductPage() {
  const [count, setCount] = useState(1);

  const handleCount = (type: "plus" | "minus") => {
    if (type === "plus") {
      setCount((prev) => prev + 1);
    } else {
      if (count > 1) {
        setCount((prev) => prev - 1);
      }
    }
  };

  return (
    <div className="container mx-auto p-6 md:px-20">
      <div className="flex flex-col md:flex-row gap-10">
        {/* Product Photo */}
        <div className="flex flex-col gap-5 max-w-[500px]">
          <div className="bg-gray-100 w-full flex justify-center items-center border border-gray-300 rounded-2xl p-5">
            <Image
              src={hoodie}
              alt="Product Image"
              width={300}
              height={400}
              className="h-[300px] md:h-[400px] w-auto rounded-2xl"
            />
          </div>
          <div className="max-w-5xl mx-auto flex overflow-x-auto gap-5 pb-4 scrollbar-hide">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="flex-shrink-0 cursor-pointer overflow-hidden group transition-transform duration-300 bg-gray-100 border border-gray-300 rounded-2xl"
              >
                <Image
                  src={hoodie}
                  alt="Hoodie Thumbnail"
                  width={200}
                  height={120}
                  className="object-cover w-[100px] h-[100px] rounded-xl group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Description */}
        <div className="flex-1 flex flex-col justify-start">
          <h2 className="text-lg font-medium mb-3">
            Levis Classic Denim Jacket
          </h2>
          <div className="flex items-center gap-2 mb-2">
            <p className="font-semibold text-3xl">$68.99</p>
            <p className="font-semibold text-gray-400 mt-1 text-sm line-through">
              $74.99
            </p>
          </div>
          <p className="mb-4">{renderStars(5)}</p>
          <p className="max-w-[700px]">
            This high-quality hoodie delivers the perfect blend of comfort,
            durability, and everyday style. Crafted from a premium cotton-poly
            fleece, it provides a soft, cozy interior and a smooth, structured
            exterior. Designed with a relaxed fit, adjustable drawstring hood,
            and a roomy kangaroo pocket, it&apos;s ideal for layering in any
            season. Ribbed cuffs and hem ensure lasting shape, while minimalist
            details add a clean, versatile look for casual outings or relaxed
            weekends.
          </p>

          <div className="flex items-center gap-4 mt-6 mb-10">
            <Button
              className="bg-gray-200 rounded-none border border-gray-300 cursor-pointer hover:bg-blue-200 transition-colors duration-300"
              onClick={() => handleCount("minus")}
            >
              <FaMinus />
            </Button>
            <p>{count}</p>
            <Button
              className="bg-gray-200 rounded-none border border-gray-300 cursor-pointer hover:bg-blue-200 transition-colors duration-300"
              onClick={() => handleCount("plus")}
            >
              <FaPlus />
            </Button>
          </div>
          <Button className="bg-black hover:bg-blue-400 text-white w-[300px] rounded-none h-[45px] font-bold cursor-pointer">
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SingleProductPage;
