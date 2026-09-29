"use client";

import { useGameStore } from '@/stores/gameStore';
import { Button } from '@/components/ui/button';

export function LanguageToggle() {
  const language = useGameStore(state => state.language);
  const setLanguage = useGameStore(state => state.setLanguage);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  return (
    <Button 
      onClick={toggleLanguage}
      variant="outline"
      className="fixed top-4 right-4 z-50 bg-[#e7d5b3] text-[#4a3219] border-[#8b5a2b] font-serif font-bold uppercase tracking-widest shadow-md hover:bg-[#d6c4a2]"
    >
      {language === 'en' ? 'हिन्दी' : 'EN'}
    </Button>
  );
}
