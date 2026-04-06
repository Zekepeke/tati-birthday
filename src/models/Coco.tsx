import { useRef } from "react";
import { useGLTF } from "@react-three/drei";

const Cloudy = (props: any) => {
  const ref = useRef<any>(null);
  const { scene } = useGLTF("/cloudy.compressed.glb");

  return (
    <group ref={ref} {...props}>
      <primitive object={scene} />
    </group>
  );
};

export default Cloudy;

useGLTF.preload("/cloudy.compressed.glb");