import { useRef } from "react";
import { useGLTF } from "@react-three/drei";

const Kuromi = (props: any) => {
  const ref = useRef<any>(null);
  const { scene } = useGLTF("/kuromi.glb");



  return (
    <group ref={ref} {...props}>
      <primitive object={scene} />
    </group>
  );
};

export default Kuromi;

useGLTF.preload("/kuromi.glb");