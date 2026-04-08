import { useState } from "react";

import { useNavigate } from "react-router-dom";



export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
const navigate = useNavigate();
  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:5000/login", {
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

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}