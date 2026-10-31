import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, CircleUserRound } from "lucide-react";
import "./Header.css";

function Header() {
  const navigate = useNavigate();

  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/cart/count", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch cart count");
        }

        const data = await response.json();
        setCartCount(data.count);
      } catch (error) {
        console.error("Cart count error:", error);
      }
    };

    fetchCartCount();

    window.addEventListener("cartUpdated", fetchCartCount);
    return () => {
      window.removeEventListener("cartUpdated", fetchCartCount);
    };
  }, []);

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
          aria-label={`Shopping Cart, ${cartCount} items`}
          onClick={() => navigate("/cart")}
        >
          <ShoppingCart size={26} />

          {cartCount > 0 && (
            <span className="cart-count-badge">{cartCount}</span>
          )}
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
