import React from "react";
import catalogue from "@/assets/catalgoue-bg.webp";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function HomeCatalogue() {
  return (
    <div className=" bg-gray-700 h-[300px] md:h-[400px] my-[80px] rounded-lg relative overflow-hidden">
      <div className="w-3/5 ml-auto h-full">
        <Image
          src={catalogue}
          width={500}
          height={300}
          alt="catalogue"
          className="h-full w-full"
        />
      </div>
      <div className="absolute top-0 left-0 h-full w-full bg-black/40 z-10 flex justify-start items-center px-4 sm:px-16">
        <div>
          <p className="text-4xl md:text-5xl font-bold text-white uppercase mb-7">
            New Catalogs
          </p>
          <Button
            className="bg-white md:text-lg w-full font-bold h-[40px] md:h-[50px] hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer rounded"
            asChild
          >
            <Link href="/catalogues">View Now</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default HomeCatalogue;
