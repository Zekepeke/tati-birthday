import {useRef } from "react";
import { useGLTF } from "@react-three/drei";

const Zuki = (props: any) => {
  const ref = useRef<any>(null);
  const { scene } = useGLTF("/zuki_laying.glb");



  return (
    <group ref={ref} {...props}>
      <primitive object={scene} />
    </group>
  );
};

export default Zuki;

useGLTF.preload("/zuki_laying.glb");