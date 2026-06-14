"use client";

import React from "react";

function FactoryProcess() {
  return (
    <section className="py-[50px] bg-gray-200 mb-5 rounded-md">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Our Factory Process
        </h2>
        <p className="text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
          At <span className="font-semibold text-blue-600">White Label</span>,
          every custom jersey is made with precision and passion. From
          high-quality fabric selection to final stitching and printing, we
          ensure top-notch craftsmanship across our factories in the UK and
          Bangladesh. Here&apos;s how we bring your team&apos;s dream jersey to
          life.
        </p>

        {/* Video Section */}
        <div className="rounded-2xl overflow-hidden shadow-2xl max-w-5xl mx-auto mb-10">
          <div className="relative w-full aspect-video bg-black">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/-TOgxRFImjU"
              title="Jersey Creation Process"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FactoryProcess;
