import { useNavigate } from "react-router-dom";
import textura from "../assets/TexturaHQ.png";

export default function MenuPracticante() {
  const navigate = useNavigate();

  // Esto luego se reemplaza con datos reales del usuario
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
      <div className="relative w-full bg-[#D2C9FF] py-6 text-center shadow">
        <h2 className="text-gray-800 text-lg font-semibold">
          Menu practicante
        </h2>
      </div>

      {/* CONTENIDO */}
      <div className="flex-1 flex flex-col items-center px-6 pt-10">

        {/* Texto de bienvenida */}
        <h3 className="text-xl font-semibold text-gray-900 mb-8 text-center">
          ¡Bienvenido {nombre} {apellido}!
        </h3>

        {/* Contenedor blanco alrededor de los botones */}
        <div className="bg-white/90 rounded-2xl shadow-md p-6 w-full max-w-sm mb-8">

          {/* Botón: Ingresar paciente */}
          <button
            onClick={() => navigate("/detalles-atencion")}
            className="w-full py-3 bg-[#1E6176] text-white text-lg font-semibold rounded-xl shadow-md active:scale-95 transition mb-4"
          >
            Ingresar paciente
          </button>

          {/* Botón: Ver historial */}
          <button
            onClick={() => navigate("/historial")}
            className="w-full py-3 bg-[#1E6176] text-white text-lg font-semibold rounded-xl shadow-md active:scale-95 transition"
          >
            Ver historial
          </button>

        </div>

        {/* Cerrar sesión */}
        <button
          onClick={() => navigate("/")}
          className="text-[#1E6176] font-semibold underline text-sm"
        >
          Cerrar Sesión
        </button>

      </div>
    </div>
  );
}
