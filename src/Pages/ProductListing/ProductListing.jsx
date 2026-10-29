
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import "../../Components/Products/Products.css";
import "./ProductListing.css";

function ProductListing() {
  const { categoryName } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
 

  const allowedCategories = ["Pants", "Accesories", "Mobiles"];

const category = allowedCategories.find(
  (item) => item.toLowerCase() === categoryName?.toLowerCase()
);


  useEffect(() => {
    if (!category) return;

    const controller = new AbortController();

    const fetchProducts = async () => {
      setLoading(true);
      setError("");
      setProducts([]);

      try {
        const response = await fetch(
          `http://localhost:8080/api/products?category=${encodeURIComponent(category)}`,
          {
            method: "GET",
            credentials: "include",
            signal: controller.signal,
          }
        );

        if (response.status === 401) {
          throw new Error("Please log in to view products.");
        }

        if (!response.ok) {
          throw new Error("Unable to load products.");
        }

        const data = await response.json();

        if (!controller.signal.aborted) {
          setProducts(data.products || []);
        }
      } catch (err) {
        if (err.name !== "AbortError" && !controller.signal.aborted) {
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
  }, [category]);

  return (
    <main className="listing-page">
      <div className="listing-container">
        <button
          type="button"
          className="listing-back-btn"
          onClick={() => navigate("/home")}
        >
          <ArrowLeft size={19} />
          Back to Home
        </button>

        {!category ? (
          <p>Category not found.</p>
        ) : loading ? (
          <p>Loading {category.toLowerCase()}...</p>
        ) : error ? (
          <div className="listing-error">
            <p>{error}</p>
            {error === "Please log in to view products." && (
              <button onClick={() => navigate("/login")}>
                Login Again
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="products-heading">
              <div>
                <h2>{category} Collection</h2>
                <p>Explore our collection of {category.toLowerCase()}</p>
              </div>

              <span className="products-count">
                {products.length} Products
              </span>
            </div>

            {products.length === 0 ? (
              <p>No products available in this category.</p>
            ) : (
              <div className="products-grid">
                {products.map((product) => (
                  <article
                    className="product-card"
                    key={product.productId}
                  >
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

                      <p className="product-description">
                        {product.description}
                      </p>

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
                          {product.stock > 0
                            ? "In Stock"
                            : "Out of Stock"}
                        </span>
                      </div>

                      <button
                        type="button"
                        className="product-view-btn"
                        onClick={() =>
                          navigate(`/products/${product.productId}`)
                        }
                      >
                        View Details
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

export default ProductListing;
