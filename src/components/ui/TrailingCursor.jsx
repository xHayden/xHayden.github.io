import { useSpring, animated } from '@react-spring/web';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export default function TrailingCursor() {
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const cursorSpring = useSpring({
    left: coords.x,
    top: coords.y,
    config: { mass: 1, tension: 280, friction: 30 },
  });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setCoords({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const cursor = (
    <animated.div
      style={{
        position: 'fixed',
        width: '40px',
        height: '40px',
        background: 'white',
        borderRadius: '50%',
        pointerEvents: 'none',
        mixBlendMode: 'difference',
        transform: 'translate(-50%, -50%)',
        zIndex: 999999,
        ...cursorSpring,
      }}
    />
  );

  // Portal the cursor into #cursor-root
  return createPortal(cursor, document.getElementById('cursor-root'));
}
