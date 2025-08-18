"use client"

import { useState, useEffect } from "react"
import * as XLSX from "xlsx"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Search, User, AlertCircle } from "lucide-react"

interface Student {
  libreta: string
  apellido: string
  nombre: string
  dni: string
  curso: string
  condicion: string
  comision: string
  profesores: string
}

export function StudentSearch() {
  const [students, setStudents] = useState<Student[]>([])
  const [libreta, setLibreta] = useState("")
  const [student, setStudent] = useState<Student | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  // ✅ Cargar Excel una sola vez al inicio
  useEffect(() => {
  const loadExcel = async () => {
    try {
      const response = await fetch("/PMI TEst.xlsx")
      const arrayBuffer = await response.arrayBuffer()
      const workbook = XLSX.read(arrayBuffer, { type: "buffer" })
      const worksheet = workbook.Sheets[workbook.SheetNames[0]]
      const rawData = XLSX.utils.sheet_to_json<any>(worksheet)

      const normalized: Student[] = rawData.map((row) => ({
        libreta: String(row["Numero de Libreta"] ?? ""),
        apellido: row["Apellido"] ?? "",
        nombre: row["Nombre"] ?? "",
        dni: String(row["DNI"] ?? ""),
        curso: row["Curso"] ?? "",
        condicion: row["Condición"] ?? "",
        comision: row["Comisión"] ?? "",
        profesores: row["Profesores"] ?? "",
      }))

      console.log("Datos normalizados:", normalized)
      setStudents(normalized)
    } catch (err) {
      console.error("Error cargando Excel:", err)
    }
  }

  loadExcel()
}, [])

  const handleSearch = async () => {
    if (!libreta.trim()) return

    setIsLoading(true)
    setNotFound(false)
    setStudent(null)
    setHasSearched(false)

    await new Promise((resolve) => setTimeout(resolve, 1000)) // simular delay

    const foundStudent = students.find((s) => String(s.libreta) === libreta.trim())

    if (foundStudent) {
      setStudent(foundStudent)
    } else {
      setNotFound(true)
    }

    setHasSearched(true)
    setIsLoading(false)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Formulario */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Búsqueda de Estudiante
          </CardTitle>
          <CardDescription>Ingrese el número de libreta para buscar los datos del estudiante</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Ingrese su número de libreta"
              value={libreta}
              onChange={(e) => setLibreta(e.target.value)}
              disabled={isLoading}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={isLoading || !libreta.trim()} className="px-6">
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Buscando...
                </>
              ) : (
                "Búscame"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resultados */}
      {hasSearched && (
        <>
          {student && (
            <Card className="border-green-200 dark:border-green-800">
              <CardHeader className="bg-green-50 dark:bg-green-950/50">
                <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-200">
                  <User className="h-5 w-5" />
                  Estudiante Encontrado
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div><strong>Libreta:</strong> {student.libreta}</div>
                  <div><strong>Apellido:</strong> {student.apellido}</div>
                  <div><strong>Nombre:</strong> {student.nombre}</div>
                  <div><strong>DNI:</strong> {student.dni}</div>
                  <div><strong>Curso:</strong> {student.curso}</div>
                  <div><strong>Condición:</strong> {student.condicion}</div>
                  <div><strong>Comisión:</strong> {student.comision}</div>
                  <div className="md:col-span-2"><strong>Profesores:</strong> {student.profesores}</div>
                </div>
              </CardContent>
            </Card>
          )}

          {notFound && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No se encontró ningún estudiante con la libreta <strong>{libreta}</strong>.
              </AlertDescription>
            </Alert>
          )}
        </>
      )}
    </div>
  )
}
