export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  address: string;
  city: string;
  country: string;
  image: string;
  images: string[];
  rating: number;
  reviewCount: number;
  priceRange: string;
  cuisine: string[];
  description: string;
  features: string[];
  openingHours: OpeningHours;
  isMichelinGuide?: boolean;
  isNewlyJoined?: boolean;
  recentlyBooked?: string; // e.g., "10 minutes ago"
  reviews?: Review[];
  layout?: RestaurantLayout;
  menu?: MenuItem[];
  ownerId?: string; // For restaurant owner access
}

export interface RestaurantLayout {
  id: string;
  name: string;
  width: number;
  height: number;
  tables: Table[];
  obstacles: Obstacle[];
  isTemplate?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Table {
  id: string;
  number: string;
  x: number;
  y: number;
  width: number;
  height: number;
  seats: number;
  type: 'round' | 'square' | 'rectangle';
  status: 'available' | 'occupied' | 'reserved';
  category?: "table" | "toilet" | "stage" | "wall";
  features?: string[]; // e.g., 'window view', 'private', 'bar seating'
  lastUpdated?: Date; // For real-time updates
  rotation?: number;
}

export interface Obstacle {
  id: string;
  type: 'entrance' | 'bar' | 'kitchen' | 'restroom' | 'stage' | 'wall';
  x: number;
  y: number;
  width: number;
  height: number;
  label?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  features?: string[]; // e.g., 'spicy', 'vegetarian', 'popular'
  preparationTime?: number; // in minutes
  isAvailable?: boolean;
}

export interface PreOrder {
  menuItemId: string;
  quantity: number;
  specialInstructions?: string;
}

export interface OpeningHours {
  [key: string]: {
    open: string;
    close: string;
    closed?: boolean;
  };
}

export interface SearchFilters {
  location: string;
  date: Date | null;
  time: string;
  guests: number;
  cuisine?: string[];
  priceRange?: string[];
  rating?: number;
}

export interface Booking {
  id: string;
  restaurantId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: Date;
  time: string;
  guests: number;
  specialRequests?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  paymentStatus?: 'pending' | 'paid' | 'failed';
  paymentAmount?: number;
  paymentIntentId?: string;
  selectedTableId?: string;
  preOrders?: PreOrder[];
}

export interface Review {
  id: string;
  restaurantId: string;
  userId: string;
  userName: string;
  userEmail: string;
  rating: number;
  title: string;
  comment: string;
  date: Date;
  verified: boolean;
  helpful: number;
  photos?: string[];
}

export interface Notification {
  id: string;
  type: 'booking_confirmed' | 'booking_cancelled' | 'review_received' | 'payment_success' | 'payment_failed' | 'table_status_changed';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  userId: string;
  metadata?: {
    bookingId?: string;
    restaurantId?: string;
    tableId?: string;
    amount?: number;
  };
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  publishedDate: Date;
  tags: string[];
}

export interface Award {
  id: string;
  restaurantId: string;
  year: number;
  category: string;
  rank: number;
}

export interface Statistics {
  totalGuests: number;
  guestsLastMonth: number;
  guestsLastWeek: number;
  guestsYesterday: number;
  totalRestaurants: number;
}

// New types for advanced features

// Layout Customization Types
export interface LayoutEditor {
  mode: 'view' | 'edit' | 'create';
  selectedItem?: Table | Obstacle;
  draggedItem?: DraggedItem;
  clipboard?: Table | Obstacle;
  history: LayoutAction[];
  historyIndex: number;
}

export interface DraggedItem {
  type: 'table' | 'obstacle';
  item: Table | Obstacle;
  offset: { x: number; y: number };
}

export interface LayoutAction {
  type: 'add' | 'remove' | 'move' | 'resize' | 'edit';
  target: 'table' | 'obstacle';
  item: Table | Obstacle;
  previousState?: Table | Obstacle;
}

export interface LayoutTemplate {
  id: string;
  name: string;
  description: string;
  layout: RestaurantLayout;
  category: 'small' | 'medium' | 'large' | 'fine-dining' | 'casual' | 'fast-food';
  isPublic: boolean;
  createdBy: string;
  usageCount: number;
}

// WebSocket Types
export interface WebSocketConnection {
  status: 'connecting' | 'connected' | 'disconnected' | 'error';
  lastConnected?: Date;
  reconnectAttempts: number;
  maxReconnectAttempts: number;
}

export interface RealTimeEvent {
  type: 'table_status_change' | 'new_booking' | 'booking_cancelled' | 'layout_updated';
  restaurantId: string;
  data: TableStatusUpdate | BookingUpdate | LayoutUpdate;
  timestamp: Date;
  userId?: string;
}

export interface TableStatusUpdate {
  tableId: string;
  status: Table['status'];
  bookingId?: string;
  guestCount?: number;
  estimatedDuration?: number; // in minutes
}

export interface BookingUpdate {
  bookingId: string;
  action: 'created' | 'confirmed' | 'cancelled' | 'completed';
  booking: Booking;
}

export interface LayoutUpdate {
  layoutId: string;
  changes: {
    added?: (Table | Obstacle)[];
    removed?: string[];
    modified?: (Table | Obstacle)[];
  };
}

// Deep Linking Types
export interface DeepLink {
  type: 'restaurant' | 'table' | 'booking' | 'menu' | 'search';
  restaurantId?: string;
  tableId?: string;
  bookingId?: string;
  searchParams?: SearchFilters;
  utm?: {
    source?: string;
    medium?: string;
    campaign?: string;
    content?: string;
  };
}

export interface ShareableLink {
  url: string;
  title: string;
  description: string;
  image?: string;
  metadata?: {
    restaurantName?: string;
    tableNumber?: string;
    bookingDate?: string;
  };
}

export interface MobileAppHandoff {
  isAvailable: boolean;
  appStoreUrl?: string;
  playStoreUrl?: string;
  universalLink?: string;
  fallbackUrl: string;
}

// Restaurant Owner Dashboard Types
export interface RestaurantOwner {
  id: string;
  email: string;
  name: string;
  phone?: string;
  restaurantIds: string[];
  permissions: OwnerPermission[];
  subscription?: {
    plan: 'free' | 'basic' | 'premium' | 'enterprise';
    status: 'active' | 'inactive' | 'cancelled';
    expiresAt: Date;
  };
}

export interface OwnerPermission {
  restaurantId: string;
  role: 'owner' | 'manager' | 'staff';
  permissions: ('layout_edit' | 'bookings_manage' | 'menu_edit' | 'analytics_view' | 'staff_manage')[];
}

export interface RestaurantAnalytics {
  restaurantId: string;
  period: 'day' | 'week' | 'month' | 'year';
  metrics: {
    totalBookings: number;
    totalRevenue: number;
    averageRating: number;
    totalReviews: number;
    tableUtilization: number; // percentage
    popularTables: string[];
    peakHours: string[];
    cancelationRate: number;
  };
  tableMetrics: {
    tableId: string;
    bookingCount: number;
    utilization: number;
    averageDuration: number; // in minutes
    revenue: number;
  }[];
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  timestamp: Date;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form Types
export interface TableForm {
  number: string;
  seats: number;
  type: Table['type'];
  features: string[];
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ObstacleForm {
  type: Obstacle['type'];
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface LayoutForm {
  name: string;
  width: number;
  height: number;
  isTemplate: boolean;
  category?: LayoutTemplate['category'];
  description?: string;
}
