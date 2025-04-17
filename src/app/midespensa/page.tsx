"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useLocalStorage } from "@/lib/hooks";
import { getConfDatos } from "@/lib/api";
import {
  Trash2,
  Edit,
  Save,
  X,
  Package,
  Plus,
  Search,
  Info,
  Loader2,
} from "lucide-react";
import GeminiQuery from "@/lib/api";
import RecipeCardPopUp from "@/components/recipe/RecipeCardPopUp";
import { confDatos } from "@/lib/types";
// Definir el tipo para los items del inventario con unidades
interface InventoryItem {
  id: string;
  name: string;
  quantity: string; // Cambiado a string para manejar unidades
  unity: string; // Cambiado a string para manejar unidades
}
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

// Componente principal
export default function InventoryManager() {
  // Estado para el formulario
  const [newItemName, setNewItemName] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState("1"); // Cambiado a string
  const [newUnity, setNewUnity] = useState("");
  const [newInstruction, setNewInstruction] = useState("");
  // Estado para búsqueda
  const [searchTerm, setSearchTerm] = useState("");

  // Estado para item en edición
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editQuantity, setEditQuantity] = useState("1"); // Cambiado a string
  const [editUnity, setEditUnity] = useState(""); // Cambiado a string
  const [isLoading, setIsLoading] = useState(false);
  const [recipeFound, setRecipeFound] = useState<RecipeFound | null>(null);
  const [showRecipe, setShowRecipe] = useState(false);
  const [unidades, setUnidades] = useState<confDatos[]>([]);

  // Estado para controlar la renderización del cliente
  const [isClient, setIsClient] = useState(false);
  // Usar localStorage para el inventario
  const [inventory, setInventory] = useLocalStorage<InventoryItem[]>(
    "inventory",
    []
  );

  // Efecto para marcar que estamos en el cliente
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchUnidades = async () => {
      const data = await getConfDatos("unidad", null);
      setUnidades(data);
    };
    fetchUnidades();
  }, []);

  // Función para agregar un nuevo item
  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const newItem: InventoryItem = {
      id: Date.now().toString(),
      name: newItemName.trim(),
      quantity: newItemQuantity.trim(),
      unity: newUnity.trim(),
    };

    setInventory([...inventory, newItem]);
    setNewItemName("");
    setNewItemQuantity("1");
  };

  // Función para eliminar un item
  const removeItem = (id: string) => {
    setInventory(inventory.filter((item) => item.id !== id));
  };

  // Funciones para la edición
  const startEditing = (item: InventoryItem) => {
    setEditingId(item.id);
    setEditName(item.name);
    setEditQuantity(item.quantity);
    setEditUnity(item.unity);
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const saveEdit = () => {
    if (!editingId || !editName.trim()) return;
    setInventory(
      inventory.map((item) =>
        item.id === editingId
          ? {
              ...item,
              name: editName.trim(),
              quantity: editQuantity.trim() || "1",
            }
          : item
      )
    );

    setEditingId(null);
  };

  // Filtrar inventario basado en la búsqueda
  const filteredInventory = isClient
    ? inventory.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleSearchRecipe = async () => {
    setIsLoading(true);

    const ingredients = inventory
      .map((item) => `${item.quantity} ${item.name}`)
      .join(", ");
    const instructions = newInstruction.trim();

    const template_prompt = (ingredients: string, instructions: string) => `
    **Rol:** Eres un asistente de cocina experto en encontrar y formatear recetas.
    
    **Objetivo:** A partir de los ingredientes (y opcionalmente, instrucciones específicas) proporcionados por el usuario, debes investigar, encontrar o adaptar una receta de cocina adecuada. Luego, estructura toda la información recopilada **exclusivamente** en un formato JSON válido, siguiendo la plantilla especificada.
    
    **Datos de Entrada del Usuario:**
    *   **Ingredientes:** ${ingredients}
    *   **Instrucciones Específicas (Opcional):** ${
      instructions || "Ninguna especificada"
    }
    
    **Instrucciones Detalladas para la IA:**
    
    1.  **Análisis de Entrada:** Revisa los \`Ingredientes\` proporcionados. Si se incluyen \`Instrucciones Específicas\`, tenlas en cuenta como una guía o requisito principal al buscar/adaptar la receta.
    2.  **Búsqueda de Receta:** Encuentra una receta de cocina estándar o popular que utilice predominantemente los \`Ingredientes\` listados. Si se proporcionaron \`Instrucciones Específicas\`, intenta encontrar una receta que las siga o incorpore.
    3.  **Extracción y Generación de Datos:** Para la receta encontrada, recopila o genera la siguiente información:
        *   **Título (\`title\`):** Un nombre claro y descriptivo para la receta.
        *   **Descripción (\`description\`):** Un resumen breve y atractivo del plato.
        *   **Imagen (\`image\`):** Busca una URL de imagen de alta calidad y relevante para la receta. **Crucial:** La URL debe ser **PÚBLICA**, **ACCESIBLE DIRECTAMENTE** (sin necesidad de login o claves API) y preferiblemente de fuentes como Google Images, Unsplash, Pexels, etc., pero siempre verificando su accesibilidad pública. No uses imágenes de sitios que requieran suscripción o generen URLs temporales.
        *   **Video (\`video\`):** (Opcional) Busca un video tutorial relevante en YouTube. **Verifica que el video esté DISPONIBLE PÚBLICAMENTE**. Si no encuentras uno adecuado o disponible, este campo debe ser \`null\` o una cadena vacía (\`""\`).
        *   **Instrucciones (\`instructions\`):**
            *   Si el usuario proporcionó \`Instrucciones Específicas\`, úsalas como base principal, formateándolas si es necesario.
            *   Si el usuario NO proporcionó instrucciones, genera los pasos detallados y secuenciales para preparar la receta encontrada.
            *   **Formato Estricto:** Concatena todos los pasos en un **único string**, numerándolos secuencialmente iniciando en 0, separados por un punto y un espacio. Ejemplo: \`"0. Pica la cebolla finamente. 1. Sofríe la cebolla en aceite de oliva. 2. Añade el tomate triturado..."\`
        *   **Tiempo (\`time\`):** Una estimación del tiempo total de preparación y cocción (ej. "45 minutos").
        *   **Dificultad (\`difficulty\`):** Nivel estimado (ej. "Fácil", "Media", "Difícil").
        *   **Calorías (\`calories\`):** Estimación aproximada de calorías (ej. "550 kcal"). Puedes añadir "por porción" si aplica.
        *   **Proteínas (\`proteins\`):** Estimación aproximada del contenido proteico (ej. "30g"). Puedes añadir "por porción" si aplica.
        *   **Favorito (\`isFavourite\`):** Establece este valor **siempre** en \`false\`.
        *   **Origen/Área (\`area\`):** Indica la región culinaria o país de origen típico de la receta (ej. "Italia", "Cocina Mexicana", "Mediterránea"). Si no es claro, usa "Variada" o "Desconocido".
    4.  **Formato de Salida Final (JSON Estricto):**
        *   Genera **únicamente** un objeto JSON válido como respuesta directa. No incluyas texto introductorio, explicaciones adicionales, notas, disculpas, ni comentarios fuera del bloque JSON. La respuesta debe empezar con \`{\` y terminar con \`}\`.
        *   Asegúrate de que el JSON siga **exactamente** la estructura definida a continuación:
    
    \`\`\`json
    {
      "title": "Título de la receta",
      "description": "Descripción de la receta",
      "image": "URL_IMAGEN_PÚBLICA_Y_ACCESIBLE",
      "video": "URL_VIDEO_YOUTUBE_DISPONIBLE_O_NULL_O_VACÍO",
      "instructions": "0. Paso uno. 1. Paso dos. 2. Paso tres.",
      "time": "Tiempo estimado de preparación",
      "difficulty": "Dificultad de la receta",
      "calories": "Calorías aproximadas",
      "proteins": "Contenido proteico",
      "isFavourite": false,
      "area": "Región/país de origen"
    }
    \`\`\`
    
    **Restricciones Clave:**
    *   La salida final DEBE SER SÓLO EL CÓDIGO JSON válido. Sin texto adicional antes o después.
    *   Verifica exhaustivamente la accesibilidad pública de las URLs (imagen y video). No uses URLs internas o que requieran autenticación.
    *   Si no se encuentra información fiable para un campo opcional (como \`video\`) o estimaciones (como \`calories\`, \`proteins\`), usa \`null\` o un valor indicativo como "No disponible", pero mantén la estructura JSON completa. Para el video, si no se encuentra, usa \`null\` o \`""\`.
    
    **Ejecuta la tarea con los datos proporcionados.**
    `;
    const query = template_prompt(ingredients, instructions);
    try {
      const response = await GeminiQuery(query);

      // Intenta parsear la respuesta primero limpiando el formato
      const sanitizedResponse = response
        ? JSON.parse(response.replace(/`/g, "").replace(/json/gi, ""))
        : null;

      setRecipeFound(sanitizedResponse);
      if (sanitizedResponse) {
        setShowRecipe(true);
      }
    } catch (error) {
      console.error("Error al procesar la respuesta de Gemini:", error);
      // Establecer una receta por defecto si hay error de parseo
      setRecipeFound({
        title: "Receta con tus ingredientes",
        description:
          "No se pudo generar correctamente la receta. Por favor, intenta nuevamente.",
        image: "",
        instructions: "No hay instrucciones disponibles.",
        time: "N/A",
        difficulty: "N/A",
        calories: "N/A",
        proteins: "N/A",
        isFavourite: false,
        area: "N/A",
      });
      setShowRecipe(true);
    } finally {
      setIsLoading(false);
    }
  };

  const closeRecipe = () => {
    setShowRecipe(false);
  };

  const handleSearchAgain = () => {
    closeRecipe(); // Cierra el popup actual
    // Opcional: Espera un breve momento para que el cierre sea visible si lo deseas
    // setTimeout(() => {
    //   handleSearchRecipe(); // Inicia una nueva búsqueda
    // }, 100); // 100ms de delay
    handleSearchRecipe(); // Inicia una nueva búsqueda inmediatamente
  };

  return (
    <div className="w-full min-h-screen p-4 md:p-8 justify-center align-center">
      {/* Mostrar el popup de receta si hay una receta y showRecipe es true */}
      {showRecipe && recipeFound && (
        <RecipeCardPopUp
          recipe={recipeFound}
          onClose={closeRecipe}
          onSearchAgain={handleSearchAgain}
        />
      )}

      <div className="max-w-6xl mx-auto max-h-100vh overflow-hidden">
        <header className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-cream mb-2">
            Mi despensa
          </h1>
          <p className="text-cream opacity-80">
            Gestiona tus ingredientes de forma sencilla. Añade lo que tengas a
            mano y te ayudará a crear una receta personalizada.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Formulario para agregar ingredientes */}
          <div className="bg-cream border border-earth-light rounded-lg shadow-md overflow-hidden max-h-fit">
            <div className="bg-earth-light/20 p-4 border-b border-earth-light">
              <h2 className="text-xl font-semibold text-earth-hard flex items-center gap-2">
                <Plus size={20} />
                Agregar ingrediente
              </h2>
            </div>
            <div className="p-6">
              <form onSubmit={addItem} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="itemName"
                      className="block text-sm font-medium text-earth-hard"
                    >
                      Nombre
                    </label>
                    <input
                      type="text"
                      id="itemName"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      className="w-full p-2 border border-earth-light rounded focus:ring focus:ring-earth-hard/30 focus:outline-none"
                      placeholder="Ej: Arroz integral"
                      required
                    />
                  </div>

                  <div className="flex flex-row items-center aling-center gap-2">
                    <div className="max-w-30">
                      <label
                        htmlFor="itemQuantity"
                        className="block text-sm font-medium text-earth-hard"
                      >
                        Cantidad
                      </label>
                      <input
                        type="number"
                        min={1}
                        id="itemQuantity"
                        value={newItemQuantity}
                        onChange={(e) => setNewItemQuantity(e.target.value)}
                        className="w-full p-2 border border-earth-light rounded focus:ring focus:ring-earth-hard/30 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="itemQuantity"
                        className="block text-sm font-medium text-earth-hard"
                      >
                        Unidad
                      </label>
                      <select
                        id="itemUnity"
                        value={newUnity}
                        onChange={(e) => setNewUnity(e.target.value)}
                        className="w-full p-2 border border-earth-light rounded focus:ring focus:ring-earth-hard/30 focus:outline-none"
                        required
                      >
                        <option selected hidden value={""}>Desplegar lista</option>
                        {unidades &&
                          unidades.map((unidad) => (
                            <option
                              key={unidad.datovisible}
                              value={unidad.datovisible}
                            >
                              {unidad.datovisible}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-earth-hard text-white py-2 px-4 rounded hover:bg-earth-light hover:text-earth-hard transition-colors cursor-pointer"
                >
                  Agregar ingrediente
                </button>
              </form>
            </div>
          </div>

          {/* Lista de ingredientes */}
          <div className="bg-cream border border-earth-light rounded-lg shadow-md max-h-57 overflow-auto">
            <div className="bg-earth-light/20 p-4 border-b border-earth-light">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h2 className="text-xl font-semibold text-earth-hard flex items-center gap-2">
                  <Package size={20} />
                  Mis ingredientes
                </h2>
                <div className="relative">
                  <Search
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 text-earth-hard opacity-70"
                    size={16}
                  />
                  <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-full sm:w-auto p-2 border border-earth-light rounded focus:ring focus:ring-earth-hard/30 focus:outline-none"
                  />
                </div>
              </div>
            </div>
            <div className="p-4">
              {!isClient ? (
                // Estado de carga durante la hidratación
                <div className="text-center py-8 text-earth-hard opacity-80">
                  Cargando...
                </div>
              ) : filteredInventory.length === 0 ? (
                // Muestra esto cuando no hay ingredientes o no se encontraron resultados
                <div className="text-center py-8 text-earth-hard opacity-80">
                  {searchTerm
                    ? "No se encontraron ingredientes que coincidan con la búsqueda"
                    : "No hay ingredientes en el inventario"}
                </div>
              ) : (
                // Muestra la lista de ingredientes cuando hay elementos
                <div className="max-h-96 overflow-y-auto">
                  {filteredInventory.map((item) => (
                    <div key={item.id} className="py-3 first:pt-0">
                      {editingId === item.id ? (
                        <div className=" bg-earth/10 p-3 rounded-lg space-y-3">
                          <div className="grid lg:grid-cols-3 sm:grid-cols-1 gap-3">
                            <div>
                              <label
                                htmlFor="editName"
                                className="block text-sm font-medium text-earth-hard"
                              >
                                Nombre
                              </label>
                              <input
                                name="editName"
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="w-full p-2 border border-earth-light rounded focus:ring focus:ring-earth-hard/30 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label
                                htmlFor="editQuantity"
                                className="block text-sm font-medium text-earth-hard"
                              >
                                Cantidad
                              </label>
                              <input
                                name="editQuantity"
                                type="text"
                                value={editQuantity}
                                onChange={(e) =>
                                  setEditQuantity(e.target.value)
                                }
                                className="w-full p-2 border border-earth-light rounded focus:ring focus:ring-earth-hard/30 focus:outline-none"
                                placeholder="Ej: 500gr, 1/2 kg, 3 unidades"
                              />
                            </div>

                            <div>
                              <label
                                htmlFor="editUnity"
                                className="block text-sm font-medium text-earth-hard"
                              >
                                Unidad
                              </label>
                              <select
                                id="editUnity"
                                value={editUnity}
                                onChange={(e) => setEditUnity(e.target.value)}
                                className="w-full p-2 border border-earth-light rounded focus:ring focus:ring-earth-hard/30 focus:outline-none"
                                required
                              >
                                {unidades &&
                                  unidades.map((unidad) => (
                                    <option
                                      key={unidad.datovisible}
                                      value={unidad.datovisible}
                                      selected={
                                        unidad.datovisible === item.unity
                                      }
                                    >
                                      {unidad.datovisible}
                                    </option>
                                  ))}
                              </select>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={saveEdit}
                              className="flex items-center bg-earth-hard text-white py-1 px-3 rounded hover:bg-earth/80 text-sm cursor-pointer"
                            >
                              <Save size={16} className="mr-1" /> Guardar
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="flex items-center border border-earth-light text-earth-hard py-1 px-3 rounded hover:bg-earth-light/40 text-sm cursor-pointer"
                            >
                              <X size={16} className="mr-1" /> Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <span className="font-medium text-earth-hard">
                              {item.name}
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-earth-light/10 text-earth-hard border border-earth-light">
                              {item.quantity} - {item.unity}
                            </span>
                          </div>
                          <div className="flex space-x-1">
                            <button
                              onClick={() => startEditing(item)}
                              className="p-1 rounded-full hover:bg-earth-hard/10 text-earth-hard"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="p-1 rounded-full hover:bg-red-50 text-red-500"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-5 bg-cream rounded-lg shadow-md overflow-hidden p-4">
        <div className="space-y-2">
          <div className="bg-earth-light/20 p-4 border-b border-earth-light">
            <h2 className="text-xl font-semibold text-earth-hard flex items-center gap-2">
              ¿Alguna instrucción extra?
            </h2>
          </div>
          <div className="flex flex-row gap-2 text-earth-hard/70">
            <Info size={20} />
            <p className="text-sm ">
              Tip: aquí puedes comentar cualquier instrucción que necesites para
              crear una receta mucho más personalizada.
            </p>
          </div>
          <textarea
            id="itemName"
            value={newInstruction}
            onChange={(e) => setNewInstruction(e.target.value)}
            className="w-full mt-5 p-2 border border-earth-light bg-earth-light/20 rounded focus:ring focus:ring-earth-hard/30 focus:outline-none"
            placeholder="Ej: Dieta vegana, vegetariana, baja en azúcares, etc."
            required
          />
        </div>
      </div>
      <div className="w-50 mx-auto mt-10">
        <button
          className={`w-full rounded-lg mx-auto px-4 py-3 bg-earth-light cursor-pointer hover:-translate-y-1 transition-all flex items-center justify-center ${
            isLoading ? "opacity-80" : ""
          }`}
          onClick={handleSearchRecipe}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 size={20} className="animate-spin mr-2" />
              Buscando receta...
            </>
          ) : (
            "¡Buscar receta!"
          )}
        </button>
      </div>

      {/* Spinner de carga overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-cream p-8 rounded-lg shadow-xl flex flex-col items-center">
            <Loader2 size={40} className="animate-spin text-earth-hard mb-4" />
            <p className="text-earth-hard font-medium">
              Buscando la mejor receta para ti...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
