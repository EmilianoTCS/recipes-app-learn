// app/favoritos/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLocalStorage } from "@/lib/hooks";
import { getMealById } from "@/lib/api";
import { MealDetails } from "@/lib/types";
import RecipeCard from "@/components/recipe/RecipeCard";

export default function FavoritesPage() {
  const [favorites] = useLocalStorage<string[]>("favoriteRecipes", []);
  const [loading, setLoading] = useState(true);
  const [favoriteMeals, setFavoriteMeals] = useState<MealDetails[]>([]);

  useEffect(() => {
    async function loadFavorites() {
      setLoading(true);

      try {
        const promises = favorites.map((id) => getMealById(id));
        const results = await Promise.all(promises);
        setFavoriteMeals(results.filter(Boolean) as MealDetails[]);
      } catch (error) {
        console.error("Error loading favorites:", error);
      } finally {
        setLoading(false);
      }
    }

    loadFavorites();
  }, [favorites]);

  const handleToggleFavorite = (id: string) => {
    const updatedFavorites = favorites.filter(
      (favoriteId) => favoriteId !== id
    );
    localStorage.setItem("favoriteRecipes", JSON.stringify(updatedFavorites));
    setFavoriteMeals(favoriteMeals.filter((meal) => meal.idMeal !== id));
  };

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-cream">
          Mis Recetas Favoritas
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-100 h-64 rounded-lg animate-pulse"
            ></div>
          ))}
        </div>
      </main>
    );
  }

  if (favorites.length === 0 || favoriteMeals.length === 0) {
    return (
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-cream">
          Mis recetas favoritas
        </h1>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-cream mb-4">
            No tienes favoritas
          </h2>
          <p className="text-earth-light mb-6">
            Agrega algunas haciendo click en el corazón de las recetas que te
            gusten
          </p>
          <Link
            href="/"
            className=" px-4 py-2 bg-cream text-earth-hard rounded-lg "
          >
            Explorar recetas
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-cream">
        Mis recetas favoritas
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {favoriteMeals.map((meal) => (
          <RecipeCard
            key={meal.idMeal}
            id={meal.idMeal}
            title={meal.strMeal}
            imageUrl={meal.strMealThumb}
            category={meal.strCategory}
            area={meal.strArea}
            isFavorite={true}
            onToggleFavorite={handleToggleFavorite}
          />
        ))}
      </div>
    </main>
  );
}
