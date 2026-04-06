import { useRef } from "react";
import { useGLTF } from "@react-three/drei";

const HelloKitty = (props: any) => {
  const ref = useRef<any>(null);
  const { scene } = useGLTF("/hello.glb");



  return (
    <group ref={ref} {...props}>
      <primitive object={scene} />
    </group>
  );
};

export default HelloKitty;

useGLTF.preload("/hello.glb");