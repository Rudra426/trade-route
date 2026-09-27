import { useGameStore } from '@/stores/gameStore';
import { useEffect, useRef } from 'react';

export function ActionLog() {
  const logs = useGameStore(state => state.logs);
  const logEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  let currentLogNumber = 0;

  return (
    <div className="mt-6 flex flex-col h-48 bg-sandstone-light rounded-lg border-2 border-leather/30 shadow-inner overflow-hidden font-sans">
      <div className="bg-sandstone border-b-2 border-leather/30 px-4 py-2 font-serif text-sm font-bold text-leather uppercase tracking-widest flex justify-between items-center shadow-sm">
        <span>Chronicle</span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2 text-sm text-leather/90 font-medium">
        {logs.length === 0 ? (
          <div className="text-leather/60 italic text-center py-4 font-serif">No events recorded yet.</div>
        ) : (
          logs.map((log, i) => {
            const isFact = log.startsWith('FACT:');
            const displayText = isFact ? log.replace('FACT:', '').trim() : log;
            
            if (!isFact) {
              currentLogNumber++;
            }
            
            const prefix = isFact ? `[${currentLogNumber}a]` : `[${currentLogNumber}]`;
            
            return (
              <div 
                key={i} 
                className={`border-b border-leather/20 pb-2 last:border-0 ${isFact ? 'pl-4 italic text-leather/70 font-serif' : ''}`}
              >
                <span className="text-terracotta font-bold mr-2">{prefix}</span>
                {displayText}
              </div>
            );
          })
        )}
        <div ref={logEndRef} />
      </div>
    </div>
  );
}
