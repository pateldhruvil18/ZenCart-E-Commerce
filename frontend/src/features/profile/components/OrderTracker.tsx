import React from 'react';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';

interface OrderTrackerProps {
  status: string; // 'pending', 'processing', 'shipped', 'delivered', 'cancelled'
}

type Step = {
  label: string;
  key: string;
  icon: React.ElementType;
};

const STEPS: Step[] = [
  { label: 'Order Placed', key: 'pending', icon: Clock },
  { label: 'Processing', key: 'processing', icon: Package },
  { label: 'Shipped', key: 'shipped', icon: Truck },
  { label: 'Delivered', key: 'delivered', icon: CheckCircle },
];

export const OrderTracker: React.FC<OrderTrackerProps> = ({ status }) => {
  if (status === 'cancelled') {
    return (
      <div className="w-full bg-red-50 text-red-600 rounded-xl p-4 text-center font-black uppercase tracking-widest text-[10px]">
        This order has been cancelled
      </div>
    );
  }

  const currentStepIndex = STEPS.findIndex((s) => s.key === status);
  // If status not found, assume index 0 or use the found index
  const activeIndex = currentStepIndex >= 0 ? currentStepIndex : 0;

  return (
    <div className="w-full py-4 relative">
      <div className="flex justify-between relative z-10">
        {STEPS.map((step, index) => {
          const isActive = index === activeIndex;
          const isCompleted = index <= activeIndex;
          const Icon = step.icon;

          return (
            <div key={step.key} className="flex flex-col items-center gap-2 bg-white px-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
                  ${isActive ? 'bg-black text-white ring-4 ring-black/10 scale-110' : ''}
                  ${isCompleted && !isActive ? 'bg-black text-white' : ''}
                  ${!isCompleted ? 'bg-muted text-muted-foreground' : ''}
                `}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>
              <span
                className={`text-[8px] font-black uppercase tracking-wider whitespace-nowrap hidden sm:block
                  ${isCompleted ? 'text-black' : 'text-muted-foreground opacity-60'}
                `}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
      
      {/* Background Line */}
      <div className="absolute top-8 left-4 right-4 h-[2px] bg-muted -z-10" />
      {/* Progress Line */}
      <div 
        className="absolute top-8 left-4 h-[2px] bg-black transition-all duration-500 ease-in-out -z-10"
        style={{ width: `calc(${((activeIndex) / (STEPS.length - 1)) * 100}% - 2rem)` }}
      />
    </div>
  );
};
