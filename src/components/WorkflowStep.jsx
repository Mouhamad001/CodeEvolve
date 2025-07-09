import React from 'react';

const WorkflowStep = ({ step, index, isActive, isCompleted }) => {
  const stepNames = {
    'goal_selection': 'Goal Selection',
    'ast_visualization': 'AST Visualization',
    'agent_collaboration': 'Agent Collaboration',
    'holographic_diff': 'Holographic Diff',
    'validation_matrix': 'Validation Matrix'
  };

  return (
    <div className="flex items-center">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
        isCompleted 
          ? 'bg-primary border-primary text-background' 
          : isActive 
            ? 'border-primary text-primary animate-pulse' 
            : 'border-muted text-muted'
      }`}>
        {isCompleted ? '✓' : index + 1}
      </div>
      <div className="ml-4">
        <h4 className={`font-semibold ${
          isActive ? 'text-primary neon-shadow' : isCompleted ? 'text-primary' : 'text-muted'
        }`}>
          {stepNames[step] || step}
        </h4>
        <p className="text-sm text-muted-foreground">
          {step.replace('_', ' ').toLowerCase()}
        </p>
      </div>
    </div>
  );
};

export default WorkflowStep;

