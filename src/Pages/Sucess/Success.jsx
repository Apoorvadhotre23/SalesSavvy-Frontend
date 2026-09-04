import { Link } from "react-router-dom";
import "./Success.css";

function Success() {

  return (
    <div className="success-container">

      <div className="success-box">

        <div className="success-icon">✓</div>

        <h1>Registration Successful!</h1>

        <p>
          Your account has been created successfully.
        </p>

        <Link to="/login">
        <button className="login-btn">
          Go to Login
        </button>
        </Link>

      </div>

    </div>
  );
}

export default Success;