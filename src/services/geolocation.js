/**
 * Obtiene la ubicación actual del dispositivo usando Geolocation API
 * @returns {Promise<{latitude: number, longitude: number, accuracy: number}>}
 */
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation no disponible en este navegador'));
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
      },
      (error) => {
        let message = 'Error al obtener ubicación';
        if (error.code === error.PERMISSION_DENIED) {
          message = 'Permiso de ubicación denegado. Habilita la ubicación en tu navegador.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          message = 'Ubicación no disponible. Intenta en otro lugar.';
        } else if (error.code === error.TIMEOUT) {
          message = 'Tiempo de espera agotado al obtener ubicación.';
        }
        reject(new Error(message));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });
};

/**
 * Calcula la distancia entre dos puntos geográficos usando la fórmula de Haversine
 * @param {number} lat1 - Latitud del punto 1
 * @param {number} lon1 - Longitud del punto 1
 * @param {number} lat2 - Latitud del punto 2
 * @param {number} lon2 - Longitud del punto 2
 * @returns {number} Distancia en metros
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radio terrestre en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c * 1000; // retorna en metros
};

/**
 * Valida la ubicación con el servidor
 * @param {number} latitude - Latitud del practicante
 * @param {number} longitude - Longitud del practicante
 * @param {string|number} boxId - ID del box
 * @param {string} apiUrl - URL base del servidor API (ej: http://localhost:4000)
 * @returns {Promise<{valid: boolean, box_name: string, distance_meters: number, allowed_radius: number, message: string}>}
 */
export const validateLocation = async (latitude, longitude, boxId, apiUrl = 'http://localhost:4000') => {
  const response = await fetch(`${apiUrl}/api/validate-location`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      latitude,
      longitude,
      id_box: boxId
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al validar ubicación');
  }

  return await response.json();
};

/**
 * Función simplificada: valida automáticamente la ubicación del usuario contra un box.
 * Obtiene la geolocalización actual y llama al servidor para validar.
 * @param {string|number} boxId - ID del box a validar
 * @param {string} [apiUrl] - URL base del servidor API (opcional, usa VITE_API_URL o localhost:4000)
 * @returns {Promise<{valid: boolean, box_name: string, distance_meters: number, allowed_radius: number, message: string, latitude: number, longitude: number}>}
 * @throws {Error} Si no se puede obtener ubicación o si falla la validación
 */
export const checkUserLocation = async (boxId, apiUrl) => {
  // Obtener ubicación actual del usuario
  const location = await getCurrentLocation();
  
  // Validar con el servidor
  const baseUrl = apiUrl || import.meta.env.VITE_API_URL || 'http://localhost:4000';
  const result = await validateLocation(location.latitude, location.longitude, boxId, baseUrl);
  
  // Agregar las coordenadas al resultado para referencia
  return {
    ...result,
    latitude: location.latitude,
    longitude: location.longitude,
    accuracy: location.accuracy
  };
};
