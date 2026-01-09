// src/pages/index.tsx
import React from 'react';
import Link from 'next/link';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white rounded-2xl shadow-md p-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 font-poppins">
            TaskBox
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 font-inter">
            Your smart companion for tasks & chats
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <Link href="/login">
                <button
                  className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:ring-offset-2 shadow-sm font-inter"
                >
                  Sign in to your account
                </button>
              </Link>
            </div>

            <div>
              <Link href="/register">
                <button
                  className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:ring-offset-2 shadow-sm font-inter"
                >
                  Create a new account
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;