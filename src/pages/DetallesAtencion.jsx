import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import textura from "../assets/TexturaHQ.png";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";

export default function DetallesAtencion() {
  const navigate = useNavigate();
  const location = useLocation();

  const [fecha, setFecha] = useState(null);
  const [hora, setHora] = useState("14:00");
  const [tipoAtencion, setTipoAtencion] = useState("");
  const [procedimiento, setProcedimiento] = useState("");
  const [registrando, setRegistrando] = useState(false);
  const [moduloNumero, setModuloNumero] = useState("");
  const [codigoqr, setCodigoqr] = useState(null);

  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:4000";

  // Efecto para leer parámetros de la URL
  useEffect(() => {
  if (!location) return;

  try {
    const search = location.search ?? (typeof window !== "undefined" ? window.location.search : "");
    
    // 🔍 DEBUG: Ver la URL completa
    console.log("🔍 URL completa recibida:", window.location.href);
    console.log("🔍 Search string:", search);
    
    const params = new URLSearchParams(search);
    
    // 🔍 DEBUG: Ver TODOS los parámetros
    console.log("🔍 Todos los parámetros:", Object.fromEntries(params.entries()));
    
    const boxName = params.get("boxName");
    const boxId = params.get("boxId");
    const codigoqrParam = params.get("codigoqr") || params.get("codigo_qr");
    const fechaParam = params.get("fecha");
    const horaParam = params.get("hora");

    console.log("✅ Parámetros recibidos:", {
      boxName,
      boxId,
      codigoqrParam,
      fechaParam,
      horaParam,
    });

      // Establecer módulo
      if (boxName) setModuloNumero(boxName);
      else if (boxId) setModuloNumero(boxId);

      // Establecer código QR
      if (codigoqrParam) {
        setCodigoqr(codigoqrParam);
        console.log("✅ codigoqr establecido:", codigoqrParam);
      } else {
        console.warn("⚠️ No se encontró parámetro codigoqr ni codigo_qr");
      }

      // Establecer fecha
      if (fechaParam) {
        const [year, month, day] = fechaParam.split("-").map(Number);
        setFecha(new Date(year, month - 1, day));
        console.log("✅ fecha establecida:", new Date(year, month - 1, day));
      }

      // Establecer hora
      if (horaParam) {
        setHora(horaParam);
        console.log("✅ hora establecida:", horaParam);
      }
    } catch (e) {
      console.error("❌ Error parsing URL params:", e);
    }
  }, [location]);

  const handleRegistrar = async () => {
    if (!fecha) {
      alert("Por favor, selecciona una fecha");
      return;
    }
    if (!hora) {
      alert("Por favor, selecciona una hora");
      return;
    }
    if (!tipoAtencion.trim()) {
      alert("Por favor, ingresa el tipo de atención");
      return;
    }
    if (!procedimiento.trim()) {
      alert("Por favor, describe el procedimiento realizado");
      return;
    }
    if (!codigoqr) {
      alert("⚠️ Error: No se detectó el código QR. Por favor, escanea nuevamente.");
      return;
    }

    setRegistrando(true);

    try {
      const fechaFormateada = fecha.toISOString().split("T")[0];

      const payload = {
        boxName: moduloNumero || "Box Sin Especificar",
        codigoqr: codigoqr,
        fecha: fechaFormateada,
        hora: hora,
        modulo: moduloNumero || null,
        tipoAtencion: tipoAtencion.trim(),
        procedimiento: procedimiento.trim(),
      };

      console.log("📤 Enviando asistencia:", payload);

      const res = await fetch(`${apiBase}/api/attendance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `Error ${res.status}`);
      }

      const data = await res.json();
      console.log("✅ Asistencia registrada:", data);
      alert("✅ Asistencia registrada exitosamente");

      // Limpiar formulario
      setFecha(null);
      setHora("14:00");
      setTipoAtencion("");
      setProcedimiento("");
      setModuloNumero("");
      setCodigoqr(null);

      navigate("/practicante/menu");
    } catch (error) {
      console.error("❌ Error:", error);
      alert(`❌ Error al registrar: ${error.message}`);
    } finally {
      setRegistrando(false);
    }
  };

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
          className="absolute left-4 top-12 -translate-y-12 text-black text-2xl"
        >
          ←
        </button>
        <h2 className="text-gray-800 text-xl font-semibold">
          Detalles Atención
        </h2>
      </div>

      {/* CONTENIDO */}
      <div className="flex-1 px-6 pt-6 pb-8 overflow-y-auto">
        {/* Módulo */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            N° Módulo
          </h3>
          <input
            type="text"
            value={moduloNumero}
            onChange={(e) => setModuloNumero(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 shadow-sm"
            placeholder="Ej: Pediatría"
          />
        </div>

        {/* Código QR */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Código QR {codigoqr ? "✅" : "⚠️"}
          </h3>
          <div
            className={`w-full border-2 rounded-xl px-4 py-3 shadow-sm ${
              codigoqr
                ? "bg-green-50 border-green-500"
                : "bg-red-50 border-red-500"
            }`}
          >
            <p
              className={`font-semibold break-all ${
                codigoqr ? "text-green-700" : "text-red-700"
              }`}
            >
              {codigoqr || "No escaneado - Por favor escanea el QR"}
            </p>
          </div>
        </div>

        {/* Fecha */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Fecha de atención
          </h3>
          <div className="bg-D2C9FF rounded-2xl p-4 shadow-md">
            <DatePicker
              onChange={setFecha}
              value={fecha}
              format="dd/MM/yyyy"
              clearIcon={null}
              calendarIcon={null}
              className="w-full text-gray-800"
            />
          </div>
        </div>

        {/* Hora */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Hora de atención
          </h3>
          <div className="bg-D2C9FF rounded-2xl p-4 shadow-md overflow-visible relative">
            <TimePicker
              onChange={setHora}
              value={hora}
              disableClock={false}
              clearIcon={null}
              format="HH:mm"
              className="w-full text-gray-800 text-lg font-semibold"
            />
          </div>
        </div>

        {/* Tipo de Atención */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Tipo de atención
          </h3>
          <textarea
            rows="2"
            value={tipoAtencion}
            onChange={(e) => setTipoAtencion(e.target.value)}
            placeholder="Ej: Kinesiología respiratoria"
            className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 shadow-sm"
          />
        </div>

        {/* Procedimiento */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Procedimiento
          </h3>
          <textarea
            rows="3"
            value={procedimiento}
            onChange={(e) => setProcedimiento(e.target.value)}
            placeholder="Describe el procedimiento realizado..."
            className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 shadow-sm"
          />
        </div>

        {/* Botón Registrar */}
        <button
          onClick={handleRegistrar}
          disabled={registrando || !codigoqr}
          className="w-full py-3 bg-1E6176 text-white text-lg font-semibold rounded-xl shadow-md active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed mb-10"
        >
          {registrando ? "Registrando..." : "Registrar"}
        </button>
      </div>
    </div>
  );
}
