
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import "./Cart.css";

function Cart() {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchCartItems = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/cart",
          {
            method: "GET",
            credentials: "include",
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error(
            response.status === 401
              ? "Please login to view your cart."
              : "Unable to load cart items."
          );
        }

        const data = await response.json();
        setCartItems(data.cartItems || []);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchCartItems();

    return () => controller.abort();
  }, []);

  const totalPrice = cartItems.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0
  );

  if (loading) {
    return <p className="cart-message">Loading your cart...</p>;
  }

  if (error) {
    return <p className="cart-message">{error}</p>;
  }

  return (
    <div className="cart-page">
      <div className="cart-container">

        <button
          className="cart-back-btn"
          onClick={() => navigate("/home")}
        >
          <ArrowLeft size={18} />
          Continue Shopping
        </button>

        <h1>My Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <ShoppingCart size={48} />
            <h2>Your cart is empty</h2>
            <p>Explore our products and add something you like.</p>
            <button onClick={() => navigate("/home")}>
              Shop Now
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map((item) => (
                <div className="cart-item" key={item.cartItemId}>
                  <div className="cart-item-info">
                    <h3>{item.name}</h3>
                    <p className="cart-item-price">
                      ₹{Number(item.price).toLocaleString("en-IN")}
                    </p>
                    <p>Quantity: {item.quantity}</p>
                    <p>
                      Subtotal: ₹
                      {(Number(item.price) * item.quantity)
                        .toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h2>Order Summary</h2>
              <div className="cart-total">
                <span>Total</span>
                <strong>
                  ₹{totalPrice.toLocaleString("en-IN")}
                </strong>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default Cart;
