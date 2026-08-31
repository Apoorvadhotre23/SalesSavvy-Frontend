import "./login.css";
import {Link} from 'react-router-dom'

function LoginPage() {
  return (
    <div className="box">
      <form>
        <h1>Login Page</h1>

        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" required/>

        <label htmlFor="password">Password</label>
        <input type="password" id="password" name="password" required/>

        <button type="submit">Sign In</button>

        <p className="login-link">
          <Link to="/">Don't have an account? Sign up</Link>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;