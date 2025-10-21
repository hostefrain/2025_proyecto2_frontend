import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Login from "./components/Login";
import Register from "./components/Register";
import ForgotPassword from "./components/Forgot-password";
import Inicio from "./components/inicio/Inicio";
import { AuthProvider } from "./context/AuthContext"; // 👈 Agrega este import

function App() {

  return (
    <AuthProvider> {/* 👈 Envuelve todo con AuthProvider */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/inicio" element={<Inicio />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App