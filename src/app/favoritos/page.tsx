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

  const Title = () => (
    <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-cream">
      Mis recetas favoritas
    </h1>
  );

  if (loading) {
    return (
      <main className="min-h-screen max-w-screen-xl mx-auto px-4 py-8">
        <Title />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-100 h-64 rounded-xl animate-pulse"
            ></div>
          ))}
        </div>
      </main>
    );
  }

  if (favorites.length === 0 || favoriteMeals.length === 0) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center text-center px-4 py-8">
        <Title />
        <div className="max-w-md">
          <h2 className="text-lg sm:text-xl font-semibold text-cream mb-4">
            No tienes favoritas
          </h2>
          <p className="text-sm sm:text-base text-earth-light mb-6">
            Agrega algunas haciendo click en el corazón de las recetas que te gusten
          </p>
          <Link
            href="/"
            className="inline-block px-4 py-2 bg-cream text-earth-hard rounded-lg text-sm sm:text-base"
          >
            Explorar recetas
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen max-w-screen-xl mx-auto px-4 py-8">
      <Title />
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
            calories={meal.calories}
            proteins={meal.proteins}
            onToggleFavorite={handleToggleFavorite}
          />
        ))}
      </div>
    </main>
  );
}
