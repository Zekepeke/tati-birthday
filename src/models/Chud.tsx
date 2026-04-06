import { useRef } from "react";
import { useGLTF } from "@react-three/drei";

const Chud = (props: any) => {
  const ref = useRef<any>(null);
  const { scene } = useGLTF("/chud.glb");



  return (
    <group ref={ref} {...props}>
      <primitive object={scene} />
    </group>
  );
};

export default Chud;

useGLTF.preload("/chud.glb");