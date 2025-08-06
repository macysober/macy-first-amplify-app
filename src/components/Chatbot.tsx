'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Hi! I\'m your Beauty AI assistant. Ask me anything about skincare, haircare, or makeup! 💄',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const beautyResponses: { [key: string]: string } = {
    // Greetings
    'hello': 'Hello beautiful! I\'m your beauty expert. I can help with product recommendations, ingredient analysis, brand comparisons, and personalized routines! What would you like to know? 🌟',
    'hi': 'Hi there! I\'m here to help with beauty questions. Ask me about specific brands, ingredients, or let me recommend products for your concerns! ✨',
    'hey': 'Hey! Ready to dive into beauty? I know about brands from drugstore to luxury, ingredients from AHA to Zinc, and can suggest specific products! 💖',
    
    // Hair - Detailed with brands
    'oily hair': 'For oily hair, here are my top picks:\n\n🧴 **Shampoos:**\n• Neutrogena Anti-Residue ($8) - Weekly clarifying\n• L\'Oreal Elvive Clay ($6) - Daily use\n• Bumble & Bumble Sunday ($34) - Deep cleanse\n\n💨 **Dry Shampoos:**\n• Batiste Original ($9)\n• Living Proof Perfect Hair Day ($28)\n• Drybar Detox ($28)\n\nTip: Wash every 2-3 days and avoid heavy conditioners on roots!',
    
    'dry hair': 'For dry hair, try these hydrating heroes:\n\n💧 **Shampoos:**\n• Olaplex No.4 ($30) - Bond repair\n• Redken All Soft ($22) - Argan oil\n• Moroccanoil Moisture Repair ($26)\n\n🥥 **Deep Treatments:**\n• Briogeo Don\'t Despair Repair ($38)\n• SheaMoisture Manuka Honey ($13)\n• K18 Leave-In Mask ($75) - Professional grade\n\n✨ **Hair Oils:**\n• Olaplex No.7 ($30)\n• Moroccanoil Treatment ($48)',
    
    'frizzy hair': 'Frizz fighters that actually work:\n\n🌀 **Anti-Frizz Products:**\n• John Frieda Frizz Ease Serum ($10) - Budget-friendly\n• Living Proof No Frizz ($32) - Humidity shield\n• Oribe Impermeable Spray ($42) - Luxury option\n\n🧴 **Smoothing Shampoos:**\n• Redken Frizz Dismiss ($23)\n• Kerastase Discipline ($40)\n• Matrix Total Results Mega Sleek ($18)\n\nPro tip: Use microfiber towel & silk pillowcase!',
    
    'hair growth': 'For hair growth, combine these:\n\n🌱 **Growth Serums:**\n• The Ordinary Multi-Peptide Serum ($20)\n• Vegamour GRO Hair Serum ($64)\n• Minoxidil 5% (Rogaine) ($45)\n\n💊 **Supplements:**\n• Viviscal ($50/month)\n• Nutrafol ($88/month)\n• Biotin 10,000mcg ($15)\n\n🧴 **Scalp Care:**\n• Mielle Rosemary Mint Oil ($10)\n• OUAI Scalp Serum ($32)\n• Kerastase Genesis Serum ($54)',
    
    // Skin - Comprehensive with options
    'acne': 'Acne-fighting routine with options:\n\n🧼 **Cleansers:**\n• CeraVe Foaming Cleanser ($15) - Gentle\n• La Roche-Posay Effaclar ($16) - 2% Salicylic\n• PanOxyl 10% BP Wash ($10) - Strong\n\n💊 **Treatments:**\n• The Ordinary Niacinamide 10% ($7)\n• Paula\'s Choice 2% BHA ($35)\n• Differin Gel ($15) - OTC retinoid\n\n🎯 **Spot Treatments:**\n• Hero Mighty Patch ($13)\n• Mario Badescu Drying Lotion ($17)\n• Kate Somerville EradiKate ($28)',
    
    'dark circles': 'Dark circle solutions by budget:\n\n💰 **Budget ($10-25):**\n• CeraVe Eye Repair Cream ($14)\n• The Ordinary Caffeine Solution ($7)\n• L\'Oreal Revitalift Eye ($13)\n\n💎 **Mid-Range ($30-60):**\n• Ole Henriksen Banana Bright ($42)\n• Kiehl\'s Avocado Eye Cream ($35)\n• First Aid Beauty Eye Duty ($36)\n\n👑 **Luxury ($70+):**\n• SK-II Eye Cream ($135)\n• La Mer Eye Concentrate ($245)\n• Dr. Dennis Gross C+ Collagen ($72)',
    
    'anti aging': 'Anti-aging must-haves:\n\n🌟 **Retinols:**\n• The Ordinary Retinol 0.5% ($8) - Beginner\n• CeraVe Resurfacing Retinol ($20)\n• Tretinoin 0.025% (Rx) - Gold standard\n\n⚡ **Vitamin C:**\n• Timeless 20% Vitamin C ($26)\n• Skinceuticals CE Ferulic ($169) - Best\n• Mad Hippie Vitamin C ($34)\n\n🧬 **Peptides:**\n• The Ordinary Matrixyl ($12)\n• Drunk Elephant Protini ($69)\n• Peter Thomas Roth Peptide 21 ($135)',
    
    // Ingredients Deep Dive
    'retinol': 'Complete Retinol Guide:\n\n📊 **Strengths & Brands:**\n• 0.25% - Beginners (CeraVe $20)\n• 0.5% - Intermediate (The Ordinary $8)\n• 1% - Advanced (Paula\'s Choice $58)\n\n🌙 **How to Use:**\n1. Start 2x/week at night\n2. Apply pea-sized amount\n3. Buffer with moisturizer if sensitive\n4. Always use SPF next day\n\n⚠️ **Side Effects:**\nWeek 1-2: Dryness\nWeek 3-4: Purging possible\nWeek 6+: Glowing skin!\n\n✅ **Best Pairs With:** Niacinamide, Hyaluronic Acid\n❌ **Avoid With:** Vitamin C, AHA/BHA (same routine)',
    
    'vitamin c': 'Vitamin C Breakdown:\n\n🍊 **Types & Products:**\n• L-Ascorbic Acid (strongest)\n  - Skinceuticals CE Ferulic ($169)\n  - Timeless 20% ($26)\n• Sodium Ascorbyl Phosphate (gentle)\n  - Mad Hippie ($34)\n  - The Ordinary ($12)\n• Magnesium Ascorbyl Phosphate\n  - The Ordinary 10% ($13)\n\n☀️ **Best Practice:**\nAM use → Under SPF → Antioxidant protection\n\n💡 **Pro Tips:**\n- Store in fridge\n- If it turns yellow/orange, it\'s oxidized\n- Start with 10% if sensitive',
    
    'niacinamide': 'Niacinamide (B3) Benefits:\n\n✨ **What it does:**\n• Minimizes pores\n• Controls oil\n• Reduces redness\n• Brightens dark spots\n\n🛍️ **Top Products:**\n• The Ordinary 10% + Zinc ($7)\n• Paula\'s Choice 10% Booster ($46)\n• Good Molecules Discoloration Serum ($12)\n• Naturium 12% + Zinc ($16)\n\n🤝 **Plays well with:**\nAlmost everything! Retinol, HA, peptides\n\n⚡ **Concentration guide:**\n2-5%: Sensitive skin\n10%: Most people\n12%+: Oily/resilient skin',
    
    'hyaluronic acid': 'Hyaluronic Acid Guide:\n\n💧 **How it works:**\nHolds 1000x its weight in water!\n\n🏆 **Best Products:**\n• The Ordinary HA 2% ($9)\n• Neutrogena Hydro Boost Serum ($20)\n• Peter Thomas Roth Water Drench ($65)\n• Skinceuticals HA Intensifier ($110)\n\n📝 **Application Tips:**\n1. Apply to DAMP skin\n2. Seal with moisturizer\n3. Works in all climates\n4. Use AM & PM\n\n🎯 **Best for:**\nAll skin types, especially dehydrated!',
    
    'salicylic acid': 'Salicylic Acid (BHA) Guide:\n\n🎯 **What it does:**\n• Unclogs pores (oil-soluble)\n• Exfoliates inside pores\n• Reduces blackheads\n\n💊 **Products by strength:**\n• 0.5%: CeraVe SA Cleanser ($12)\n• 2%: Paula\'s Choice BHA Liquid ($35)\n• 2%: The Ordinary Solution ($8)\n• Stridex Pads ($5) - Budget\n\n⚠️ **Usage:**\n- Start 2-3x/week\n- Can cause dryness\n- Don\'t use with retinol same night\n- Always follow with SPF',
    
    // Brand comparisons
    'ordinary': 'The Ordinary Breakdown:\n\n🏆 **Best Sellers:**\n• Niacinamide 10% + Zinc ($7)\n• Hyaluronic Acid 2% ($9)\n• Retinol 0.5% in Squalane ($8)\n• AHA 30% + BHA 2% Peel ($8)\n\n💡 **Routine Example:**\nAM: HA → Niacinamide → Moisturizer → SPF\nPM: Cleanser → Retinol → Moisturizer\n\n✅ **Pros:** Affordable, effective, transparent\n❌ **Cons:** Confusing names, basic packaging\n\n🎯 **Best for:** Ingredient-focused skincare on budget',
    
    'cerave': 'CeraVe Essentials:\n\n🏆 **Holy Grails:**\n• Hydrating Cleanser ($15) - Dry skin\n• Foaming Cleanser ($15) - Oily skin\n• Daily Moisturizing Lotion ($14)\n• PM Facial Lotion ($16) - Has niacinamide\n• Healing Ointment ($10) - Slugging\n\n🧬 **Key Tech:** MVE Technology + Ceramides\n\n💰 **Why derms love it:**\n- Ceramides repair barrier\n- Non-irritating\n- Drugstore price\n- Developed with dermatologists',
    
    'olaplex': 'Olaplex System Explained:\n\n🔢 **The Numbers:**\n• No.0 ($30) - Intensive bond building\n• No.3 ($30) - At-home treatment\n• No.4 ($30) - Bond maintenance shampoo\n• No.5 ($30) - Conditioner\n• No.6 ($30) - Leave-in smoother\n• No.7 ($30) - Bonding oil\n• No.8 ($30) - Moisture mask\n• No.9 ($30) - Serum\n\n💡 **Must-haves:** No.3 + No.6 + No.7\n\n✅ **Best for:** Damaged, colored, or chemically treated hair\n\n⏰ **How often:** No.3 weekly, others as needed',
    
    // Specific concerns with full routines
    'routine acne': 'Complete Acne Routine:\n\n☀️ **Morning:**\n1. CeraVe Foaming Cleanser ($15)\n2. The Ordinary Niacinamide ($7)\n3. CeraVe AM Moisturizer SPF 30 ($14)\n\n🌙 **Evening:**\n1. Micellar Water (remove makeup)\n2. La Roche-Posay Effaclar Cleanser ($16)\n3. Paula\'s Choice 2% BHA ($35) - 3x/week\n4. Differin Gel ($15) - Other nights\n5. CeraVe PM Lotion ($16)\n\n🎯 **Weekly:** Clay mask (Aztec Clay $8)\n\n💊 **Spot treat:** Hero patches or Benzoyl peroxide',
    
    'routine dry skin': 'Dry Skin Routine:\n\n☀️ **Morning:**\n1. CeraVe Hydrating Cleanser ($15)\n2. Hyaluronic Acid serum ($9)\n3. First Aid Beauty Ultra Repair ($38)\n4. La Roche-Posay Anthelios SPF ($33)\n\n🌙 **Evening:**\n1. Clinique Balm cleanser ($36)\n2. CeraVe Hydrating Cleanser\n3. The Ordinary Squalane ($9)\n4. CeraVe Healing Ointment ($10) - Slugging\n\n💧 **2x Week:**\n• Lactic Acid 5% ($8) - Gentle exfoliation\n• Overnight mask',
    
    // Budget options
    'drugstore': 'Best Drugstore Beauty:\n\n🧴 **Skincare Winners:**\n• CeraVe (all products)\n• Cetaphil cleansers\n• L\'Oreal Revitalift line\n• Neutrogena Hydro Boost\n• The Ordinary (Ulta/Sephora)\n\n💄 **Makeup Stars:**\n• Maybelline Fit Me foundation\n• L\'Oreal Telescopic mascara\n• NYX Butter Gloss\n• e.l.f. Camo Concealer\n• Milani Baked Blush\n\n💇 **Hair Heroes:**\n• OGX shampoos\n• L\'Oreal Elvive\n• Aussie 3 Minute Miracle',
    
    // Luxury alternatives
    'luxury': 'Luxury Worth The Splurge:\n\n✨ **Skincare:**\n• SK-II Essence ($99+) - Fermented magic\n• La Mer Cream ($190+) - Iconic\n• Skinceuticals CE Ferulic ($169) - Best Vit C\n• Dr. Barbara Sturm Hyaluronic ($300)\n\n💄 **Makeup:**\n• Giorgio Armani Luminous Silk ($69)\n• Charlotte Tilbury Flawless Filter ($49)\n• Tom Ford Lipsticks ($59)\n• Hourglass Ambient Lighting ($52)\n\n💇 **Hair:**\n• Oribe Gold Lust line\n• Kerastase treatments',
    
    // Quick fixes
    'pimple overnight': 'Emergency pimple treatment:\n\n🚨 **Tonight\'s Plan:**\n1. Ice it - 5 mins to reduce swelling\n2. Benzoyl peroxide 2.5% or 5%\n3. Hero Mighty Patch on top\n4. Don\'t pick!\n\n🌅 **Morning:**\n1. Remove patch\n2. Apply salicylic acid\n3. Concealer with green tint\n4. Set with powder\n\n💊 **Products:**\n• Mario Badescu Drying Lotion ($17)\n• Kate Somerville EradiKate ($28)\n• Clean & Clear Persa-Gel ($7)',
    
    'help': 'I\'m your beauty expert! I can help with:\n\n🛍️ **Products:** Specific recommendations by concern & budget\n🧬 **Ingredients:** What they do, how to use, combinations\n🏷️ **Brands:** Comparisons, dupes, worth the splurge?\n📋 **Routines:** Complete AM/PM for your skin type\n💄 **Makeup:** Application tips, shade matching\n💇 **Hair:** Type-specific care & styling\n\nJust ask about any brand, ingredient, or concern! 💕'
  };

  const getResponse = (input: string): string => {
    const lowercaseInput = input.toLowerCase();
    
    // Check for exact or partial matches
    for (const [key, response] of Object.entries(beautyResponses)) {
      if (lowercaseInput.includes(key)) {
        return response;
      }
    }
    
    // Additional keyword matches
    if (lowercaseInput.includes('peptide')) {
      return 'Peptides are amino acid chains that signal collagen production!\n\n🏆 **Best Peptide Products:**\n• The Ordinary Matrixyl 10% ($12)\n• The Ordinary Argireline 10% ($9)\n• Drunk Elephant Protini ($69)\n• The Inkey List Peptide Moisturizer ($15)\n\n✨ **Benefits:**\n- Firms skin\n- Reduces fine lines\n- Improves elasticity\n\n🤝 **Works well with:** Niacinamide, HA, Vitamin C';
    }
    
    if (lowercaseInput.includes('sunscreen') || lowercaseInput.includes('spf')) {
      return 'SPF is non-negotiable! Here are the best:\n\n☀️ **Chemical (lightweight):**\n• Supergoop Unseen ($38)\n• La Roche-Posay Anthelios ($33)\n• Black Girl Sunscreen ($16)\n\n🛡️ **Mineral (sensitive skin):**\n• EltaMD UV Clear ($41)\n• CeraVe Hydrating Mineral ($19)\n• Australian Gold Tinted ($15)\n\n💡 **Tips:**\n- Use 1/4 teaspoon for face\n- Reapply every 2 hours\n- Don\'t forget neck & hands!';
    }
    
    if (lowercaseInput.includes('dupe')) {
      return 'Love a good dupe! Here are top swaps:\n\n💄 **Makeup Dupes:**\n• Charlotte Tilbury Flawless Filter → e.l.f. Halo Glow\n• Dior Lip Glow → Essence Shine Shine Shine\n• Urban Decay Naked → Makeup Revolution Reloaded\n\n🧴 **Skincare Dupes:**\n• Skinceuticals CE Ferulic → Timeless Vitamin C\n• Drunk Elephant Protini → CeraVe Skin Renewing Night\n• Tatcha Dewy Cream → Belief Aqua Bomb\n\nAsk about specific products for more dupes!';
    }
    
    if (lowercaseInput.includes('korean') || lowercaseInput.includes('k-beauty')) {
      return 'K-Beauty favorites:\n\n🇰🇷 **Must-Try Brands:**\n• COSRX - Snail mucin, pimple patches\n• Beauty of Joseon - Glow serum, rice mask\n• Innisfree - Green tea line\n• Laneige - Lip mask, water bank\n\n✨ **K-Beauty Steps:**\n1. Oil cleanser\n2. Water cleanser\n3. Toner\n4. Essence\n5. Serum\n6. Sheet mask\n7. Moisturizer\n8. SPF/Sleeping mask';
    }
    
    if (lowercaseInput.includes('routine')) {
      return 'I can build you a complete routine! Just tell me:\n\n1. Your skin type (dry/oily/combo/normal)\n2. Main concerns (acne/aging/dark spots)\n3. Budget range\n\nOr ask for "routine acne" or "routine dry skin" for instant recommendations! 📋';
    }
    
    if (lowercaseInput.includes('ingredient') && lowercaseInput.includes('mix')) {
      return '⚠️ **Don\'t Mix:**\n• Retinol + Vitamin C (use different times)\n• Retinol + AHA/BHA (too irritating)\n• Vitamin C + Niacinamide (some formulas)\n• Benzoyl Peroxide + Retinol\n\n✅ **Great Combos:**\n• Niacinamide + everything!\n• HA + any active\n• Peptides + Vitamin C\n• Retinol + Niacinamide (buffer irritation)';
    }
    
    // Default responses for common patterns
    if (lowercaseInput.includes('recommend') || lowercaseInput.includes('suggestion') || lowercaseInput.includes('best')) {
      return 'I\'d love to recommend products! Tell me:\n- Your specific concern (acne, dryness, aging, etc.)\n- Your budget range\n- Any brands you like/dislike\n\nOr try asking about specific products like "best vitamin c serum" or "drugstore moisturizer"! 🛍️';
    }
    
    if (lowercaseInput.includes('how') || lowercaseInput.includes('what')) {
      return 'I can explain:\n- How ingredients work (try "how does retinol work")\n- What products to use (try "what serum for dark spots")\n- Application techniques\n- Ingredient benefits\n\nBe specific and I\'ll give you detailed info! 🤔';
    }
    
    // Random default responses
    const defaultResponses = [
      'I\'m your beauty encyclopedia! Try asking about:\n• Specific brands (The Ordinary, CeraVe, Olaplex)\n• Ingredients (retinol, niacinamide, vitamin C)\n• Concerns (acne, dry hair, dark circles)\n• Routines for your skin/hair type! 💭',
      'Let\'s get specific! I can help with:\n• Product recommendations with prices\n• Complete routines\n• Ingredient breakdowns\n• Brand comparisons\n• Dupes for expensive products\nWhat interests you? ✨',
      'I know about 1000+ beauty products! Ask me about:\n• Morning/night routines\n• Best products under $20\n• How to layer skincare\n• Hair type specific care\n• Makeup tips & tricks! 💕'
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate bot typing and response
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        text: getResponse(inputText),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-40"
        aria-label="Open chat"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-8 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col z-40">
          {/* Header */}
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4 rounded-t-2xl">
            <h3 className="font-semibold text-lg">Beauty AI Assistant</h3>
            <p className="text-sm opacity-90">Ask me anything about beauty!</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-2xl">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about skincare, hair, makeup..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button
                onClick={handleSend}
                disabled={!inputText.trim()}
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-2 rounded-full hover:shadow-md transition-all disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}