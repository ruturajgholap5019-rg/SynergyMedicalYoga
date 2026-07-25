import React, { useEffect, useState } from 'react';
import TopBar from './components/TopBar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import ProductDetailModal from './components/ProductDetailModal';
import CheckoutModal from './components/CheckoutModal';

// Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import FindCentresPage from './pages/FindCentresPage';
import ShopPage from './pages/ShopPage';
import ContactPage from './pages/ContactPage';
import AccountPage from './pages/AccountPage';
import ProductDetailPage from './pages/ProductDetailPage';
import { api } from './lib/api';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [cart, setCart] = useState([]);
  const [guestCart, setGuestCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Cart operations
  const saveGuestCart = (nextCart) => {
    setGuestCart(nextCart);
    window.localStorage.setItem('synergyGuestCart', JSON.stringify(nextCart));
  };

  const handleAddToCart = async (product, selectedSize, quantity = 1) => {
    const productId = product._id || product.id;
    const normalizedSize = selectedSize || 'Standard';

    if (!currentUser) {
      const updatedItems = [...guestCart];
      const itemIndex = updatedItems.findIndex(
        (item) => item.productId === productId && item.selectedSize === normalizedSize
      );

      if (itemIndex > -1) {
        updatedItems[itemIndex].quantity += quantity;
      } else {
        updatedItems.push({
          id: productId,
          productId,
          name: product.name,
          price: product.price,
          image: product.images?.[0] || product.image,
          selectedSize: normalizedSize,
          quantity,
        });
      }

      saveGuestCart(updatedItems);
      showToast('Item saved to cart. Log in to complete your purchase.');
      return;
    }

    const payload = {
      productId,
      selectedSize: normalizedSize,
      quantity,
    };

    try {
      const response = await api.addToCart(payload);
      const cartItems = response.data.items.map((item) => ({
        id: item.productId._id,
        name: item.productId.name,
        price: item.productId.price,
        image: item.productId.images?.[0] || item.productId.image,
        selectedSize: item.selectedSize,
        quantity: item.quantity,
      }));
      setCart(cartItems);
      showToast(`Added ${product.name} (${payload.selectedSize}) to cart!`);
    } catch (error) {
      console.error(error);
      showToast('Unable to add product to cart.');
    }
  };

  const handleUpdateQuantity = async (id, selectedSize, newQty) => {
    if (!currentUser) {
      const updatedItems = guestCart.map((item) =>
        item.productId === id && item.selectedSize === selectedSize
          ? { ...item, quantity: Math.max(1, newQty) }
          : item
      );
      saveGuestCart(updatedItems);
      return;
    }

    if (newQty <= 0) {
      await handleRemoveItem(id, selectedSize);
      return;
    }

    try {
      const response = await api.updateCartItem({ productId: id, selectedSize, quantity: newQty });
      const cartItems = response.data.items.map((item) => ({
        id: item.productId._id,
        name: item.productId.name,
        price: item.productId.price,
        image: item.productId.images?.[0] || item.productId.image,
        selectedSize: item.selectedSize,
        quantity: item.quantity,
      }));
      setCart(cartItems);
    } catch (error) {
      console.error(error);
      showToast('Unable to update cart quantity.');
    }
  };

  const handleRemoveItem = async (id, selectedSize) => {
    if (!currentUser) {
      const updatedItems = guestCart.filter(
        (item) => !(item.productId === id && item.selectedSize === selectedSize)
      );
      saveGuestCart(updatedItems);
      showToast('Item removed from cart.');
      return;
    }

    try {
      const response = await api.removeFromCart({ productId: id, selectedSize });
      const cartItems = response.data.items.map((item) => ({
        id: item.productId._id,
        name: item.productId.name,
        price: item.productId.price,
        image: item.productId.images?.[0] || item.productId.image,
        selectedSize: item.selectedSize,
        quantity: item.quantity,
      }));
      setCart(cartItems);
      showToast('Item removed from cart.');
    } catch (error) {
      console.error(error);
      showToast('Unable to remove item from cart.');
    }
  };

  const handleOrderComplete = () => {
    setCart([]);
    showToast('🎉 Order placed successfully! Check your email for details.');
  };

  const handleAuthSuccess = async (user) => {
    setCurrentUser(user);
    try {
      if (guestCart.length > 0) {
        const response = await api.mergeCart(guestCart);
        const cartItems = response.data.items.map((item) => ({
          id: item.productId._id,
          name: item.productId.name,
          price: item.productId.price,
          image: item.productId.images?.[0] || item.productId.image,
          selectedSize: item.selectedSize,
          quantity: item.quantity,
        }));
        setCart(cartItems);
        saveGuestCart([]);
      } else {
        const cartResponse = await api.getCart();
        const cartItems = cartResponse.data.items.map((item) => ({
          id: item.productId._id,
          name: item.productId.name,
          price: item.productId.price,
          image: item.productId.images?.[0] || item.productId.image,
          selectedSize: item.selectedSize,
          quantity: item.quantity,
        }));
        setCart(cartItems);
      }
    } catch (error) {
      console.error(error);
      setCart([]);
    }
  };

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (error) {
      console.error(error);
    } finally {
      setCurrentUser(null);
      setCart([]);
      saveGuestCart([]);
      setActivePage('home');
      showToast('Logged out successfully.');
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3000);
  };

  const displayCart = currentUser ? cart : guestCart;
  const cartCount = displayCart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = displayCart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const storedGuestCart = window.localStorage.getItem('synergyGuestCart');
        if (storedGuestCart) {
          setGuestCart(JSON.parse(storedGuestCart));
        }

        const profile = await api.getProfile();
        setCurrentUser(profile.user);
        const cartResponse = await api.getCart();
        const cartItems = cartResponse.data.items.map((item) => ({
          id: item.productId._id,
          name: item.productId.name,
          price: item.productId.price,
          image: item.productId.images?.[0] || item.productId.image,
          selectedSize: item.selectedSize,
          quantity: item.quantity,
        }));
        setCart(cartItems);
      } catch (err) {
        setCurrentUser(null);
      }
    };

    loadSession();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans selection:bg-[#065750] selection:text-white">
      
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#065750] text-white text-xs font-bold px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-teal-400/40 animate-in slide-in-from-bottom duration-300">
          <span className="w-2 h-2 bg-amber-400 rounded-full animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Contact Bar */}
      <TopBar
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        activePage={activePage}
        setActivePage={setActivePage}
      />

      {/* Main Responsive Header Navigation */}
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        currentUser={currentUser}
        onAccountClick={() => setActivePage('account')}
      />

      {/* Dynamic Page Router Content */}
      <main className="flex-1">
        {activePage === 'home' && (
          <HomePage
            setActivePage={setActivePage}
            onAddToCart={handleAddToCart}
            onQuickView={(p) => setQuickViewProduct(p)}
          />
        )}

        {activePage === 'about' && (
          <AboutPage setActivePage={setActivePage} />
        )}

        {activePage === 'services' && (
          <ServicesPage setActivePage={setActivePage} />
        )}

        {activePage === 'find-centres' && (
          <FindCentresPage />
        )}

        {activePage === 'shop' && (
          <ShopPage
            onAddToCart={handleAddToCart}
            onQuickView={(p) => setQuickViewProduct(p)}
            onViewDetails={(product) => {
              setSelectedProductId(product._id || product.id);
              setActivePage('product-detail');
            }}
          />
        )}
        {activePage === 'product-detail' && selectedProductId && (
          <ProductDetailPage
            productId={selectedProductId}
            onAddToCart={handleAddToCart}
            onBuyNow={() => setIsCheckoutOpen(true)}
            goBack={() => setActivePage('shop')}
          />
        )}

        {activePage === 'contact' && (
          <ContactPage />
        )}

        {activePage === 'account' && (
          <AccountPage
            setActivePage={setActivePage}
            currentUser={currentUser}
            onAuthSuccess={handleAuthSuccess}
            onLogout={handleLogout}
            guestCart={guestCart}
          />
        )}
      </main>

      {/* Website Footer */}
      <Footer setActivePage={setActivePage} />

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={displayCart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={() => {
          if (!currentUser) {
            showToast('Please log in before checkout.');
            setActivePage('account');
            return;
          }
          setIsCheckoutOpen(true);
        }}
      />

      {/* Product Quick View / Detail Modal */}
      {quickViewProduct && (
        <ProductDetailModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={handleAddToCart}
          onBuyNow={() => {
            setQuickViewProduct(null);
            setIsCheckoutOpen(true);
          }}
        />
      )}

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={displayCart}
        currentUser={currentUser}
        onOrderComplete={handleOrderComplete}
      />

    </div>
  );
}
