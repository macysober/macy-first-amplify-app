'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import HaircareQuiz from '@/components/HaircareQuiz';
import SkincareQuiz from '@/components/SkincareQuiz';
import MakeupQuiz from '@/components/MakeupQuiz';
import Chatbot from '@/components/Chatbot';

export default function Home() {
  const [activeTab, setActiveTab] = useState('home');
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const tabs = [
    { id: 'home', label: 'Home', emoji: '🏠' },
    { id: 'haircare', label: 'Hair Care', emoji: '💇‍♀️' },
    { id: 'skincare', label: 'Skin Care', emoji: '✨' },
    { id: 'makeup', label: 'Makeup', emoji: '💄' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-full shadow-md p-1 flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                }`}
              >
                <span className="text-lg">{tab.emoji}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {activeTab === 'home' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center relative overflow-hidden">
              {/* Background Beauty Products Pattern */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                <div className="absolute top-10 left-10 text-6xl beauty-bg-1">💄</div>
                <div className="absolute top-20 right-20 text-7xl beauty-bg-2">💅</div>
                <div className="absolute bottom-10 left-20 text-5xl beauty-bg-3">🧴</div>
                <div className="absolute bottom-20 right-10 text-6xl beauty-bg-4">💋</div>
                <div className="absolute top-1/2 left-1/4 text-7xl beauty-bg-5">🧼</div>
                <div className="absolute top-1/3 right-1/3 text-5xl beauty-bg-6">✨</div>
                <div className="absolute bottom-1/3 left-1/3 text-6xl beauty-bg-7">🧽</div>
                <div className="absolute top-40 left-1/2 text-5xl beauty-bg-8">🪒</div>
                <div className="absolute bottom-40 right-1/4 text-7xl beauty-bg-9">💆‍♀️</div>
                <div className="absolute top-60 left-60 text-8xl beauty-bg-1">🧖‍♀️</div>
                <div className="absolute bottom-60 right-60 text-6xl beauty-bg-3">💆</div>
                <div className="absolute top-1/4 right-1/2 text-5xl beauty-bg-5">🧴</div>
                <div className="absolute top-80 right-40 text-7xl beauty-bg-7">💅</div>
                <div className="absolute bottom-1/4 left-40 text-6xl beauty-bg-9">✨</div>
                <div className="absolute top-32 left-1/3 text-5xl beauty-bg-2">🧼</div>
                <div className="absolute bottom-32 right-1/3 text-8xl beauty-bg-4">💄</div>
              </div>
              <div className="relative z-10">
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                Welcome to Beauty Match AI
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Your personalized beauty advisor powered by AI
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <div 
                  onClick={() => setActiveTab('haircare')}
                  className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl cursor-pointer hover:shadow-lg transition-all hover:scale-105"
                >
                  <div className="text-4xl mb-4">💇‍♀️</div>
                  <h3 className="text-xl font-semibold mb-2">Hair Care</h3>
                  <p className="text-gray-600 text-sm">
                    Discover products for your unique hair type and concerns
                  </p>
                </div>
                
                <div 
                  onClick={() => setActiveTab('skincare')}
                  className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl cursor-pointer hover:shadow-lg transition-all hover:scale-105"
                >
                  <div className="text-4xl mb-4">✨</div>
                  <h3 className="text-xl font-semibold mb-2">Skin Care</h3>
                  <p className="text-gray-600 text-sm">
                    Build your perfect skincare routine based on your needs
                  </p>
                </div>
                
                <div 
                  onClick={() => setActiveTab('makeup')}
                  className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl cursor-pointer hover:shadow-lg transition-all hover:scale-105"
                >
                  <div className="text-4xl mb-4">💄</div>
                  <h3 className="text-xl font-semibold mb-2">Makeup</h3>
                  <p className="text-gray-600 text-sm">
                    Find your perfect shades and makeup essentials
                  </p>
                </div>
              </div>

              <div className="mt-12 bg-gradient-to-r from-pink-100 to-purple-100 rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-3">How It Works</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                  <div className="flex items-start gap-3">
                    <div className="bg-white rounded-full p-2 text-purple-600 font-bold">1</div>
                    <div>
                      <h4 className="font-semibold">Take a Quiz</h4>
                      <p className="text-sm text-gray-600">Answer questions about your beauty needs</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-white rounded-full p-2 text-purple-600 font-bold">2</div>
                    <div>
                      <h4 className="font-semibold">Get Matched</h4>
                      <p className="text-sm text-gray-600">AI analyzes and finds perfect products</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-white rounded-full p-2 text-purple-600 font-bold">3</div>
                    <div>
                      <h4 className="font-semibold">Shop Smart</h4>
                      <p className="text-sm text-gray-600">See reviews and make informed choices</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed How It Works Section */}
              <div className="mt-12 text-left space-y-6">
                <h2 className="text-3xl font-bold text-center mb-8">Why Choose Beauty Match AI?</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-3 text-purple-600">🎯 Personalized Recommendations</h3>
                    <p className="text-gray-600">
                      Our advanced AI algorithm analyzes your unique beauty profile to recommend products that actually work for you. No more guessing games or wasted money on products that don't suit your needs.
                    </p>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-3 text-purple-600">🔬 Science-Based Approach</h3>
                    <p className="text-gray-600">
                      We use dermatologist-approved classifications and ingredient analysis to ensure every recommendation is backed by science. Your skin and hair deserve products that are proven to work.
                    </p>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-3 text-purple-600">💰 Save Time & Money</h3>
                    <p className="text-gray-600">
                      Stop buying products that end up unused. Our targeted recommendations mean you only invest in products that match your specific needs, saving you hundreds of dollars annually.
                    </p>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-3 text-purple-600">⭐ Real User Reviews</h3>
                    <p className="text-gray-600">
                      Every product recommendation includes authentic reviews from people with similar beauty profiles. Make informed decisions based on real experiences, not just marketing claims.
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-8 rounded-lg mt-8">
                  <h3 className="text-2xl font-semibold mb-4 text-center">Our Promise</h3>
                  <p className="text-gray-700 text-center max-w-3xl mx-auto">
                    At Beauty Match AI, we believe everyone deserves to feel confident in their beauty routine. Our mission is to demystify beauty shopping by providing personalized, unbiased recommendations that celebrate your unique features. Whether you're a beauty novice or a skincare enthusiast, we're here to help you discover products that make you look and feel your best.
                  </p>
                </div>
              </div>

              {/* Contact Section */}
              <div className="mt-16 bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-center mb-8">Get In Touch</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                  <div>
                    <div className="text-3xl mb-3">📧</div>
                    <h4 className="font-semibold mb-2">Email Us</h4>
                    <p className="text-gray-600">hello@beautymatchai.com</p>
                    <p className="text-sm text-gray-500 mt-1">24/7 Support</p>
                  </div>
                  
                  <div>
                    <div className="text-3xl mb-3">📱</div>
                    <h4 className="font-semibold mb-2">Call Us</h4>
                    <p className="text-gray-600">1-800-BEAUTY-AI</p>
                    <p className="text-sm text-gray-500 mt-1">(1-800-232-8892)</p>
                    <p className="text-sm text-gray-500">Mon-Fri 9AM-6PM EST</p>
                  </div>
                  
                  <div>
                    <div className="text-3xl mb-3">📍</div>
                    <h4 className="font-semibold mb-2">Visit Us</h4>
                    <p className="text-gray-600">123 Beauty Boulevard</p>
                    <p className="text-gray-600">Suite 456</p>
                    <p className="text-gray-600">New York, NY 10001</p>
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <h4 className="font-semibold mb-4">Follow Us</h4>
                  <div className="flex justify-center gap-4">
                    <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-full hover:shadow-lg transition-all">
                      Instagram @beautymatchai
                    </button>
                    <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-full hover:shadow-lg transition-all">
                      TikTok @beautymatchai
                    </button>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
                  <p>Beauty Match AI © 2024 | All Rights Reserved</p>
                  <p className="mt-2">Made with 💖 by the Beauty Match AI Team</p>
                </div>
              </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'haircare' && <HaircareQuiz />}
        {activeTab === 'skincare' && <SkincareQuiz />}
        {activeTab === 'makeup' && <MakeupQuiz />}
      </main>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 left-8 bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50"
          aria-label="Back to top"
        >
          <svg 
            className="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M5 10l7-7m0 0l7 7m-7-7v18" 
            />
          </svg>
        </button>
      )}

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
}