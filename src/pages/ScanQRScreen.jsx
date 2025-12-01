import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';

const ScanQRScreen = () => {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const navigate = useNavigate();
  const html5QrCodeRef = useRef(null);
  const isInitializedRef = useRef(false);

  const onScanSuccess = useCallback(async (decodedText) => {
    console.log('QR Code escaneado:', decodedText);
    setResult(decodedText);

    // Detener el escaneo
    if (html5QrCodeRef.current) {
      try {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current = null;
        isInitializedRef.current = false;
      } catch (err) {
        console.error('Error al detener la cámara:', err);
      }
    }
    setScanning(false);

    // Procesar el QR escaneado
    try {
      // Intentar parsear como URL
      try {
        const url = new URL(decodedText);
        
        // Es una URL completa - extraer path y query params
        const path = url.pathname + url.search;
        console.log('✅ URL detectada, navegando a:', path);
        navigate(path);
        return;
        
      } catch {
        // No es URL válida, continuar con procesamiento alternativo
      }

      // Intentar parsear como JSON
      try {
        const qrData = JSON.parse(decodedText);
        const boxName = qrData.boxName || 'Box Sin Especificar';
        const codigoqr = qrData.codigoqr || qrData.code || decodedText;
        
        console.log('✅ JSON detectado, datos:', { boxName, codigoqr });
        navigate(`/detalles-atencion?boxName=${encodeURIComponent(boxName)}&codigoqr=${encodeURIComponent(codigoqr)}`);
        return;
        
      } catch {
        // No es JSON válido
      }

      // Asumir que es solo un código QR simple
      console.log('✅ Código QR simple detectado:', decodedText);
      navigate(`/detalles-atencion?codigoqr=${encodeURIComponent(decodedText)}`);
      
    } catch (err) {
      console.error('❌ Error al procesar el QR:', err);
      setError(`Error al procesar el QR: ${err.message}`);
    }
  }, [navigate]);

  const onScanError = useCallback(() => {
    // Este error se dispara continuamente mientras escanea, no es necesario mostrarlo
  }, []);

  const stopScanning = useCallback(async () => {
    if (html5QrCodeRef.current) {
      try {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current = null;
        isInitializedRef.current = false;
      } catch (err) {
        console.error('Error al detener la cámara:', err);
      }
    }
  }, []);

  // Función mejorada para verificar permisos de cámara
  const checkCameraPermission = useCallback(async () => {
    try {
      // Intentar obtener permisos explícitamente
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      // Si llega aquí, hay permisos
      stream.getTracks().forEach(track => track.stop()); // Detener inmediatamente
      return true;
    } catch (err) {
      console.error('Error al verificar permisos:', err);
      
      // Detectar tipo de error
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setPermissionDenied(true);
        setError('Permisos de cámara denegados. Por favor, habilita el acceso a la cámara en la configuración del navegador.');
        return false;
      } else if (err.name === 'NotFoundError') {
        setError('No se encontró ninguna cámara en el dispositivo.');
        return false;
      } else {
        setError('Error al acceder a la cámara: ' + err.message);
        return false;
      }
    }
  }, []);

  const startScanning = useCallback(async () => {
    // Evitar inicializar múltiples veces (previene triplicación)
    if (isInitializedRef.current || html5QrCodeRef.current) {
      console.log('Scanner ya inicializado, ignorando...');
      return;
    }

    try {
      setScanning(true);
      setError(null);
      setPermissionDenied(false); // Resetear estado de permisos
      isInitializedRef.current = true;

      // Crear instancia de Html5Qrcode
      html5QrCodeRef.current = new Html5Qrcode('qr-reader');

      // Configuración de la cámara
      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      };

      await html5QrCodeRef.current.start(
        { facingMode: 'environment' },
        config,
        onScanSuccess,
        onScanError
      );
    } catch (err) {
      console.error('Error al iniciar la cámara:', err);
      
      // Detectar si es error de permisos
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setPermissionDenied(true);
        setError('Permisos de cámara denegados. Haz clic en "Solicitar Permisos" para intentar nuevamente.');
      } else {
        setError('No se pudo acceder a la cámara. Por favor, verifica los permisos.');
      }
      
      setScanning(false);
      isInitializedRef.current = false;
    }
  }, [onScanSuccess, onScanError]);

  // Función para solicitar permisos explícitamente
  const requestCameraPermission = useCallback(async () => {
    const hasPermission = await checkCameraPermission();
    
    if (hasPermission) {
      // Si obtuvo permisos, iniciar escaneo
      setPermissionDenied(false);
      startScanning();
    }
  }, [checkCameraPermission, startScanning]);

  // Ref callback para el div qr-reader (garantiza DOM listo + pide permisos)
  const qrReaderRef = useCallback((node) => {
    if (node && !isInitializedRef.current) {
      // Pequeño delay para asegurar que el DOM esté completamente renderizado
      setTimeout(() => {
        startScanning();
      }, 100);
    } else if (!node) {
      // Limpiar al desmontar
      stopScanning();
    }
  }, [startScanning, stopScanning]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleRescan = () => {
    setResult(null);
    setError(null);
    setPermissionDenied(false);
    startScanning();
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
          ref={qrReaderRef}
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

        {/* Botones mejorados con detección de permisos */}
        {!scanning && !result && (
          <div className="space-y-2 mt-4">
            {/* Botón principal: Volver a escanear */}
            {!permissionDenied && (
              <button
                onClick={handleRescan}
                className="w-full py-3 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded focus:outline-none focus:shadow-outline transition"
              >
                🔄 Volver a escanear
              </button>
            )}

            {/* Botón específico para solicitar permisos (solo si fueron denegados) */}
            {permissionDenied && (
              <button
                onClick={requestCameraPermission}
                className="w-full py-3 bg-orange-500 hover:bg-orange-700 text-white font-bold rounded focus:outline-none focus:shadow-outline transition"
              >
                🔐 Solicitar Permisos de Cámara
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScanQRScreen;
