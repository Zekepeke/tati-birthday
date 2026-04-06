import { useRef } from "react";
import { useGLTF } from "@react-three/drei";

const Coco = (props: any) => {
  const ref = useRef<any>(null);
  const { scene } = useGLTF("/coco.compressed.glb");

  return (
    <group ref={ref} {...props}>
      <primitive object={scene} />
    </group>
  );
};

export default Coco;

useGLTF.preload("/coco.compressed.glb");