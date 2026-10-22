import Categories from "../../Components/Categories/Categories"
import Header from "../../Components/Header/Header"
import SearchBar from "../../Components/SearchBar/SearchBar"


function Home() {
  return (
    <div>
        <Header/>
        <SearchBar/>
        <Categories/>
    </div>
  )
}

export default Home