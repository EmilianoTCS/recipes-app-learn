// lib/api.ts
import { Meal, MealDetails, Category } from "./types";
import { GoogleGenAI } from "@google/genai";

const API_BASE_URL = "https://www.themealdb.com/api/json/v1/1";
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

const Gemini_AI = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
/**
 * Obtiene una lista de 20 comidas aleatorias
 */
export async function getRandomMeals(count: number = 12): Promise<Meal[]> {
  const meals: Meal[] = [];
  const promises = [];

  // La API solo devuelve 1 comida aleatoria por solicitud, así que debemos hacer múltiples solicitudes
  for (let i = 0; i < count; i++) {
    const promise = fetch(`${API_BASE_URL}/random.php?a=Argentinian`)
      .then((res) => res.json())
      .then((data) => {
        if (data.meals && data.meals[0]) {
          return data.meals[0];
        }
        return null;
      });
    promises.push(promise);
  }

  const results = await Promise.all(promises);
  results.forEach((meal) => {
    if (meal && !meals.some((m) => m.idMeal === meal.idMeal)) {
      meals.push(meal);
    }
  });

  // Si no hay comidas, retornar un array vacío
  if (meals.length === 0) {
    return [];
  }

  // Crear el prompt para Gemini AI
  const prompt = `Devuelve la cantidad aproximada de las calorías, proteínas (junto con sus unidades) y la dificultad (en español) y el tiempo aproximado de cocción de cada comida. no escribas nada más. Sin introducción, solamente los resultados solicitados (calorías y proteínas), no necesito ninguna información extra. además, quita todos los caracteres inncesarios y espacios en blanco el formato debe ser retornado debe ser {idMeal: id del meal original, calories: calorias calculadas, proteins: proteinas calculadas, dificulty: dificultad, time: tiempo} también quita TODO caracter innecesario,como el Template literals o backtick. solamente retorna el JSON. aquí están las comidas: ${JSON.stringify(
    meals
  )}`;

  // Llamar a Gemini AI con el prompt
  try {
    const geminiResponse = await GeminiQuery(prompt);

    const sanitizedResponse = geminiResponse
      ? geminiResponse.replace(/`/g, "").replace(/json/gi, "")
      : "";

    // Parsear la respuesta de Gemini AI
    let geminiAnalysis;
    try {
      geminiAnalysis = JSON.parse(sanitizedResponse || "[]");
    } catch (parseError) {
      console.error("Error al parsear la respuesta de Gemini:", parseError);
      console.error(
        "Respuesta sanitizada que causó el error:",
        sanitizedResponse
      );
      geminiAnalysis = [];
    }

    // Verificar que geminiAnalysis sea un array
    if (Array.isArray(geminiAnalysis)) {
      for (let i = 0; i < meals.length; i++) {
        const meal = meals[i];
        const analysis = geminiAnalysis.find(
          (item: {
            idMeal: string;
            calories: number;
            proteins: number;
            dificulty: string;
            time: string;
          }) => item.idMeal === meal.idMeal
        );

        if (analysis) {
          // Asignación directa a las propiedades del objeto meal
          meal.calories = analysis.calories;
          meal.proteins = analysis.proteins;
          meal.dificulty = analysis.dificulty;
          meal.time = analysis.time;
        } else {
          console.log(
            `No se encontró análisis para la comida con ID: ${meal.idMeal}`
          );
        }
      }
    } else {
      console.error("La respuesta de Gemini no es un array:", geminiAnalysis);
    }

    return meals;
  } catch (error) {
    console.error("Error al procesar con Gemini AI:", error);
    // En caso de error con Gemini, devolver las comidas sin información nutricional
    return meals;
  }
}

/**
 * Busca comidas por nombre
 */
export async function searchMealsByName(query: string): Promise<Meal[]> {
  const res = await fetch(
    `${API_BASE_URL}/search.php?s=${encodeURIComponent(query)}&a=Argentinian`
  );
  const data = await res.json();
  return data.meals || [];
}

/**
 * Obtiene las categorías disponibles
 */
export async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${API_BASE_URL}/categories.php`);
  const data = await res.json();
  return data.categories || [];
}

/**
 * Obtiene comidas por categoría
 */
export async function getMealsByCategory(category: string): Promise<Meal[]> {
  const res = await fetch(
    `${API_BASE_URL}/filter.php?c=${encodeURIComponent(category)}`
  );

  const data = await res.json();
  return data.meals || [];
}

/**
 * Obtiene los detalles de una comida por su ID y agrega información nutricional usando Gemini AI
 */
export async function getMealById(id: string): Promise<MealDetails | null> {
  const res = await fetch(`${API_BASE_URL}/lookup.php?i=${id}`);
  const data = await res.json();

  if (!data.meals || !data.meals[0]) {
    return null;
  }

  const meal = data.meals[0];

  // Crear el prompt para Gemini AI
  const prompt = `Devuelve únicamente un JSON con la cantidad aproximada de las calorías, proteínas (junto con sus unidades) y la dificultad (en español) y el tiempo aproximado de cocción de esta comida. El formato debe ser {idMeal: id del meal original, calories: calorias calculadas, proteins: proteinas calculadas, dificulty: dificultad, time: tiempo}. aquí está la comida: ${JSON.stringify(
    meal
  )}`;

  try {
    const geminiResponse = await GeminiQuery(prompt);
    const sanitizedResponse = geminiResponse
      ? geminiResponse.replace(/`/g, "").replace(/json/gi, "")
      : "";

    let geminiAnalysis;
    try {
      geminiAnalysis = JSON.parse(sanitizedResponse || "[]");
    } catch (parseError) {
      console.error("Error al parsear la respuesta de Gemini:", parseError);
      console.error("Respuesta sanitizada:", sanitizedResponse);
      return meal; // Retornar sin nutrición si falla el parseo
    }

    if (geminiAnalysis && geminiAnalysis.idMeal === meal.idMeal) {
      meal.calories = geminiAnalysis.calories;
      meal.proteins = geminiAnalysis.proteins;
      meal.dificulty = geminiAnalysis.dificulty;
      meal.time = geminiAnalysis.time;
    } else {
      console.warn("La respuesta de Gemini no coincide con el ID del meal.");
    }

    return meal;
  } catch (error) {
    console.error("Error al procesar con Gemini AI:", error);
    return meal;
  }
}

/**
 * Formatea los ingredientes de una comida
 */
export function formatMealIngredients(meal: MealDetails) {
  const ingredients = [];

  // TheMealDB almacena ingredientes y medidas en propiedades separadas del 1 al 20
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}` as keyof MealDetails];
    const measure = meal[`strMeasure${i}` as keyof MealDetails];

    if (ingredient) {
      ingredients.push({
        id: i.toString(),
        name: ingredient,
        measure: measure || "",
      });
    }
  }

  return ingredients;
}

export default async function GeminiQuery(query: string) {
  try {
    const response = await Gemini_AI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: query,
    });

    return response.text;
  } catch (error) {
    console.error("Error al generar contenido con Gemini AI:", error);
    throw error;
  }
}
