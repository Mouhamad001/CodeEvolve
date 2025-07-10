import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { Button } from '@/components/ui/button.jsx';

const AgentCommunication = ({ code, onAnalysisComplete, onRefactoringComplete, onValidationComplete }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [sessionId, setSessionId] = useState('default');
  const [agentStates, setAgentStates] = useState({});
  const [messages, setMessages] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRefactoring, setIsRefactoring] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [serverUrl, setServerUrl] = useState('http://localhost:5000');
  const messagesEndRef = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
      addMessage('system', 'Connected to CodeEvolve Agent System');
      
      // Join session
      newSocket.emit('join_session', { session_id: sessionId });
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
      addMessage('system', 'Disconnected from server');
    });

    newSocket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setIsConnected(false);
      addMessage('error', `Connection error: ${error.message}`);
    });

    // Agent state updates
    newSocket.on('agent_states', (states) => {
      setAgentStates(states);
    });

    newSocket.on('agent_update', (data) => {
      setAgentStates(prev => ({
        ...prev,
        [data.agent]: data.state
      }));
      addMessage('agent', `${data.agent}: ${data.state.message} (${data.state.progress}%)`);
    });

    // Analysis events
    newSocket.on('analysis_started', (data) => {
      setIsAnalyzing(true);
      addMessage('system', 'Code analysis started');
    });

    newSocket.on('analysis_complete', (data) => {
      setIsAnalyzing(false);
      addMessage('success', 'Code analysis completed');
      if (onAnalysisComplete) {
        onAnalysisComplete(data.results);
      }
    });

    // Refactoring events
    newSocket.on('refactoring_started', (data) => {
      setIsRefactoring(true);
      addMessage('system', 'Code refactoring started');
    });

    newSocket.on('refactoring_complete', (data) => {
      setIsRefactoring(false);
      addMessage('success', 'Code refactoring completed');
      if (onRefactoringComplete) {
        onRefactoringComplete(data);
      }
    });

    // Validation events
    newSocket.on('validation_started', (data) => {
      setIsValidating(true);
      addMessage('system', 'Code validation started');
    });

    newSocket.on('validation_complete', (data) => {
      setIsValidating(false);
      addMessage('success', 'Code validation completed');
      if (onValidationComplete) {
        onValidationComplete(data.results);
      }
    });

    // Session events
    newSocket.on('joined_session', (data) => {
      addMessage('system', `Joined session: ${data.session_id}`);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [serverUrl, sessionId]);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (type, content) => {
    const message = {
      id: Date.now(),
      type,
      content,
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages(prev => [...prev, message]);
  };

  const handleConnect = () => {
    if (socket) {
      socket.connect();
    }
  };

  const handleDisconnect = () => {
    if (socket) {
      socket.disconnect();
    }
  };

  const handleStartAnalysis = () => {
    if (!socket || !isConnected) {
      addMessage('error', 'Not connected to server');
      return;
    }

    if (!code) {
      addMessage('error', 'No code to analyze');
      return;
    }

    socket.emit('start_analysis', {
      code,
      session_id: sessionId
    });
  };

  const handleStartRefactoring = () => {
    if (!socket || !isConnected) {
      addMessage('error', 'Not connected to server');
      return;
    }

    if (!code) {
      addMessage('error', 'No code to refactor');
      return;
    }

    socket.emit('start_refactoring', {
      code,
      session_id: sessionId
    });
  };

  const handleValidateCode = () => {
    if (!socket || !isConnected) {
      addMessage('error', 'Not connected to server');
      return;
    }

    if (!code) {
      addMessage('error', 'No code to validate');
      return;
    }

    socket.emit('validate_code', {
      code,
      session_id: sessionId
    });
  };

  const handleResetAgents = () => {
    if (!socket || !isConnected) {
      addMessage('error', 'Not connected to server');
      return;
    }

    socket.emit('reset_agents');
    addMessage('system', 'Agents reset requested');
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const getAgentStatusColor = (status) => {
    switch (status) {
      case 'idle': return 'text-gray-400';
      case 'running': return 'text-yellow-400';
      case 'completed': return 'text-green-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getMessageTypeColor = (type) => {
    switch (type) {
      case 'system': return 'text-blue-400';
      case 'agent': return 'text-purple-400';
      case 'success': return 'text-green-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-300';
    }
  };

  return (
    <div className="bg-card rounded-lg border border-primary/30">
      {/* Header */}
      <div className="p-4 border-b border-primary/30">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-primary neon-shadow">Agent Communication</h3>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
            <span className="text-sm text-muted-foreground">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>

        {/* Connection Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Server URL</label>
            <input
              type="text"
              value={serverUrl}
              onChange={(e) => setServerUrl(e.target.value)}
              disabled={isConnected}
              className="w-full p-2 bg-background border border-primary/30 rounded text-foreground text-sm"
              placeholder="http://localhost:5000"
            />
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-1">Session ID</label>
            <input
              type="text"
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
              className="w-full p-2 bg-background border border-primary/30 rounded text-foreground text-sm"
              placeholder="default"
            />
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-1">Connection</label>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleConnect}
                disabled={isConnected}
                className="bg-primary text-background hover:bg-primary/80"
              >
                Connect
              </Button>
              <Button
                size="sm"
                onClick={handleDisconnect}
                disabled={!isConnected}
                variant="outline"
                className="border-secondary text-secondary hover:bg-secondary/10"
              >
                Disconnect
              </Button>
            </div>
          </div>
        </div>

        {/* Agent Controls */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <Button
            size="sm"
            onClick={handleStartAnalysis}
            disabled={!isConnected || isAnalyzing}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            {isAnalyzing ? 'Analyzing...' : '🔍 Analyze'}
          </Button>
          <Button
            size="sm"
            onClick={handleStartRefactoring}
            disabled={!isConnected || isRefactoring}
            className="bg-purple-600 text-white hover:bg-purple-700"
          >
            {isRefactoring ? 'Refactoring...' : '⚡ Refactor'}
          </Button>
          <Button
            size="sm"
            onClick={handleValidateCode}
            disabled={!isConnected || isValidating}
            className="bg-green-600 text-white hover:bg-green-700"
          >
            {isValidating ? 'Validating...' : '✅ Validate'}
          </Button>
          <Button
            size="sm"
            onClick={handleResetAgents}
            disabled={!isConnected}
            variant="outline"
            className="border-red-400 text-red-400 hover:bg-red-400/10"
          >
            🔄 Reset
          </Button>
        </div>
      </div>

      {/* Agent Status */}
      <div className="p-4 border-b border-primary/30">
        <h4 className="text-sm font-semibold text-foreground mb-2">Agent Status</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(agentStates).map(([agentName, state]) => (
            <div key={agentName} className="bg-background p-3 rounded border border-primary/20">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-foreground capitalize">{agentName}</span>
                <span className={`text-xs ${getAgentStatusColor(state.status)}`}>
                  {state.status}
                </span>
              </div>
              <div className="text-xs text-muted-foreground mb-2">{state.message}</div>
              <div className="w-full bg-gray-700 rounded-full h-1">
                <div
                  className="bg-primary h-1 rounded-full transition-all duration-300"
                  style={{ width: `${state.progress}%` }}
                ></div>
              </div>
              <div className="text-xs text-muted-foreground mt-1">{state.progress}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold text-foreground">Communication Log</h4>
          <Button
            size="sm"
            onClick={clearMessages}
            variant="outline"
            className="border-primary text-primary hover:bg-primary/10"
          >
            Clear
          </Button>
        </div>
        
        <div className="bg-gray-900 rounded p-3 h-64 overflow-y-auto font-mono text-sm">
          {messages.length === 0 ? (
            <div className="text-gray-500 text-center py-8">
              No messages yet. Connect to start communication.
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className="mb-1">
                <span className="text-gray-500">[{message.timestamp}]</span>
                <span className={`ml-2 ${getMessageTypeColor(message.type)}`}>
                  {message.content}
                </span>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-primary/30 text-xs text-muted-foreground">
        <div className="flex justify-between items-center">
          <span>WebSocket Communication | Real-time Agent Coordination</span>
          <span>Session: {sessionId} | Messages: {messages.length}</span>
        </div>
      </div>
    </div>
  );
};

export default AgentCommunication;

