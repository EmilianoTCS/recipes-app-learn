// app/recetas/[id]/page.tsx
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { getMealById, formatMealIngredients } from "@/lib/api";
import FavoriteButton from "@/components/recipe/FavoriteButton";

export const revalidate = 3600; // Revalidar datos cada hora

// Generar metadatos para SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const meal = await getMealById(id);

  if (!meal) {
    return {
      title: "Receta no encontrada",
    };
  }

  return {
    title: `${meal.strMeal} | Recetas App`,
    description: meal.strInstructions.substring(0, 160),
  };
}

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const meal = await getMealById(id);

  if (!meal) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Receta no encontrada</h1>
        <Link href="/" className="text-blue-600 hover:underline">
          Volver a la página principal
        </Link>
      </div>
    );
  }

  const ingredients = formatMealIngredients(meal);

  // Dividir las instrucciones en pasos si están separadas por puntos o numeradas
  const instructionSteps = meal.strInstructions
    .split(/\r\n|\n|\r|\./)
    .filter((step) => step.trim() !== "")
    .map((step) => step.trim() + (step.endsWith(".") ? "" : "."));

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center text-cream">
          <ArrowLeft size={20} className="mr-1" />
          Volver a recetas
        </Link>
      </div>

      <div className="bg-cream rounded-lg shadow-md overflow-hidden">
        <div className="relative h-64 md:h-96">
          <Image
            src={meal.strMealThumb}
            alt={meal.strMeal}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute top-4 right-4">
            <FavoriteButton id={meal.idMeal} />
          </div>
        </div>

        <div className="p-6">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-2 py-1 bg-earth-hard text-cream rounded-full text-sm">
              {meal.strCategory}
            </span>
            <span className="px-2 py-1 bg-earth-hard text-cream rounded-full text-sm">
              {meal.strArea}
            </span>
            {meal.strTags &&
              meal.strTags.split(",").map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                >
                  {tag.trim()}
                </span>
              ))}
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {meal.strMeal}
          </h1>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl text-gray-700 font-semibold mb-4 border-b pb-2">
                Ingredientes
              </h2>
              <ul className="space-y-2">
                {ingredients.map((ingredient) => (
                  <li key={ingredient.id} className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2 h-5 w-5 text-blue-600"
                    />
                    <span className="text-gray-700">
                      {ingredient.measure} {ingredient.name}
                    </span>
                  </li>
                ))}
              </ul>

              {meal.strYoutube && (
                <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-700">
                    Video tutorial
                  </h2>
                  <a
                    href={meal.strYoutube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-earth-hard text-white rounded-lg hover:bg-red-700 transition-all"
                  >
                    Ver en YouTube
                  </a>
                </div>
              )}
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-700">
                Preparación
              </h2>
              <ol className="space-y-4 text-gray-700 max-h-[450px] overflow-y-auto">
                {instructionSteps.map((step, index) => (
                  <li key={index} className="flex">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-earth-hard text-cream flex items-center justify-center mr-3">
                      {index + 1}
                    </div>
                    <p>{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {meal.strSource && (
            <div className="mt-8 text-sm text-gray-500">
              Fuente:{" "}
              <a
                href={meal.strSource}
                target="_blank"
                rel="noopener noreferrer"
                className="text-earth-light hover:underline"
              >
                {new URL(meal.strSource).hostname}
              </a>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
