import { useState } from 'react';
import { getCurrentLocation, validateLocation } from '../services/geolocation';

export default function GeolocationCheck({ boxId, boxName, onSuccess, onError, apiUrl = 'http://localhost:4000' }) {
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleVerifyLocation = async () => {
    setLoading(true);
    setStatus('loading');
    try {
      // Obtener ubicación del dispositivo
      const location = await getCurrentLocation();
      
      // Validar con el servidor
      const data = await validateLocation(location.latitude, location.longitude, boxId, apiUrl);
      
      setResult(data);
      
      if (data.valid) {
        setStatus('success');
        if (onSuccess) onSuccess(data);
      } else {
        setStatus('error');
        if (onError) onError(data);
      }
    } catch (error) {
      setStatus('error');
      setResult({
        valid: false,
        message: error.message,
        error: true
      });
      if (onError) onError(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = () => {
    if (status === 'success') return 'bg-green-50 border-green-200';
    if (status === 'error') return 'bg-red-50 border-red-200';
    return 'bg-white border-gray-200';
  };

  const getStatusTextColor = () => {
    if (status === 'success') return 'text-green-700';
    if (status === 'error') return 'text-red-700';
    return 'text-gray-700';
  };

  const getButtonColor = () => {
    if (loading) return 'bg-gray-400 cursor-not-allowed';
    if (status === 'success') return 'bg-green-500 hover:bg-green-600';
    if (status === 'error') return 'bg-red-500 hover:bg-red-600';
    return 'bg-blue-500 hover:bg-blue-600';
  };

  return (
    <div className={`p-4 rounded-lg border-2 transition-all ${getStatusColor()}`}>
      <div className="mb-3">
        <h3 className="font-bold text-lg mb-1">📍 Verificar Ubicación</h3>
        <p className="text-sm text-gray-600">{boxName}</p>
      </div>

      <button
        onClick={handleVerifyLocation}
        disabled={loading}
        className={`w-full px-4 py-2 text-white rounded-lg font-semibold transition-all ${getButtonColor()} disabled:opacity-70`}
      >
        {loading ? '⏳ Verificando ubicación...' : '📡 Verificar Ubicación'}
      </button>

      {result && (
        <div className={`mt-4 p-3 rounded-lg ${getStatusTextColor()}`}>
          <div className="flex items-start gap-2">
            <span className="text-xl">
              {result.valid ? '✓' : '✗'}
            </span>
            <div className="flex-1">
              <p className="font-semibold">{result.message}</p>
              {result.distance_meters !== undefined && (
                <div className="text-sm mt-2 space-y-1">
                  <p>📏 Distancia: <strong>{result.distance_meters}m</strong></p>
                  <p>🎯 Radio permitido: <strong>{result.allowed_radius}m</strong></p>
                </div>
              )}
              {result.error && (
                <p className="text-sm mt-2 text-red-600">{result.message}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {status === 'success' && (
        <div className="mt-3 p-2 bg-green-100 rounded text-green-800 text-sm">
          ✓ Ubicación verificada exitosamente. Puedes registrar la atención.
        </div>
      )}

      {status === 'error' && result && !result.valid && (
        <div className="mt-3 p-2 bg-red-100 rounded text-red-800 text-sm">
          ✗ Debes estar dentro del área autorizada para registrar la atención.
        </div>
      )}
    </div>
  );
}
