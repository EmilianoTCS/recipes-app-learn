// src/components/RecipeCard.tsx
import React from "react";
import {
  Clock,
  ChefHat,
  Flame,
  Globe,
  X,
  Package,
  RefreshCcw,
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
  onSearchAgain: () => void;
}

const RecipeCardPopUp: React.FC<RecipeCardProps> = ({
  recipe,
  onClose,
  onSearchAgain,
}) => {
  // Dividir los pasos en un array basado en los números seguidos de puntos
  const steps = recipe.instructions
    ? recipe.instructions.split(/\d+\./).filter((step) => step.trim() !== "")
    : [];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-cream rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          {/* Imagen de cabecera */}
          <div className="h-64 overflow-hidden rounded-t-lg relative">
            {/* Añadido relative aquí */}
            {recipe.image ? (
              <Image
                src={recipe.image || "/api/placeholder/400/250"}
                alt={recipe.title}
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
                recipe.image ? "hidden" : ""
              }`}
            >
              <Package size={64} className="text-earth-hard/40" />
              <span className="ml-2 text-earth-hard/60">
                Imagen no disponible
              </span>
            </div>
          </div>

          {/* Botón de cerrar */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70 transition-colors z-10" // Asegura z-index
            aria-label="Cerrar" // Añade accesibilidad
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
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
              {" "}
              {/* Ajustado gap */}
              {recipe.time && (
                <div className="flex items-center gap-1 bg-earth-hard text-cream px-3 py-1 rounded-full">
                  <Clock size={16} />
                  <span>{recipe.time}</span>
                </div>
              )}
              {recipe.difficulty && (
                <div className="flex items-center gap-1 bg-earth-hard text-cream px-3 py-1 rounded-full">
                  <ChefHat size={16} />
                  <span>{recipe.difficulty}</span>
                </div>
              )}
              {recipe.calories && (
                <div className="flex items-center gap-1 bg-earth-hard text-cream px-3 py-1 rounded-full">
                  <Flame size={16} />
                  <span>{recipe.calories}</span>
                </div>
              )}
              {recipe.area && (
                <div className="flex items-center gap-1 bg-earth-hard text-cream px-3 py-1 rounded-full">
                  <Globe size={16} />
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
            <ol className="space-y-3 list-decimal pl-5 text-earth-hard/90">
              {" "}
              {/* Ajustado space y color */}
              {steps.length > 0 ? (
                steps.map((step, index) => (
                  <li key={index} className="leading-relaxed">
                    {" "}
                    {/* Mejorado line-height */}
                    {step.trim()}
                  </li>
                ))
              ) : (
                <p className="text-earth-hard/60 italic">
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
              <div className="aspect-video rounded-lg overflow-hidden bg-black shadow-md">
                {" "}
                {/* Añadido shadow */}
                <iframe
                  src={
                    recipe.video.includes("embed")
                      ? recipe.video
                      : recipe.video.replace("watch?v=", "embed/")
                  } // Más robusto
                  title="Video de la receta"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0" // Quitamos borde por defecto del iframe
                ></iframe>
              </div>
            </div>
          )}

          {/* Botones de acción */}
          {/* v-- Modificado aquí --v */}
          <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3">
            {" "}
            {/* Añadido flex-col para móvil, gap */}
            <button
              onClick={onSearchAgain} // Llama a la nueva función
              className="px-5 py-2 text-earth-hard bg-cream hover:bg-earth-light cursor-pointer rounded-lg flex items-center justify-center gap-2 transition-colors border border-earth-hard" // Estilo diferente
            >
              <RefreshCcw size={18} /> {/* Icono opcional */}
              Buscar de nuevo
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 bg-earth text-cream hover:bg-earth-light cursor-pointer rounded-lg transition-colors flex items-center justify-center gap-2" // Alineado estilo
            >
              Cerrar
            </button>
          </div>
          {/* ^-- Modificado aquí --^ */}
        </div>
      </div>
    </div>
  );
};

export default RecipeCardPopUp;
