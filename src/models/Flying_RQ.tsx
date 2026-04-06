import { useRef } from "react";
import { useGLTF } from "@react-three/drei";

const Flying_RQ = (props: any) => {
  const ref = useRef<any>(null);
  const { scene } = useGLTF("/fly_RQ.compressed.glb");

  return (
    <group ref={ref} {...props}>
      <primitive object={scene} />
    </group>
  );
};

export default Flying_RQ;

useGLTF.preload("/fly_RQ.compressed.glb");