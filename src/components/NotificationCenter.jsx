import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button.jsx';

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Simulate incoming notifications
    const interval = setInterval(() => {
      const notificationTypes = [
        { type: 'info', message: 'Agent Analyzer completed AST parsing', icon: '🔍' },
        { type: 'success', message: 'Code refactoring completed successfully', icon: '✅' },
        { type: 'warning', message: 'High CPU usage detected - throttling enabled', icon: '⚠️' },
        { type: 'error', message: 'Network connection unstable', icon: '❌' },
        { type: 'info', message: 'New holographic visualization available', icon: '🔮' }
      ];

      if (Math.random() > 0.7) { // 30% chance of new notification
        const randomNotification = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
        const newNotification = {
          id: Date.now(),
          ...randomNotification,
          timestamp: new Date().toLocaleTimeString(),
          read: false
        };

        setNotifications(prev => [newNotification, ...prev.slice(0, 9)]); // Keep only 10 notifications
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      {/* Notification Bell */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        size="sm"
        className="relative border-primary text-primary hover:bg-primary/10"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-destructive text-background text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </Button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-80 bg-card border border-primary/30 rounded-lg shadow-lg z-50 max-h-96 overflow-hidden">
          <div className="p-4 border-b border-primary/30">
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-semibold text-primary">Notifications</h4>
              {notifications.length > 0 && (
                <Button
                  onClick={clearAll}
                  size="sm"
                  variant="outline"
                  className="text-xs border-secondary text-secondary hover:bg-secondary/10"
                >
                  Clear All
                </Button>
              )}
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => markAsRead(notification.id)}
                  className={`p-3 border-b border-muted/20 cursor-pointer hover:bg-muted/10 transition-colors ${
                    !notification.read ? 'bg-primary/5' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-lg">{notification.icon}</span>
                    <div className="flex-1">
                      <p className={`text-sm ${!notification.read ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notification.timestamp}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                    )}
                  </div>
                </div>
              ))
            )}
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

export default NotificationCenter;

