import { Store, Instagram, Facebook, X } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-border pt-14 pb-12 w-full">
      <div className="section grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-24 mb-20">
        <div className="md:col-span-1 space-y-6">
          <Link to="/" className="flex items-center gap-2 font-black text-2xl tracking-tighter uppercase">
            <div className="w-8 h-8 bg-black text-white flex items-center justify-center rounded-lg">
              <Store className="h-5 w-5" />
            </div>
            ZenCart
          </Link>
          <p className="text-sm text-muted-foreground font-medium leading-relaxed max-w-xs">
            Defining the future of premium digital storefronts with minimalist design and curated excellence.
          </p>
          <div className="flex gap-4">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-10 h-10 border border-border rounded-xl flex items-center justify-center hover:bg-black hover:text-white transition-all"><Instagram className="w-4 h-4" /></a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-10 h-10 border border-border rounded-xl flex items-center justify-center hover:bg-black hover:text-white transition-all"><X className="w-4 h-4" /></a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-10 h-10 border border-border rounded-xl flex items-center justify-center hover:bg-black hover:text-white transition-all"><Facebook className="w-4 h-4" /></a>
          </div>
        </div>

        <div className="space-y-6">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Store</h4>
          <ul className="space-y-4 text-sm font-bold tracking-tight">
            <li><Link to="/products" className="hover:text-primary transition-colors">All Products</Link></li>
            <li><Link to="/products" search={{ sortBy: 'createdAt' }} className="hover:text-primary transition-colors">New Arrivals</Link></li>
            <li><Link to="/products" search={{ sortBy: 'rating' }} className="hover:text-primary transition-colors">Best Sellers</Link></li>
            <li><Link to="/products" search={{ minPrice: '1000' }} className="hover:text-primary transition-colors">Premium Collection</Link></li>
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Support</h4>
          <ul className="space-y-4 text-sm font-bold tracking-tight">
            <li><Link to="/profile" className="hover:text-primary transition-colors">My Account</Link></li>
            <li><Link to="/" className="hover:text-primary transition-colors">Shipping Policy</Link></li>
            <li><Link to="/" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            <li><Link to="/" className="hover:text-primary transition-colors">Returns Tracking</Link></li>
          </ul>
        </div>

        <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Newsletter</h4>
            <p className="text-xs text-muted-foreground font-medium">Join our community for exclusive early access to drops.</p>
            <form className="relative" onSubmit={(e) => { e.preventDefault(); alert('Subscribed to newsletter!'); }}>
              <input type="email" required placeholder="example@email.com" className="w-full h-12 bg-muted/50 border-transparent focus:bg-white focus:border-black/10 rounded-xl px-4 text-xs font-bold outline-none transition-all" />
              <button type="submit" className="absolute right-2 top-2 h-8 px-4 bg-black text-white text-[8px] font-black uppercase tracking-widest rounded-lg hover:scale-105 transition-transform">Submit</button>
            </form>
        </div>
      </div>

      <div className="section border-t border-border pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
            © 2026 ZenCart Store — Designed for Excellence
          </div>
          <div className="flex gap-8 text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground">
            <Link to="/" className="hover:text-black transition-colors">Terms of Service</Link>
            <Link to="/" className="hover:text-black transition-colors">Cookie Policy</Link>
            <Link to="/" className="hover:text-black transition-colors">Contact Us</Link>
          </div>
      </div>
    </footer>
  );
};
