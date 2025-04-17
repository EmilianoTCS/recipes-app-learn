import type { Metadata } from "next";
import { Libre_Baskerville } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const libreBaskerville = Libre_Baskerville({
  weight: ["400", "700"], // Especifica los pesos que necesitas
  style: ["normal", "italic"], // Opcional
  subsets: ["latin"], // Subconjunto de caracteres (mejora rendimiento)
  display: "swap", // Evita "flash de texto invisible" (FOIT)
});
export const metadata: Metadata = {
  icons: {
    icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%2210 0 100 100%22><text y=%22.90em%22 font-size=%2290%22>🍽</text></svg>",
    shortcut:
      "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%2210 0 100 100%22><text y=%22.90em%22 font-size=%2290%22>🍽</text></svg>",
    apple:
      "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%2210 0 100 100%22><text y=%22.90em%22 font-size=%2290%22>🍽</text></svg>",
  },
  title: "Recetitas - Descubre recetas deliciosas",
  description:
    "Explora recetas de todo el mundo y encuentra tu próxima comida favorita",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body
        className={`${libreBaskerville.className} bg-earth min-h-screen flex flex-col`}
      >
        <header className="bg-earth-light shadow-sm">
          <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center">
            <Link
              href="/"
              className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-0"
            >
              Recetitas 🍴
            </Link>
            <nav className="w-full sm:w-auto">
              <ul className="flex justify-center sm:justify-end space-x-4 sm:space-x-6">
                <li>
                  <Link
                    href="/"
                    className="text-lg sm:text-xl hover:text-earth-hard transition-colors"
                  >
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link
                    href="/favoritos"
                    className="text-lg sm:text-xl hover:text-earth-hard transition-colors"
                  >
                    Favoritos
                  </Link>
                </li>
                <li>
                  <Link href="/midespensa" className="text-xl">
                    Mi despensa
                  </Link>
                </li>
                <li>
                  <Link href="/nuevareceta" className="text-xl">
                    Subir mi receta
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>

        <main className="flex-grow">{children}</main>

        <footer className="bg-earth-hard text-gray-200 py-6 sm:py-8 mt-8 sm:mt-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
              <div className="text-center sm:text-left">
                <h3 className="text-xl font-semibold mb-3 sm:mb-4">
                  Recetitas
                </h3>
                <p className="text-gray-300 text-sm sm:text-base">
                  Descubre recetas deliciosas de todo el mundo y encuentra
                  inspiración para tu próxima comida.
                </p>
                <p className="text-xs sm:text-sm mt-4 sm:mt-5 text-gray-400">
                  Esta web fue desarrollada con propósitos de aprendizaje
                </p>
              </div>
              {/* <div>
                <h3 className="text-xl font-semibold mb-4">Enlaces</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/" className="text-gray-300 hover:text-white">
                      Inicio
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/favoritos"
                      className="text-gray-300 hover:text-white"
                    >
                      Favoritos
                    </Link>
                  </li>
                  <li>
                    <a
                      href="https://www.themealdb.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-300 hover:text-white"
                    >
                      TheMealDB API
                    </a>
                  </li>
                </ul>
              </div> */}
            </div>
            <div className="border-t border-gray-700 mt-6 sm:mt-8 pt-4 sm:pt-6 text-center text-gray-400 text-xs sm:text-sm">
              <p>
                {new Date().getFullYear()} Recetitas. Los datos fueron
                recolectados en internet y cuenta con integración de Gemini API.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
