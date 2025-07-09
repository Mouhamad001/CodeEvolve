import React, { useState } from 'react';
import { Button } from '@/components/ui/button.jsx';

const SecurityPanel = () => {
  const [encryptionStatus, setEncryptionStatus] = useState('Enabled');
  const [sandboxStatus, setSandboxStatus] = useState('Active');
  const [securityScan, setSecurityScan] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleSecurityScan = async () => {
    setIsScanning(true);
    setSecurityScan(null);

    // Simulate security scan
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const scanResults = {
      timestamp: new Date().toLocaleString(),
      threats: 0,
      vulnerabilities: 1,
      warnings: 2,
      status: 'Secure',
      details: [
        { type: 'Info', message: 'Code encryption: AES-256-GCM active' },
        { type: 'Info', message: 'Cloud transfer: E2EE enabled' },
        { type: 'Warning', message: 'Consider updating dependency versions' },
        { type: 'Warning', message: 'Enable additional input validation' },
        { type: 'Vulnerability', message: 'Potential XSS in user input handling' }
      ]
    };

    setSecurityScan(scanResults);
    setIsScanning(false);
  };

  const toggleEncryption = () => {
    setEncryptionStatus(encryptionStatus === 'Enabled' ? 'Disabled' : 'Enabled');
  };

  const toggleSandbox = () => {
    setSandboxStatus(sandboxStatus === 'Active' ? 'Inactive' : 'Active');
  };

  return (
    <div className="bg-card p-6 rounded-lg border border-primary/30">
      <h3 className="text-xl font-bold text-primary mb-4 neon-shadow">Security Center</h3>
      
      {/* Security Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-muted/20 rounded-lg">
          <h4 className="text-secondary font-semibold mb-2">Encryption Status</h4>
          <div className="flex items-center justify-between">
            <span className={`text-sm ${encryptionStatus === 'Enabled' ? 'text-primary' : 'text-destructive'}`}>
              {encryptionStatus}
            </span>
            <Button 
              size="sm" 
              onClick={toggleEncryption}
              className={`${encryptionStatus === 'Enabled' ? 'bg-destructive' : 'bg-primary'} text-background`}
            >
              {encryptionStatus === 'Enabled' ? 'Disable' : 'Enable'}
            </Button>
          </div>
        </div>
        
        <div className="p-4 bg-muted/20 rounded-lg">
          <h4 className="text-secondary font-semibold mb-2">Sandbox Environment</h4>
          <div className="flex items-center justify-between">
            <span className={`text-sm ${sandboxStatus === 'Active' ? 'text-primary' : 'text-destructive'}`}>
              {sandboxStatus}
            </span>
            <Button 
              size="sm" 
              onClick={toggleSandbox}
              className={`${sandboxStatus === 'Active' ? 'bg-destructive' : 'bg-primary'} text-background`}
            >
              {sandboxStatus === 'Active' ? 'Deactivate' : 'Activate'}
            </Button>
          </div>
        </div>
      </div>

      {/* Security Scan */}
      <div className="mb-6">
        <Button 
          onClick={handleSecurityScan}
          disabled={isScanning}
          className="w-full bg-secondary text-background hover:bg-secondary/80"
        >
          {isScanning ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-background mr-2"></div>
              Scanning...
            </div>
          ) : (
            'Run Security Scan'
          )}
        </Button>
      </div>

      {/* Scan Results */}
      {securityScan && (
        <div className="bg-muted/20 rounded-lg p-4">
          <h4 className="text-primary font-semibold mb-3">Security Scan Results</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{securityScan.threats}</div>
              <div className="text-xs text-muted-foreground">Threats</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-destructive">{securityScan.vulnerabilities}</div>
              <div className="text-xs text-muted-foreground">Vulnerabilities</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">{securityScan.warnings}</div>
              <div className="text-xs text-muted-foreground">Warnings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{securityScan.status}</div>
              <div className="text-xs text-muted-foreground">Status</div>
            </div>
          </div>
          
          <div className="space-y-2">
            {securityScan.details.map((detail, index) => (
              <div key={index} className="text-xs">
                <span className={`font-semibold ${
                  detail.type === 'Vulnerability' ? 'text-destructive' : 
                  detail.type === 'Warning' ? 'text-secondary' : 'text-primary'
                }`}>
                  {detail.type}:
                </span> {detail.message}
              </div>
            ))}
          </div>
          
          <p className="text-xs text-muted-foreground mt-3">
            Last scan: {securityScan.timestamp}
          </p>
        </div>
      )}
    </div>
  );
};

export default SecurityPanel;

