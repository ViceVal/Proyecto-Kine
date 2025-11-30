import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import textura from "../assets/TexturaHQ.png";

export default function GeneradorQR() {
  const navigate = useNavigate();
  
  const [boxesList, setBoxesList] = useState([]);
  const [selectedBoxName, setSelectedBoxName] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [creating, setCreating] = useState(false);
  const [createdCodigo, setCreatedCodigo] = useState("");

  const frontendOrigin = typeof window !== "undefined" ? window.location.origin : "";
  const baseUrl = import.meta.env.VITE_FRONTEND_URL || frontendOrigin;
  const targetPath = "/detalles-atencion";

  const selectedBox = useMemo(
    () => boxesList.find((b) => b.nombre === selectedBoxName), 
    [selectedBoxName, boxesList]
  );

  const apiBase = import.meta.env.VITE_API_URL || 'https://localhost:4000';

  useEffect(() => {
    let mounted = true;
    
    (async () => {
      try {
        const res = await fetch(`${apiBase}/api/boxes`);
        if (!res.ok) throw new Error(`Failed to load boxes: ${res.status}`);
        
        const data = await res.json();
        if (!mounted) return;
        
        setBoxesList(data);
        if (!selectedBoxName && data.length) {
          setSelectedBoxName(data[0].nombre);
        }
      } catch (err) {
        console.error('Failed to load boxes', err);
      }
    })();
    
    return () => { mounted = false; };
  }, [apiBase, selectedBoxName]);

  const attendanceUrlBase = `${baseUrl}${targetPath}?boxName=${encodeURIComponent(selectedBoxName)}`;
  const attendanceUrl = createdCodigo 
    ? `${attendanceUrlBase}&codigoqr=${encodeURIComponent(createdCodigo)}` 
    : attendanceUrlBase;

  const qrApi = (data) => 
    `https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=${encodeURIComponent(data)}`;

  async function downloadQr() {
    const url = qrApi(attendanceUrl);
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      const safeName = (selectedBox?.nombre || "qr").replace(/[^a-z0-9-_.]/gi, "_");
      a.download = `${safeName}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (e) {
      console.error("QR download failed", e);
      alert("No se pudo descargar el QR. Reintente.");
    }
  }

  function copyUrl() {
    navigator.clipboard.writeText(attendanceUrl).then(() => {
      alert("URL copiada al portapapeles");
    });
  }

  return (
    <div
      className="min-h-screen w-full flex flex-col"
      style={{
        backgroundImage: `url(${textura})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="relative w-full bg-[#D2C9FF] py-4 text-center shadow">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-black text-2xl"
        >
          ←
        </button>

        <h1 className="text-2xl font-bold text-gray-900 mb-1">KineApp</h1>
        <h2 className="text-gray-700 text-sm font-semibold">Generador de QR</h2>
      </div>

      <div className="flex-1 flex items-start justify-center px-6 pt-8">
        <div className="w-full max-w-2xl bg-white/90 rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Generador de QR — Boxes</h2>

          <div className="space-y-6">
            <label className="block">
              <div className="text-sm font-semibold mb-1">Seleccionar box</div>
              <select
                value={selectedBoxName}
                onChange={(e) => setSelectedBoxName(e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                {boxesList.map((b) => (
                  <option key={b.nombre} value={b.nombre}>
                    {b.nombre} — {b.descripcion}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <div className="text-sm font-semibold mb-1">
                  Fecha <span className="text-red-600">*</span>
                </div>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </label>
              <label className="block">
                <div className="text-sm font-semibold mb-1">
                  Hora <span className="text-red-600">*</span>
                </div>
                <input
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </label>
            </div>

            <button
              onClick={async () => {
                if (!scheduledDate || !scheduledTime) {
                  alert('❌ Fecha y hora son obligatorias');
                  return;
                }
                
                const scheduledAt = new Date(`${scheduledDate}T${scheduledTime}`).toISOString();
                setCreating(true);
                
                try {
                  const res = await fetch(`${apiBase}/api/qrcodes`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ boxName: selectedBoxName, scheduledAt }),
                  });
                  
                  const body = await res.json();
                  
                  if (res.status === 201) {
                    setCreatedCodigo(body.codigoqr);
                    setTimeout(() => {
                      downloadQr();
                      alert(
                        '✓ QR creado exitosamente: ' + body.codigoqr + 
                        '\nFecha: ' + scheduledDate + ' ' + scheduledTime
                      );
                    }, 300);
                  } else if (res.status === 409) {
                    setCreatedCodigo(body.existing?.codigoqr || '');
                    alert(
                      '⚠️ ' + body.message + 
                      '\nCódigo existente: ' + (body.existing?.codigoqr || 'N/A')
                    );
                  } else {
                    console.error('Failed to create QR', body);
                    alert('❌ Error: ' + (body.error || 'Desconocido'));
                  }
                } catch (err) {
                  console.error(err);
                  alert('❌ Error de conexión: ' + err.message);
                } finally {
                  setCreating(false);
                }
              }}
              disabled={creating || !scheduledDate || !scheduledTime}
              className="w-full px-4 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition"
            >
              {creating ? '⏳ Creando QR...' : '✨ Crear QR y Descargar'}
            </button>

            {createdCodigo && (
              <button
                onClick={copyUrl}
                className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
              >
                📋 Copiar Link
              </button>
            )}

            {createdCodigo && (
              <div className="mt-6 text-center border-t pt-6">
                <p className="text-sm text-gray-600 mb-4">
                  Código QR generado:{" "}
                  <span className="font-mono font-bold text-indigo-600">
                    {createdCodigo}
                  </span>
                </p>
                <img
                  src={qrApi(attendanceUrl)}
                  alt="QR preview"
                  className="inline-block border-2 border-indigo-200 p-2 rounded"
                />
                <p className="text-xs text-gray-500 mt-4">
                  Escanear este código redirige al formulario de asistencia
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
