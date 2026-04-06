import { useRef } from "react";
import { useGLTF } from "@react-three/drei";

const Peonies = (props: any) => {
  const ref = useRef<any>(null);
  const { scene } = useGLTF("/peonies.glb");

  return (
    <group ref={ref} {...props}>
      <primitive object={scene} />
    </group>
  );
};

export default Peonies;

useGLTF.preload("/peonies.glb");