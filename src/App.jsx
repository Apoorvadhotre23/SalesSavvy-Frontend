import SignupPage from './Pages/SignupPage/SignupPage.jsx'
import {BrowserRouter, Route, Routes } from 'react-router-dom'
import LoginPage from './Pages/LoginPage/LoginPage.jsx'
import Success from './Pages/Sucess/Success.jsx'
import LoginFailed from './Pages/LoginFailed/LoginFailed.jsx'
import Home from './Pages/HomePage/Home.jsx'

function App() {
  return (
    <div>
  <BrowserRouter>
     <Routes>
      <Route path='/' element={<SignupPage/>}/>
      <Route path='/success' element={<Success/>} />
      <Route path='/login' element={<LoginPage/>}/>
      <Route path='/login-failed' element={<LoginFailed/>}/>
      <Route path='/home' element = {<Home/>}/>
     </Routes>
  </BrowserRouter>
    </div>
  )
}

export default App