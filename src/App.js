import './App.css';
import { Canvas, useFrame, useThree, useLoader, extend } from '@react-three/fiber';
import { useRef, Suspense } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
extend({ OrbitControls })

const Orbit = () => {
  const {camera, gl} = useThree();
  return (
    <orbitControls args={[camera, gl.domElement]}/>
  );
}

const Cube = props => {
  const ref = useRef();
  const texture = useLoader(THREE.TextureLoader, '/wood.jpg');
  useFrame(state => {
    ref.current.rotation.x += 0.01;
    ref.current.rotation.y += 0.01;
  });
  return (
    <mesh ref={ref} {...props} castShadow>
      <boxBufferGeometry/>
      <meshPhysicalMaterial
      map={texture}
      />
    </mesh>
  );
}

const Floor = props => {
  return (
    <mesh {...props} receiveShadow>
      <boxBufferGeometry args={[20, 0.5, 20]}/>
      <meshPhysicalMaterial/>
    </mesh>
  )
}

const Bulb = props => {
  return (
    <mesh {...props} castShadow>
      <pointLight castShadow/>
      <sphereBufferGeometry args={[0.2]}/>
      <meshPhongMaterial emissive='yellow'/>
    </mesh>
  )
}

function App() {
  return (
    <div style={{height: '100vh', width: '100vw'}}>
      <Canvas 
      style={{background: 'black'}}
      camera={{position: [3, 3, 3]}}
      shadows
      >
        <Orbit/>
        <Bulb position={[2, 6, 0]}/>
        <Suspense fallback={null}>
          <Cube position={[0, 0, 0]}/>
        </Suspense>
        <Floor position={[0, -3, 0]}/>
        {/*<fog attach='fog' args={['white', 1, 10]}/>*/}
      </Canvas>
    </div>
  );
}

export default App;