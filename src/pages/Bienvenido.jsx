import { useNavigate } from "react-router-dom";
import textura from "../assets/TexturaHQ.png";

export default function Bienvenido() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen w-full flex flex-col relative"
      style={{
        backgroundImage: `url(${textura})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* HEADER */}
      <div className="relative w-full bg-[#B3CCFA] py-6 text-center shadow">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">KineApp</h1>
        <h2 className="text-gray-700 text-sm font-semibold">Bienvenido</h2>
      </div>

      {/* CONTENIDO CENTRAL */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">

        {/* CONTENEDOR BLANCO */}
        <div className="bg-white/90 rounded-2xl shadow-lg p-10 w-full max-w-md text-center">

          <h1 className="text-4xl font-bold text-gray-900 mb-10">
            KineApp
          </h1>

          {/* Botón Iniciar Sesión */}
          <button
            onClick={() => navigate("/login")}
            className="w-full py-4 bg-[#1E6176] text-white text-lg font-semibold 
                       rounded-xl shadow-md hover:bg-[#164d5e] active:scale-95 transition"
          >
            Iniciar Sesión
          </button>

        </div>

      </div>

      {/* BOTÓN CRÉDITOS */}
      <button
        onClick={() => navigate("/creditos")}
        className="absolute bottom-6 right-6 bg-[#D2C9FF] 
                   w-12 h-12 rounded-lg shadow-md 
                   flex items-center justify-center text-2xl
                   active:scale-95 transition"
      >
        👤
      </button>
    </div>
  );
}
