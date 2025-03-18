import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import Navbar from '@/components/Navbar';

const AccessDenied = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 pt-20">
        <div className="text-center max-w-md w-full bg-white p-8 rounded-lg shadow-md">
          <div className="inline-flex bg-red-50 p-4 rounded-full mb-4">
            <ShieldAlert size={48} className="text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Admin Access Required</h1>
          <p className="text-gray-600 mb-6">
            This page is restricted to administrators only. If you believe you should have access, please contact the site admin.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link 
              to="/" 
              className="inline-flex items-center justify-center rounded-md bg-[#00376f] px-4 py-2 text-sm font-medium text-white hover:bg-[#002a57] transition-colors"
            >
              Return to Home
            </Link>
            <Link 
              to="/events" 
              className="inline-flex items-center justify-center rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
            >
              View Events
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default AccessDenied;