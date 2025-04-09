"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Category } from "@/lib/types";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
}: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(true);

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (category) {
      params.set("category", category);
      // Reset query when choosing a category
      params.delete("query");
    } else {
      params.delete("category");
    }

    router.push(`/?${params.toString()}`);
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const checkScrollable = () => {
    if (scrollContainerRef.current) {
      setShowLeftScroll(scrollContainerRef.current.scrollLeft > 0);
      setShowRightScroll(
        scrollContainerRef.current.scrollLeft <
          scrollContainerRef.current.scrollWidth -
            scrollContainerRef.current.clientWidth -
            10
      );
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScrollable);
      window.addEventListener("resize", checkScrollable);
      checkScrollable();
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", checkScrollable);
      }
      window.removeEventListener("resize", checkScrollable);
    };
  }, []);

  return (
    <div className="relative w-full max-w-6xl mx-auto px-2 sm:px-4 mb-6 overflow-hidden">
      {showLeftScroll && (
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-earth-light bg-opacity-90 rounded-full p-1 shadow-md z-10 hover:bg-earth-hard transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-earth-hard hidden sm:block"
        aria-label="Scroll left"
      >
        <ChevronLeft size={20} className="text-gray-800" />
      </button>
      )}

      <div
      ref={scrollContainerRef}
      className="flex gap-2  overflow-x-auto overflow-hidden py-2 px-1"
      onScroll={checkScrollable}
      >
      <button
        onClick={() => handleCategoryChange("")}
        className={`px-3 py-1.5 rounded-full text-sm cursor-pointer transition-all whitespace-nowrap flex-shrink-0 snap-start ${
        !selectedCategory
          ? "bg-earth-hard text-gray-200 hover:-translate-y-1"
          : "bg-cream text-gray-800 hover:bg-earth-light hover:-translate-y-1"
        }`}
      >
        20 aleatorias
      </button>

      {categories.map((category) => (
        <button
        key={category.idCategory}
        onClick={() => handleCategoryChange(category.strCategory)}
        className={`px-3 py-1.5 rounded-full text-sm cursor-pointer transition-all whitespace-nowrap flex-shrink-0 snap-start ${
          selectedCategory === category.strCategory
          ? "bg-earth-hard text-gray-200 hover:-translate-y-1"
          : "bg-cream text-gray-800 hover:bg-earth-light hover:-translate-y-1"
        }`}
        >
        {category.strCategory}
        </button>
      ))}
      </div>

      {showRightScroll && (
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-earth-light bg-opacity-90 rounded-full p-1 shadow-md z-10 hover:bg-earth-hard transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-earth-hard hidden sm:block"
        aria-label="Scroll right"
      >
        <ChevronRight size={20} className="text-gray-800" />
      </button>
      )}
    </div>
  );
}
