import { useState } from "react";
import axios from "axios";
import "./login.css"; // reutilizamos estilos
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await axios.post("http://localhost:3000/auth/forgot-password", {
        email,
      });
      setMessage("Si el correo está registrado, recibirás un enlace para restablecer tu contraseña.");
      setEmail("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al solicitar recuperación");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleForgotPassword} className="login-box">
        <h2 className="login-title">Recuperar Contraseña</h2>

        {error && <div className="login-error">{error}</div>}
        {message && <div className="login-success">{message}</div>}

        <div className="login-group">
          <label>Correo electrónico</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={loading} className="login-button">
          {loading ? "Enviando..." : "Enviar enlace"}
        </button>

        <p className="login-register">
          <Link to="/">Volver al inicio de sesión</Link>
        </p>
      </form>
    </div>
  );
}
