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
  calories: number;
  proteins: number;
  isFavorite?: boolean;
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
    <div className="bg-cream rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
      <Link href={`/recetas/${id}`}>
        <div className="relative">
          <div className="relative h-48 w-full">
            <Image
              src={imageUrl || "/api/placeholder/400/250"}
              alt={title}
              fill
              className="object-cover"
            />
          </div>
          <button
            onClick={handleFavoriteClick}
            className="absolute top-2 right-2 p-2 bg-cream bg-opacity-70 rounded-full"
          >
            <Heart
              size={20}
              className={
                favorite ? "fill-red-500 text-red-500" : "text-gray-500"
              }
            />
          </button>
        </div>
        <div className="p-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
            {title}
          </h3>
          <div className="grid grid-cols-2 text-sm p-2 gap-2 w-auto">
            {category && (
              <span className="px-2 py-1 bg-earth-hard text-cream rounded-full text-xs">
                {category}
              </span>
            )}
            {area && (
              <span className="px-2 py-1 bg-earth-hard text-cream rounded-full text-xs">
                {area}
              </span>
            )}
            {calories && (
              <span className="px-2 py-1 bg-earth-hard text-cream rounded-full text-xs">
                Calorías aprox: {calories}
              </span>
            )}
            {proteins && (
              <span className="px-2 py-1 bg-earth-hard text-cream rounded-full text-xs">
                Proteínas aprox: {proteins}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
