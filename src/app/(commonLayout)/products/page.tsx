import { Button } from "@/components/ui/button";
import React from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import Image from "next/image";
import Link from "next/link";
import { renderStars } from "@/utils/renderStars";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { productSections } from "@/constants/products";

function ProductsPage() {
  return (
    <div className="bg-gray-100 border-b border-b-gray-200">
      <div className="container mx-auto p-4 md:px-10">
        <div className="bg-white rounded-3xl min-h-[500px] py-3 px-5">
          {/* Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-7">
            <Button
              size="sm"
              className="bg-gray-100 rounded-full border border-gray-300 gap-0 cursor-pointer"
            >
              <p>Categories</p>
              <IoMdArrowDropdown />
            </Button>
            <Button
              size="sm"
              className="bg-gray-100 rounded-full border border-gray-300 gap-0 cursor-pointer"
            >
              <p>Gender</p>
              <IoMdArrowDropdown />
            </Button>
            <Button
              size="sm"
              className="bg-gray-100 rounded-full border border-gray-300 gap-0 cursor-pointer"
            >
              <p>Rating</p>
              <IoMdArrowDropdown />
            </Button>
            <Button
              size="sm"
              className="bg-gray-100 rounded-full border border-gray-300 gap-0 cursor-pointer"
            >
              <p>Size</p>
              <IoMdArrowDropdown />
            </Button>
            <Button
              size="sm"
              className="bg-gray-100 rounded-full border border-gray-300 gap-0 cursor-pointer"
            >
              <p>Sort By</p>
              <IoMdArrowDropdown />
            </Button>
          </div>

          {/* Products */}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 scrollbar-hide">
            {productSections[0].products.map((product, index) => (
              <div
                key={index}
                className="flex flex-col rounded-2xl shadow hover:shadow-lg transition-all duration-200 p-2"
              >
                <div className="bg-gray-100 w-full h-[300px] rounded-2xl flex justify-center items-center">
                  <Image
                    src={product.url}
                    alt={`product-${index}`}
                    className="w-[220px] h-[220px] object-cover"
                    width={300}
                    height={400}
                  />
                </div>

                <Link
                  href={"/products/12345"}
                  className="mt-3 text-base font-medium hover:text-blue-400 transition-colors duration-300"
                >
                  Addidas Elegant Jersey
                </Link>

                <div className="flex items-center gap-1 text-sm mt-1">
                  <div className="flex">{renderStars(4)}</div>
                  <span className="text-gray-500 ml-1">1205</span>
                </div>

                <p className="text-lg font-semibold mt-1">
                  ${Number(124.56).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
          <div className="my-10 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>

                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    1
                  </PaginationLink>
                </PaginationItem>

                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>

                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductsPage;
