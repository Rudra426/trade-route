// NEEDS HUMAN FACT-CHECK
export type QuizQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
};

export const historyQuiz: Record<string, QuizQuestion> = {
  "Dholavira": {
    question: "What could Dholavira's reservoirs help the city survive?",
    options: ["A 2-year drought", "A 5-year winter", "A major flood"],
    correctIndex: 0
  },
  "Lothal Port": {
    question: "What was Lothal Port built for?",
    options: ["Military defense", "Tidal harbor access", "River crossing"],
    correctIndex: 1
  },
  "Kalibangan": {
    question: "What significant archaeological discovery was made at Kalibangan?",
    options: ["The earliest ploughed agricultural field", "The largest gold hoard", "The first iron weapons"],
    correctIndex: 0
  },
  "Rakhigarhi": {
    question: "How does Rakhigarhi compare to Mohenjo-daro?",
    options: ["It is smaller", "It is bigger", "They are the exact same size"],
    correctIndex: 1
  },
  "Taxila": {
    question: "What subjects were taught at Taxila's ancient university?",
    options: ["Music, dance, and theater", "Medicine, law, and astrology", "Architecture and pottery"],
    correctIndex: 1
  },
  "Ujjain": {
    question: "What did ancient astronomers calculate from Ujjain?",
    options: ["Longitude", "Latitude", "The speed of light"],
    correctIndex: 0
  },
  "Pataliputra": {
    question: "At its peak under the Mauryas, what was Pataliputra's possible status?",
    options: ["The smallest trade post", "The largest city on Earth", "A deserted ghost town"],
    correctIndex: 1
  },
  "Hampi": {
    question: "What did Portuguese traders describe being sold by the roadside in Hampi?",
    options: ["Silk", "Spices", "Diamonds"],
    correctIndex: 2
  },
  "Madurai": {
    question: "What shape is Madurai's street grid laid out in?",
    options: ["A lotus flower", "A perfect circle", "A crescent moon"],
    correctIndex: 0
  },
  "Tamralipti": {
    question: "How long did Tamralipti serve as a major port for sea trade?",
    options: ["For over 1,000 years", "For only 50 years", "For about 200 years"],
    correctIndex: 0
  },
  "Mathura": {
    question: "Which two trade routes intersected at Mathura?",
    options: ["Dakshinapatha and Uttarapatha", "Silk Road and Spice Route", "Ganga and Yamuna trails"],
    correctIndex: 0
  },
  "Kashi": {
    question: "What fine textiles was Kashi renowned for?",
    options: ["Cotton and linen", "Silks and muslin", "Wool and felt"],
    correctIndex: 1
  },
  "Kaveripattinam": {
    question: "What did Roman ships trade for pepper and silk at Kaveripattinam?",
    options: ["Iron", "Gold", "Timber"],
    correctIndex: 1
  },
  "Surkotada": {
    question: "What rare archaeological evidence was yielded at Surkotada?",
    options: ["Early horse domestication", "Early chariot wheels", "First iron smelting"],
    correctIndex: 0
  },
  "Ropar": {
    question: "How many periods of continuous occupation were revealed at Ropar?",
    options: ["Two", "Four", "Six"],
    correctIndex: 2
  },
  "Alamgirpur": {
    question: "Near which river is Alamgirpur located?",
    options: ["Indus", "Yamuna", "Ganges"],
    correctIndex: 1
  },
  "Banawali": {
    question: "What unique architectural feature is Banawali known for?",
    options: ["Apsidal temples", "Pyramid tombs", "Hanging gardens"],
    correctIndex: 0
  },
  "Sindhu River": {
    question: "What was the main artery for trade and transport in the Indus Valley?",
    options: ["Ganga River", "Yamuna River", "Sindhu River"],
    correctIndex: 2
  },
  "Ganga Route": {
    question: "Which empire used the Ganga Route as a major trade and cultural artery?",
    options: ["The Mauryan Empire", "The Roman Empire", "The Chola Empire"],
    correctIndex: 0
  },
  "Sea Route": {
    question: "Which distant shores were connected to the Indian subcontinent via maritime routes?",
    options: ["Rome, Egypt, and Southeast Asia", "Britain and France", "Japan and Korea"],
    correctIndex: 0
  },
  "Copper Mine": {
    question: "Which region provided the Khetri mines that supplied copper to Harappan artisans?",
    options: ["Gujarat", "Rajasthan", "Punjab"],
    correctIndex: 1
  },
  "Cotton Market": {
    question: "To where did ancient India export fine cotton textiles?",
    options: ["Mesopotamia and beyond", "Only to China", "Only to Greece"],
    correctIndex: 0
  }
};
