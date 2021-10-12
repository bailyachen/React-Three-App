import './App.css';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import { useRef, useEffect, useState, Suspense } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DragControls } from 'three/examples/jsm/controls/DragControls';
extend({ OrbitControls });
extend({ DragControls });

const Dragable = props => {
  const groupRef = useRef();
  const controlsRef = useRef();
  const [children, setChildren] = useState([]);
  const {camera, gl, scene} = useThree();
  useEffect(() => {
    setChildren(groupRef.current.children)
  }, []);
  useEffect(() => {
    controlsRef.current.addEventListener(
      'hoveron',
      e => {
        scene.orbitControls.enabled = false;
        if (scene.orbitControls.enabled) console.log("Failed");
      }
    );
    controlsRef.current.addEventListener(
      'hoveroff',
      e => scene.orbitControls.enabled = true
    );
  }, [children, scene.orbitControls]);
  
  
  return (
    <group ref={groupRef}>
      <dragControls ref={controlsRef} args={[children, camera, gl.domElement]}/>
      {props.children}
    </group>
  );
}

const Orbit = () => {
  const {camera, gl} = useThree();
  return (
    <orbitControls attach='orbitControls' args={[camera, gl.domElement]}/>
  );
}

const Cube = props => {
  const ref = useRef();
  useFrame(state => {
    ref.current.rotation.x += 0.01;
    ref.current.rotation.y += 0.01;
  });
  return (
    <mesh 
      ref={ref} 
      {...props} 
      castShadow
      onPointerDown={(e) => {
        e.object.active = true;
        window.activeMesh = e.object;
      }}
      onPointerEnter={(e) => {
        ref.current.scale.x += 0.5;
        ref.current.scale.y += 0.5;
        ref.current.scale.z += 0.5;
      }}
      onPointerLeave={(e) => {
        ref.current.scale.x -= 0.5;
        ref.current.scale.y -= 0.5;
        ref.current.scale.z -= 0.5;
      }}
    >
      <boxBufferGeometry/>
      <meshPhysicalMaterial
        color='red'
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
  const handleClick = e => {
    if (!window.activeMesh) {
      return;
    }
    window.activeMesh.material.color = new THREE.Color(e.target.style.background);
  }
  return (
    <div style={{height: '100vh', width: '100vw'}}>
      <div style={{position: 'absolute', zIndex: 1}}>
        <div 
          onClick={handleClick}
          style={{ background: 'blue', height: 50, width: 50}}
        />
        <div 
          onClick={handleClick}
          style={{ background: 'red', height: 50, width: 50}}
        />
        <div 
          onClick={handleClick}
          style={{ background: 'yellow', height: 50, width: 50}}
        />
        <div 
          onClick={handleClick}
          style={{ background: 'green', height: 50, width: 50}}
        />
      </div>
      <Canvas 
        style={{background: 'black'}}
        camera={{position: [3, 3, 3]}}
        shadows
      >
        <Orbit/>
        <Bulb position={[2, 6, 0]}/>
        <Dragable>
          <Suspense fallback={null}>
            <Cube position={[0, 0, 0]}/>
          </Suspense>
        </Dragable>
        <Floor position={[0, -3, 0]}/>
      </Canvas>
    </div>
  );
}

export default App;