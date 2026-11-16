
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";

function Checkout() {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const [address, setAddress] = useState({
    recipientName: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    postalCode: "",
  });

  // Fetch cart items
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/cart",
          {
            credentials: "include",
          }
        );

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

  // Handle delivery address changes
  const handleChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value,
    });
  };

  // Calculate total price
  const totalPrice = cartItems.reduce(
    (total, item) =>
      total + Number(item.price) * item.quantity,
    0
  );

  // 1. Existing COD checkout
  const handlePlaceOrder = async () => {
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
          typeof data === "string"
            ? data
            : "Unable to place order."
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

  // 2. Razorpay payment
  const handleRazorpayPayment = async () => {
    setPlacingOrder(true);
    setError("");

    try {
      // Check whether Razorpay script is loaded
      if (!window.Razorpay) {
        throw new Error(
          "Razorpay Checkout is not loaded. Please refresh the page."
        );
      }

      // Create Razorpay order through backend
      const createResponse = await fetch(
        "http://localhost:8080/api/payment/create-order",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(address),
        }
      );

      const orderData = await createResponse.json();

      if (!createResponse.ok) {
        throw new Error(
          typeof orderData === "string"
            ? orderData
            : "Unable to create payment order."
        );
      }

      // Configure Razorpay Checkout options
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "SalesSavvy",
        description: "Shopping Payment",
        order_id: orderData.razorpayOrderId,

        // Customer details
        prefill: {
          name: address.recipientName,
          contact: address.phone,
        },

        // Payment success handler
        handler: async function (paymentResponse) {
          try {
            // Verify payment through backend
            const verifyResponse = await fetch(
              "http://localhost:8080/api/payment/verify",
              {
                method: "POST",
                credentials: "include",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  razorpay_order_id:
                    paymentResponse.razorpay_order_id,

                  razorpay_payment_id:
                    paymentResponse.razorpay_payment_id,

                  razorpay_signature:
                    paymentResponse.razorpay_signature,
                }),
              }
            );

            const verifiedOrder = await verifyResponse.json();

            if (!verifyResponse.ok) {
              throw new Error(
                typeof verifiedOrder === "string"
                  ? verifiedOrder
                  : "Payment verification failed."
              );
            }

            // Update cart and navigate after verification
            window.dispatchEvent(new Event("cartUpdated"));

            navigate("/order-success", {
              state: { order: verifiedOrder },
            });

          } catch (err) {
            setError(err.message);
            setPlacingOrder(false);
          }
        },

        // Customer details in Razorpay
        theme: {
          color: "#2874f0",
        },

        // Close payment window
        modal: {
          ondismiss: function () {
            setPlacingOrder(false);
          },
        },
      };

      // Initialize Razorpay and open payment window
      const razorpay = new window.Razorpay(options);

      // Handle payment failure
      razorpay.on("payment.failed", function (response) {
        setError(
          response.error.description ||
          "Payment failed. Please try again."
        );

        setPlacingOrder(false);
      });

      razorpay.open();

    } catch (err) {
      setError(err.message);
      setPlacingOrder(false);
    }
  };

  // 3. Select checkout method
  const handleCheckout = (e) => {
    e.preventDefault();

    if (paymentMethod === "COD") {
      handlePlaceOrder();
    } else {
      handleRazorpayPayment();
    }
  };

  if (loading) {
    return <p>Loading checkout...</p>;
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">

        <h1>Checkout</h1>

        {error && (
          <p className="checkout-error">{error}</p>
        )}

        <div className="checkout-layout">

          {/* Delivery Address */}
          <form
            className="checkout-form"
            onSubmit={handleCheckout}
          >

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

            {/* COD Option */}
            <div className="payment-option">
              <input
                type="radio"
                name="paymentMethod"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={(e) =>
                  setPaymentMethod(e.target.value)
                }
              />

              <label>Cash on Delivery (COD)</label>
            </div>

            {/* Razorpay Option */}
            <div className="payment-option">
              <input
                type="radio"
                name="paymentMethod"
                value="RAZORPAY"
                checked={paymentMethod === "RAZORPAY"}
                onChange={(e) =>
                  setPaymentMethod(e.target.value)
                }
              />

              <label>Pay Online (Razorpay)</label>
            </div>

            <button
              type="submit"
              className="place-order-btn"
              disabled={placingOrder}
            >
              {placingOrder
                ? "Processing..."
                : paymentMethod === "COD"
                  ? "Place Order"
                  : "Pay Now"}
            </button>

          </form>

          {/* Order Summary */}
          <div className="checkout-summary">

            <h2>Order Summary</h2>

            {cartItems.map((item) => (
              <div
                className="checkout-item"
                key={item.cartItemId}
              >
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
