"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import DashboardLayout from "../layout/DashboardLayout"
import { Card, CardContent, CardFooter } from "../../ui/Card"
import Button from "../../ui/Button"
import Avatar from "../../ui/Avatar"
import Icons from "../../ui/Icons"
import Badge from "../../ui/Badge"
import api from "../../../services/api"

const GenogramsList = () => {
  const [genograms, setGenograms] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredGenograms, setFilteredGenograms] = useState([])

  useEffect(() => {
    const fetchGenograms = async () => {
      setLoading(true)

      try {
        const { data } = await api.get("/genograms/list")
        const genogramsData = data || []

        setGenograms(genogramsData)
        setFilteredGenograms(genogramsData)
      } catch (error) {
        console.error("Error al cargar genogramas:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchGenograms()
  }, [])

  // Filtrar genogramas cuando cambia el término de búsqueda
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredGenograms(genograms)
      return
    }

    const filtered = genograms.filter(
      (genogram) =>
        genogram.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        genogram.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        genogram.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    setFilteredGenograms(filtered)
  }, [searchTerm, genograms])

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const options = { day: "numeric", month: "short", year: "numeric" }
    return new Date(dateString).toLocaleDateString("es", options)
  }

  return (
    <DashboardLayout>
      {/* Header con gradiente */}
      <div className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-md">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Genogramas</h1>
            <p className="mt-1 text-teal-100 text-sm sm:text-base">
              Visualiza y gestiona todos los genogramas de tus pacientes
            </p>
          </div>
          <Link to="/genograms/new">
            <Button
              variant="white"
              className="bg-white/90 hover:bg-white text-teal-700 border-none w-full sm:w-auto"
              icon={<Icons.Plus className="w-4 h-4" />}
            >
              Crear Genograma
            </Button>
          </Link>
        </div>
      </div>

      {/* Search */}
      <Card className="mb-4 sm:mb-6 border border-gray-200 shadow-sm">
        <CardContent className="p-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Icons.Search className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full pl-10 p-2.5"
              placeholder="Buscar genogramas por paciente o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Genograms grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
        </div>
      ) : (
        <>
          {filteredGenograms.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 text-center">
              <Icons.Search className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <h2 className="text-xl font-medium text-gray-800 mb-1">No se encontraron genogramas</h2>
              <p className="text-gray-500 mb-4">No hay genogramas que coincidan con tu búsqueda.</p>
              <Button
                variant="outline"
                className="border-teal-200 text-teal-700 hover:bg-teal-50"
                onClick={() => setSearchTerm("")}
              >
                Limpiar búsqueda
              </Button>
            </div>
          ) : (
            <>
              {/* Contador de resultados */}
              <div className="text-sm text-gray-500 mb-3">Mostrando {filteredGenograms.length} genogramas</div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                {filteredGenograms.map((genogram) => (
                  <Card
                    key={genogram.id}
                    className="h-full flex flex-col border border-gray-200 shadow-sm hover:shadow-md transition-all hover:border-teal-200"
                  >
                    <div className="aspect-video bg-gray-50 relative overflow-hidden rounded-t-lg">
                      {genogram.thumbnail ? (
                        <img
                          src={genogram.thumbnail || "/placeholder.svg"}
                          alt={`Genograma de ${genogram.patientName}`}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-teal-50">
                          <Icons.Genogram className="w-16 h-16 text-teal-300" />
                        </div>
                      )}

                      <div className="absolute top-3 right-3">
                        <Badge
                          variant="secondary"
                          className="bg-white/80 backdrop-blur-sm text-gray-700 border-gray-200 text-xs"
                        >
                          {formatDate(genogram.created)}
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-4 flex-1 border-t border-gray-100">
                      <div className="flex items-start mb-3">
                        <Avatar name={genogram.patientName} size="md" className="mr-3" />
                        <div>
                          <h3 className="font-medium text-gray-900">{genogram.name}</h3>
                          <p className="text-sm text-gray-600">{genogram.patientName}</p>
                        </div>
                      </div>

                      <p className="text-gray-700 text-sm line-clamp-3 mb-2">{genogram.description}</p>

                      {/* Etiquetas o metadatos adicionales */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        <Badge variant="outline" className="text-xs bg-gray-50 border border-gray-200">
                          {genogram.nodeCount || "0"} nodos
                        </Badge>
                        {genogram.lastEdited && (
                          <Badge variant="outline" className="text-xs bg-gray-50 border border-gray-200">
                            Editado: {formatDate(genogram.lastEdited)}
                          </Badge>
                        )}
                      </div>
                    </CardContent>

                    <CardFooter className="border-t border-gray-200 p-3">
                      <div className="w-full flex space-x-2">
                        <Link to={`/genograms/view/${genogram.id}`} className="flex-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full border-gray-300 hover:bg-gray-50 text-gray-700"
                          >
                            <Icons.Eye className="w-4 h-4 mr-1" />
                            Ver
                          </Button>
                        </Link>
                        <Link to={`/genograms/edit/${genogram.id}`} className="flex-1">
                          <Button
                            variant="primary"
                            size="sm"
                            className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                          >
                            <Icons.Edit className="w-4 h-4 mr-1" />
                            Editar
                          </Button>
                        </Link>
                      </div>
                    </CardFooter>
                  </Card>
                ))}

                {/* Create New Genogram Card */}
                <Link to="/genograms/new" className="h-full">
                  <Card className="h-full flex flex-col border-2 border-dashed border-teal-200 hover:bg-teal-50 hover:border-teal-300 transition-colors cursor-pointer shadow-sm">
                    <CardContent className="h-full flex flex-col items-center justify-center p-6 sm:p-10">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                        <Icons.Plus className="w-8 h-8 sm:w-10 sm:h-10 text-teal-600" />
                      </div>
                      <h3 className="font-medium text-gray-900 text-lg mb-2 text-center">Crear Nuevo Genograma</h3>
                      <p className="text-gray-500 text-center text-sm sm:text-base">
                        Genera un nuevo genograma a partir de una entrevista grabada o manualmente
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </>
          )}
        </>
      )}
    </DashboardLayout>
  )
}

export default GenogramsList
