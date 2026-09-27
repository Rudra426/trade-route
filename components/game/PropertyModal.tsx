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

import { useSearchParams } from 'next/navigation'

export function PropertyModal() {
  const { phase, buyProperty, skipProperty, players, currentPlayerIndex } = useGameStore();
  const searchParams = useSearchParams();
  const playerName = searchParams.get('player');
  const player = players[currentPlayerIndex];
  const isMyTurn = !playerName ? !player?.isAI : player?.name === playerName;
  
  if (!player) return null;
  const space = boardSpaces.find(s => s.position === player.position);
  if (!space) return null;

  const isOpen = phase === 'BUY_PROPERTY_PROMPT';

  if (!isMyTurn && player.isAI) return null;

  const canAfford = space.price ? player.money >= space.price : false;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open && isOpen) skipProperty();
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Unclaimed Territory
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4 flex flex-col items-center space-y-4">
          <div className="text-center">
            <h2 className="text-4xl font-black text-terracotta drop-shadow-sm font-serif">{space.name}</h2>
            {space.historicalFact ? (
              <div className="mt-4 px-4 py-3 border-l-2 border-leather/50 bg-sandstone-light text-left shadow-inner">
                <p className="text-xs font-bold text-leather uppercase tracking-wider mb-1">Historical Context</p>
                <p className="text-sm italic text-leather/80 font-serif">
                  {space.historicalFact}
                </p>
              </div>
            ) : (
              <p className="text-lg italic text-leather/80 mt-2 font-serif">A vital stop on the trade route.</p>
            )}
          </div>
          
          <div className="w-full bg-sandstone-light p-4 border border-leather/30 shadow-[inset_0_0_10px_rgba(92,58,33,0.1)] text-center space-y-2 mt-2">
            <div className="flex justify-between border-b border-leather/20 pb-2">
              <span className="font-bold uppercase tracking-wider text-leather text-sm mt-1">Purchase Price</span>
              <span className="font-black text-xl text-terracotta font-serif">₹{space.price}</span>
            </div>
            {space.rent && (
              <div className="flex justify-between pt-2">
                <span className="font-bold uppercase tracking-wider text-leather text-sm mt-1">Base Toll</span>
                <span className="font-black text-lg text-leather font-serif">₹{space.rent[0]}</span>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="sm:justify-between w-full">
          {isMyTurn ? (
            <div className="flex w-full gap-3">
              <Button 
                variant="outline" 
                onClick={skipProperty}
                className="flex-1"
              >
                Decline
              </Button>
              <Button 
                onClick={buyProperty}
                disabled={!canAfford}
                className="flex-1"
              >
                {canAfford ? 'Acquire Title' : 'Cannot Afford'}
              </Button>
            </div>
          ) : (
            <div className="w-full text-center text-leather font-bold py-3 bg-sandstone-light border-2 border-leather/30 uppercase tracking-wider">
              Waiting for {player.name}&apos;s decision...
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
