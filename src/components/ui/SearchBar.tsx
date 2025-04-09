"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("query") || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams(searchParams.toString());
    if (searchTerm) {
      params.set("query", searchTerm);
    } else {
      params.delete("query");
    }

    router.push(`/?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="w-full flex justify-center items-center px-4 mt-4"
    >
      <div className="relative w-full sm:max-w-md md:max-w-lg lg:max-w-xl">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar recetas..."
          className="w-full py-2.5 pl-10 pr-4 border border-cream rounded-lg focus:ring-2 focus:ring-earth-light focus:border-earth-light text-cream bg-transparent placeholder:text-cream/60"
        />
        <button
          type="submit"
          className="absolute inset-y-0 left-0 flex items-center pl-3"
        >
          <Search size={20} className="text-cream" />
        </button>
      </div>
    </form>
  );
}
