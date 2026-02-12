'use client';

import React, { useEffect, useRef, ReactNode } from 'react';
import { useIsMobile } from '@/hooks/use-isMobile';

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  customSize?: boolean;
}

const GlowCard: React.FC<GlowCardProps> = ({
  children,
  className = '',
  customSize = true,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Desktop pointer tracking only
  useEffect(() => {
    if (isMobile) return;

    const syncPointer = (e: PointerEvent) => {
      const { clientX: x, clientY: y } = e;

      if (cardRef.current) {
        cardRef.current.style.setProperty('--x', x.toFixed(2));
        cardRef.current.style.setProperty('--xp', (x / window.innerWidth).toFixed(2));
        cardRef.current.style.setProperty('--y', y.toFixed(2));
        cardRef.current.style.setProperty('--yp', (y / window.innerHeight).toFixed(2));
      }
    };

    document.addEventListener('pointermove', syncPointer);
    return () => document.removeEventListener('pointermove', syncPointer);
  }, [isMobile]);
  type CSSVars = React.CSSProperties & Record<string, string | number>;

  const getInlineStyles = (): CSSVars => {
    const baseStyles: CSSVars = {
      '--base': '217',
      '--spread': '30',
      '--radius': '16',
      '--border': '1',
      '--backdrop': 'hsl(217 30% 12% / 0.6)',
      '--backup-border': 'hsl(217 30% 25% / 0.3)',
      '--size': '250',
      '--outer': '0.4',
      '--saturation': '70',
      '--lightness': '55',
      '--bg-spot-opacity': isMobile ? '0.15' : '0.08',
      '--border-spot-opacity': '0.5',
      '--border-light-opacity': '0.3',
      '--border-size': 'calc(var(--border, 1) * 1px)',
      '--spotlight-size': 'calc(var(--size, 250) * 1px)',
      '--hue': 'calc(var(--base) + (var(--xp, 0) * var(--spread, 0)))',
      backgroundColor: 'var(--backdrop, transparent)',
      backgroundSize:
        'calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)))',
      backgroundPosition: '50% 50%',
      border: 'var(--border-size) solid var(--backup-border)',
      position: 'relative',
      borderRadius: 'calc(var(--radius) * 1px)',
      overflow: 'hidden',
    };

    if (isMobile) {
      return {
        ...baseStyles,
        backgroundImage: `radial-gradient(
          220px 220px at 50% 50%,
          hsl(217 70% 55% / var(--bg-spot-opacity)),
          transparent
        )`,
      };
    }

    return {
      ...baseStyles,
      backgroundAttachment: 'fixed',
      backgroundImage: `radial-gradient(
        var(--spotlight-size) var(--spotlight-size) at
        calc(var(--x, 0) * 1px)
        calc(var(--y, 0) * 1px),
        hsl(var(--hue, 217)
        calc(var(--saturation, 70) * 1%)
        calc(var(--lightness, 55) * 1%)
        / var(--bg-spot-opacity, 0.08)),
        transparent
      )`,
    };
  };

  const beforeAfterStyles = `
    [data-glow]::before,
    [data-glow]::after {
      pointer-events: none;
      content: "";
      position: absolute;
      inset: calc(var(--border-size) * -1);
      border: var(--border-size) solid transparent;
      border-radius: calc(var(--radius) * 1px);
      background-size: calc(100% + (2 * var(--border-size)))
                      calc(100% + (2 * var(--border-size)));
      background-repeat: no-repeat;
      background-position: 50% 50%;
      mask: linear-gradient(transparent, transparent),
            linear-gradient(white, white);
      mask-clip: padding-box, border-box;
      mask-composite: intersect;
    }

    /* Disable animated border spotlight on mobile */
    @media (hover: none) {
      [data-glow]::before,
      [data-glow]::after {
        display: none;
      }
    }

    [data-glow]::before {
      background-image: radial-gradient(
        calc(var(--spotlight-size) * 0.75)
        calc(var(--spotlight-size) * 0.75) at
        calc(var(--x, 0) * 1px)
        calc(var(--y, 0) * 1px),
        hsl(var(--hue, 217)
        calc(var(--saturation, 70) * 1%)
        calc(var(--lightness, 50) * 1%)
        / var(--border-spot-opacity, 0.5)),
        transparent 100%
      );
      filter: brightness(1.5);
      background-attachment: fixed;
    }

    [data-glow]::after {
      background-image: radial-gradient(
        calc(var(--spotlight-size) * 0.5)
        calc(var(--spotlight-size) * 0.5) at
        calc(var(--x, 0) * 1px)
        calc(var(--y, 0) * 1px),
        hsl(217 80% 80% /
        var(--border-light-opacity, 0.3)),
        transparent 100%
      );
      background-attachment: fixed;
    }
  `;

  return (
    <>
      <style>{beforeAfterStyles}</style>
      <div
        ref={cardRef}
        data-glow
        className={`rounded-2xl ${className}`}
        style={getInlineStyles() as React.CSSProperties}
      >
        {children}
      </div>
    </>
  );
};

export { GlowCard };
