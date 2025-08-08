'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Home() {
  const [activeSection, setActiveSection] = useState('home');
  const [fearLevel, setFearLevel] = useState(0);
  const [sanity, setSanity] = useState(100);
  const [showEntity, setShowEntity] = useState(false);
  const [glitchEffect, setGlitchEffect] = useState(false);

  // Simulate fear detection
  useEffect(() => {
    const interval = setInterval(() => {
      if (activeSection === 'demo') {
        setFearLevel(prev => Math.min(prev + Math.random() * 5, 100));
        setSanity(prev => Math.max(prev - Math.random() * 2, 0));
        
        // Random entity appearances
        if (Math.random() < 0.02 && !showEntity) {
          setShowEntity(true);
          setTimeout(() => setShowEntity(false), 200);
        }

        // Glitch effect at high fear
        if (fearLevel > 70 && Math.random() < 0.1) {
          setGlitchEffect(true);
          setTimeout(() => setGlitchEffect(false), 100);
        }
      }
    }, 500);

    return () => clearInterval(interval);
  }, [activeSection, fearLevel, showEntity]);

  const sections = [
    { id: 'home', label: 'Home', icon: '🏚️' },
    { id: 'features', label: 'Features', icon: '👁️' },
    { id: 'rooms', label: 'Escape Rooms', icon: '🔓' },
    { id: 'demo', label: 'Live Demo', icon: '🎮' },
  ];

  return (
    <div className={`min-h-screen bg-black text-white transition-all duration-300 ${glitchEffect ? 'glitch' : ''}`}>
      {/* Atmospheric overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-red-900/10 to-black/50 pointer-events-none" />
      
      {/* Entity flash */}
      {showEntity && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <div className="absolute inset-0 bg-red-900/20 animate-pulse" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-9xl opacity-10">
            👤
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-black/90 backdrop-blur-sm border-b border-red-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-red-500 glitch-text">THE DWELLING</h1>
            <div className="flex space-x-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    activeSection === section.id
                      ? 'bg-red-900 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-red-900/30'
                  }`}
                >
                  <span className="mr-2">{section.icon}</span>
                  <span className="hidden sm:inline">{section.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {activeSection === 'home' && (
          <div className="space-y-12">
            <div className="text-center">
              <h2 className="text-6xl font-bold mb-4 animate-pulse text-red-500">
                YOUR MIND IS THE ENEMY
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                A 4-player psychological horror escape room where an AI entity learns your deepest fears 
                through microphone analysis, movement tracking, and behavioral patterns.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="bg-gray-900 p-6 rounded-lg border border-red-900/30 hover:border-red-500 transition-all">
                <div className="text-4xl mb-4">🎤</div>
                <h3 className="text-xl font-bold mb-2">Fear Detection</h3>
                <p className="text-gray-400">
                  The game listens to your breathing, screams, and panic through your microphone
                </p>
              </div>
              <div className="bg-gray-900 p-6 rounded-lg border border-red-900/30 hover:border-red-500 transition-all">
                <div className="text-4xl mb-4">🧠</div>
                <h3 className="text-xl font-bold mb-2">Adaptive AI</h3>
                <p className="text-gray-400">
                  The Entity learns what scares you and creates personalized nightmares
                </p>
              </div>
              <div className="bg-gray-900 p-6 rounded-lg border border-red-900/30 hover:border-red-500 transition-all">
                <div className="text-4xl mb-4">🚪</div>
                <h3 className="text-xl font-bold mb-2">Escape Rooms</h3>
                <p className="text-gray-400">
                  Solve mind-bending puzzles while your sanity crumbles around you
                </p>
              </div>
            </div>

            <div className="bg-red-900/20 p-8 rounded-lg border border-red-900/50">
              <h3 className="text-2xl font-bold mb-4">⚠️ WARNING</h3>
              <p className="text-lg">
                This game uses real-time fear analysis. Your microphone will detect breathing patterns, 
                stress levels, and screams. The Entity will use this data to create your personal hell.
              </p>
            </div>
          </div>
        )}

        {activeSection === 'features' && (
          <div className="space-y-12">
            <h2 className="text-4xl font-bold text-center mb-12">Revolutionary Horror Features</h2>
            
            <div className="space-y-8">
              <div className="bg-gray-900 p-8 rounded-lg border-l-4 border-red-500">
                <h3 className="text-2xl font-bold mb-4">🎭 The Entity</h3>
                <p className="text-gray-300 mb-4">
                  An AI-driven antagonist that starts as a shadow in the corner, learning your fears. 
                  It evolves through multiple forms:
                </p>
                <ul className="list-disc list-inside text-gray-400 space-y-2">
                  <li>Shadow Form - Observes from darkness</li>
                  <li>Mimic Form - Impersonates your teammates</li>
                  <li>Nightmare Form - Manifests your specific fears</li>
                  <li>True Form - Incomprehensible geometry that breaks sanity</li>
                </ul>
              </div>

              <div className="bg-gray-900 p-8 rounded-lg border-l-4 border-red-500">
                <h3 className="text-2xl font-bold mb-4">🧩 Trust-Based Puzzles</h3>
                <p className="text-gray-300 mb-4">
                  Each player sees different versions of reality. Communication is key, but can you trust 
                  what others tell you?
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-black/50 p-4 rounded">
                    <h4 className="font-bold text-red-400">Information Asymmetry</h4>
                    <p className="text-sm text-gray-400">Players see different clues and solutions</p>
                  </div>
                  <div className="bg-black/50 p-4 rounded">
                    <h4 className="font-bold text-red-400">Sanity Effects</h4>
                    <p className="text-sm text-gray-400">Low sanity changes puzzle appearances</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900 p-8 rounded-lg border-l-4 border-red-500">
                <h3 className="text-2xl font-bold mb-4">💀 Permadeath Stakes</h3>
                <p className="text-gray-300">
                  One life. One chance. Death means watching your teammates struggle from the shadows 
                  as The Entity uses your voice to deceive them.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'rooms' && (
          <div className="space-y-12">
            <h2 className="text-4xl font-bold text-center mb-12">Escape Rooms</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-900 p-6 rounded-lg border border-red-900/30">
                <h3 className="text-2xl font-bold mb-4">🪞 The Mirror Room</h3>
                <p className="text-gray-300 mb-4">
                  Seven mirrors, but only one shows the truth. The others reveal your deaths, 
                  your fears, or worse - nothing at all.
                </p>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Reflections move independently</li>
                  <li>• Dead teammates appear in false mirrors</li>
                  <li>• Shattered mirrors damage sanity</li>
                  <li>• Final solution requires sacrifice</li>
                </ul>
              </div>

              <div className="bg-gray-900 p-6 rounded-lg border border-red-900/30">
                <h3 className="text-2xl font-bold mb-4">🧸 The Childhood Room</h3>
                <p className="text-gray-300 mb-4">
                  The room transforms into each player's childhood bedroom. Share your traumas 
                  or remain trapped forever.
                </p>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Toys animate based on fears</li>
                  <li>• Room shrinks as sanity drops</li>
                  <li>• Must confess real memories</li>
                  <li>• Child voices mimic players</li>
                </ul>
              </div>

              <div className="bg-gray-900 p-6 rounded-lg border border-red-900/30">
                <h3 className="text-2xl font-bold mb-4">🏥 The Surgery Theater</h3>
                <p className="text-gray-300 mb-4">
                  One player becomes the patient while others perform the "procedure". 
                  But what you see isn't what's real.
                </p>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Patient sees different horror</li>
                  <li>• Tools change based on wielder</li>
                  <li>• The Entity poses as doctor</li>
                  <li>• Trust exercises under pressure</li>
                </ul>
              </div>

              <div className="bg-gray-900 p-6 rounded-lg border border-red-900/30">
                <h3 className="text-2xl font-bold mb-4">🎭 The Final Door</h3>
                <p className="text-gray-300 mb-4">
                  Everything you've feared, all at once. Navigate your personalized nightmare 
                  gauntlet where one must stay behind.
                </p>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• All fears manifest together</li>
                  <li>• Dimensions collapse</li>
                  <li>• Entity reveals true form</li>
                  <li>• Ultimate sacrifice required</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'demo' && (
          <div className="space-y-8">
            <h2 className="text-4xl font-bold text-center mb-8">Interactive Demo</h2>
            
            {/* Status Bars */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-900 p-6 rounded-lg border border-red-900/30">
                <h3 className="text-xl font-bold mb-4">😱 Fear Level</h3>
                <div className="w-full bg-gray-800 rounded-full h-6 relative overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-yellow-500 to-red-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${fearLevel}%` }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">
                    {fearLevel.toFixed(0)}%
                  </span>
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  Detected through microphone analysis
                </p>
              </div>

              <div className="bg-gray-900 p-6 rounded-lg border border-red-900/30">
                <h3 className="text-xl font-bold mb-4">🧠 Sanity</h3>
                <div className="w-full bg-gray-800 rounded-full h-6 relative overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${sanity}%` }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">
                    {sanity.toFixed(0)}%
                  </span>
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  Decreases with fear and Entity encounters
                </p>
              </div>
            </div>

            {/* Demo Room */}
            <div className="bg-gray-900 p-8 rounded-lg border border-red-900/30 relative overflow-hidden">
              <h3 className="text-2xl font-bold mb-6">🪞 Mirror Room Demo</h3>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[1, 2, 3, 4, 5, 6, 7].map((mirror) => (
                  <button
                    key={mirror}
                    className={`aspect-square bg-gray-800 rounded-lg border-2 border-gray-700 hover:border-red-500 transition-all relative overflow-hidden ${
                      mirror === 4 ? 'col-start-2' : ''
                    }`}
                    onClick={() => {
                      if (mirror === 3) {
                        alert('You found the true mirror! But something is watching from behind it...');
                        setFearLevel(prev => Math.min(prev + 20, 100));
                      } else {
                        alert('Your reflection smiles while you frown. This is not the true mirror.');
                        setSanity(prev => Math.max(prev - 10, 0));
                      }
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900" />
                    <div className="absolute inset-0 flex items-center justify-center text-4xl opacity-20">
                      🪞
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs text-gray-500">Mirror {mirror}</span>
                    </div>
                  </button>
                ))}
              </div>

              <p className="text-center text-gray-400">
                Click mirrors to find the truth. Wrong choices drain sanity.
              </p>

              {/* Entity appearance */}
              {fearLevel > 50 && (
                <div className="absolute top-4 right-4 text-6xl opacity-20 animate-pulse">
                  👁️
                </div>
              )}
            </div>

            {/* Game Info */}
            <div className="bg-red-900/20 p-6 rounded-lg border border-red-900/50">
              <h3 className="text-xl font-bold mb-3">🎮 Full Game Features</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Real microphone fear detection</li>
                <li>• 4-player online co-op</li>
                <li>• 5+ unique escape rooms</li>
                <li>• Adaptive AI that learns your fears</li>
                <li>• Photorealistic graphics in Unreal Engine 5</li>
                <li>• Spatial 3D audio for maximum immersion</li>
              </ul>
            </div>

            <div className="text-center">
              <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition-all transform hover:scale-105">
                Download Full Game (Coming Soon)
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-24 border-t border-red-900/30 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500">
          <p>THE DWELLING © 2024 | A Psychological Horror Experience</p>
          <p className="mt-2 text-sm">Your worst nightmares are about to become reality</p>
        </div>
      </footer>

      <style jsx>{`
        .glitch {
          animation: glitch 0.1s infinite;
        }
        
        @keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-1px, 1px); }
          40% { transform: translate(-1px, -1px); }
          60% { transform: translate(1px, 1px); }
          80% { transform: translate(1px, -1px); }
          100% { transform: translate(0); }
        }
        
        .glitch-text {
          text-shadow: 0.05em 0 0 rgba(255, 0, 0, 0.75),
                      -0.025em -0.05em 0 rgba(0, 255, 0, 0.75),
                      0.025em 0.05em 0 rgba(0, 0, 255, 0.75);
          animation: glitch-text 0.5s infinite;
        }
        
        @keyframes glitch-text {
          0% { text-shadow: 0.05em 0 0 rgba(255, 0, 0, 0.75),
                           -0.025em -0.05em 0 rgba(0, 255, 0, 0.75),
                           0.025em 0.05em 0 rgba(0, 0, 255, 0.75); }
          15% { text-shadow: 0.05em 0 0 rgba(255, 0, 0, 0.75),
                            -0.025em -0.05em 0 rgba(0, 255, 0, 0.75),
                            0.025em 0.05em 0 rgba(0, 0, 255, 0.75); }
          16% { text-shadow: -0.05em -0.025em 0 rgba(255, 0, 0, 0.75),
                            0.025em 0.025em 0 rgba(0, 255, 0, 0.75),
                            -0.05em -0.05em 0 rgba(0, 0, 255, 0.75); }
          49% { text-shadow: -0.05em -0.025em 0 rgba(255, 0, 0, 0.75),
                            0.025em 0.025em 0 rgba(0, 255, 0, 0.75),
                            -0.05em -0.05em 0 rgba(0, 0, 255, 0.75); }
          50% { text-shadow: 0.025em 0.05em 0 rgba(255, 0, 0, 0.75),
                            0.025em 0em 0 rgba(0, 255, 0, 0.75),
                            0em -0.05em 0 rgba(0, 0, 255, 0.75); }
          99% { text-shadow: 0.025em 0.05em 0 rgba(255, 0, 0, 0.75),
                            0.025em 0em 0 rgba(0, 255, 0, 0.75),
                            0em -0.05em 0 rgba(0, 0, 255, 0.75); }
          100% { text-shadow: -0.025em 0 0 rgba(255, 0, 0, 0.75),
                             -0.025em -0.025em 0 rgba(0, 255, 0, 0.75),
                             -0.025em -0.05em 0 rgba(0, 0, 255, 0.75); }
        }
      `}</style>
    </div>
  );
}