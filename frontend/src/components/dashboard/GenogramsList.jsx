import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import { Card, CardContent, CardFooter } from '../ui/Card';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { Icons } from '../ui/Icons';
import { Badge } from '../ui/Badge';

const GenogramsList = () => {
  const [genograms, setGenograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredGenograms, setFilteredGenograms] = useState([]);
  useEffect(() => {
    // Función para obtener los genogramas de la API
    const fetchGenograms = async () => {
      setLoading(true);
      
      try {
        // Llamada a la API para obtener los genogramas con info de pacientes
        const response = await fetch('/api/genograms/list');
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Si no hay datos, configurar un array vacío
        const genogramsData = data || [];
        
        setGenograms(genogramsData);
        setFilteredGenograms(genogramsData);
      } catch (error) {
        console.error('Error al cargar genogramas:', error);
        // En caso de error, podríamos mostrar un mensaje al usuario
      } finally {
        setLoading(false);
      }
    };
    
    fetchGenograms();
  }, []);

  // Filtrar genogramas cuando cambia el término de búsqueda
  useEffect(() => {
    if (searchTerm === '') {
      setFilteredGenograms(genograms);
      return;
    }
    
    const filtered = genograms.filter(genogram => 
      genogram.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      genogram.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      genogram.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredGenograms(filtered);
  }, [searchTerm, genograms]);

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Genogramas</h1>
          <p className="text-gray-600">Visualiza y gestiona todos los genogramas de tus pacientes</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/genograms/new">
            <Button 
              variant="primary"
              icon={<Icons.Plus className="w-4 h-4" />}
            >
              Crear Genograma
            </Button>
          </Link>
        </div>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Icons.Search className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
              placeholder="Buscar genogramas por paciente o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Genograms grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {filteredGenograms.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <Icons.Search className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <h2 className="text-xl font-medium text-gray-800 mb-1">No se encontraron genogramas</h2>
              <p className="text-gray-500 mb-4">No hay genogramas que coincidan con tu búsqueda.</p>
              <Button 
                variant="outline" 
                onClick={() => setSearchTerm('')}
              >
                Limpiar búsqueda
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGenograms.map((genogram) => (
                <Card 
                  key={genogram.id}
                  className="h-full flex flex-col hover:shadow-md transition-shadow"
                >
                  <div className="aspect-video bg-gray-100 relative overflow-hidden rounded-t-xl">
                    {genogram.thumbnail ? (
                      <img 
                        src={genogram.thumbnail} 
                        alt={`Genograma de ${genogram.patientName}`} 
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-blue-50">
                        <Icons.Genogram className="w-16 h-16 text-blue-300" />
                      </div>
                    )}
                    
                    <div className="absolute top-3 right-3">
                      <Badge variant="primary" className="bg-white/80 backdrop-blur-sm">
                        {new Date(genogram.created).toLocaleDateString()}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-5 flex-1">
                    <div className="flex items-start mb-3">
                      <Avatar name={genogram.patientName} size="md" className="mr-3" />
                      <div>
                        <h3 className="font-medium text-gray-900">{genogram.name}</h3>
                        <p className="text-sm text-gray-600">{genogram.patientName}</p>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 text-sm line-clamp-3">
                      {genogram.description}
                    </p>
                  </CardContent>
                  
                  <CardFooter className="border-t border-gray-100 p-3">
                    <div className="w-full flex space-x-2">
                      <Link to={`/genograms/view/${genogram.id}`} className="flex-1">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                        >
                          Ver
                        </Button>
                      </Link>
                      <Link to={`/genograms/edit/${genogram.id}`} className="flex-1">
                        <Button 
                          variant="primary" 
                          size="sm" 
                          className="w-full"
                        >
                          Editar
                        </Button>
                      </Link>
                    </div>
                  </CardFooter>
                </Card>
              ))}
              
              {/* Create New Genogram Card */}
              <Link to="/genograms/new" className="h-full">
                <Card className="h-full flex flex-col border-dashed hover:bg-gray-50 hover:border-blue-300 transition-colors cursor-pointer">
                  <CardContent className="h-full flex flex-col items-center justify-center p-10">
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                      <Icons.Plus className="w-10 h-10 text-blue-500" />
                    </div>
                    <h3 className="font-medium text-gray-900 text-lg mb-2">Crear Nuevo Genograma</h3>
                    <p className="text-gray-500 text-center">
                      Genera un nuevo genograma a partir de una entrevista grabada o manualmente
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
};

export default GenogramsList;