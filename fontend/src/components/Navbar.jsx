import React, { useState } from 'react';
import { ShoppingCart, Menu, X, ShieldCheck, Phone, Mail, Home, Info, Stethoscope, ShoppingBag, PhoneCall, User } from 'lucide-react';

const LOGO = 'https://synergymedicalyoga.com/wp-content/uploads/2025/05/Synergy-Logo_png-02-scaled.png';

const BASE_NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'about', label: 'About Us', icon: Info },
  { id: 'services', label: 'Services', icon: Stethoscope },
  { id: 'shop', label: 'Shop', icon: ShoppingBag },
  { id: 'contact', label: 'Contact Us', icon: PhoneCall },
  { id: 'account', label: 'Login/My account', icon: User },
];

export default function Navbar({ activePage, setActivePage, cartCount, onOpenCart, currentUser, onAccountClick }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdmin = currentUser?.role === 'admin';
  const navItems = isAdmin
    ? [...BASE_NAV_ITEMS, { id: 'admin', label: 'Admin Panel', isAdminItem: true, icon: ShieldCheck }]
    : BASE_NAV_ITEMS;

  const goTo = (id) => {
    setActivePage(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="relative z-30 bg-white border-b border-gray-200/80 shadow-xs font-jakarta">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 lg:h-24 transition-all">
          
          {/* Logo */}
          <button
            onClick={() => goTo('home')}
            className="flex items-center focus:outline-none shrink-0 cursor-pointer"
          >
            <img
              src={LOGO}
              alt="Synergy Medical Yoga"
              className="h-12 sm:h-16 lg:h-20 w-auto object-contain transition-all"
              srcSet="https://synergymedicalyoga.com/wp-content/uploads/2025/05/Synergy-Logo_png-02-300x169.png 300w, https://synergymedicalyoga.com/wp-content/uploads/2025/05/Synergy-Logo_png-02-scaled.png 2560w"
              sizes="(max-width: 768px) 160px, 260px"
            />
          </button>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1 font-poppins">
            {navItems.map((item) => {
              const isActive = activePage === item.id;
              if (item.isAdminItem) {
                return (
                  <button
                    key={item.id}
                    onClick={() => goTo(item.id)}
                    className={`px-3.5 py-2 text-xs font-bold transition-all rounded-xl flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? 'bg-[#005550] text-white shadow-xs'
                        : 'bg-purple-100 text-purple-900 hover:bg-purple-200'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-purple-700" />
                    <span>Admin Panel</span>
                  </button>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => goTo(item.id)}
                  className={`px-3 py-2 text-sm font-semibold transition-colors rounded-md cursor-pointer ${
                    isActive
                      ? 'text-[#005550] font-bold bg-teal-50/50'
                      : 'text-[#2C2D33] hover:text-[#005550]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Actions: Cart Icon + Account CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <button
              onClick={onOpenCart}
              className="relative p-2.5 text-[#2C2D33] hover:text-[#005550] transition-colors rounded-full hover:bg-gray-100 cursor-pointer"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onAccountClick()}
              className="bg-[#005550] hover:bg-[#003d39] text-white font-bold text-sm px-5 py-2 rounded-xl shadow-xs hover:shadow-md transition-all flex items-center gap-2.5 cursor-pointer"
            >
              <span className="inline-flex h-7 w-7 rounded-full bg-white/20 text-white items-center justify-center text-xs font-bold uppercase">
                {currentUser?.name?.charAt(0) || 'U'}
              </span>
              <span>{currentUser?.name?.split(' ')[0] || 'My Account'}</span>
            </button>
          </div>

          {/* Mobile menu action bar */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={onOpenCart}
              className="relative p-2 text-[#2C2D33] hover:text-[#005550] cursor-pointer"
              aria-label="Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#2C2D33] hover:text-[#005550] rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute inset-x-0 top-[100%] bg-white border-b border-gray-200 shadow-2xl z-40 max-h-[calc(100vh-64px)] overflow-y-auto animate-in slide-in-from-top duration-200">
          
          {/* Quick Contact Header on Mobile */}
          <div className="bg-[#005550] text-white px-4 py-2.5 flex items-center justify-between text-xs font-medium">
            <a href="tel:+919730321042" className="flex items-center gap-1.5 hover:text-teal-200">
              <Phone className="w-3.5 h-3.5" />
              <span>+91 97303 21042</span>
            </a>
            <a href="mailto:support@synergymedicalyoga.com" className="flex items-center gap-1.5 hover:text-teal-200">
              <Mail className="w-3.5 h-3.5" />
              <span>Support</span>
            </a>
          </div>

          <div className="p-4 space-y-1 font-poppins">
            {navItems.map((item) => {
              const ItemIcon = item.icon || Home;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => goTo(item.id)}
                  className={`w-full text-left px-4 py-3 text-sm font-semibold rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                    isActive
                      ? 'text-[#005550] bg-teal-50 font-bold border-l-4 border-[#005550]'
                      : 'text-[#2C2D33] hover:text-[#005550] hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ItemIcon className={`w-4 h-4 ${isActive ? 'text-[#005550]' : 'text-gray-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.isAdminItem && <ShieldCheck className="w-4 h-4 text-purple-700" />}
                </button>
              );
            })}

            <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
              <button
                onClick={() => { setMobileMenuOpen(false); onAccountClick(); }}
                className="w-full bg-[#005550] hover:bg-[#003d39] text-white font-bold text-sm py-3 rounded-xl text-center shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <User className="w-4 h-4" />
                <span>{currentUser ? `Dashboard (${currentUser.name.split(' ')[0]})` : 'Login / My Account'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}


