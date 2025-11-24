import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Bienvenido from "./pages/Bienvenido";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import MenuPracticante from "./pages/MenuPracticante";
import ScanQRScreen from "./pages/ScanQRScreen";
import DetallesAtencion from "./pages/DetallesAtencion";
import Historial from "./pages/Historial";
import Creditos from "./pages/Creditos";
// Pantallas del Supervisor
import MenuSupervisor from "./pages/MenuSupervisor";
import ListaPracticantes from "./pages/ListaPracticantes";
import ConsultasPracticante from "./pages/ConsultasPracticante";
import DetalleConsulta from "./pages/DetalleConsulta";
import Retroalimentacion from "./pages/Retroalimentacion";


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
        <Route path="/practicante/menu" element={<MenuPracticante />} />
        <Route path="/practicante/scan" element={<ScanQRScreen />} />
        <Route path="/detalles-atencion" element={<DetallesAtencion />} />
        <Route path="/historial" element={<Historial />} />
        <Route path="/creditos" element={<Creditos />} />
        {/* Rutas del Supervisor */}
        <Route path="/supervisor/menu" element={<MenuSupervisor />} />
        <Route path="/lista-practicantes" element={<ListaPracticantes />} />
        <Route path="/consultas-practicante" element={<ConsultasPracticante />} />
        <Route path="/detalle-consulta" element={<DetalleConsulta />} />
        <Route path="/retroalimentacion" element={<Retroalimentacion />} />
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
