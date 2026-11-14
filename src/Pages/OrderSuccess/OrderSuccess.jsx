
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, ShoppingBag } from "lucide-react";
import "./OrderSuccess.css";

function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  const order = location.state?.order;

  // If someone opens this page directly
  if (!order) {
    return (
      <div className="order-success-page">
        <div className="order-success-card">
          <h2>Order details not available</h2>

          <button
            className="continue-shopping-btn"
            onClick={() => navigate("/home")}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-success-page">

      <div className="order-success-card">

        <CheckCircle
          className="order-success-icon"
          size={75}
        />

        <h1>Order Placed Successfully!</h1>

        <p className="order-success-message">
          Thank you for shopping with SaleSavvy.
          Your order has been placed successfully.
        </p>

        {/* Order Details */}

        <div className="success-order-details">

          <h2>Order Details</h2>

          <div className="success-detail">
            <span>Order ID</span>
            <strong>{order.orderId}</strong>
          </div>

          <div className="success-detail">
            <span>Total Amount</span>
            <strong>
              ₹{Number(order.totalAmount).toLocaleString("en-IN")}
            </strong>
          </div>

          <div className="success-detail">
            <span>Payment Method</span>
            <strong>{order.paymentMethod}</strong>
          </div>

          <div className="success-detail">
            <span>Payment Status</span>
            <strong>{order.paymentStatus}</strong>
          </div>

          <div className="success-detail">
            <span>Order Status</span>
            <strong>{order.status}</strong>
          </div>

        </div>

        {/* Delivery Address */}

        <div className="order-delivery-info">

          <h3>Delivery Address</h3>

          <p>{order.recipientName}</p>
          <p>{order.addressLine}</p>

          <p>
            {order.city}, {order.state} - {order.postalCode}
          </p>

          <p>Phone: {order.phone}</p>

        </div>

        {/* COD Message */}

        <p className="order-cod-message">
          Payment will be collected upon delivery.
        </p>

        {/* Continue Shopping */}

        <button
          className="continue-shopping-btn"
          onClick={() => navigate("/home")}
        >
          <ShoppingBag size={18} />
          Continue Shopping
        </button>

      </div>

    </div>
  );
}

export default OrderSuccess;
