import React from 'react';

const AgentCard = ({ name, executionEnv, details, isActive }) => {
  return (
    <div className={`bg-card p-6 rounded-lg border-2 transition-all duration-300 ${
      isActive ? 'border-primary shadow-lg shadow-primary/20' : 'border-primary/30'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-primary neon-shadow">{name}</h3>
        <div className={`w-3 h-3 rounded-full ${
          isActive ? 'bg-primary animate-pulse' : 'bg-muted'
        }`}></div>
      </div>
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          <span className="text-secondary">Execution:</span> {executionEnv}
        </p>
        {details && (
          <p className="text-sm text-muted-foreground">
            <span className="text-secondary">Details:</span> {details}
          </p>
        )}
      </div>
    </div>
  );
};

export default AgentCard;

