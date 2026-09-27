import { Castle, Tent, Ship, Compass } from 'lucide-react';

export function TokenIcon({ token, color, className = "w-8 h-8" }: { token: string, color?: string, className?: string }) {
  switch (token) {
    case 'elephant': return <Castle className={className} color={color} strokeWidth={2.5} />;
    case 'camel': return <Tent className={className} color={color} strokeWidth={2.5} />;
    case 'ship': return <Ship className={className} color={color} strokeWidth={2.5} />;
    case 'horse': return <Compass className={className} color={color} strokeWidth={2.5} />;
    default: return <Compass className={className} color={color} strokeWidth={2.5} />;
  }
}
