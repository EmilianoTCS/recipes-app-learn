"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { confDatos } from "@/lib/types";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DifficultyFilterProps {
  difficulties: confDatos[];
  selectedDifficulty: string;
}

export default function DifficultyFilter({
  difficulties,
  selectedDifficulty,
}: DifficultyFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(true);

  const handleCategoryChange = (difficulty: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (difficulty) {
      params.set("difficulty", difficulty);
    } else {
      params.delete("difficulty");
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
      <h2 className="text-md sm:text-xl font-semibold text-cream ">
        Dificultad
      </h2>
      {showLeftScroll && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-5.5 bg-earth-light bg-opacity-90 rounded-full p-1 shadow-md z-10 hover:bg-earth-hard transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-earth-hard hidden sm:block"
          aria-label="Scroll left"
        >
          <ChevronLeft size={20} className="text-gray-800" />
        </button>
      )}

      <div
        ref={scrollContainerRef}
        className="flex gap-1 overflow-x-auto overflow-y-hidden py-2 px-1 scrollbar-hide"
        onScroll={checkScrollable}
      >
        <button
          onClick={() => handleCategoryChange("")}
          className={`px-3 py-1.5 rounded-full text-sm cursor-pointer transition-all whitespace-nowrap flex-shrink-0 snap-start ${
            !selectedDifficulty
              ? "bg-earth-hard text-gray-200 hover:-translate-y-1"
              : "bg-cream text-gray-800 hover:bg-earth-light hover:-translate-y-1"
          }`}
        >
          Todas
        </button>

        {difficulties.map((diff) => (
          <button
            key={diff.datovisible}
            onClick={() => handleCategoryChange(diff.datovisible)}
            className={`px-3 py-1.5 rounded-full text-sm cursor-pointer transition-all whitespace-nowrap flex-shrink-0 snap-start ${
              selectedDifficulty === diff.datovisible
                ? "bg-earth-hard text-gray-200 hover:-translate-y-1"
                : "bg-cream text-gray-800 hover:bg-earth-light hover:-translate-y-1"
            }`}
          >
            {diff.datovisible}
          </button>
        ))}
      </div>

      {showRightScroll && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-5.5 bg-earth-light bg-opacity-90 rounded-full p-1 shadow-md z-10 hover:bg-earth-hard transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-earth-hard hidden sm:block"
          aria-label="Scroll right"
        >
          <ChevronRight size={20} className="text-gray-800" />
        </button>
      )}
    </div>
  );
}
