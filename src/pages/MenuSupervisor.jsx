/**
 * MenuSupervisor.jsx
 * Pantalla principal del supervisor de kinesiología
 */

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import textura from "../assets/TexturaHQ.png";

// Función para corregir caracteres corruptos comunes
const fixEncoding = (text) => {
  if (!text) return text;
  return text
    .replace(/Mar¡a/gi, 'María')
    .replace(/Gonz lez/gi, 'González')
    .replace(/Gonz.lez/gi, 'González')
    .replace(/Mart¡nez/gi, 'Martínez')
    .replace(/Mart.nez/gi, 'Martínez')
    .replace(/Jos‚/gi, 'José')
    .replace(/Jos./gi, 'José')
    .replace(/Andr‚s/gi, 'Andrés')
    .replace(/P‚rez/gi, 'Pérez')
    .replace(/Fern ndez/gi, 'Fernández')
    .replace(/L¢pez/gi, 'López')
    .replace(/S nchez/gi, 'Sánchez')
    // Patrones generales de vocales con acentos corruptos
    .replace(/([A-Z][a-z]*) ([a-z])/g, (match, p1, p2) => {
      // Si hay un espacio sospechoso entre mayúscula y minúscula
      const fixes = {
        'a': 'á', 'e': 'é', 'i': 'í', 'o': 'ó', 'u': 'ú'
      };
      return p1 + (fixes[p2] || p2);
    });
};

export default function MenuSupervisor() {
  const navigate = useNavigate();

  // Estado para usuario logueado
  const [usuario, setUsuario] = useState(null);

  // Estado para el popup de cierre de sesión
  const [mostrarPopupLogout, setMostrarPopupLogout] = useState(false);

  useEffect(() => {
    // Obtener usuario de localStorage o sessionStorage
    const userStorage = localStorage.getItem('kineapp_user') || sessionStorage.getItem('kineapp_user');
    
    if (userStorage) {
      try {
        const userData = JSON.parse(userStorage);
        setUsuario(userData);
        
        // Si el usuario es practicante, redirigir a su menú
        if (userData.rol === 'practicante') {
          navigate('/practicante/menu');
        }
      } catch (error) {
        console.error('Error al parsear usuario:', error);
        navigate('/login');
      }
    } else {
      // Si no hay usuario, redirigir al login
      navigate('/login');
    }
  }, [navigate]);

  const handleCerrarSesion = () => {
    setMostrarPopupLogout(true);
  };

  const confirmarCerrarSesion = () => {
    // Limpiar sesión
    localStorage.removeItem('kineapp_user');
    sessionStorage.removeItem('kineapp_user');
    setMostrarPopupLogout(false);
    navigate("/login");
  };

  // Mostrar loading mientras se carga el usuario
  if (!usuario) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

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
      <div className="relative w-full bg-[#B3CCFA] py-6 text-center shadow">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">KineApp</h1>
        <h2 className="text-gray-700 text-sm font-semibold">Menú Supervisor</h2>
      </div>

      {/* CONTENIDO */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">

        {/* Texto de bienvenida */}
        <div className="bg-white/90 rounded-2xl shadow-lg p-8 w-full max-w-md mb-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            ¡Bienvenido/a!
          </h3>
          <p className="text-lg text-gray-700">
            {fixEncoding(usuario?.nombre) || usuario?.username || 'Supervisor'}
          </p>
          {usuario?.username && (
            <p className="text-sm text-gray-500 mt-1">@{usuario.username}</p>
          )}
        </div>

        {/* CONTENEDOR DE LOS BOTONES */}
        <div className="bg-white/90 rounded-2xl shadow-md p-6 w-full max-w-md space-y-4">

          {/* Botón: Ver agenda */}
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

          {/* Botón: Generador de QR */}
          <button
            onClick={() => navigate("/generador-qr")}
            className="w-full py-4 bg-[#6C5CE7] text-white text-lg font-semibold rounded-xl shadow-md hover:bg-[#5a48cc] active:scale-95 transition"
          >
            🔳 Generar QR para Box
          </button>

          {/* Botón: Cerrar sesión */}
          <button
            onClick={handleCerrarSesion}
            className="w-full py-4 bg-gray-600 text-white text-lg font-semibold
                       rounded-xl shadow-md hover:bg-gray-700 active:scale-95 transition"
          >
            Cerrar Sesión
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-700 text-sm">
            Supervisión y retroalimentación de prácticas
          </p>
        </div>
      </div>

      {/* POPUP DE CONFIRMACIÓN - CERRAR SESIÓN */}
      {mostrarPopupLogout && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-6">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fadeUp">
            <div className="text-center mb-4">
              <div className="text-6xl mb-3">⚠️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                ¿Estás seguro que deseas cerrar sesión?
              </h3>
              <p className="text-gray-600 text-sm">
                Serás redirigido al inicio de sesión.
              </p>
            </div>

            <div className="space-y-2">
              <button
                onClick={confirmarCerrarSesion}
                className="w-full py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 active:scale-95 transition"
              >
                Sí, Cerrar Sesión
              </button>

              <button
                onClick={() => setMostrarPopupLogout(false)}
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
