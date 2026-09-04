import { Link } from "react-router-dom";
import "./signup.css";
import { useState } from "react";

function SignupPage() {
  const [name, setName] = useState("");
  const [nameError, setNameEr] = useState("");

  const [password, setPassword] = useState("");
  const [passErr, setPassErr] = useState("");

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [role, setRole] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    let valid = true;

    //Name Validation
    if (name.length < 5 || name.length > 50) {
      setNameEr("Name must be between 5 and 50 characters");
      valid = false;
    } else {
      setNameEr("");
    }

    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!])[A-Za-z\d@#$%^&*!]{8,}$/;

    if (!passwordRegex.test(password)) {
      setPassErr(
        "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character",
      );
      valid = false;
    } else {
      setPassErr("");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email");
      valid = false;
    } else {
      setEmailError("");
    }

    if (valid) {
      const user = {
        username: name,
        email: email,
        password: password,
        role: role
  };

  fetch("http://localhost:8080/api/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(user)
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Registered successfully:", data);
    })
    .catch((error) => {
      console.log("Error:", error);
    });
    }
  };

  return (
    <div className="box">
      <form action="" onSubmit={handleSubmit}>
        <h1>Sign Up</h1>

        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="username"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {nameError && <p className="error">{nameError}</p>}

        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          placeholder="Enter your email"
          onChange={(e)=>setEmail(e.target.value)}
        />

        {emailError && <p className="error">{emailError}</p>}

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {passErr && <p className="error">{passErr}</p>}

        <label htmlFor="role">Role</label>
        <select name="role" 
                id="role" 
                value={role} 
                onChange={(e) => setRole(e.target.value)}
                required
                >


          <option value="" disabled hidden></option>
          <option value="ADMIN">Admin</option>
          <option value="CUSTOMER">Customer</option>
        </select>

        <button type="submit">Sign up</button>

        <p className="login-link">
          <Link to="/login">Already a user? Login here</Link>
        </p>
      </form>
    </div>
  );
}

export default SignupPage;
