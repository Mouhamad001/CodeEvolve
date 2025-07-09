import React, { useState } from 'react';
import { Button } from '@/components/ui/button.jsx';

const SettingsPanel = () => {
  const [settings, setSettings] = useState({
    theme: 'cyberpunk',
    neonEffects: true,
    scanLines: true,
    particleEffects: true,
    autoSave: true,
    notifications: true,
    soundEffects: false,
    hologramFPS: 60,
    maxFileSize: 2,
    cacheSize: 20
  });

  const [isOpen, setIsOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveSettings = async () => {
    setSaveStatus('Saving settings...');
    
    // Simulate save operation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSaveStatus('✅ Settings saved successfully!');
    
    // Clear status after 2 seconds
    setTimeout(() => {
      setSaveStatus('');
    }, 2000);
  };

  const resetToDefaults = () => {
    setSettings({
      theme: 'cyberpunk',
      neonEffects: true,
      scanLines: true,
      particleEffects: true,
      autoSave: true,
      notifications: true,
      soundEffects: false,
      hologramFPS: 60,
      maxFileSize: 2,
      cacheSize: 20
    });
  };

  return (
    <div className="relative">
      {/* Settings Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        size="sm"
        className="border-primary text-primary hover:bg-primary/10"
      >
        ⚙️
      </Button>

      {/* Settings Panel */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-96 bg-card border border-primary/30 rounded-lg shadow-lg z-50 max-h-96 overflow-hidden">
          <div className="p-4 border-b border-primary/30">
            <h4 className="text-lg font-semibold text-primary">Settings</h4>
          </div>

          <div className="max-h-80 overflow-y-auto p-4 space-y-4">
            {/* Theme Settings */}
            <div>
              <h5 className="text-sm font-semibold text-secondary mb-2">Theme</h5>
              <select
                value={settings.theme}
                onChange={(e) => handleSettingChange('theme', e.target.value)}
                className="w-full p-2 bg-background border border-primary/30 rounded text-foreground text-sm"
              >
                <option value="cyberpunk">Cyberpunk</option>
                <option value="matrix">Matrix</option>
                <option value="neon">Neon</option>
                <option value="dark">Dark</option>
              </select>
            </div>

            {/* Visual Effects */}
            <div>
              <h5 className="text-sm font-semibold text-secondary mb-2">Visual Effects</h5>
              <div className="space-y-2">
                <label className="flex items-center justify-between">
                  <span className="text-sm">Neon Effects</span>
                  <input
                    type="checkbox"
                    checked={settings.neonEffects}
                    onChange={(e) => handleSettingChange('neonEffects', e.target.checked)}
                    className="w-4 h-4"
                  />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm">Scan Lines</span>
                  <input
                    type="checkbox"
                    checked={settings.scanLines}
                    onChange={(e) => handleSettingChange('scanLines', e.target.checked)}
                    className="w-4 h-4"
                  />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm">Particle Effects</span>
                  <input
                    type="checkbox"
                    checked={settings.particleEffects}
                    onChange={(e) => handleSettingChange('particleEffects', e.target.checked)}
                    className="w-4 h-4"
                  />
                </label>
              </div>
            </div>

            {/* Performance Settings */}
            <div>
              <h5 className="text-sm font-semibold text-secondary mb-2">Performance</h5>
              <div className="space-y-2">
                <label className="block">
                  <span className="text-sm">Hologram FPS: {settings.hologramFPS}</span>
                  <input
                    type="range"
                    min="30"
                    max="60"
                    value={settings.hologramFPS}
                    onChange={(e) => handleSettingChange('hologramFPS', parseInt(e.target.value))}
                    className="w-full mt-1"
                  />
                </label>
                <label className="block">
                  <span className="text-sm">Max File Size: {settings.maxFileSize}MB</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={settings.maxFileSize}
                    onChange={(e) => handleSettingChange('maxFileSize', parseInt(e.target.value))}
                    className="w-full mt-1"
                  />
                </label>
                <label className="block">
                  <span className="text-sm">Cache Size: {settings.cacheSize} files</span>
                  <input
                    type="range"
                    min="10"
                    max="50"
                    value={settings.cacheSize}
                    onChange={(e) => handleSettingChange('cacheSize', parseInt(e.target.value))}
                    className="w-full mt-1"
                  />
                </label>
              </div>
            </div>

            {/* General Settings */}
            <div>
              <h5 className="text-sm font-semibold text-secondary mb-2">General</h5>
              <div className="space-y-2">
                <label className="flex items-center justify-between">
                  <span className="text-sm">Auto Save</span>
                  <input
                    type="checkbox"
                    checked={settings.autoSave}
                    onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
                    className="w-4 h-4"
                  />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm">Notifications</span>
                  <input
                    type="checkbox"
                    checked={settings.notifications}
                    onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                    className="w-4 h-4"
                  />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm">Sound Effects</span>
                  <input
                    type="checkbox"
                    checked={settings.soundEffects}
                    onChange={(e) => handleSettingChange('soundEffects', e.target.checked)}
                    className="w-4 h-4"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Save Status */}
          {saveStatus && (
            <div className={`px-4 py-2 border-t border-primary/30 ${
              saveStatus.includes('✅') 
                ? 'text-primary' 
                : 'text-secondary'
            }`}>
              <p className="text-sm">{saveStatus}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="p-4 border-t border-primary/30 flex gap-2">
            <Button
              onClick={saveSettings}
              size="sm"
              className="flex-1 bg-primary text-background hover:bg-primary/80"
            >
              Save
            </Button>
            <Button
              onClick={resetToDefaults}
              size="sm"
              variant="outline"
              className="flex-1 border-secondary text-secondary hover:bg-secondary/10"
            >
              Reset
            </Button>
          </div>
        </div>
      )}

      {/* Overlay to close panel */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default SettingsPanel;

