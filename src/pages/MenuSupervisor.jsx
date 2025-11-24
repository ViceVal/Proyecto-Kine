/**
 * MenuSupervisor.jsx
 * Pantalla principal del supervisor de kinesiología
 * 
 * Funcionalidad:
 * - Muestra mensaje de bienvenida personalizado con nombre del supervisor
 * - Botones para agenda, cierre de sesión y registro
 * 
 * @author Joshua
 * @date Noviembre 2025
 */

import { useNavigate } from "react-router-dom";
import textura from "../assets/TexturaHQ.png";

export default function MenuSupervisor() {
  const navigate = useNavigate();

  // Datos del supervisor (se reemplazará con datos reales)
  const nombreSupervisor = "Dra. María";
  const apellidoSupervisor = "González";

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
        <h1 className="text-2xl font-bold text-gray-900 mb-1">KineApp</h1>
        <h2 className="text-gray-700 text-sm font-semibold">
          Menú Supervisor
        </h2>
      </div>

      {/* CONTENIDO */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">

        {/* Texto de bienvenida */}
        <div className="bg-white/90 rounded-2xl shadow-lg p-8 w-full max-w-md mb-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            ¡Bienvenido/a!
          </h3>
          <p className="text-lg text-gray-700">
            {nombreSupervisor} {apellidoSupervisor}
          </p>
        </div>

        {/* CONTENEDOR DE LOS 3 BOTONES */}
        <div className="bg-white/90 rounded-2xl shadow-md p-6 w-full max-w-md space-y-4">

          {/* Botón: Ver agenda de practicantes */}
          <button
            onClick={() => navigate("/lista-practicantes")}
            className="w-full py-4 bg-[#1E6176] text-white text-lg font-semibold 
                       rounded-xl shadow-md hover:bg-[#164d5e] active:scale-95 transition"
          >
            Ver Agenda de Practicantes
          </button>

          {/* Botón: Registrar */}
          <button
            onClick={() => navigate("/registro")}
            className="w-full py-4 bg-white text-[#1E6176] border-2 border-[#1E6176] 
                       text-lg font-semibold rounded-xl shadow-md 
                       hover:bg-[#f0faff] active:scale-95 transition"
          >
            Registrar
          </button>

          {/* Botón: Cerrar sesión */}
          <button
            onClick={() => navigate("/login")}
            className="w-full py-4 bg-gray-600 text-white text-lg font-semibold 
                       rounded-xl shadow-md hover:bg-gray-700 active:scale-95 transition"
          >
            Cerrar Sesión
          </button>
          
        </div>

        {/* Información adicional */}
        <div className="mt-8 text-center">
          <p className="text-gray-700 text-sm">
            Supervisión y retroalimentación de prácticas
          </p>
        </div>

      </div>
    </div>
  );
}
