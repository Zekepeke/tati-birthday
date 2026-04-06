import { useRef } from "react";
import { useGLTF } from "@react-three/drei";

const Peter = (props: any) => {
  const ref = useRef<any>(null);
  const { scene } = useGLTF("/peter.compressed.glb");

  return (
    <group ref={ref} {...props}>
      <primitive object={scene} />
    </group>
  );
};

export default Peter;

useGLTF.preload("/peter.compressed.glb");