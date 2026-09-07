import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';
import * as THREE from 'three';
import { Geometry, Base, Subtraction } from '@react-three/csg';
import { extend } from '@react-three/fiber';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry';

import { ViewerContainer, OverlayText } from './Tank3DViewer.styled';

// Реєструємо геометрію з круглими краями в екосистемі React
extend({ RoundedBoxGeometry });

// Матеріал під реалістичний алюміній
const tankMaterial = new THREE.MeshStandardMaterial({
  color: '#94a3b8',
  metalness: 0.7,
  roughness: 0.25,
});

const TankShape = ({ model }) => {
  const L = (model.dim_l || 1000) / 1000;
  const W = (model.dim_w || 600) / 1000;
  const H = (model.dim_h || 600) / 1000;

  const stepL = (model.step_l || 0) / 1000;
  const stepW = (model.step_w || 0) / 1000;
  const stepH = (model.step_h || 0) / 1000;

  const shapeType = model.shape_type || 'rectangular';

  // Радіус зкруглення кутів бака (5 см)
  const radius = 0.05;

  // 1. ЦИЛІНДРИЧНИЙ БАК
  if (shapeType === 'cylinder') {
    return (
      <mesh
        material={tankMaterial}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[W / 2, W / 2, L, 64]} />
      </mesh>
    );
  }

  // 2. БАК ЗІ СХОДИНКОЮ (ВДАВЛЕНА НІША / КИШЕНЯ)
  if (shapeType === 'step_1' || shapeType === 'step_2') {
    // --- ПРИВ'ЯЗКА ДАНИХ З БАЗИ ДО 3D ОСЕЙ ---

    // Вісь X: Довжина вирізу вздовж фасаду бака (зліва направо)
    // ФАКТ: У базі ця цифра лежить у полі step_h
    const pocketX = stepH || L * 0.3;

    // Вісь Y: Висота вирізу (знизу вверх)
    // ФАКТ: У базі ця цифра лежить у полі step_w
    const pocketY = stepW || (shapeType === 'step_2' ? H * 0.75 : H * 0.45);

    // Вісь Z: Глибина вирізу (наскільки він втиснутий всередину бака)
    // ФАКТ: У базі ця цифра лежить у полі step_l
    const pocketZ = stepL || W * 0.25;

    // --- РОЗТАШУВАННЯ ВИРІЗУ ---
    const posX = -(L / 2) + pocketX / 2 + 0.08; // Зсув вліво + бортик 8 см
    const posY = 0; // По центру висоти
    const posZ = W / 2 - pocketZ / 2 + 0.05; // Зсув на лицьову панель

    return (
      <mesh material={tankMaterial} castShadow receiveShadow>
        <Geometry>
          <Base>
            <roundedBoxGeometry args={[L, H, W, 4, radius]} />
          </Base>
          <Subtraction position={[posX, posY, posZ]}>
            <roundedBoxGeometry
              args={[pocketX, pocketY, pocketZ + 0.1, 4, 0.03]}
            />
          </Subtraction>
        </Geometry>
      </mesh>
    );
  }
  // 3. ЗВИЧАЙНИЙ ПРЯМОКУТНИЙ БАК (з круглими краями)
  return (
    <mesh material={tankMaterial} castShadow receiveShadow>
      {/* 4 - це кількість сегментів на кутах для плавності */}
      <roundedBoxGeometry args={[L, H, W, 4, radius]} />
    </mesh>
  );
};

export const Tank3DViewer = ({ tankModel }) => {
  if (!tankModel) return null;

  return (
    <ViewerContainer>
      <Canvas shadows camera={{ position: [2, 1.5, 2], fov: 45 }}>
        {/* Stage автоматично виставляє студійне світло і тіні */}
        <Stage environment="city" intensity={0.8}>
          <TankShape model={tankModel} />
        </Stage>
        <OrbitControls autoRotate autoRotateSpeed={1} enableZoom={true} />
      </Canvas>

      {tankModel.shape_type !== 'custom' && (
        <OverlayText>
          {tankModel.dim_l}x{tankModel.dim_w}x
          {tankModel.dim_h || tankModel.dim_w} мм
        </OverlayText>
      )}
    </ViewerContainer>
  );
};
