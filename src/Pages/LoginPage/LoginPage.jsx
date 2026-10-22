import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const loginData = {
      email: email,
      password: password,
    };

    fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(loginData),
    })
      .then(async (response) => {
        if (!response.ok) {
          const data = await response.json();

          throw new Error(data.error || "Login failed");
        }

        return response.json();
      })
      .then((data) => {
        console.log("Login successful");
        console.log(data);

        navigate("/home");
      })
      .catch((error) => {
        console.log(error.message);

        navigate("/login-failed");
      });
  };

  return (
    <div className="login-page">
    <div className="box">
      <form onSubmit={handleSubmit}>
        <h1>Login Page</h1>

        <label htmlFor="email">Email</label>

        <input
          type="email"
          id="email"
          name="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="password">Password</label>

        <input
          type="password"
          id="password"
          name="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Sign In</button>

        <p className="login-link">
          <Link to="/">Don't have an account? Sign up</Link>
        </p>
      </form>
    </div>
    </div>
  );
}

export default LoginPage;
