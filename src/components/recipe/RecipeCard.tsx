import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";

interface RecipeCardProps {
  id: string;
  title: string;
  imageUrl: string;
  category: string;
  area: string;
  calories: string;
  proteins: string;
  isFavorite?: boolean;
  dificulty?: string;
  time?: string;
  onToggleFavorite?: (id: string) => void;
}

export default function RecipeCard({
  id,
  title,
  imageUrl,
  category,
  area,
  calories,
  proteins,
  dificulty,
  time,
  isFavorite = false,
  onToggleFavorite,
}: RecipeCardProps) {
  const [favorite, setFavorite] = useState(isFavorite);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorite(!favorite);
    if (onToggleFavorite) {
      onToggleFavorite(id);
    }
  };

  return (
    <div className="bg-cream rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1 w-full">
      <Link href={`/recetas/${id}`} className="block h-full">
        <div className="relative">
          <div className="relative h-40 sm:h-48 md:h-52 lg:h-56 w-full">
            <Image
              src={imageUrl || "/api/placeholder/400/250"}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </div>
          <button
            onClick={handleFavoriteClick}
            className="absolute top-2 right-2 p-2 bg-cream bg-opacity-70 rounded-full hover:bg-opacity-90 transition-all duration-200"
            aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart
              size={20}
              className={
                favorite ? "fill-red-500 text-red-500" : "text-gray-500"
              }
            />
          </button>
        </div>
        <div className="p-2 sm:p-3 md:p-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800  line-clamp-2 min-h-[3.5rem] mb-2">
            {title}
          </h3>

          <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-1 sm:gap-2 w-full">
            {category && (
              <span className="px-2 py-1 bg-earth-hard text-cream rounded-full text-xs truncate">
                {category}
              </span>
            )}
            {area && (
              <span className="px-2 py-1 bg-earth-hard text-cream rounded-full text-xs truncate">
                {area}
              </span>
            )}
            {calories && (
              <span className="px-2 py-1 bg-earth-hard text-cream rounded-full text-xs truncate">
                Calorías: {calories}
              </span>
            )}
            {proteins && (
              <span className="px-2 py-1 bg-earth-hard text-cream rounded-full text-xs truncate">
                Proteínas: {proteins}
              </span>
            )}
            {dificulty && (
              <span className="px-2 py-1 bg-earth-hard text-cream rounded-full text-xs truncate">
              Dificultad: {dificulty}
              </span>
            )}
            {time && (
              <span className="px-2 py-1 bg-earth-hard text-cream rounded-full text-xs truncate" title={time}>
              Tiempo aprox: {time}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
