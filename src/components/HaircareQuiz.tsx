'use client';

import { useState } from 'react';
import { hairProducts, defaultHairProducts } from '../app/lib/productData';
import ProgressIndicator from './ProgressIndicator';
import EmailModal from './EmailModal';

export default function HaircareQuiz() {
  const [currentStep, setCurrentStep] = useState('intro');
  const [hairType, setHairType] = useState('');
  const [hairConcerns, setHairConcerns] = useState<string[]>([]);
  const [budget, setBudget] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showEmailModal, setShowEmailModal] = useState(false);

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

  const hairConcernOptions = [
    { id: 'damage', label: 'Damage & Breakage', emoji: '💔' },
    { id: 'frizz', label: 'Frizz Control', emoji: '⚡' },
    { id: 'volume', label: 'Lack of Volume', emoji: '📏' },
    { id: 'dryness', label: 'Dryness', emoji: '🏜️' },
    { id: 'oiliness', label: 'Oily Scalp', emoji: '💧' },
    { id: 'growth', label: 'Hair Growth', emoji: '🌱' },
    { id: 'color', label: 'Color Protection', emoji: '🎨' },
    { id: 'dandruff', label: 'Dandruff', emoji: '❄️' }
  ];

  const budgetOptions = [
    { id: 'all', label: 'All Prices', emoji: '💎' },
    { id: 'budget', label: 'Under $25', emoji: '💵' },
    { id: 'mid', label: '$25-$50', emoji: '💰' },
    { id: 'premium', label: 'Over $50', emoji: '👑' }
  ];

  const getHairRecommendations = (hairType: string) => {
    let products = hairProducts[hairType] || hairProducts[hairType.substring(0, 2)] || defaultHairProducts;
    
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

  const getStepNumber = () => {
    switch(currentStep) {
      case 'hairType': return 1;
      case 'concerns': return 2;
      case 'results': return 3;
      default: return 0;
    }
  };

  const resetQuiz = () => {
    setCurrentStep('intro');
    setHairType('');
    setHairConcerns([]);
    setBudget('all');
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Intro Step */}
      {currentStep === 'intro' && (
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="text-6xl mb-4">💇‍♀️</div>
          <h2 className="text-2xl font-bold mb-4">Hair Care Quiz</h2>
          <p className="text-gray-600 mb-6">
            Discover your perfect hair care routine based on your unique hair type and concerns.
          </p>
          <button
            onClick={() => setCurrentStep('hairType')}
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all"
          >
            Start Hair Quiz →
          </button>
        </div>
      )}

      {/* Hair Type Step */}
      {currentStep === 'hairType' && (
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <ProgressIndicator currentStep={1} totalSteps={3} />
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
              onClick={() => setCurrentStep('intro')}
              className="text-gray-500 hover:text-gray-700"
            >
              ← Back
            </button>
            <button
              onClick={() => setCurrentStep('concerns')}
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

      {/* Hair Concerns Step */}
      {currentStep === 'concerns' && (
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <ProgressIndicator currentStep={2} totalSteps={3} />
          <h2 className="text-2xl font-bold mb-2">Any specific hair concerns?</h2>
          <p className="text-gray-600 mb-6">Select all that apply (optional)</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {hairConcernOptions.map((concern) => (
              <button
                key={concern.id}
                onClick={() => {
                  setHairConcerns(prev =>
                    prev.includes(concern.id)
                      ? prev.filter(c => c !== concern.id)
                      : [...prev, concern.id]
                  );
                }}
                className={`p-3 rounded-lg border-2 transition-all hover:shadow-md ${
                  hairConcerns.includes(concern.id)
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
              onClick={() => setCurrentStep('hairType')}
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
          <ProgressIndicator currentStep={3} totalSteps={3} />
          <h2 className="text-2xl font-bold mb-2 text-center">Your Hair Care Recommendations</h2>
          <p className="text-gray-600 mb-6 text-center">Personalized for your hair type</p>
          
          {/* User Profile Summary */}
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-4 mb-6">
            <div className="text-sm">
              <div>
                <span className="font-semibold">Hair Type:</span> {hairTypes.find(h => h.id === hairType)?.label}
              </div>
              {hairConcerns.length > 0 && (
                <div className="mt-2">
                  <span className="font-semibold">Concerns:</span> {hairConcerns.map(c => 
                    hairConcernOptions.find(opt => opt.id === c)?.label
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
            {getHairRecommendations(hairType).length > 0 ? (
              getHairRecommendations(hairType).map((product: any, index: number) => (
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
                'Hair Type': hairTypes.find(h => h.id === hairType)?.label || '',
                'Concerns': hairConcerns.length > 0 
                  ? hairConcerns.map(c => hairConcernOptions.find(opt => opt.id === c)?.label).join(', ')
                  : 'None specified',
                'Budget Filter': budgetOptions.find(b => b.id === budget)?.label || 'All Prices'
              },
              products: getHairRecommendations(hairType)
            }}
            quizType="haircare"
          />
        </div>
      )}
    </div>
  );
}