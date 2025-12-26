import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Header from './components/header'
import ProductCard from './components/productCard'
import HomePage from './pages/home'
import LoginPage from './pages/login'
import AdminPage from './pages/adminPage'
import ProductPage from './pages/client/productPage'
import TestPage from './pages/testPage'
import PaymentPage from './pages/client/payment'
import { Toaster } from 'react-hot-toast'
import RegisterPage from './pages/register'
import { GoogleOAuthProvider } from '@react-oauth/google';
import ForgetPasswordPage from './pages/forgetPassword'

function App() {
 

  return (
    <GoogleOAuthProvider clientId="748023442531-0foobb1veeh83cgmdd1g7s0gjh9mq7db.apps.googleusercontent.com">
    <BrowserRouter>
      <div >
        <Toaster position='top-right'/>
        {/* <Header/> */}
        <Routes path="/*">
          <Route path='/login' element={<LoginPage/>}/>
          <Route path="/forget" element={<ForgetPasswordPage/>}/>
          <Route path="/register" element={<RegisterPage/>}/>
          <Route path="/product/:id" element={<ProductPage/>}/>
          <Route path="/payment" element={<PaymentPage/>}/>
          <Route path="/testing" element={<TestPage/>}/>
          <Route path='/admin/*' element={<AdminPage/>}/>
         <Route path='/*' element={<HomePage/>}/>
        </Routes>
      </div>
    </BrowserRouter>
   </GoogleOAuthProvider>
  )
}

export default App
