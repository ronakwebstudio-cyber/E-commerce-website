import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import CartDrawer from "./components/CartDrawer.jsx";
import Footer from "./components/Footer.jsx";
import Header from "./components/Header.jsx";
import CartPage from "./pages/CartPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import ProductDetailPage from "./pages/ProductDetailPage.jsx";

function App() {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="app-shell">
      <Header onOpenCart={() => setCartOpen(true)} />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:slug" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </main>
      <Footer />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}

export default App;
