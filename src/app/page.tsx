'use client';

import { useState } from 'react';
import { hairProducts, defaultHairProducts, skinProducts, concernProducts } from './lib/productData';

export default function Home() {
  const [currentStep, setCurrentStep] = useState('welcome');
  const [hairType, setHairType] = useState('');
  const [skinType, setSkinType] = useState('');
  const [skinConcerns, setSkinConcerns] = useState<string[]>([]);

  const hairTypes = [
    { id: '1a', label: '1A - Straight (Fine)', emoji: '💇‍♀️' },
    { id: '1b', label: '1B - Straight (Medium)', emoji: '💇‍♀️' },
    { id: '1c', label: '1C - Straight (Coarse)', emoji: '💇‍♀️' },
    { id: '2a', label: '2A - Wavy (Fine)', emoji: '〰️' },
    { id: '2b', label: '2B - Wavy (Medium)', emoji: '〰️' },
    { id: '2c', label: '2C - Wavy (Coarse)', emoji: '〰️' },
    { id: '3a', label: '3A - Curly (Loose)', emoji: '🌀' },
    { id: '3b', label: '3B - Curly (Tight)', emoji: '🌀' },
    { id: '3c', label: '3C - Curly (Tight Corkscrews)', emoji: '🌀' },
    { id: '4a', label: '4A - Coily (Soft)', emoji: '🔗' },
    { id: '4b', label: '4B - Coily (Wiry)', emoji: '🔗' },
    { id: '4c', label: '4C - Coily (Tight)', emoji: '🔗' }
  ];

  const skinTypes = [
    { id: 'dry', label: 'Dry', description: 'Feels tight, may have flaky patches', emoji: '🏜️' },
    { id: 'oily', label: 'Oily', description: 'Shiny, prone to breakouts', emoji: '✨' },
    { id: 'combination', label: 'Combination', description: 'Oily T-zone, dry cheeks', emoji: '🎭' },
    { id: 'normal', label: 'Normal', description: 'Balanced, few issues', emoji: '😊' },
    { id: 'sensitive', label: 'Sensitive', description: 'Easily irritated, redness', emoji: '🌹' }
  ];

  const skinConcernOptions = [
    { id: 'acne', label: 'Acne', emoji: '🔴' },
    { id: 'aging', label: 'Anti-Aging', emoji: '⏰' },
    { id: 'dark-spots', label: 'Dark Spots', emoji: '🟤' },
    { id: 'redness', label: 'Redness', emoji: '🌡️' },
    { id: 'dryness', label: 'Dryness', emoji: '💧' },
    { id: 'oiliness', label: 'Excess Oil', emoji: '🛢️' },
    { id: 'pores', label: 'Large Pores', emoji: '🕳️' },
    { id: 'sensitivity', label: 'Sensitivity', emoji: '⚡' }
  ];

  // Recommendation functions
  const getHairRecommendations = (hairType: string) => {
    return hairProducts[hairType] || hairProducts[hairType.substring(0, 2)] || defaultHairProducts;
  };

  const getSkinRecommendations = (skinType: string, concerns: string[]) => {
    let products = [...(skinProducts[skinType] || skinProducts.normal)];
    
    // Add specific products for concerns
    concerns.forEach(concern => {
      if (concernProducts[concern]) {
        products.push(concernProducts[concern]);
      }
    });
    
    return products.slice(0, 6); // Return max 6 products
  };

  return (
    <div className="font-sans min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-4">
      <main className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            ✨ Beauty Match AI ✨
          </h1>
          <p className="text-gray-600 mt-2">Find your perfect hair & skin care products</p>
        </div>

        {/* Welcome Step */}
        {currentStep === 'welcome' && (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-6xl mb-4">💄</div>
            <h2 className="text-2xl font-bold mb-4">Welcome to Beauty Match AI!</h2>
            <p className="text-gray-600 mb-6">
              Let's find the perfect products for your unique hair and skin type. 
              This personalized quiz takes just 2 minutes!
            </p>
            <button
              onClick={() => setCurrentStep('hair')}
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all"
            >
              Start Your Beauty Journey →
            </button>
          </div>
        )}

        {/* Hair Type Step */}
        {currentStep === 'hair' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-2">What's your hair type?</h2>
            <p className="text-gray-600 mb-6">Select the option that best describes your natural hair texture</p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
              {hairTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setHairType(type.id)}
                  className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                    hairType === type.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{type.emoji}</div>
                  <div className="text-sm font-medium">{type.label}</div>
                </button>
              ))}
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep('welcome')}
                className="text-gray-500 hover:text-gray-700"
              >
                ← Back
              </button>
              <button
                onClick={() => setCurrentStep('skin')}
                disabled={!hairType}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  hairType
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:shadow-lg'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Skin Type Step */}
        {currentStep === 'skin' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-2">What's your skin type?</h2>
            <p className="text-gray-600 mb-6">Choose your primary skin type</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              {skinTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSkinType(type.id)}
                  className={`p-4 rounded-lg border-2 transition-all hover:shadow-md text-left ${
                    skinType === type.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{type.emoji}</div>
                    <div>
                      <div className="font-medium">{type.label}</div>
                      <div className="text-sm text-gray-500">{type.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep('hair')}
                className="text-gray-500 hover:text-gray-700"
              >
                ← Back
              </button>
              <button
                onClick={() => setCurrentStep('concerns')}
                disabled={!skinType}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  skinType
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:shadow-lg'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Skin Concerns Step */}
        {currentStep === 'concerns' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-2">Any specific skin concerns?</h2>
            <p className="text-gray-600 mb-6">Select all that apply (optional)</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {skinConcernOptions.map((concern) => (
                <button
                  key={concern.id}
                  onClick={() => {
                    setSkinConcerns(prev =>
                      prev.includes(concern.id)
                        ? prev.filter(c => c !== concern.id)
                        : [...prev, concern.id]
                    );
                  }}
                  className={`p-3 rounded-lg border-2 transition-all hover:shadow-md ${
                    skinConcerns.includes(concern.id)
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className="text-xl mb-1">{concern.emoji}</div>
                  <div className="text-sm font-medium">{concern.label}</div>
                </button>
              ))}
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep('skin')}
                className="text-gray-500 hover:text-gray-700"
              >
                ← Back
              </button>
              <button
                onClick={() => setCurrentStep('results')}
                className="px-6 py-2 rounded-full font-semibold bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:shadow-lg"
              >
                Get My Recommendations →
              </button>
            </div>
          </div>
        )}

        {/* Results Step */}
        {currentStep === 'results' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-2 text-center">Your Personalized Recommendations</h2>
            <p className="text-gray-600 mb-6 text-center">Based on your unique profile</p>
            
            {/* User Profile Summary */}
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold">Hair Type:</span> {hairTypes.find(h => h.id === hairType)?.label}
                </div>
                <div>
                  <span className="font-semibold">Skin Type:</span> {skinTypes.find(s => s.id === skinType)?.label}
                </div>
                {skinConcerns.length > 0 && (
                  <div className="md:col-span-2">
                    <span className="font-semibold">Concerns:</span> {skinConcerns.map(c => 
                      skinConcernOptions.find(opt => opt.id === c)?.label
                    ).join(', ')}
                  </div>
                )}
              </div>
            </div>

            {/* Product Recommendations */}
            <div className="space-y-6">
              {/* Hair Products */}
              <div>
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <span>💇‍♀️</span> Hair Care Recommendations
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getHairRecommendations(hairType).map((product: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-all">
                      <div className="flex justify-between items-start">
                        <div className="font-semibold text-purple-600">{product.type}</div>
                        <div className="text-lg font-bold">{product.price}</div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{product.brand}</div>
                      <div className="text-sm font-medium mt-1">{product.name}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"}>★</span>
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">({product.reviews.toLocaleString()})</span>
                      </div>
                      <div className="text-xs text-gray-600 mt-2">{product.benefit}</div>
                      <div className="text-xs text-gray-500 italic mt-2 border-l-2 border-purple-200 pl-2">
                        {product.review}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skin Products */}
              <div>
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <span>✨</span> Skin Care Recommendations
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getSkinRecommendations(skinType, skinConcerns).map((product: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-all">
                      <div className="flex justify-between items-start">
                        <div className="font-semibold text-pink-600">{product.type}</div>
                        <div className="text-lg font-bold">{product.price}</div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{product.brand}</div>
                      <div className="text-sm font-medium mt-1">{product.name}</div>
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
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={() => {
                  setCurrentStep('welcome');
                  setHairType('');
                  setSkinType('');
                  setSkinConcerns([]);
                }}
                className="px-6 py-2 rounded-full border-2 border-purple-500 text-purple-600 font-semibold hover:bg-purple-50"
              >
                Start Over
              </button>
              <button
                onClick={() => window.print()}
                className="px-6 py-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold hover:shadow-lg"
              >
                Save Results
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}