'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

const translations = {
  en: {
    // Header
    'header.title': 'Beauty Match AI',
    'header.subtitle': 'Your AI Beauty Advisor',
    
    // Navigation
    'nav.home': 'Home',
    'nav.haircare': 'Hair Care',
    'nav.skincare': 'Skin Care',
    'nav.makeup': 'Makeup',
    
    // Home page
    'home.welcome': 'Welcome to Beauty Match AI',
    'home.subtitle': 'Your personalized beauty advisor powered by AI',
    'home.haircare.title': 'Hair Care',
    'home.haircare.description': 'Discover products for your unique hair type and concerns',
    'home.skincare.title': 'Skin Care',
    'home.skincare.description': 'Build your perfect skincare routine based on your needs',
    'home.makeup.title': 'Makeup',
    'home.makeup.description': 'Find your perfect shades and makeup essentials',
    
    // How it works
    'home.howitworks': 'How It Works',
    'home.step1.title': 'Take a Quiz',
    'home.step1.description': 'Answer questions about your beauty needs',
    'home.step2.title': 'Get Matched',
    'home.step2.description': 'AI analyzes and finds perfect products',
    'home.step3.title': 'Shop Smart',
    'home.step3.description': 'See reviews and make informed choices',
    
    // Why choose us
    'home.whychoose': 'Why Choose Beauty Match AI?',
    'home.personalized.title': 'Personalized Recommendations',
    'home.personalized.description': 'Our advanced AI algorithm analyzes your unique beauty profile to recommend products that actually work for you. No more guessing games or wasted money on products that don\'t suit your needs.',
    'home.science.title': 'Science-Based Approach',
    'home.science.description': 'We use dermatologist-approved classifications and ingredient analysis to ensure every recommendation is backed by science. Your skin and hair deserve products that are proven to work.',
    'home.savemoney.title': 'Save Time & Money',
    'home.savemoney.description': 'Stop buying products that end up unused. Our targeted recommendations mean you only invest in products that match your specific needs, saving you hundreds of dollars annually.',
    'home.reviews.title': 'Real User Reviews',
    'home.reviews.description': 'Every product recommendation includes authentic reviews from people with similar beauty profiles. Make informed decisions based on real experiences, not just marketing claims.',
    
    // Promise section
    'home.promise.title': 'Our Promise',
    'home.promise.description': 'At Beauty Match AI, we believe everyone deserves to feel confident in their beauty routine. Our mission is to demystify beauty shopping by providing personalized, unbiased recommendations that celebrate your unique features. Whether you\'re a beauty novice or a skincare enthusiast, we\'re here to help you discover products that make you look and feel your best.',
    
    // Contact
    'home.contact.title': 'Get In Touch',
    'home.contact.email': 'Email Us',
    'home.contact.call': 'Call Us',
    'home.contact.visit': 'Visit Us',
    'home.contact.support': '24/7 Support',
    'home.contact.hours': 'Mon-Fri 9AM-6PM EST',
    'home.contact.follow': 'Follow Us',
    'home.contact.copyright': 'Beauty Match AI © 2024 | All Rights Reserved',
    'home.contact.made': 'Made with 💖 by the Beauty Match AI Team',
    
    // Language selector
    'language.english': 'English',
    'language.spanish': 'Español',
  },
  es: {
    // Header
    'header.title': 'Beauty Match AI',
    'header.subtitle': 'Tu Consejero de Belleza IA',
    
    // Navigation
    'nav.home': 'Inicio',
    'nav.haircare': 'Cuidado Capilar',
    'nav.skincare': 'Cuidado de la Piel',
    'nav.makeup': 'Maquillaje',
    
    // Home page
    'home.welcome': 'Bienvenido a Beauty Match AI',
    'home.subtitle': 'Tu consejero de belleza personalizado impulsado por IA',
    'home.haircare.title': 'Cuidado Capilar',
    'home.haircare.description': 'Descubre productos para tu tipo único de cabello y preocupaciones',
    'home.skincare.title': 'Cuidado de la Piel',
    'home.skincare.description': 'Construye tu rutina perfecta de cuidado de la piel según tus necesidades',
    'home.makeup.title': 'Maquillaje',
    'home.makeup.description': 'Encuentra tus tonos perfectos y productos esenciales de maquillaje',
    
    // How it works
    'home.howitworks': 'Cómo Funciona',
    'home.step1.title': 'Toma un Cuestionario',
    'home.step1.description': 'Responde preguntas sobre tus necesidades de belleza',
    'home.step2.title': 'Obtén Coincidencias',
    'home.step2.description': 'La IA analiza y encuentra productos perfectos',
    'home.step3.title': 'Compra Inteligentemente',
    'home.step3.description': 'Ve reseñas y toma decisiones informadas',
    
    // Why choose us
    'home.whychoose': '¿Por Qué Elegir Beauty Match AI?',
    'home.personalized.title': 'Recomendaciones Personalizadas',
    'home.personalized.description': 'Nuestro algoritmo avanzado de IA analiza tu perfil único de belleza para recomendar productos que realmente funcionen para ti. No más adivinanzas o dinero desperdiciado en productos que no se adaptan a tus necesidades.',
    'home.science.title': 'Enfoque Basado en Ciencia',
    'home.science.description': 'Utilizamos clasificaciones aprobadas por dermatólogos y análisis de ingredientes para asegurar que cada recomendación esté respaldada por la ciencia. Tu piel y cabello merecen productos que estén probados para funcionar.',
    'home.savemoney.title': 'Ahorra Tiempo y Dinero',
    'home.savemoney.description': 'Deja de comprar productos que terminan sin usar. Nuestras recomendaciones dirigidas significan que solo inviertes en productos que coinciden con tus necesidades específicas, ahorrándote cientos de dólares anualmente.',
    'home.reviews.title': 'Reseñas de Usuarios Reales',
    'home.reviews.description': 'Cada recomendación de producto incluye reseñas auténticas de personas con perfiles de belleza similares. Toma decisiones informadas basadas en experiencias reales, no solo en afirmaciones de marketing.',
    
    // Promise section
    'home.promise.title': 'Nuestra Promesa',
    'home.promise.description': 'En Beauty Match AI, creemos que todos merecen sentirse seguros en su rutina de belleza. Nuestra misión es desmitificar las compras de belleza proporcionando recomendaciones personalizadas e imparciales que celebren tus características únicas. Ya seas un novato en belleza o un entusiasta del cuidado de la piel, estamos aquí para ayudarte a descubrir productos que te hagan lucir y sentirte mejor.',
    
    // Contact
    'home.contact.title': 'Ponte en Contacto',
    'home.contact.email': 'Envíanos un Email',
    'home.contact.call': 'Llámanos',
    'home.contact.visit': 'Visítanos',
    'home.contact.support': 'Soporte 24/7',
    'home.contact.hours': 'Lun-Vie 9AM-6PM EST',
    'home.contact.follow': 'Síguenos',
    'home.contact.copyright': 'Beauty Match AI © 2024 | Todos los Derechos Reservados',
    'home.contact.made': 'Hecho con 💖 por el Equipo de Beauty Match AI',
    
    // Language selector
    'language.english': 'English',
    'language.spanish': 'Español',
  }
};