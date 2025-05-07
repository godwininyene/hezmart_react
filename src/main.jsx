import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CartProvider } from './components/contexts/CartContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <CartProvider>
    <App />
   </CartProvider>
    <ToastContainer position="top-right" autoClose={5000} />
  </StrictMode>,
)
