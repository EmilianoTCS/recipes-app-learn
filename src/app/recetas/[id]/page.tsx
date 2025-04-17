import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Package } from "lucide-react";
import { getRecetasById } from "@/lib/api";
import FavoriteButton from "@/components/recipe/FavoriteButton";
import { log } from "node:console";
export const revalidate = 3600; // Revalidar cada hora

// Metadatos para SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;
  const meal = await getRecetasById(id);

  log("meal", meal);

  if (!meal) {
    return {
      title: "Receta no encontrada",
    };
  }

  return {
    title: `${meal.nombre} | Recetitas`,
    description: meal.descripcion,
  };
}

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;
  const meal = await getRecetasById(id);

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
          {meal.imagen ? (
            <Image
              src={meal.imagen || "/api/placeholder/400/250"}
              alt={meal.imagen}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              priority // Añade priority si esta imagen es importante para LCP
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                // Oculta la imagen rota
                target.style.display = "none";
                // Muestra un contenedor de fallback en su lugar
                const fallbackContainer = target.nextElementSibling;
                if (fallbackContainer) {
                  fallbackContainer.classList.remove("hidden");
                }
              }}
            />
          ) : null}{" "}
          <div
            className={`w-full h-full bg-earth-light/20 flex items-center justify-center absolute inset-0 ${
              meal.imagen ? "hidden" : ""
            }`}
          >
            <Package size={64} className="text-earth-hard/40" />
            <span className="ml-2 text-earth-hard/60">
              Imagen no disponible
            </span>
          </div>
          <div className="absolute top-4 right-4">
            <FavoriteButton id={meal.id} />
          </div>
        </div>

        <div className="p-6">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-2 py-1 bg-earth-hard text-cream rounded-full text-sm">
              {meal.categoria}
            </span>
            <span className="px-2 py-1 bg-earth-hard text-cream rounded-full text-sm">
              {meal.region}
            </span>
            <span className="px-2 py-1 bg-earth-hard text-cream rounded-full text-sm">
              {meal.calories} Calorías
            </span>
            <span className="px-2 py-1 bg-earth-hard text-cream rounded-full text-sm">
              {meal.proteins} Proteínas
            </span>
            <span className="px-2 py-1 bg-earth-hard text-cream rounded-full text-sm">
              {meal.tiempo}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {meal.nombre}
          </h1>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl text-gray-700 font-semibold mb-4 border-b pb-2">
                Ingredientes
              </h2>
              <ul className="space-y-2">
                {meal.ingredientes.map(
                  (ingredient: {
                    id: number;
                    cantidad: number;
                    unidad: string;
                    nombre: string;
                  }) => (
                    <li key={ingredient.id} className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-2 h-5 w-5 text-blue-600"
                      />
                      <span className="text-gray-700 flex flex-row items-center">
                        <div>
                          {ingredient.cantidad} {ingredient.unidad} -&nbsp;
                        </div>
                        <span className="font-bold">{ingredient.nombre}</span>
                      </span>
                    </li>
                  )
                )}
              </ul>

              {meal.video && (
                <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-700">
                    Video tutorial
                  </h2>
                  <a
                    href={meal.video}
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
              <ol className="space-y-4 text-gray-700 max-h-[450px] overflow-y-auto pr-2">
                {meal.pasos.map(
                  (paso: {
                    numero: number;
                    nombre: string;
                    descripcion: string;
                  }) => (
                    <li key={paso.numero} className="flex">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-earth-hard text-cream flex items-center justify-center mr-3">
                        {paso.numero}
                      </div>
                      <div>
                        <h3 className="font-bold">{paso.nombre}</h3>
                        <p className="text-sm">{paso.descripcion}</p>
                      </div>
                    </li>
                  )
                )}
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
