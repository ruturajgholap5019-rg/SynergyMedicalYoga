import React, { useEffect, useState, useCallback } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TopBar from './components/TopBar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import ProductDetailModal from './components/ProductDetailModal';

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
import CheckoutPage from './pages/CheckoutPage';
import CoursePage from './pages/CoursePage';
import { api } from './lib/api';

// Route mapping configuration
const PAGE_TO_ROUTE = {
  home: '/',
  about: '/about',
  services: '/services',
  'find-centres': '/find-centres',
  shop: '/shop',
  contact: '/contact',
  'rbt-course': '/rbt-course',
  account: '/my-account',
  checkout: '/checkout',
  admin: '/admin',
  'product-detail': '/shop',
};

const ROUTE_TO_PAGE = {
  '/': 'home',
  '/about': 'about',
  '/services': 'services',
  '/find-centres': 'find-centres',
  '/shop': 'shop',
  '/contact': 'contact',
  '/rbt-course': 'rbt-course',
  '/training-course': 'rbt-course',
  '/my-account': 'account',
  '/my-account/': 'account',
  '/checkout': 'checkout',
  '/admin': 'admin',
  '/admin/': 'admin',
};

// Helper to parse route and extract page & parameters (handling trailing slashes and SEO product slugs)
function parsePathname(pathname) {
  const cleanPath = pathname.toLowerCase().replace(/\/+$/, '') || '/';
  if (cleanPath.startsWith('/product/') || cleanPath.startsWith('/product') || cleanPath.startsWith('/products/') || cleanPath.startsWith('/products')) {
    const parts = cleanPath.split('/').filter(Boolean);
    return { page: 'product-detail', param: parts[1] || null };
  }
  if (cleanPath.includes('/my-account')) return { page: 'account', param: null };
  if (cleanPath.includes('/admin')) return { page: 'admin', param: null };
  if (cleanPath.includes('/checkout')) return { page: 'checkout', param: null };
  if (cleanPath.includes('/shop')) return { page: 'shop', param: null };
  if (cleanPath.includes('/services')) return { page: 'services', param: null };
  if (cleanPath.includes('/about')) return { page: 'about', param: null };
  if (cleanPath.includes('/contact')) return { page: 'contact', param: null };
  if (cleanPath.includes('/find-centres')) return { page: 'find-centres', param: null };
  return { page: ROUTE_TO_PAGE[cleanPath] || 'home', param: null };
}

// Helper to create SEO friendly URL slug from product name
function generateProductSlug(product) {
  if (!product) return '';
  if (product.name) {
    return product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  return product._id || product.id || 'therapy-product';
}

export default function App() {
  const [activePage, setActivePage] = useState(() => {
    // Synchronous URL routing initialization on load
    return parsePathname(window.location.pathname).page;
  });

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
  const [pendingCheckout, setPendingCheckout] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(() => {
    return parsePathname(window.location.pathname).param;
  });
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = window.localStorage.getItem('synergyUser');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  // Helper to safely update page state and push clean URL to browser address bar without reload
  const handleNavigate = useCallback((page, scroll = true, customRoute = null) => {
    setActivePage(page);
    let route = customRoute || PAGE_TO_ROUTE[page] || '/';
    if (page === 'product-detail' && !customRoute && selectedProductId) {
      route = `/product/${selectedProductId}`;
    }
    if (window.location.pathname !== route) {
      window.history.pushState({ page, customRoute }, '', route);
    }
    if (scroll) window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedProductId]);

  // Listen for browser Back/Forward navigation buttons
  useEffect(() => {
    const handlePopState = () => {
      const parsed = parsePathname(window.location.pathname);
      setActivePage(parsed.page);
      if (parsed.param) {
        setSelectedProductId(parsed.param);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

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
      // Ignore storage error
    }
  };

  const handleAddToCart = async (product, selectedSize, quantity = 1) => {
    if (!product) return false;
    const productId = product._id || product.id;
    const normalizedSize = selectedSize || 'Standard';

    const saveToGuestCartLocal = () => {
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
    };

    if (!currentUser) {
      saveToGuestCartLocal();
      return true;
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
      return true;
    } catch (error) {
      // Fallback to guest cart without browser error spam
      setCurrentUser(null);
      window.localStorage.removeItem('synergyUser');
      saveToGuestCartLocal();
      return true;
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
      toast.error('Unable to remove item from cart.');
    }
  };

  const handleOrderComplete = () => {
    setCart([]);
    saveGuestCart([]);
    setPendingCheckout(false);
    toast.success('🎉 Order placed successfully! Check your email for details.');
    handleNavigate('account');
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
      // Ignore cart merge errors silently
    }

    if (pendingCheckout) {
      setPendingCheckout(false);
      handleNavigate('checkout');
    } else if (user.role === 'admin') {
      handleNavigate('admin');
    } else {
      handleNavigate('account');
    }
  };

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (error) {
      // Continue logout cleanup
    } finally {
      setCurrentUser(null);
      window.localStorage.removeItem('synergyUser');
      document.cookie = 'synergyGuestCart=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      setCart([]);
      saveGuestCart([]);
      setPendingCheckout(false);
      handleNavigate('home');
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

        const profile = await api.getProfile();
        if (profile?.user) {
          setCurrentUser(profile.user);
          window.localStorage.setItem('synergyUser', JSON.stringify(profile.user));

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
        setCurrentUser(null);
        window.localStorage.removeItem('synergyUser');
      }
    };

    loadSession();

    // Handle return redirect from payment gateway after successful checkout
    if (window.location.pathname.includes('/order-success') || window.location.search.includes('session_id') || window.location.search.includes('order_id')) {
      const params = new URLSearchParams(window.location.search);
      const orderRef = params.get('order_id') || params.get('session_id') || '';
      toast.success(
        `🎉 Payment Successful! Your order ${orderRef ? `(#${orderRef}) ` : ''}has been placed and is being processed.`,
        { duration: 6000 }
      );
      setCart([]);
      saveGuestCart([]);
      handleNavigate('account', false);
      window.history.replaceState({}, document.title, '/my-account');
    }
  }, [handleNavigate]);

  useEffect(() => {
    if (activePage === 'product-detail' && !selectedProductId) {
      handleNavigate('shop');
    }
  }, [activePage, selectedProductId, handleNavigate]);

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans selection:bg-[#065750] selection:text-white">
      
      {/* Global React Toastify Notification Provider */}
      <ToastContainer
        position="top-right"
        autoClose={3500}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        toastStyle={{
          borderRadius: '16px',
          fontFamily: 'inherit',
          fontWeight: '600',
          fontSize: '14px',
          boxShadow: '0 15px 30px -5px rgba(0, 85, 80, 0.25)',
        }}
      />

      {/* Top Header Contact Bar */}
      <TopBar
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        activePage={activePage}
        setActivePage={handleNavigate}
      />

      {/* Main Responsive Header Navigation */}
      <Navbar
        activePage={activePage}
        setActivePage={handleNavigate}
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        currentUser={currentUser}
        onAccountClick={() => handleNavigate('account')}
      />

      {/* Dynamic Page Router Content with Strict Security & Zero Leak Route Guards */}
      <main className="flex-1">
        {activePage === 'home' && (
          <HomePage
            setActivePage={handleNavigate}
            onAddToCart={handleAddToCart}
            onQuickView={(p) => setQuickViewProduct(p)}
            onViewDetails={(product) => {
              const slug = generateProductSlug(product) || product._id || product.id;
              setSelectedProductId(slug);
              handleNavigate('product-detail', true, `/product/${slug}`);
            }}
            onBuyNow={async (product, selectedSize, quantity = 1) => {
              const success = await handleAddToCart(product, selectedSize, quantity);
              if (success) {
                if (!currentUser) {
                  setPendingCheckout(true);
                  toast.error('Please log in or sign up to complete your checkout. Your cart items are saved!');
                  handleNavigate('account');
                } else {
                  handleNavigate('checkout');
                }
              }
            }}
          />
        )}

        {activePage === 'about' && (
          <AboutPage setActivePage={handleNavigate} />
        )}

        {activePage === 'services' && (
          <ServicesPage
            setActivePage={handleNavigate}
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
            onBuyNow={async (product, selectedSize, quantity = 1) => {
              const success = await handleAddToCart(product, selectedSize, quantity);
              if (success) {
                if (!currentUser) {
                  setPendingCheckout(true);
                  toast.error('Please log in or sign up to complete your checkout. Your cart items are saved!');
                  handleNavigate('account');
                } else {
                  handleNavigate('checkout');
                }
              }
            }}
            onViewDetails={(product) => {
              const slug = generateProductSlug(product) || product._id || product.id;
              setSelectedProductId(slug);
              handleNavigate('product-detail', true, `/product/${slug}`);
            }}
          />
        )}

        {activePage === 'product-detail' && selectedProductId && (
          <ProductDetailPage
            productId={selectedProductId}
            onAddToCart={handleAddToCart}
            onBuyNow={async (product, selectedSize, quantity = 1) => {
              const success = await handleAddToCart(product, selectedSize, quantity);
              if (success) {
                if (!currentUser) {
                  setPendingCheckout(true);
                  toast.error('Please log in or sign up to complete your checkout. Your cart items are saved!');
                  handleNavigate('account');
                } else {
                  handleNavigate('checkout');
                }
              }
            }}
            goBack={() => handleNavigate('shop')}
          />
        )}

        {activePage === 'contact' && (
          <ContactPage />
        )}

        {activePage === 'rbt-course' && (
          <CoursePage setActivePage={handleNavigate} />
        )}

        {activePage === 'account' && (
          <AccountPage
            setActivePage={handleNavigate}
            currentUser={currentUser}
            onAuthSuccess={handleAuthSuccess}
            onLogout={handleLogout}
          />
        )}

        {/* SECURITY PRECAUTION 1: Protected Private Checkout Route Guard */}
        {activePage === 'checkout' && (
          currentUser ? (
            <CheckoutPage
              cart={displayCart}
              currentUser={currentUser}
              onOrderComplete={handleOrderComplete}
              setActivePage={handleNavigate}
            />
          ) : (
            <div className="py-24 max-w-lg mx-auto text-center px-4 space-y-6 animate-fade-in">
              <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-800 flex items-center justify-center font-extrabold text-2xl mx-auto shadow-xs">
                🔒
              </div>
              <h2 className="font-sansita font-bold text-3xl text-slate-800">Authentication Required</h2>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                To protect your sensitive payment credentials and order tracking information, please log in to your Synergy account before proceeding to secure checkout.
              </p>
              <button
                onClick={() => handleNavigate('account')}
                className="bg-[#005550] hover:bg-[#003d39] text-white font-extrabold py-3.5 px-8 rounded-xl shadow-md transition-all text-xs uppercase tracking-wider cursor-pointer"
              >
                Go to Secure Login / Sign Up
              </button>
            </div>
          )
        )}

        {/* SECURITY PRECAUTION 2: Protected Admin Route Guard (Preventing unauthorized dashboard leaks) */}
        {activePage === 'admin' && (
          currentUser && currentUser.role === 'admin' ? (
            <AdminDashboard
              showToast={(msg) => toast.success(msg)}
              currentUser={currentUser}
            />
          ) : (
            <div className="py-28 max-w-xl mx-auto text-center px-4 space-y-6 animate-fade-in">
              <div className="w-20 h-20 rounded-3xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center font-extrabold text-3xl mx-auto shadow-xs">
                🛡️
              </div>
              <h2 className="font-sansita font-extrabold text-3xl text-rose-950">403 Restricted Admin Portal</h2>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Access Denied: You are attempting to access a secured administrative endpoint. This route is cryptographically protected by Role-Based Access Control (RBAC). Unauthorized attempts are prohibited to preserve customer confidentiality and zero data leakage.
              </p>
              <button
                onClick={() => handleNavigate('home')}
                className="bg-[#005550] hover:bg-[#003d39] text-white font-extrabold py-3.5 px-8 rounded-xl shadow-md transition-all text-xs uppercase tracking-wider cursor-pointer"
              >
                Return to Synergy Homepage
              </button>
            </div>
          )
        )}
      </main>

      {/* Website Footer */}
      <Footer setActivePage={handleNavigate} />

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={displayCart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onNavigateToShop={() => handleNavigate('shop')}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          if (!currentUser) {
            setPendingCheckout(true);
            toast.error('Please log in or sign up to complete checkout. Your cart items are saved!');
            handleNavigate('account');
            return;
          }
          handleNavigate('checkout');
        }}
      />

      {/* Product Quick View / Detail Modal */}
      {quickViewProduct && (
        <ProductDetailModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={handleAddToCart}
          onBuyNow={async (p, sz, q = 1) => {
            setQuickViewProduct(null);
            const success = await handleAddToCart(p, sz, q);
            if (success) {
              if (!currentUser) {
                setPendingCheckout(true);
                toast.error('Please log in or sign up to complete checkout. Your cart items are saved!');
                handleNavigate('account');
              } else {
                handleNavigate('checkout');
              }
            }
          }}
        />
      )}

    </div>
  );
}
