import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import "./ProductDetails.css";

function ProductDetails() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchProduct = async () => {
      setLoading(true);
      setError("");
      setProduct(null);
      setSelectedImage(0);

      try {
        const response = await fetch(
          `http://localhost:8080/api/products/${productId}`,
          {
            method: "GET",
            credentials: "include",
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Please login to view this product.");
          }

          if (response.status === 404) {
            throw new Error("Product not found.");
          }

          throw new Error("Unable to load product details.");
        }

        const data = await response.json();

        if (!controller.signal.aborted) {
          setProduct(data);
        }
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

    fetchProduct();

    return () => controller.abort();
  }, [productId]);

  const handleAddToCart = async () => {
    if (!product || addingToCart || product.stock <= 0) return;

    setAddingToCart(true);
    setCartMessage("");

    try {
      const response = await fetch("http://localhost:8080/api/cart/add", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.productId,
          quantity: 1,
        }),
      });

      const data = await response.json();

      if (response.status === 401) {
        setCartMessage("Session expired. Please login again.");
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || "Unable to add product to cart.");
      }

      setCartMessage("Product added to cart successfully!");
    } catch (err) {
      setCartMessage(err.message || "Something went wrong.");
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return <p className="details-message">Loading product details...</p>;
  }

  if (error) {
    return (
      <div className="details-message">
        <p>{error}</p>
        <button onClick={() => navigate("/home")}>Back to Home</button>
      </div>
    );
  }

  if (!product) return null;

  const images = product.image || [];

  return (
    <div className="product-details-page">
      <div className="product-details-container">
        <button className="details-back-btn" onClick={() => navigate("/home")}>
          <ArrowLeft size={19} />
          Back to Home
        </button>

        <div className="details-layout">
          <div className="details-gallery">
            <div className="details-main-image">
              {images.length > 0 ? (
                <img src={images[selectedImage]} alt={product.name} />
              ) : (
                <p>No image available</p>
              )}
            </div>

            {images.length > 1 && (
              <div className="details-thumbnails">
                {images.map((image, index) => (
                  <button
                    key={index}
                    className={
                      selectedImage === index
                        ? "details-thumbnail active"
                        : "details-thumbnail"
                    }
                    onClick={() => setSelectedImage(index)}
                  >
                    <img
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="details-info">
            <h1>{product.name}</h1>

            <p className="details-price">
              ₹{Number(product.price).toLocaleString("en-IN")}
            </p>

            <span
              className={
                product.stock > 0 ? "details-in-stock" : "details-out-stock"
              }
            >
              {product.stock > 0
                ? `In Stock (${product.stock} available)`
                : "Out of Stock"}
            </span>

            <h3>Product Description</h3>
            <p className="details-description">{product.description}</p>

            <button
              className="details-cart-btn"
              onClick={handleAddToCart}
              disabled={addingToCart || product.stock <= 0}>
              <ShoppingCart size={20} />
              {addingToCart ? "Adding..." : "Add to Cart"}
            </button>

            {cartMessage && (
              <p className="details-cart-message" role="status">
                {cartMessage}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
