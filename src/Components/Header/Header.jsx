import { useNavigate } from "react-router-dom";
import { ShoppingCart, CircleUserRound } from "lucide-react";
import "./Header.css";

function Header() {
  const navigate = useNavigate();
  return (
    <header className="site-header">
      {/* SalesSavvy Logo */}
      <div className="header-brand">
        <img
          src="/SalesSavvy Shopping Cart Logo.png"
          alt="SalesSavvy Logo"
          className="header-logo"
        />
      </div>

      {/* Cart and Profile */}
      <div className="header-actions">
        <button
          type="button"
          className="header-icon-btn"
          aria-label="Shopping Cart"
        >
          <ShoppingCart size={26} />
        </button>

        <button
          type="button"
          className="header-icon-btn"
          aria-label="User Profile"
          onClick={() => navigate("/profile")}
        >
          <CircleUserRound size={26} />
        </button>
      </div>
    </header>
  );
}

export default Header;
