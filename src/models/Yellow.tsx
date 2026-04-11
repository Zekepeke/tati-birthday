import { useRef, useMemo } from "react";
import { useGLTF } from "@react-three/drei";

const Yellow = (props: any) => {
  const ref = useRef<any>(null);
  const { scene } = useGLTF("/yellow.glb");
  const clone = useMemo(() => scene.clone(), [scene]);

  return (
    <group ref={ref} {...props}>
      <primitive object={clone} />
    </group>
  );
};

export default Yellow;

useGLTF.preload("/yellow.glb");