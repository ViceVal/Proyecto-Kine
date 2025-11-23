import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Bienvenido from "./pages/Bienvenido";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import MenuPracticante from "./pages/MenuPracticante";
import DetallesAtencion from "./pages/DetallesAtencion";
import Historial from "./pages/Historial";
import Creditos from "./pages/Creditos";




function AnimatedRoutes() {
  const location = useLocation();

  return (
    <div
      key={location.pathname}
      className="animate-fade min-h-screen"
    >
      <Routes location={location}>
        <Route path="/" element={<Bienvenido />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/menu-practicante" element={<MenuPracticante />} />
        <Route path="/detalles-atencion" element={<DetallesAtencion />} />
        <Route path="/historial" element={<Historial />} />
        <Route path="/creditos" element={<Creditos />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}
