import { Link, useLocation, useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '../../store/authStore';
import { ShoppingCart, User, LogOut, LayoutDashboard, Heart, Search, Home, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../features/cart/hooks/useCart';
import { useWishlist } from '../../features/wishlist/hooks/useWishlist';
import { CartDrawer } from '../../features/cart/components/CartDrawer';
import { useProducts } from '../../features/products/hooks/useProducts';

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  const location = useLocation();
  const isHome = location.pathname === '/';

  const { data: cartData } = useCart();
  const { data: wishlistData } = useWishlist();

  const cartItemsCount = (cartData as any)?.items?.length || (cartData as any)?.data?.cart?.items?.length || (cartData as any)?.data?.items?.length || 0;
  const wishlistItemsCount = (wishlistData as any)?.products?.length || (wishlistData as any)?.data?.wishlist?.products?.length || (wishlistData as any)?.data?.products?.length || 0;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchQuery(searchQuery), 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: searchData, isFetching: isSearching } = useProducts(
    { search: debouncedSearchQuery, limit: 5 },
    { enabled: debouncedSearchQuery.length > 1 }
  );

  const searchResults = (searchData as any)?.data?.products || [];
  const suggestedSearch = (searchData as any)?.data?.suggestedSearch;

  const navigate = useNavigate();

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      setIsMobileSearchOpen(false);
      navigate({ to: '/products', search: { search: searchQuery.trim() } as any });
    }
  };

  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === highlight.toLowerCase() ? <span key={i} className="text-primary font-black bg-primary/10 px-0.5 rounded">{part}</span> : part
    );
  };

  const navTextColor = (isHome && !isScrolled) ? 'text-white' : 'text-black';
  const navMutedColor = (isHome && !isScrolled) ? 'text-white/60' : 'text-muted-foreground';

  const isActive = (path: string) => location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
  const getNavColor = (path: string) => isActive(path) ? navTextColor : navMutedColor;
  
  // Specific color getters for mobile bottom nav (always on solid background)
  const getMobileNavColor = (path: string) => isActive(path) ? 'text-black' : 'text-muted-foreground';

  const handleLogout = () => {
    logout();
    setShowLogoutConfirm(false);
  };

  return (
    <>
      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[500] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
             <motion.div 
               initial={{ scale: 0.95, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.95, opacity: 0 }}
               className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-border"
             >
               <h3 className="text-xl font-black tracking-tight mb-2 uppercase text-black">Log Out</h3>
               <p className="text-muted-foreground text-sm font-medium mb-8">Are you sure you want to log out of your ZenCart account?</p>
               <div className="flex gap-4">
                 <button 
                   onClick={() => setShowLogoutConfirm(false)}
                   className="flex-1 h-12 rounded-xl border-2 border-border font-black uppercase text-[10px] tracking-widest text-black hover:bg-muted/50 transition-colors"
                 >
                   Cancel
                 </button>
                 <button 
                   onClick={handleLogout}
                   className="flex-1 h-12 rounded-xl bg-black text-white font-black uppercase text-[10px] tracking-widest hover:bg-red-600 transition-colors"
                 >
                   Log Out
                 </button>
               </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Navbar */}
      <header 
        className={`fixed top-0 z-[100] w-full transition-all duration-700
          ${isScrolled 
            ? 'bg-white/80 backdrop-blur-xl border-b border-border py-4 shadow-sm' 
            : 'bg-transparent border-transparent py-4 md:py-6'}`}
      >
        <div className="section flex flex-wrap md:flex-nowrap items-center justify-between font-black gap-y-4">
          {/* Brand */}
          <Link to="/" className={`flex items-center gap-2.5 text-2xl tracking-tighter select-none group order-1 md:order-1 flex-shrink-0 ${navTextColor}`}>
            <img
              src="/logo.svg"
              alt="ZenCart"
              className="w-10 h-10 md:w-12 md:h-12 group-hover:rotate-12 transition-transform duration-500 drop-shadow-md"
            />
            <span className="uppercase text-xl md:text-2xl pt-1">ZenCart</span>
          </Link>

          {/* Search Bar */}
          <div className={`${isMobileSearchOpen ? 'flex' : 'hidden md:flex'} w-full order-3 md:order-2 md:flex-1 md:max-w-md md:mx-12 relative group`}>
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${navMutedColor} group-focus-within:text-black`} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearchSubmit();
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="Search products..." 
              className={`w-full h-11 border-transparent rounded-xl md:rounded-2xl pl-12 pr-4 text-xs font-bold transition-all outline-none 
                ${(isHome && !isScrolled) 
                  ? 'bg-white/10 text-white placeholder:text-white/60 md:placeholder:text-white/40 focus:bg-white/20 focus:bg-white focus:text-black' 
                  : 'bg-muted/50 text-black placeholder:text-muted-foreground focus:bg-muted font-bold'}`}
            />

            {/* Smart Search Dropdown */}
            <AnimatePresence>
              {showSuggestions && searchQuery.length > 1 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-14 left-0 w-full bg-white rounded-2xl shadow-2xl border border-border overflow-hidden z-[200]"
                >
                  {isSearching ? (
                    <div className="p-4 space-y-3">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex gap-3 animate-pulse">
                          <div className="w-12 h-12 bg-muted rounded-xl" />
                          <div className="flex-1 space-y-2 py-1">
                            <div className="h-3 bg-muted rounded w-3/4" />
                            <div className="h-3 bg-muted rounded w-1/4" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="py-2">
                      <div className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Products</div>
                      {searchResults.map((product: any) => (
                        <Link 
                          key={product._id} 
                          to="/products/$productId" 
                          params={{ productId: product._id }}
                          className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
                          onClick={() => { setShowSuggestions(false); setSearchQuery(''); setIsMobileSearchOpen(false); }}
                        >
                          <div className="w-12 h-12 bg-muted rounded-xl bg-cover bg-center shrink-0 border border-border/50" style={{ backgroundImage: `url(${product.images?.[0]})` }} />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-sm tracking-tight text-black truncate">{highlightText(product.name, debouncedSearchQuery)}</h4>
                            <p className="text-xs text-muted-foreground font-medium mt-0.5">₹{product.price.toLocaleString('en-IN')}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : suggestedSearch ? (
                    <div className="p-8 text-center space-y-2">
                      <p className="text-sm font-bold text-muted-foreground">No perfect match</p>
                      <p className="text-sm font-bold text-muted-foreground flex items-center justify-center gap-1.5">
                        Did you mean:{' '}
                        <button 
                          className="text-primary font-black underline decoration-primary/30 underline-offset-4 hover:decoration-primary transition-colors"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setSearchQuery(suggestedSearch);
                            navigate({ to: '/products', search: { search: suggestedSearch } as any });
                            setShowSuggestions(false);
                            setIsMobileSearchOpen(false);
                          }}
                        >
                          {suggestedSearch}
                        </button>
                        ?
                      </p>
                    </div>
                  ) : (
                    <div className="p-8 text-center text-sm font-bold text-muted-foreground">
                      No products found for "{searchQuery}"
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Icons & Actions */}
          <div className="flex items-center gap-2 md:gap-8 order-2 md:order-3">
            <nav className={`hidden md:flex items-center gap-8 text-[10px] uppercase tracking-[0.2em]`}>
              <Link to="/products" className={`transition-colors hover:text-primary ${getNavColor('/products')} ${isActive('/products') ? 'font-black' : 'font-bold'}`}>Products</Link>
              <Link to="/wishlist" className={`relative transition-colors flex items-center gap-2 hover:text-primary ${getNavColor('/wishlist')} ${isActive('/wishlist') ? 'font-black' : 'font-bold'}`}>
                <Heart className="h-4 w-4" /> Wishlist
                {wishlistItemsCount > 0 && (
                  <span className={`absolute -top-1.5 -right-3 w-3.5 h-3.5 text-[7px] font-black flex items-center justify-center rounded-full ${(isHome && !isScrolled) ? 'bg-white text-black' : 'bg-black text-white'}`}>
                    {wishlistItemsCount}
                  </span>
                )}
              </Link>
            </nav>

            <div className={`h-4 w-[1px] mx-2 hidden md:block ${(isHome && !isScrolled) ? 'bg-white/20' : 'bg-border'}`} />

            <div className="flex items-center gap-3 md:gap-6">
              {/* Mobile Search Toggle Icon */}
              <button 
                onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                className={`md:hidden flex items-center justify-center w-10 h-10 rounded-xl transition-colors ${navTextColor} ${isMobileSearchOpen ? 'bg-black/10' : ''}`}
                title="Toggle Search"
              >
                {isMobileSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
              </button>

              {/* Desktop Cart */}
              <button 
                onClick={() => setIsCartOpen(true)}
                className={`relative hidden md:flex transition-colors ${navMutedColor} hover:text-primary p-1 items-center`} 
                title="Cart"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <span className={`absolute -top-1.5 -right-1.5 w-4 h-4 text-[8px] font-black flex items-center justify-center rounded-full ${(isHome && !isScrolled) ? 'bg-white text-black' : 'bg-black text-white'}`}>
                    {cartItemsCount}
                  </span>
                )}
              </button>

              {/* Profile & Auth */}
              {isAuthenticated ? (
                <div className="flex items-center gap-3 md:gap-6">
                  <Link to="/profile" className={`flex items-center gap-3 transition-colors ${getNavColor('/profile')} hover:text-primary`} title="Profile">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${isActive('/profile') ? (isHome && !isScrolled ? 'bg-white/20 text-white' : 'bg-black text-white') : (isHome && !isScrolled ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-muted text-black')}`}>
                      <User className="h-4 w-4" />
                    </div>
                    <span className={`hidden md:block text-[10px] uppercase tracking-widest pt-0.5 ${isActive('/profile') ? 'font-black' : 'font-bold'}`}>
                      {user?.name || 'Profile'}
                    </span>
                  </Link>

                  {user?.role === 'admin' && (
                    <Link to="/admin" className={`transition-colors flex items-center ${getNavColor('/admin')} hover:text-primary`} title="Admin Dashboard">
                      <LayoutDashboard className="h-5 w-5" />
                    </Link>
                  )}

                  <button onClick={() => setShowLogoutConfirm(true)} className={`transition-colors flex items-center ${navMutedColor} hover:text-red-500`} title="Logout">
                    <LogOut className="h-5 w-5 md:h-5 md:w-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 md:gap-5">
                  <Link to="/login" className={`hidden md:flex text-[10px] font-black uppercase tracking-[0.2em] transition-colors items-center ${navMutedColor} hover:text-primary`}>Login</Link>
                  <Link to="/register" className={`h-9 px-4 md:h-11 md:px-8 text-center rounded-xl text-[10px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em] flex items-center justify-center transition-all active:scale-95 md:shadow-xl ${(isHome && !isScrolled) ? 'bg-white text-black hover:bg-white/90 shadow-white/5' : 'bg-black text-white md:hover:bg-slate-800 shadow-slate-200/50'}`}>
                    Join
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Menu */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-border z-[100] pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-around h-16">
          <Link to="/" className={`flex flex-col items-center gap-1.5 transition-colors ${getMobileNavColor('/')}`}>
            <Home className={`w-5 h-5 ${isActive('/') ? 'stroke-[2.5px]' : ''}`} />
            <span className="text-[9px] font-black uppercase tracking-widest">Home</span>
          </Link>
          
          <Link to="/products" className={`flex flex-col items-center gap-1.5 transition-colors ${getMobileNavColor('/products')}`}>
            <LayoutDashboard className={`w-5 h-5 ${isActive('/products') ? 'stroke-[2.5px]' : ''}`} />
            <span className="text-[9px] font-black uppercase tracking-widest">Products</span>
          </Link>
          
          <Link to="/wishlist" className={`relative flex flex-col items-center gap-1.5 transition-colors ${getMobileNavColor('/wishlist')}`}>
            <Heart className={`w-5 h-5 ${isActive('/wishlist') ? 'stroke-[2.5px]' : ''}`} />
            {wishlistItemsCount > 0 && (
              <span className={`absolute -top-1 -right-2 w-3.5 h-3.5 text-[7px] font-black flex items-center justify-center rounded-full bg-black text-white`}>
                {wishlistItemsCount}
              </span>
            )}
            <span className="text-[9px] font-black uppercase tracking-widest">Wishlist</span>
          </Link>

          <button 
            onClick={() => setIsCartOpen(true)}
            className={`relative flex flex-col items-center gap-1.5 transition-colors ${isCartOpen ? 'text-black' : 'text-muted-foreground'} hover:text-black`}
          >
            <ShoppingCart className={`w-5 h-5 ${isCartOpen ? 'stroke-[2.5px]' : ''}`} />
            {cartItemsCount > 0 && (
              <span className={`absolute -top-1 -right-2 w-3.5 h-3.5 text-[7px] font-black flex items-center justify-center rounded-full bg-black text-white`}>
                {cartItemsCount}
              </span>
            )}
            <span className="text-[9px] font-black uppercase tracking-widest">Cart</span>
          </button>
        </div>
      </div>
      
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};
