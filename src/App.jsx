import { BrowserRouter, Routes, Route } from "react-router-dom";
import Bienvenido from "./pages/Bienvenido";
import Login from "./pages/Login";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Bienvenido />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
