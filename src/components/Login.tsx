import { useState } from "react";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../services/authService"; // 👈 Importar servicio

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 👇 Usar el servicio
      const data = await loginUser({ email, password });
      
      await login(data.access_token);
      navigate("/inicio");
    } catch (err: any) {
      setError(err.message);
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