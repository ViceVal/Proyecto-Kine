import { useNavigate } from "react-router-dom";
import { useState } from "react";
import textura from "../assets/TexturaHQ.png";
import { verifyAssistance } from "../services/assistanceService";

// Función ejemplo para verificar asistencia
const handleVerifyAssistance = async () => {
  try {
    const pacienteId = "paciente_123";
    const practicanteId = "practicante_456";
    const timestamp = new Date().toISOString();
    const notas = "Asistencia verificada";
    
    const response = await verifyAssistance(pacienteId, practicanteId, timestamp, notas);
    if (response.success) {
      console.log("Asistencia verificada:", response.message);
    } else {
      console.error("Error al verificar asistencia:", response.message);
    }
  } catch (error) {
    console.error("Error al verificar asistencia:", error);
  }
};

export default function MenuPracticante() {
  const navigate = useNavigate();

  // Datos temporales
  const nombre = "Nombre";
  const apellido = "Apellido";

  // Estado para popup de cerrar sesión
  const [mostrarPopupLogout, setMostrarPopupLogout] = useState(false);

  const handleCerrarSesion = () => {
    setMostrarPopupLogout(true);
  };

  const confirmarCerrarSesion = () => {
    setMostrarPopupLogout(false);
    navigate("/login");
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
      <div className="relative w-full bg-[#B3CCFA] py-6 text-center shadow">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">KineApp</h1>
        <h2 className="text-gray-700 text-sm font-semibold">Menú Practicante</h2>
      </div>

      {/* CONTENIDO */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">

        {/* Caja de bienvenida */}
        <div className="bg-white/90 rounded-2xl shadow-lg p-8 w-full max-w-md mb-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">¡Bienvenido/a!</h3>
          <p className="text-lg text-gray-700">{nombre} {apellido}</p>
        </div>

        {/* CONTENEDOR DE BOTONES */}
        <div className="bg-white/90 rounded-2xl shadow-md p-6 w-full max-w-md space-y-4">

          {/* Registro paciente */}
          <button
            onClick={() => navigate("/practicante/scan")}
            className="w-full py-4 bg-[#1E6176] text-white text-lg font-semibold
                       rounded-xl shadow-md hover:bg-[#164d5e] active:scale-95 transition"
          >
            Registro paciente
          </button>

          {/* Ingresar paciente */}
          <button
            onClick={() => navigate("/detalles-atencion")}
            className="w-full py-4 bg-white text-[#1E6176] border-2 border-[#1E6176]
                       text-lg font-semibold rounded-xl shadow-md
                       hover:bg-[#f0faff] active:scale-95 transition"
          >
            Ingresar paciente
          </button>

          {/* Historial */}
          <button
            onClick={() => navigate("/historial")}
            className="w-full py-4 bg-white text-[#1E6176] border-2 border-[#1E6176]
                       text-lg font-semibold rounded-xl shadow-md
                       hover:bg-[#f0faff] active:scale-95 transition"
          >
            Ver historial
          </button>

          {/* Cerrar sesión */}
          <button
            onClick={handleCerrarSesion}
            className="w-full py-4 bg-gray-600 text-white text-lg font-semibold
                       rounded-xl shadow-md hover:bg-gray-700 active:scale-95 transition"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* POPUP CONFIRMACIÓN - CERRAR SESIÓN */}
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
