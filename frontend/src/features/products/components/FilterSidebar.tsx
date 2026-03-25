import React from 'react';
import { SlidersHorizontal, Star } from 'lucide-react';

interface FilterSidebarProps {
  categories: string[];
  activeCategory: string;
  setCategory: (c: string) => void;
  minPrice: string;
  setMinPrice: (p: string) => void;
  maxPrice: string;
  setMaxPrice: (p: string) => void;
  rating: string;
  setRating: (r: string) => void;
  resetFilters: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  categories,
  activeCategory,
  setCategory,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  rating,
  setRating,
  resetFilters
}) => {
  return (
    <div className="w-full lg:w-64 flex-shrink-0 space-y-10 pr-8">
      <div className="flex items-center justify-between">
        <h3 className="font-black uppercase tracking-widest text-sm flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4" /> Filters
        </h3>
        <button 
          onClick={resetFilters}
          className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-black transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Categories */}
      <div className="space-y-4">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Category</h4>
        <div className="space-y-2">
          {categories.map((cat) => (
            <label 
              key={cat} 
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => setCategory(cat === 'All' ? '' : cat.toLowerCase())}
            >
              <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors
                ${(activeCategory === cat.toLowerCase() || (cat === 'All' && !activeCategory)) 
                  ? 'bg-black border-black' 
                  : 'border-border group-hover:border-black'}`}
              >
                {(activeCategory === cat.toLowerCase() || (cat === 'All' && !activeCategory)) && (
                  <div className="w-2 h-2 bg-white rounded-sm" />
                )}
              </div>
              <span className={`text-sm font-bold tracking-tight transition-colors
                ${(activeCategory === cat.toLowerCase() || (cat === 'All' && !activeCategory)) 
                  ? 'text-black' 
                  : 'text-muted-foreground group-hover:text-black'}`}
              >
                {cat}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-4 border-t border-border pt-8">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Price Range</h4>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <span className="text-[10px] font-bold text-muted-foreground mb-1 block">Min (₹)</span>
            <input 
              type="number" 
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full h-10 border border-border rounded-xl px-3 text-xs font-bold focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
              placeholder="0"
            />
          </div>
          <div className="flex-1">
            <span className="text-[10px] font-bold text-muted-foreground mb-1 block">Max (₹)</span>
            <input 
              type="number" 
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full h-10 border border-border rounded-xl px-3 text-xs font-bold focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
              placeholder="Any"
            />
          </div>
        </div>
      </div>

      {/* Ratings */}
      <div className="space-y-4 border-t border-border pt-8">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Minimum Rating</h4>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((r) => (
            <label 
              key={r} 
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => setRating(r.toString())}
            >
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors
                ${rating === r.toString() ? 'bg-black border-black' : 'border-border group-hover:border-black'}`}
              >
                {rating === r.toString() && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-3 h-3 ${i < r ? 'fill-black text-black' : 'fill-transparent text-muted-foreground'}`} 
                  />
                ))}
                <span className="text-xs font-bold ml-1 text-muted-foreground group-hover:text-black transition-colors">& Up</span>
              </div>
            </label>
          ))}
        </div>
      </div>

    </div>
  );
};
