import React from 'react';
import { Check } from 'lucide-react';

interface CheckoutStepperProps {
  currentStep: number;
  steps: string[];
}

export const CheckoutStepper: React.FC<CheckoutStepperProps> = ({ currentStep, steps }) => {
  return (
    <div className="w-full mb-12">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-muted -z-10" />
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-black transition-all duration-500 ease-in-out -z-10"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />
        
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <div key={step} className="flex flex-col items-center gap-3 relative">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs transition-all duration-300
                  ${isActive ? 'bg-black text-white ring-4 ring-black/10 scale-110' : ''}
                  ${isCompleted ? 'bg-black text-white' : ''}
                  ${!isActive && !isCompleted ? 'bg-white text-muted-foreground border-2 border-muted' : ''}
                `}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : stepNumber}
              </div>
              <span className={`absolute -bottom-7 whitespace-nowrap text-[10px] font-black uppercase tracking-widest
                ${isActive ? 'text-black' : 'text-muted-foreground opacity-60'}
              `}>
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
