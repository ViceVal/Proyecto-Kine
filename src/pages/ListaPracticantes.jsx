/**
 * ListaPracticantes.jsx
 * Pantalla que muestra la lista de todos los practicantes de kinesiología
 * 
 * Funcionalidad:
 * - Muestra lista completa de practicantes con contador de consultas
 * - Barra de búsqueda en tiempo real para filtrar practicantes
 * - Al seleccionar un practicante, navega a sus consultas
 * - Muestra contador de practicantes encontrados vs total
 * 
 * @author Joshua - Frontend Supervisor
 * @date Noviembre 2025
 */

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import textura from "../assets/TexturaHQ.png";

export default function ListaPracticantes() {
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState("");

  // Datos de ejemplo de practicantes (se reemplazará con datos reales del backend)
  const practicantes = [
    { id: 1, nombre: "Juan", apellido: "Pérez", consultas: 15 },
    { id: 2, nombre: "María", apellido: "López", consultas: 23 },
    { id: 3, nombre: "Carlos", apellido: "González", consultas: 8 },
    { id: 4, nombre: "Ana", apellido: "Martínez", consultas: 19 },
    { id: 5, nombre: "Luis", apellido: "Rodríguez", consultas: 12 },
    { id: 6, nombre: "Carmen", apellido: "Fernández", consultas: 27 },
  ];

  // Filtrar practicantes según búsqueda
  const practicantesFiltrados = practicantes.filter((p) =>
    `${p.nombre} ${p.apellido}`.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleSeleccionarPracticante = (practicante) => {
    // Navegar a la pantalla de consultas pasando el practicante
    navigate("/consultas-practicante", { state: { practicante } });
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
          Lista de Practicantes
        </h2>
      </div>

      {/* CONTENIDO */}
      <div className="flex-1 px-6 pt-6 pb-8 overflow-y-auto">
        
        {/* Barra de búsqueda */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="🔍 Buscar practicante..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-[#1E6176] focus:outline-none bg-white/90 shadow-sm"
          />
        </div>

        {/* Lista de practicantes */}
        <div className="space-y-4">
          {practicantesFiltrados.length > 0 ? (
            practicantesFiltrados.map((practicante) => (
              <div
                key={practicante.id}
                onClick={() => handleSeleccionarPracticante(practicante)}
                className="bg-white/90 rounded-xl p-5 shadow-md hover:shadow-lg active:scale-98 transition cursor-pointer"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {practicante.nombre} {practicante.apellido}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      Total de consultas: <span className="font-semibold">{practicante.consultas}</span>
                    </p>
                  </div>
                  <div className="text-[#1E6176] text-2xl">
                    →
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white/90 rounded-xl p-8 shadow-md text-center">
              <p className="text-gray-600">
                No se encontraron practicantes
              </p>
            </div>
          )}
        </div>

        {/* Contador total */}
        <div className="mt-6 text-center">
          <p className="text-gray-700 text-sm">
            Mostrando {practicantesFiltrados.length} de {practicantes.length} practicantes
          </p>
        </div>
      </div>
    </div>
  );
}
