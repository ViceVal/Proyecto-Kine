/**
 * DetalleConsulta.jsx
 * Pantalla que muestra el detalle completo de una consulta seleccionada
 * 
 * Funcionalidad:
 * - Muestra información completa: N° módulo, tipo de atención, procedimiento, fecha, hora
 * - Visualiza retroalimentación previa si existe
 * - Botón para enviar/editar corrección que lleva a la pantalla de retroalimentación
 * - Indicador visual si la consulta ya tiene retroalimentación
 * 
 * Datos que recibe:
 * - consulta: objeto con toda la información de la consulta
 * - practicante: objeto con información del practicante
 * 
 * @author Joshua - Frontend Supervisor
 * @date Noviembre 2025
 */

import { useNavigate, useLocation } from "react-router-dom";
import textura from "../assets/TexturaHQ.png";

export default function DetalleConsulta() {
  const navigate = useNavigate();
  const location = useLocation();
  const consulta = location.state?.consulta || {};
  const practicante = location.state?.practicante || {};

  const formatearFecha = (fecha) => {
    if (!fecha) return "";
    const [year, month, day] = fecha.split("-");
    return `${day}/${month}/${year}`;
  };

  const handleEnviarCorreccion = () => {
    navigate("/retroalimentacion", { state: { consulta, practicante } });
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
      <div className="relative w-full bg-[#B3CCFA] py-4 text-center shadow">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-5 top-1/2 -translate-y-1/2 text-black text-2xl"
        >
          ←
        </button>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">KineApp</h1>
        <h2 className="text-gray-700 text-sm font-semibold">
          Detalle de Consulta
        </h2>
      </div>

      {/* CONTENIDO */}
      <div className="flex-1 px-6 pt-6 pb-8 overflow-y-auto">
        
        {/* Información del practicante */}
        <div className="bg-white/90 rounded-xl p-4 shadow-md mb-6">
          <p className="text-gray-600 text-sm">Practicante</p>
          <h3 className="text-xl font-bold text-gray-900">
            {practicante.nombre} {practicante.apellido}
          </h3>
        </div>

        {/* Información de la consulta */}
        <div className="bg-white/90 rounded-xl p-5 shadow-md mb-6">
          <h4 className="text-gray-800 font-bold mb-4 text-lg border-b pb-2">
            Información de la Atención
          </h4>
          
          <div className="space-y-4">
            {/* Fecha y hora */}
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600 font-semibold">Fecha:</span>
              <span className="text-gray-900 font-bold">{formatearFecha(consulta.fecha)}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600 font-semibold">Hora:</span>
              <span className="text-gray-900 font-bold">{consulta.hora}</span>
            </div>

            {/* Módulo */}
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600 font-semibold">N° Módulo:</span>
              <span className="text-gray-900 font-bold">{consulta.modulo}</span>
            </div>

            {/* Tipo de atención */}
            <div className="py-2 border-b border-gray-200">
              <span className="text-gray-600 font-semibold block mb-1">Tipo de Atención:</span>
              <span className="text-gray-900 font-bold">{consulta.tipoAtencion}</span>
            </div>

            {/* Procedimiento */}
            <div className="py-2">
              <span className="text-gray-600 font-semibold block mb-1">Procedimiento:</span>
              <span className="text-gray-900">{consulta.procedimiento}</span>
            </div>
          </div>
        </div>

        {/* Retroalimentación existente (si existe) */}
        {consulta.retroalimentacion && (
          <div className="bg-green-50/90 border-2 border-green-300 rounded-xl p-5 shadow-md mb-6">
            <h4 className="text-green-800 font-bold mb-3 flex items-center">
              <span className="text-xl mr-2">✓</span>
              Retroalimentación Enviada
            </h4>
            <p className="text-gray-700 italic">
              "{consulta.retroalimentacion}"
            </p>
          </div>
        )}

        {/* Botón de corrección */}
        <button
          onClick={handleEnviarCorreccion}
          className="w-full py-4 bg-[#1E6176] text-white text-lg font-semibold rounded-xl shadow-md hover:bg-[#164d5e] active:scale-95 transition"
        >
          {consulta.retroalimentacion ? "✏️ Editar Corrección" : "📝 Enviar Retroalimentación"}
        </button>

        {/* Información adicional */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            La retroalimentación será enviada al practicante
          </p>
        </div>
      </div>
    </div>
  );
}
