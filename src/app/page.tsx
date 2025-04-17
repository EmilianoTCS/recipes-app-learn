import { Suspense } from "react";
import CategoryFilter from "@/components/ui/CategoryFilter";
import RecipeGrid from "@/components/recipe/RecipeGrid";
import { getConfDatos } from "@/lib/api";
import DifficultyFilter from "@/components/ui/DifficultyFilter";

export const revalidate = 3600; // Revalidar datos cada hora

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<{
    query?: string;
    category?: string;
    difficulty?: string;
    region?: string;
    porcion?: number | null;
  }>;
}) {
  // Espera searchParams antes de acceder a sus propiedades
  const params = (await searchParams) || {};
  const query = params.query || "";
  const selectedCategory = params.category || "";
  const selectedDifficultad = params.difficulty || "";
  const selectedRegion = params.region || "";
  const selectedPorcion = params.porcion || null;

  // Obtener las categorías para el filtro
  const categories = await getConfDatos("categoria", null);
  const difficulties = await getConfDatos("dificultad", null);

  // const recetaId = await getRecetasById(5);

  return (
    <main className="container mx-auto px-4 py-4 sm:py-6 md:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-6 md:mb-8 text-cream">
        Descubriendo recetas
      </h1>

      <div className="mb-4 sm:mb-6 md:mb-8 space-y-3 sm:space-y-4">

        <Suspense
          fallback={
            <div className="h-10 sm:h-12 bg-gray-100 rounded-lg animate-pulse"></div>
          }
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 justify-center items-center max-w-5xl mx-auto">
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
            />
            <DifficultyFilter
              difficulties={difficulties}
              selectedDifficulty={selectedDifficultad}
            />
            </div>
        </Suspense>
      </div>

      <Suspense
        fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-100 h-48 sm:h-56 md:h-64 rounded-lg animate-pulse"
              ></div>
            ))}
          </div>
        }
      >
        <RecipeGrid
          query={query}
          category={selectedCategory}
          region={selectedRegion}
          difficulty={selectedDifficultad}
          porcion={selectedPorcion}
        />
      </Suspense>
    </main>
  );
}
