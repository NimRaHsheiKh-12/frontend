/**
 * ChatPage for TaskBox Chatbot Assistant (Taskie)
 */

import React from 'react';
import Head from 'next/head';
import ChatInterface from '../components/ChatInterface';

const ChatPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Taskie - Your AI Task Assistant | TaskBox</title>
        <meta name="description" content="Chat with Taskie, your AI assistant for managing tasks" />
      </Head>

      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold flex items-center">
            <span className="mr-3">🤖</span> Taskie - Your AI Task Assistant
          </h1>
          <p className="mt-2 opacity-90">
            Chat with Taskie to manage your tasks efficiently
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-1 bg-gradient-to-r from-blue-500 to-purple-500">
              <div className="bg-white rounded-lg p-6">
                <ChatInterface />
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-blue-500 text-2xl mb-3">➕</div>
              <h3 className="font-semibold text-lg mb-2">Add Tasks</h3>
              <p className="text-gray-600">
                Simply tell Taskie what you want to add: "Add 'buy groceries'"
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-green-500 text-2xl mb-3">📋</div>
              <h3 className="font-semibold text-lg mb-2">View Tasks</h3>
              <p className="text-gray-600">
                Ask Taskie to show your tasks: "Show my tasks"
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-purple-500 text-2xl mb-3">⭐</div>
              <h3 className="font-semibold text-lg mb-2">Get Guidance</h3>
              <p className="text-gray-600">
                Get tips on task management: "How can I organize my tasks?"
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatPage;