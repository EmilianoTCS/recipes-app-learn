// components/ui/CategoryFilter.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Category } from "@/lib/types";

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

  return (
    <div className="flex flex-wrap gap-2 mx-auto aling-center justify-center">
      <button
        onClick={() => handleCategoryChange("")}
        className={`px-3 py-1 rounded-full text-sm cursor-pointer transition-all ${
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
          className={`px-3 py-1 rounded-full text-sm cursor-pointer transition-all ${
            selectedCategory === category.strCategory
              ? "bg-earth-hard text-gray-200 hover:-translate-y-1"
              : "bg-cream text-gray-800 hover:bg-earth-light hover:-translate-y-1 "
          }`}
        >
          {category.strCategory}
        </button>
      ))}
    </div>
  );
}
