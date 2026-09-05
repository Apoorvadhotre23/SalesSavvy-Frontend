import { Link } from "react-router-dom";
import "./loginFailed.css";

function LoginFailed() {
  return (
    <div className="failed-container">
      <div className="failed-box">
        <h1>Login Failed</h1>

        <p>Invalid email or password.</p>
        <p>Please check your credentials and try again.</p>

        <Link to="/login">
          <button className="login-btn">Back to Login</button>
        </Link>
      </div>
    </div>
  );
}

export default LoginFailed;