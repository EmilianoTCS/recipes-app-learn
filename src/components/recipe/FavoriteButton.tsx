// components/recipe/FavoriteButton.tsx
"use client";

import { useState, useEffect } from "react";
import { Heart, Printer } from "lucide-react";
import { useLocalStorage } from "@/lib/hooks";

interface FavoriteButtonProps {
  id: string;
}

export default function FavoriteButton({ id }: FavoriteButtonProps) {
  const [favorites, setFavorites] = useLocalStorage<string[]>(
    "favoriteRecipes",
    []
  );
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    setIsFavorite(favorites.includes(id));
  }, [favorites, id]);

  const toggleFavorite = () => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  const printRecipe = () => {
    window.print();
  };

  return (
    <div className="flex space-x-2 cursor-pointer">
      <button
        onClick={toggleFavorite}
        className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 cursor-pointer"
        aria-label={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
      >
        <Heart
          size={20}
          className={isFavorite ? "fill-red-500 text-red-500" : "text-gray-500"}
        />
      </button>
      <button
        onClick={printRecipe}
        className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 cursor-pointer"
        aria-label="Imprimir receta"
      >
        <Printer size={20} className="text-gray-500" />
      </button>
    </div>
  );
}
