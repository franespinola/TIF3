import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SettingsPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    personalInfo: {
      name: '',
      email: '',
      phoneNumber: ''
    },
    accountSettings: {
      language: 'es',
      theme: 'light',
      notifications: true
    },
    systemSettings: {
      ollamaEndpoint: 'http://localhost:11434',
      modelName: 'llama3',
      saveTranscriptions: true,
      autoGenograms: true
    }
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // Simulación de carga de datos
        await new Promise(resolve => setTimeout(resolve, 600));
        
        // Datos de ejemplo
        const userData = {
          personalInfo: {
            name: 'Dr. Juan Pérez',
            email: 'juan.perez@example.com',
            phoneNumber: '+56 9 1234 5678'
          },
          accountSettings: {
            language: 'es',
            theme: 'light',
            notifications: true
          },
          systemSettings: {
            ollamaEndpoint: 'http://localhost:11434',
            modelName: 'llama3',
            saveTranscriptions: true,
            autoGenograms: true
          }
        };
        
        setSettings(userData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching settings data:', error);
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [name]: value
      }
    }));
  };

  const handleAccountSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setSettings(prev => ({
      ...prev,
      accountSettings: {
        ...prev.accountSettings,
        [name]: newValue
      }
    }));
  };

  const handleSystemSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setSettings(prev => ({
      ...prev,
      systemSettings: {
        ...prev.systemSettings,
        [name]: newValue
      }
    }));
  };
  
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    
    console.log('Guardando configuración:', settings);
    
    // Simulación de guardado
    await new Promise(resolve => setTimeout(resolve, 800));
    
    alert('Configuración guardada correctamente');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
        <p className="text-sm text-gray-500">Personaliza tu experiencia en la plataforma.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <div className="bg-white shadow rounded-lg overflow-hidden sticky top-8">
            <div className="p-4 border-b border-gray-200 font-medium">
              <h2 className="text-lg font-medium">Secciones</h2>
            </div>
            
            <nav className="flex flex-col">
              <a href="#personal-info" className="px-4 py-3 hover:bg-gray-50 border-l-4 border-blue-600">
                Información Personal
              </a>
              <a href="#account-settings" className="px-4 py-3 hover:bg-gray-50 border-l-4 border-transparent">
                Cuenta
              </a>
              <a href="#system-settings" className="px-4 py-3 hover:bg-gray-50 border-l-4 border-transparent">
                Sistema
              </a>
            </nav>
          </div>
        </div>
        
        <div className="md:col-span-3">
          <form onSubmit={handleSaveSettings}>
            {/* Información Personal */}
            <div id="personal-info" className="bg-white shadow rounded-lg overflow-hidden mb-6">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-medium">Información Personal</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Actualice su información personal
                </p>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Nombre completo
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                      value={settings.personalInfo.name}
                      onChange={handlePersonalInfoChange}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                      value={settings.personalInfo.email}
                      onChange={handlePersonalInfoChange}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                      Número de teléfono
                    </label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                      value={settings.personalInfo.phoneNumber}
                      onChange={handlePersonalInfoChange}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Configuración de la Cuenta */}
            <div id="account-settings" className="bg-white shadow rounded-lg overflow-hidden mb-6">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-medium">Configuración de la Cuenta</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Personalice su experiencia
                </p>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                      Idioma
                    </label>
                    <select
                      id="language"
                      name="language"
                      className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                      value={settings.accountSettings.language}
                      onChange={handleAccountSettingsChange}
                    >
                      <option value="es">Español</option>
                      <option value="en">English</option>
                      <option value="pt">Português</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="theme" className="block text-sm font-medium text-gray-700">
                      Tema
                    </label>
                    <select
                      id="theme"
                      name="theme"
                      className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                      value={settings.accountSettings.theme}
                      onChange={handleAccountSettingsChange}
                    >
                      <option value="light">Claro</option>
                      <option value="dark">Oscuro</option>
                      <option value="system">Sistema</option>
                    </select>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="notifications"
                        name="notifications"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={settings.accountSettings.notifications}
                        onChange={handleAccountSettingsChange}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="notifications" className="font-medium text-gray-700">
                        Notificaciones
                      </label>
                      <p className="text-gray-500">
                        Recibir notificaciones sobre citas y actualizaciones
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Configuración del Sistema */}
            <div id="system-settings" className="bg-white shadow rounded-lg overflow-hidden mb-6">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-medium">Configuración del Sistema</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Configure los ajustes técnicos del sistema
                </p>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label htmlFor="ollamaEndpoint" className="block text-sm font-medium text-gray-700">
                      Endpoint de Ollama
                    </label>
                    <input
                      type="text"
                      id="ollamaEndpoint"
                      name="ollamaEndpoint"
                      className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                      value={settings.systemSettings.ollamaEndpoint}
                      onChange={handleSystemSettingsChange}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="modelName" className="block text-sm font-medium text-gray-700">
                      Modelo de IA
                    </label>
                    <select
                      id="modelName"
                      name="modelName"
                      className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                      value={settings.systemSettings.modelName}
                      onChange={handleSystemSettingsChange}
                    >
                      <option value="llama3">Llama 3</option>
                      <option value="gemini-pro">Gemini Pro</option>
                      <option value="mistral">Mistral</option>
                      <option value="openai">OpenAI</option>
                    </select>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="saveTranscriptions"
                        name="saveTranscriptions"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={settings.systemSettings.saveTranscriptions}
                        onChange={handleSystemSettingsChange}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="saveTranscriptions" className="font-medium text-gray-700">
                        Guardar transcripciones
                      </label>
                      <p className="text-gray-500">
                        Guarda automáticamente las transcripciones de audio
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="autoGenograms"
                        name="autoGenograms"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={settings.systemSettings.autoGenograms}
                        onChange={handleSystemSettingsChange}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="autoGenograms" className="font-medium text-gray-700">
                        Genogramas automáticos
                      </label>
                      <p className="text-gray-500">
                        Genera genogramas automáticamente desde transcripciones
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 mr-3"
                onClick={() => {
                  if (window.confirm('¿Estás seguro? Los cambios no guardados se perderán.')) {
                    navigate('/dashboard');
                  }
                }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Guardar configuración
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;