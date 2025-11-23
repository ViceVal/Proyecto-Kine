import textura from "../assets/TexturaHQ.png"; // fondo
import { useNavigate } from "react-router-dom";

export default function Bienvenido() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen w-full flex flex-col"
      style={{
        backgroundImage: `url(${textura})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      {/* HEADER MORADO */}
      <div className="w-full bg-[#D2C9FF] py-6 text-center shadow">
        <h2 className="text-gray-800 text-lg font-semibold">¡Bienvenido!</h2>
      </div>

      {/* CONTENIDO CENTRAL */}
      <div className="flex-1 flex flex-col items-center justify-center">

        {/* Título KineApp */}
        <h1 className="text-6xl font-bold text-gray-900 mb-16">
          KineApp
        </h1>

        {/* Botón Iniciar Sesión */}
        <button
          onClick={() => navigate("/login")}
          className="w-72 py-3 bg-[#1E6176] text-white text-lg font-semibold rounded-xl shadow-md mb-6 active:scale-95 transition"
        >
          Iniciar Sesión
        </button>

        {/* Botón Registrarse */}
        <button
          className="w-72 py-3 bg-white text-[#1E6176] border-2 border-[#1E6176] text-lg font-semibold rounded-xl shadow-md active:scale-95 transition"
        >
          Registrarse
        </button>
      </div>
    </div>
  );
}
