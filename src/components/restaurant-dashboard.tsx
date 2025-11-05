"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { LayoutEditor } from './layout-editor';
import { useWebSocket } from './websocket-provider';
import { useNotifications } from './notification-provider';
import type { Restaurant, RestaurantLayout, RestaurantAnalytics } from '@/lib/types';
import {
  LayoutGrid,
  BarChart3,
  Calendar,
  Users,
  Star,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  Settings,
  Eye,
  Edit,
  Plus,
  Download
} from 'lucide-react';

interface RestaurantDashboardProps {
  restaurant: Restaurant;
  onLayoutUpdateAction: (layout: RestaurantLayout) => void;
}

// Mock analytics data
const mockAnalytics: RestaurantAnalytics = {
  restaurantId: 'besh-qozon',
  period: 'month',
  metrics: {
    totalBookings: 342,
    totalRevenue: 15420000,
    averageRating: 9.2,
    totalReviews: 28,
    tableUtilization: 78,
    popularTables: ['t1', 't6', 't8'],
    peakHours: ['19:00', '20:00', '21:00'],
    cancelationRate: 5.2,
  },
  tableMetrics: [
    { tableId: 't1', bookingCount: 45, utilization: 85, averageDuration: 90, revenue: 2100000 },
    { tableId: 't2', bookingCount: 38, utilization: 72, averageDuration: 95, revenue: 1850000 },
    { tableId: 't3', bookingCount: 42, utilization: 80, averageDuration: 85, revenue: 1980000 },
    { tableId: 't6', bookingCount: 52, utilization: 95, averageDuration: 120, revenue: 3200000 }, // VIP table
    { tableId: 't8', bookingCount: 41, utilization: 78, averageDuration: 88, revenue: 1920000 },
  ],
};

export function RestaurantDashboard({ restaurant, onLayoutUpdateAction }: RestaurantDashboardProps) {
  const { data: session } = useSession();
  const { connection, lastEvent } = useWebSocket();
  const { showNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState('overview');
  const [analytics] = useState<RestaurantAnalytics>(mockAnalytics);
  const [isLayoutEditorOpen, setIsLayoutEditorOpen] = useState(false);

  // Check if user is owner/manager
  const isOwner = session?.user?.email === 'admin@tablein.uz'; // Mock check

  useEffect(() => {
    if (lastEvent) {
      showNotification({
        type: 'info',
        title: 'Real-time Update',
        message: `Restaurant activity: ${lastEvent.type}`,
      });
    }
  }, [lastEvent, showNotification]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('uz-UZ', {
      style: 'currency',
      currency: 'UZS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

  const handleLayoutSave = (layout: RestaurantLayout) => {
    onLayoutUpdateAction(layout);
    setIsLayoutEditorOpen(false);
    showNotification({
      type: 'success',
      title: 'Layout Saved',
      message: 'Restaurant layout has been updated successfully',
    });
  };

  if (!isOwner) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-muted-foreground">
            You don't have permission to access this restaurant dashboard.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isLayoutEditorOpen && restaurant.layout) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Layout Editor - {restaurant.name}</h1>
          <Button
            variant="outline"
            onClick={() => setIsLayoutEditorOpen(false)}
          >
            Back to Dashboard
          </Button>
        </div>
        <LayoutEditor
          layout={restaurant.layout}
          onSaveAction={handleLayoutSave}
          mode="edit"
          isOwner={isOwner}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{restaurant.name}</h1>
          <p className="text-muted-foreground">{restaurant.address}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={connection.status === 'connected' ? 'default' : 'secondary'}>
            {connection.status === 'connected' ? 'Live' : 'Offline'}
          </Badge>
          <Button variant="outline" className="gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
                <p className="text-2xl font-bold">{analytics.metrics.totalBookings}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-green-600">+12.5%</span>
              <span className="text-muted-foreground ml-1">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(analytics.metrics.totalRevenue)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-green-600">+8.2%</span>
              <span className="text-muted-foreground ml-1">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Rating</p>
                <p className="text-2xl font-bold">{analytics.metrics.averageRating}</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-green-600">+0.3</span>
              <span className="text-muted-foreground ml-1">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Table Utilization</p>
                <p className="text-2xl font-bold">{formatPercentage(analytics.metrics.tableUtilization)}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
              <span className="text-red-600">-2.1%</span>
              <span className="text-muted-foreground ml-1">vs last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                  <div className="h-2 w-2 bg-green-500 rounded-full" />
                  <div className="flex-1">
                    <p className="font-medium">New booking confirmed</p>
                    <p className="text-sm text-muted-foreground">Table 6, tonight at 8:00 PM</p>
                  </div>
                  <span className="text-sm text-muted-foreground">2 min ago</span>
                </div>
                <div className="flex items-center gap-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <div className="h-2 w-2 bg-blue-500 rounded-full" />
                  <div className="flex-1">
                    <p className="font-medium">New review received</p>
                    <p className="text-sm text-muted-foreground">5 stars from Ahmad K.</p>
                  </div>
                  <span className="text-sm text-muted-foreground">15 min ago</span>
                </div>
                <div className="flex items-center gap-4 p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                  <div className="h-2 w-2 bg-yellow-500 rounded-full" />
                  <div className="flex-1">
                    <p className="font-medium">Table status changed</p>
                    <p className="text-sm text-muted-foreground">Table 3 is now available</p>
                  </div>
                  <span className="text-sm text-muted-foreground">1 hour ago</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Popular Tables */}
          <Card>
            <CardHeader>
              <CardTitle>Popular Tables This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {analytics.tableMetrics
                  .sort((a, b) => b.utilization - a.utilization)
                  .slice(0, 3)
                  .map((table, index) => (
                    <div key={table.tableId} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Table {table.tableId.replace('t', '')}</span>
                        <Badge variant={index === 0 ? 'default' : 'secondary'}>
                          #{index + 1}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Utilization:</span>
                          <span className="font-medium">{formatPercentage(table.utilization)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Bookings:</span>
                          <span className="font-medium">{table.bookingCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Revenue:</span>
                          <span className="font-medium">{formatCurrency(table.revenue)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="layout" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Restaurant Layout Management</span>
                <Button
                  onClick={() => setIsLayoutEditorOpen(true)}
                  className="bg-tablein-blue"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Layout
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Layout Statistics</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Total Tables:</span>
                        <span className="font-medium">{restaurant.layout?.tables.length || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Seats:</span>
                        <span className="font-medium">
                          {restaurant.layout?.tables.reduce((sum, table) => sum + table.seats, 0) || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Layout Size:</span>
                        <span className="font-medium">
                          {restaurant.layout?.width || 0} × {restaurant.layout?.height || 0}px
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Last Updated:</span>
                        <span className="font-medium">
                          {restaurant.layout?.updatedAt
                            ? new Date(restaurant.layout.updatedAt).toLocaleDateString()
                            : 'Never'
                          }
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Quick Actions</h3>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Table
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <LayoutGrid className="h-4 w-4 mr-2" />
                        Use Template
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <Download className="h-4 w-4 mr-2" />
                        Export Layout
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                    <h3 className="font-medium mb-4">Current Layout Preview</h3>
                    {restaurant.layout ? (
                      <div
                        className="relative border rounded overflow-hidden bg-white dark:bg-gray-800"
                        style={{
                          width: '100%',
                          height: '300px',
                          backgroundImage: 'radial-gradient(circle, #0003 1px, transparent 1px)',
                          backgroundSize: '20px 20px',
                        }}
                      >
                        {/* Mini preview of tables */}
                        {restaurant.layout.tables.map(table => (
                          <div
                            key={table.id}
                            className="absolute bg-green-500 border border-green-600 rounded flex items-center justify-center text-white text-xs"
                            style={{
                              left: `${(table.x / (restaurant.layout?.width || 1)) * 100}%`,
                              top: `${(table.y / (restaurant.layout?.height || 1)) * 100}%`,
                              width: `${Math.max(20, (table.width / (restaurant.layout?.width || 1)) * 100)}%`,
                              height: `${Math.max(20, (table.height / (restaurant.layout?.height || 1)) * 100)}%`,
                              transform: 'scale(0.8)',
                            }}
                          >
                            {table.number}
                          </div>
                        ))}
                        {/* Mini preview of obstacles */}
                        {restaurant.layout.obstacles.map(obstacle => (
                          <div
                            key={obstacle.id}
                            className="absolute bg-gray-400 border border-gray-500 rounded flex items-center justify-center text-xs"
                            style={{
                              left: `${(obstacle.x / (restaurant.layout?.width || 1)) * 100}%`,
                              top: `${(obstacle.y / (restaurant.layout?.height || 1)) * 100}%`,
                              width: `${Math.max(15, (obstacle.width / (restaurant.layout?.width || 1)) * 100)}%`,
                              height: `${Math.max(15, (obstacle.height / (restaurant.layout?.height || 1)) * 100)}%`,
                              transform: 'scale(0.8)',
                            }}
                          >
                            {obstacle.type.slice(0, 3)}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-40 text-muted-foreground">
                        No layout configured
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Booking management interface would go here
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Advanced analytics charts and data would go here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
