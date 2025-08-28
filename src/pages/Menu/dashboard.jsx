import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

// You need to import your api instance if not already imported
// import api from "../../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // Se você usa o Axios, não precisa de método/cabeçalhos/corpo
      // const response = await api.post("/login", { email, password });
      // const data = response.data;

      // Se você usa fetch:
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao fazer login");
      }

      // Redirecionar após o login bem-sucedido
      navigate("/dashboard");
    } catch (error) {
      setError(error.message || "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h1>Login</h1>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div>
          <label>Senha:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Entrando..." : "Login"}
        </button>
      </form>
      <p>
        Não tem uma conta? <Link to="/register">Registre-se</Link>
      </p>
    </div>
  );
}
