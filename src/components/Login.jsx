import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // 👈 NEW

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (loading) return; // 👈 double click avoid

    setLoading(true); // 👈 start loader

    try {
      const res = await fetch("https://party-chart-server.onrender.com/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        onLogin(data.user);
        navigate("/");
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Server error");
    } finally {
      setLoading(false); // 👈 stop loader
    }
  };

  return (
    <div className="login-box">
      <h2>Login</h2>

      <input
        autoComplete="off"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        autoComplete="new-password"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin} disabled={loading}>
        {loading ? "Logging in..." : "Login"} {/* 👈 TEXT CHANGE */}
      </button>
    </div>
  );
}