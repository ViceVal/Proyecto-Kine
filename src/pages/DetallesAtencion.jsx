import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import textura from '../assets/TexturaHQ.png';
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';

export default function DetallesAtencion() {
  const navigate = useNavigate();
  const location = useLocation();

  const [fecha, setFecha] = useState(null);
  const [hora, setHora] = useState('20:00');
  const [tipoAtencion, setTipoAtencion] = useState('');
  const [procedimiento, setProcedimiento] = useState('');
  const [registrando, setRegistrando] = useState(false);
  const [moduloNumero, setModuloNumero] = useState('');
  const [codigoqr, setCodigoqr] = useState(null);

  useEffect(() => {
    // Defensive: ensure location and URLSearchParams are available
    if (!location) return;
    try {
      const search = location.search ?? (typeof window !== "undefined" ? window.location.search : "");
      const params = new URLSearchParams(search);
      
      // Leer boxName o boxId
      const boxName = params.get("boxName");
      const boxId = params.get("boxId");
      if (boxName) setModuloNumero(boxName);
      else if (boxId) setModuloNumero(boxId);
      
      // Leer codigoqr
      const codigoqrParam = params.get("codigoqr");
      if (codigoqrParam) setCodigoqr(codigoqrParam);
      
      // Leer fecha del QR (formato: "2025-12-01")
      const fechaParam = params.get("fecha");
      if (fechaParam) {
        // Convertir string "2025-12-01" a Date object para DatePicker
        const [year, month, day] = fechaParam.split('-').map(Number);
        setFecha(new Date(year, month - 1, day)); // month es 0-indexed
      }
      
      // Leer hora del QR (formato: "14:30")
      const horaParam = params.get("hora");
      if (horaParam) {
        setHora(horaParam); // TimePicker acepta string "HH:mm"
      }
    } catch (e) {
      console.error('Error parsing URL params:', e);
    }
  }, [location]);

  const apiBase = import.meta.env.VITE_API_URL || 'https://localhost:4000';

  const handleRegistrar = async () => {
    if (!fecha) {
      alert('Por favor, selecciona una fecha');
      return;
    }
    if (!hora) {
      alert('Por favor, selecciona una hora');
      return;
    }
    if (!tipoAtencion.trim()) {
      alert('Por favor, ingresa el tipo de atención');
      return;
    }
    if (!procedimiento.trim()) {
      alert('Por favor, describe el procedimiento realizado');
      return;
    }

    setRegistrando(true);

    try {
      const fechaFormateada = fecha.toISOString().split('T')[0];

      const payload = {
        boxName: moduloNumero || 'Box Sin Especificar',
        codigoqr: codigoqr,
        fecha: fechaFormateada,
        hora: hora,
        modulo: moduloNumero || null,
        tipoAtencion: tipoAtencion.trim(),
        procedimiento: procedimiento.trim()
      };

      console.log('📤 Enviando asistencia:', payload);

      const res = await fetch(`${apiBase}/api/attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `Error ${res.status}`);
      }

      const data = await res.json();
      console.log('✅ Asistencia registrada:', data);

      alert('✅ Asistencia registrada exitosamente');
      
      setFecha(null);
      setHora('14:00');
      setTipoAtencion('');
      setProcedimiento('');
      setModuloNumero('');

      navigate('/practicante/menu');

    } catch (error) {
      console.error('❌ Error:', error);
      alert(`❌ Error al registrar: ${error.message}`);
    } finally {
      setRegistrando(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col" style={{
      backgroundImage: `url(${textura})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>
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

      <div className="flex-1 px-6 pt-6 pb-8 overflow-y-auto">
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
              className="w-full text-gray-800"
            />
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          N° Módulo
        </h3>
        <input
          type="text"
          value={moduloNumero}
          onChange={(e) => setModuloNumero(e.target.value)}
          className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 shadow-sm mb-6"
        />

        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Tipo de atención
        </h3>
        <textarea
          rows={2}
          value={tipoAtencion}
          onChange={(e) => setTipoAtencion(e.target.value)}
          placeholder="Ej: Kinesiología respiratoria"
          className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 shadow-sm mb-6"
        />

        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Procedimiento
        </h3>
        <textarea
          rows={3}
          value={procedimiento}
          onChange={(e) => setProcedimiento(e.target.value)}
          placeholder="Describe el procedimiento realizado..."
          className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 shadow-sm mb-6"
        />

        <button
          onClick={handleRegistrar}
          disabled={registrando}
          className="w-full py-3 bg-[#1E6176] text-white text-lg font-semibold rounded-xl shadow-md active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed mb-10"
        >
          {registrando ? '⏳ Registrando...' : 'Registrar'}
        </button>
      </div>
    </div>
  );
}
