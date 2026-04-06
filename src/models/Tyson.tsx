import { useRef } from "react";
import { useGLTF } from "@react-three/drei";

const Tyson = (props: any) => {
  const ref = useRef<any>(null);
  const { scene } = useGLTF("/tyson.glb");

  return (
    <group ref={ref} {...props}>
      <primitive object={scene} />
    </group>
  );
};

export default Tyson;

useGLTF.preload("/tyson.glb");