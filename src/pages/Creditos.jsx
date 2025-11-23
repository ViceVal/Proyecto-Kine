import { useNavigate } from "react-router-dom";
import textura from "../assets/TexturaHQ.png";

export default function Creditos() {
  const navigate = useNavigate();

  // EDITA AQUÍ LOS NOMBRES Y ROLES
  const equipo = [
    { nombre: "INGRESAR NOMBRES AQUI", rol: "Frontend" },
    { nombre: "INGRESAR NOMBRES AQUI", rol: "Base de datos" },
    { nombre: "INGRESAR NOMBRES AQUI", rol: "Backend" },
    { nombre: "INGRESAR NOMBRES AQUI", rol: "Levantamiento AWS" },
    { nombre: "INGRESAR NOMBRES AQUI", rol: "INGRESAR ROL AQUI" }
  ];

  return (
    <div
      className="min-h-screen w-full flex flex-col animate-fadeUp"
      style={{
        backgroundImage: `url(${textura})`,
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      {/* HEADER */}
      <div className="relative w-full bg-[#D2C9FF] py-6 text-center shadow animate-fadeUp">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-black text-2xl"
        >
          ←
        </button>

        <h2 className="text-gray-800 text-xl font-semibold">
          Créditos
        </h2>
      </div>

      {/* CONTENIDO */}
      <div className="flex-1 px-6 pt-6 space-y-4">
        {equipo.map((persona, i) => (
          <div
            key={i}
            className="bg-white/80 rounded-2xl p-4 shadow text-center opacity-0 animate-fadeUp"
            style={{ animationDelay: `${i * 0.12}s` }}  // escalona la aparición
          >
            <p className="text-gray-900 text-lg font-semibold">
              {persona.nombre}
            </p>
            <p className="text-gray-700 text-sm">
              {persona.rol}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
