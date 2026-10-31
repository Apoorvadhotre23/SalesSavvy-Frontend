import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import "./Cart.css";
import { Trash2 } from "lucide-react";

function Cart() {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchCartItems = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/cart", {
          method: "GET",
          credentials: "include",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            response.status === 401
              ? "Please login to view your cart."
              : "Unable to load cart items.",
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

  // -------------------- update cart ------------------

  const [updatingId, setUpdatingId] = useState(null);

  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1 || updatingId !== null) return;

    setUpdatingId(cartItemId);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:8080/api/cart/update/${cartItemId}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quantity: newQuantity,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Unable to update quantity. Check available stock.");
      }

      setCartItems((previousItems) =>
        previousItems.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: newQuantity }
            : item,
        ),
      );

      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  // ----------------------------Remove button--------------------------//

  const removeFromCart = async (cartItemId) => {
    if (updatingId !== null) return;

    setUpdatingId(cartItemId);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:8080/api/cart/remove/${cartItemId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error("Unable to remove product from cart.");
      }

      setCartItems((previousItems) =>
        previousItems.filter((item) => item.cartItemId !== cartItemId),
      );

      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  // -------------------------------------------------------------------//

  const totalPrice = cartItems.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0,
  );

  // -------------------------------------------------------------------//

  if (loading) {
    return <p className="cart-message">Loading your cart...</p>;
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <button className="cart-back-btn" onClick={() => navigate("/home")}>
          <ArrowLeft size={18} />
          Continue Shopping
        </button>

        <h1>My Shopping Cart</h1>

        {error && (
          <p className="cart-message" role="alert">
            {error}
          </p>
        )}

        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <ShoppingCart size={48} />
            <h2>Your cart is empty</h2>
            <p>Explore our products and add something you like.</p>
            <button onClick={() => navigate("/home")}>Shop Now</button>
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

                    <div className="cart-actions">
                      <div className="cart-quantity">
                        <button
                          onClick={() =>
                            updateQuantity(item.cartItemId, item.quantity - 1)
                          }
                          disabled={updatingId !== null || item.quantity <= 1}
                        >
                          −
                        </button>

                        <span>{item.quantity}</span>

                        <button
                          onClick={() =>
                            updateQuantity(item.cartItemId, item.quantity + 1)
                          }
                          disabled={
                            updatingId !== null || item.quantity >= item.stock
                          }
                        >
                          +
                        </button>
                      </div>

                      <button
                        className="cart-remove-btn"
                        onClick={() => removeFromCart(item.cartItemId)}
                        disabled={updatingId !== null}
                        aria-label={`Remove ${item.name} from cart`}
                        title="Remove from cart"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <p>
                      Subtotal: ₹
                      {(Number(item.price) * item.quantity).toLocaleString(
                        "en-IN",
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h2>Order Summary</h2>
              <div className="cart-total">
                <span>Total</span>
                <strong>₹{totalPrice.toLocaleString("en-IN")}</strong>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Cart;
