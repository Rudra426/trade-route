import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameState, TurnPhase } from '@/types/game';
import { Player } from '@/types/player';
import { INITIAL_BALANCE } from '@/game/config/balance';
import { boardSpaces } from '@/data/boardSpaces';
import { eventCards } from '@/data/eventCards';
import { placeFacts } from '@/data/placeFacts';
import { TradeOffer } from '@/types/game';
import { playSound } from '@/utils/audio';

function checkTradeDominance(player: Player): boolean {
  // Count how many complete color groups (monopolies) the player has
  const colorGroups = Array.from(new Set(boardSpaces.map(s => s.colorGroup).filter(Boolean)));
  let completeMonopolies = 0;

  for (const group of colorGroups) {
    const groupSpaces = boardSpaces.filter(s => s.colorGroup === group);
    const ownsAll = groupSpaces.every(s => player.properties.includes(s.id));
    if (ownsAll) completeMonopolies++;
  }

  return completeMonopolies >= 3;
}

interface GameStore extends GameState {
  rollDice: () => { die1: number, die2: number };
  movePlayer: (spaces: number) => void;
  resolveSpace: () => void;
  resolveEventCard: () => void;
  endTurn: () => void;
  buyProperty: () => void;
  mortgageProperty: (propertyId: string) => void;
  unmortgageProperty: (propertyId: string) => void;
  buildUpgrade: (propertyId: string) => void;
  declareBankruptcy: () => void;
  proposeTrade: (offer: TradeOffer) => void;
  acceptTrade: () => void;
  declineTrade: () => void;
  skipProperty: () => void;
  setPhase: (phase: TurnPhase) => void;
  initGame: (
    players: Omit<Player, 'money' | 'position' | 'isBankrupt' | 'isInDetention' | 'detentionTurns' | 'properties' | 'mortgagedProperties' | 'isReady'>[],
    winCondition?: 'CLASSIC' | 'TRADE_DOMINANCE',
    aiTurnSpeed?: 'NORMAL' | 'FAST'
  ) => void;
  addPlayerToLobby: (player: Omit<Player, 'money' | 'position' | 'isBankrupt' | 'isInDetention' | 'detentionTurns' | 'properties' | 'mortgagedProperties' | 'isReady'>) => void;
  togglePlayerReady: (playerId: string) => void;
  startGame: () => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
  players: [],
  currentPlayerIndex: 0,
  phase: 'PRE_ROLL',
  round: 1,
  maxRounds: 20,
  targetWealth: 5000,
  logs: [],
  currentEventCard: null,
  propertyLevels: {},
  currentTrade: null,
  doublesCount: 0,
  hasRolledDoubles: false,
  winCondition: 'CLASSIC',
  aiTurnSpeed: 'NORMAL',

  rollDice: () => {
    const die1 = Math.floor(Math.random() * 6) + 1;
    const die2 = Math.floor(Math.random() * 6) + 1;
    const isDouble = die1 === die2;
    const state = get();
    
    // If they were in detention, rolling doubles gets them out!
    const player = state.players[state.currentPlayerIndex];
    if (player.isInDetention) {
      if (isDouble) {
        set(s => {
          const newPlayers = [...s.players];
          newPlayers[s.currentPlayerIndex].isInDetention = false;
          newPlayers[s.currentPlayerIndex].detentionTurns = 0;
          return { players: newPlayers, phase: 'MOVING', logs: [...s.logs, `${player.name} rolled doubles and escaped Detention!`] };
        });
      } else {
        set(s => {
          const newPlayers = [...s.players];
          newPlayers[s.currentPlayerIndex].detentionTurns += 1;
          
          if (newPlayers[s.currentPlayerIndex].detentionTurns >= 3) {
            // Must pay 50 and get out
            newPlayers[s.currentPlayerIndex].money -= 50;
            newPlayers[s.currentPlayerIndex].isInDetention = false;
            newPlayers[s.currentPlayerIndex].detentionTurns = 0;
            return { players: newPlayers, phase: 'MOVING', logs: [...s.logs, `${player.name} paid ₹50 to leave Detention.`] };
          }
          
          return { players: newPlayers, phase: 'POST_ACTION', logs: [...s.logs, `${player.name} failed to roll doubles.`] };
        });
      }
      return { die1, die2 };
    }

    const newDoublesCount = isDouble ? state.doublesCount + 1 : 0;
    
    if (newDoublesCount === 3) {
      // 3 doubles = Detention
      set((s) => {
        const players = [...s.players];
        players[s.currentPlayerIndex].position = 8;
        players[s.currentPlayerIndex].isInDetention = true;
        return {
          players,
          hasRolledDoubles: false,
          doublesCount: 0,
          phase: 'POST_ACTION', // skips movement/resolution
          logs: [...s.logs, `${player.name} rolled 3 doubles! Sent to Detention!`]
        };
      });
      return { die1, die2 };
    }

    set({ hasRolledDoubles: isDouble, doublesCount: newDoublesCount, phase: 'MOVING' });
    return { die1, die2 };
  },

  movePlayer: (spaces) => set((state) => {
    const players = [...state.players];
    const player = players[state.currentPlayerIndex];
    const logs = [...state.logs];
    
    let newPosition = player.position + spaces;
    if (newPosition >= 32) {
      newPosition = newPosition % 32;
      player.money += INITIAL_BALANCE.passingStartBonus;
      logs.push(`${player.name} completed a trade route and earned ₹${INITIAL_BALANCE.passingStartBonus}`);
    }
    
    player.position = newPosition;
    return { players, phase: 'RESOLVING_SPACE', logs };
  }),

  resolveSpace: () => set((state) => {
    const players = [...state.players];
    const player = players[state.currentPlayerIndex];
    const space = boardSpaces.find(s => s.position === player.position);
    const logs = [...state.logs];

    if (!space) return { phase: 'POST_ACTION' };

    if (space.type === 'PROPERTY' || space.type === 'RESOURCE' || space.type === 'TRANSPORT') {
      const owner = players.find(p => p.properties.includes(space.id));
      if (owner) {
        if (owner.id !== player.id) {
          if (owner.mortgagedProperties.includes(space.id)) {
            logs.push(`${space.name} is mortgaged, so ${player.name} pays no toll.`);
            return { players, phase: 'POST_ACTION', logs };
          }

          const level = state.propertyLevels[space.id] || 0;
          const rent = space.rent ? space.rent[Math.min(level, space.rent.length - 1)] : (space.price ? Math.floor(space.price * 0.1) : 0);
          player.money -= rent;
          owner.money += rent;
          playSound('coins');
          logs.push(`${player.name} paid ₹${rent} in tolls to ${owner.name} at ${space.name}`);
          const factData = placeFacts[space.name];
          if (factData) {
            logs.push(`FACT:${space.name} (${factData.era}) — ${factData.fact}`);
          }
        }
        return { players, phase: 'POST_ACTION', logs };
      } else {
        return { phase: 'BUY_PROPERTY_PROMPT' };
      }
    } else if (space.type === 'TAX') {
      player.money -= 100;
      logs.push(`${player.name} paid ₹100 royal tribute at ${space.name}`);
      return { players, phase: 'POST_ACTION', logs };
    } else if (space.type === 'GO_TO_DETENTION') {
      player.position = 8;
      player.isInDetention = true;
      logs.push(`Guards captured ${player.name}! Sent to Detention.`);
      return { players, phase: 'POST_ACTION', logs };
    } else if (space.type === 'EVENT') {
      const randomCard = eventCards[Math.floor(Math.random() * eventCards.length)];
      return { phase: 'DRAW_EVENT_CARD', currentEventCard: randomCard };
    }

    return { phase: 'POST_ACTION' };
  }),

  buyProperty: () => set((state) => {
    const players = [...state.players];
    const player = players[state.currentPlayerIndex];
    const space = boardSpaces.find(s => s.position === player.position);
    const logs = [...state.logs];

    if (player.isInDetention) {
      logs.push(`${player.name} cannot buy properties while in Detention.`);
      return { logs };
    }

    if (space && space.price && player.money >= space.price) {
      player.money -= space.price;
      player.properties.push(space.id);
      playSound('coins');
      logs.push(`${player.name} seized control of ${space.name} for ₹${space.price}`);
      const factData = placeFacts[space.name];
      if (factData) {
        logs.push(`FACT:${space.name} (${factData.era}) — ${factData.fact}`);
      }
      
      if (state.winCondition === 'TRADE_DOMINANCE' && checkTradeDominance(player)) {
        logs.push(`${player.name} has achieved Trade Dominance and wins the game!`);
        return { players, phase: 'GAME_OVER', logs };
      }
    }
    return { players, phase: 'POST_ACTION', logs };
  }),

  skipProperty: () => set((state) => {
    return { phase: 'POST_ACTION' };
  }),

  buildUpgrade: (propertyId: string) => set((state) => {
    const players = [...state.players];
    const player = players[state.currentPlayerIndex];
    const space = boardSpaces.find(s => s.id === propertyId);
    const logs = [...state.logs];

    if (player.isInDetention) return state;
    if (!space || !space.upgradeCost || !space.colorGroup) return state;

    // Check if player owns all of this color group
    const groupSpaces = boardSpaces.filter(s => s.colorGroup === space.colorGroup);
    const ownsAll = groupSpaces.every(s => player.properties.includes(s.id));

    if (!ownsAll) {
      logs.push(`${player.name} must control all ${space.colorGroup} territories first!`);
      return { logs };
    }

    const currentLevel = state.propertyLevels[propertyId] || 0;
    const maxLevel = (space.rent?.length || 1) - 1;

    if (currentLevel < maxLevel && player.money >= space.upgradeCost) {
      player.money -= space.upgradeCost;
      const newLevels = { ...state.propertyLevels, [propertyId]: currentLevel + 1 };
      playSound('build');
      logs.push(`${player.name} built an upgrade at ${space.name} for ₹${space.upgradeCost}`);
      const factData = placeFacts[space.name];
      if (factData) {
        logs.push(`FACT:${space.name} (${factData.era}) — ${factData.fact}`);
      }
      return { players, propertyLevels: newLevels, logs };
    }

    return state;
  }),

  mortgageProperty: (propertyId: string) => set((state) => {
    const players = [...state.players];
    const player = players[state.currentPlayerIndex];
    const space = boardSpaces.find(s => s.id === propertyId);
    const logs = [...state.logs];

    if (player.isInDetention) return state;
    if (!space || !space.price) return state;
    
    // Cannot mortgage if upgraded
    if (state.propertyLevels[propertyId] && state.propertyLevels[propertyId] > 0) {
      logs.push(`${space.name} must be downgraded before mortgaging.`);
      return { logs };
    }

    if (player.properties.includes(propertyId) && !player.mortgagedProperties.includes(propertyId)) {
      const mortgageValue = Math.floor(space.price / 2);
      player.money += mortgageValue;
      player.mortgagedProperties.push(propertyId);
      logs.push(`${player.name} mortgaged ${space.name} for ₹${mortgageValue}`);
      const factData = placeFacts[space.name];
      if (factData) {
        logs.push(`FACT:${space.name} (${factData.era}) — ${factData.fact}`);
      }
      return { players, logs };
    }

    return state;
  }),

  unmortgageProperty: (propertyId: string) => set((state) => {
    const players = [...state.players];
    const player = players[state.currentPlayerIndex];
    const space = boardSpaces.find(s => s.id === propertyId);
    const logs = [...state.logs];

    if (player.isInDetention) return state;
    if (!space || !space.price) return state;

    if (player.mortgagedProperties.includes(propertyId)) {
      const unmortgageCost = Math.floor((space.price / 2) * 1.1); // 10% interest
      if (player.money >= unmortgageCost) {
        player.money -= unmortgageCost;
        player.mortgagedProperties = player.mortgagedProperties.filter(id => id !== propertyId);
        logs.push(`${player.name} reclaimed ${space.name} for ₹${unmortgageCost}`);
        const factData = placeFacts[space.name];
        if (factData) {
          logs.push(`FACT:${space.name} (${factData.era}) — ${factData.fact}`);
        }
        return { players, logs };
      } else {
        logs.push(`Not enough gold to unmortgage ${space.name}. Need ₹${unmortgageCost}.`);
        return { logs };
      }
    }

    return state;
  }),

  declareBankruptcy: () => set((state) => {
    const players = [...state.players];
    const player = players[state.currentPlayerIndex];
    const logs = [...state.logs];

    player.isBankrupt = true;
    player.properties = [];
    player.mortgagedProperties = [];
    player.money = 0;

    logs.push(`${player.name} has declared bankruptcy and is eliminated!`);

    // Check if only one player left
    const activePlayers = players.filter(p => !p.isBankrupt);
    if (activePlayers.length === 1) {
      logs.push(`${activePlayers[0].name} is the last merchant standing and wins!`);
      return { players, logs, phase: 'GAME_OVER' };
    }

    // Advance turn to next active player
    let nextIndex = (state.currentPlayerIndex + 1) % players.length;
    let nextRound = state.round;
    while (players[nextIndex].isBankrupt) {
      nextIndex = (nextIndex + 1) % players.length;
      if (nextIndex === 0) nextRound++;
    }

    return {
      players,
      logs,
      currentPlayerIndex: nextIndex,
      round: nextRound,
      phase: 'PRE_ROLL',
      doublesCount: 0,
      hasRolledDoubles: false
    };
  }),

  proposeTrade: (offer: TradeOffer) => set((state) => {
    const fromPlayer = state.players.find(p => p.id === offer.fromPlayerId);
    if (fromPlayer?.isInDetention) {
      return { logs: [...state.logs, `${fromPlayer.name} cannot trade while in Detention.`] };
    }

    return {
      currentTrade: offer,
      phase: 'TRADE_PROPOSED',
      logs: [...state.logs, `${fromPlayer?.name} proposed a trade.`]
    };
  }),

  acceptTrade: () => set((state) => {
    const trade = state.currentTrade;
    if (!trade) return state;

    const players = [...state.players];
    const fromPlayer = players.find(p => p.id === trade.fromPlayerId);
    const toPlayer = players.find(p => p.id === trade.toPlayerId);

    if (fromPlayer && toPlayer) {
      // Exchange money
      fromPlayer.money = fromPlayer.money - trade.offeredMoney + trade.requestedMoney;
      toPlayer.money = toPlayer.money - trade.requestedMoney + trade.offeredMoney;

      // Exchange properties
      fromPlayer.properties = fromPlayer.properties
        .filter(id => !trade.offeredProperties.includes(id))
        .concat(trade.requestedProperties);

      toPlayer.properties = toPlayer.properties
        .filter(id => !trade.requestedProperties.includes(id))
        .concat(trade.offeredProperties);

      playSound('coins');
      const logs = [...state.logs, `${toPlayer.name} accepted the trade proposal.`];
      
      let newPhase: TurnPhase = 'POST_ACTION';
      if (state.winCondition === 'TRADE_DOMINANCE') {
        if (checkTradeDominance(fromPlayer)) {
          logs.push(`${fromPlayer.name} has achieved Trade Dominance and wins the game!`);
          newPhase = 'GAME_OVER';
        } else if (checkTradeDominance(toPlayer)) {
          logs.push(`${toPlayer.name} has achieved Trade Dominance and wins the game!`);
          newPhase = 'GAME_OVER';
        }
      }

      return { players, currentTrade: null, phase: newPhase, logs };
    }
    
    return { currentTrade: null, phase: 'POST_ACTION' };
  }),

  declineTrade: () => set((state) => {
    const logs = [...state.logs, `Trade proposal was declined.`];
    return { currentTrade: null, phase: 'POST_ACTION', logs };
  }),

  resolveEventCard: () => set((state) => {
    const players = [...state.players];
    const player = players[state.currentPlayerIndex];
    const card = state.currentEventCard;
    const logs = [...state.logs];

    if (!card) return { phase: 'POST_ACTION' };

    playSound('event');
    logs.push(`${player.name} drew Event: ${card.title}`);

    let newPosition = player.position;
    let needsSpaceResolution = false;

    if (card.effectType === 'MONEY_ADD') {
      player.money += card.value;
    } else if (card.effectType === 'MONEY_SUBTRACT') {
      player.money -= card.value;
    } else if (card.effectType === 'MOVE_TO_POSITION') {
      if (card.value === 0 && player.position !== 0) {
         player.money += INITIAL_BALANCE.passingStartBonus;
         logs.push(`${player.name} passed Start and collected ₹${INITIAL_BALANCE.passingStartBonus}`);
      }
      newPosition = card.value;
      needsSpaceResolution = true;
    } else if (card.effectType === 'MOVE_SPACES') {
      newPosition = player.position + card.value;
      if (newPosition < 0) newPosition = 32 + newPosition;
      if (newPosition >= 32) {
        newPosition = newPosition % 32;
        player.money += INITIAL_BALANCE.passingStartBonus;
        logs.push(`${player.name} passed Start and collected ₹${INITIAL_BALANCE.passingStartBonus}`);
      }
      needsSpaceResolution = true;
    }

    player.position = newPosition;
    
    return { 
      players, 
      logs, 
      currentEventCard: null, 
      phase: needsSpaceResolution ? 'RESOLVING_SPACE' : 'POST_ACTION' 
    };
  }),

  endTurn: () => set((state) => {
    // Check if player gets to roll again due to doubles
    if (state.hasRolledDoubles) {
      return {
        phase: 'PRE_ROLL',
        hasRolledDoubles: false,
        logs: [...state.logs, `${state.players[state.currentPlayerIndex].name} rolls again!`]
      };
    }

    let nextIndex = (state.currentPlayerIndex + 1) % state.players.length;
    let nextRound = state.round;
    
    if (nextIndex === 0) {
      nextRound++;
    }

    // Skip bankrupt players
    let safetyCounter = 0;
    while (state.players[nextIndex].isBankrupt && safetyCounter < state.players.length) {
      nextIndex = (nextIndex + 1) % state.players.length;
      if (nextIndex === 0) nextRound++;
      safetyCounter++;
    }

    // Check if anyone won via wealth (exclude bankrupt players)
    const activePlayers = state.players.filter(p => !p.isBankrupt);
    const wealthiestPlayer = activePlayers.sort((a, b) => b.money - a.money)[0];
    if (wealthiestPlayer && wealthiestPlayer.money >= state.targetWealth) {
      return { phase: 'GAME_OVER' };
    }

    if (nextRound > state.maxRounds) {
      return { phase: 'GAME_OVER' };
    }

    return {
      currentPlayerIndex: nextIndex,
      round: nextRound,
      phase: 'PRE_ROLL',
      doublesCount: 0,
      hasRolledDoubles: false
    };
  }),

  setPhase: (phase) => set({ phase }),

  initGame: (initialPlayers, winCondition = 'CLASSIC', aiTurnSpeed = 'NORMAL') => set(() => {
    const players: Player[] = initialPlayers.map(p => ({
      ...p,
      money: INITIAL_BALANCE.startingMoney,
      position: 0,
      isBankrupt: false,
      isInDetention: false,
      detentionTurns: 0,
      properties: [],
      mortgagedProperties: [],
      isReady: false
    }));
    return {
      players,
      currentPlayerIndex: 0,
      phase: 'PRE_ROLL',
      round: 1,
      logs: ['The caravans depart!'],
      currentEventCard: null,
      propertyLevels: {},
      currentTrade: null,
      doublesCount: 0,
      hasRolledDoubles: false,
      winCondition,
      aiTurnSpeed
    };
  }),

  addPlayerToLobby: (playerInfo) => set((state) => {
    // Only allow max 4 players
    if (state.players.length >= 4) return state;
    // Don't add if already exists
    if (state.players.find(p => p.id === playerInfo.id)) return state;

    const newPlayer: Player = {
      ...playerInfo,
      money: INITIAL_BALANCE.startingMoney,
      position: 0,
      isBankrupt: false,
      isInDetention: false,
      detentionTurns: 0,
      properties: [],
      mortgagedProperties: [],
      isReady: false
    };

    return { players: [...state.players, newPlayer] };
  }),

  togglePlayerReady: (playerId) => set((state) => {
    const players = state.players.map(p => 
      p.id === playerId ? { ...p, isReady: !p.isReady } : p
    );
    return { players };
  }),

  startGame: () => set((state) => {
    // Ensure all players are ready
    if (!state.players.every(p => p.isReady)) return state;
    return {
      phase: 'PRE_ROLL',
      logs: [...state.logs, 'The game has begun!']
    };
  })
    }),
    {
      name: 'trade-routes-save',
    }
  )
);
