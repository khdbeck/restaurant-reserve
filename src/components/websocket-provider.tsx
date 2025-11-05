"use client";

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io, type Socket } from 'socket.io-client';
import type { WebSocketConnection, RealTimeEvent, TableStatusUpdate } from '@/lib/types';
import { useNotifications } from './notification-provider';

interface WebSocketContextType {
  connection: WebSocketConnection;
  socket: Socket | null;
  subscribeToRestaurant: (restaurantId: string) => void;
  unsubscribeFromRestaurant: (restaurantId: string) => void;
  updateTableStatus: (restaurantId: string, tableId: string, status: TableStatusUpdate) => void;
  lastEvent: RealTimeEvent | null;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

const WEBSOCKET_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:3001';

interface WebSocketProviderProps {
  children: React.ReactNode;
}

export function WebSocketProvider({ children }: WebSocketProviderProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [lastEvent, setLastEvent] = useState<RealTimeEvent | null>(null);
  const [connection, setConnection] = useState<WebSocketConnection>({
    status: 'disconnected',
    reconnectAttempts: 0,
    maxReconnectAttempts: 5,
  });

  const { showNotification } = useNotifications();

  const connect = useCallback(() => {
    if (socket?.connected) return;

    setConnection(prev => ({ ...prev, status: 'connecting' }));

    // For development, we'll simulate WebSocket with mock events
    const mockSocket = {
      connected: true,
      emit: (event: string, data: unknown) => {
        console.log('Mock WebSocket emit:', event, data);
      },
      on: (event: string, callback: (data: unknown) => void) => {
        console.log('Mock WebSocket on:', event);
        // Store callback for potential mock events
      },
      off: (event: string, callback?: (data: unknown) => void) => {
        console.log('Mock WebSocket off:', event);
      },
      disconnect: () => {
        console.log('Mock WebSocket disconnect');
      },
    } as unknown as Socket;

    setSocket(mockSocket);
    setConnection({
      status: 'connected',
      lastConnected: new Date(),
      reconnectAttempts: 0,
      maxReconnectAttempts: 5,
    });

    // Simulate receiving real-time events
    setTimeout(() => {
      handleRealTimeEvent({
        type: 'table_status_change',
        restaurantId: 'besh-qozon',
        data: {
          tableId: 't3',
          status: 'available',
        } as TableStatusUpdate,
        timestamp: new Date(),
      });
    }, 5000);

    // For production, uncomment the real WebSocket implementation:
    /*
    const newSocket = io(WEBSOCKET_URL, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: connection.maxReconnectAttempts,
      reconnectionDelay: 1000,
    });

    newSocket.on('connect', () => {
      setConnection({
        status: 'connected',
        lastConnected: new Date(),
        reconnectAttempts: 0,
        maxReconnectAttempts: 5,
      });
    });

    newSocket.on('disconnect', () => {
      setConnection(prev => ({ ...prev, status: 'disconnected' }));
    });

    newSocket.on('connect_error', () => {
      setConnection(prev => ({
        ...prev,
        status: 'error',
        reconnectAttempts: prev.reconnectAttempts + 1,
      }));
    });

    newSocket.on('real_time_event', handleRealTimeEvent);

    setSocket(newSocket);
    */
  }, [socket?.connected]);

  const handleRealTimeEvent = useCallback((event: RealTimeEvent) => {
    setLastEvent(event);

    // Handle different event types
    switch (event.type) {
      case 'table_status_change': {
        const tableUpdate = event.data as TableStatusUpdate;
        showNotification({
          type: 'info',
          title: 'Table Status Updated',
          message: `Table ${tableUpdate.tableId} is now ${tableUpdate.status}`,
        });
        break;
      }

      case 'new_booking':
        showNotification({
          type: 'success',
          title: 'New Booking',
          message: 'A new booking has been made',
        });
        break;

      case 'booking_cancelled':
        showNotification({
          type: 'warning',
          title: 'Booking Cancelled',
          message: 'A booking has been cancelled',
        });
        break;

      case 'layout_updated':
        showNotification({
          type: 'info',
          title: 'Layout Updated',
          message: 'Restaurant layout has been updated',
        });
        break;
    }
  }, [showNotification]);

  const subscribeToRestaurant = useCallback((restaurantId: string) => {
    if (socket) {
      socket.emit('subscribe_restaurant', { restaurantId });
      console.log('Subscribed to restaurant:', restaurantId);
    }
  }, [socket]);

  const unsubscribeFromRestaurant = useCallback((restaurantId: string) => {
    if (socket) {
      socket.emit('unsubscribe_restaurant', { restaurantId });
      console.log('Unsubscribed from restaurant:', restaurantId);
    }
  }, [socket]);

  const updateTableStatus = useCallback((
      restaurantId: string,
      tableId: string,
      status: TableStatusUpdate
  ) => {
    if (socket) {
      socket.emit('update_table_status', {
        restaurantId,
        ...status, // ✅ contains tableId already
      });

      // Simulate immediate local update
      handleRealTimeEvent({
        type: 'table_status_change',
        restaurantId,
        data: { ...status }, // ✅ contains tableId already
        timestamp: new Date(),
      });
    }
  }, [socket, handleRealTimeEvent]);

  useEffect(() => {
    connect();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [connect, socket]);

  const value: WebSocketContextType = {
    connection,
    socket,
    subscribeToRestaurant,
    unsubscribeFromRestaurant,
    updateTableStatus,
    lastEvent,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
}

// Hook for restaurant-specific WebSocket operations
export function useRestaurantWebSocket(restaurantId: string) {
  const { subscribeToRestaurant, unsubscribeFromRestaurant, updateTableStatus, lastEvent } = useWebSocket();

  useEffect(() => {
    if (restaurantId) {
      subscribeToRestaurant(restaurantId);
      return () => {
        unsubscribeFromRestaurant(restaurantId);
      };
    }
  }, [restaurantId, subscribeToRestaurant, unsubscribeFromRestaurant]);

  const updateTable = useCallback((tableId: string, status: TableStatusUpdate) => {
    updateTableStatus(restaurantId, tableId, status);
  }, [restaurantId, updateTableStatus]);

  // Filter events for this restaurant
  const restaurantEvent = lastEvent?.restaurantId === restaurantId ? lastEvent : null;

  return {
    updateTable,
    lastEvent: restaurantEvent,
  };
}
