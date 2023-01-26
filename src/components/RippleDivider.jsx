import { useState, useRef } from 'react';
import { MeshDistortMaterial, GradientTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

export default function RippleDivider(props) {
    const ref = useRef();
    const [hovered, setHovered] = useState(false);
    useFrame(() => {
      ref.current.distort = .35; // THREE.MathUtils.lerp(ref.current.distort, 0.4, 0.1);
    })
    return (
      <mesh onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)} scale={[10, 3, 10]}>
        <planeGeometry args={[10, 1.5, 256, 256]} />
        <MeshDistortMaterial ref={ref} speed={6}>
          <GradientTexture stops={[0, 0.8, 1]} colors={['#ea960a', '#fde68a', '#a8dadc']} size={100} />
        </MeshDistortMaterial>
      </mesh>
    );
}