import { CityData } from '@/types/board';

export const citiesData: CityData[] = [
  { 
    id: 'space-1', 
    name: 'Kalibangan', 
    region: 'Rajasthan', 
    colorGroup: 'brown', 
    price: 60, 
    tollBase: 2, 
    tollTable: [10, 30, 90, 160, 250], 
    historicalFact: 'An ancient Indus Valley Civilization site known for its pre-Harappan fire altars and the world\'s earliest discovered ploughed agricultural field.', 
    imageKey: 'kalibangan_ruins' 
  },
  { 
    id: 'space-3', 
    name: 'Lothal Port', 
    region: 'Gujarat', 
    colorGroup: 'brown', 
    price: 60, 
    tollBase: 4, 
    tollTable: [20, 60, 180, 320, 450], 
    historicalFact: 'A prominent trading center of the Indus Valley Civilization featuring the world\'s earliest known tidal dock, connecting the city to an ancient course of the Sabarmati river.', 
    imageKey: 'lothal_dock' 
  },
  { 
    id: 'space-6', 
    name: 'Dholavira', 
    region: 'Gujarat', 
    colorGroup: 'light-blue', 
    price: 100, 
    tollBase: 6, 
    tollTable: [30, 90, 270, 400, 550], 
    historicalFact: 'One of the five largest Harappan sites, famously known for its highly sophisticated water conservation system consisting of massive reservoirs and step-wells.', 
    imageKey: 'dholavira_reservoirs' 
  },
  { 
    id: 'space-7', 
    name: 'Surkotada', 
    region: 'Kutch', 
    colorGroup: 'light-blue', 
    price: 100, 
    tollBase: 6, 
    tollTable: [30, 90, 270, 400, 550], 
    historicalFact: 'A fortified Harappan settlement in Kutch, noted by some archaeologists for the controversial discovery of early horse remains in the subcontinent.', 
    imageKey: 'surkotada_fort' 
  },
  { 
    id: 'space-9', 
    name: 'Rakhigarhi', 
    region: 'Haryana', 
    colorGroup: 'light-blue', 
    price: 120, 
    tollBase: 8, 
    tollTable: [40, 100, 300, 450, 600], 
    historicalFact: 'Recent excavations reveal Rakhigarhi was likely the largest settlement of the ancient Indus Valley Civilization, surpassing even Mohenjo-Daro in size.', 
    imageKey: 'rakhigarhi_mound' 
  },
  { 
    id: 'space-11', 
    name: 'Banawali', 
    region: 'Haryana', 
    colorGroup: 'pink', 
    price: 140, 
    tollBase: 10, 
    tollTable: [50, 150, 450, 625, 750], 
    historicalFact: 'An Indus Valley site constructed over the dry bed of the Sarasvati River, famous for yielding a perfectly intact terracotta model of a plough.', 
    imageKey: 'banawali_plough' 
  },
  { 
    id: 'space-13', 
    name: 'Alamgirpur', 
    region: 'Uttar Pradesh', 
    colorGroup: 'pink', 
    price: 140, 
    tollBase: 10, 
    tollTable: [50, 150, 450, 625, 750], 
    historicalFact: 'Considered the easternmost settlement of the Indus Valley Civilization, marking the vast geographic expansion of Harappan trade networks along the Yamuna river.', 
    imageKey: 'alamgirpur_pottery' 
  },
  { 
    id: 'space-14', 
    name: 'Ropar', 
    region: 'Punjab', 
    colorGroup: 'pink', 
    price: 160, 
    tollBase: 12, 
    tollTable: [60, 180, 500, 700, 900], 
    historicalFact: 'The first Indus Valley Civilization site to be excavated in independent India, featuring unique burials where humans were interred with their domestic dogs.', 
    imageKey: 'ropar_excavation' 
  },
  { 
    id: 'space-17', 
    name: 'Mathura', 
    region: 'Surasena', 
    colorGroup: 'orange', 
    price: 180, 
    tollBase: 14, 
    tollTable: [70, 200, 550, 750, 950], 
    historicalFact: 'A sacred city and major economic hub located at the junction of ancient caravan routes, flourishing as a capital of the Surasena Mahajanapada.', 
    imageKey: 'mathura_sculpture' 
  },
  { 
    id: 'space-19', 
    name: 'Taxila', 
    region: 'Gandhara', 
    colorGroup: 'orange', 
    price: 180, 
    tollBase: 14, 
    tollTable: [70, 200, 550, 750, 950], 
    historicalFact: 'An ancient center of learning and a vital commercial node on the Silk Road, linking the Indian subcontinent to Central Asia and the Hellenistic world.', 
    imageKey: 'taxila_university' 
  },
  { 
    id: 'space-20', 
    name: 'Ujjain', 
    region: 'Avanti', 
    colorGroup: 'orange', 
    price: 200, 
    tollBase: 16, 
    tollTable: [80, 220, 600, 800, 1000], 
    historicalFact: 'Capital of the ancient Avanti kingdom, it served as the prime political, commercial, and astronomical center of central India for centuries.', 
    imageKey: 'ujjain_observatory' 
  },
  { 
    id: 'space-21', 
    name: 'Kashi', 
    region: 'Kasi', 
    colorGroup: 'red', 
    price: 220, 
    tollBase: 18, 
    tollTable: [90, 250, 700, 875, 1050], 
    historicalFact: 'Also known as Varanasi, it is one of the oldest continuously inhabited cities in the world, renowned historically for its fine silk fabrics, perfumes, and ivory works.', 
    imageKey: 'kashi_ghat' 
  },
  { 
    id: 'space-23', 
    name: 'Pataliputra', 
    region: 'Magadha', 
    colorGroup: 'red', 
    price: 220, 
    tollBase: 18, 
    tollTable: [90, 250, 700, 875, 1050], 
    historicalFact: 'The magnificent capital of the Mauryan Empire under Ashoka, it was arguably the largest city in the world during its peak, surrounded by massive wooden palisades.', 
    imageKey: 'pataliputra_palace' 
  },
  { 
    id: 'space-25', 
    name: 'Tamralipti', 
    region: 'Bengal', 
    colorGroup: 'red', 
    price: 240, 
    tollBase: 20, 
    tollTable: [100, 300, 750, 925, 1100], 
    historicalFact: 'An ancient port city on the Bay of Bengal that served as the primary exit point for the Mauryan trade route connecting India to Southeast Asia and China.', 
    imageKey: 'tamralipti_port' 
  },
  { 
    id: 'space-27', 
    name: 'Kaveripattinam', 
    region: 'Chola', 
    colorGroup: 'yellow', 
    price: 260, 
    tollBase: 22, 
    tollTable: [110, 330, 800, 975, 1150], 
    historicalFact: 'Also known as Puhar, this was a thriving, cosmopolitan port city of the early Chola kings, handling immense volumes of maritime trade with the Roman Empire.', 
    imageKey: 'puhar_docks' 
  },
  { 
    id: 'space-29', 
    name: 'Madurai', 
    region: 'Pandya', 
    colorGroup: 'yellow', 
    price: 260, 
    tollBase: 22, 
    tollTable: [110, 330, 800, 975, 1150], 
    historicalFact: 'The ancient capital of the Pandyan dynasty, famous for its legendary Tamil Sangams (academies) and a highly lucrative pearl trade with ancient Rome.', 
    imageKey: 'madurai_temple' 
  },
  { 
    id: 'space-31', 
    name: 'Hampi', 
    region: 'Vijayanagara', 
    colorGroup: 'dark-blue', 
    price: 400, 
    tollBase: 50, 
    tollTable: [200, 600, 1400, 1700, 2000], 
    historicalFact: 'The imperial capital of the Vijayanagara Empire, described by foreign merchants as a fabulously wealthy metropolis whose bazaars overflowed with diamonds and spices.', 
    imageKey: 'hampi_chariot' 
  }
];
