import React, { useState, useEffect } from 'react';

const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({
    cpuTemp: 45,
    memoryUsage: 65,
    gpuUsage: 30,
    batteryLevel: 85
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        cpuTemp: Math.max(30, Math.min(80, prev.cpuTemp + (Math.random() - 0.5) * 5)),
        memoryUsage: Math.max(20, Math.min(95, prev.memoryUsage + (Math.random() - 0.5) * 10)),
        gpuUsage: Math.max(10, Math.min(90, prev.gpuUsage + (Math.random() - 0.5) * 15)),
        batteryLevel: Math.max(10, Math.min(100, prev.batteryLevel - Math.random() * 0.1))
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const MetricBar = ({ label, value, unit, color, threshold }) => (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className={`text-sm ${value > threshold ? 'text-destructive' : 'text-primary'}`}>
          {value.toFixed(1)}{unit}
        </span>
      </div>
      <div className="w-full bg-muted rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-500 ${
            value > threshold ? 'bg-destructive' : `bg-${color}`
          }`}
          style={{ width: `${Math.min(100, value)}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <div className="bg-card p-6 rounded-lg border border-primary/30">
      <h3 className="text-xl font-bold text-primary mb-4 neon-shadow">Performance Monitor</h3>
      <div className="space-y-4">
        <MetricBar 
          label="CPU Temperature" 
          value={metrics.cpuTemp} 
          unit="°C" 
          color="primary" 
          threshold={70}
        />
        <MetricBar 
          label="Memory Usage" 
          value={metrics.memoryUsage} 
          unit="%" 
          color="secondary" 
          threshold={85}
        />
        <MetricBar 
          label="GPU Usage" 
          value={metrics.gpuUsage} 
          unit="%" 
          color="primary" 
          threshold={80}
        />
        <MetricBar 
          label="Battery Level" 
          value={metrics.batteryLevel} 
          unit="%" 
          color="primary" 
          threshold={20}
        />
      </div>
    </div>
  );
};

export default PerformanceMonitor;

