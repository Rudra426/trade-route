import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from './gameStore';

describe('Game Store', () => {
  beforeEach(() => {
    // Reset store before each test
    useGameStore.setState({
      players: [],
      currentPlayerIndex: 0,
      phase: 'LOBBY',
      version: 0,
    });
  });

  it('initializes game with players correctly', () => {
    const store = useGameStore.getState();
    
    // Add two players to lobby
    store.addPlayerToLobby({ id: 'p1', name: 'Rudra', token: 'elephant', color: '#ff0000', isAI: false });
    store.addPlayerToLobby({ id: 'p2', name: 'AI Opponent', token: 'camel', color: '#00ff00', isAI: true });

    let updatedStore = useGameStore.getState();
    expect(updatedStore.players.length).toBe(2);
    expect(updatedStore.players[0].name).toBe('Rudra');
    expect(updatedStore.players[1].isAI).toBe(true);

    // Ready up players
    store.togglePlayerReady('p1');
    store.togglePlayerReady('p2');

    updatedStore = useGameStore.getState();
    expect(updatedStore.players.every(p => p.isReady)).toBe(true);

    // Start game
    store.startGame();
    
    updatedStore = useGameStore.getState();
    expect(updatedStore.phase).toBe('PRE_ROLL');
  });

  it('increments version counter on state updates', () => {
    const initialVersion = useGameStore.getState().version;
    useGameStore.getState().setLanguage('hi');
    const newVersion = useGameStore.getState().version;
    
    expect(newVersion).toBeGreaterThan(initialVersion);
    expect(useGameStore.getState().language).toBe('hi');
  });
});
