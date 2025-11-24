/**
 * ConsultasPracticante.jsx
 * Pantalla para visualizar y filtrar consultas de un practicante específico
 * 
 * Funcionalidad:
 * - Selector de rango de fechas (desde/hasta) para filtrar consultas
 * - Validación de fechas (la fecha 'hasta' debe ser posterior a 'desde')
 * - Muestra consultas filtradas con badges de estado (Revisada/Pendiente)
 * - Al seleccionar una consulta, navega al detalle completo
 * - Contador de resultados encontrados
 * 
 * Datos que recibe:
 * - practicante: objeto con información del practicante seleccionado
 * 
 * @author Joshua - Frontend Supervisor
 * @date Noviembre 2025
 */

import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import textura from "../assets/TexturaHQ.png";

export default function ConsultasPracticante() {
  const navigate = useNavigate();
  const location = useLocation();
  const practicante = location.state?.practicante || { nombre: "Desconocido", apellido: "" };

  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [consultasFiltradas, setConsultasFiltradas] = useState([]);
  const [mostrarResultados, setMostrarResultados] = useState(false);

  // Datos de ejemplo de consultas (se reemplazará con datos reales del backend)
  const todasLasConsultas = [
    {
      id: 1,
      fecha: "2025-09-05",
      hora: "10:30",
      modulo: "3",
      tipoAtencion: "Kinesiología general",
      procedimiento: "Evaluación inicial del paciente, medición de rangos articulares",
      retroalimentacion: null
    },
    {
      id: 2,
      fecha: "2025-09-12",
      hora: "14:00",
      modulo: "2",
      tipoAtencion: "Terapia respiratoria",
      procedimiento: "Ejercicios de respiración profunda y espirometría incentivada",
      retroalimentacion: "Muy buen trabajo, mantener la técnica aplicada"
    },
    {
      id: 3,
      fecha: "2025-09-18",
      hora: "09:15",
      modulo: "1",
      tipoAtencion: "Rehabilitación motora",
      procedimiento: "Ejercicios de marcha y entrenamiento de equilibrio",
      retroalimentacion: null
    },
    {
      id: 4,
      fecha: "2025-09-25",
      hora: "16:45",
      modulo: "4",
      tipoAtencion: "Kinesiología deportiva",
      procedimiento: "Evaluación de lesión en rodilla derecha, vendaje funcional",
      retroalimentacion: null
    },
    {
      id: 5,
      fecha: "2025-10-02",
      hora: "11:00",
      modulo: "2",
      tipoAtencion: "Terapia manual",
      procedimiento: "Masaje terapéutico en zona lumbar y estiramiento muscular",
      retroalimentacion: "Mejorar postura al realizar el masaje"
    },
    {
      id: 6,
      fecha: "2025-10-08",
      hora: "15:30",
      modulo: "3",
      tipoAtencion: "Electroterapia",
      procedimiento: "Aplicación de TENS en zona cervical",
      retroalimentacion: null
    },
    {
      id: 7,
      fecha: "2025-10-15",
      hora: "10:00",
      modulo: "1",
      tipoAtencion: "Kinesiología neurológica",
      procedimiento: "Ejercicios de coordinación y propiocepción",
      retroalimentacion: null
    },
    {
      id: 8,
      fecha: "2025-10-22",
      hora: "13:45",
      modulo: "4",
      tipoAtencion: "Kinesiología pediátrica",
      procedimiento: "Sesión de psicomotricidad y estimulación temprana",
      retroalimentacion: "Excelente manejo con el paciente pediátrico"
    },
    {
      id: 9,
      fecha: "2025-10-29",
      hora: "09:30",
      modulo: "2",
      tipoAtencion: "Rehabilitación postquirúrgica",
      procedimiento: "Movilización pasiva de hombro post cirugía de manguito rotador",
      retroalimentacion: null
    },
    {
      id: 10,
      fecha: "2025-11-05",
      hora: "14:15",
      modulo: "3",
      tipoAtencion: "Kinesiología geriátrica",
      procedimiento: "Ejercicios de fortalecimiento y prevención de caídas",
      retroalimentacion: null
    },
    {
      id: 11,
      fecha: "2025-11-12",
      hora: "11:30",
      modulo: "1",
      tipoAtencion: "Terapia ocupacional",
      procedimiento: "Entrenamiento de actividades de la vida diaria",
      retroalimentacion: null
    },
    {
      id: 12,
      fecha: "2025-11-19",
      hora: "16:00",
      modulo: "4",
      tipoAtencion: "Kinesiología traumatológica",
      procedimiento: "Rehabilitación de esguince de tobillo grado II",
      retroalimentacion: "Revisar protocolo de vendaje, consultar bibliografía actualizada"
    },
  ];

  const handleBuscarConsultas = () => {
    if (!fechaDesde || !fechaHasta) {
      alert("Por favor, selecciona ambas fechas");
      return;
    }

    if (new Date(fechaHasta) < new Date(fechaDesde)) {
      alert("La fecha 'Hasta' debe ser posterior a la fecha 'Desde'");
      return;
    }

    const resultados = todasLasConsultas.filter((consulta) => {
      const fechaConsulta = new Date(consulta.fecha);
      const desde = new Date(fechaDesde);
      const hasta = new Date(fechaHasta);
      return fechaConsulta >= desde && fechaConsulta <= hasta;
    });

    setConsultasFiltradas(resultados);
    setMostrarResultados(true);
  };

  const handleSeleccionarConsulta = (consulta) => {
    navigate("/detalle-consulta", { state: { consulta, practicante } });
  };

  const formatearFecha = (fecha) => {
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
          Consultas de {practicante.nombre}
        </h2>
      </div>

      {/* CONTENIDO */}
      <div className="flex-1 px-6 pt-6 pb-8 overflow-y-auto">
        
        {/* Información del practicante */}
        <div className="bg-white/90 rounded-xl p-4 shadow-md mb-6">
          <h3 className="text-xl font-bold text-gray-900">
            {practicante.nombre} {practicante.apellido}
          </h3>
          <p className="text-gray-600 text-sm mt-1">
            Practicante de Kinesiología
          </p>
        </div>

        {/* Selector de fechas */}
        <div className="bg-white/90 rounded-xl p-5 shadow-md mb-6">
          <h4 className="text-gray-800 font-semibold mb-4">
            Seleccionar período de consultas
          </h4>
          
          <div className="space-y-4">
            {/* Fecha desde */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Desde:
              </label>
              <input
                type="date"
                value={fechaDesde}
                onChange={(e) => setFechaDesde(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:border-[#1E6176] focus:outline-none"
              />
            </div>

            {/* Fecha hasta */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Hasta:
              </label>
              <input
                type="date"
                value={fechaHasta}
                onChange={(e) => setFechaHasta(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:border-[#1E6176] focus:outline-none"
              />
            </div>

            {/* Botón buscar */}
            <button
              onClick={handleBuscarConsultas}
              className="w-full py-3 bg-[#1E6176] text-white font-semibold rounded-xl shadow-md hover:bg-[#164d5e] active:scale-95 transition"
            >
              Buscar Consultas
            </button>
          </div>
        </div>

        {/* Resultados de consultas */}
        {mostrarResultados && (
          <div>
            <h4 className="text-gray-800 font-bold mb-3 text-lg">
              Resultados ({consultasFiltradas.length})
            </h4>
            
            {consultasFiltradas.length > 0 ? (
              <div className="space-y-4">
                {consultasFiltradas.map((consulta) => (
                  <div
                    key={consulta.id}
                    onClick={() => handleSeleccionarConsulta(consulta)}
                    className="bg-white/90 rounded-xl p-4 shadow-md hover:shadow-lg active:scale-98 transition cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-gray-900 font-bold text-lg">
                          {formatearFecha(consulta.fecha)}
                        </p>
                        <p className="text-gray-600 text-sm">{consulta.hora}</p>
                      </div>
                      {consulta.retroalimentacion ? (
                        <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                          ✓ Revisada
                        </span>
                      ) : (
                        <span className="bg-yellow-100 text-yellow-700 text-xs font-semibold px-3 py-1 rounded-full">
                          ⏳ Pendiente
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-gray-900 font-semibold">
                        {consulta.tipoAtencion}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {consulta.procedimiento}
                      </p>
                      <p className="text-gray-600 text-sm">
                        <span className="font-semibold">Módulo:</span> {consulta.modulo}
                      </p>
                    </div>
                    
                    <div className="mt-2 text-[#1E6176] text-right font-semibold">
                      Ver detalles →
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white/90 rounded-xl p-8 shadow-md text-center">
                <p className="text-gray-600">
                  No se encontraron consultas en el período seleccionado
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
