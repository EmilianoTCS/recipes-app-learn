// src/components/RecipeCard.tsx
import React from "react";
import {
  Clock,
  ChefHat,
  Flame,
  Globe,
  X,
  Package,
} from "lucide-react";
import Image from "next/image";

interface RecipeFound {
  title: string;
  description: string;
  image: string;
  video?: string;
  instructions: string;
  time: string;
  difficulty: string;
  calories: string;
  proteins: string;
  isFavourite: boolean;
  area: string;
}

interface RecipeCardProps {
  recipe: RecipeFound;
  onClose: () => void;
}

const RecipeCardPopUp: React.FC<RecipeCardProps> = ({ recipe, onClose }) => {
  // Dividir los pasos en un array basado en los números seguidos de puntos
  const steps = recipe.instructions
    ? recipe.instructions.split(/\d+\./).filter((step) => step.trim() !== "")
    : [];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-cream rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          {/* Imagen de cabecera */}
          <div className="h-64 overflow-hidden rounded-t-lg">
            {recipe.image ? (
              <Image
                src={recipe.image || "/api/placeholder/400/250"}
                alt={recipe.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const fallbackText = document.createElement("div");
                  fallbackText.textContent = "Imagen no disponible";
                  fallbackText.className =
                    "absolute inset-0 flex items-center justify-center bg-earth-light/20 text-earth-hard/40";
                  target.parentElement?.appendChild(fallbackText);
                }}
              />
            ) : (
              <div className="w-full h-full bg-earth-light/20 flex items-center justify-center">
                <Package size={64} className="text-earth-hard/40" />
              </div>
            )}
          </div>

          {/* Botón de cerrar */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {/* Encabezado */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-earth-hard mb-2">
              {recipe.title || "Receta encontrada"}
            </h2>
            <p className="text-earth-hard/80 mb-4">
              {recipe.description ||
                "Una deliciosa receta con tus ingredientes disponibles."}
            </p>

            {/* Datos de la receta */}
            <div className="flex flex-wrap gap-3 text-sm">
              {recipe.time && (
                <div className="flex items-center gap-1 bg-earth-hard text-cream px-3 py-1 rounded-full">
                  <Clock size={16} />
                  <span>{recipe.time}</span>
                </div>
              )}
              {recipe.difficulty && (
                <div className="flex items-center gap-1 bg-earth-hard text-cream px-3 py-1 rounded-full">
                  <ChefHat size={16}  />
                  <span>{recipe.difficulty}</span>
                </div>
              )}
              {recipe.calories && (
                <div className="flex items-center gap-1 bg-earth-hard text-cream px-3 py-1 rounded-full">
                  <Flame size={16}  />
                  <span>{recipe.calories}</span>
                </div>
              )}
              {recipe.area && (
                <div className="flex items-center gap-1 bg-earth-hard text-cream px-3 py-1 rounded-full">
                  <Globe size={16}  />
                  <span>{recipe.area}</span>
                </div>
              )}
            </div>
          </div>

          {/* Instrucciones */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-earth-hard mb-4 border-b border-earth-light pb-2">
              Instrucciones
            </h3>
            <ol className="space-y-4 list-decimal pl-5">
              {steps.length > 0 ? (
                steps.map((step, index) => (
                  <li key={index} className="text-earth-hard">
                    {step.trim()}
                  </li>
                ))
              ) : (
                <p className="text-earth-hard/80 italic">
                  No hay instrucciones disponibles.
                </p>
              )}
            </ol>
          </div>

          {/* Video si está disponible */}
          {recipe.video && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-earth-hard mb-4 border-b border-earth-light pb-2">
                Video
              </h3>
              <div className="aspect-video rounded-lg overflow-hidden bg-black">
                <iframe
                  src={recipe.video.replace("watch?v=", "embed/")}
                  title="Video de la receta"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-earth text-cream hover:bg-earth-light  cursor-pointer rounded-lg"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCardPopUp;
