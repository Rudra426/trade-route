export type EventEffectType = 
  | 'MONEY_ADD' 
  | 'MONEY_SUBTRACT' 
  | 'MOVE_TO_POSITION' 
  | 'MOVE_SPACES';

export interface EventCard {
  id: string;
  title: string;
  description: string;
  effectType: EventEffectType;
  value: number; // The amount of money, position index, or number of spaces
  historicalBasis?: string;
}
