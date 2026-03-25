import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, hint, id, type, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const [showPassword, setShowPassword] = useState(false);
    
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className="flex flex-col gap-1 w-full relative">
        {label && (
          <label
            htmlFor={inputId}
            className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            id={inputId}
            ref={ref}
            type={inputType}
            className={`
              h-12 w-full border rounded-xl px-4 text-xs font-bold bg-white
               placeholder:text-muted-foreground placeholder:font-medium
              ${error ? 'border-destructive focus:ring-destructive' : 'border-border focus:border-black'}
              outline-none transition-all
              ${isPassword ? 'pr-12' : ''}
              ${className}
            `}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 top-0 h-10 w-12 flex items-center justify-center text-muted-foreground hover:text-black transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          )}
        </div>
        {hint && !error && <p className="text-[10px] font-bold tracking-widest text-muted-foreground ml-1">{hint}</p>}
        {error && <p className="text-[10px] font-bold tracking-widest uppercase text-destructive ml-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
