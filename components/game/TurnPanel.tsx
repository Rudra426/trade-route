import { useGameStore } from '@/stores/gameStore';
import { Button } from '@/components/ui/button';
import { useState, useEffect, useRef } from 'react';
import { PropertyModal } from './PropertyModal';
import { EventCardModal } from './EventCardModal';
import { GameOverModal } from './GameOverModal';
import { BuildModal } from './BuildModal';
import { TradeModal } from './TradeModal';
import { TradeReviewModal } from './TradeReviewModal';
import { toast } from 'sonner';
import { boardSpaces } from '@/data/boardSpaces';
import { playSound } from '@/utils/audio';
import { LobbyPanel } from './LobbyPanel';
import { useSearchParams } from 'next/navigation';
import { Dice3D } from './Dice3D';

export function TurnPanel() {
  const { players, currentPlayerIndex, phase, rollDice, movePlayer, resolveSpace, endTurn, round, logs, buyProperty, skipProperty, resolveEventCard, currentTrade, acceptTrade, declineTrade, declareBankruptcy } = useGameStore();
  const searchParams = useSearchParams();
  const playerName = searchParams.get('player');
  const currentPlayer = players[currentPlayerIndex];
  const localPlayer = playerName ? players.find(p => p.name === playerName) : null;
  const isSpectator = playerName && !localPlayer;
  const isBankrupt = localPlayer?.isBankrupt;
  const isMyTurn = !playerName ? !currentPlayer?.isAI : currentPlayer?.name === playerName;
  const [diceResult, setDiceResult] = useState<{die1: number, die2: number} | null>(null);
  const [isRolling, setIsRolling] = useState(false);

  const prevLogsLength = useRef(logs.length);

  useEffect(() => {
    if (logs.length > prevLogsLength.current) {
      const newLogs = logs.slice(prevLogsLength.current);
      newLogs.forEach(log => {
        toast(log);
      });
      prevLogsLength.current = logs.length;
    }
  }, [logs]);

  const handleRoll = () => {
    playSound('dice');
    const result = rollDice();
    setDiceResult(result);
    setIsRolling(true);

    // After the 1.5s dice animation completes
    setTimeout(() => {
      setIsRolling(false);
      
      const currentPhase = useGameStore.getState().phase;
      if (currentPhase === 'MOVING') {
        movePlayer(result.die1 + result.die2);
        // Wait for movement animation then resolve
        setTimeout(() => {
          resolveSpace();
        }, 800);
      }
    }, 1500); 
  };

  const handleEndTurn = () => {
    setDiceResult(null);
    endTurn();
  };

  // AI Logic
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    // AI receiving a trade
    if (phase === 'TRADE_PROPOSED' && currentTrade) {
      const targetPlayer = players.find(p => p.id === currentTrade.toPlayerId);
      const offeringPlayer = players.find(p => p.id === currentTrade.fromPlayerId);
      if (targetPlayer?.isAI && offeringPlayer) {
        timeoutId = setTimeout(() => {
          let offerValue = currentTrade.offeredMoney;
          let requestValue = currentTrade.requestedMoney;

          // Calculate base values for offered properties
          currentTrade.offeredProperties.forEach(id => {
            const space = boardSpaces.find(s => s.id === id);
            if (space?.price) {
               // If this space completes a monopoly for the AI, it's worth double
               const groupSpaces = boardSpaces.filter(s => s.colorGroup === space.colorGroup);
               const aiOwnedInGroup = groupSpaces.filter(s => targetPlayer.properties.includes(s.id)).length;
               if (groupSpaces.length > 0 && aiOwnedInGroup === groupSpaces.length - 1) {
                  offerValue += space.price * 2; // AI values this highly
               } else {
                  offerValue += space.price;
               }
            }
          });

          let wouldGiveMonopoly = false;
          // Calculate values for requested properties
          currentTrade.requestedProperties.forEach(id => {
            const space = boardSpaces.find(s => s.id === id);
            if (space?.price) {
               // If this space completes a monopoly for the offering player, AI demands a premium
               const groupSpaces = boardSpaces.filter(s => s.colorGroup === space.colorGroup);
               const offeringOwnedInGroup = groupSpaces.filter(s => offeringPlayer.properties.includes(s.id) || currentTrade.offeredProperties.includes(s.id)).length;
               
               if (groupSpaces.length > 0 && offeringOwnedInGroup === groupSpaces.length - 1) {
                  wouldGiveMonopoly = true;
                  requestValue += space.price * 2.5; // Massive premium
               } else {
                  requestValue += space.price;
               }
            }
          });

          // AI expects a 10% profit margin
          const isAcceptable = offerValue > 0 && offerValue >= requestValue * 1.1;

          if (isAcceptable) {
            toast.success(`${targetPlayer.name} accepts your generous offer!`);
            acceptTrade();
          } else {
            if (wouldGiveMonopoly) {
              toast.error(`${targetPlayer.name} refuses to hand you a monopoly so cheaply!`);
            } else {
              toast.error(`${targetPlayer.name} finds the offer unbalanced and declines.`);
            }
            declineTrade();
          }
        }, 2500);
        return () => clearTimeout(timeoutId);
      }
    }

    // AI taking its turn
    if (currentPlayer?.isAI) {
      if (phase === 'PRE_ROLL') {
        timeoutId = setTimeout(() => handleRoll(), 1500);
      } else if (phase === 'BUY_PROPERTY_PROMPT') {
        timeoutId = setTimeout(() => {
          const space = boardSpaces.find(s => s.position === currentPlayer.position);
          if (space?.price && currentPlayer.money >= space.price) {
            buyProperty();
          } else {
            skipProperty();
          }
        }, 2000);
      } else if (phase === 'DRAW_EVENT_CARD') {
        timeoutId = setTimeout(() => {
          resolveEventCard();
          setTimeout(() => {
            const currentState = useGameStore.getState();
            if (currentState.phase === 'RESOLVING_SPACE') {
              currentState.resolveSpace();
            }
          }, 800);
        }, 3000);
      } else if (phase === 'POST_ACTION') {
        if (currentPlayer.money < 0) {
          timeoutId = setTimeout(() => declareBankruptcy(), 1500);
        } else {
          timeoutId = setTimeout(() => handleEndTurn(), 1500);
        }
      }
    }

    return () => clearTimeout(timeoutId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPlayer, phase, currentTrade]);

  if (phase === 'LOBBY') {
    return <LobbyPanel />;
  }

  if (!currentPlayer) return null;

  return (
    <div className="p-6 border-b border-stone-800 bg-stone-900/60 backdrop-blur-sm space-y-4 shadow-xl relative font-sans">
      <div className="flex justify-between items-center text-sm font-medium text-stone-400 relative z-10">
        <span className="uppercase tracking-widest text-amber-600/80">Round {round}</span>
        <span className="bg-stone-800 px-3 py-1 rounded border border-stone-700 text-amber-500 shadow-inner text-xs uppercase tracking-wider">{phase.replace('_', ' ')}</span>
      </div>

      <div className="text-center space-y-6 relative z-10 py-4">
        {isBankrupt && (
          <div className="bg-red-950/80 border border-red-800 p-2 rounded mb-4 shadow-[0_0_15px_rgba(220,38,38,0.3)] animate-pulse">
            <span className="text-red-500 font-bold uppercase tracking-widest text-sm">You are Bankrupt (Spectating)</span>
          </div>
        )}
        {isSpectator && (
          <div className="bg-stone-800/80 border border-stone-600 p-2 rounded mb-4">
            <span className="text-stone-400 font-bold uppercase tracking-widest text-sm">Spectator Mode</span>
          </div>
        )}

        <h2 className="text-3xl font-bold tracking-wide font-serif">
          <span style={{ color: currentPlayer.color }} className="drop-shadow-md">{currentPlayer.name}&apos;s</span> Turn
        </h2>
        
        {phase === 'PRE_ROLL' && (
          isMyTurn ? (
            <div className="space-y-3">
              <Button onClick={handleRoll} className="w-full bg-gradient-to-r from-[#d2691e] to-[#8b4513] hover:from-[#b25918] hover:to-[#6b350e] text-[#fdf5e6] font-bold py-8 text-xl transition-all hover:scale-[1.02] border border-[#d2691e] shadow-[0_0_20px_rgba(210,105,30,0.5)] hover:shadow-[0_0_30px_rgba(210,105,30,0.8)] uppercase tracking-widest font-sans">
                Roll the Bones
              </Button>
              <div className="text-center">
                <button 
                  onClick={() => {
                    if (window.confirm("Are you sure you want to surrender? You will lose all properties and be eliminated from the game.")) {
                      declareBankruptcy();
                    }
                  }}
                  className="text-xs text-stone-600 hover:text-red-500 uppercase tracking-widest transition-colors cursor-pointer"
                >
                  Surrender Game
                </button>
              </div>
            </div>
          ) : (
            <div className="text-stone-400 font-semibold py-6 text-xl tracking-wider uppercase animate-pulse border border-stone-800 rounded-lg bg-stone-900/50">
              Waiting for {currentPlayer.name}...
            </div>
          )
        )}

        {diceResult && (
          <div className="flex justify-center gap-6 py-4 animate-in fade-in zoom-in duration-500">
            <Dice3D value={diceResult.die1} rolling={isRolling} />
            <Dice3D value={diceResult.die2} rolling={isRolling} />
          </div>
        )}

        {phase === 'RESOLVING_SPACE' && (
          <div className="animate-pulse text-amber-500 font-semibold py-6 text-xl tracking-wider uppercase">
            Caravan is moving...
          </div>
        )}
        
        {phase === 'BUY_PROPERTY_PROMPT' && (
          <div className="text-amber-500 font-semibold py-6 text-xl tracking-wider uppercase">
            Reviewing Territory...
          </div>
        )}

        {phase === 'DRAW_EVENT_CARD' && (
          <div className="text-amber-500 font-semibold py-6 text-xl tracking-wider uppercase">
            Reading scroll...
          </div>
        )}

        {phase === 'TRADE_PROPOSED' && (
          <div className="text-amber-500 font-semibold py-6 text-xl tracking-wider uppercase animate-pulse">
            Diplomatic Emissary dispatched...
          </div>
        )}

        {phase === 'POST_ACTION' && (
          isMyTurn ? (
            <div className="space-y-3 animate-in slide-in-from-bottom-2 pt-4">
              <div className="text-[#daa520] font-medium bg-[#daa520]/10 border border-[#daa520]/30 py-3 rounded text-lg font-sans">Turn duties complete</div>
              <TradeModal />
              <BuildModal />
              {currentPlayer.money < 0 ? (
                <div className="space-y-3 pt-2">
                  <div className="text-red-500 font-bold bg-red-950/50 border border-red-800 p-3 rounded text-center">
                    You are in debt! (₹{currentPlayer.money})<br/>
                    Mortgage territories or trade to raise funds.
                  </div>
                  <Button 
                    onClick={() => {
                      if (window.confirm("Are you sure you want to declare bankruptcy? You will lose all properties and be eliminated from the game.")) {
                        declareBankruptcy();
                      }
                    }} 
                    variant="outline" 
                    className="w-full bg-red-900/50 text-red-200 border-red-700 hover:bg-red-800 hover:text-white py-6 text-lg uppercase tracking-wider transition-colors font-sans"
                  >
                    Declare Bankruptcy
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Button onClick={handleEndTurn} variant="outline" className="w-full text-stone-200 border-stone-600 hover:bg-stone-800 hover:border-amber-700 hover:text-amber-500 py-6 text-lg uppercase tracking-wider transition-colors font-sans">
                    Conclude Turn
                  </Button>
                  <div className="text-center">
                    <button 
                      onClick={() => {
                        if (window.confirm("Are you sure you want to surrender? You will lose all properties and be eliminated from the game.")) {
                          declareBankruptcy();
                        }
                      }}
                      className="text-xs text-stone-600 hover:text-red-500 uppercase tracking-widest transition-colors cursor-pointer"
                    >
                      Surrender Game
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3 animate-in slide-in-from-bottom-2 pt-4">
              <div className="text-stone-400 font-semibold py-6 text-xl tracking-wider uppercase animate-pulse border border-stone-800 rounded-lg bg-stone-900/50">
                Waiting for {currentPlayer.name} to finish...
              </div>
            </div>
          )
        )}
      </div>

      <PropertyModal />
      <EventCardModal />
      <TradeReviewModal />
      <GameOverModal />
    </div>
  );
}
