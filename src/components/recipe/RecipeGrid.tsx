// components/recipe/RecipeGrid.tsx
'use client';

import { useState, useEffect } from 'react';
import RecipeCard from './RecipeCard';
import { getRandomMeals, searchMealsByName, getMealsByCategory } from '@/lib/api';
import { Meal } from '@/lib/types';
import { useLocalStorage } from '@/lib/hooks';

interface RecipeGridProps {
  query?: string;
  category?: string;
}

export default function RecipeGrid({ query = '', category = '' }: RecipeGridProps) {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useLocalStorage<string[]>('favoriteRecipes', []);

  useEffect(() => {
    async function loadMeals() {
      setLoading(true);
      try {
        let fetchedMeals: Meal[] = [];
        
        if (query) {
          fetchedMeals = await searchMealsByName(query);
        } else if (category) {
          fetchedMeals = await getMealsByCategory(category);
        } else {
          fetchedMeals = await getRandomMeals();
        }
        
        setMeals(fetchedMeals);
      } catch (error) {
        console.error('Error fetching meals:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadMeals();
  }, [query, category]);

  const handleToggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(favId => favId !== id) 
        : [...prev, id]
    );
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-gray-100 h-64 rounded-lg animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (meals.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-700">No se encontraron recetas</h2>
        <p className="mt-2 text-gray-500">Intenta con otra búsqueda o categoría</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5">
      {meals.map(meal => (
        <RecipeCard
          key={meal.idMeal}
          id={meal.idMeal}
          title={meal.strMeal}
          imageUrl={meal.strMealThumb}
          category={meal.strCategory}
          area={meal.strArea}
          calories={meal.calories}
          proteins={meal.proteins}
          isFavorite={favorites.includes(meal.idMeal)}
          dificulty={meal.dificulty}
          time={meal.time}
          onToggleFavorite={handleToggleFavorite}
        />
      ))}
    </div>
  );
}