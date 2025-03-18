import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

const AccessDenied = () => {
  return (
    <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <div className="inline-flex bg-red-50 p-4 rounded-full mb-4">
          <ShieldAlert size={48} className="text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-6">You don't have permission to access this page.</p>
        <Link 
          to="/" 
          className="inline-flex items-center justify-center rounded-md bg-[#00376f] px-4 py-2 text-sm font-medium text-white hover:bg-[#002a57] hover:text-white transition-colors"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default AccessDenied;