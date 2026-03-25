import { useProducts } from '../../products/hooks/useProducts';
import { HeroSection } from './HeroSection';
import { ProductCarousel } from './ProductCarousel';
import { TrendingSlider } from './TrendingSlider';
import { CategoryGrid } from './CategoryGrid';
import { BestSellersGrid } from './BestSellersGrid';
import { PromoBanner } from './PromoBanner';
import { ValueProps } from './ValueProps';
import { motion } from 'framer-motion';

export const Home = () => {
  // Fetch products for different sections
  const { data: featuredData, isLoading: isLoadingFeatured } = useProducts({ limit: 12, sortBy: 'rating', order: 'desc' });
  const { data: trendingData, isLoading: isLoadingTrending } = useTrendingProducts(); // Mock or actual
  const { data: bestSellersData, isLoading: isLoadingBestSellers } = useProducts({ limit: 4, sortBy: 'numReviews', order: 'desc' });

  const featuredProducts = (featuredData as any)?.data?.products || [];
  const trendingProducts = trendingData || featuredProducts.slice(0, 3); // Use featured as fallback for trending
  const bestSellers = (bestSellersData as any)?.data?.products || [];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="flex flex-col bg-white"
    >
      {/* 1. Hero Section */}
      <HeroSection products={featuredProducts} />

      {/* 1.5 Brand Slider (Scrollable Branding) */}
      {/* <BrandSlider /> */}

      {/* 2. Horizontal Featured Products Scroll */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <ProductCarousel 
          title="Curated Favorites" 
          subtitle="Hand-picked for digital excellence"
          products={featuredProducts} 
          isLoading={isLoadingFeatured} 
        />
      </motion.div>

      {/* 4. Trending Products Carousel (Auto-sliding) */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <TrendingSlider 
          products={trendingProducts} 
          isLoading={isLoadingTrending} 
        />
      </motion.div>

      {/* 5. Category Section */}
      <CategoryGrid />

      {/* 6. Best Sellers Grid */}
      <BestSellersGrid products={bestSellers} isLoading={isLoadingBestSellers} />

      {/* 7. Promo Banner */}
      <PromoBanner />

      {/* 8. Value Props Section */}
      <ValueProps />
    </motion.div>
  );
};

// Mock function for trending products - replace with actual hook if available
const useTrendingProducts = () => {
    return { data: null, isLoading: false };
};
