import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import DashboardLayout from "../layout/DashboardLayout"
import { Card, CardContent } from "../../ui/Card"
import Button from "../../ui/Button"
import Badge from "../../ui/Badge"
import Avatar from "../../ui/Avatar"
import Icons from "../../ui/Icons"
import patientService from "../../../services/patientService"

const PatientsList = () => {
  const [patients, setPatients] = useState([])
  const [filteredPatients, setFilteredPatients] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [error, setError] = useState(null)
  const patientsPerPage = 12

  useEffect(() => {
    const fetchPatients = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Utilizamos el servicio de pacientes para obtener todos los pacientes
        const response = await patientService.getAllPatients()
        const data = response.data

        const formattedPatients = data.map((patient) => ({
          ...patient,
          hasGenogram: patient.genograms && patient.genograms.length > 0,
          nextAppointment:
            patient.appointments && patient.appointments.length > 0
              ? patient.appointments.find((app) => new Date(app.date) > new Date())?.date
              : null,
          lastVisit: patient.last_visit || patient.created_at,
        }))

        setPatients(formattedPatients)
        setFilteredPatients(formattedPatients)
      } catch (err) {
        console.error("Error al cargar pacientes:", err)
        setError("No se pudieron cargar los pacientes. Inténtelo nuevamente más tarde.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchPatients()
  }, [])

  // Filtrar pacientes cuando cambia el término de búsqueda o el filtro
  useEffect(() => {
    if (searchTerm === "" && filter === "all") {
      setFilteredPatients(patients)
      return
    }

    const filtered = patients.filter((patient) => {
      const matchesSearch =
        searchTerm === "" ||
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (patient.diagnosis && patient.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesFilter =
        filter === "all" ||
        (filter === "with-appointment" && patient.nextAppointment) ||
        (filter === "without-appointment" && !patient.nextAppointment)

      return matchesSearch && matchesFilter
    })

    setFilteredPatients(filtered)
    setCurrentPage(1) // Reset a la primera página cuando se filtra
  }, [searchTerm, filter, patients])

  // Calcular pacientes para la página actual
  const indexOfLastPatient = currentPage * patientsPerPage
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage
  const currentPatients = filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient)
  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage)

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const options = { day: "numeric", month: "short", year: "numeric" }
    return new Date(dateString).toLocaleDateString("es", options)
  }

  // Calcular días desde la última visita
  const getDaysSince = (dateString) => {
    if (!dateString) return null
    const lastVisit = new Date(dateString)
    const today = new Date()
    const diffTime = Math.abs(today - lastVisit)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // Obtener color de badge según diagnóstico
  const getDiagnosisBadgeVariant = (diagnosis) => {
    if (!diagnosis) return "secondary"

    const diagnosisLower = diagnosis.toLowerCase()
    if (diagnosisLower.includes("ansiedad")) return "warning"
    if (diagnosisLower.includes("depresión") || diagnosisLower.includes("depresion")) return "danger"
    if (diagnosisLower.includes("estrés") || diagnosisLower.includes("estres")) return "info"
    if (diagnosisLower.includes("trauma")) return "purple"
    if (diagnosisLower.includes("familiar")) return "success"

    return "secondary"
  }

  return (
    <DashboardLayout>
      {/* Header con gradiente */}
      <div className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-md">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Pacientes</h1>
            <p className="mt-1 text-teal-100 text-sm sm:text-base">Gestiona la información de tus pacientes</p>
          </div>
          <Link to="/patients/new">
            <Button
              variant="white"
              className="bg-white/90 hover:bg-white text-teal-700 border-none w-full sm:w-auto"
              icon={<Icons.Plus className="w-4 h-4" />}
            >
              Nuevo Paciente
            </Button>
          </Link>
        </div>
      </div>

      {/* Search and filter */}
      <Card className="mb-4 sm:mb-6 border border-gray-200 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="relative grow">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Icons.Search className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full pl-10 p-2.5"
                placeholder="Buscar pacientes por nombre o diagnóstico..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 p-2.5 min-w-40"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">Todos los pacientes</option>
              <option value="with-appointment">Con cita programada</option>
              <option value="without-appointment">Sin cita programada</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Mostrar error si existe */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 sm:mb-6">
          <div className="flex items-center">
            <Icons.AlertTriangle className="w-5 h-5 mr-2" />
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Patients grid */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
        </div>
      ) : (
        <>
          {filteredPatients.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 text-center">
              <Icons.Search className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <h2 className="text-xl font-medium text-gray-800 mb-1">No se encontraron pacientes</h2>
              <p className="text-gray-500 mb-4">No hay pacientes que coincidan con tu búsqueda.</p>
              <Button
                variant="outline"
                className="border-teal-200 text-teal-700 hover:bg-teal-50"
                onClick={() => {
                  setSearchTerm("")
                  setFilter("all")
                }}
              >
                Limpiar filtros
              </Button>
            </div>
          ) : (
            <>
              {/* Contador de resultados */}
              <div className="text-sm text-gray-500 mb-3">
                Mostrando {currentPatients.length} de {filteredPatients.length} pacientes
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
                {currentPatients.map((patient) => (
                  <Link key={patient.id} to={`/patients/${patient.id}`} className="block h-full">
                    <Card className="border border-gray-200 shadow-sm hover:shadow-md hover:border-teal-200 transition-all cursor-pointer h-full">
                      <CardContent className="p-0">
                        <div className="flex items-stretch h-full">
                          <div
                            className={`w-2 bg-${getDiagnosisBadgeVariant(patient.diagnosis)}-500 rounded-l-lg`}
                          ></div>
                          <div className="flex-1 p-4">
                            <div className="flex items-start">
                              <Avatar name={patient.name} size="md" className="mr-3 flex-shrink-0" />
                              <div className="min-w-0 flex-1">
                                <h3 className="font-medium text-gray-900 truncate">{patient.name}</h3>
                                <p className="text-sm text-gray-500">
                                  {patient.age} años, {patient.gender}
                                </p>
                              </div>
                            </div>

                            <div className="mt-3">
                              {patient.diagnosis && (
                                <Badge
                                  variant={getDiagnosisBadgeVariant(patient.diagnosis)}
                                  className="text-xs border border-opacity-50"
                                >
                                  {patient.diagnosis}
                                </Badge>
                              )}
                            </div>

                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <div className="flex items-center justify-between">
                                <div className="text-xs text-gray-500">
                                  <span className="block">Última visita:</span>
                                  <span className="font-medium text-gray-700">{formatDate(patient.lastVisit)}</span>
                                  {getDaysSince(patient.lastVisit) && (
                                    <span className="block text-xs text-gray-400 mt-0.5">
                                      Hace {getDaysSince(patient.lastVisit)} días
                                    </span>
                                  )}
                                </div>
                                <div className="flex">
                                  {patient.hasGenogram && (
                                    <div
                                      className="p-1.5 bg-purple-50 text-purple-600 rounded-full mr-1 border border-purple-100"
                                      title="Tiene genograma"
                                    >
                                      <Icons.Genogram className="w-4 h-4" />
                                    </div>
                                  )}
                                  {patient.nextAppointment && (
                                    <div
                                      className="p-1.5 bg-green-50 text-green-600 rounded-full border border-green-100"
                                      title={`Próxima cita: ${formatDate(patient.nextAppointment)}`}
                                    >
                                      <Icons.Calendar className="w-4 h-4" />
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-4 sm:mt-6 p-3 sm:p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="mr-2 border-gray-200 hover:bg-gray-50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </Button>

              <div className="text-sm text-gray-700">
                Página <span className="font-medium">{currentPage}</span> de{" "}
                <span className="font-medium">{totalPages}</span>
              </div>

              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                className="ml-2 border-gray-200 hover:bg-gray-50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </Button>
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  )
}

export default PatientsList
