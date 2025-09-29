"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Radio, 
  X, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle, 
  Clock 
} from "lucide-react";
import { useWebSocket } from "@/hooks/use-websocket";
import { toast } from "sonner";

interface WebSocketStatusProps {
  className?: string;
}

export function WebSocketStatus({ className }: WebSocketStatusProps) {
  const {
    isConnected,
    isConnecting,
    reconnectAttempts,
    lastMessage,
    getConnectionStatus,
  } = useWebSocket();

  const [status, setStatus] = useState({
    isConnected: false,
    isConnecting: false,
    reconnectAttempts: 0,
  });

  // Update status periodically
  useEffect(() => {
    const updateStatus = () => {
      const newStatus = getConnectionStatus();
      setStatus(newStatus);
    };

    updateStatus();
    const interval = setInterval(updateStatus, 1000);
    return () => clearInterval(interval);
  }, [getConnectionStatus]);

  const getStatusIcon = () => {
    if (isConnecting) {
      return <RefreshCw className="h-4 w-4 animate-spin text-yellow-500" />;
    }
    
    if (isConnected) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    
    if (reconnectAttempts > 0) {
      return <AlertCircle className="h-4 w-4 text-orange-500" />;
    }
    
    return <X className="h-4 w-4 text-red-500" />;
  };

  const getStatusText = () => {
    if (isConnecting) {
      return "Connecting...";
    }
    
    if (isConnected) {
      return "Connected";
    }
    
    if (reconnectAttempts > 0) {
      return `Reconnecting (${reconnectAttempts})`;
    }
    
    return "Disconnected";
  };

  const getStatusBadge = () => {
    if (isConnected) {
      return <Badge className="bg-green-100 text-green-800">Online</Badge>;
    }
    
    if (isConnecting) {
      return <Badge className="bg-yellow-100 text-yellow-800">Connecting</Badge>;
    }
    
    if (reconnectAttempts > 0) {
      return <Badge className="bg-orange-100 text-orange-800">Reconnecting</Badge>;
    }
    
    return <Badge className="bg-red-100 text-red-800">Offline</Badge>;
  };

  const formatLastMessage = () => {
    if (!lastMessage) return "No messages";
    
    const time = new Date(lastMessage.timestamp).toLocaleTimeString();
    return `${lastMessage.type} at ${time}`;
  };

  const handleRefresh = () => {
    toast.info("WebSocket status refreshed");
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="h-5 w-5" />
            WebSocket Status
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Connection Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className="font-medium">{getStatusText()}</span>
          </div>
          {getStatusBadge()}
        </div>

        {/* Connection Details */}
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex justify-between">
            <span>Status:</span>
            <span className="font-mono">
              {isConnected ? "CONNECTED" : "DISCONNECTED"}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span>Reconnect Attempts:</span>
            <span className="font-mono">{reconnectAttempts}</span>
          </div>
          
          <div className="flex justify-between">
            <span>Last Message:</span>
            <span className="font-mono text-xs">
              {formatLastMessage()}
            </span>
          </div>
        </div>

        {/* Connection Info */}
        <div className="pt-2 border-t">
          <div className="text-xs text-muted-foreground space-y-1">
            <p>Real-time updates for:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Transaction confirmations</li>
              <li>Balance changes</li>
              <li>Deposit notifications</li>
              <li>Network status</li>
            </ul>
          </div>
        </div>

        {/* Troubleshooting */}
        {!isConnected && reconnectAttempts > 2 && (
          <div className="pt-2 border-t">
            <div className="text-xs text-muted-foreground space-y-1">
              <p className="font-medium text-orange-600">Troubleshooting:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Check your internet connection</li>
                <li>Refresh the page</li>
                <li>Contact support if issue persists</li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
