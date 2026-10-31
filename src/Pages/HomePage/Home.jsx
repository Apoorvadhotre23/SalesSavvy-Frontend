import Categories from "../../Components/Categories/Categories";
import Products from "../../Components/Products/Products";
import SearchBar from "../../Components/SearchBar/SearchBar";
import { useRef } from "react";

function Home() {
  const shirtsRef = useRef(null);

  const handleShirtsClick = () => {
    shirtsRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div>
      <SearchBar />
      <Categories onCategorySelect={handleShirtsClick} />

      <div ref={shirtsRef}>
        <Products />
      </div>
    </div>
  );
}

export default Home;