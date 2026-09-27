export type SpaceType = 
  | 'START' 
  | 'PROPERTY' 
  | 'RESOURCE' 
  | 'EVENT' 
  | 'TAX' 
  | 'REST' 
  | 'DETENTION' 
  | 'GO_TO_DETENTION'
  | 'TRANSPORT';

export interface CityData {
  id: string;
  name: string;
  region: string;
  colorGroup: string;
  price: number;
  tollBase: number;
  tollTable: number[];
  historicalFact: string;
  imageKey: string;
}

export interface BoardSpace {
  id: string;
  name: string;
  type: SpaceType;
  position: number; // 0 to 31
  price?: number;
  rent?: number[]; // [base, 1 upgrade, 2 upgrades, etc.]
  colorGroup?: string;
  upgradeCost?: number;
  historicalFact?: string;
  imageKey?: string;
  region?: string;
}
