import { Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Footer from "./components/Footer";

import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Wishlist from "./components/Wishlist";
import Checkout from "./pages/Checkout";
import PaySuccess from "./pages/PaySuccess";
import PayCancel from "./pages/PayCancel";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Main content grows to fill space */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/pay/success" element={<PaySuccess />} />
          <Route path="/pay/cancel" element={<PayCancel />} />
        </Routes>
      </main>

      <Footer />
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}

export default App;
