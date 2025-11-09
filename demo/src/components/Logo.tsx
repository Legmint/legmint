'use client';

import Image from 'next/image';

interface LogoProps {
  /** If true, shows only the icon without wordmark */
  compact?: boolean;
  /** Custom width for the logo icon */
  size?: number;
  /** Custom className for additional styling */
  className?: string;
  /** Show animation on mount */
  animated?: boolean;
}

export default function Logo({
  compact = false,
  size = 40,
  className = '',
  animated = false
}: LogoProps) {
  const containerClass = `flex items-center space-x-2 select-none ${animated ? 'logo-fade-in' : ''} ${className}`;

  return (
    <div className={containerClass}>
      {/* Logo Icon */}
      <Image
        src="/logo.svg"
        alt="Legmint logo"
        width={size}
        height={size}
        priority
        className="flex-shrink-0"
      />

      {/* Wordmark */}
      {!compact && (
        <span className="font-bold text-2xl tracking-tight text-navy-500">
          <span className="text-mint-400">Leg</span>mint
        </span>
      )}

      <style jsx>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .logo-fade-in {
          animation: fadeInScale 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
