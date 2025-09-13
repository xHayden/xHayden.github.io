import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { useSpring, animated, config } from '@react-spring/web';

const DonutScrollAnimation = () => {
  const svgRef = useRef(null);
  const motionPathRef = useRef(null);
  const [pathLength, setPathLength] = useState(0);

  const viewBoxSize = 200;
  const center = viewBoxSize / 2;
  const radius = 70;
  const strokeWidth = 15;
  const ballRadius = 30;
  const gapAngle = 0.0001; // Small angle in radians to create the gap at the bottom (pi)

  // Calculate start and end points for the arc paths
  // We start slightly clockwise from the bottom (PI + gapAngle)
  // We end slightly counter-clockwise from the bottom (PI - gapAngle, but need to go ~2PI)
  const startAngle = Math.PI + gapAngle;
  const endAngle = Math.PI - gapAngle + Math.PI * 2; // Go the long way around (almost 2PI)

  const calculatePoint = (angle) => ({
    x: center + radius * Math.cos(angle),
    y: center + radius * Math.sin(angle),
  });

  const startPoint = calculatePoint(startAngle);
  const endPoint = calculatePoint(endAngle);

  // SVG path 'd' attribute for an arc
  // A rx ry x-axis-rotation large-arc-flag sweep-flag x y
  // large-arc-flag=1 because we go > 180 degrees
  // sweep-flag=1 for clockwise direction
  const arcPathData = `M ${startPoint.x} ${startPoint.y} A ${radius} ${radius} 0 1 1 ${endPoint.x} ${endPoint.y}`;
  useLayoutEffect(() => {
    if (motionPathRef.current) {
      const length = motionPathRef.current.getTotalLength();
      setPathLength(Number.isFinite(length) ? length : 0);
    }
  }, [arcPathData]);

  const [{ scrollProgress }, api] = useSpring(() => ({
    scrollProgress: 0,
    config: config.molasses, // Or config.stiff for less easing
  }));

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const denominator = scrollHeight > 0 ? scrollHeight : 1;
      const ratio = scrollTop / denominator;
      const currentScroll = Math.max(0, Math.min(1, Number.isFinite(ratio) ? ratio : 0));

      api.start({ scrollProgress: currentScroll });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [api]);

  const ballPosition = scrollProgress.to((progress) => {
    const p = Number.isFinite(progress) ? progress : 0;
    if (!motionPathRef.current || !Number.isFinite(pathLength) || pathLength <= 0) {
      return `translate(${startPoint.x}px, ${startPoint.y}px)`;
    }
    const clampedProgress = Math.max(0, Math.min(1, p));
    const pointOnPath = motionPathRef.current.getPointAtLength(
      clampedProgress * pathLength
    );
    return `translate(${pointOnPath.x}px, ${pointOnPath.y}px)`;
  });

  return (
    <div className="text-center">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
        className='w-8 h-8'
      >
        <defs>
          {/* Invisible path for motion calculation */}
          <path
            id="motionPath"
            ref={motionPathRef}
            d={arcPathData}
            fill="none"
            stroke="none" // Make it invisible
          />
        </defs>

        {/* Visible Donut Path */}
        <path
          d={arcPathData}
          fill="none"
          stroke="black"
          strokeWidth={strokeWidth}
          strokeLinecap="butt" // Creates straight edges at the break
        />

        <animated.circle
          r={ballRadius}
          fill="white"
          style={{ transform: ballPosition, mixBlendMode: "difference" }}

        />
      </svg>
    </div>
  );
};

export default DonutScrollAnimation;