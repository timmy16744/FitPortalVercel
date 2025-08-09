import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-surface-background">
      <div className="text-center">
        <div className="w-8 h-8 mx-auto mb-2 bg-brand-500 rounded-lg"></div>
        <h1 className="text-lg font-semibold text-primary">FitPortal</h1>
      </div>
    </div>
  );
};

export default LoadingScreen;