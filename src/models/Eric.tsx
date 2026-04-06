import { useRef } from "react";
import { useGLTF } from "@react-three/drei";

const Eric = (props: any) => {
  const ref = useRef<any>(null);
  const { scene } = useGLTF("/birthday-eric.glb");



  return (
    <group ref={ref} {...props}>
      <primitive object={scene} />
    </group>
  );
};

export default Eric;

useGLTF.preload("/birthday-eric.glb");