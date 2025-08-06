'use client';

import { useState } from 'react';
import { skinProducts, concernProducts } from '../app/lib/productData';
import ProgressIndicator from './ProgressIndicator';
import EmailModal from './EmailModal';

export default function SkincareQuiz() {
  const [currentStep, setCurrentStep] = useState('intro');
  const [skinType, setSkinType] = useState('');
  const [skinConcerns, setSkinConcerns] = useState<string[]>([]);
  const [age, setAge] = useState('');
  const [budget, setBudget] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showEmailModal, setShowEmailModal] = useState(false);

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

  const ageRanges = [
    { id: 'teens', label: 'Under 20', emoji: '👶' },
    { id: '20s', label: '20-29', emoji: '🌸' },
    { id: '30s', label: '30-39', emoji: '🌺' },
    { id: '40s', label: '40-49', emoji: '🌹' },
    { id: '50s', label: '50+', emoji: '🌷' }
  ];

  const budgetOptions = [
    { id: 'all', label: 'All Prices', emoji: '💎' },
    { id: 'budget', label: 'Under $25', emoji: '💵' },
    { id: 'mid', label: '$25-$50', emoji: '💰' },
    { id: 'premium', label: 'Over $50', emoji: '👑' }
  ];

  const getSkinRecommendations = (skinType: string, concerns: string[]) => {
    let products = [...(skinProducts[skinType] || skinProducts.normal)];
    
    concerns.forEach(concern => {
      if (concernProducts[concern]) {
        products.push(concernProducts[concern]);
      }
    });
    
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
    setSkinType('');
    setSkinConcerns([]);
    setAge('');
    setBudget('all');
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Intro Step */}
      {currentStep === 'intro' && (
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="text-6xl mb-4">✨</div>
          <h2 className="text-2xl font-bold mb-4">Skin Care Quiz</h2>
          <p className="text-gray-600 mb-6">
            Get personalized skincare recommendations based on your skin type, age, and concerns.
          </p>
          <button
            onClick={() => setCurrentStep('age')}
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all"
          >
            Start Skin Quiz →
          </button>
        </div>
      )}

      {/* Age Step */}
      {currentStep === 'age' && (
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <ProgressIndicator currentStep={1} totalSteps={4} />
          <h2 className="text-2xl font-bold mb-2">What's your age range?</h2>
          <p className="text-gray-600 mb-6">This helps us recommend age-appropriate ingredients</p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
            {ageRanges.map((range) => (
              <button
                key={range.id}
                onClick={() => setAge(range.id)}
                className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                  age === range.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="text-2xl mb-1">{range.emoji}</div>
                <div className="text-sm font-medium">{range.label}</div>
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
              onClick={() => setCurrentStep('skinType')}
              disabled={!age}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                age
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
      {currentStep === 'skinType' && (
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <ProgressIndicator currentStep={2} totalSteps={4} />
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
              onClick={() => setCurrentStep('age')}
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
          <ProgressIndicator currentStep={3} totalSteps={4} />
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
              onClick={() => setCurrentStep('skinType')}
              className="text-gray-500 hover:text-gray-700"
            >
              ← Back
            </button>
            <button
              onClick={() => setCurrentStep('results')}
              className="px-6 py-2 rounded-full font-semibold bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:shadow-lg"
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
          <h2 className="text-2xl font-bold mb-2 text-center">Your Skincare Routine</h2>
          <p className="text-gray-600 mb-6 text-center">Customized for your skin needs</p>
          
          {/* User Profile Summary */}
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-semibold">Age Range:</span> {ageRanges.find(a => a.id === age)?.label}
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
            {getSkinRecommendations(skinType, skinConcerns).length > 0 ? (
              getSkinRecommendations(skinType, skinConcerns).map((product: any, index: number) => (
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
                'Age Range': ageRanges.find(a => a.id === age)?.label || '',
                'Skin Type': skinTypes.find(s => s.id === skinType)?.label || '',
                'Concerns': skinConcerns.length > 0 
                  ? skinConcerns.map(c => skinConcernOptions.find(opt => opt.id === c)?.label).join(', ')
                  : 'None specified',
                'Budget Filter': budgetOptions.find(b => b.id === budget)?.label || 'All Prices'
              },
              products: getSkinRecommendations(skinType, skinConcerns)
            }}
            quizType="skincare"
          />
        </div>
      )}
    </div>
  );
}