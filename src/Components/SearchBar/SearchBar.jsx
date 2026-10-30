import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchBar.css";

function SearchBar() {
  const [keyword, setKeyword] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!keyword.trim()) {
      return;
    }

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `http://localhost:8080/api/products/search?keyword=${encodeURIComponent(keyword.trim())}`,
          {
            credentials: "include",
            signal: controller.signal,
          },
        );

        if (response.status === 401) {
          setError("Session expired. Please login again.");
          setProducts([]);
          return;
        }

        if (!response.ok) {
          throw new Error("Unable to search products");
        }

        const data = await response.json();
        setProducts(data.products || []);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError("Something went wrong while searching.");
          setProducts([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [keyword]);

  const handleProductClick = (productId) => {
    setKeyword("");
    setProducts([]);
    navigate(`/products/${productId}`);
  };

  return (
    <div className="search-wrapper">
      <div className="search-box">
        <input
          type="text"
          placeholder="Search for shirts, mobiles, pants..."
          value={keyword}
          onChange={(e) => {
            const value = e.target.value;
            setKeyword(value);

            if (!value.trim()) {
              setProducts([]);
              setError("");
              setLoading(false);
            }
          }}
        />
      </div>

      {keyword.trim() && (
        <div className="search-results">
          {loading ? (
            <p>Searching...</p>
          ) : error ? (
            <p>{error}</p>
          ) : products.length === 0 ? (
            <p>No products found</p>
          ) : (
            products.map((product) => (
              <div
                className="search-result-item"
                key={product.productId}
                onClick={() => handleProductClick(product.productId)}
              >
                {product.image?.[0] && (
                  <img src={product.image[0]} alt={product.name} />
                )}

                <div>
                  <h4>{product.name}</h4>
                  <p>₹{Number(product.price).toLocaleString("en-IN")}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
