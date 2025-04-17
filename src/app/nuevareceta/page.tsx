"use client";

import type React from "react";

import { useState, type FormEvent } from "react";
import {
  Plus,
  Trash2,
  Save,
  ChevronUp,
  ChevronDown,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { insertarReceta, getConfDatos } from "@/lib/api";
import { RecetaInput } from "@/lib/types";

// Tipos para los datos del formulario
type Ingrediente = {
  nombre: string;
  cantidad: number;
  unidad: string;
  isActive: boolean;
};

type Paso = {
  nombre: string;
  numero: number;
  descripcion: string;
  isActive: boolean;
};

type RecetaFormData = {
  nombre: string;
  descripcion: string;
  cant_porcion: number;
  tiempo: string;
  notas: string;
  url_video: string;
  url_imagen: string;
  dificultad: string;
  region: string;
  categoria: string;
  ingredientes: Ingrediente[];
  pasos: Paso[];
};

// Opciones para los selectores

const categories = await getConfDatos("categoria", null);
const difficulties = await getConfDatos("dificultad", null);
const unidades = await getConfDatos("unidad", null);
const region = await getConfDatos("region", null);

export default function NuevaRecetaPage() {
  const router = useRouter();

  // Estado inicial del formulario
  const [formData, setFormData] = useState<RecetaFormData>({
    nombre: "",
    descripcion: "",
    cant_porcion: 4,
    tiempo: "01:00",
    notas: "",
    url_video: "",
    url_imagen: "",
    dificultad: "Fácil",
    region: "Argentina",
    categoria: "Plato principal",
    ingredientes: [
      { nombre: "", cantidad: 1, unidad: "unidad(es)", isActive: true },
    ],
    pasos: [{ nombre: "", numero: 1, descripcion: "", isActive: true }],
  });

  // Estado para errores de validación
  const [errors, setErrors] = useState<Record<string, string>>({});
  // Estado para mensaje de éxito
  const [successMessage, setSuccessMessage] = useState<string>("");
  // Estado para controlar si el formulario fue enviado
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Función para actualizar campos simples
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Limpiar error cuando el usuario escribe
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  // Función para manejar ingredientes
  const handleIngredienteChange = (
    index: number,
    field: keyof Ingrediente,
    value: string | number | boolean
  ) => {
    const newIngredientes = [...formData.ingredientes];
    newIngredientes[index] = {
      ...newIngredientes[index],
      [field]: value,
    };

    setFormData({
      ...formData,
      ingredientes: newIngredientes,
    });

    // Limpiar error de ingredientes
    if (errors.ingredientes) {
      setErrors({
        ...errors,
        ingredientes: "",
      });
    }
  };

  // Función para agregar un nuevo ingrediente
  const addIngrediente = () => {
    setFormData({
      ...formData,
      ingredientes: [
        ...formData.ingredientes,
        { nombre: "", cantidad: 1, unidad: "unidad(es)", isActive: true },
      ],
    });
  };

  // Función para eliminar un ingrediente
  const removeIngrediente = (index: number) => {
    if (formData.ingredientes.length > 1) {
      const newIngredientes = [...formData.ingredientes];
      newIngredientes.splice(index, 1);
      setFormData({
        ...formData,
        ingredientes: newIngredientes,
      });
    }
  };

  // Función para mover un ingrediente hacia arriba
  const moveIngredienteUp = (index: number) => {
    if (index > 0) {
      const newIngredientes = [...formData.ingredientes];
      const temp = newIngredientes[index];
      newIngredientes[index] = newIngredientes[index - 1];
      newIngredientes[index - 1] = temp;
      setFormData({
        ...formData,
        ingredientes: newIngredientes,
      });
    }
  };

  // Función para mover un ingrediente hacia abajo
  const moveIngredienteDown = (index: number) => {
    if (index < formData.ingredientes.length - 1) {
      const newIngredientes = [...formData.ingredientes];
      const temp = newIngredientes[index];
      newIngredientes[index] = newIngredientes[index + 1];
      newIngredientes[index + 1] = temp;
      setFormData({
        ...formData,
        ingredientes: newIngredientes,
      });
    }
  };

  // Función para manejar pasos
  const handlePasoChange = (
    index: number,
    field: keyof Paso,
    value: string | number | boolean
  ) => {
    const newPasos = [...formData.pasos];
    newPasos[index] = {
      ...newPasos[index],
      [field]: value,
    };

    setFormData({
      ...formData,
      pasos: newPasos,
    });

    // Limpiar error de pasos
    if (errors.pasos) {
      setErrors({
        ...errors,
        pasos: "",
      });
    }
  };

  // Función para agregar un nuevo paso
  const addPaso = () => {
    const newNumero = formData.pasos.length + 1;
    setFormData({
      ...formData,
      pasos: [
        ...formData.pasos,
        { nombre: "", numero: newNumero, descripcion: "", isActive: true },
      ],
    });
  };

  // Función para eliminar un paso
  const removePaso = (index: number) => {
    if (formData.pasos.length > 1) {
      const newPasos = [...formData.pasos];
      newPasos.splice(index, 1);

      // Reordenar los números de los pasos
      newPasos.forEach((paso, idx) => {
        paso.numero = idx + 1;
      });

      setFormData({
        ...formData,
        pasos: newPasos,
      });
    }
  };

  // Función para mover un paso hacia arriba
  const movePasoUp = (index: number) => {
    if (index > 0) {
      const newPasos = [...formData.pasos];
      const temp = newPasos[index];
      newPasos[index] = newPasos[index - 1];
      newPasos[index - 1] = temp;

      // Actualizar los números
      newPasos[index].numero = index + 1;
      newPasos[index - 1].numero = index;

      setFormData({
        ...formData,
        pasos: newPasos,
      });
    }
  };

  // Función para mover un paso hacia abajo
  const movePasoDown = (index: number) => {
    if (index < formData.pasos.length - 1) {
      const newPasos = [...formData.pasos];
      const temp = newPasos[index];
      newPasos[index] = newPasos[index + 1];
      newPasos[index + 1] = temp;

      // Actualizar los números
      newPasos[index].numero = index + 1;
      newPasos[index + 1].numero = index + 2;

      setFormData({
        ...formData,
        pasos: newPasos,
      });
    }
  };

  // Validación del formulario
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validar nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre de la receta es obligatorio";
    } else if (formData.nombre.length > 100) {
      newErrors.nombre = "El nombre no puede exceder los 100 caracteres";
    }

    // Validar descripción
    if (!formData.descripcion.trim()) {
      newErrors.descripcion = "La descripción es obligatoria";
    }

    // Validar cantidad de porciones
    if (formData.cant_porcion <= 0) {
      newErrors.cant_porcion = "La cantidad de porciones debe ser mayor a 0";
    }

    // Validar tiempo
    if (!formData.tiempo) {
      newErrors.tiempo = "El tiempo de preparación es obligatorio";
    }

    // Validar URL de video (opcional pero debe ser válida si se proporciona)
    if (formData.url_video && !isValidUrl(formData.url_video)) {
      newErrors.url_video = "La URL del video no es válida";
    }

    // Validar URL de imagen (opcional pero debe ser válida si se proporciona)
    if (formData.url_imagen && !isValidUrl(formData.url_imagen)) {
      newErrors.url_imagen = "La URL de la imagen no es válida";
    }

    // Validar ingredientes
    let ingredientesValidos = true;
    formData.ingredientes.forEach((ingrediente) => {
      if (!ingrediente.nombre.trim()) {
        ingredientesValidos = false;
      }
    });

    if (!ingredientesValidos) {
      newErrors.ingredientes = "Todos los ingredientes deben tener un nombre";
    }

    if (formData.ingredientes.length === 0) {
      newErrors.ingredientes = "Debe agregar al menos un ingrediente";
    }

    // Validar pasos
    let pasosValidos = true;
    formData.pasos.forEach((paso) => {
      if (!paso.descripcion.trim()) {
        pasosValidos = false;
      }
    });

    if (!pasosValidos) {
      newErrors.pasos = "Todos los pasos deben tener una descripción";
    }

    if (formData.pasos.length === 0) {
      newErrors.pasos = "Debe agregar al menos un paso";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Función para validar URLs
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validar el formulario
    if (!validateForm()) {
      // Desplazarse al primer error
      const firstErrorField = Object.keys(errors)[0];
      const element = document.querySelector(`[name="${firstErrorField}"]`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setIsSubmitting(true);

    try {
      // Formatear los datos para el envío
      const ingredientesJson = JSON.stringify(formData.ingredientes);
      const pasosJson = JSON.stringify(formData.pasos);

      const recetaInput: RecetaInput = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        cant_porcion: formData.cant_porcion,
        tiempo: formData.tiempo,
        notas: formData.notas,
        url_video: formData.url_video,
        url_imagen: formData.url_imagen,
        dificultad: formData.dificultad,
        region: formData.region,
        categoria: formData.categoria,
        ingredientes: ingredientesJson,
        pasos: pasosJson,
      };

      // Call the function with the properly typed input
      const response = await insertarReceta(recetaInput);

      if (!response || response.codResult !== "00") {
        if (!response) {
          throw new Error("Error al guardar la receta: respuesta nula");
        }
        throw new Error(`Error al guardar la receta: ${response.mjeResult}`);
      } else {
        setSuccessMessage("¡Receta guardada con éxito!");
      }

      setTimeout(() => {
        setFormData({
          nombre: "",
          descripcion: "",
          cant_porcion: 4,
          tiempo: "01:00",
          notas: "",
          url_video: "",
          url_imagen: "",
          dificultad: "Fácil",
          region: "Argentina",
          categoria: "Plato principal",
          ingredientes: [
            { nombre: "", cantidad: 1, unidad: "unidad(es)", isActive: true },
          ],
          pasos: [{ nombre: "", numero: 1, descripcion: "", isActive: true }],
        });
        setSuccessMessage("");
      }, 2000);
    } catch (error) {
      console.error("Error al guardar la receta:", error);
      setErrors({
        ...errors,
        form: "Error al guardar la receta. Por favor, inténtelo de nuevo.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-6 text-center text-cream">
        Nueva receta
      </h1>
      <p className="text-cream opacity-80 mb-8 text-center">
        ¡Sube tus recetas! acá podrás compartir las que ya conocés para que
        otros usuarios también puedan cocinarlas.
      </p>
      {/* Mensaje de éxito */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded flex items-center">
          <CheckCircle2 className="mr-2" size={20} />
          {successMessage}
        </div>
      )}

      {/* Error general del formulario */}
      {errors.form && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded flex items-center">
          <AlertCircle className="mr-2" size={20} />
          {errors.form}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información básica */}
        <div className="bg-cream text-earth-hard p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2 ">
            Información básica
          </h2>

          <div className="space-y-4">
            {/* Nombre */}
            <div>
              <label
                htmlFor="nombre"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nombre de la receta <span className="text-red-700">*</span>
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.nombre ? "border-red-500" : "border-earth-light"
                }`}
                placeholder="Ej: Bife Marinado a la Parrilla"
              />
              {errors.nombre && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="mr-1" size={16} />
                  {errors.nombre}
                </p>
              )}
            </div>

            {/* Descripción */}
            <div>
              <label
                htmlFor="descripcion"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Descripción <span className="text-red-700">*</span>
              </label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                rows={3}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.descripcion ? "border-red-500" : "border-earth-light"
                }`}
                placeholder="Breve descripción de la receta"
              />
              {errors.descripcion && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="mr-1" size={16} />
                  {errors.descripcion}
                </p>
              )}
            </div>

            {/* Fila con dos columnas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Cantidad de porciones */}
              <div>
                <label
                  htmlFor="cant_porcion"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Porciones <span className="text-red-700">*</span>
                </label>
                <input
                  type="number"
                  id="cant_porcion"
                  name="cant_porcion"
                  value={formData.cant_porcion}
                  onChange={handleInputChange}
                  min="1"
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.cant_porcion
                      ? "border-red-500"
                      : "border-earth-light"
                  }`}
                />
                {errors.cant_porcion && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="mr-1" size={16} />
                    {errors.cant_porcion}
                  </p>
                )}
              </div>

              {/* Tiempo */}
              <div>
                <label
                  htmlFor="tiempo"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Tiempo de preparación <span className="text-red-700">*</span>
                </label>
                <input
                  type="time"
                  id="tiempo"
                  name="tiempo"
                  value={formData.tiempo}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.tiempo ? "border-red-500" : "border-earth-light"
                  }`}
                />
                {errors.tiempo && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="mr-1" size={16} />
                    {errors.tiempo}
                  </p>
                )}
              </div>
            </div>

            {/* Notas */}
            <div>
              <label
                htmlFor="notas"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Notas o consejos
              </label>
              <textarea
                id="notas"
                name="notas"
                value={formData.notas}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-3 py-2 border border-earth-light rounded-md"
                placeholder="Consejos para la preparación (opcional)"
              />
            </div>
          </div>
        </div>

        {/* Categorización */}
        <div className="bg-cream p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">
            Categorización
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Dificultad */}
            <div>
              <label
                htmlFor="dificultad"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Dificultad <span className="text-red-700">*</span>
              </label>
              <select
                id="dificultad"
                name="dificultad"
                value={formData.dificultad}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-earth-light rounded-md"
              >
                <option selected hidden value={""}>
                  Desplegar lista
                </option>
                {difficulties.map((diff: { datovisible: string }) => (
                  <option key={diff.datovisible} value={diff.datovisible}>
                    {diff.datovisible}
                  </option>
                ))}
              </select>
            </div>

            {/* Región */}
            <div>
              <label
                htmlFor="region"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Región/País
              </label>
              <select
                id="region"
                name="region"
                value={formData.region}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-earth-light rounded-md"
              >
                <option selected hidden value={""}>
                  Desplegar lista
                </option>

                {region.map((opcion: { datovisible: string }) => (
                  <option key={opcion.datovisible} value={opcion.datovisible}>
                    {opcion.datovisible}
                  </option>
                ))}
              </select>
            </div>

            {/* Categoría */}
            <div>
              <label
                htmlFor="categoria"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Categoría
              </label>
              <select
                id="categoria"
                name="categoria"
                value={formData.categoria}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-earth-light rounded-md"
              >
                <option selected hidden value={""}>
                  Desplegar lista
                </option>

                {categories.map((opcion: { datovisible: string }) => (
                  <option key={opcion.datovisible} value={opcion.datovisible}>
                    {opcion.datovisible}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Multimedia */}
        <div className="bg-cream p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">
            Multimedia (opcional)
          </h2>
          <div className="space-y-4">
            {/* URL de video */}
            <div>
              <label
                htmlFor="url_video"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                URL del Video (YouTube, Vimeo, etc.)
              </label>
              <input
                type="url"
                id="url_video"
                name="url_video"
                value={formData.url_video}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.url_video ? "border-red-500" : "border-earth-light"
                }`}
                placeholder="https://www.youtube.com/watch?v=..."
              />
              {errors.url_video && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="mr-1" size={16} />
                  {errors.url_video}
                </p>
              )}
            </div>

            {/* URL de imagen */}
            <div>
              <label
                htmlFor="url_imagen"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                URL de la Imagen
              </label>
              <input
                type="url"
                id="url_imagen"
                name="url_imagen"
                value={formData.url_imagen}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.url_imagen ? "border-red-500" : "border-earth-light"
                }`}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
              {errors.url_imagen && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="mr-1" size={16} />
                  {errors.url_imagen}
                </p>
              )}
              {formData.url_imagen && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500 mb-1">Vista previa:</p>
                  <Image
                    src={formData.url_imagen || "/api/placeholder/400/250"}
                    alt="Vista previa"
                    className="h-40 object-cover rounded-md"
                    width={300}
                    height={250}
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
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Ingredientes */}
        <div className="bg-cream p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">
            Ingredientes
          </h2>

          {errors.ingredientes && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded flex items-center">
              <AlertCircle className="mr-2" size={18} />
              {errors.ingredientes}
            </div>
          )}

          <div className="space-y-4">
            {formData.ingredientes.map((ingrediente, index) => (
              <div key={index} className="p-3 rounded-md bg-earth-light/30">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Ingrediente #{index + 1}</h3>
                  <div className="flex space-x-1">
                    <button
                      type="button"
                      onClick={() => moveIngredienteUp(index)}
                      disabled={index === 0}
                      className={`p-1 rounded ${
                        index === 0
                          ? "text-gray-400"
                          : "text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      <ChevronUp size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveIngredienteDown(index)}
                      disabled={index === formData.ingredientes.length - 1}
                      className={`p-1 rounded ${
                        index === formData.ingredientes.length - 1
                          ? "text-gray-400"
                          : "text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      <ChevronDown size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeIngrediente(index)}
                      className="p-1 text-red-600 hover:bg-red-100 rounded"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Nombre del ingrediente */}
                  <div className="md:col-span-1">
                    <label
                      htmlFor={`ingrediente-nombre-${index}`}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Nombre <span className="text-red-700">*</span>
                    </label>
                    <input
                      type="text"
                      id={`ingrediente-nombre-${index}`}
                      value={ingrediente.nombre}
                      onChange={(e) =>
                        handleIngredienteChange(index, "nombre", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-earth-light rounded-md"
                      placeholder="Ej: Bife de chorizo"
                    />
                  </div>

                  {/* Cantidad */}
                  <div>
                    <label
                      htmlFor={`ingrediente-cantidad-${index}`}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Cantidad <span className="text-red-700">*</span>
                    </label>
                    <input
                      type="number"
                      id={`ingrediente-cantidad-${index}`}
                      value={ingrediente.cantidad}
                      onChange={(e) =>
                        handleIngredienteChange(
                          index,
                          "cantidad",
                          Number.parseFloat(e.target.value) || 0
                        )
                      }
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-earth-light rounded-md"
                    />
                  </div>

                  {/* Unidad */}
                  <div>
                    <label
                      htmlFor={`ingrediente-unidad-${index}`}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Unidad <span className="text-red-700">*</span>
                    </label>
                    <select
                      id={`ingrediente-unidad-${index}`}
                      value={ingrediente.unidad}
                      onChange={(e) =>
                        handleIngredienteChange(index, "unidad", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-earth-light rounded-md"
                    >
                      <option selected hidden value={""}>
                        Desplegar lista
                      </option>

                      {unidades.map((opcion: { datovisible: string }) => (
                        <option
                          key={opcion.datovisible}
                          value={opcion.datovisible}
                        >
                          {opcion.datovisible}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addIngrediente}
              className="w-60 mx-auto flex items-center justify-center bg-earth-hard text-cream py-2 rounded hover:bg-earth-light hover:text-earth-hard transition-colors cursor-pointer"
            >
              <Plus size={18} className="mr-1" />
              Agregar ingrediente
            </button>
          </div>
        </div>

        {/* Pasos */}
        <div className="bg-cream p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">
            Pasos de preparación
          </h2>

          {errors.pasos && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded flex items-center">
              <AlertCircle className="mr-2" size={18} />
              {errors.pasos}
            </div>
          )}

          <div className="space-y-4">
            {formData.pasos.map((paso, index) => (
              <div key={index} className="p-3 rounded-md bg-earth-light/30">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Paso #{paso.numero}</h3>
                  <div className="flex space-x-1">
                    <button
                      type="button"
                      onClick={() => movePasoUp(index)}
                      disabled={index === 0}
                      className={`p-1 rounded ${
                        index === 0
                          ? "text-gray-400"
                          : "text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      <ChevronUp size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() => movePasoDown(index)}
                      disabled={index === formData.pasos.length - 1}
                      className={`p-1 rounded ${
                        index === formData.pasos.length - 1
                          ? "text-gray-400"
                          : "text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      <ChevronDown size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removePaso(index)}
                      className="p-1 text-red-600 hover:bg-red-100 rounded"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {/* Título del paso (opcional) */}
                  <div>
                    <label
                      htmlFor={`paso-nombre-${index}`}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Título del paso <span className="text-red-700">*</span>
                    </label>
                    <input
                      type="text"
                      id={`paso-nombre-${index}`}
                      value={paso.nombre}
                      onChange={(e) =>
                        handlePasoChange(index, "nombre", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-earth-light rounded-md"
                      placeholder="Ej: Preparar la marinada"
                    />
                  </div>

                  {/* Descripción del paso */}
                  <div>
                    <label
                      htmlFor={`paso-descripcion-${index}`}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Descripción <span className="text-red-700">*</span>
                    </label>
                    <textarea
                      id={`paso-descripcion-${index}`}
                      value={paso.descripcion}
                      onChange={(e) =>
                        handlePasoChange(index, "descripcion", e.target.value)
                      }
                      rows={2}
                      className="w-full px-3 py-2 border border-earth-light rounded-md"
                      placeholder="Describe este paso de la receta"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addPaso}
              className="w-60 mx-auto flex items-center justify-center bg-earth-hard text-cream py-2 rounded hover:bg-earth-light hover:text-earth-hard transition-colors cursor-pointer"
            >
              <Plus size={18} className="mr-1" />
              Agregar paso
            </button>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 bg-earth-light rounded-md text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 bg-earth-hard text-cream rounded-md flex items-center ${
              isSubmitting
                ? "opacity-70 cursor-not-allowed"
                : "hover:bg-earth-light hover:text-earth-hard transition-colors cursor-pointer"
            }`}
          >
            <Save size={18} className="mr-2" />
            {isSubmitting ? "Guardando..." : "Guardar Receta"}
          </button>
        </div>
      </form>
    </div>
  );
}
