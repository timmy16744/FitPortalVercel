import React from 'react';
import { BarChart3 } from 'lucide-react';

const ProgressTracking = () => {
  return (
    <div className="min-h-screen bg-warm-black p-6">
      <div className="mb-8 fade-in">
        <h1 className="text-3xl font-bold text-warm-white mb-2">Progress Tracking</h1>
        <p className="text-warm-white opacity-60">
          Monitor client progress and analytics
        </p>
      </div>

      <div className="card text-center py-12">
        <BarChart3 className="w-16 h-16 text-warm-white opacity-30 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-warm-white mb-2">Progress Tracking</h3>
        <p className="text-warm-white opacity-60">
          Charts and analytics dashboard coming soon...
        </p>
      </div>
    </div>
  );
};

export default ProgressTracking; 