'use client';

import { useState } from 'react';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  results: any;
  quizType: 'haircare' | 'skincare' | 'makeup';
}

export default function EmailModal({ isOpen, onClose, results, quizType }: EmailModalProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

  if (!isOpen) return null;

  const formatResults = () => {
    const { profile, products } = results;
    
    let emailContent = `
Beauty Match AI - ${quizType.charAt(0).toUpperCase() + quizType.slice(1)} Results

Dear ${name || 'Beauty Lover'},

Here are your personalized ${quizType} recommendations:

YOUR PROFILE:
${Object.entries(profile).map(([key, value]) => `• ${key}: ${value}`).join('\n')}

RECOMMENDED PRODUCTS:
${products.map((product: any, index: number) => `
${index + 1}. ${product.type.toUpperCase()}
   Brand: ${product.brand}
   Product: ${product.name}
   Price: ${product.price}
   Rating: ${product.rating}/5 (${product.reviews.toLocaleString()} reviews)
   Benefit: ${product.benefit}
   Review: "${product.review}"
`).join('\n')}

NEXT STEPS:
1. Start with the essentials - cleanser and moisturizer
2. Introduce treatment products gradually
3. Always patch test new products
4. Be consistent with your routine
5. Take progress photos to track improvements

Want to explore more? Visit Beauty Match AI anytime for updated recommendations!

With love,
Beauty Match AI Team ✨

---
This email was sent from Beauty Match AI
© 2024 Beauty Match AI. All rights reserved.
`;

    return emailContent;
  };

  const handleSend = () => {
    setIsSending(true);
    
    // Create email content
    const emailBody = encodeURIComponent(formatResults());
    const subject = encodeURIComponent(`Your Beauty Match AI ${quizType.charAt(0).toUpperCase() + quizType.slice(1)} Results`);
    
    // Create mailto link
    const mailtoLink = `mailto:${email}?subject=${subject}&body=${emailBody}`;
    
    // Open email client
    window.location.href = mailtoLink;
    
    // Simulate sending
    setTimeout(() => {
      setIsSending(false);
      setSent(true);
      setTimeout(() => {
        onClose();
        setSent(false);
        setEmail('');
        setName('');
      }, 2000);
    }, 1000);
  };

  const downloadResults = () => {
    const content = formatResults();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `beauty-match-ai-${quizType}-results.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        {!sent ? (
          <>
            <h2 className="text-2xl font-bold mb-4 text-center bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Save Your Results
            </h2>
            
            <p className="text-gray-600 mb-6 text-center">
              Get your personalized {quizType} recommendations sent to your email!
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSend}
                disabled={!email || isSending}
                className={`flex-1 py-2 rounded-full font-semibold transition-all ${
                  email && !isSending
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:shadow-lg'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isSending ? 'Opening Email...' : 'Email Results'}
              </button>
              
              <button
                onClick={downloadResults}
                className="flex-1 py-2 rounded-full border-2 border-purple-500 text-purple-600 font-semibold hover:bg-purple-50 transition-all"
              >
                Download
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-full mt-3 py-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              Cancel
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              We'll open your email client with your results. No data is stored on our servers.
            </p>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-xl font-semibold mb-2">Check Your Email Client!</h3>
            <p className="text-gray-600">Your results are ready to send.</p>
          </div>
        )}
      </div>
    </div>
  );
}