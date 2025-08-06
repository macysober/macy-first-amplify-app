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

    const recommendations: any = {
      '1a': [
        { 
          type: 'Shampoo', 
          brand: 'Bumble and bumble',
          name: 'Thickening Volume Shampoo', 
          benefit: 'Adds body without weighing down fine hair', 
          price: '$34',
          rating: 4.5,
          reviews: 2847,
          review: '"This literally transformed my flat hair! I can\'t believe the volume." - Sarah M.'
        },
        { 
          type: 'Conditioner', 
          brand: 'Living Proof',
          name: 'Full Conditioner', 
          benefit: 'Weightless moisture for fine hair', 
          price: '$32',
          rating: 4.3,
          reviews: 1923,
          review: '"Finally a conditioner that doesn\'t make my hair limp!" - Jessica R.'
        },
        { 
          type: 'Styling', 
          brand: 'Oribe',
          name: 'Maximista Thickening Spray', 
          benefit: 'Heat protection + root lift', 
          price: '$39',
          rating: 4.6,
          reviews: 892,
          review: "Expensive but worth every penny. My hair has never looked fuller." - Emma L.
        },
        { 
          type: 'Treatment', 
          brand: 'Olaplex',
          name: 'No. 3 Hair Perfector', 
          benefit: 'Strengthens and repairs bonds', 
          price: '$30',
          rating: 4.4,
          reviews: 15783,
          review: "My hairdresser noticed the difference immediately!" - Ashley K.
        }
      ],
      '2a': [
        { 
          type: 'Shampoo', 
          brand: 'Ouidad',
          name: 'VitalCurl+ Clear & Gentle Shampoo', 
          benefit: 'Enhances natural wave pattern', 
          price: '$26',
          rating: 4.4,
          reviews: 1456,
          review: "My waves have never been more defined and frizz-free!" - Maria G.
        },
        { 
          type: 'Conditioner', 
          brand: 'DevaCurl',
          name: 'One Condition Delight', 
          benefit: 'Lightweight moisture for wavy hair', 
          price: '$28',
          rating: 4.2,
          reviews: 2103,
          review: "Perfect for my 2A waves - not too heavy!" - Rachel T.
        },
        { 
          type: 'Styling', 
          brand: 'IGK',
          name: 'Beach Club Texture Spray', 
          benefit: 'Effortless beachy waves', 
          price: '$29',
          rating: 4.5,
          reviews: 3421,
          review: "This is my holy grail! Smells amazing too." - Lauren B.
        },
        { 
          type: 'Treatment', 
          brand: 'Moroccanoil',
          name: 'Treatment Light', 
          benefit: 'Reduces frizz, adds shine', 
          price: '$48',
          rating: 4.7,
          reviews: 8934,
          review: "A little goes a long way. My waves are so soft!" - Nina P.
        }
      ],
      '3a': [
        { 
          type: 'Shampoo', 
          brand: 'SheaMoisture',
          name: 'Coconut & Hibiscus Curl Shampoo', 
          benefit: 'Sulfate-free cleansing', 
          price: '$13',
          rating: 4.3,
          reviews: 5672,
          review: "Affordable and works amazing on my 3A curls!" - Destiny W.
        },
        { 
          type: 'Conditioner', 
          brand: 'Curlsmith',
          name: 'Core Strength Shampoo', 
          benefit: 'Protein-moisture balance', 
          price: '$28',
          rating: 4.6,
          reviews: 892,
          review: "My curls bounce back even on day 3!" - Priya S.
        },
        { 
          type: 'Styling', 
          brand: 'Eco Styler',
          name: 'Olive Oil Styling Gel', 
          benefit: 'Strong hold without crunch', 
          price: '$5',
          rating: 4.4,
          reviews: 12456,
          review: "Can't beat this price and performance combo!" - Jasmine H.
        },
        { 
          type: 'Treatment', 
          brand: 'Briogeo',
          name: "Don't Despair, Repair! Mask", 
          benefit: 'Deep conditioning treatment', 
          price: '$38',
          rating: 4.5,
          reviews: 3421,
          review: "My damaged curls are back to life!" - Sofia M.
        }
      ],
      '4a': [
        { 
          type: 'Shampoo', 
          brand: 'Carol\'s Daughter',
          name: 'Wash Day Delight Shampoo', 
          benefit: 'Gentle sulfate-free cleansing', 
          price: '$12',
          rating: 4.4,
          reviews: 3892,
          review: "My 4A hair feels clean but not stripped!" - Amara J.
        },
        { 
          type: 'Conditioner', 
          brand: 'TGIN',
          name: 'Triple Moisture Replenishing Conditioner', 
          benefit: 'Intense hydration for coils', 
          price: '$15',
          rating: 4.5,
          reviews: 2734,
          review: "Slip for days! Detangling is so easy now." - Kenya B.
        },
        { 
          type: 'Styling', 
          brand: 'Camille Rose',
          name: 'Curl Maker', 
          benefit: 'Defines coils without flaking', 
          price: '$16',
          rating: 4.3,
          reviews: 4521,
          review: "My twist-outs last a whole week!" - Zara N.
        },
        { 
          type: 'Treatment', 
          brand: 'Mielle Organics',
          name: 'Babassu Oil Mint Deep Conditioner', 
          benefit: 'Strengthens and moisturizes', 
          price: '$10',
          rating: 4.6,
          reviews: 6789,
          review: "The tingle feels so good and my hair is thriving!" - Nia T.
        }
      ]
    };
    
    // Default recommendations if specific type not found
    const defaultRecs = [
      { 
        type: 'Shampoo', 
        brand: 'Verb',
        name: 'Ghost Shampoo', 
        benefit: 'Gentle for all hair types', 
        price: '$20',
        rating: 4.3,
        reviews: 2341,
        review: "Works great on my hair without any buildup!" - Alex C.
      },
      { 
        type: 'Conditioner', 
        brand: 'Verb',
        name: 'Ghost Conditioner', 
        benefit: 'Lightweight universal hydration', 
        price: '$20',
        rating: 4.3,
        reviews: 2198,
        review: "Love how soft this makes my hair!" - Morgan D.
      },
      { 
        type: 'Styling', 
        brand: 'Kristin Ess',
        name: 'Style Assist Blow Dry Mist', 
        benefit: 'Heat protection + smoothing', 
        price: '$15',
        rating: 4.2,
        reviews: 1876,
        review: "Affordable and works great!" - Taylor S.
      },
      { 
        type: 'Treatment', 
        brand: 'K18',
        name: 'Leave-In Molecular Repair Hair Mask', 
        benefit: 'Repairs damage in 4 minutes', 
        price: '$75',
        rating: 4.4,
        reviews: 8923,
        review: "Pricey but it actually reversed my damage!" - Blair W.
      }
    ];
    
    return recommendations[hairType] || recommendations[hairType.substring(0, 2)] || defaultRecs;
  };

  const getSkinRecommendations = (skinType: string, concerns: string[]) => {
    const baseProducts: any = {
      dry: [
        { 
          type: 'Cleanser', 
          brand: 'CeraVe',
          name: 'Hydrating Cream-to-Foam Cleanser', 
          benefit: 'Removes makeup without stripping', 
          price: '$16',
          rating: 4.5,
          reviews: 8934,
          review: "My dry skin feels clean but never tight!" - Michelle K.
        },
        { 
          type: 'Moisturizer', 
          brand: 'First Aid Beauty',
          name: 'Ultra Repair Cream', 
          benefit: 'Intense hydration for 24 hours', 
          price: '$38',
          rating: 4.6,
          reviews: 12456,
          review: "Saved my winter skin! So rich but not greasy." - Amanda T.
        },
        { 
          type: 'Serum', 
          brand: 'The Ordinary',
          name: 'Hyaluronic Acid 2% + B5', 
          benefit: 'Plumps and hydrates deeply', 
          price: '$9',
          rating: 4.3,
          reviews: 23891,
          review: "Affordable and works! My skin drinks this up." - Lisa C.
        },
        { 
          type: 'SPF', 
          brand: 'EltaMD',
          name: 'UV Daily Broad-Spectrum SPF 40', 
          benefit: 'Moisturizing zinc oxide sunscreen', 
          price: '$36',
          rating: 4.7,
          reviews: 3421,
          review: "No white cast and actually hydrates!" - Diana R.
        }
      ],
      oily: [
        { 
          type: 'Cleanser', 
          brand: 'La Roche-Posay',
          name: 'Effaclar Purifying Foaming Gel', 
          benefit: 'Controls oil without over-drying', 
          price: '$16',
          rating: 4.4,
          reviews: 6789,
          review: "My oily skin has never been clearer!" - Kim J.
        },
        { 
          type: 'Moisturizer', 
          brand: 'Neutrogena',
          name: 'Hydro Boost Water Gel', 
          benefit: 'Oil-free hydration', 
          price: '$20',
          rating: 4.3,
          reviews: 15234,
          review: "Light as water but so hydrating!" - Stephanie L.
        },
        { 
          type: 'Serum', 
          brand: 'Paula\'s Choice',
          name: '10% Niacinamide Booster', 
          benefit: 'Minimizes pores and oil', 
          price: '$46',
          rating: 4.5,
          reviews: 4567,
          review: "My pores look invisible now!" - Jennifer M.
        },
        { 
          type: 'SPF', 
          brand: 'Supergoop!',
          name: 'Unseen Sunscreen SPF 40', 
          benefit: 'Invisible, oil-free protection', 
          price: '$38',
          rating: 4.4,
          reviews: 9876,
          review: "Like a primer but with SPF! No shine at all." - Ashley P.
        }
      ],
      combination: [
        { 
          type: 'Cleanser', 
          brand: 'Fresh',
          name: 'Soy Face Cleanser', 
          benefit: 'Balances all skin zones', 
          price: '$39',
          rating: 4.5,
          reviews: 3456,
          review: "Perfect for my combo skin - gentle but effective!" - Grace H.
        },
        { 
          type: 'Moisturizer', 
          brand: 'Clinique',
          name: 'Dramatically Different Moisturizing Gel', 
          benefit: 'Oil-free hydration for combo skin', 
          price: '$30',
          rating: 4.3,
          reviews: 8901,
          review: "Been using for years! Perfect balance." - Rebecca S.
        },
        { 
          type: 'Serum', 
          brand: 'Glow Recipe',
          name: 'Strawberry Smooth BHA + AHA Salicylic Serum', 
          benefit: 'Gentle exfoliation for smooth skin', 
          price: '$42',
          rating: 4.4,
          reviews: 2341,
          review: "Smells amazing and cleared my texture!" - Olivia N.
        },
        { 
          type: 'SPF', 
          brand: 'Biore',
          name: 'UV Aqua Rich Watery Essence SPF 50+', 
          benefit: 'Lightweight Japanese sunscreen', 
          price: '$15',
          rating: 4.6,
          reviews: 18923,
          review: "HG sunscreen! So light and no white cast." - Amy W.
        }
      ],
      normal: [
        { 
          type: 'Cleanser', 
          brand: 'Cetaphil',
          name: 'Daily Facial Cleanser', 
          benefit: 'Gentle everyday cleansing', 
          price: '$12',
          rating: 4.2,
          reviews: 10234,
          review: "Simple and effective - no irritation!" - Emily D.
        },
        { 
          type: 'Moisturizer', 
          brand: 'Kiehl\'s',
          name: 'Ultra Facial Cream', 
          benefit: '24-hour lightweight hydration', 
          price: '$35',
          rating: 4.5,
          reviews: 7654,
          review: "The perfect daily moisturizer!" - Hannah G.
        },
        { 
          type: 'Serum', 
          brand: 'Drunk Elephant',
          name: 'C-Firma Fresh Day Serum', 
          benefit: 'Vitamin C for bright, even skin', 
          price: '$80',
          rating: 4.3,
          reviews: 4321,
          review: "Expensive but my skin glows!" - Victoria L.
        },
        { 
          type: 'SPF', 
          brand: 'COSRX',
          name: 'Aloe Soothing Sun Cream SPF 50', 
          benefit: 'Hydrating Korean sunscreen', 
          price: '$14',
          rating: 4.4,
          reviews: 6543,
          review: "No pilling and feels moisturizing!" - Sophia C.
        }
      ],
      sensitive: [
        { 
          type: 'Cleanser', 
          brand: 'Vanicream',
          name: 'Gentle Facial Cleanser', 
          benefit: 'Free of common irritants', 
          price: '$9',
          rating: 4.6,
          reviews: 5432,
          review: "Finally a cleanser that doesn't burn!" - Rachel B.
        },
        { 
          type: 'Moisturizer', 
          brand: 'Avène',
          name: 'Tolerance Control Soothing Skin Recovery Cream', 
          benefit: 'Calms reactive skin', 
          price: '$42',
          rating: 4.5,
          reviews: 2198,
          review: "Stopped my redness in days!" - Isabella M.
        },
        { 
          type: 'Serum', 
          brand: 'Purito',
          name: 'Centella Unscented Serum', 
          benefit: 'Soothes and strengthens barrier', 
          price: '$17',
          rating: 4.4,
          reviews: 3876,
          review: "My sensitive skin loves this!" - Megan F.
        },
        { 
          type: 'SPF', 
          brand: 'Blue Lizard',
          name: 'Sensitive Mineral Sunscreen SPF 50+', 
          benefit: '100% mineral, fragrance-free', 
          price: '$15',
          rating: 4.3,
          reviews: 4321,
          review: "No irritation and great protection!" - Charlotte K.
        }
      ]
    };
    
    let products = [...(baseProducts[skinType] || baseProducts.normal)];
    
    // Add specific products for concerns with real brands
    if (concerns.includes('acne')) {
      products.push({ 
        type: 'Treatment', 
        brand: 'La Roche-Posay',
        name: 'Effaclar Duo Acne Treatment', 
        benefit: 'Benzoyl peroxide spot treatment', 
        price: '$38',
        rating: 4.4,
        reviews: 8765,
        review: "Clears pimples overnight!" - Jasmine Y.
      });
    }
    if (concerns.includes('aging')) {
      products.push({ 
        type: 'Treatment', 
        brand: 'Olay',
        name: 'Regenerist Retinol 24 Night Serum', 
        benefit: 'Gentle retinol for fine lines', 
        price: '$40',
        rating: 4.3,
        reviews: 5432,
        review: "Smoothed my lines without irritation!" - Patricia L.
      });
    }
    if (concerns.includes('dark-spots')) {
      products.push({ 
        type: 'Treatment', 
        brand: 'Murad',
        name: 'Rapid Dark Spot Correcting Serum', 
        benefit: 'Fades spots in 7 days', 
        price: '$83',
        rating: 4.2,
        reviews: 3210,
        review: "My melasma is finally fading!" - Carmen S.
      });
    }
    
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
                  {getHairRecommendations(hairType).map((product, index) => (
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
                        "{product.review}"
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
                  {getSkinRecommendations(skinType, skinConcerns).map((product, index) => (
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
                        "{product.review}"
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
