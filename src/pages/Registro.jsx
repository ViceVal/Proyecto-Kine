import { useNavigate } from "react-router-dom";
import textura from "../assets/TexturaHQ.png";

export default function Registro() {
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
      <div className="relative w-full bg-[#D2C9FF] py-6 text-center shadow">
        {/* Flecha atrás */}
        <button
          onClick={() => navigate(-1)}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-black text-2xl"
        >
          ←
        </button>

        <h2 className="text-gray-800 text-xl font-semibold">
          Registrate
        </h2>
      </div>

      {/* CONTENIDO */}
      <div className="flex-1 flex flex-col items-center px-6 pt-8">

        {/* FILA: Nombre + Apellido */}
        <div className="w-full max-w-md flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Nombre"
            className="w-1/2 bg-white border border-gray-300 rounded-xl px-4 py-3 shadow-sm text-gray-800"
          />
          <input
            type="text"
            placeholder="Apellido"
            className="w-1/2 bg-white border border-gray-300 rounded-xl px-4 py-3 shadow-sm text-gray-800"
          />
        </div>

        {/* Correo */}
        <input
          type="email"
          placeholder="Correo institucional"
          className="w-full max-w-md bg-white border border-gray-300 rounded-xl px-4 py-3 shadow-sm mb-4 text-gray-800"
        />

        {/* Contraseña */}
        <input
          type="password"
          placeholder="Contraseña"
          className="w-full max-w-md bg-white border border-gray-300 rounded-xl px-4 py-3 shadow-sm mb-4 text-gray-800"
        />

        {/* Repetir contraseña */}
        <input
          type="password"
          placeholder="Repetir contraseña"
          className="w-full max-w-md bg-white border border-gray-300 rounded-xl px-4 py-3 shadow-sm mb-4 text-gray-800"
        />

        {/* Numero de contacto */}
        <input
          type="tel"
          placeholder="Número de contacto"
          className="w-full max-w-md bg-white border border-gray-300 rounded-xl px-4 py-3 shadow-sm mb-8 text-gray-800"
        />

        {/* BOTÓN REGISTRAR */}
        <button className="w-full max-w-md py-3 bg-[#1E6176] text-white text-lg font-semibold rounded-xl shadow-md active:scale-95 transition">
          Registrar
        </button>

      </div>
    </div>
  );
}
