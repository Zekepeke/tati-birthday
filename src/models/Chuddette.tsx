import { useRef } from "react";
import { useGLTF } from "@react-three/drei";

const Chuddette = (props: any) => {
  const ref = useRef<any>(null);
  const { scene } = useGLTF("/frog.glb");



  return (
    <group ref={ref} {...props}>
      <primitive object={scene} />
    </group>
  );
};

export default Chuddette;

useGLTF.preload("/frog.glb");