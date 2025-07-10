import React, { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Button } from '@/components/ui/button.jsx';

const MonacoCodeEditor = ({ importedCode, onCodeChange }) => {
  const [code, setCode] = useState(importedCode || `// Welcome to CodeEvolve: Quantum Refactor
// AI-Powered Code Transformation

import React, { useState, useEffect } from 'react';

const ExampleComponent = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initialize component
    console.log('Component mounted');
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/data');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefactor = () => {
    // Trigger AI refactoring
    console.log('Starting AI refactoring...');
  };

  return (
    <div className="example-component">
      <h1>CodeEvolve Demo</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <p>Data: {JSON.stringify(data)}</p>
          <button onClick={handleRefactor}>
            Refactor with AI
          </button>
        </div>
      )}
    </div>
  );
};

export default ExampleComponent;`);
  
  const [language, setLanguage] = useState('javascript');
  const [theme, setTheme] = useState('vs-dark');
  const [fontSize, setFontSize] = useState(14);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const editorRef = useRef(null);

  const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'csharp', label: 'C#' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'json', label: 'JSON' },
    { value: 'xml', label: 'XML' }
  ];

  const themes = [
    { value: 'vs-dark', label: 'Dark' },
    { value: 'vs-light', label: 'Light' },
    { value: 'hc-black', label: 'High Contrast' }
  ];

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    
    // Configure editor options
    editor.updateOptions({
      fontFamily: 'JetBrains Mono, Consolas, Monaco, monospace',
      fontSize: fontSize,
      lineNumbers: 'on',
      roundedSelection: false,
      scrollBeyondLastLine: false,
      readOnly: false,
      theme: theme,
      minimap: { enabled: true },
      wordWrap: 'on',
      automaticLayout: true,
      suggestOnTriggerCharacters: true,
      quickSuggestions: true,
      folding: true,
      foldingStrategy: 'indentation',
      showFoldingControls: 'always',
      unfoldOnClickAfterEndOfLine: true,
      contextmenu: true,
      mouseWheelZoom: true,
      multiCursorModifier: 'ctrlCmd',
      accessibilitySupport: 'auto'
    });

    // Add custom key bindings
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      handleSave();
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyR, () => {
      handleRefactor();
    });

    // Add custom actions
    editor.addAction({
      id: 'quantum-refactor',
      label: 'Quantum Refactor',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyR],
      contextMenuGroupId: 'navigation',
      contextMenuOrder: 1.5,
      run: () => {
        handleRefactor();
      }
    });
  };

  const handleCodeChange = (value) => {
    setCode(value);
    if (onCodeChange) {
      onCodeChange(value);
    }
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    if (editorRef.current) {
      editorRef.current.updateOptions({ theme: newTheme });
    }
  };

  const handleFontSizeChange = (newSize) => {
    setFontSize(newSize);
    if (editorRef.current) {
      editorRef.current.updateOptions({ fontSize: newSize });
    }
  };

  const handleSave = () => {
    console.log('Saving code...', code);
    // Implement save functionality
  };

  const handleRefactor = () => {
    console.log('Starting AI refactoring...', code);
    // Implement refactoring functionality
  };

  const handleFormat = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument').run();
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const insertTemplate = (template) => {
    if (editorRef.current) {
      const selection = editorRef.current.getSelection();
      const range = new monaco.Range(
        selection.startLineNumber,
        selection.startColumn,
        selection.endLineNumber,
        selection.endColumn
      );
      editorRef.current.executeEdits('insert-template', [
        { range: range, text: template }
      ]);
    }
  };

  const templates = {
    react: `import React, { useState } from 'react';

const Component = () => {
  const [state, setState] = useState('');

  return (
    <div>
      <h1>React Component</h1>
    </div>
  );
};

export default Component;`,
    function: `function exampleFunction(param) {
  // Function implementation
  return param;
}`,
    class: `class ExampleClass {
  constructor() {
    this.property = 'value';
  }

  method() {
    return this.property;
  }
}`,
    async: `async function asyncFunction() {
  try {
    const result = await someAsyncOperation();
    return result;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}`
  };

  return (
    <div className={`bg-card rounded-lg border border-primary/30 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Editor Header */}
      <div className="p-4 border-b border-primary/30">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-primary neon-shadow">Monaco Code Editor</h3>
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

        {/* Editor Controls */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Language</label>
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="w-full p-2 bg-background border border-primary/30 rounded text-foreground text-sm"
            >
              {languages.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-1">Theme</label>
            <select
              value={theme}
              onChange={(e) => handleThemeChange(e.target.value)}
              className="w-full p-2 bg-background border border-primary/30 rounded text-foreground text-sm"
            >
              {themes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-1">Font Size</label>
            <input
              type="range"
              min="10"
              max="24"
              value={fontSize}
              onChange={(e) => handleFontSizeChange(parseInt(e.target.value))}
              className="w-full"
            />
            <span className="text-xs text-muted-foreground">{fontSize}px</span>
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-1">Templates</label>
            <select
              onChange={(e) => e.target.value && insertTemplate(templates[e.target.value])}
              className="w-full p-2 bg-background border border-primary/30 rounded text-foreground text-sm"
              defaultValue=""
            >
              <option value="">Insert Template</option>
              <option value="react">React Component</option>
              <option value="function">Function</option>
              <option value="class">Class</option>
              <option value="async">Async Function</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          <Button
            size="sm"
            onClick={handleSave}
            className="bg-primary text-background hover:bg-primary/80"
          >
            💾 Save (Ctrl+S)
          </Button>
          <Button
            size="sm"
            onClick={handleFormat}
            variant="outline"
            className="border-secondary text-secondary hover:bg-secondary/10"
          >
            🎨 Format
          </Button>
          <Button
            size="sm"
            onClick={handleRefactor}
            variant="outline"
            className="border-primary text-primary hover:bg-primary/10"
          >
            ⚡ AI Refactor (Ctrl+R)
          </Button>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className={`${isFullscreen ? 'h-[calc(100vh-200px)]' : 'h-96'}`}>
        <Editor
          height="100%"
          language={language}
          theme={theme}
          value={code}
          onChange={handleCodeChange}
          onMount={handleEditorDidMount}
          options={{
            fontFamily: 'JetBrains Mono, Consolas, Monaco, monospace',
            fontSize: fontSize,
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            readOnly: false,
            minimap: { enabled: true },
            wordWrap: 'on',
            automaticLayout: true,
            suggestOnTriggerCharacters: true,
            quickSuggestions: true,
            folding: true,
            foldingStrategy: 'indentation',
            showFoldingControls: 'always',
            unfoldOnClickAfterEndOfLine: true,
            contextmenu: true,
            mouseWheelZoom: true,
            multiCursorModifier: 'ctrlCmd',
            accessibilitySupport: 'auto'
          }}
        />
      </div>

      {/* Editor Footer */}
      <div className="p-2 border-t border-primary/30 text-xs text-muted-foreground">
        <div className="flex justify-between items-center">
          <span>Lines: {code.split('\n').length} | Characters: {code.length}</span>
          <span>Language: {language.toUpperCase()} | Theme: {theme}</span>
        </div>
      </div>
    </div>
  );
};

export default MonacoCodeEditor;

