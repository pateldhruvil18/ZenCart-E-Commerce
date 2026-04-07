import { useState, useEffect } from 'react';
import { useSearch } from '@tanstack/react-router';
import { useProducts } from '../hooks/useProducts';
import { useDebounce } from '../../../hooks/useDebounce';
import { Search, ChevronDown } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { FilterSidebar } from './FilterSidebar';

const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Accessories', 'Shoes', 'Sports', 'Home', 'toys', 'Beauty'];

export const ProductListing = () => {
  const searchParams: any = useSearch({ strict: false });
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [page, setPage] = useState(1);
  
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');

  // Sync category from URL
  useEffect(() => {
    if (searchParams?.category) {
      const formatted = searchParams.category.charAt(0).toUpperCase() + searchParams.category.slice(1);
      if (CATEGORIES.includes(formatted)) {
        setCategory(formatted);
      }
    }
  }, [searchParams?.category]);

  // New States for Sidebar
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [rating, setRating] = useState('');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const debouncedMinPrice = useDebounce(minPrice, 500);
  const debouncedMaxPrice = useDebounce(maxPrice, 500);

  const resetFilters = () => {
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
    setRating('');
    setSearchTerm('');
    setPage(1);
    setIsMobileFiltersOpen(false);
  };

  const { data, isLoading, isError } = useProducts({
    page,
    limit: 12,
    search: debouncedSearch || undefined,
    category: category || undefined,
    minPrice: debouncedMinPrice || undefined,
    maxPrice: debouncedMaxPrice || undefined,
    rating: rating || undefined,
    sortBy,
    order: sortBy === 'price' ? 'asc' : 'desc',
  });

  const products = (data as any)?.data?.products || [];
  const totalPages = (data as any)?.data?.totalPages || 1;
  const totalCount = (data as any)?.data?.totalCount || 0;

  return (
    <div className="section min-h-screen py-12">
      {/* Page Header */}
      <div className="mb-12 space-y-4">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase">Shop Essentials</h1>
        <p className="text-sm font-medium text-muted-foreground max-w-2xl">
          Discover our curated selection of premium products, designed for uncompromising performance.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Mobile Filter Toggle */}
        <button 
          onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
          className="lg:hidden flex items-center justify-between h-12 px-4 border border-border rounded-xl font-bold uppercase text-[10px] tracking-widest"
        >
          <span>Filters & Categories</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isMobileFiltersOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Filters Sidebar */}
        <div className={`lg:block ${isMobileFiltersOpen ? 'block' : 'hidden'} w-full lg:w-64 shrink-0`}>
          <FilterSidebar 
            categories={CATEGORIES}
            activeCategory={category}
            setCategory={(c) => { setCategory(c); setPage(1); }}
            minPrice={minPrice}
            setMinPrice={(p) => { setMinPrice(p); setPage(1); }}
            maxPrice={maxPrice}
            setMaxPrice={(p) => { setMaxPrice(p); setPage(1); }}
            rating={rating}
            setRating={(r) => { setRating(r); setPage(1); }}
            resetFilters={resetFilters}
          />
        </div>

        {/* Main Product Area */}
        <div className="flex-1 space-y-8">
          
          {/* Top Bar for Search & Sort */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-border pb-6">
            <div className="relative w-full sm:max-w-xs">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
               <input
                 type="text"
                 placeholder="Search in products..."
                 value={searchTerm}
                 onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                 className="w-full h-11 border border-border rounded-xl pl-12 pr-4 text-xs font-bold uppercase tracking-widest focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
               />
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground shrink-0">Sort By</span>
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                className="h-11 border border-border rounded-xl px-4 text-xs font-bold tracking-widest uppercase focus:border-black focus:ring-1 focus:ring-black outline-none transition-all bg-transparent appearance-none"
              >
                <option value="createdAt">New Arrivals</option>
                <option value="price">Price: Low - High</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            {!isLoading && !isError && (
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Showing {products.length} of {totalCount} items
              </p>
            )}
          </div>

          {/* Product Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex flex-col space-y-4 animate-pulse">
                  <div className="aspect-[4/5] bg-muted rounded-2xl" />
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded w-1/4" />
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-5 bg-muted rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="text-center py-20 text-red-600 text-sm font-bold uppercase tracking-widest">
              Failed to load products. Please try again.
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-32 space-y-4 border border-border rounded-2xl bg-slate-50">
              <p className="text-2xl font-black uppercase tracking-tighter">No items match your criteria</p>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest max-w-sm mx-auto leading-relaxed">
                Adjust your filters, clear the search term, or modify price limits to explore more products.
              </p>
              <button onClick={resetFilters} className="mt-4 h-12 px-8 bg-black text-white font-black uppercase text-[10px] tracking-widest rounded-xl hover:scale-105 transition-all">
                Clear All Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product: any) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-6 pt-12">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="h-10 px-6 border border-border rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-40 disabled:cursor-not-allowed hover:bg-black hover:text-white transition-colors"
                  >
                    Previous
                  </button>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="h-10 px-6 border border-border rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-40 disabled:cursor-not-allowed hover:bg-black hover:text-white transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
