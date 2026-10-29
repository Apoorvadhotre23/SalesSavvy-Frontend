
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
          }
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

  if (loading) {
    return <p className="details-message">Loading product details...</p>;
  }

  if (error) {
    return (
      <div className="details-message">
        <p>{error}</p>
        <button onClick={() => navigate("/home")}>
          Back to Home
        </button>
      </div>
    );
  }

  if (!product) return null;

  const images = product.image || [];

  return (
    <div className="product-details-page">
      <div className="product-details-container">

        <button
          className="details-back-btn"
          onClick={() => navigate("/home")}
        >
          <ArrowLeft size={19} />
          Back to Home
        </button>

        <div className="details-layout">

          <div className="details-gallery">
            <div className="details-main-image">
              {images.length > 0 ? (
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                />
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
                product.stock > 0
                  ? "details-in-stock"
                  : "details-out-stock"
              }
            >
              {product.stock > 0
                ? `In Stock (${product.stock} available)`
                : "Out of Stock"}
            </span>

            <h3>Product Description</h3>
            <p className="details-description">
              {product.description}
            </p>

            <button
              className="details-cart-btn"
              disabled
              title="Shopping cart will be implemented next"
            >
              <ShoppingCart size={20} />
              Add to Cart — Coming Soon
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
