import { StudentSearch } from "@/components/student-search"
import { ThemeToggle } from "@/components/theme-toggle"
import Image from "next/image"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Encabezado */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex flex-col items-center flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground text-center">
              Proyecto de Mejora Institucional
            </h1>
            <div className="mt-4">
              <Image
                src="/lv.png"
                alt="Logo Lenguas Vivas"
                width={120}
                height={120}
                priority
              />
            </div>
          </div>

          {/* Botón de tema a la derecha */}
          <div className="ml-4">
            <ThemeToggle />
          </div>
        </div>

        {/* Buscador */}
        <StudentSearch />
      </div>
    </div>
  )
}
