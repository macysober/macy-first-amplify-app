'use client';

import { useState } from 'react';
import { makeupProducts } from '../app/lib/productData';
import ProgressIndicator from './ProgressIndicator';
import EmailModal from './EmailModal';

export default function MakeupQuiz() {
  const [currentStep, setCurrentStep] = useState('intro');
  const [skinTone, setSkinTone] = useState('');
  const [undertone, setUndertone] = useState('');
  const [coverage, setCoverage] = useState('');
  const [finish, setFinish] = useState('');
  const [budget, setBudget] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showEmailModal, setShowEmailModal] = useState(false);

  const skinTones = [
    { id: 'fair', label: 'Fair', description: 'Very light, burns easily', emoji: '🤍' },
    { id: 'light', label: 'Light', description: 'Light, minimal tanning', emoji: '🍦' },
    { id: 'medium', label: 'Medium', description: 'Medium, tans gradually', emoji: '🍯' },
    { id: 'tan', label: 'Tan', description: 'Olive to tan', emoji: '🥐' },
    { id: 'deep', label: 'Deep', description: 'Deep, rarely burns', emoji: '🍫' }
  ];

  const undertones = [
    { id: 'cool', label: 'Cool', description: 'Pink/red undertones, silver jewelry', emoji: '❄️' },
    { id: 'warm', label: 'Warm', description: 'Yellow/golden undertones, gold jewelry', emoji: '☀️' },
    { id: 'neutral', label: 'Neutral', description: 'Mix of both, all jewelry works', emoji: '⚖️' }
  ];

  const coverageOptions = [
    { id: 'light', label: 'Light', description: 'Natural, skin-like', emoji: '✨' },
    { id: 'medium', label: 'Medium', description: 'Evens skin tone', emoji: '🎯' },
    { id: 'full', label: 'Full', description: 'Covers everything', emoji: '🛡️' }
  ];

  const finishOptions = [
    { id: 'dewy', label: 'Dewy', description: 'Luminous glow', emoji: '💫' },
    { id: 'natural', label: 'Natural', description: 'Skin-like finish', emoji: '🌸' },
    { id: 'matte', label: 'Matte', description: 'Shine-free', emoji: '🪨' }
  ];

  const budgetOptions = [
    { id: 'all', label: 'All Prices', emoji: '💎' },
    { id: 'budget', label: 'Under $25', emoji: '💵' },
    { id: 'mid', label: '$25-$50', emoji: '💰' },
    { id: 'premium', label: 'Over $50', emoji: '👑' }
  ];

  const getMakeupRecommendations = (skinTone: string) => {
    const toneProducts = makeupProducts[skinTone] || makeupProducts.medium;
    const foundation = toneProducts.foundation || [];
    const universal = makeupProducts.universal || [];
    
    let products = [...foundation, ...universal];
    
    // Filter by search term
    if (searchTerm) {
      products = products.filter((product: any) => 
        product.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by budget
    if (budget !== 'all') {
      products = products.filter((product: any) => {
        const price = parseInt(product.price.replace('$', ''));
        if (budget === 'budget') return price < 25;
        if (budget === 'mid') return price >= 25 && price <= 50;
        if (budget === 'premium') return price > 50;
        return true;
      });
    }
    
    return products;
  };

  const resetQuiz = () => {
    setCurrentStep('intro');
    setSkinTone('');
    setUndertone('');
    setCoverage('');
    setFinish('');
    setBudget('all');
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Intro Step */}
      {currentStep === 'intro' && (
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="text-6xl mb-4">💄</div>
          <h2 className="text-2xl font-bold mb-4">Makeup Quiz</h2>
          <p className="text-gray-600 mb-6">
            Find your perfect makeup matches based on your skin tone and preferences.
          </p>
          <button
            onClick={() => setCurrentStep('skinTone')}
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all"
          >
            Start Makeup Quiz →
          </button>
        </div>
      )}

      {/* Skin Tone Step */}
      {currentStep === 'skinTone' && (
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <ProgressIndicator currentStep={1} totalSteps={4} />
          <h2 className="text-2xl font-bold mb-2">What's your skin tone?</h2>
          <p className="text-gray-600 mb-6">Choose the option closest to your skin color</p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
            {skinTones.map((tone) => (
              <button
                key={tone.id}
                onClick={() => setSkinTone(tone.id)}
                className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                  skinTone === tone.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="text-2xl mb-1">{tone.emoji}</div>
                <div className="text-sm font-medium">{tone.label}</div>
                <div className="text-xs text-gray-500">{tone.description}</div>
              </button>
            ))}
          </div>
          
          <div className="flex justify-between">
            <button
              onClick={() => setCurrentStep('intro')}
              className="text-gray-500 hover:text-gray-700"
            >
              ← Back
            </button>
            <button
              onClick={() => setCurrentStep('undertone')}
              disabled={!skinTone}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                skinTone
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:shadow-lg'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* Undertone Step */}
      {currentStep === 'undertone' && (
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <ProgressIndicator currentStep={2} totalSteps={4} />
          <h2 className="text-2xl font-bold mb-2">What's your undertone?</h2>
          <p className="text-gray-600 mb-6">This helps us find the perfect shade match</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
            {undertones.map((tone) => (
              <button
                key={tone.id}
                onClick={() => setUndertone(tone.id)}
                className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                  undertone === tone.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="text-2xl mb-1">{tone.emoji}</div>
                <div className="text-sm font-medium">{tone.label}</div>
                <div className="text-xs text-gray-500">{tone.description}</div>
              </button>
            ))}
          </div>
          
          <div className="flex justify-between">
            <button
              onClick={() => setCurrentStep('skinTone')}
              className="text-gray-500 hover:text-gray-700"
            >
              ← Back
            </button>
            <button
              onClick={() => setCurrentStep('preferences')}
              disabled={!undertone}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                undertone
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:shadow-lg'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* Preferences Step */}
      {currentStep === 'preferences' && (
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <ProgressIndicator currentStep={3} totalSteps={4} />
          <h2 className="text-2xl font-bold mb-6">Your makeup preferences</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3">Coverage Level</h3>
              <div className="grid grid-cols-3 gap-3">
                {coverageOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setCoverage(option.id)}
                    className={`p-3 rounded-lg border-2 transition-all hover:shadow-md ${
                      coverage === option.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="text-xl mb-1">{option.emoji}</div>
                    <div className="text-sm font-medium">{option.label}</div>
                    <div className="text-xs text-gray-500">{option.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Finish Type</h3>
              <div className="grid grid-cols-3 gap-3">
                {finishOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setFinish(option.id)}
                    className={`p-3 rounded-lg border-2 transition-all hover:shadow-md ${
                      finish === option.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="text-xl mb-1">{option.emoji}</div>
                    <div className="text-sm font-medium">{option.label}</div>
                    <div className="text-xs text-gray-500">{option.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex justify-between mt-6">
            <button
              onClick={() => setCurrentStep('undertone')}
              className="text-gray-500 hover:text-gray-700"
            >
              ← Back
            </button>
            <button
              onClick={() => setCurrentStep('results')}
              disabled={!coverage || !finish}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                coverage && finish
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:shadow-lg'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Get Recommendations →
            </button>
          </div>
        </div>
      )}

      {/* Results Step */}
      {currentStep === 'results' && (
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <ProgressIndicator currentStep={4} totalSteps={4} />
          <h2 className="text-2xl font-bold mb-2 text-center">Your Makeup Matches</h2>
          <p className="text-gray-600 mb-6 text-center">Curated for your perfect look</p>
          
          {/* User Profile Summary */}
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-semibold">Skin Tone:</span> {skinTones.find(t => t.id === skinTone)?.label}
              </div>
              <div>
                <span className="font-semibold">Undertone:</span> {undertones.find(t => t.id === undertone)?.label}
              </div>
              <div>
                <span className="font-semibold">Coverage:</span> {coverageOptions.find(c => c.id === coverage)?.label}
              </div>
              <div>
                <span className="font-semibold">Finish:</span> {finishOptions.find(f => f.id === finish)?.label}
              </div>
            </div>
          </div>

          {/* Filters Section */}
          <div className="mb-6 space-y-4">
            {/* Search Bar */}
            <div>
              <h3 className="font-semibold mb-3 text-center">Search Products</h3>
              <div className="max-w-md mx-auto">
                <input
                  type="text"
                  placeholder="Search by product type, brand, or name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Budget Filter */}
            <div>
              <h3 className="font-semibold mb-3 text-center">Filter by Budget</h3>
              <div className="flex justify-center gap-2 flex-wrap">
                {budgetOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setBudget(option.id)}
                  className={`px-4 py-2 rounded-full transition-all ${
                    budget === option.id
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="mr-1">{option.emoji}</span>
                  {option.label}
                </button>
              ))}
              </div>
            </div>
          </div>

          {/* Product Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {getMakeupRecommendations(skinTone).length > 0 ? (
              getMakeupRecommendations(skinTone).map((product: any, index: number) => (
              <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-all">
                <div className="flex justify-between items-start">
                  <div className="font-semibold text-pink-600">{product.type}</div>
                  <div className="text-lg font-bold">{product.price}</div>
                </div>
                <div className="text-xs text-gray-500 mt-1">{product.brand}</div>
                <div className="text-sm font-medium mt-1">
                  {product.name} {product.shade && `- ${product.shade}`}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"}>★</span>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">({product.reviews.toLocaleString()})</span>
                </div>
                <div className="text-xs text-gray-600 mt-2">{product.benefit}</div>
                <div className="text-xs text-gray-500 italic mt-2 border-l-2 border-pink-200 pl-2">
                  {product.review}
                </div>
              </div>
            ))
            ) : (
              <div className="col-span-2 text-center py-8 text-gray-500">
                <p className="text-lg mb-2">No products found in this price range.</p>
                <p className="text-sm">Try adjusting your budget filter to see more options.</p>
              </div>
            )}
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={resetQuiz}
              className="px-6 py-2 rounded-full border-2 border-purple-500 text-purple-600 font-semibold hover:bg-purple-50"
            >
              Retake Quiz
            </button>
            <button
              onClick={() => setShowEmailModal(true)}
              className="px-6 py-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold hover:shadow-lg"
            >
              📧 Email Results
            </button>
          </div>

          <EmailModal
            isOpen={showEmailModal}
            onClose={() => setShowEmailModal(false)}
            results={{
              profile: {
                'Skin Tone': skinTones.find(t => t.id === skinTone)?.label || '',
                'Undertone': undertones.find(t => t.id === undertone)?.label || '',
                'Coverage Preference': coverageOptions.find(c => c.id === coverage)?.label || '',
                'Finish Preference': finishOptions.find(f => f.id === finish)?.label || '',
                'Budget Filter': budgetOptions.find(b => b.id === budget)?.label || 'All Prices'
              },
              products: getMakeupRecommendations(skinTone)
            }}
            quizType="makeup"
          />
        </div>
      )}
    </div>
  );
}