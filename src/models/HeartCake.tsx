import { useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";

const HeartCake = (props: any) => {
  const ref = useRef<any>(null);
  const { scene } = useGLTF("/happy_bday_cake.glb");

  useEffect(() => {
    scene.traverse((obj: any) => {
      if (!obj.isMesh) return;

      const mats = Array.isArray(obj.material) ? obj.material : [obj.material];

      mats.forEach((mat: any) => {
        if (!mat) return;

        // console.log("mesh:", obj.name, "mat:", mat.name, "type:", mat.type);

        const name = (mat.name || "").toLowerCase();

        // Icing
        if (name.includes("cream")) {
          if (mat.color) mat.color.set("#dcbcc4"); // light pink
          mat.roughness = 0.35;
          mat.metalness = 0.0;
        }

        // Cake base
        if (name.includes("cake")) {
          if (mat.color) mat.color.set("#FFAEBC"); // cake-ish tan
          mat.roughness = 0.8;
          mat.metalness = 0.0;
        }

        // Strawberries
        if (name.includes("strawberry")) {
          if (mat.color) mat.color.set("#dc4a54");
          mat.roughness = 0.5;
        }

        mat.needsUpdate = true;
      });
    });
  }, [scene]);

  return (
    <group ref={ref} {...props}>
      <primitive object={scene} />
    </group>
  );
};

export default HeartCake;

useGLTF.preload("/happy_bday_cake.glb");