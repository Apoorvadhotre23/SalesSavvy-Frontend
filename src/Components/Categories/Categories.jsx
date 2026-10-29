import "./Categories.css";

function Categories({ onCategorySelect }) {
  const categories = [
    {
      id: 1,
      name: "Shirts",
      image: "/categories/Shirts.png",
    },
    {
      id: 2,
      name: "Shoes",
      image: "/categories/Sneaker.png",
    },
    {
      id: 3,
      name: "Electronics",
      image: "/categories/Electronics.png",
    },
    {
      id: 4,
      name: "Pants",
      image: "/categories/Pants.jpg"
    }
  ];

  return (
    <section className="categories-section">
      <h2>Shop by Category</h2>

      <div className="categories-container">
        {categories.map((category) => (
          <button
            type="button"
            className="category-card"
            key={category.id}
            onClick={() => {
              if (category.name === "Shirts") {
                onCategorySelect(category.name);
              }
            }}
          >
            <img
              src={category.image}
              alt={category.name}
              className="category-image"
            />

            <h3>{category.name}</h3>
          </button>
        ))}
      </div>
    </section>
  );
}

export default Categories;
