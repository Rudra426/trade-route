export type PlayerToken = 'elephant' | 'camel' | 'ship' | 'horse';

export interface Player {
  id: string;
  name: string;
  token: PlayerToken;
  money: number;
  position: number; // 0 to 31
  isBankrupt: boolean;
  isInDetention: boolean;
  detentionTurns: number;
  properties: string[]; // array of property IDs
  mortgagedProperties: string[]; // array of mortgaged property IDs
  color: string;
  isAI?: boolean;
  isReady?: boolean;
}
