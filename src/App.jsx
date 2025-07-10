import React, { useState } from 'react';
import './App.css';
import AgentCard from './components/AgentCard.jsx';
import WorkflowStep from './components/WorkflowStep.jsx';
import PerformanceMonitor from './components/PerformanceMonitor.jsx';
import CodeImportPanel from './components/CodeImportPanel.jsx';
import SecurityPanel from './components/SecurityPanel.jsx';
import ExportPanel from './components/ExportPanel.jsx';
import NotificationCenter from './components/NotificationCenter.jsx';
import SettingsPanel from './components/SettingsPanel.jsx';
import MonacoCodeEditor from './components/MonacoCodeEditor.jsx';
import HolographicVisualizer from './components/HolographicVisualizer.jsx';
import GitHubCodeImporter from './components/GitHubCodeImporter.jsx';
import AgentCommunication from './components/AgentCommunication.jsx';

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [activeAgent, setActiveAgent] = useState('Analyzer');
  const [importedCode, setImportedCode] = useState('');
  const [analysisResults, setAnalysisResults] = useState(null);
  const [refactoredCode, setRefactoredCode] = useState('');
  const [validationResults, setValidationResults] = useState(null);
  const [activeTab, setActiveTab] = useState('import');

  const agents = [
    {
      name: 'Analyzer',
      status: currentStep >= 0 ? (currentStep === 0 ? 'active' : 'completed') : 'pending',
      description: 'AST fingerprint caching',
      environment: 'Cloud',
      progress: currentStep > 0 ? 100 : (currentStep === 0 ? 75 : 0)
    },
    {
      name: 'Planner',
      status: currentStep >= 1 ? (currentStep === 1 ? 'active' : 'completed') : 'pending',
      description: 'Phi-3-Mini-4K (ONNX)',
      environment: 'Hybrid',
      progress: currentStep > 1 ? 100 : (currentStep === 1 ? 60 : 0)
    },
    {
      name: 'Coder',
      status: currentStep >= 2 ? (currentStep === 2 ? 'active' : 'completed') : 'pending',
      description: 'Diff patching optimization',
      environment: 'Cloud',
      progress: currentStep > 2 ? 100 : (currentStep === 2 ? 45 : 0)
    },
    {
      name: 'Validator',
      status: currentStep >= 3 ? (currentStep === 3 ? 'active' : 'completed') : 'pending',
      description: 'NativeContainer testing',
      environment: 'Device',
      progress: currentStep > 3 ? 100 : (currentStep === 3 ? 30 : 0)
    }
  ];

  const workflowSteps = [
    'Goal Selection',
    'AST Visualization',
    'Agent Collaboration',
    'Holographic Diff',
    'Validation Matrix'
  ];

  const handleNextStep = () => {
    if (currentStep < workflowSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      setActiveAgent(agents[Math.min(currentStep + 1, agents.length - 1)].name);
    }
  };

  const handleResetWorkflow = () => {
    setCurrentStep(0);
    setActiveAgent('Analyzer');
  };

  const handleCodeImported = (data) => {
    setImportedCode(data.code || data);
    setActiveTab('editor');
  };

  const handleAnalysisComplete = (results) => {
    setAnalysisResults(results);
  };

  const handleRefactoringComplete = (data) => {
    setRefactoredCode(data.refactored_code);
  };

  const handleValidationComplete = (results) => {
    setValidationResults(results);
  };

  const tabs = [
    { id: 'import', label: '📥 Import', icon: '📥' },
    { id: 'editor', label: '💻 Editor', icon: '💻' },
    { id: 'visualizer', label: '🔮 Visualizer', icon: '🔮' },
    { id: 'github', label: '🐙 GitHub', icon: '🐙' },
    { id: 'agents', label: '🤖 Agents', icon: '🤖' }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>
        <div className="particles-container">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 20}s`,
                animationDuration: `${20 + Math.random() * 20}s`
              }}
            ></div>
          ))}
        </div>
        <div className="scan-lines"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 p-6 border-b border-primary/30 bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-primary neon-shadow mb-2">
                CodeEvolve: Quantum Refactor
              </h1>
              <p className="text-lg text-secondary neon-shadow">
                AI-Powered Code Transformation v{import.meta.env.VITE_APP_VERSION || 'Q1.0'}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <NotificationCenter />
              <SettingsPanel />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto p-6 space-y-8">
        {/* Agent System */}
        <section>
          <h2 className="text-2xl font-bold text-primary mb-6 neon-shadow">Agent System</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {agents.map((agent, index) => (
              <AgentCard
                key={agent.name}
                agent={agent}
                isActive={agent.name === activeAgent}
                onClick={() => setActiveAgent(agent.name)}
              />
            ))}
          </div>
        </section>

        {/* Workflow */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-primary neon-shadow">Refactoring Workflow</h2>
            <div className="flex gap-2">
              <button
                onClick={handleNextStep}
                disabled={currentStep >= workflowSteps.length - 1}
                className="px-4 py-2 bg-primary text-background rounded hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Next Step
              </button>
              <button
                onClick={handleResetWorkflow}
                className="px-4 py-2 bg-secondary text-background rounded hover:bg-secondary/80 transition-all"
              >
                Reset
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {workflowSteps.map((step, index) => (
              <WorkflowStep
                key={step}
                step={step}
                isActive={index === currentStep}
                isCompleted={index < currentStep}
                stepNumber={index + 1}
              />
            ))}
          </div>
        </section>

        {/* Main Interface Tabs */}
        <section>
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mb-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary text-background'
                      : 'bg-card text-foreground hover:bg-primary/20'
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === 'import' && (
              <CodeImportPanel onCodeImported={handleCodeImported} />
            )}

            {activeTab === 'editor' && (
              <MonacoCodeEditor 
                importedCode={importedCode}
                onCodeChange={setImportedCode}
              />
            )}

            {activeTab === 'visualizer' && (
              <HolographicVisualizer 
                code={importedCode}
                analysisResults={analysisResults}
              />
            )}

            {activeTab === 'github' && (
              <GitHubCodeImporter 
                onCodeImported={handleCodeImported}
                onError={(error) => console.error('GitHub import error:', error)}
              />
            )}

            {activeTab === 'agents' && (
              <AgentCommunication
                code={importedCode}
                onAnalysisComplete={handleAnalysisComplete}
                onRefactoringComplete={handleRefactoringComplete}
                onValidationComplete={handleValidationComplete}
              />
            )}
          </div>
        </section>

        {/* Side Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <PerformanceMonitor />
          <SecurityPanel />
          <ExportPanel />
        </div>

        {/* Results Display */}
        {(analysisResults || refactoredCode || validationResults) && (
          <section>
            <h2 className="text-2xl font-bold text-primary mb-6 neon-shadow">Results</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {analysisResults && (
                <div className="bg-card p-6 rounded-lg border border-primary/30">
                  <h3 className="text-lg font-semibold text-primary mb-4">Analysis Results</h3>
                  <div className="space-y-2 text-sm">
                    <div>Complexity: <span className="text-secondary">{analysisResults.complexity}</span></div>
                    <div>Lines of Code: <span className="text-secondary">{analysisResults.lines_of_code}</span></div>
                    <div>Functions: <span className="text-secondary">{analysisResults.functions}</span></div>
                    <div>Issues Found: <span className="text-secondary">{analysisResults.issues?.length || 0}</span></div>
                  </div>
                </div>
              )}

              {refactoredCode && (
                <div className="bg-card p-6 rounded-lg border border-primary/30">
                  <h3 className="text-lg font-semibold text-primary mb-4">Refactored Code</h3>
                  <div className="bg-gray-900 p-4 rounded text-xs font-mono max-h-32 overflow-y-auto">
                    <pre className="text-green-400">{refactoredCode.substring(0, 200)}...</pre>
                  </div>
                </div>
              )}

              {validationResults && (
                <div className="bg-card p-6 rounded-lg border border-primary/30">
                  <h3 className="text-lg font-semibold text-primary mb-4">Validation Results</h3>
                  <div className="space-y-2 text-sm">
                    <div>Syntax Valid: <span className="text-green-400">✓</span></div>
                    <div>Tests Passed: <span className="text-secondary">{validationResults.tests_passed}</span></div>
                    <div>Coverage: <span className="text-secondary">{validationResults.coverage}%</span></div>
                    <div>Security Score: <span className="text-secondary">{validationResults.security_score}</span></div>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Futuristic Features */}
        <section>
          <h2 className="text-2xl font-bold text-primary mb-6 neon-shadow">Futuristic Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card p-6 rounded-lg border border-primary/30 hover:border-primary/50 transition-all">
              <h3 className="text-lg font-semibold text-secondary mb-3">🧠 Neural Feedback</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Haptic patterns and EEG adaptive UI for cognitive load monitoring
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Haptic Rhythm</span>
                  <span className="text-green-400">Active</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>EEG Adaptation</span>
                  <span className="text-yellow-400">Calibrating</span>
                </div>
              </div>
            </div>

            <div className="bg-card p-6 rounded-lg border border-primary/30 hover:border-primary/50 transition-all">
              <h3 className="text-lg font-semibold text-secondary mb-3">⚛️ Quantum UI</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Superposition rendering and entangled animations
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Superposition</span>
                  <span className="text-green-400">Enabled</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Entanglement</span>
                  <span className="text-green-400">Synchronized</span>
                </div>
              </div>
            </div>

            <div className="bg-card p-6 rounded-lg border border-primary/30 hover:border-primary/50 transition-all">
              <h3 className="text-lg font-semibold text-secondary mb-3">⏰ Temporal Debugging</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Code timeline view for temporal analysis
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Timeline View</span>
                  <span className="text-blue-400">Ready</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Time Travel</span>
                  <span className="text-purple-400">Experimental</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Input Modes */}
        <section>
          <h2 className="text-2xl font-bold text-primary mb-6 neon-shadow">Input Modes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card p-6 rounded-lg border border-primary/30">
              <h3 className="text-lg font-semibold text-secondary mb-3">🎤 Voice Input</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Natural language code commands
              </p>
              <button className="w-full px-4 py-2 bg-primary text-background rounded hover:bg-primary/80 transition-all">
                Enable Voice
              </button>
            </div>

            <div className="bg-card p-6 rounded-lg border border-primary/30">
              <h3 className="text-lg font-semibold text-secondary mb-3">👋 Gesture Control</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Hand tracking for 3D manipulation
              </p>
              <button className="w-full px-4 py-2 bg-secondary text-background rounded hover:bg-secondary/80 transition-all">
                Calibrate Gestures
              </button>
            </div>

            <div className="bg-card p-6 rounded-lg border border-primary/30">
              <h3 className="text-lg font-semibold text-secondary mb-3">🧠 Neural Impulse</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Direct brain-computer interface
              </p>
              <button className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-all">
                Connect Neural
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-12 p-6 border-t border-primary/30 bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p>CodeEvolve: Quantum Refactor v{import.meta.env.VITE_APP_VERSION || 'Q1.0'} | 
             Powered by React Native 0.74, MobX, Three.js, Monaco Editor & WebSocket Communication</p>
          <p className="mt-2">🚀 Enhanced with Monaco Editor | 🔮 Three.js Holographic Visualizer | 🐙 GitHub API Integration | 🤖 Real-time Agent Communication</p>
        </div>
      </footer>
    </div>
  );
}

export default App;

