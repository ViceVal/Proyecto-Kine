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
        // 1. Intentar parsear como URL completa
        try {
          const url = new URL(decodedText);
          const path = url.pathname + url.search;
          console.log("🔗 URL detectada, navegando a:", path);
          navigate(path);
          return;
        } catch {
          // No es URL, continuar
        }

        // 2. Intentar parsear como JSON
        try {
          const qrData = JSON.parse(decodedText);
          const boxName = qrData.boxName || "Box Sin Especificar";
          const codigoqr = qrData.codigoqr || qrData.code || decodedText;
          const fecha = qrData.fecha || "";
          const hora = qrData.hora || "";

          console.log("📋 JSON detectado:", { boxName, codigoqr, fecha, hora });
          navigate(
            `/detalles-atencion?boxName=${encodeURIComponent(boxName)}&codigoqr=${encodeURIComponent(codigoqr)}&fecha=${fecha}&hora=${hora}`
          );
          return;
        } catch {
          // No es JSON válido
        }

        // 3. QR simple: consultar al servidor
        console.log("🔍 Código QR simple detectado, consultando servidor...");

        const response = await fetch(
          `${apiBase}/api/qrcodes/${encodeURIComponent(decodedText)}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "QR no válido");
        }

        const qrData = await response.json();
        console.log("✅ Datos del QR obtenidos:", qrData);

        // Extraer datos necesarios
        const boxName = qrData.nombre || "Box Sin Especificar";
        const codigoqr = qrData.codigoqr;

        // Extraer fecha y hora del scheduledAt (formato: "2025-12-01T14:30:00")
        let fecha = "";
        let hora = "";
        if (qrData.scheduledat) {
          const dt = new Date(qrData.scheduledat);
          fecha = dt.toISOString().split("T")[0]; // "2025-12-01"
          hora = dt.toTimeString().slice(0, 5); // "14:30"
        }

        console.log("📦 Parámetros a enviar:", {
          boxName,
          codigoqr,
          fecha,
          hora,
        });

        // Navegar con todos los parámetros
        navigate(
          `/detalles-atencion?boxName=${encodeURIComponent(boxName)}&codigoqr=${encodeURIComponent(codigoqr)}&fecha=${fecha}&hora=${hora}`
        );
      } catch (err) {
        console.error("❌ Error al procesar el QR:", err);
        setError(`Error: ${err.message}`);
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
      <div className="relative w-full bg-D2C9FF py-6 text-center shadow">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-4 top-12 -translate-y-12 text-black text-2xl hover:scale-110 transition"
        >
          ←
        </button>
        <h1 className="text-3xl font-bold text-gray-900">KineApp</h1>
        <h2 className="text-gray-700 text-sm font-semibold">
          Escanear QR del Paciente
        </h2>
      </div>

      {/* CONTENIDO */}
      <div className="flex-1 px-6 pt-6 pb-8 overflow-y-auto flex flex-col items-center justify-start">
        {/* Scanner container - SIEMPRE renderizado pero oculto si no escanea */}
        <div
          id="qr-reader"
          className={`w-full max-w-md mb-6 rounded-xl overflow-hidden transition-all ${
            scanning ? "opacity-100 min-h-80" : "opacity-0 hidden min-h-0"
          }`}
          style={{
            minHeight: scanning ? "400px" : "0px",
            border: scanning ? "2px solid #1E6176" : "none",
          }}
        />

        {/* Botones de control */}
        <div className="w-full max-w-md space-y-4">
          {!scanning ? (
            <button
              onClick={startScanning}
              className="w-full py-4 bg-1E6176 text-white text-lg font-semibold rounded-xl shadow-md hover:bg-164d5e active:scale-95 transition"
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
            <p className="text-red-600 text-sm">{error}</p>
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
