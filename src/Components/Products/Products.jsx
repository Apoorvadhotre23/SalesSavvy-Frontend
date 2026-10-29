import { useEffect, useState } from "react";
import "./Products.css";
import { useNavigate } from "react-router-dom";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/products?category=Shirts",
          {
            method: "GET",
            credentials: "include",
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error(
            response.status === 401
              ? "Please log in to view products."
              : "Unable to load products.",
          );
        }

        const data = await response.json();
        setProducts(data.products || []);
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

    fetchProducts();

    return () => controller.abort();
  }, []);

  if (loading) {
    return <p className="products-message">Loading shirts...</p>;
  }

  if (error) {
    return <p className="products-message">{error}</p>;
  }

  return (
    <section className="products-section">
      <div className="products-heading">
        <div>
          <h2>Shirts Collection</h2>
          <p>Explore our collection of stylish shirts</p>
        </div>
        <span className="products-count">{products.length} Products</span>
      </div>

      {products.length === 0 ? (
        <p>No shirts available.</p>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <article className="product-card" key={product.productId}>
              <div className="product-image-wrapper">
                {product.image?.length > 0 && (
                  <img
                    src={product.image[0]}
                    alt={product.name}
                    className="product-image"
                    loading="lazy"
                  />
                )}
              </div>

              <div className="product-info">
                <h3>{product.name}</h3>

                <p className="product-description">{product.description}</p>

                <div className="product-bottom">
                  <p className="product-price">
                    ₹{Number(product.price).toLocaleString("en-IN")}
                  </p>

                  <span
                    className={
                      product.stock > 0
                        ? "stock-available"
                        : "stock-unavailable"
                    }
                  >
                    {product.stock > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                </div>

                <button
                  type="button"
                  className="product-view-btn"
                  onClick={() => navigate(`/products/${product.productId}`)}
                >
                  View Details
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default Products;
