import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@/components/shared/Container";
import { Calendar, Tag, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ daynamicPage: string }>;
}

// Dynamic page data fetching on the server
async function getPageData(slug: string) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api";
    const res = await fetch(`${backendUrl}/pages/${slug}`, {
      next: { revalidate: 60 }, // Cache page details for 60 seconds
    });

    if (!res.ok) {
      return null;
    }

    const payload = await res.json();
    return payload?.data;
  } catch (error) {
    console.error("Failed to fetch dynamic page on server-side:", error);
    return null;
  }
}

// Generate dynamic SEO Metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { daynamicPage } = await params;
  const page = await getPageData(daynamicPage);

  if (!page || !page.isActive) {
    return {
      title: "Page Not Found - Apex",
      description: "The requested page was not found.",
    };
  }

  const seo = page.seo || {};
  return {
    title: `${seo.metaTitle || page.title} - Apex`,
    description: seo.metaDescription || "Apex E-Commerce Dynamic Page Information Protocol.",
    keywords: seo.metaKeywords || [],
    openGraph: {
      title: seo.ogTitle || seo.metaTitle || page.title,
      description: seo.ogDescription || seo.metaDescription,
      images: seo.ogImage ? [{ url: seo.ogImage }] : [],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: seo.twitterTitle || seo.metaTitle || page.title,
      description: seo.twitterDescription || seo.metaDescription,
      images: seo.twitterImage ? [seo.twitterImage] : [],
    },
    alternates: {
      canonical: seo.canonicalUrl || undefined,
    },
  };
}

export default async function DynamicCustomPage({ params }: PageProps) {
  const { daynamicPage } = await params;
  const page = await getPageData(daynamicPage);

  // Return standard 404 page if not found or inactive
  if (!page || !page.isActive) {
    notFound();
  }

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100/50 dark:from-[#0B0B14] dark:to-[#09090e] min-h-[80vh] py-12 md:py-16 transition-colors duration-300">
      <Container>
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 dark:text-slate-455 dark:hover:text-white transition duration-200"
            >
              <ArrowLeft size={14} /> Back to Home
            </Link>
          </div>

          {/* Page Card */}
          <article className="bg-white dark:bg-[#121320] border border-gray-200/80 dark:border-slate-800/60 rounded-3xl p-6 md:p-10 shadow-sm dark:shadow-2xl">
            {/* Header Metadata */}
            <header className="border-b border-gray-150 dark:border-slate-800/60 pb-6 mb-8 space-y-4">
              <div className="flex flex-wrap gap-2.5 items-center">
                {page.group && (
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-black tracking-wider uppercase bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                    <Tag size={10} /> {page.group}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-gray-400 dark:text-slate-500">
                  <Calendar size={11} /> Updated on {new Date(page.updatedAt || page.createdAt || Date.now()).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  })}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
                {page.title}
              </h1>
            </header>

            {/* Rich text Content rendering */}
            <section className="prose prose-slate dark:prose-invert max-w-none text-sm md:text-base leading-relaxed text-gray-700 dark:text-slate-300">
              <div 
                dangerouslySetInnerHTML={{ __html: page.content }} 
                className="space-y-4 [&>p]:leading-relaxed [&>h2]:text-xl [&>h2]:font-bold [&>h2]:mt-6 [&>h2]:mb-3 [&>h2]:text-gray-900 [&>h2]:dark:text-white [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5 [&>a]:text-primary [&>a]:hover:underline"
              />
            </section>
          </article>
        </div>
      </Container>
    </div>
  );
}
