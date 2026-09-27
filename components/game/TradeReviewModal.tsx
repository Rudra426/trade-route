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
import { useSearchParams } from "next/navigation"

export function TradeReviewModal() {
  const { phase, currentTrade, players, acceptTrade, declineTrade } = useGameStore();
  const searchParams = useSearchParams();
  const playerName = searchParams.get('player');
  const isOpen = phase === 'TRADE_PROPOSED' && currentTrade !== null;

  if (!currentTrade || !isOpen) return null;

  const fromPlayer = players.find(p => p.id === currentTrade.fromPlayerId);
  const toPlayer = players.find(p => p.id === currentTrade.toPlayerId);

  if (!fromPlayer || !toPlayer) return null;

  const isTargetPlayer = !playerName ? !toPlayer.isAI : toPlayer.name === playerName;
  const isProposingPlayer = !playerName ? !fromPlayer.isAI : fromPlayer.name === playerName;

  if (isProposingPlayer && toPlayer.isAI) return null;

  const getPropNames = (ids: string[]) => {
    return ids.map(id => boardSpaces.find(s => s.id === id)?.name).join(', ');
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open && isOpen) declineTrade();
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Diplomatic Emissary Arrives
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-2 space-y-4">
          <div className="text-center font-bold text-xl text-leather">
            {toPlayer.name}, {fromPlayer.name} has proposed a trade!
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Left Side: They offer */}
            <div className="bg-sandstone-light p-4 border border-leather/30 shadow-inner space-y-4">
              <h3 className="font-bold text-center border-b border-leather/30 pb-2 text-terracotta uppercase tracking-widest font-serif">{fromPlayer.name} Offers</h3>
              <div className="text-center space-y-2">
                {currentTrade.offeredMoney > 0 && <div className="font-black text-lg text-leather">₹{currentTrade.offeredMoney} Gold</div>}
                {currentTrade.offeredProperties.length > 0 && (
                  <div className="text-sm text-leather/90">
                    <strong>Territories:</strong> <br/> {getPropNames(currentTrade.offeredProperties)}
                  </div>
                )}
                {currentTrade.offeredMoney === 0 && currentTrade.offeredProperties.length === 0 && <div className="italic text-leather/60 font-serif">Nothing</div>}
              </div>
            </div>

            {/* Right Side: They request */}
            <div className="bg-sandstone-light p-4 border border-leather/30 shadow-inner space-y-4">
              <h3 className="font-bold text-center border-b border-leather/30 pb-2 text-blue-900 uppercase tracking-widest font-serif">{fromPlayer.name} Requests</h3>
              <div className="text-center space-y-2">
                {currentTrade.requestedMoney > 0 && <div className="font-black text-lg text-leather">₹{currentTrade.requestedMoney} Gold</div>}
                {currentTrade.requestedProperties.length > 0 && (
                  <div className="text-sm text-leather/90">
                    <strong>Territories:</strong> <br/> {getPropNames(currentTrade.requestedProperties)}
                  </div>
                )}
                {currentTrade.requestedMoney === 0 && currentTrade.requestedProperties.length === 0 && <div className="italic text-leather/60 font-serif">Nothing</div>}
              </div>
            </div>
          </div>

          <DialogFooter className="sm:justify-between w-full">
            {isTargetPlayer ? (
              <div className="flex w-full gap-3">
                <Button 
                  variant="outline" 
                  onClick={declineTrade}
                  className="flex-1"
                >
                  Refuse Terms
                </Button>
                <Button 
                  onClick={acceptTrade}
                  className="flex-1"
                >
                  Sign Treaty
                </Button>
              </div>
            ) : isProposingPlayer ? (
              <div className="w-full text-center text-leather font-bold py-3 bg-sandstone-light border-2 border-leather/30 uppercase tracking-wider">
                Waiting for {toPlayer.name} to respond...
              </div>
            ) : (
              <div className="w-full text-center text-leather font-bold py-3 bg-sandstone-light border-2 border-leather/30 uppercase tracking-wider">
                {toPlayer.name} is reviewing trade terms...
              </div>
            )}
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
