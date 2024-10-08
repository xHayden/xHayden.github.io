import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { Text } from "@react-three/drei";
import { useMemo } from "react";
import { a, useSpring } from "@react-spring/three";
import fontJson from "../../assets/josefin_sans.json";

const TextEffect = ({ word }) => {
  const points = useMemo(() => {
    const font = new FontLoader().parse(fontJson);
    const shapes = font.generateShapes(word, 10);

    const sampledPoints = [];
    shapes.forEach((shape) => {
      const shapePoints = shape.getSpacedPoints(100); // Adjust the number for more/fewer points
      sampledPoints.push(...shapePoints);
    });
    return sampledPoints;
  }, [word]);

  return (
    <>
      {points.map((point, index) => (
        <SmallCharacter
          key={index}
          position={[point.x, point.y, 0]}
          char={getRandomChar()}
          index={index}
        />
      ))}
    </>
  );
};

const SmallCharacter = ({ position, char, index }) => {
  const props = useSpring({
    from: { scale: 0 },
    to: { scale: 1 },
    delay: index * 10,
    config: { mass: 1, tension: 170, friction: 26 },
    frameloop: "demand",
  });

  return (
    <a.group position={position} scale={props.scale}>
      <Text fontSize={0.5} color="#000">
        {char}
      </Text>
    </a.group>
  );
};

const getRandomChar = () => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return chars.charAt(Math.floor(Math.random() * chars.length));
};

export default TextEffect;
