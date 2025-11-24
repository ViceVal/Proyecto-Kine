import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { scanQR } from '../services/assistanceService';

const ScanQRScreen = () => {
  const [qrData, setQrData] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  const handleScan = async () => {
    if (!qrData) {
      alert('Por favor, ingresa los datos del QR');
      return;
    }

    setIsScanning(true);
    try {
      // Simulando el ID del practicante (en una implementación real, esto vendría de la sesión)
      const practicanteId = 'practicante_001';
      const response = await scanQR(qrData, practicanteId);
      
      if (response.success) {
        setResult(response);
        // Redirigir a la pantalla de verificación de asistencia
        navigate('/verificar-asistencia', { state: { paciente: response.paciente } });
      } else {
        alert('Error al escanear el QR: ' + response.message);
      }
    } catch (error) {
      console.error('Error al escanear QR:', error);
      alert('Error al escanear el QR');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Escanear Código QR</h1>
      
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          <label htmlFor="qrData" className="block text-gray-700 text-sm font-bold mb-2">
            Datos del QR
          </label>
          <input
            id="qrData"
            type="text"
            value={qrData}
            onChange={(e) => setQrData(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Ingresa los datos del QR"
          />
        </div>
        
        <button
          onClick={handleScan}
          disabled={isScanning}
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
        >
          {isScanning ? 'Escaneando...' : 'Escanear QR'}
        </button>
      </div>
      
      {result && (
        <div className="mt-6 w-full max-w-md bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Resultado del Escaneo</h2>
          <p className="text-gray-700"><strong>Paciente:</strong> {result.paciente.nombre}</p>
          <p className="text-gray-700"><strong>RUT:</strong> {result.paciente.rut}</p>
          <p className="text-green-600 mt-2">{result.message}</p>
        </div>
      )}
    </div>
  );
};

export default ScanQRScreen;