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
      <body className={`${libreBaskerville.className} bg-earth min-h-screen`}>
        <header className="bg-earth-light shadow-sm">
          <div className="container mx-auto  w-6xl px-4 py-4 flex justify-between items-center">
            <Link href="/" className="text-3xl font-bold text-gray-900">
              Recetitas 🍴
            </Link>
            <nav>
              <ul className="flex space-x-6  ">
                <li>
                  <Link href="/" className="text-xl">Inicio</Link>
                </li>
                <li>
                  <Link
                    href="/favoritos"
                    className="text-xl"
                  >
                    Favoritos
                  </Link>
                </li>
                <li>
                  <Link
                    href="/ideas"
                    className="text-xl"
                  >
                    ¡Encontrar ideas!
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>

        {children}

        <footer className="bg-earth-hard text-gray-200 py-8 mt-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-1">
              <div>
                <h3 className="text-xl font-semibold mb-4">Recetitas</h3>
                <p className="text-gray-300">
                  Descubre recetas deliciosas de todo el mundo y encuentra
                  inspiración para tu próxima comida.
                </p>
                <p className="text-sm mt-5 text-gray-400">
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
            <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
              <p>
                {new Date().getFullYear()} Recetitas. Los datos fueron
                proporcionados por TheMealDB con integración de Gemini API.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
