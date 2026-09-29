import { useGameStore } from '@/stores/gameStore';
import { dictionary } from '@/data/i18n';

export function useTranslation() {
  const language = useGameStore(state => state.language);

  const t = (key: keyof typeof dictionary.en.ui) => {
    return dictionary[language].ui[key] || dictionary.en.ui[key];
  };

  const tCity = (cityName: string) => {
    return (dictionary[language].cities as Record<string, string>)[cityName] || cityName;
  };

  const tFact = (cityName: string) => {
    const defaultFact = (dictionary.en.placeFacts as Record<string, {era: string, fact: string}>)[cityName];
    const translatedFact = (dictionary[language].placeFacts as Record<string, {era: string, fact: string}>)[cityName];
    return translatedFact || defaultFact;
  };

  const tEvent = (eventId: string) => {
    const defaultEvent = (dictionary.en.eventCards as Record<string, {title: string, description: string}>)[eventId];
    const translatedEvent = (dictionary[language].eventCards as Record<string, {title: string, description: string}>)[eventId];
    return translatedEvent || defaultEvent;
  };

  return { t, tCity, tFact, tEvent, language };
}
