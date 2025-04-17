// components/recipe/RecipeGrid.tsx
"use client";

import { useState, useEffect } from "react";
import RecipeCard from "./RecipeCard";
import { getRecetas } from "@/lib/api";
import { Meal } from "@/lib/types";
import { useLocalStorage } from "@/lib/hooks";

interface RecipeGridProps {
  query?: string;
  category?: string;
  region?: string;
  difficulty?: string;
  porcion?: number | null;
}

export default function RecipeGrid({
  category = "",
  region = "",
  difficulty = "",
  porcion = null,
}: RecipeGridProps) {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useLocalStorage<number[]>(
    "favoriteRecipes",
    []
  );

  useEffect(() => {
    async function loadMeals() {
      setLoading(true);
      try {
        let fetchedMeals: Meal[] = [];
        fetchedMeals = await getRecetas(difficulty, category, region, porcion);
        setMeals(fetchedMeals);
      } catch (error) {
        console.error("Error fetching meals:", error);
      } finally {
        setLoading(false);
      }
    }

    loadMeals();
  }, [category, region, difficulty, porcion]);

  const handleToggleFavorite = (id_receta: number) => {
    setFavorites((prev) =>
      prev.includes(id_receta)
        ? prev.filter((favId) => favId !== id_receta)
        : [...prev, id_receta]
    );
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-100 h-64 rounded-lg animate-pulse"
          ></div>
        ))}
      </div>
    );
  }

  if (meals.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-cream">
          No se encontraron recetas
        </h2>
        <p className="mt-2 text-earth-light">
          Intenta con otra búsqueda o categoría
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5">
      {meals.map((meal) => (
        <RecipeCard
          key={meal.id_receta}
          id={meal.id_receta}
          title={meal.nombre}
          imageUrl={meal.url_imagen}
          category={meal.categoria}
          area={meal.region}
          calories={meal.calories}
          proteins={meal.proteins}
          isFavorite={favorites.includes(meal.id_receta)}
          dificulty={meal.dificultad}
          time={meal.tiempo}
          onToggleFavorite={handleToggleFavorite}
        />
      ))}
    </div>
  );
}
