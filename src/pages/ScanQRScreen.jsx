import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import { scanQR } from '../services/assistanceService';

const ScanQRScreen = () => {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const html5QrCodeRef = useRef(null);

  const onScanSuccess = useCallback(async (decodedText) => {
    console.log('QR Code escaneado:', decodedText);
    setResult(decodedText);

    // Detener el escaneo
    if (html5QrCodeRef.current) {
      try {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current = null;
      } catch (err) {
        console.error('Error al detener la cámara:', err);
      }
    }
    setScanning(false);

    // Procesar el QR escaneado
    try {
      const practicanteId = 'practicante_001'; // En una implementación real, esto vendría de la sesión
      const response = await scanQR(decodedText, practicanteId);

      if (response.success) {
        // Redirigir a la pantalla de verificación de asistencia
        navigate('/verificar-asistencia', { state: { paciente: response.paciente } });
      } else {
        setError('Error al procesar el QR: ' + response.message);
      }
    } catch (err) {
      console.error('Error al procesar el QR:', err);
      setError('Error al procesar el QR');
    }
  }, [navigate]);

  const onScanError = useCallback(() => {
    // Este error se dispara continuamente mientras escanea, no es necesario mostrarlo
  }, []);

  const stopScanning = useCallback(async () => {
    if (html5QrCodeRef.current && scanning) {
      try {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current = null;
      } catch (err) {
        console.error('Error al detener la cámara:', err);
      }
    }
  }, [scanning]);

  const startScanning = useCallback(async () => {
    try {
      setScanning(true);
      setError(null);

      // Crear instancia de Html5Qrcode
      html5QrCodeRef.current = new Html5Qrcode('qr-reader');

      // Configuración de la cámara
      const config = {
        fps: 10, // Frames por segundo
        qrbox: { width: 250, height: 250 }, // Área de escaneo
      };

      // Iniciar el escaneo con la cámara trasera (environment) o frontal (user)
      await html5QrCodeRef.current.start(
        { facingMode: 'environment' }, // Cámara trasera
        config,
        onScanSuccess,
        onScanError
      );
    } catch (err) {
      console.error('Error al iniciar la cámara:', err);
      setError('No se pudo acceder a la cámara. Por favor, verifica los permisos.');
      setScanning(false);
    }
  }, [onScanSuccess, onScanError]);

  // Iniciar el escaneo de QR al montar el componente
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    startScanning();

    // Cleanup: detener la cámara al desmontar el componente
    return () => {
      stopScanning();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {/* Header */}
      <div className="relative w-full max-w-md mb-6">
        <button
          onClick={handleBack}
          className="absolute left-0 text-2xl font-bold mb-4 text-black"
        >
          ←
        </button>
        <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          Escanear Código QR
        </h1>
      </div>

      {/* Contenedor de la cámara */}
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {scanning && (
          <div className="text-center mb-4">
            <p className="text-lg text-gray-700 mb-2">
              Apunta la cámara al código QR del paciente
            </p>
          </div>
        )}

        {/* Visor de la cámara */}
        <div
          id="qr-reader"
          className="w-full rounded-lg overflow-hidden"
          style={{ minHeight: '300px' }}
        ></div>

        {result && (
          <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            <p className="font-bold">QR Escaneado:</p>
            <p className="text-sm break-all">{result}</p>
          </div>
        )}

        {!scanning && !result && (
          <button
            onClick={startScanning}
            className="w-full mt-4 py-3 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded focus:outline-none focus:shadow-outline"
          >
            Volver a escanear
          </button>
        )}
      </div>
    </div>
  );
};

export default ScanQRScreen;