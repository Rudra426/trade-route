import { EventCard } from '@/types/events';

export const eventCards: EventCard[] = [
  { 
    id: 'ev-1', 
    title: 'Monsoon Floods', 
    description: 'Heavy rains have ruined your cargo. Pay ₹50 for repairs.', 
    effectType: 'MONEY_SUBTRACT', 
    value: 50,
    historicalBasis: 'The Indian summer monsoon dictated trade cycles; severe floods regularly washed out roads and damaged unsealed goods.'
  },
  { 
    id: 'ev-2', 
    title: 'Spice Demand Soars', 
    description: 'Your black pepper sells for a premium! Collect ₹100.', 
    effectType: 'MONEY_ADD', 
    value: 100,
    historicalBasis: 'Known as "Black Gold," Indian pepper was highly sought after in the Roman Empire, heavily tilting the balance of global trade.'
  },
  { 
    id: 'ev-3', 
    title: 'Royal Favor', 
    description: 'The Emperor praises your silk. Collect ₹200.', 
    effectType: 'MONEY_ADD', 
    value: 200,
    historicalBasis: 'Kings of the Maurya and Gupta periods actively sponsored artisan guilds (Shrenis) and rewarded merchants who provided exotic luxury goods.'
  },
  { 
    id: 'ev-4', 
    title: 'Bandit Ambush', 
    description: 'Bandits raid your caravan. Pay ₹100.', 
    effectType: 'MONEY_SUBTRACT', 
    value: 100,
    historicalBasis: 'Overland caravans crossing dense forests (like the Vindhyas) were highly susceptible to armed bandit raids, necessitating paid escorts.'
  },
  { 
    id: 'ev-5', 
    title: 'Favorable Winds', 
    description: 'The monsoon winds propel your ships. Advance 3 spaces.', 
    effectType: 'MOVE_SPACES', 
    value: 3,
    historicalBasis: 'The discovery of the predictable Hippalus (monsoon) winds allowed sailors to drastically cut travel time across the Arabian Sea.'
  },
  { 
    id: 'ev-6', 
    title: 'Lost in the Thar', 
    description: 'Your caravan loses its way in the desert. Retreat 3 spaces.', 
    effectType: 'MOVE_SPACES', 
    value: -3,
    historicalBasis: 'Caravans crossing the treacherous Thar desert to reach the coastal ports of Gujarat frequently lost their way without reliable local guides.'
  },
  { 
    id: 'ev-7', 
    title: 'Summoned by the Emperor', 
    description: 'Advance to Pataliputra (Position 23).', 
    effectType: 'MOVE_TO_POSITION', 
    value: 23,
    historicalBasis: 'The Mauryan Empire established a highly centralized administration at Pataliputra, regularly summoning provincial governors and wealthy merchants.'
  },
  { 
    id: 'ev-8', 
    title: 'Guild Assembly', 
    description: 'Advance to Grand Bazaar and collect your bonus.', 
    effectType: 'MOVE_TO_POSITION', 
    value: 0,
    historicalBasis: 'Merchant guilds (Shrenis) held immense economic power and would call assemblies at major hubs to set prices and resolve disputes.'
  },
];
