import React, { useState } from 'react';
import { Button } from '@/components/ui/button.jsx';

const CodeImportPanel = () => {
  const [activeTab, setActiveTab] = useState('github');
  const [githubUrl, setGithubUrl] = useState('');
  const [localFile, setLocalFile] = useState(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState('');
  const [importedCode, setImportedCode] = useState('');
  const [editorStatus, setEditorStatus] = useState('');
  const [analysisStatus, setAnalysisStatus] = useState('');
  const [analysisResults, setAnalysisResults] = useState(null);

  const tabs = [
    { id: 'github', label: 'GitHub', icon: '🐙' },
    { id: 'local', label: 'Local Storage', icon: '📁' },
    { id: 'camera', label: 'Camera OCR', icon: '📷' }
  ];

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setLocalFile(file);
    setImportStatus('');
  };

  const simulateGitHubImport = async (url) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock code content based on URL
    const mockCode = `// Imported from: ${url}
// CodeEvolve: Quantum Refactor - Mock Import
import React from 'react';

const ExampleComponent = () => {
  const [state, setState] = useState(null);
  
  useEffect(() => {
    // Initialize component
    console.log('Component mounted');
  }, []);

  return (
    <div className="example-component">
      <h1>Hello from GitHub Repository</h1>
      <p>This is a mock import from the repository.</p>
      <button onClick={() => setState('clicked')}>
        Click me
      </button>
    </div>
  );
};

export default ExampleComponent;`;

    return mockCode;
  };

  const simulateLocalFileImport = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target.result);
      };
      reader.readAsText(file);
    });
  };

  const handleImport = async () => {
    setIsImporting(true);
    setImportStatus('');
    setImportedCode('');
    setEditorStatus('');
    setAnalysisStatus('');
    setAnalysisResults(null);

    try {
      switch (activeTab) {
        case 'github':
          if (!githubUrl) {
            setImportStatus('Please enter a GitHub URL');
            setIsImporting(false);
            return;
          }
          
          setImportStatus('Connecting to GitHub...');
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          setImportStatus('Fetching repository data...');
          const githubCode = await simulateGitHubImport(githubUrl);
          
          setImportStatus('✅ Successfully imported from GitHub!');
          setImportedCode(githubCode);
          break;

        case 'local':
          if (!localFile) {
            setImportStatus('Please select a file');
            setIsImporting(false);
            return;
          }
          
          setImportStatus('Reading local file...');
          const localCode = await simulateLocalFileImport(localFile);
          
          setImportStatus('✅ Successfully imported local file!');
          setImportedCode(localCode);
          break;

        case 'camera':
          setImportStatus('Starting camera...');
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          setImportStatus('Processing OCR...');
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          const ocrCode = `// OCR Extracted Code
function extractedFunction() {
  console.log("This code was extracted using OCR");
  return "Camera OCR simulation";
}`;
          
          setImportStatus('✅ Successfully extracted code via OCR!');
          setImportedCode(ocrCode);
          break;
      }
    } catch (error) {
      setImportStatus('❌ Import failed: ' + error.message);
    } finally {
      setIsImporting(false);
    }
  };

  const handleSendToEditor = async () => {
    setEditorStatus('Sending code to Monaco Editor...');
    
    // Simulate sending to editor
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setEditorStatus('✅ Code successfully loaded in Monaco Editor!');
    
    // Clear status after 3 seconds
    setTimeout(() => {
      setEditorStatus('');
    }, 3000);
  };

  const handleAnalyzeCode = async () => {
    setAnalysisStatus('Starting code analysis...');
    setAnalysisResults(null);
    
    // Simulate analysis steps
    await new Promise(resolve => setTimeout(resolve, 1000));
    setAnalysisStatus('Parsing AST...');
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    setAnalysisStatus('Running static analysis...');
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    setAnalysisStatus('Generating insights...');
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock analysis results
    const mockAnalysis = {
      complexity: 'Medium',
      linesOfCode: importedCode.split('\n').length,
      functions: 3,
      components: 1,
      issues: [
        { type: 'Warning', message: 'Missing PropTypes validation' },
        { type: 'Info', message: 'Consider using useCallback for event handlers' }
      ],
      suggestions: [
        'Add error boundaries for better error handling',
        'Implement memoization for performance optimization',
        'Consider splitting into smaller components'
      ],
      security: 'No security issues detected',
      performance: 'Good - No major performance concerns'
    };
    
    setAnalysisResults(mockAnalysis);
    setAnalysisStatus('✅ Code analysis complete!');
    
    // Clear status after 3 seconds
    setTimeout(() => {
      setAnalysisStatus('');
    }, 3000);
  };

  const clearImport = () => {
    setImportedCode('');
    setImportStatus('');
    setGithubUrl('');
    setLocalFile(null);
    setEditorStatus('');
    setAnalysisStatus('');
    setAnalysisResults(null);
  };

  return (
    <div className="bg-card p-6 rounded-lg border border-primary/30">
      <h3 className="text-xl font-bold text-primary mb-4 neon-shadow">Code Import</h3>
      
      {/* Tab Navigation */}
      <div className="flex space-x-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-md transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-primary text-background border border-primary'
                : 'bg-muted text-muted-foreground border border-muted hover:border-primary/50'
            }`}
            disabled={isImporting}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {activeTab === 'github' && (
          <div>
            <label className="block text-sm text-muted-foreground mb-2">
              GitHub Repository URL
            </label>
            <input
              type="text"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/username/repository"
              className="w-full p-3 bg-background border border-primary/30 rounded-md text-foreground focus:border-primary focus:outline-none"
              disabled={isImporting}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Example: https://github.com/facebook/react
            </p>
          </div>
        )}

        {activeTab === 'local' && (
          <div>
            <label className="block text-sm text-muted-foreground mb-2">
              Select Local File
            </label>
            <input
              type="file"
              onChange={handleFileUpload}
              accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.h,.css,.html,.json"
              className="w-full p-3 bg-background border border-primary/30 rounded-md text-foreground focus:border-primary focus:outline-none"
              disabled={isImporting}
            />
            {localFile && (
              <p className="text-sm text-primary mt-2">
                Selected: {localFile.name} ({(localFile.size / 1024).toFixed(1)} KB)
              </p>
            )}
          </div>
        )}

        {activeTab === 'camera' && (
          <div className="text-center">
            <div className="bg-muted rounded-lg p-8 mb-4">
              <span className="text-4xl">📷</span>
              <p className="text-muted-foreground mt-2">
                Camera OCR with Tesseract.js
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              Point your camera at code to extract text using OCR
            </p>
          </div>
        )}

        {/* Import Status */}
        {importStatus && (
          <div className={`p-3 rounded-md border ${
            importStatus.includes('✅') 
              ? 'border-primary bg-primary/10 text-primary' 
              : importStatus.includes('❌')
                ? 'border-destructive bg-destructive/10 text-destructive'
                : 'border-secondary bg-secondary/10 text-secondary'
          }`}>
            {importStatus}
          </div>
        )}

        {/* Import Button */}
        <Button 
          onClick={handleImport}
          className="w-full bg-primary text-background hover:bg-primary/80 transition-colors"
          disabled={
            isImporting ||
            (activeTab === 'github' && !githubUrl) ||
            (activeTab === 'local' && !localFile)
          }
        >
          {isImporting ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-background mr-2"></div>
              Importing...
            </div>
          ) : (
            'Import Code'
          )}
        </Button>

        {/* Clear Button */}
        {(importedCode || importStatus) && (
          <Button 
            onClick={clearImport}
            variant="outline"
            className="w-full border-secondary text-secondary hover:bg-secondary/10"
            disabled={isImporting}
          >
            Clear Import
          </Button>
        )}
      </div>

      {/* Imported Code Display */}
      {importedCode && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold text-primary mb-3 neon-shadow">
            Imported Code Preview
          </h4>
          <div className="bg-gray-900 border border-primary/30 rounded-md p-4 max-h-64 overflow-y-auto">
            <pre className="text-sm text-green-400 whitespace-pre-wrap font-mono">
              {importedCode}
            </pre>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2 mt-3">
            <Button 
              size="sm"
              onClick={handleSendToEditor}
              className="bg-secondary text-background hover:bg-secondary/80"
              disabled={!importedCode}
            >
              Send to Editor
            </Button>
            <Button 
              size="sm"
              onClick={handleAnalyzeCode}
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10"
              disabled={!importedCode}
            >
              Analyze Code
            </Button>
          </div>

          {/* Editor Status */}
          {editorStatus && (
            <div className={`mt-3 p-3 rounded-md border ${
              editorStatus.includes('✅') 
                ? 'border-secondary bg-secondary/10 text-secondary' 
                : 'border-primary bg-primary/10 text-primary'
            }`}>
              {editorStatus}
            </div>
          )}

          {/* Analysis Status */}
          {analysisStatus && (
            <div className={`mt-3 p-3 rounded-md border ${
              analysisStatus.includes('✅') 
                ? 'border-primary bg-primary/10 text-primary' 
                : 'border-secondary bg-secondary/10 text-secondary'
            }`}>
              {analysisStatus}
            </div>
          )}

          {/* Analysis Results */}
          {analysisResults && (
            <div className="mt-4 bg-card border border-primary/30 rounded-lg p-4">
              <h5 className="text-lg font-semibold text-primary mb-3 neon-shadow">
                Code Analysis Results
              </h5>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="text-secondary font-semibold">Complexity:</span> {analysisResults.complexity}
                  </p>
                  <p className="text-sm">
                    <span className="text-secondary font-semibold">Lines of Code:</span> {analysisResults.linesOfCode}
                  </p>
                  <p className="text-sm">
                    <span className="text-secondary font-semibold">Functions:</span> {analysisResults.functions}
                  </p>
                  <p className="text-sm">
                    <span className="text-secondary font-semibold">Components:</span> {analysisResults.components}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="text-secondary font-semibold">Security:</span> {analysisResults.security}
                  </p>
                  <p className="text-sm">
                    <span className="text-secondary font-semibold">Performance:</span> {analysisResults.performance}
                  </p>
                </div>
              </div>

              {/* Issues */}
              {analysisResults.issues.length > 0 && (
                <div className="mb-4">
                  <h6 className="text-sm font-semibold text-destructive mb-2">Issues Found:</h6>
                  <ul className="space-y-1">
                    {analysisResults.issues.map((issue, index) => (
                      <li key={index} className="text-xs text-muted-foreground">
                        <span className={`font-semibold ${
                          issue.type === 'Warning' ? 'text-destructive' : 'text-primary'
                        }`}>
                          {issue.type}:
                        </span> {issue.message}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Suggestions */}
              <div>
                <h6 className="text-sm font-semibold text-primary mb-2">Suggestions:</h6>
                <ul className="space-y-1">
                  {analysisResults.suggestions.map((suggestion, index) => (
                    <li key={index} className="text-xs text-muted-foreground">
                      • {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CodeImportPanel;

