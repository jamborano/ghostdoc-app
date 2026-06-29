// components/LoadingDots.tsx
import React from 'react';

const LoadingDots = () => {
  return (
    <span className="inline-flex items-center gap-1">
      Loading
      <span className="animate-bounce [animation-delay:-0.3s]">.</span>
      <span className="animate-bounce [animation-delay:-0.15s]">.</span>
      <span className="animate-bounce [animation-delay:0s]">.</span>
    </span>
  );
};

export default LoadingDots;