import React from 'react';

const LoadingDots = () => {
  return (
    <div className="flex items-center justify-center gap-1.5">
      <span className="w-2.5 h-2.5 bg-[#0366d6] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
      <span className="w-2.5 h-2.5 bg-[#0366d6] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
      <span className="w-2.5 h-2.5 bg-[#0366d6] rounded-full animate-bounce [animation-delay:0s]"></span>
    </div>
  );
};

export default LoadingDots;