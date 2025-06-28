import React from 'react';
import Navigation from '../components/Navigation';
import StatusChecker from '../components/StatusChecker';

const CheckStatus = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      <div className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Check Registration Status
            </h1>
            <p className="text-gray-600">
              Enter your mobile number or customer ID to check your registration status
            </p>
          </div>
          
          <StatusChecker />
        </div>
      </div>
    </div>
  );
};

export default CheckStatus;