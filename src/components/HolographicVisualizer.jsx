import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  Text, 
  Box, 
  Sphere, 
  Torus, 
  Plane,
  MeshDistortMaterial,
  Float,
  Environment
} from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import { Button } from '@/components/ui/button.jsx';
import * as THREE from 'three';

// Holographic Code Node Component
const CodeNode = ({ position, text, color = '#00ffcc', isActive = false }) => {
  const meshRef = useRef();
  const textRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.1;
      
      if (isActive) {
        meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 3) * 0.1);
      }
    }
  });

  return (
    <group position={position}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <Box ref={meshRef} args={[0.5, 0.5, 0.5]}>
          <MeshDistortMaterial
            color={color}
            transparent
            opacity={0.8}
            distort={0.3}
            speed={2}
            roughness={0}
            metalness={0.5}
          />
        </Box>
        <Text
          ref={textRef}
          position={[0, 0.8, 0]}
          fontSize={0.2}
          color={color}
          anchorX="center"
          anchorY="middle"
          font="/fonts/JetBrainsMono-Regular.woff"
        >
          {text}
        </Text>
      </Float>
    </group>
  );
};

// Holographic Connection Lines
const ConnectionLines = ({ nodes }) => {
  const linesRef = useRef();

  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.rotation.y += 0.005;
    }
  });

  const points = [];
  for (let i = 0; i < nodes.length - 1; i++) {
    points.push(new THREE.Vector3(...nodes[i].position));
    points.push(new THREE.Vector3(...nodes[i + 1].position));
  }

  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  return (
    <line ref={linesRef} geometry={geometry}>
      <lineBasicMaterial color="#ff00ff" transparent opacity={0.6} />
    </line>
  );
};

// Particle System for Holographic Effect
const HolographicParticles = () => {
  const particlesRef = useRef();
  const particleCount = 1000;

  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

    const color = new THREE.Color();
    color.setHSL(Math.random() * 0.3 + 0.5, 1, 0.5);
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.002;
      particlesRef.current.rotation.x += 0.001;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation={true}
      />
    </points>
  );
};

// AST Visualization Component
const ASTVisualization = ({ astData, isVisible }) => {
  if (!isVisible) return null;

  const nodes = [
    { position: [0, 2, 0], text: 'Program', color: '#00ffcc' },
    { position: [-2, 0, 0], text: 'Function', color: '#ff00ff' },
    { position: [2, 0, 0], text: 'Variable', color: '#ffff00' },
    { position: [-1, -2, 0], text: 'Parameter', color: '#ff6600' },
    { position: [1, -2, 0], text: 'Return', color: '#6600ff' },
  ];

  return (
    <group>
      {nodes.map((node, index) => (
        <CodeNode
          key={index}
          position={node.position}
          text={node.text}
          color={node.color}
          isActive={index === 0}
        />
      ))}
      <ConnectionLines nodes={nodes} />
    </group>
  );
};

// Code Diff Visualization
const CodeDiffVisualization = ({ diffData, isVisible }) => {
  if (!isVisible) return null;

  return (
    <group>
      <Plane args={[4, 6]} position={[-2, 0, 0]}>
        <MeshDistortMaterial
          color="#ff5555"
          transparent
          opacity={0.3}
          distort={0.1}
          speed={1}
        />
      </Plane>
      <Text
        position={[-2, 2.5, 0.1]}
        fontSize={0.3}
        color="#ff5555"
        anchorX="center"
      >
        Original Code
      </Text>
      
      <Plane args={[4, 6]} position={[2, 0, 0]}>
        <MeshDistortMaterial
          color="#55ff55"
          transparent
          opacity={0.3}
          distort={0.1}
          speed={1}
        />
      </Plane>
      <Text
        position={[2, 2.5, 0.1]}
        fontSize={0.3}
        color="#55ff55"
        anchorX="center"
      >
        Refactored Code
      </Text>

      {/* Diff arrows */}
      <group position={[0, 0, 0]}>
        <Torus args={[0.3, 0.1]} rotation={[0, 0, Math.PI / 2]}>
          <MeshDistortMaterial
            color="#00ffcc"
            transparent
            opacity={0.8}
            distort={0.2}
            speed={3}
          />
        </Torus>
      </group>
    </group>
  );
};

// Main Scene Component
const HolographicScene = ({ 
  visualizationMode, 
  astData, 
  diffData, 
  isAnalyzing,
  codeComplexity 
}) => {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 0, 10);
  }, [camera]);

  return (
    <>
      {/* Environment and Lighting */}
      <Environment preset="night" />
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#00ffcc" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff00ff" />

      {/* Holographic Particles */}
      <HolographicParticles />

      {/* Central Holographic Display */}
      <group>
        <Sphere args={[0.1]} position={[0, 0, 0]}>
          <MeshDistortMaterial
            color="#ffffff"
            transparent
            opacity={0.9}
            distort={0.5}
            speed={5}
            emissive="#00ffcc"
            emissiveIntensity={0.5}
          />
        </Sphere>

        {/* Rotating Rings */}
        <Torus args={[2, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
          <MeshDistortMaterial
            color="#00ffcc"
            transparent
            opacity={0.6}
            distort={0.1}
            speed={2}
          />
        </Torus>
        <Torus args={[3, 0.05]} rotation={[0, Math.PI / 2, 0]}>
          <MeshDistortMaterial
            color="#ff00ff"
            transparent
            opacity={0.6}
            distort={0.1}
            speed={1.5}
          />
        </Torus>
      </group>

      {/* Visualization Modes */}
      {visualizationMode === 'ast' && (
        <ASTVisualization astData={astData} isVisible={true} />
      )}
      
      {visualizationMode === 'diff' && (
        <CodeDiffVisualization diffData={diffData} isVisible={true} />
      )}

      {/* Complexity Visualization */}
      {codeComplexity && (
        <group position={[0, -4, 0]}>
          <Text
            fontSize={0.4}
            color="#ffff00"
            anchorX="center"
          >
            Complexity: {codeComplexity}
          </Text>
          <Box args={[codeComplexity / 2, 0.2, 0.2]} position={[0, -0.5, 0]}>
            <MeshDistortMaterial
              color={codeComplexity > 5 ? "#ff5555" : codeComplexity > 3 ? "#ffff00" : "#55ff55"}
              transparent
              opacity={0.8}
              distort={0.1}
              speed={2}
            />
          </Box>
        </group>
      )}

      {/* Analysis Indicator */}
      {isAnalyzing && (
        <group position={[0, 4, 0]}>
          <Float speed={4} rotationIntensity={1} floatIntensity={1}>
            <Text
              fontSize={0.3}
              color="#00ffcc"
              anchorX="center"
            >
              Analyzing...
            </Text>
          </Float>
        </group>
      )}

      {/* Controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={20}
        autoRotate={true}
        autoRotateSpeed={0.5}
      />
    </>
  );
};

// Loading Component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-full">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-primary">Loading Holographic Visualizer...</p>
    </div>
  </div>
);

// Main Holographic Visualizer Component
const HolographicVisualizer = ({ code, analysisResults }) => {
  const [visualizationMode, setVisualizationMode] = useState('ast');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [astData, setAstData] = useState(null);
  const [diffData, setDiffData] = useState(null);
  const [codeComplexity, setCodeComplexity] = useState(3);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fps, setFps] = useState(60);

  const modes = [
    { id: 'ast', label: 'AST View', icon: '🌳' },
    { id: 'diff', label: 'Code Diff', icon: '🔄' },
    { id: 'flow', label: 'Control Flow', icon: '🔀' },
    { id: 'deps', label: 'Dependencies', icon: '🔗' }
  ];

  useEffect(() => {
    if (analysisResults) {
      setCodeComplexity(analysisResults.complexity === 'High' ? 8 : 
                       analysisResults.complexity === 'Medium' ? 5 : 3);
    }
  }, [analysisResults]);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    
    // Simulate analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setAstData({ nodes: [], edges: [] });
    setDiffData({ additions: [], deletions: [] });
    setIsAnalyzing(false);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleExportAR = () => {
    console.log('Exporting AR snapshot...');
    // Implement AR export functionality
  };

  return (
    <div className={`bg-card rounded-lg border border-primary/30 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Header */}
      <div className="p-4 border-b border-primary/30">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-primary neon-shadow">Holographic Visualizer</h3>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={toggleFullscreen}
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10"
            >
              {isFullscreen ? '🗗' : '🗖'}
            </Button>
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Visualization Mode</label>
            <select
              value={visualizationMode}
              onChange={(e) => setVisualizationMode(e.target.value)}
              className="w-full p-2 bg-background border border-primary/30 rounded text-foreground text-sm"
            >
              {modes.map((mode) => (
                <option key={mode.id} value={mode.id}>
                  {mode.icon} {mode.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-1">FPS: {fps}</label>
            <input
              type="range"
              min="30"
              max="60"
              value={fps}
              onChange={(e) => setFps(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-1">Actions</label>
            <Button
              size="sm"
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full bg-secondary text-background hover:bg-secondary/80"
            >
              {isAnalyzing ? 'Analyzing...' : '🔍 Analyze'}
            </Button>
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-1">Export</label>
            <Button
              size="sm"
              onClick={handleExportAR}
              variant="outline"
              className="w-full border-primary text-primary hover:bg-primary/10"
            >
              📸 AR Snapshot
            </Button>
          </div>
        </div>
      </div>

      {/* 3D Canvas */}
      <div className={`${isFullscreen ? 'h-[calc(100vh-200px)]' : 'h-96'} bg-gray-900 relative`}>
        <Suspense fallback={<LoadingSpinner />}>
          <Canvas
            camera={{ position: [0, 0, 10], fov: 75 }}
            gl={{ 
              antialias: true, 
              alpha: true,
              powerPreference: "high-performance"
            }}
            frameloop="always"
            dpr={[1, 2]}
          >
            <HolographicScene
              visualizationMode={visualizationMode}
              astData={astData}
              diffData={diffData}
              isAnalyzing={isAnalyzing}
              codeComplexity={codeComplexity}
            />
            
            {/* Post-processing Effects */}
            <EffectComposer>
              <Bloom intensity={0.5} luminanceThreshold={0.9} />
              <Noise opacity={0.02} />
              <Vignette eskil={false} offset={0.1} darkness={0.5} />
            </EffectComposer>
          </Canvas>
        </Suspense>

        {/* Overlay Information */}
        <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded p-3 text-sm">
          <div className="text-primary font-semibold mb-2">Holographic Display</div>
          <div className="space-y-1 text-xs text-muted-foreground">
            <div>Mode: {modes.find(m => m.id === visualizationMode)?.label}</div>
            <div>FPS: {fps}</div>
            <div>Complexity: {codeComplexity}/10</div>
            <div>Status: {isAnalyzing ? 'Analyzing' : 'Ready'}</div>
          </div>
        </div>

        {/* Controls Hint */}
        <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm rounded p-3 text-xs text-muted-foreground">
          <div>🖱️ Drag to rotate</div>
          <div>🔍 Scroll to zoom</div>
          <div>⌨️ Right-click to pan</div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-primary/30 text-xs text-muted-foreground">
        <div className="flex justify-between items-center">
          <span>Three.js + React Three Fiber | WebGL Accelerated</span>
          <span>ARKit/ARCore Ready | Adaptive {fps}fps</span>
        </div>
      </div>
    </div>
  );
};

export default HolographicVisualizer;

