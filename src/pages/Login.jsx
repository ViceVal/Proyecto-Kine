import { useNavigate } from "react-router-dom";
import textura from "../assets/TexturaHQ.png";

export default function Login() {
  const navigate = useNavigate();

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
        {/* Flecha atrás */}
        <button
          onClick={() => navigate(-1)}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-black text-2xl"
        >
          ←
        </button>

        <h2 className="text-gray-800 text-xl font-semibold">
          Iniciar Sesión
        </h2>
      </div>

      {/* CONTENIDO */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">

        {/* CONTENEDOR BLANCO (igual estilo al resto de menús) */}
        <div className="bg-white/90 rounded-2xl shadow-lg p-10 w-full max-w-md text-center">

          {/* TÍTULO */}
          <h3 className="text-xl font-semibold text-gray-800 mb-6">
            Ingrese sus datos
          </h3>

          {/* INPUT: Usuario */}
          <input
            type="text"
            placeholder="Usuario"
            className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-800 shadow-sm mb-4"
          />

          {/* INPUT: Contraseña */}
          <input
            type="password"
            placeholder="Contraseña"
            className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-800 shadow-sm mb-4"
          />

          {/* CHECKBOX: Mantener sesión */}
          <div className="flex items-center mb-6">
            <input
              type="checkbox"
              id="keepLoggedIn"
              className="w-4 h-4 text-[#1E6176] rounded focus:ring-[#1E6176]"
            />
            <label htmlFor="keepLoggedIn" className="ml-2 text-gray-700">
              Mantener sesión iniciada
            </label>
          </div>

          {/* BOTÓN ACCEDER */}
          <button
            onClick={() => navigate("/practicante/menu")}
            className="w-full py-4 bg-[#1E6176] text-white text-lg font-semibold
                       rounded-xl shadow-md hover:bg-[#164d5e] active:scale-95 transition"
          >
            Iniciar sesión
          </button>
        </div>
      </div>
    </div>
  );
}
