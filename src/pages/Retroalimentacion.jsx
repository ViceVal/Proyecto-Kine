/**
 * Retroalimentacion.jsx
 * Pantalla para que el supervisor envíe retroalimentación al practicante
 * 
 * Funcionalidad:
 * - Formulario de texto con límite de 500 caracteres para escribir observaciones
 * - Contador de caracteres restantes
 * - Botón APROBAR: aprueba la consulta (puede incluir comentarios opcionales)
 * - Botón RECHAZAR: rechaza la consulta (requiere comentarios obligatorios)
 * - Pop-up de confirmación al aprobar mostrando los comentarios
 * - Pop-up de confirmación al rechazar mostrando el motivo del rechazo
 * - Validación: no permite rechazar sin escribir comentarios
 * - Sugerencias para redactar buena retroalimentación
 * 
 * Datos que recibe:
 * - consulta: objeto con información de la consulta a revisar
 * - practicante: objeto con información del practicante
 * 
 * Estados:
 * - aprobada: consulta aprobada con/sin comentarios
 * - rechazada: consulta rechazada con comentarios obligatorios
 * 
 * @author Joshua - Frontend Supervisor
 * @date Noviembre 2025
 */

import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import textura from "../assets/TexturaHQ.png";

export default function Retroalimentacion() {
  const navigate = useNavigate();
  const location = useLocation();
  const consulta = location.state?.consulta || {};
  const practicante = location.state?.practicante || {};

  const [retroalimentacion, setRetroalimentacion] = useState(consulta.retroalimentacion || "");
  const [caracteresRestantes, setCaracteresRestantes] = useState(500 - (consulta.retroalimentacion?.length || 0));
  const [mostrarPopupAprobar, setMostrarPopupAprobar] = useState(false);
  const [mostrarPopupRechazar, setMostrarPopupRechazar] = useState(false);

  const handleTextoChange = (e) => {
    const texto = e.target.value;
    if (texto.length <= 500) {
      setRetroalimentacion(texto);
      setCaracteresRestantes(500 - texto.length);
    }
  };

  const handleAprobar = () => {
    setMostrarPopupAprobar(true);
  };

  const handleRechazar = () => {
    if (retroalimentacion.trim().length === 0) {
      alert("⚠️ Debes escribir comentarios al rechazar una consulta");
      return;
    }
    setMostrarPopupRechazar(true);
  };

  const confirmarAprobar = () => {
    // Aquí se conectaría con el backend
    console.log("Aprobando consulta:", {
      consultaId: consulta.id,
      practicanteId: practicante.id,
      estado: "aprobada",
      retroalimentacion: retroalimentacion
    });

    setMostrarPopupAprobar(false);
    alert("✅ Consulta aprobada correctamente");
    navigate("/consultas-practicante", { state: { practicante } });
  };

  const confirmarRechazar = () => {
    // Aquí se conectaría con el backend
    console.log("Rechazando consulta:", {
      consultaId: consulta.id,
      practicanteId: practicante.id,
      estado: "rechazada",
      retroalimentacion: retroalimentacion
    });

    setMostrarPopupRechazar(false);
    alert("❌ Consulta rechazada. Se notificará al practicante.");
    navigate("/consultas-practicante", { state: { practicante } });
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "";
    const [year, month, day] = fecha.split("-");
    return `${day}/${month}/${year}`;
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
          Retroalimentación
        </h2>
      </div>

      {/* CONTENIDO */}
      <div className="flex-1 px-6 pt-6 pb-8 overflow-y-auto">
        
        {/* Información resumida */}
        <div className="bg-white/90 rounded-xl p-4 shadow-md mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                {practicante.nombre} {practicante.apellido}
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                {formatearFecha(consulta.fecha)} - {consulta.hora}
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-600 text-sm">Módulo</p>
              <p className="text-gray-900 font-bold text-xl">{consulta.modulo}</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-gray-700 font-semibold text-sm">{consulta.tipoAtencion}</p>
            <p className="text-gray-600 text-sm">{consulta.procedimiento}</p>
          </div>
        </div>

        {/* Área de texto para retroalimentación */}
        <div className="bg-white/90 rounded-xl p-5 shadow-md mb-6">
          <label className="block text-gray-800 font-bold mb-3">
            Observaciones y comentarios:
          </label>
          
          <textarea
            value={retroalimentacion}
            onChange={handleTextoChange}
            placeholder="Escribe aquí tus observaciones, correcciones y sugerencias para el practicante..."
            className="w-full h-48 px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-[#1E6176] focus:outline-none resize-none bg-white"
            maxLength={500}
          />
          
          <div className="flex justify-between items-center mt-2">
            <p className="text-gray-600 text-sm">
              Máximo 500 caracteres
            </p>
            <p className={`text-sm font-semibold ${caracteresRestantes < 50 ? 'text-red-600' : 'text-gray-600'}`}>
              {caracteresRestantes} restantes
            </p>
          </div>
        </div>

        {/* Sugerencias rápidas */}
        <div className="bg-blue-50/90 rounded-xl p-4 shadow-md mb-6">
          <h4 className="text-blue-900 font-semibold mb-2 text-sm">
            💡 Sugerencias para una buena retroalimentación:
          </h4>
          <ul className="text-blue-800 text-xs space-y-1 list-disc list-inside">
            <li>Sea específico/a sobre qué mejorar</li>
            <li>Destaque los aspectos positivos</li>
            <li>Sugiera acciones concretas</li>
            <li>Use un tono constructivo y profesional</li>
          </ul>
        </div>

        {/* Botones de acción */}
        <div className="space-y-3">
          {/* Botón Aprobar */}
          <button
            onClick={handleAprobar}
            className="w-full py-4 bg-green-600 text-white text-lg font-semibold rounded-xl shadow-md hover:bg-green-700 active:scale-95 transition"
          >
            ✅ Aprobar Consulta
          </button>

          {/* Botón Rechazar */}
          <button
            onClick={handleRechazar}
            className="w-full py-4 bg-red-600 text-white text-lg font-semibold rounded-xl shadow-md hover:bg-red-700 active:scale-95 transition"
          >
            ❌ Rechazar Consulta
          </button>

          {/* Botón Cancelar */}
          <button
            onClick={() => navigate(-1)}
            className="w-full py-3 bg-gray-500 text-white font-semibold rounded-xl shadow-md hover:bg-gray-600 active:scale-95 transition"
          >
            Cancelar
          </button>
        </div>
      </div>

      {/* POPUP DE CONFIRMACIÓN - APROBAR */}
      {mostrarPopupAprobar && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-6">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fadeUp">
            <div className="text-center mb-4">
              <div className="text-6xl mb-3">✅</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                ¿Aprobar esta consulta?
              </h3>
              <p className="text-gray-600 text-sm">
                Se notificará al practicante que su consulta ha sido aprobada.
              </p>
              {retroalimentacion.trim() && (
                <div className="mt-4 bg-gray-50 rounded-lg p-3 text-left">
                  <p className="text-xs text-gray-500 font-semibold mb-1">Comentarios:</p>
                  <p className="text-sm text-gray-700 italic">"{retroalimentacion}"</p>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <button
                onClick={confirmarAprobar}
                className="w-full py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 active:scale-95 transition"
              >
                Sí, Aprobar
              </button>
              <button
                onClick={() => setMostrarPopupAprobar(false)}
                className="w-full py-3 bg-gray-300 text-gray-800 font-semibold rounded-xl hover:bg-gray-400 active:scale-95 transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP DE CONFIRMACIÓN - RECHAZAR */}
      {mostrarPopupRechazar && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-6">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fadeUp">
            <div className="text-center mb-4">
              <div className="text-6xl mb-3">⚠️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                ¿Rechazar esta consulta?
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                El practicante recibirá una notificación con tus observaciones.
              </p>
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3 text-left">
                <p className="text-xs text-red-700 font-semibold mb-1">Motivo del rechazo:</p>
                <p className="text-sm text-gray-800 italic">"{retroalimentacion}"</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <button
                onClick={confirmarRechazar}
                className="w-full py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 active:scale-95 transition"
              >
                Sí, Rechazar
              </button>
              <button
                onClick={() => setMostrarPopupRechazar(false)}
                className="w-full py-3 bg-gray-300 text-gray-800 font-semibold rounded-xl hover:bg-gray-400 active:scale-95 transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
