import { useNavigate } from "react-router-dom";
import { useState } from "react";
import textura from "../assets/TexturaHQ.png";

export default function Historial() {
  const navigate = useNavigate();
  const [vista, setVista] = useState("lista");

  const historial = [
    {
      fecha: "12/03/2025",
      hora: "20:00",
      tipo: "Kinesiología general",
      procedimiento: "Evaluación inicial",
      modulo: "4"
    },
    {
      fecha: "14/03/2025",
      hora: "18:30",
      tipo: "Terapia respiratoria",
      procedimiento: "Ejercicios guiados",
      modulo: "2"
    },
    {
      fecha: "17/03/2025",
      hora: "10:15",
      tipo: "Rehabilitación motora",
      procedimiento: "Trabajo de marcha",
      modulo: "1"
    }
  ];

  return (
    <div
      className="min-h-screen w-full flex flex-col"
      style={{
        backgroundImage: `url(${textura})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* HEADER estilo KineApp */}
      <div className="relative w-full bg-[#B3CCFA] py-6 text-center shadow">

        {/* Flecha atrás */}
        <button
          onClick={() => navigate(-1)}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-black text-2xl"
        >
          ←
        </button>

        {/* Título y subtítulo */}
        <h1 className="text-3xl font-bold text-gray-900 mb-1">KineApp</h1>
        <h2 className="text-gray-700 text-sm font-semibold">Historial</h2>

        {/* Botón cambiar vista */}
        <button
          onClick={() => setVista(vista === "lista" ? "grid" : "lista")}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-black text-2xl"
        >
          ▦
        </button>
      </div>

      {/* CONTENIDO */}
      <div className="flex-1 px-6 pt-4 overflow-y-auto pb-8">

        {/* LISTA */}
        {vista === "lista" && (
          <div className="flex flex-col gap-6">
            {historial.map((item, index) => (
              <div key={index}>
                <h3 className="text-lg font-semibold text-gray-900">
                  {item.fecha}
                </h3>
                <p className="text-gray-600 -mt-1 mb-2">{item.hora}</p>

                <div className="bg-white/80 rounded-xl p-4 shadow space-y-1">
                  <p className="text-gray-900 font-bold">{item.tipo}</p>
                  <p className="text-gray-600 text-sm">{item.procedimiento}</p>
                  <p className="text-gray-600 text-sm">
                    <span className="font-semibold">Módulo:</span> {item.modulo}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* GRID */}
        {vista === "grid" && (
          <div className="grid grid-cols-2 gap-4">
            {historial.map((item, index) => (
              <div
                key={index}
                className="bg-white/80 rounded-xl p-4 shadow h-fit space-y-1"
              >
                <p className="text-gray-700 font-semibold">{item.fecha}</p>
                <p className="text-gray-500 text-sm">{item.hora}</p>

                <p className="text-gray-900 font-bold">{item.tipo}</p>
                <p className="text-gray-600 text-sm">{item.procedimiento}</p>
                <p className="text-gray-600 text-sm">
                  <span className="font-semibold">Módulo:</span> {item.modulo}
                </p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
