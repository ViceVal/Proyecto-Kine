import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import textura from "../assets/TexturaHQ.png";

import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";

import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";

export default function DetallesAtencion() {
  const navigate = useNavigate();

  const [fecha, setFecha] = useState(null);
  const [hora, setHora] = useState("20:00");
  const [moduloNumero, setModuloNumero] = useState("");

  const location = useLocation();

  useEffect(() => {
    // Defensive: ensure location and URLSearchParams are available
    if (!location) return;
    try {
      const search = location.search ?? (typeof window !== "undefined" ? window.location.search : "");
      const params = new URLSearchParams(search);
      // Prefer human-readable boxName (provided by QR generator). Fall back to boxId if needed.
      const boxName = params.get("boxName");
      const boxId = params.get("boxId");
      if (boxName) setModuloNumero(boxName);
      else if (boxId) setModuloNumero(boxId);
    } catch (e) {
      // ignore parsing errors
    }
  }, [location, setModuloNumero]);

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
        <button
          onClick={() => navigate(-1)}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-black text-2xl"
        >
          ←
        </button>

        <h2 className="text-gray-800 text-xl font-semibold">
          Detalles Atención
        </h2>
      </div>

      {/* CONTENIDO */}
      <div className="flex-1 px-6 pt-6">

        {/* ---------------- HORA DE ATENCIÓN ---------------- */}
        <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">
          Hora de atención
        </h3>

        <div className="bg-[#D2C9FF] rounded-2xl p-4 mb-6 shadow-md overflow-visible relative">
          <label className="text-white font-semibold ml-1">Hora</label>

          <div className="bg-white border-2 border-purple-600 rounded-xl px-3 py-2 shadow-sm overflow-visible relative">
            <TimePicker
              onChange={setHora}
              value={hora}
              disableClock={false}
              clearIcon={null}
              format="hh:mm a"
              className="w-full text-gray-800 text-lg font-semibold"
            />
          </div>
        </div>

        {/* ---------------- FECHA DE ATENCIÓN ---------------- */}
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Fecha de atención
        </h3>

        <div className="bg-[#D2C9FF] rounded-2xl p-4 mb-6 shadow-md">
          <label className="text-white font-semibold ml-1">Fecha</label>

          <div className="bg-white border-2 border-purple-600 rounded-xl px-3 py-2 shadow-sm">
            <DatePicker
              onChange={setFecha}
              value={fecha}
              format="dd/MM/yyyy"
              clearIcon={null}
              calendarIcon={null}
              className="w-full text-gray-800 rounded-xl"
            />
          </div>
        </div>

        {/* ---------------- N° MÓDULO ---------------- */}
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          N° Módulo
        </h3>
        <input
          type="text"
          value={moduloNumero}
          onChange={(e) => setModuloNumero(e.target.value)}
          className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 shadow-sm mb-6"
        />

        {/* ---------------- TIPO DE ATENCIÓN ---------------- */}
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Tipo de atención
        </h3>
        <textarea
          rows="2"
          className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 shadow-sm mb-6"
        ></textarea>

        {/* ---------------- PROCEDIMIENTO ---------------- */}
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Procedimiento
        </h3>
        <textarea
          rows="3"
          className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 shadow-sm mb-6"
        ></textarea>

        {/* ---------------- BOTÓN REGISTRAR ---------------- */}
        <button
          className="w-full py-3 bg-[#1E6176] text-white text-lg font-semibold rounded-xl shadow-md active:scale-95 transition mb-10"
        >
          Registrar
        </button>

      </div>
    </div>
  );
}
