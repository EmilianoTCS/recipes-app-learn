"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useLocalStorage } from "@/lib/hooks";
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
// Definir el tipo para los items del inventario con unidades
interface InventoryItem {
  id: string;
  name: string;
  quantity: string; // Cambiado a string para manejar unidades
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
  const [newInstruction, setNewInstruction] = useState("");
  // Estado para búsqueda
  const [searchTerm, setSearchTerm] = useState("");

  // Estado para item en edición
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editQuantity, setEditQuantity] = useState("1"); // Cambiado a string
  const [isLoading, setIsLoading] = useState(false);
  const [recipeFound, setRecipeFound] = useState<RecipeFound | null>(null);
  const [showRecipe, setShowRecipe] = useState(false);

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

  // Función para agregar un nuevo item
  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const newItem: InventoryItem = {
      id: Date.now().toString(),
      name: newItemName.trim(),
      quantity: newItemQuantity.trim() || "1",
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

    const query = `Con los siguientes ingredientes e instrucciones ingresadas por el usuario, investiga una receta paso a paso con URL de imagen incluída y (como opcional) un URL de un video de youtube EN FORMATO JSON. Las instrucciones son opcionales.
        El json debe ser:{
        "title": "Título de la receta",
        "description": "Descripción de la receta",
        "image": "URL de la imagen PÚBLICA, NO DEBE REQUERIR KEYS DE ACCESO, tómalo de google images",
        "video": "URL del video (opcional), si se encuentra, debe ser tomada desde youtube y debe estar DISPONIBLE",
        "instructions": "string de los pasos en formato '0.Paso uno. 1.Paso dos. 2.Paso tres.'",
        "time": "Tiempo estimado de preparación",
        "difficulty": "Dificultad de la receta",
        "calories": "Calorías aproximadas",
        "proteins": "Contenido proteico",
        "isFavourite": false,
        "area": "Región/país de origen"
        }
        Los datos son: Ingredientes: ${ingredients}. Instrucciones: ${instructions}`;

    try {
      const response = await GeminiQuery(query);

      // Intenta parsear la respuesta primero limpiando el formato
      const sanitizedResponse = response
        ? JSON.parse(response.replace(/`/g, "").replace(/json/gi, ""))
        : null;

      setRecipeFound(sanitizedResponse);
      if (sanitizedResponse) {
        console.log("Receta encontrada:", sanitizedResponse);
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

  return (
    <div className="w-full min-h-screen p-4 md:p-8 justify-center align-center">
      {/* Mostrar el popup de receta si hay una receta y showRecipe es true */}
      {showRecipe && recipeFound && (
        <RecipeCardPopUp recipe={recipeFound} onClose={closeRecipe} />
      )}

      <div className="max-w-6xl mx-auto max-h-100vh overflow-hidden">
        <header className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-cream mb-2">
            Mi Inventario
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
                  <div className="space-y-2">
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

                  <div className="space-y-2">
                    <label
                      htmlFor="itemQuantity"
                      className="block text-sm font-medium text-earth-hard"
                    >
                      Cantidad (con unidad)
                    </label>
                    <input
                      type="text"
                      id="itemQuantity"
                      value={newItemQuantity}
                      onChange={(e) => setNewItemQuantity(e.target.value)}
                      className="w-full p-2 border border-earth-light rounded focus:ring focus:ring-earth-hard/30 focus:outline-none"
                      placeholder="Ej: 500gr, 1/2 kg, 3 unidades"
                      required
                    />
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
          <div className="bg-cream border border-earth-light rounded-lg shadow-md max-h-59 overflow-auto">
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
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="w-full p-2 border border-earth-light rounded focus:ring focus:ring-earth-hard/30 focus:outline-none"
                            />
                            <input
                              type="text"
                              value={editQuantity}
                              onChange={(e) => setEditQuantity(e.target.value)}
                              className="w-full p-2 border border-earth-light rounded focus:ring focus:ring-earth-hard/30 focus:outline-none"
                              placeholder="Ej: 500gr, 1/2 kg, 3 unidades"
                            />
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
                              {item.quantity}
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
