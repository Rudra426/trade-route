import { BoardSpace } from '@/types/board';
import { citiesData } from './cities';

function getCityData(id: string) {
  return citiesData.find(c => c.id === id);
}

export const boardSpaces: BoardSpace[] = [
  // Bottom Edge (0-7)
  { id: 'space-0', name: 'Grand Bazaar', type: 'START', position: 0 },
  { id: 'space-1', name: 'Kalibangan', type: 'PROPERTY', position: 1, rent: [2, 10, 30, 90, 160, 250], upgradeCost: 50, ...getCityData('space-1') },
  { id: 'space-2', name: 'Caravan Event', type: 'EVENT', position: 2 },
  { id: 'space-3', name: 'Lothal Port', type: 'PROPERTY', position: 3, rent: [4, 20, 60, 180, 320, 450], upgradeCost: 50, ...getCityData('space-3') },
  { id: 'space-4', name: 'Royal Levy', type: 'TAX', position: 4 },
  { id: 'space-5', name: 'Sindhu River', type: 'TRANSPORT', position: 5, price: 200, rent: [25, 50, 100, 200], historicalFact: 'The lifeline of the Indus Valley Civilization, serving as the main artery for trade and transport.' },
  { id: 'space-6', name: 'Dholavira', type: 'PROPERTY', position: 6, rent: [6, 30, 90, 270, 400, 550], upgradeCost: 50, ...getCityData('space-6') },
  { id: 'space-7', name: 'Surkotada', type: 'PROPERTY', position: 7, rent: [6, 30, 90, 270, 400, 550], upgradeCost: 50, ...getCityData('space-7') },
  
  // Left Edge (8-15)
  { id: 'space-8', name: 'Detention', type: 'DETENTION', position: 8 },
  { id: 'space-9', name: 'Rakhigarhi', type: 'PROPERTY', position: 9, rent: [8, 40, 100, 300, 450, 600], upgradeCost: 50, ...getCityData('space-9') },
  { id: 'space-10', name: 'Caravan Event', type: 'EVENT', position: 10 },
  { id: 'space-11', name: 'Banawali', type: 'PROPERTY', position: 11, rent: [10, 50, 150, 450, 625, 750], upgradeCost: 100, ...getCityData('space-11') },
  { id: 'space-12', name: 'Copper Mine', type: 'RESOURCE', position: 12, price: 150, historicalFact: 'The Khetri mines in Rajasthan provided the crucial copper needed by Harappan artisans and traders.' },
  { id: 'space-13', name: 'Alamgirpur', type: 'PROPERTY', position: 13, rent: [10, 50, 150, 450, 625, 750], upgradeCost: 100, ...getCityData('space-13') },
  { id: 'space-14', name: 'Ropar', type: 'PROPERTY', position: 14, rent: [12, 60, 180, 500, 700, 900], upgradeCost: 100, ...getCityData('space-14') },
  { id: 'space-15', name: 'Ganga Route', type: 'TRANSPORT', position: 15, price: 200, rent: [25, 50, 100, 200], historicalFact: 'The Ganges was the major trade and cultural artery for the Mahajanapadas and the mighty Mauryan Empire.' },
  
  // Top Edge (16-23)
  { id: 'space-16', name: 'Festival Grounds', type: 'REST', position: 16 },
  { id: 'space-17', name: 'Mathura', type: 'PROPERTY', position: 17, rent: [14, 70, 200, 550, 750, 950], upgradeCost: 100, ...getCityData('space-17') },
  { id: 'space-18', name: 'Caravan Event', type: 'EVENT', position: 18 },
  { id: 'space-19', name: 'Taxila', type: 'PROPERTY', position: 19, rent: [14, 70, 200, 550, 750, 950], upgradeCost: 100, ...getCityData('space-19') },
  { id: 'space-20', name: 'Ujjain', type: 'PROPERTY', position: 20, rent: [16, 80, 220, 600, 800, 1000], upgradeCost: 100, ...getCityData('space-20') },
  { id: 'space-21', name: 'Kashi', type: 'PROPERTY', position: 21, rent: [18, 90, 250, 700, 875, 1050], upgradeCost: 150, ...getCityData('space-21') },
  { id: 'space-22', name: 'Cotton Market', type: 'RESOURCE', position: 22, price: 150, historicalFact: 'Ancient India was the global center of cotton domestication, exporting fine textiles to Mesopotamia and beyond.' },
  { id: 'space-23', name: 'Pataliputra', type: 'PROPERTY', position: 23, rent: [18, 90, 250, 700, 875, 1050], upgradeCost: 150, ...getCityData('space-23') },

  // Right Edge (24-31)
  { id: 'space-24', name: 'Flooded Road', type: 'GO_TO_DETENTION', position: 24 },
  { id: 'space-25', name: 'Tamralipti', type: 'PROPERTY', position: 25, rent: [20, 100, 300, 750, 925, 1100], upgradeCost: 150, ...getCityData('space-25') },
  { id: 'space-26', name: 'Sea Route', type: 'TRANSPORT', position: 26, price: 200, rent: [25, 50, 100, 200], historicalFact: 'Maritime routes connected the Indian subcontinent to Rome, Egypt, and the distant shores of Southeast Asia.' },
  { id: 'space-27', name: 'Kaveripattinam', type: 'PROPERTY', position: 27, rent: [22, 110, 330, 800, 975, 1150], upgradeCost: 150, ...getCityData('space-27') },
  { id: 'space-28', name: 'Caravan Event', type: 'EVENT', position: 28 },
  { id: 'space-29', name: 'Madurai', type: 'PROPERTY', position: 29, rent: [22, 110, 330, 800, 975, 1150], upgradeCost: 150, ...getCityData('space-29') },
  { id: 'space-30', name: 'Tribute', type: 'TAX', position: 30 },
  { id: 'space-31', name: 'Hampi', type: 'PROPERTY', position: 31, rent: [50, 200, 600, 1400, 1700, 2000], upgradeCost: 200, ...getCityData('space-31') },
] as BoardSpace[];
