import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X } from 'lucide-react';
import { useCreateReview } from '../../products/hooks/useProducts';
import toast from 'react-hot-toast';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, productId, productName }) => {
  const { mutate: createReview, isPending: isReviewing } = useCreateReview(productId);
  const [rating, setRating] = useState<number>(0);
  const [hoveredStar, setHoveredStar] = useState<number>(0);
  const [comment, setComment] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return toast.error('Please select a rating');
    if (!comment.trim()) return toast.error('Please enter a comment');
    
    createReview({ rating, comment }, {
      onSuccess: () => {
        setRating(0);
        setComment('');
        setHoveredStar(0);
        onClose();
      }
    });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[500] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-border relative"
        >
          <button 
            onClick={onClose} 
            className="absolute top-6 right-6 p-2 bg-muted/50 rounded-full hover:bg-black hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          
          <h2 className="text-2xl font-black tracking-tight mb-2">Review Your Order</h2>
          <p className="text-sm text-muted-foreground font-medium mb-6">
            Share your thoughts on <strong className="text-black">{productName || 'this item'}</strong>
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Product Rating</label>
              <div className="flex gap-2" onMouseLeave={() => setHoveredStar(0)}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredStar(star)}
                    className="p-1 transition-transform hover:scale-110 focus:outline-none"
                  >
                    <Star
                      className="w-8 h-8 transition-colors"
                      fill={(hoveredStar || rating) >= star ? 'currentColor' : 'none'}
                      color={(hoveredStar || rating) >= star ? '#eab308' : '#cbd5e1'}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Your Review</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What did you like or dislike?"
                className="w-full h-32 border border-border rounded-xl p-4 text-sm resize-none focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isReviewing || rating === 0 || !comment.trim()}
              className="w-full h-12 bg-black text-white font-black uppercase text-[10px] tracking-widest rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
              {isReviewing ? 'Submitting...' : 'Post Verified Review'}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
