import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

function Cartpage() {
  return (
    <div className="container p-3 mx-auto">
      <p className="mb-3">Cart Page</p>
      <Button
        className="bg-gray-500 text-white px-5 rounded cursor-pointer hover:bg-gray-700 duration-300 ease-in-out transition-colors"
        asChild
      >
        <Link href="/custom-order">{`-> Custom Order`}</Link>
      </Button>
    </div>
  );
}

export default Cartpage;
