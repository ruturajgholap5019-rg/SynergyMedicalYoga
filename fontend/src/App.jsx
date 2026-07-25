import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
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
import AdminDashboard from './admin/AdminDashboard';
import { api } from './lib/api';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [cart, setCart] = useState([]);
  const [guestCart, setGuestCart] = useState(() => {
    try {
      const saved = window.localStorage.getItem('synergyGuestCart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = window.localStorage.getItem('synergyUser');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  // Helper to safely format raw cart items from API
  const formatCartItems = (rawItems) => {
    if (!Array.isArray(rawItems)) return [];
    return rawItems
      .filter((item) => item && item.productId)
      .map((item) => {
        const p = typeof item.productId === 'object' ? item.productId : {};
        return {
          id: p._id || item.productId,
          productId: p._id || item.productId,
          name: p.name || item.name || 'Therapy Product',
          price: p.price ?? item.price ?? 0,
          image: p.images?.[0] || p.image || item.image || 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=800&q=80',
          selectedSize: item.selectedSize || 'Standard',
          quantity: item.quantity || 1,
        };
      });
  };

  // Cart persistence helper (LocalStorage + Cookie)
  const saveGuestCart = (nextCart) => {
    setGuestCart(nextCart);
    try {
      window.localStorage.setItem('synergyGuestCart', JSON.stringify(nextCart));
      document.cookie = `synergyGuestCart=${encodeURIComponent(JSON.stringify(nextCart))}; path=/; max-age=604800`;
    } catch (e) {
      console.error('Failed to write cart cookie:', e);
    }
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
      toast.success(`Saved "${product.name}" to cart! Log in to complete checkout.`);
      return;
    }

    const payload = {
      productId,
      selectedSize: normalizedSize,
      quantity,
    };

    try {
      const response = await api.addToCart(payload);
      const cartItems = formatCartItems(response.data?.items);
      setCart(cartItems);
      toast.success(`Added "${product.name}" (${payload.selectedSize}) to cart!`);
    } catch (error) {
      console.error(error);
      toast.error('Unable to add product to cart.');
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
      const cartItems = formatCartItems(response.data?.items);
      setCart(cartItems);
    } catch (error) {
      console.error(error);
      toast.error('Unable to update cart quantity.');
    }
  };

  const handleRemoveItem = async (id, selectedSize) => {
    if (!currentUser) {
      const updatedItems = guestCart.filter(
        (item) => !(item.productId === id && item.selectedSize === selectedSize)
      );
      saveGuestCart(updatedItems);
      toast.success('Item removed from cart.');
      return;
    }

    try {
      const response = await api.removeFromCart({ productId: id, selectedSize });
      const cartItems = formatCartItems(response.data?.items);
      setCart(cartItems);
      toast.success('Item removed from cart.');
    } catch (error) {
      console.error(error);
      toast.error('Unable to remove item from cart.');
    }
  };

  const handleOrderComplete = () => {
    setCart([]);
    saveGuestCart([]);
    toast.success('🎉 Order placed successfully! Check your email for details.');
  };

  const handleAuthSuccess = async (user) => {
    setCurrentUser(user);
    window.localStorage.setItem('synergyUser', JSON.stringify(user));

    try {
      const savedGuestItems = (() => {
        try {
          const saved = window.localStorage.getItem('synergyGuestCart');
          return saved ? JSON.parse(saved) : [];
        } catch {
          return [];
        }
      })();

      const itemsToMerge = guestCart.length > 0 ? guestCart : savedGuestItems;

      if (itemsToMerge.length > 0) {
        const response = await api.mergeCart(itemsToMerge);
        const cartItems = formatCartItems(response.data?.items);
        setCart(cartItems);
        saveGuestCart([]);
        toast.success(`Welcome back ${user.name}! Your cart items have been restored.`);
      } else {
        const cartResponse = await api.getCart();
        const cartItems = formatCartItems(cartResponse.data?.items);
        setCart(cartItems);
        toast.success(`Logged in as ${user.name}`);
      }
    } catch (error) {
      console.error('Error merging cart:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (error) {
      console.error(error);
    } finally {
      setCurrentUser(null);
      window.localStorage.removeItem('synergyUser');
      document.cookie = 'synergyGuestCart=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      setCart([]);
      saveGuestCart([]);
      setActivePage('home');
      toast.success('Logged out successfully.');
    }
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

        // Validate backend httpOnly Cookie Session
        const profile = await api.getProfile();
        if (profile?.user) {
          setCurrentUser(profile.user);
          window.localStorage.setItem('synergyUser', JSON.stringify(profile.user));

          // Merge any stored guest cart items upon page load if user logged in
          const savedGuestItems = JSON.parse(window.localStorage.getItem('synergyGuestCart') || '[]');
          if (savedGuestItems.length > 0) {
            const mergeRes = await api.mergeCart(savedGuestItems);
            saveGuestCart([]);
            const cartItems = formatCartItems(mergeRes.data?.items);
            setCart(cartItems);
          } else {
            const cartResponse = await api.getCart();
            const cartItems = formatCartItems(cartResponse.data?.items);
            setCart(cartItems);
          }
        }
      } catch (err) {
        // Keep existing cached user if present to prevent accidental session wipes
        const cachedUser = window.localStorage.getItem('synergyUser');
        if (cachedUser) {
          try {
            setCurrentUser(JSON.parse(cachedUser));
          } catch (e) {}
        }
      }
    };

    loadSession();
  }, []);

  useEffect(() => {
    if (activePage === 'product-detail' && !selectedProductId) {
      setActivePage('shop');
    }
  }, [activePage, selectedProductId]);

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans selection:bg-[#065750] selection:text-white">
      
      {/* Global React Hot Toast Provider */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3500,
          style: {
            background: '#005550',
            color: '#fff',
            borderRadius: '16px',
            fontSize: '13px',
            fontWeight: '600',
            boxShadow: '0 10px 25px -5px rgba(0, 85, 80, 0.3)',
          },
          success: {
            iconTheme: {
              primary: '#34d399',
              secondary: '#005550',
            },
          },
          error: {
            style: {
              background: '#e11d48',
              color: '#fff',
            },
          },
        }}
      />

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
          <ServicesPage
            setActivePage={setActivePage}
            currentUser={currentUser}
          />
        )}

        {activePage === 'find-centres' && (
          <FindCentresPage />
        )}

        {activePage === 'shop' && (
          <ShopPage
            onAddToCart={handleAddToCart}
            onQuickView={(p) => setQuickViewProduct(p)}
            onBuyNow={(product, selectedSize) => {
              handleAddToCart(product, selectedSize, 1);
              if (!currentUser) {
                toast.error('Please log in or sign up to complete your checkout. Your cart items are saved!');
                setActivePage('account');
              } else {
                setIsCheckoutOpen(true);
              }
            }}
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
            onBuyNow={(product, selectedSize) => {
              handleAddToCart(product, selectedSize, 1);
              if (!currentUser) {
                toast.error('Please log in or sign up to complete your checkout. Your cart items are saved!');
                setActivePage('account');
              } else {
                setIsCheckoutOpen(true);
              }
            }}
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
          />
        )}

        {activePage === 'admin' && (
          <AdminDashboard
            showToast={(msg) => toast.success(msg)}
            currentUser={currentUser}
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
          setIsCartOpen(false);
          if (!currentUser) {
            toast.error('Please log in or sign up to complete checkout. Your cart items are safely saved!');
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
          onBuyNow={(p, sz) => {
            setQuickViewProduct(null);
            handleAddToCart(p, sz, 1);
            if (!currentUser) {
              toast.error('Please log in or sign up to complete checkout. Your cart items are saved!');
              setActivePage('account');
            } else {
              setIsCheckoutOpen(true);
            }
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
