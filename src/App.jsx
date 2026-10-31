import SignupPage from './Pages/SignupPage/SignupPage.jsx'
import {BrowserRouter, Route, Routes } from 'react-router-dom'
import LoginPage from './Pages/LoginPage/LoginPage.jsx'
import Success from './Pages/Sucess/Success.jsx'
import LoginFailed from './Pages/LoginFailed/LoginFailed.jsx'
import Home from './Pages/HomePage/Home.jsx'
import Profile from './Pages/ProfilePage/Profile.jsx'
import ProductDetails from "./Pages/ProductDetails/ProductDetails";
import ProductListing from "./Pages/ProductListing/ProductListing";
import Header from './Components/Header/Header.jsx'
import Cart from "./Pages/Cart/Cart";

function App() {
  return (
    <div>
      
  <BrowserRouter>
     <Header/>
     <Routes>
      <Route path='/' element={<SignupPage/>}/>
      <Route path='/success' element={<Success/>} />
      <Route path='/login' element={<LoginPage/>}/>
      <Route path='/login-failed' element={<LoginFailed/>}/>
      <Route path='/home' element = {<Home/>}/>
      <Route path='/profile' element={<Profile/>}/>
      <Route path="/products/:productId" element={<ProductDetails />} />
      <Route path="/category/:categoryName" element={<ProductListing />}/>
      <Route path="/cart" element={<Cart />} />
     </Routes>
  </BrowserRouter>
    </div>
  )
}

export default App