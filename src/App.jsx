import SignupPage from './Pages/SignupPage/SignupPage.jsx'
import {BrowserRouter, Route, Routes } from 'react-router-dom'
import LoginPage from './Pages/LoginPage/LoginPage.jsx'

function App() {
  return (
    <div>
  <BrowserRouter>
     <Routes>
      <Route path='/' element={<SignupPage/>}/>
      <Route path='/login' element={<LoginPage/>}/>
     </Routes>
  </BrowserRouter>,
    </div>
  )
}

export default App