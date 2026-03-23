import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import Home from './pages/Home';
import Products from './pages/Products';
import About from './pages/About';
import Benefits from './pages/Benefits';
import Gallery from './pages/Gallery';
import Reviews from './pages/Reviews';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Auth from './pages/Auth';
import MyOrders from './pages/MyOrders';
import Admin from './pages/Admin';
import { useIsLoggedIn } from './authStore';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isLoggedIn = useIsLoggedIn();
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <HelmetProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/login" element={<Auth />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/about" element={<About />} />
              <Route path="/benefits" element={<Benefits />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/cart" element={<Cart />} />
              <Route
                path="/my-orders"
                element={
                  <ProtectedRoute>
                    <MyOrders />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
          <WhatsAppButton />
        </div>
      </Router>
    </HelmetProvider>
  );
}
