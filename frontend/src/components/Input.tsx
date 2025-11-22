import React, { forwardRef } from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  className?: string;
}

const Input = forwardRef<HTMLInputElement, Props>(
  ({ icon, className, ...props }, ref) => {
    return (
      <div className="relative mb-6">
        {icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <span className="size-5 text-green-500">{icon}</span>
          </div>
        )}

        <input
          ref={ref}
          {...props}
          className={
            className ||
            `w-full pl-10 pr-3 py-2 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700
             focus:border-green-500 focus:ring-2 focus:ring-green-500 text-white
             placeholder-gray-400 transition duration-200`
          }
        />
      </div>
    );
  }
);

export default Input;
