import { Player } from './player';
import { EventCard } from './events';

export type TurnPhase = 
  | 'LOBBY'             // Waiting for players to join and ready up
  | 'PRE_ROLL'          // Waiting for player to roll dice
  | 'MOVING'            // Token is animating
  | 'RESOLVING_SPACE'   // Store logic decides next step
  | 'BUY_PROPERTY_PROMPT' // User is asked to buy property
  | 'DRAW_EVENT_CARD'   // User drew an event card
  | 'POST_ACTION'       // Can build, trade, or end turn
  | 'TRADE_PROPOSED'    // Active trade negotiation
  | 'GAME_OVER';

export interface TradeOffer {
  fromPlayerId: string;
  toPlayerId: string;
  offeredMoney: number;
  offeredProperties: string[];
  requestedMoney: number;
  requestedProperties: string[];
}

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  phase: TurnPhase;
  round: number;
  maxRounds: number;
  targetWealth: number;
  logs: string[];
  currentEventCard: EventCard | null;
  propertyLevels: Record<string, number>;
  currentTrade: TradeOffer | null;
  doublesCount: number;
  hasRolledDoubles: boolean;
  winCondition: 'CLASSIC' | 'TRADE_DOMINANCE';
  aiTurnSpeed: 'NORMAL' | 'FAST';
}
