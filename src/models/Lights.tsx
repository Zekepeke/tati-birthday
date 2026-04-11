import { useRef, useMemo } from "react";
import { useGLTF } from "@react-three/drei";

const Lights = (props: any) => {
  const ref = useRef<any>(null);
  const { scene } = useGLTF("/lights.glb");
  const clone = useMemo(() => scene.clone(), [scene]);

  return (
    <group ref={ref} {...props}>
      <primitive object={clone} />
    </group>
  );
};

export default Lights;

useGLTF.preload("/lights.glb");