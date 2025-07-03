import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/home';
import LoginPage from './pages/login';
import SignupPage from './pages/signup';
import Header from './components/header';
import AdminPage from './pages/adminPage';
import TestPage from './pages/testPage'; 

function App() {
  
  return (
    <BrowserRouter>
    <div >
      <Toaster position="top-right" />
      <Header></Header>      
      <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/test" element={<TestPage/>} />
      <Route path="/admin/*" element={<AdminPage/>} />
      <Route path="/*" element={<h1>404 Not Found</h1>} />
      </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
