import React from 'react';
import { UserPlus } from 'lucide-react';

const ClientOnboarding = () => {
  return (
    <div className="min-h-screen bg-warm-black p-6">
      <div className="mb-8 fade-in">
        <h1 className="text-3xl font-bold text-warm-white mb-2">Add New Client</h1>
        <p className="text-warm-white opacity-60">
          Onboard a new client to your training program
        </p>
      </div>

      <div className="card text-center py-12">
        <UserPlus className="w-16 h-16 text-warm-white opacity-30 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-warm-white mb-2">Client Onboarding</h3>
        <p className="text-warm-white opacity-60">
          Comprehensive client intake form coming soon...
        </p>
      </div>
    </div>
  );
};

export default ClientOnboarding; 