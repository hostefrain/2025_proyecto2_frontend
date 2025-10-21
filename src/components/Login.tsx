import { useState } from "react";
import axios from "axios";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // 👈 Importa el hook

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth(); // 👈 Usa el contexto
  const navigate = useNavigate(); // 👈 Para navegación

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("http://localhost:3000/auth/login", {
        email,
        password,
      });

      // 👇 Usa la función login del contexto en lugar de guardar directamente
      await login(res.data.access_token);
      
      // 👇 Navega con react-router en lugar de window.location
      navigate("/inicio");
    } catch (err: any) {
      setError(err.response?.data?.message || "Error en el login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-box">
        <h2 className="login-title">Iniciar Sesión</h2>

        {error && <div className="login-error">{error}</div>}

        <div className="login-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="login-group">
          <label>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={loading} className="login-button">
          {loading ? "Cargando..." : "Ingresar"}
        </button>

        <p className="login-register">
          ¿No tienes cuenta?{" "}
          <Link to="/register">Regístrate</Link>
        </p>

        <p className="login-register">
          ¿Olvidaste tu contraseña?{" "}
          <Link to="/forgot-password">Recuperar</Link>
        </p>
      </form>
    </div>
  );
}