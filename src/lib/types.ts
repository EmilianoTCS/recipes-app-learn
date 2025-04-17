// lib/types.ts
// export interface Meal {
//   idMeal: string;
//   strMeal: string;
//   strCategory: string;
//   strArea: string;
//   strMealThumb: string;
//   strTags?: string;
//   proteins: string;
//   calories: string;
//   dificulty: string;
//   time: string;
// }
export interface Meal {
  id_receta: number;
  categoria: string;
  descripcion?: string;
  nombre: string;
  dificultad: string;
  notas?: string;
  region?: string;
  tiempo?: string;
  url_imagen?: string;
  url_video?: string;
  proteins: string;
  calories: string;
  dificulty: string;
}

export interface MealDetails extends Meal {
  id: number;
  ingredientes: string[];
  pasos: string[];
  imagen?: string | null;
  video?: string | null;
}
// export interface MealDetails extends Meal {
//   strInstructions: string;
//   strYoutube?: string;
//   strSource?: string;
//   strIngredient1?: string;
//   strIngredient2?: string;
//   strIngredient3?: string;
//   strIngredient4?: string;
//   strIngredient5?: string;
//   strIngredient6?: string;
//   strIngredient7?: string;
//   strIngredient8?: string;
//   strIngredient9?: string;
//   strIngredient10?: string;
//   strIngredient11?: string;
//   strIngredient12?: string;
//   strIngredient13?: string;
//   strIngredient14?: string;
//   strIngredient15?: string;
//   strIngredient16?: string;
//   strIngredient17?: string;
//   strIngredient18?: string;
//   strIngredient19?: string;
//   strIngredient20?: string;
//   strMeasure1?: string;
//   strMeasure2?: string;
//   strMeasure3?: string;
//   strMeasure4?: string;
//   strMeasure5?: string;
//   strMeasure6?: string;
//   strMeasure7?: string;
//   strMeasure8?: string;
//   strMeasure9?: string;
//   strMeasure10?: string;
//   strMeasure11?: string;
//   strMeasure12?: string;
//   strMeasure13?: string;
//   strMeasure14?: string;
//   strMeasure15?: string;
//   strMeasure16?: string;
//   strMeasure17?: string;
//   strMeasure18?: string;
//   strMeasure19?: string;
//   strMeasure20?: string;
//   proteins: string;
//   calories: string;
//   dificulty: string;
//   time: string;
//   [key: string]: string | number | undefined;
// }

export interface Ingredient {
  id: string;
  name: string;
  measure: string;
}

export interface Category {
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string;
  strCategoryDescription: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  favorites: string[]; // IDs de las comidas favoritas
}

export interface confDatos {
  idConfDato: number;
  datovisible: string;
  datonovisible: string | null;
  tipo: string;
  subtipo: string | null;
}

export interface RecetaInput {
  nombre: string;
  descripcion: string;
  cant_porcion: number;
  tiempo: string;
  notas?: string;
  url_video?: string;
  url_imagen?: string;
  dificultad: string;
  region: string;
  categoria: string;
  ingredientes: string; 
  pasos: string; 
}

export interface ResultOperation {
  codResult: string;
  mjeResult: string;
}