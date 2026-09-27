import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useGameStore } from "@/stores/gameStore"
import { boardSpaces } from "@/data/boardSpaces"
import { placeFacts } from "@/data/placeFacts"
import { useRouter } from "next/navigation"

export function GameOverModal() {
  const { phase, players, round, maxRounds, targetWealth, winCondition } = useGameStore();
  const router = useRouter();
  const isOpen = phase === 'GAME_OVER';

  if (!isOpen) return null;

  // Find winner
  const activePlayers = players.filter(p => !p.isBankrupt);
  const sortedPlayers = [...players].sort((a, b) => b.money - a.money);
  // If trade dominance, the one who triggered it is winner (we assume the current player or the wealthiest)
  // Actually, if it's trade dominance, it's the one with 3 monopolies.
  let winner = sortedPlayers[0];
  let winReason = `Target wealth of ₹${targetWealth} reached!`;

  if (winCondition === 'TRADE_DOMINANCE') {
    winner = activePlayers.find(p => {
      const colorGroups = Array.from(new Set(boardSpaces.map(s => s.colorGroup).filter(Boolean)));
      let completeMonopolies = 0;
      for (const group of colorGroups) {
        const groupSpaces = boardSpaces.filter(s => s.colorGroup === group);
        const ownsAll = groupSpaces.every(s => p.properties.includes(s.id));
        if (ownsAll) completeMonopolies++;
      }
      return completeMonopolies >= 3;
    }) || sortedPlayers[0];
    winReason = "Trade Dominance Achieved";
  } else if (activePlayers.length === 1) {
    winReason = "Sole Survivor (Bankruptcy)";
  } else if (round > maxRounds) {
    winReason = `Max rounds (${maxRounds}) completed!`;
  }

  const winnerProperties = winner.properties
    .map(id => boardSpaces.find(s => s.id === id))
    .filter((s): s is NonNullable<typeof s> => s !== undefined);
  
  const top3 = [...winnerProperties]
    .sort((a, b) => (b.price || 0) - (a.price || 0))
    .slice(0, 3);

  const controlledRegions = Array.from(new Set(winnerProperties.map(s => s.region).filter(Boolean)));

  let narrative = `${winner.name} dominated the ancient markets for ${round} turns, outlasting ${players.length - 1} rival merchants.`;
  if (winCondition === 'TRADE_DOMINANCE' && winReason === "Trade Dominance Achieved") {
    narrative = `${winner.name} seized absolute control of the trade routes over ${round} turns, securing unbreakable monopolies to crush ${players.length - 1} rivals.`;
  } else if (activePlayers.length === 1) {
    narrative = `${winner.name} aggressively bankrupted all ${players.length - 1} rivals over ${round} grueling turns to stand alone as the supreme merchant.`;
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="bg-sandstone border-[12px] border-leather font-serif text-ink sm:max-w-3xl w-[90vw] aspect-[4/3] flex flex-col p-0 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] outline-none rounded-none">
        
        {/* Inner Border to simulate scroll */}
        <div className="flex-1 m-2 border-2 border-leather p-6 flex flex-col relative bg-sandstone-light">
          {/* Subtle background texture */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #5c3a21 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
          
          <div className="relative z-10 flex-1 flex flex-col h-full">
            <div className="text-center mb-6 border-b-2 border-leather/30 pb-6">
              <h3 className="text-lg font-bold tracking-[0.3em] uppercase text-leather/80 mb-2">Chronicle of Antiquity</h3>
              <h1 className="text-4xl sm:text-5xl font-black text-leather uppercase tracking-widest leading-tight">
                {winner.name}
              </h1>
              <p className="text-terracotta font-bold tracking-widest uppercase text-sm mt-2">
                Victory via {winReason}
              </p>
            </div>

            <div className="text-center px-4 sm:px-12 mb-8">
              <p className="text-lg sm:text-xl italic text-leather/90 font-medium leading-relaxed">
                &quot;{narrative}&quot;
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
              <div className="md:col-span-1 bg-sandstone border border-leather/30 p-4 flex flex-col justify-center text-center shadow-inner">
                <h4 className="font-bold text-leather uppercase text-xs tracking-widest mb-4 border-b border-leather/30 pb-2">Empire Stats</h4>
                <div className="space-y-3">
                  <div>
                    <div className="text-2xl font-black text-leather">{winner.money}</div>
                    <div className="text-xs uppercase text-leather/80">Final Gold</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-leather">{winnerProperties.length}</div>
                    <div className="text-xs uppercase text-leather/80">Territories Owned</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-leather">{controlledRegions.length}</div>
                    <div className="text-xs uppercase text-leather/80">Regions Influenced</div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 flex flex-col">
                <h4 className="font-bold text-leather uppercase text-xs tracking-widest mb-2 border-b border-leather/30 pb-1">Crown Jewels of the Empire</h4>
                <div className="space-y-2 overflow-y-auto pr-2 flex-1">
                  {top3.map((prop, idx) => (
                    <div key={prop.id} className="bg-sandstone-light border border-leather/30 p-3 shadow-sm">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-leather text-sm uppercase flex items-center gap-2">
                          <span className="text-terracotta">#{idx + 1}</span> {prop.name}
                        </span>
                        <span className="text-xs font-bold text-leather/80">Value: ₹{prop.price}</span>
                      </div>
                      <p className="text-xs italic text-leather/90 leading-tight">
                        {placeFacts[prop.name] ? `${placeFacts[prop.name].era} — ${placeFacts[prop.name].fact}` : (prop.historicalFact || "A vital stop on the trade route.")}
                      </p>
                    </div>
                  ))}
                  {top3.length === 0 && (
                    <div className="text-sm italic text-leather/80 text-center mt-4">No territories conquered. A victory of pure liquid wealth!</div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-between items-end border-t-2 border-leather/30 pt-4">
              <div className="text-xs font-bold text-leather/80 uppercase tracking-widest">
                Trade Routes: Cities of Antiquity
              </div>
              <Button 
                onClick={() => {
                  localStorage.removeItem('trade-routes-save');
                  router.push('/');
                }}
              >
                Conclude History
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
