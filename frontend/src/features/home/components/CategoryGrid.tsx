import { ArrowRight, Laptop, Shirt, Watch, Footprints, Dumbbell, Home, Sparkles, Gamepad2 } from 'lucide-react';
import { Link } from '@tanstack/react-router';

const CATEGORIES = [
  { name: 'Electronics', icon: Laptop, color: 'bg-blue-50' },
  { name: 'Clothing', icon: Shirt, color: 'bg-green-50' },
  { name: 'Shoes', icon: Footprints, color: 'bg-amber-50' },
  { name: 'Accessories', icon: Watch, color: 'bg-purple-50' },
  { name: 'Sports', icon: Dumbbell, color: 'bg-red-50' },
  { name: 'Home', icon: Home, color: 'bg-indigo-50' },
  { name: 'Beauty', icon: Sparkles, color: 'bg-pink-50' },
  { name: 'Toys', icon: Gamepad2, color: 'bg-cyan-50' },
];

export const CategoryGrid = () => {
  return (
    <section className="section py-24">
      <div className="flex items-center justify-between mb-16">
        <div>
          <h2 className="text-4xl font-black tracking-tighter uppercase mb-2">Shop by Category</h2>
          <p className="text-muted-foreground font-medium text-sm tracking-wide uppercase opacity-60">Discover curated collections for every need</p>
        </div>
        <Link to="/products" className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-black transition-colors">
          View All <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {CATEGORIES.map((cat) => (
          <Link 
            key={cat.name} 
            to="/products" 
            search={{ category: cat.name.toLowerCase() }}
            className="group relative flex flex-col items-center justify-center p-8 bg-white border border-border/50 rounded-3xl hover:-translate-y-2 transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200"
          >
            <div className={`w-14 h-14 ${cat.color} rounded-2xl flex items-center justify-center mb-4 group-hover:bg-black group-hover:text-white transition-colors duration-500`}>
              <cat.icon className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-center">{cat.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
};
