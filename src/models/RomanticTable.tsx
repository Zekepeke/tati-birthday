import { useEffect, useMemo, useRef } from "react";
import { useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";

const RomanticTable = (props: any) => {
  const ref = useRef<any>(null);
  const { scene } = useGLTF("/round_table.glb");

  const [
    bodyAlbedo,
    clothAlbedo,
  ] = useTexture([
    "/textures/round_table_body_albedo.jpeg",
    "/textures/round_table_cloth_albedo.jpeg",
  ]);

  // Texture housekeeping
  useMemo(() => {
    bodyAlbedo.colorSpace = THREE.SRGBColorSpace;
    clothAlbedo.colorSpace = THREE.SRGBColorSpace;


    // Optional: reduce blur if you want crisper textures
    [bodyAlbedo, clothAlbedo].forEach((t) => {
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.flipY = false; // usually correct for glTF-loaded textures
      t.needsUpdate = true;
    });
  }, [bodyAlbedo, clothAlbedo]);

  useEffect(() => {
    scene.traverse((obj: any) => {
      if (!obj.isMesh) return;

      const mats = Array.isArray(obj.material) ? obj.material : [obj.material];

      mats.forEach((mat: any) => {
        if (!mat) return;

        const name = (mat.name || "").toLowerCase();

        // (0) Body
        // (1) Cloth
        const isBody = name.includes("body");
        const isCloth = name.includes("cloth");

        if (isBody) {
          // keep the existing material if it's standard, otherwise replace
          const m =
            mat.isMeshStandardMaterial || mat.isMeshPhysicalMaterial
              ? mat
              : new THREE.MeshStandardMaterial();

          // base color + texture
          if (m.color) m.color.set("#2b0a0a"); // deep wood tint
          m.map = bodyAlbedo;
          m.roughness = 0.85;
          m.metalness = 0.05;

          obj.material = m;
          m.needsUpdate = true;
        }

        if (isCloth) {
          const m =
            mat.isMeshStandardMaterial || mat.isMeshPhysicalMaterial
              ? mat
              : new THREE.MeshStandardMaterial();

          // cloth tint + texture
          if (m.color) m.color.set("#ffffff"); // keep cloth color clean; texture can add pattern
          m.map = clothAlbedo;
          m.roughness = 1.0;
          m.metalness = 0.0;

          obj.material = m;
          m.needsUpdate = true;
        }

        // If some meshes have unnamed materials, you can optionally fall back:
        // else keep original mat
      });

      obj.castShadow = true;
      obj.receiveShadow = true;
    });
  }, [scene, bodyAlbedo, clothAlbedo]);

  return (
    <group ref={ref} {...props}>
      <primitive object={scene} />
    </group>
  );
};

export default RomanticTable;

useGLTF.preload("/round_table.glb");