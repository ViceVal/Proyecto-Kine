import React, { useState } from 'react';
import { getPatientHistory } from '../services/assistanceService';

const HistorialPacienteScreen = () => {
  const [rut, setRut] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });

  const handleSearch = async () => {
    if (!rut) {
      alert('Por favor, ingresa el RUT del paciente');
      return;
    }

    setLoading(true);
    try {
      const response = await getPatientHistory(
        rut,
        fechaInicio,
        fechaFin,
        pagination.page,
        pagination.limit
      );

      if (response.success) {
        setHistorial(response.data);
        setPagination(response.pagination);
      } else {
        alert('Error al obtener el historial: ' + response.message);
      }
    } catch (error) {
      console.error('Error al obtener historial:', error);
      alert('Error al obtener el historial');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('es-CL', options);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Historial de Asistencia del Paciente</h1>
      
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="rut" className="block text-gray-700 text-sm font-bold mb-2">
              RUT del Paciente
            </label>
            <input
              id="rut"
              type="text"
              value={rut}
              onChange={(e) => setRut(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="12345678-9"
            />
          </div>
          
          <div>
            <label htmlFor="fechaInicio" className="block text-gray-700 text-sm font-bold mb-2">
              Fecha Inicio (Opcional)
            </label>
            <input
              id="fechaInicio"
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          
          <div>
            <label htmlFor="fechaFin" className="block text-gray-700 text-sm font-bold mb-2">
              Fecha Fin (Opcional)
            </label>
            <input
              id="fechaFin"
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        </div>
        
        <button
          onClick={handleSearch}
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
        >
          {loading ? 'Buscando...' : 'Buscar Historial'}
        </button>
      </div>
      
      {historial.length > 0 && (
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Resultados del Historial</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Notas
                  </th>
                </tr>
              </thead>
              <tbody>
                {historial.map((registro) => (
                  <tr key={registro.id}>
                    <td className="py-2 px-4 border-b border-gray-200">
                      {formatDate(registro.timestamp)}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200">
                      {registro.notas}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <p className="text-gray-600">
              Mostrando {historial.length} de {pagination.total} registros
            </p>
            {/* Aquí se podrían agregar controles de paginación si fuera necesario */}
          </div>
        </div>
      )}
    </div>
  );
};

export default HistorialPacienteScreen;