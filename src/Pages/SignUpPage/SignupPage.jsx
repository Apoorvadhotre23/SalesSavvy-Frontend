import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./signup.css";
import { validateSignup } from "../ValidateForm/signupValidation";

function SignupPage() {

const [name, setName] = useState("");
const [nameError, setNameError] = useState("");

const [email, setEmail] = useState("");
const [emailError, setEmailError] = useState("");

const [password, setPassword] = useState("");
const [passwordError, setPasswordError] = useState("");

const [role, setRole] = useState("");
const [roleError, setRoleError] = useState("");

const [loading, setLoading] = useState(false);

const navigate = useNavigate();

const handleSubmit = (e) => {


e.preventDefault();

// 1. Validate form
const errors = validateSignup(name, email, password, role);

// 2. Display validation errors
setNameError(errors.name || "");
setEmailError(errors.email || "");
setPasswordError(errors.password || "");
setRoleError(errors.role || "");

// 3. Stop if validation fails
if (Object.keys(errors).length > 0) {
  return;
}

// 4. Create user object
const user = {
  username: name,
  email: email,
  password: password,
  role: role
};

// 5. Show loading
setLoading(true);

// 6. Send data to Spring Boot backend
fetch("http://localhost:8080/api/auth/signup", {

  method: "POST",

  headers: {
    "Content-Type": "application/json"
  },

  body: JSON.stringify(user)

})
 .then(async (response) => {

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message);
  }

  return response.json();
})

 .then(() => {
  console.log("Registered successfully");
  navigate("/success");
})

.catch((error) => {

    if (error.message === "Email already exists") {
      setEmailError("Email already exists");
    }

    if (error.message === "Username already exists") {
      setNameError("Username already exists");
    }

    setLoading(false);
  });


};

return (



<div className="signup-page">
<div className="box">

  <form onSubmit={handleSubmit}>

    <h1>Sign Up</h1>


    {/* Name */}

    <label htmlFor="name">Name</label>

    <input
      type="text"
      id="name"
      name="username"
      placeholder="Enter your name"
      value={name}
      onChange={(e) => setName(e.target.value)}
    />

    {nameError && (
      <p className="error">{nameError}</p>
    )}


    {/* Email */}

    <label htmlFor="email">Email</label>

    <input
      type="email"
      id="email"
      name="email"
      placeholder="Enter your email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />

    {emailError && (
      <p className="error">
        {emailError}
      </p>
    )}


    {/* Password */}

    <label htmlFor="password">Password</label>

    <input
      type="password"
      id="password"
      name="password"
      placeholder="Enter your password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />

    {passwordError && (
      <p className="error">
        {passwordError}
      </p>
    )}


    {/* Role */}

    <label htmlFor="role">Role</label>

    <select
      id="role"
      name="role"
      value={role}
      onChange={(e) => setRole(e.target.value)}
    >

      <option value="" disabled hidden>Select Role</option>
      <option value="ADMIN">Admin</option>
      <option value="CUSTOMER">Customer</option>

    </select>

    {roleError && (
      <p className="error">
        {roleError}
      </p>
    )}


    {/* Submit Button */}

    <button type="submit" disabled={loading}>
      {loading ? "Creating Account..." : "Sign Up"}
    </button>


    {/* Login Link */}

    <p className="login-link">

      <Link to="/login">Already a user? Login here</Link>

    </p>

  </form>

 </div>

</div>

);
}

export default SignupPage;
