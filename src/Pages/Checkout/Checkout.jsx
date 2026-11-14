
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";

function Checkout() {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState("");

  const [address, setAddress] = useState({
    recipientName: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    postalCode: "",
  });

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/cart", {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Unable to load cart.");
        }

        const data = await response.json();
        setCartItems(data.cartItems || []);

        if (!data.cartItems || data.cartItems.length === 0) {
          navigate("/cart");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [navigate]);

  const handleChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value,
    });
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0
  );

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    setPlacingOrder(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:8080/api/orders/checkout",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(address),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data === "string" ? data : "Unable to place order."
        );
      }

      window.dispatchEvent(new Event("cartUpdated"));

      navigate("/order-success", {
        state: { order: data },
      });

    } catch (err) {
      setError(err.message);
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return <p>Loading checkout...</p>;
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">

        <h1>Checkout</h1>

        {error && <p className="checkout-error">{error}</p>}

        <div className="checkout-layout">

          {/* Delivery Address */}
          <form className="checkout-form" onSubmit={handlePlaceOrder}>

            <h2>Delivery Details</h2>

            <input
              type="text"
              name="recipientName"
              placeholder="Recipient Name"
              value={address.recipientName}
              onChange={handleChange}
              required
            />

            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={address.phone}
              onChange={handleChange}
              pattern="[0-9]{10}"
              title="Enter a 10-digit phone number"
              required
            />

            <textarea
              name="addressLine"
              placeholder="Address"
              value={address.addressLine}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="city"
              placeholder="City"
              value={address.city}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="state"
              placeholder="State"
              value={address.state}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="postalCode"
              placeholder="Postal Code"
              value={address.postalCode}
              onChange={handleChange}
              pattern="[0-9]{6}"
              title="Enter a 6-digit postal code"
              required
            />

            <h2>Payment Method</h2>

            <div className="payment-option">
              <input type="radio" checked readOnly />
              <label>Cash on Delivery (COD)</label>
            </div>

            <button
              type="submit"
              className="place-order-btn"
              disabled={placingOrder}
            >
              {placingOrder ? "Placing Order..." : "Place Order"}
            </button>

          </form>

          {/* Order Summary */}
          <div className="checkout-summary">

            <h2>Order Summary</h2>

            {cartItems.map((item) => (
              <div className="checkout-item" key={item.cartItemId}>
                <span>
                  {item.name} × {item.quantity}
                </span>

                <strong>
                  ₹{(
                    Number(item.price) * item.quantity
                  ).toLocaleString("en-IN")}
                </strong>
              </div>
            ))}

            <div className="checkout-total">
              <span>Total Amount</span>
              <strong>
                ₹{totalPrice.toLocaleString("en-IN")}
              </strong>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default Checkout;
