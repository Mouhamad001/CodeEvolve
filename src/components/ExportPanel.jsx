import React, { useState } from 'react';
import { Button } from '@/components/ui/button.jsx';

const ExportPanel = () => {
  const [selectedFormat, setSelectedFormat] = useState('git_push');
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState('');
  const [exportHistory, setExportHistory] = useState([]);

  const exportFormats = [
    { id: 'git_push', label: 'Git Push', icon: '🔄', description: 'Push changes to Git repository' },
    { id: 'zip', label: 'ZIP Archive', icon: '📦', description: 'Download as ZIP file' },
    { id: 'ar_snapshot', label: 'AR Snapshot', icon: '📸', description: 'Create AR visualization snapshot' }
  ];

  const handleExport = async () => {
    setIsExporting(true);
    setExportStatus('');

    try {
      switch (selectedFormat) {
        case 'git_push':
          setExportStatus('Preparing Git commit...');
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          setExportStatus('Pushing to remote repository...');
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          setExportStatus('✅ Successfully pushed to Git repository!');
          break;

        case 'zip':
          setExportStatus('Compressing files...');
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          setExportStatus('Generating ZIP archive...');
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          setExportStatus('✅ ZIP file ready for download!');
          break;

        case 'ar_snapshot':
          setExportStatus('Capturing AR visualization...');
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          setExportStatus('Processing holographic data...');
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          setExportStatus('✅ AR snapshot created successfully!');
          break;
      }

      // Add to export history
      const newExport = {
        id: Date.now(),
        format: selectedFormat,
        timestamp: new Date().toLocaleString(),
        status: 'Success'
      };
      setExportHistory(prev => [newExport, ...prev.slice(0, 4)]);

    } catch (error) {
      setExportStatus('❌ Export failed: ' + error.message);
    } finally {
      setIsExporting(false);
      
      // Clear status after 3 seconds
      setTimeout(() => {
        setExportStatus('');
      }, 3000);
    }
  };

  return (
    <div className="bg-card p-6 rounded-lg border border-primary/30">
      <h3 className="text-xl font-bold text-primary mb-4 neon-shadow">Export Center</h3>
      
      {/* Export Format Selection */}
      <div className="space-y-3 mb-6">
        {exportFormats.map((format) => (
          <div
            key={format.id}
            onClick={() => setSelectedFormat(format.id)}
            className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 ${
              selectedFormat === format.id
                ? 'border-primary bg-primary/10'
                : 'border-muted hover:border-primary/50'
            }`}
          >
            <div className="flex items-center">
              <span className="text-2xl mr-3">{format.icon}</span>
              <div>
                <h4 className={`font-semibold ${
                  selectedFormat === format.id ? 'text-primary' : 'text-foreground'
                }`}>
                  {format.label}
                </h4>
                <p className="text-sm text-muted-foreground">{format.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Export Status */}
      {exportStatus && (
        <div className={`p-3 rounded-md border mb-4 ${
          exportStatus.includes('✅') 
            ? 'border-primary bg-primary/10 text-primary' 
            : exportStatus.includes('❌')
              ? 'border-destructive bg-destructive/10 text-destructive'
              : 'border-secondary bg-secondary/10 text-secondary'
        }`}>
          {exportStatus}
        </div>
      )}

      {/* Export Button */}
      <Button 
        onClick={handleExport}
        disabled={isExporting}
        className="w-full bg-secondary text-background hover:bg-secondary/80 mb-6"
      >
        {isExporting ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-background mr-2"></div>
            Exporting...
          </div>
        ) : (
          `Export as ${exportFormats.find(f => f.id === selectedFormat)?.label}`
        )}
      </Button>

      {/* Export History */}
      {exportHistory.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-primary mb-3">Recent Exports</h4>
          <div className="space-y-2">
            {exportHistory.map((export_item) => (
              <div key={export_item.id} className="flex justify-between items-center p-2 bg-muted/20 rounded">
                <div>
                  <span className="text-sm font-medium">
                    {exportFormats.find(f => f.id === export_item.format)?.label}
                  </span>
                  <p className="text-xs text-muted-foreground">{export_item.timestamp}</p>
                </div>
                <span className="text-xs text-primary">{export_item.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportPanel;

