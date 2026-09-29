"use client";

import { useEffect } from 'react';
import { useGameStore } from '@/stores/gameStore';

export function LanguageSyncer() {
  const language = useGameStore(state => state.language);
  
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);
  
  return null;
}
