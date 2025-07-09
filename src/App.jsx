import React, { useState } from 'react';
import { Button } from '@/components/ui/button.jsx';
import AgentCard from './components/AgentCard.jsx';
import WorkflowStep from './components/WorkflowStep.jsx';
import PerformanceMonitor from './components/PerformanceMonitor.jsx';
import CodeImportPanel from './components/CodeImportPanel.jsx';
import SecurityPanel from './components/SecurityPanel.jsx';
import ExportPanel from './components/ExportPanel.jsx';
import NotificationCenter from './components/NotificationCenter.jsx';
import SettingsPanel from './components/SettingsPanel.jsx';
import './App.css';

function App() {
  const [activeAgent, setActiveAgent] = useState('Analyzer');
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);

  const agents = [
    {
      name: 'Analyzer',
      executionEnv: 'cloud',
      details: 'AST fingerprint caching'
    },
    {
      name: 'Planner',
      executionEnv: 'hybrid',
      details: 'Phi-3-Mini-4K (ONNX)'
    },
    {
      name: 'Coder',
      executionEnv: 'cloud',
      details: 'diff patching'
    },
    {
      name: 'Validator',
      executionEnv: 'device',
      details: 'NativeContainer'
    }
  ];

  const workflowSteps = [
    'goal_selection',
    'ast_visualization',
    'agent_collaboration',
    'holographic_diff',
    'validation_matrix'
  ];

  const handleNextStep = () => {
    if (currentStep < workflowSteps.length - 1) {
      setCompletedSteps([...completedSteps, currentStep]);
      setCurrentStep(currentStep + 1);
      
      // Simulate agent switching based on workflow step
      const agentMap = {
        0: 'Analyzer',
        1: 'Analyzer',
        2: 'Planner',
        3: 'Coder',
        4: 'Validator'
      };
      setActiveAgent(agentMap[currentStep + 1] || 'Analyzer');
    }
  };

  const resetWorkflow = () => {
    setCurrentStep(0);
    setCompletedSteps([]);
    setActiveAgent('Analyzer');
  };

  return (
    <div className="App bg-background text-foreground min-h-screen">
      {/* Particle Background */}
      <div className="particle-bg">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 5 + 2}px`,
              height: `${Math.random() * 5 + 2}px`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${Math.random() * 10 + 5}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 text-center py-12">
        <div className="absolute top-4 right-4 flex gap-2">
          <NotificationCenter />
          <SettingsPanel />
        </div>
        
        <h1 className="text-6xl font-bold neon-shadow mb-4 holographic-font">
          CodeEvolve: Quantum Refactor
        </h1>
        <p className="text-2xl text-secondary neon-shadow mb-2">
          AI-Powered Code Transformation
        </p>
        <p className="text-lg text-muted-foreground">
          Version Q1.0 • React Native Environment
        </p>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 pb-12">
        
        {/* Code Import Section */}
        <section className="mb-12">
          <CodeImportPanel />
        </section>

        {/* Agent System Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-primary mb-6 neon-shadow">Agent System</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {agents.map((agent) => (
              <AgentCard
                key={agent.name}
                name={agent.name}
                executionEnv={agent.executionEnv}
                details={agent.details}
                isActive={activeAgent === agent.name}
              />
            ))}
          </div>
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Communication: WebSockets + MessageQueue
            </p>
          </div>
        </section>

        {/* Workflow Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-primary mb-6 neon-shadow">Refactoring Workflow</h2>
          <div className="bg-card p-8 rounded-lg border border-primary/30">
            <div className="space-y-6">
              {workflowSteps.map((step, index) => (
                <WorkflowStep
                  key={step}
                  step={step}
                  index={index}
                  isActive={currentStep === index}
                  isCompleted={completedSteps.includes(index)}
                />
              ))}
            </div>
            <div className="flex gap-4 mt-8">
              <Button
                onClick={handleNextStep}
                disabled={currentStep >= workflowSteps.length - 1}
                className="bg-primary text-background hover:bg-primary/80"
              >
                {currentStep >= workflowSteps.length - 1 ? 'Workflow Complete' : 'Next Step'}
              </Button>
              <Button
                onClick={resetWorkflow}
                variant="outline"
                className="border-secondary text-secondary hover:bg-secondary/10"
              >
                Reset Workflow
              </Button>
            </div>
          </div>
        </section>

        {/* Security and Export Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <SecurityPanel />
          <ExportPanel />
        </div>

        {/* Performance and Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          
          {/* Performance Monitor */}
          <PerformanceMonitor />

          {/* Futuristic Features */}
          <div className="bg-card p-6 rounded-lg border border-primary/30">
            <h3 className="text-xl font-bold text-primary mb-4 neon-shadow">Futuristic Features</h3>
            <div className="space-y-4">
              <div className="p-4 bg-muted/20 rounded-lg">
                <h4 className="text-secondary font-semibold mb-2">Neural Feedback</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Haptic Patterns: refactoring_rhythm</li>
                  <li>• Cognitive Load: eeg_adaptive_ui</li>
                </ul>
              </div>
              <div className="p-4 bg-muted/20 rounded-lg">
                <h4 className="text-secondary font-semibold mb-2">Quantum UI</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Superposition Rendering: Active</li>
                  <li>• Entangled Animations: Active</li>
                </ul>
              </div>
              <div className="p-4 bg-muted/20 rounded-lg">
                <h4 className="text-secondary font-semibold mb-2">Temporal Debugging</h4>
                <p className="text-sm text-muted-foreground">Code Timeline View</p>
              </div>
            </div>
          </div>
        </div>

        {/* Code Editor and Visualizer */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Code Editor */}
          <div className="bg-card p-8 rounded-lg border border-primary/30">
            <h3 className="text-2xl font-bold text-primary mb-4 neon-shadow">Monaco Code Editor</h3>
            <div className="bg-gray-900 h-64 rounded-md flex items-center justify-center text-muted-foreground border border-primary/20">
              <div className="text-center">
                <div className="text-4xl mb-2">⚡</div>
                <p>Monaco Editor (WebView)</p>
                <p className="text-sm mt-2">JetBrainsMono-NF Font</p>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button 
                size="sm"
                className="bg-primary text-background hover:bg-primary/80"
              >
                Open Editor
              </Button>
              <Button 
                size="sm"
                variant="outline"
                className="border-secondary text-secondary hover:bg-secondary/10"
              >
                Load Template
              </Button>
            </div>
          </div>

          {/* Holographic Visualizer */}
          <div className="bg-card p-8 rounded-lg border border-primary/30">
            <h3 className="text-2xl font-bold text-primary mb-4 neon-shadow">Holographic Visualizer</h3>
            <div className="bg-gray-900 h-64 rounded-md flex items-center justify-center text-muted-foreground border border-primary/20">
              <div className="text-center">
                <div className="text-4xl mb-2">🔮</div>
                <p>ARKit/ARCore/Three.js</p>
                <p className="text-sm mt-2">Adaptive 30-60fps</p>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button 
                size="sm"
                className="bg-secondary text-background hover:bg-secondary/80"
              >
                Start AR View
              </Button>
              <Button 
                size="sm"
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10"
              >
                3D Preview
              </Button>
            </div>
          </div>
        </div>

        {/* Input Modes */}
        <section className="mt-12">
          <h2 className="text-3xl font-bold text-primary mb-6 neon-shadow">Input Modes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card p-6 rounded-lg border border-primary/30 text-center">
              <div className="text-4xl mb-4">🎤</div>
              <h4 className="text-xl font-semibold text-secondary mb-2">Voice Input</h4>
              <p className="text-muted-foreground mb-4">Voice confirmation for user approval</p>
              <Button 
                size="sm"
                className="bg-primary text-background hover:bg-primary/80"
              >
                Enable Voice
              </Button>
            </div>
            <div className="bg-card p-6 rounded-lg border border-primary/30 text-center">
              <div className="text-4xl mb-4">👋</div>
              <h4 className="text-xl font-semibold text-secondary mb-2">Gesture Control</h4>
              <p className="text-muted-foreground mb-4">Gesture approval and navigation</p>
              <Button 
                size="sm"
                className="bg-secondary text-background hover:bg-secondary/80"
              >
                Calibrate Gestures
              </Button>
            </div>
            <div className="bg-card p-6 rounded-lg border border-primary/30 text-center">
              <div className="text-4xl mb-4">🧠</div>
              <h4 className="text-xl font-semibold text-secondary mb-2">Neural Impulse</h4>
              <p className="text-muted-foreground mb-4">Advanced neural interface</p>
              <Button 
                size="sm"
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10"
              >
                Connect Neural
              </Button>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}

export default App;

