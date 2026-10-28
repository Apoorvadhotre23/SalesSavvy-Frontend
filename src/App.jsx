import SignupPage from './Pages/SignupPage/SignupPage.jsx'
import {BrowserRouter, Route, Routes } from 'react-router-dom'
import LoginPage from './Pages/LoginPage/LoginPage.jsx'
import Success from './Pages/Sucess/Success.jsx'
import LoginFailed from './Pages/LoginFailed/LoginFailed.jsx'
import Home from './Pages/HomePage/Home.jsx'
import Profile from './Pages/ProfilePage/Profile.jsx'

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
      <Route path='/profile' element={<Profile/>}/>
     </Routes>
  </BrowserRouter>
    </div>
  )
}

export default App