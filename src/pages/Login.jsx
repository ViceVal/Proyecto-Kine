import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import textura from "../assets/TexturaHQ.png";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      alert('Por favor, ingresa usuario y contraseña');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${apiBase}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error al iniciar sesión');
      }

      const data = await res.json();
      console.log('✅ Login exitoso:', data);

      // Guardar sesión si el usuario lo solicitó
      if (keepLoggedIn) {
        localStorage.setItem('kineapp_user', JSON.stringify(data.user));
      } else {
        sessionStorage.setItem('kineapp_user', JSON.stringify(data.user));
      }

      // Redirigir según el rol
      if (data.user.rol === 'supervisor') {
        navigate('/supervisor/menu');
      } else if (data.user.rol === 'practicante') {
        navigate('/practicante/menu');
      } else {
        navigate('/');
      }

    } catch (error) {
      console.error('❌ Error:', error);
      alert(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col"
      style={{
        backgroundImage: `url(${textura})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* HEADER (estilo unificado KineApp) */}
      <div className="relative w-full bg-[#B3CCFA] py-6 text-center shadow">

        {/* Flecha atrás */}
        <button
          onClick={() => navigate("/")}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-black text-2xl"
        >
          ←
        </button>

        {/* Título y subtítulo */}
        <h1 className="text-3xl font-bold text-gray-900 mb-1">KineApp</h1>
        <h2 className="text-gray-700 text-sm font-semibold">Iniciar Sesión</h2>
      </div>

      {/* CONTENIDO */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">

        <div className="bg-white/90 rounded-2xl shadow-lg p-10 w-full max-w-md text-center">

          {/* TÍTULO */}
          <h3 className="text-xl font-semibold text-gray-800 mb-6">
            Ingrese sus datos
          </h3>

          {/* Usuario */}
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-800 shadow-sm mb-4"
          />

          {/* Contraseña */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin(e)}
              className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 pr-12 text-gray-800 shadow-sm mb-4"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 transition"
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </button>
          </div>

          {/* Mantener sesión */}
          <div className="flex items-center mb-6">
            <input
              type="checkbox"
              id="keepLoggedIn"
              checked={keepLoggedIn}
              onChange={(e) => setKeepLoggedIn(e.target.checked)}
              className="w-4 h-4 text-[#1E6176] rounded focus:ring-[#1E6176]"
            />
            <label htmlFor="keepLoggedIn" className="ml-2 text-gray-700">
              Mantener sesión iniciada
            </label>
          </div>

          {/* Botón iniciar sesión */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-4 bg-[#1E6176] text-white text-lg font-semibold
                       rounded-xl shadow-md hover:bg-[#164d5e] active:scale-95 transition
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '⏳ Iniciando sesión...' : 'Iniciar sesión'}
          </button>

        </div>
      </div>
    </div>
  );
}
