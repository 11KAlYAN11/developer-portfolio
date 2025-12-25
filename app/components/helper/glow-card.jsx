"use client"

import { useEffect } from 'react';

const GlowCard = ({ children, identifier }) => {
  useEffect(() => {
    const CONTAINER = document.querySelector(`.glow-container-${identifier}`);
    const CARDS = document.querySelectorAll(`.glow-card-${identifier}`);

    const CONFIG = {
      proximity: 40,
      spread: 80,
      blur: 12,
      gap: 32,
      vertical: false,
      opacity: 0,
    };

    let rotation = 0;
    let animationId;

    const ANIMATE = () => {
      rotation = (rotation + 1) % 360;

      // Update cards that are NOT being hovered (fallback animation)
      for (const CARD of CARDS) {
        if (CARD.getAttribute('data-hover') !== 'true') {
          CARD.style.setProperty('--start', rotation);
          CARD.style.setProperty('--active', '0.3'); // Visible but dimmer
          CARD.style.setProperty('--spread', '60');
        }
      }
      animationId = requestAnimationFrame(ANIMATE);
    };

    const UPDATE = (event) => {
      for (const CARD of CARDS) {
        const CARD_BOUNDS = CARD.getBoundingClientRect();

        if (
          event?.x > CARD_BOUNDS.left - CONFIG.proximity &&
          event?.x < CARD_BOUNDS.left + CARD_BOUNDS.width + CONFIG.proximity &&
          event?.y > CARD_BOUNDS.top - CONFIG.proximity &&
          event?.y < CARD_BOUNDS.top + CARD_BOUNDS.height + CONFIG.proximity
        ) {
          CARD.setAttribute('data-hover', 'true');
          CARD.style.setProperty('--active', 1);
          CARD.style.setProperty('--spread', '80');

          const CARD_CENTER = [
            CARD_BOUNDS.left + CARD_BOUNDS.width * 0.5,
            CARD_BOUNDS.top + CARD_BOUNDS.height * 0.5,
          ];

          let ANGLE =
            (Math.atan2(event?.y - CARD_CENTER[1], event?.x - CARD_CENTER[0]) *
              180) /
            Math.PI;

          ANGLE = ANGLE < 0 ? ANGLE + 360 : ANGLE;

          CARD.style.setProperty('--start', ANGLE + 90);
        } else {
          CARD.setAttribute('data-hover', 'false');
          // Fallback to animation loop handling
        }
      }
    };

    document.body.addEventListener('pointermove', UPDATE);
    ANIMATE(); // Start auto-rotation

    const RESTYLE = () => {
      CONTAINER.style.setProperty('--gap', CONFIG.gap);
      CONTAINER.style.setProperty('--blur', CONFIG.blur);
      CONTAINER.style.setProperty('--spread', CONFIG.spread);
      CONTAINER.style.setProperty(
        '--direction',
        CONFIG.vertical ? 'column' : 'row'
      );
    };

    RESTYLE();

    return () => {
      document.body.removeEventListener('pointermove', UPDATE);
      cancelAnimationFrame(animationId);
    };
  }, [identifier]);

  return (
    <div className={`glow-container-${identifier} glow-container`}>
      <article className={`glow-card glow-card-${identifier} h-fit cursor-pointer border border-[var(--border-color)] transition-all duration-300 relative bg-[var(--card-bg)] text-[var(--text-primary)] rounded-xl hover:border-transparent w-full`}>
        <div className="glows"></div>
        {children}
      </article>
    </div>
  );
};

export default GlowCard;
