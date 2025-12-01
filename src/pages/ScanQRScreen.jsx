import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Html5Qrcode } from "html5-qrcode";
import textura from "../assets/TexturaHQ.png";

const ScanQRScreen = () => {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const navigate = useNavigate();
  const html5QrCodeRef = useRef(null);
  const isInitializedRef = useRef(false);

  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:4000";

  const onScanSuccess = useCallback(
    async (decodedText) => {
      console.log("✅ QR Code escaneado:", decodedText);
      setResult(decodedText);

      // Detener el escaneo inmediatamente
      if (html5QrCodeRef.current) {
        try {
          await html5QrCodeRef.current.stop();
          html5QrCodeRef.current = null;
          isInitializedRef.current = false;
          setScanning(false);
        } catch (err) {
          console.error("Error al detener la cámara:", err);
        }
      }

      try {
        console.log("🔍 Validando QR con el servidor...");

        let codigoQrAValidar = decodedText;
        let esURL = false;

        // 1. Verificar si es una URL
        try {
          const url = new URL(decodedText);
          esURL = true;
          
          // Extraer el parámetro codigo_qr o codigoqr de la URL
          const params = new URLSearchParams(url.search);
          const codigoQrParam = params.get('codigo_qr') || params.get('codigoqr');
          
          if (codigoQrParam) {
            codigoQrAValidar = codigoQrParam;
            console.log("📋 Código QR extraído de URL:", codigoQrAValidar);
          } else {
            throw new Error(
              "La URL no contiene el parámetro 'codigo_qr' o 'codigoqr'.\n\nURL escaneada: " + decodedText
            );
          }
        } catch (urlError) {
          if (esURL) {
            // Era una URL pero no se pudo procesar
            throw urlError;
          }
          // No es una URL, usar el texto tal cual
          console.log("📝 QR de texto simple detectado:", decodedText);
        }

        // Validar QR con el servidor
        const response = await fetch(
          `${apiBase}/api/qr_codes/${encodeURIComponent(codigoQrAValidar)}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          
          if (response.status === 404) {
            throw new Error(
              `QR no encontrado o inactivo.\n\nCódigo escaneado: "${codigoQrAValidar}"\n\nVerifica que el QR esté registrado en el sistema.`
            );
          }
          
          throw new Error(errorData.error || "Error al validar QR");
        }

        const qrData = await response.json();
        console.log("✅ QR validado exitosamente:", qrData);

        // Extraer datos del QR
        const boxName = qrData.nombre || "Box Sin Especificar";
        const codigoqr = qrData.codigo_qr;
        const idBox = qrData.id_box;

        // Extraer fecha y hora del scheduled_at
        let fecha = "";
        let hora = "";
        if (qrData.scheduled_at) {
          const dt = new Date(qrData.scheduled_at);
          fecha = dt.toISOString().split("T")[0]; // "2025-12-01"
          hora = dt.toTimeString().slice(0, 5); // "14:30"
        }

        console.log("📦 Navegando con datos validados:", {
          boxName,
          codigoqr,
          idBox,
          fecha,
          hora,
        });

        // Navegar a DetallesAtencion con todos los parámetros
        navigate(
          `/detalles-atencion?boxName=${encodeURIComponent(boxName)}&codigoqr=${encodeURIComponent(codigoqr)}&idBox=${idBox}&fecha=${fecha}&hora=${hora}`
        );
      } catch (err) {
        console.error("❌ Error al validar el QR:", err);
        setError(`Error: ${err.message}`);
        // Reiniciar después de 3 segundos para permitir escanear de nuevo
        setTimeout(() => {
          setError(null);
          setResult(null);
        }, 3000);
      }
    },
    [navigate, apiBase]
  );

  const onScanError = useCallback(() => {
    // Este error se dispara continuamente mientras escanea, no es necesario mostrarlo
  }, []);

  const stopScanning = useCallback(async () => {
    if (html5QrCodeRef.current) {
      try {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current = null;
        isInitializedRef.current = false;
        setScanning(false);
      } catch (err) {
        console.error("Error al detener la cámara:", err);
      }
    }
  }, []);

  const startScanning = useCallback(async () => {
    // Evitar inicializar múltiples veces
    if (isInitializedRef.current || html5QrCodeRef.current) {
      console.log("📸 Scanner ya inicializado, ignorando...");
      return;
    }

    try {
      setScanning(true);
      setError(null);
      setPermissionDenied(false);
      setResult(null);

      console.log("⏳ Esperando a que el DOM se actualice...");
      
      // Esperar a que React renderice el elemento
      await new Promise((resolve) => setTimeout(resolve, 100));

      const qrReaderElement = document.getElementById("qr-reader");
      if (!qrReaderElement) {
        throw new Error(
          "Elemento #qr-reader no encontrado. Verifica que el componente esté renderizado."
        );
      }

      console.log("✅ Elemento #qr-reader encontrado, inicializando...");

      isInitializedRef.current = true;

      // Crear instancia de Html5Qrcode
      html5QrCodeRef.current = new Html5Qrcode("qr-reader");

      // Configuración de la cámara
      const config = {
        fps: 60,
        qrbox: { width: 250, height: 250 },
      };

      await html5QrCodeRef.current.start(
        { facingMode: "environment" },
        config,
        onScanSuccess,
        onScanError
      );

      console.log("✅ Cámara iniciada correctamente");
    } catch (err) {
      console.error("❌ Error al iniciar la cámara:", err);

      if (
        err.name === "NotAllowedError" ||
        err.name === "PermissionDeniedError"
      ) {
        setPermissionDenied(true);
        setError(
          "Permisos de cámara denegados. Haz clic en Solicitar Permisos para intentar nuevamente."
        );
      } else {
        setError(
          `No se pudo acceder a la cámara: ${err.message}`
        );
      }

      setScanning(false);
      isInitializedRef.current = false;
    }
  }, [onScanSuccess, onScanError]);

  const checkCameraPermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      // Si llega aquí, hay permisos
      stream.getTracks().forEach((track) => track.stop());
      return true;
    } catch (err) {
      console.error("Error al verificar permisos:", err);

      if (
        err.name === "NotAllowedError" ||
        err.name === "PermissionDeniedError"
      ) {
        setPermissionDenied(true);
        setError(
          "Permisos de cámara denegados. Por favor, habilita el acceso a la cámara en la configuración del navegador."
        );
        return false;
      } else if (err.name === "NotFoundError") {
        setError("No se encontró ninguna cámara en el dispositivo.");
        return false;
      } else {
        setError(`Error al acceder a la cámara: ${err.message}`);
        return false;
      }
    }
  }, []);

  const requestCameraPermission = useCallback(async () => {
    const hasPermission = await checkCameraPermission();
    if (hasPermission) {
      setPermissionDenied(false);
      await startScanning();
    }
  }, [checkCameraPermission, startScanning]);

  // Cleanup al desmontar el componente
  useEffect(() => {
    return async () => {
      if (html5QrCodeRef.current) {
        try {
          await html5QrCodeRef.current.stop();
          html5QrCodeRef.current = null;
          isInitializedRef.current = false;
        } catch (err) {
          console.error("Error al limpiar scanner:", err);
        }
      }
    };
  }, []);

  return (
    <div
      className="min-h-screen w-full flex flex-col"
      style={{
        backgroundImage: `url(${textura})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* HEADER */}
      <div className="relative w-full bg-[#D2C9FF] py-6 text-center shadow">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-black text-2xl hover:scale-110 transition"
        >
          ←
        </button>
        <h1 className="text-3xl font-bold text-gray-900">KineApp</h1>
        <h2 className="text-gray-700 text-sm font-semibold">
          Escanear QR del Paciente
        </h2>
      </div>

      {/* CONTENIDO */}
      <div className="flex-1 px-6 pt-6 pb-8 overflow-y-auto flex flex-col items-center justify-center">
        {/* Scanner container - SIEMPRE renderizado pero oculto si no escanea */}
        <div
          id="qr-reader"
          className={`w-full max-w-md mb-6 rounded-xl overflow-hidden transition-all mx-auto ${
            scanning ? "opacity-100 min-h-80" : "opacity-0 hidden min-h-0"
          }`}
          style={{
            minHeight: scanning ? "400px" : "0px",
            border: scanning ? "2px solid #1E6176" : "none",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        />

        {/* Botones de control */}
        <div className="w-full max-w-md space-y-4">
          {!scanning ? (
            <button
              onClick={startScanning}
              className="w-full py-4 bg-[#1E6176] text-white text-lg font-semibold rounded-xl shadow-md hover:bg-[#164d5e] active:scale-95 transition"
            >
              Iniciar Escaneo
            </button>
          ) : (
            <button
              onClick={stopScanning}
              className="w-full py-4 bg-red-500 text-white text-lg font-semibold rounded-xl shadow-md hover:bg-red-600 active:scale-95 transition"
            >
              Detener Escaneo
            </button>
          )}

          {permissionDenied && (
            <button
              onClick={requestCameraPermission}
              className="w-full py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl shadow-md hover:bg-blue-700 active:scale-95 transition"
            >
              Solicitar Permisos
            </button>
          )}
        </div>

        {/* Errores */}
        {error && (
          <div className="w-full max-w-md mt-6 p-4 bg-red-50 border-2 border-red-300 rounded-xl animate-fadeUp">
            <p className="text-red-700 font-semibold">❌ Error:</p>
            <p className="text-red-600 text-sm whitespace-pre-line">{error}</p>
            <button
              onClick={() => navigate('/generador-qr')}
              className="mt-3 w-full py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              🔳 Ir al Generador de QR
            </button>
          </div>
        )}

        {/* Resultado exitoso */}
        {result && !error && (
          <div className="w-full max-w-md mt-6 p-4 bg-green-50 border-2 border-green-300 rounded-xl animate-fadeUp">
            <p className="text-green-700 font-semibold">✅ QR Detectado:</p>
            <p className="text-green-600 text-sm break-all font-mono">{result}</p>
            <p className="text-green-600 text-xs mt-2">
              Redirigiendo en 2 segundos...
            </p>
          </div>
        )}

        {/* Info */}
        {!scanning && !result && (
          <div className="w-full max-w-md mt-8 text-center animate-fadeUp">
            <p className="text-gray-600 text-sm">
              📱 Apunta la cámara al código QR del paciente
            </p>
            <p className="text-gray-500 text-xs mt-2">
              Asegúrate de tener buena iluminación
            </p>
          </div>
        )}

        {scanning && (
          <div className="w-full max-w-md mt-8 text-center">
            <div className="animate-pulse">
              <p className="text-gray-700 text-sm font-semibold">
                🔍 Escaneando...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScanQRScreen;
