import React, { useState } from 'react';
import { ShoppingCart, Menu, X } from 'lucide-react';

const LOGO = 'https://synergymedicalyoga.com/wp-content/uploads/2025/05/Synergy-Logo_png-02-scaled.png';

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About Us' },
  { id: 'services', label: 'Services' },
  { id: 'shop', label: 'Shop' },
  { id: 'contact', label: 'Contact Us' },
  { id: 'account', label: 'Login/My account' },
];

export default function Navbar({ activePage, setActivePage, cartCount, onOpenCart, currentUser, onAccountClick }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const goTo = (id) => {
    setActivePage(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="relative z-10 bg-white border-b border-gray-200/80 shadow-sm font-jakarta">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-28">
          
          {/* Logo */}
          <button
            onClick={() => goTo('home')}
            className="flex items-center focus:outline-none shrink-0"
          >
            <img
              src={LOGO}
              alt="Synergy Medical Yoga"
              className="h-28 w-auto object-contain"
              srcSet="https://synergymedicalyoga.com/wp-content/uploads/2025/05/Synergy-Logo_png-02-300x169.png 300w, https://synergymedicalyoga.com/wp-content/uploads/2025/05/Synergy-Logo_png-02-scaled.png 2560w"
              sizes="(max-width: 768px) 200px, 260px"
            />
          </button>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1 font-poppins">
            {NAV_ITEMS.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => goTo(item.id)}
                  className={`px-3.5 py-2 text-sm font-semibold transition-colors rounded-md ${
                    isActive
                      ? 'text-[#005550] font-bold'
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
              className="relative p-2.5 text-[#2C2D33] hover:text-[#005550] transition-colors rounded-full hover:bg-gray-100"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onAccountClick()}
              className="bg-[#005550] hover:bg-[#003d39] text-white font-bold text-sm px-6 py-2.5 rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-3"
            >
              <span className="inline-flex h-8 w-8 rounded-full bg-white/10 text-white items-center justify-center text-sm font-bold uppercase">
                {currentUser?.name?.charAt(0) || 'U'}
              </span>
              <span>{currentUser?.name?.split(' ')[0] || 'My Account'}</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center gap-3">
            <button
              onClick={onOpenCart}
              className="relative p-2 text-[#2C2D33]"
              aria-label="Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#2C2D33] hover:text-[#005550]"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-4 py-4 shadow-xl">
          <div className="flex flex-col space-y-1 font-poppins">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => goTo(item.id)}
                className={`text-left px-4 py-3 text-sm font-semibold rounded-lg transition-colors ${
                  activePage === item.id
                    ? 'text-[#005550] bg-teal-50/60 font-bold'
                    : 'text-[#2C2D33] hover:text-[#005550] hover:bg-gray-50'
                }`}
              >
                {item.label}
              </button>
            ))}

            <button
              onClick={() => onAccountClick()}
              className="mt-4 bg-[#005550] text-white font-bold text-sm py-3 rounded-lg text-center shadow"
            >
              {currentUser ? `Hi, ${currentUser.name.split(' ')[0]}` : 'My Dashboard'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
