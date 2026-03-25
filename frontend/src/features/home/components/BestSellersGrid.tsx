import { motion } from 'framer-motion';
import { ProductCard } from '../../products/components/ProductCard';

interface BestSellersGridProps {
  products: any[];
  isLoading: boolean;
}

export const BestSellersGrid = ({ products, isLoading }: BestSellersGridProps) => {
  return (
    <motion.section 
      initial={{ y: 50, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="section py-24 mb-12"
    >
      <div className="text-center mb-16 space-y-4">
        <h2 className="text-5xl font-black tracking-tighter uppercase">Market Best Sellers</h2>
        <p className="text-muted-foreground font-medium text-sm tracking-widest uppercase opacity-60">
          Most loved by our community
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {isLoading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="h-[400px] bg-muted rounded-3xl animate-pulse" />
          ))
        ) : (
          products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        )}
      </div>
    </motion.section>
  );
};
