import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useGameStore } from "@/stores/gameStore"
import { useSearchParams } from "next/navigation"
import { Scroll } from "lucide-react"
import { useTranslation } from "@/hooks/useTranslation"

export function EventCardModal() {
  const { phase, currentEventCard, resolveEventCard, players, currentPlayerIndex } = useGameStore();
  const { t, tEvent, tCity } = useTranslation();
  const searchParams = useSearchParams();
  const playerName = searchParams.get('player');
  const player = players[currentPlayerIndex];
  const isMyTurn = !playerName ? !player?.isAI : player?.name === playerName;

  const isOpen = phase === 'DRAW_EVENT_CARD' && currentEventCard !== null;

  if (!currentEventCard) return null;
  if (!isMyTurn && player?.isAI) return null;

  const eventData = currentEventCard ? tEvent(currentEventCard.id) : null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open && isOpen) {
        resolveEventCard();
        setTimeout(() => {
          const currentState = useGameStore.getState();
          if (currentState.phase === 'RESOLVING_SPACE') {
            currentState.resolveSpace();
          }
        }, 800);
      }
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {tCity('Caravan Event')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-8 flex flex-col items-center space-y-6">
          <div className="w-20 h-20 border-2 border-leather rounded-full flex items-center justify-center bg-sandstone text-leather shadow-inner mb-2">
            <Scroll className="w-10 h-10 drop-shadow-sm" />
          </div>
          
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-black text-leather leading-tight px-2">{eventData?.title}</h2>
            <p className="text-lg text-leather/80 italic px-4 font-semibold font-serif">
              &quot;{eventData?.description}&quot;
            </p>
            {currentEventCard.historicalBasis && (
              <div className="mt-4 px-4 py-3 border-l-2 border-leather/50 bg-sandstone-light text-left shadow-inner">
                <p className="text-xs font-bold text-leather uppercase tracking-wider mb-1">Historical Context</p>
                <p className="text-sm italic text-leather/80">{currentEventCard.historicalBasis}</p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          {isMyTurn ? (
            <Button 
              onClick={() => {
                resolveEventCard();
                setTimeout(() => {
                  const currentState = useGameStore.getState();
                  if (currentState.phase === 'RESOLVING_SPACE') {
                    currentState.resolveSpace();
                  }
                }, 800);
              }}
              className="w-full"
            >
              {t('acceptFate')}
            </Button>
          ) : (
            <div className="w-full text-center text-leather font-bold py-3 bg-sandstone-light border-2 border-leather/30 uppercase tracking-wider">
              {player?.name} is reading the scroll...
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
