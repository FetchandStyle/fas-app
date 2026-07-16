'use client';

const FLOOR_SIZE = 10;
const FLOOR_HALF = FLOOR_SIZE / 2;
const WALL_H = 3;

/** Styled living-room shell for the trade-show demo (no untextured scan data). */
export default function DemoRoom() {
  return (
    <group>
      {/* Hardwood floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[FLOOR_SIZE, FLOOR_SIZE]} />
        <meshStandardMaterial color="#c9a66b" roughness={0.82} metalness={0.02} />
      </mesh>

      {/* Plank lines */}
      {Array.from({ length: 12 }, (_, i) => {
        const z = -FLOOR_HALF + (i + 0.5) * (FLOOR_SIZE / 12);
        return (
          <mesh key={`plank-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, z]}>
            <planeGeometry args={[FLOOR_SIZE, 0.04]} />
            <meshStandardMaterial color="#b8925a" roughness={0.9} />
          </mesh>
        );
      })}

      {/* Back wall */}
      <mesh position={[0, WALL_H / 2, -FLOOR_HALF]} receiveShadow castShadow>
        <boxGeometry args={[FLOOR_SIZE, WALL_H, 0.14]} />
        <meshStandardMaterial color="#f3efe6" roughness={0.92} />
      </mesh>

      {/* Left wall */}
      <mesh position={[-FLOOR_HALF, WALL_H / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[FLOOR_SIZE, WALL_H, 0.14]} />
        <meshStandardMaterial color="#ebe6dc" roughness={0.92} />
      </mesh>

      {/* Right wall with window */}
      <group position={[FLOOR_HALF, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh position={[0, WALL_H / 2, 0]} receiveShadow castShadow>
          <boxGeometry args={[FLOOR_SIZE, WALL_H, 0.14]} />
          <meshStandardMaterial color="#f0ebe2" roughness={0.92} />
        </mesh>
        {/* Window frame */}
        <mesh position={[0, 1.65, 0.08]}>
          <boxGeometry args={[2.6, 1.5, 0.08]} />
          <meshStandardMaterial color="#8b7355" roughness={0.7} />
        </mesh>
        <mesh position={[0, 1.65, 0.1]}>
          <boxGeometry args={[2.2, 1.1, 0.02]} />
          <meshStandardMaterial
            color="#b8daf0"
            roughness={0.1}
            metalness={0.05}
            transparent
            opacity={0.55}
          />
        </mesh>
      </group>

      {/* Baseboards */}
      <mesh position={[0, 0.08, -FLOOR_HALF + 0.08]}>
        <boxGeometry args={[FLOOR_SIZE, 0.16, 0.06]} />
        <meshStandardMaterial color="#f8f6f2" roughness={0.85} />
      </mesh>
      <mesh position={[-FLOOR_HALF + 0.08, 0.08, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[FLOOR_SIZE, 0.16, 0.06]} />
        <meshStandardMaterial color="#f8f6f2" roughness={0.85} />
      </mesh>

      {/* Crown molding hint on back wall */}
      <mesh position={[0, WALL_H - 0.06, -FLOOR_HALF + 0.1]}>
        <boxGeometry args={[FLOOR_SIZE, 0.1, 0.08]} />
        <meshStandardMaterial color="#ffffff" roughness={0.8} />
      </mesh>
    </group>
  );
}
