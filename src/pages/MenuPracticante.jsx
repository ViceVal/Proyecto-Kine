import { useNavigate } from "react-router-dom";
import textura from "../assets/TexturaHQ.png";
import { verifyAssistance } from '../services/assistanceService';

// Función para verificar asistencia (ejemplo de uso)
const handleVerifyAssistance = async () => {
  try {
    // En una implementación real, estos datos vendrían del contexto de la aplicación
    const pacienteId = 'paciente_123';
    const practicanteId = 'practicante_456';
    const timestamp = new Date().toISOString();
    const notas = 'Asistencia verificada';
    
    const response = await verifyAssistance(pacienteId, practicanteId, timestamp, notas);
    if (response.success) {
      console.log('Asistencia verificada:', response.message);
      // Aquí podrías actualizar el estado de la UI según sea necesario
    } else {
      console.error('Error al verificar asistencia:', response.message);
    }
  } catch (error) {
    console.error('Error al verificar asistencia:', error);
  }
};

export default function MenuPracticante() {
  const navigate = useNavigate();

  // Datos del practicante (luego se reemplaza por data real)
  const nombre = "Nombre";
  const apellido = "Apellido";

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
          Menú Practicante
        </h2>
      </div>

      {/* CONTENIDO */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">

        {/* Caja de bienvenida */}
        <div className="bg-white/90 rounded-2xl shadow-lg p-8 w-full max-w-md mb-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            ¡Bienvenido/a!
          </h3>
          <p className="text-lg text-gray-700">
            {nombre} {apellido}
          </p>
        </div>

        {/* CONTENEDOR DE LOS 3 BOTONES ✔ igual al Supervisor */}
        <div className="bg-white/90 rounded-2xl shadow-md p-6 w-full max-w-md space-y-4">

          {/* PRIMER BOTÓN: Registro paciente */}
          <button
            onClick={() => navigate("/practicante/scan")}
            className="w-full py-4 bg-[#1E6176] text-white text-lg font-semibold
                       rounded-xl shadow-md hover:bg-[#164d5e] active:scale-95 transition"
          >
            Registro paciente
          </button>

          {/* SEGUNDO BOTÓN: IGUAL AL "Ver Agenda…" del supervisor */}
          <button
            onClick={() => navigate("/detalles-atencion")}
            className="w-full py-4 bg-white text-[#1E6176] border-2 border-[#1E6176]
                       text-lg font-semibold rounded-xl shadow-md
                       hover:bg-[#f0faff] active:scale-95 transition"
          >
            Ingresar paciente
          </button>

          {/* TERCER BOTÓN: IGUAL AL "Registrar" del supervisor */}
          <button
            onClick={() => navigate("/historial")}
            className="w-full py-4 bg-white text-[#1E6176] border-2 border-[#1E6176]
                       text-lg font-semibold rounded-xl shadow-md
                       hover:bg-[#f0faff] active:scale-95 transition"
          >
            Ver historial
          </button>

          {/* CUARTO BOTÓN: IGUAL AL "Cerrar Sesión" del supervisor */}
          <button
            onClick={() => navigate("/login")}
            className="w-full py-4 bg-gray-600 text-white text-lg font-semibold
                       rounded-xl shadow-md hover:bg-gray-700 active:scale-95 transition"
          >
            Cerrar Sesión
          </button>

        </div>

      </div>
    </div>
  );
}
