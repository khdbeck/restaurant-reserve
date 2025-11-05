import type { Restaurant, Statistics, BlogPost, Award, Review, RestaurantLayout, MenuItem } from './types';

// Mock restaurant layouts
export const mockLayouts: Record<string, RestaurantLayout> = {
  'besh-qozon': {
    id: 'layout-1',
    name: 'Main Dining Hall',
    width: 800,
    height: 600,
    tables: [
      // Front section
      { id: 't1', number: '1', x: 100, y: 100, width: 80, height: 80, seats: 4, type: 'round', status: 'available', features: ['window view'] },
      { id: 't2', number: '2', x: 220, y: 100, width: 80, height: 80, seats: 4, type: 'round', status: 'available' },
      { id: 't3', number: '3', x: 340, y: 100, width: 80, height: 80, seats: 4, type: 'round', status: 'occupied' },
      { id: 't4', number: '4', x: 460, y: 100, width: 80, height: 80, seats: 4, type: 'round', status: 'available', features: ['window view'] },
      { id: 't5', number: '5', x: 580, y: 100, width: 80, height: 80, seats: 4, type: 'round', status: 'available' },

      // Center section - VIP area
      { id: 't6', number: '6', x: 300, y: 250, width: 100, height: 100, seats: 8, type: 'round', status: 'available', features: ['private', 'premium'] },
      { id: 't7', number: '7', x: 150, y: 300, width: 80, height: 80, seats: 6, type: 'round', status: 'available' },
      { id: 't8', number: '8', x: 450, y: 300, width: 80, height: 80, seats: 6, type: 'round', status: 'reserved' },

      // Back section
      { id: 't9', number: '9', x: 100, y: 450, width: 60, height: 120, seats: 6, type: 'rectangle', status: 'available' },
      { id: 't10', number: '10', x: 200, y: 450, width: 80, height: 80, seats: 4, type: 'square', status: 'available' },
      { id: 't11', number: '11', x: 320, y: 450, width: 80, height: 80, seats: 4, type: 'square', status: 'available' },
      { id: 't12', number: '12', x: 440, y: 450, width: 80, height: 80, seats: 4, type: 'square', status: 'occupied' },
      { id: 't13', number: '13', x: 560, y: 450, width: 80, height: 80, seats: 4, type: 'square', status: 'available' },
    ],
    obstacles: [
      { id: 'entrance1', type: 'entrance', x: 50, y: 0, width: 100, height: 20, label: 'Main Entrance' },
      { id: 'entrance2', type: 'entrance', x: 550, y: 0, width: 100, height: 20, label: 'Side Entrance' },
      { id: 'kitchen', type: 'kitchen', x: 700, y: 200, width: 100, height: 200, label: 'Kitchen' },
      { id: 'bar', type: 'bar', x: 50, y: 200, width: 60, height: 150, label: 'Bar' },
      { id: 'restroom', type: 'restroom', x: 700, y: 500, width: 80, height: 60, label: 'Restroom' },
    ]
  },
  'yujanin': {
    id: 'layout-2',
    name: 'Cozy Dining Room',
    width: 600,
    height: 500,
    tables: [
      { id: 't1', number: '1', x: 80, y: 80, width: 80, height: 80, seats: 2, type: 'round', status: 'available', features: ['cozy corner'] },
      { id: 't2', number: '2', x: 200, y: 80, width: 80, height: 80, seats: 2, type: 'round', status: 'available' },
      { id: 't3', number: '3', x: 320, y: 80, width: 80, height: 80, seats: 2, type: 'round', status: 'occupied' },
      { id: 't4', number: '4', x: 440, y: 80, width: 80, height: 80, seats: 2, type: 'round', status: 'available' },

      { id: 't5', number: '5', x: 140, y: 220, width: 100, height: 60, seats: 6, type: 'rectangle', status: 'available', features: ['family table'] },
      { id: 't6', number: '6', x: 300, y: 220, width: 100, height: 60, seats: 6, type: 'rectangle', status: 'available' },

      { id: 't7', number: '7', x: 80, y: 350, width: 80, height: 80, seats: 4, type: 'square', status: 'available' },
      { id: 't8', number: '8', x: 200, y: 350, width: 80, height: 80, seats: 4, type: 'square', status: 'reserved' },
      { id: 't9', number: '9', x: 320, y: 350, width: 80, height: 80, seats: 4, type: 'square', status: 'available' },
      { id: 't10', number: '10', x: 440, y: 350, width: 80, height: 80, seats: 4, type: 'square', status: 'available' },
    ],
    obstacles: [
      { id: 'entrance1', type: 'entrance', x: 250, y: 0, width: 100, height: 20, label: 'Entrance' },
      { id: 'kitchen', type: 'kitchen', x: 520, y: 150, width: 80, height: 150, label: 'Kitchen' },
      { id: 'restroom', type: 'restroom', x: 520, y: 350, width: 60, height: 60, label: 'Restroom' },
    ]
  },
  'sultan-saray': {
    id: 'layout-3',
    name: 'Palatial Hall',
    width: 900,
    height: 700,
    tables: [
      // VIP section
      { id: 't1', number: '1', x: 150, y: 100, width: 120, height: 120, seats: 10, type: 'round', status: 'available', features: ['premium', 'private'] },
      { id: 't2', number: '2', x: 350, y: 100, width: 120, height: 120, seats: 10, type: 'round', status: 'available', features: ['premium'] },
      { id: 't3', number: '3', x: 550, y: 100, width: 120, height: 120, seats: 10, type: 'round', status: 'reserved', features: ['premium'] },

      // Main dining area
      { id: 't4', number: '4', x: 100, y: 300, width: 80, height: 80, seats: 6, type: 'round', status: 'available' },
      { id: 't5', number: '5', x: 220, y: 300, width: 80, height: 80, seats: 6, type: 'round', status: 'available' },
      { id: 't6', number: '6', x: 340, y: 300, width: 80, height: 80, seats: 6, type: 'round', status: 'occupied' },
      { id: 't7', number: '7', x: 460, y: 300, width: 80, height: 80, seats: 6, type: 'round', status: 'available' },
      { id: 't8', number: '8', x: 580, y: 300, width: 80, height: 80, seats: 6, type: 'round', status: 'available' },
      { id: 't9', number: '9', x: 700, y: 300, width: 80, height: 80, seats: 6, type: 'round', status: 'available' },

      // Bar seating
      { id: 't10', number: '10', x: 120, y: 500, width: 60, height: 100, seats: 4, type: 'rectangle', status: 'available', features: ['bar seating'] },
      { id: 't11', number: '11', x: 200, y: 500, width: 60, height: 100, seats: 4, type: 'rectangle', status: 'available', features: ['bar seating'] },
      { id: 't12', number: '12', x: 280, y: 500, width: 60, height: 100, seats: 4, type: 'rectangle', status: 'available', features: ['bar seating'] },
    ],
    obstacles: [
      { id: 'entrance1', type: 'entrance', x: 400, y: 0, width: 150, height: 30, label: 'Grand Entrance' },
      { id: 'kitchen', type: 'kitchen', x: 750, y: 150, width: 150, height: 250, label: 'Kitchen' },
      { id: 'bar', type: 'bar', x: 50, y: 450, width: 350, height: 80, label: 'Bar Counter' },
      { id: 'stage', type: 'stage', x: 450, y: 550, width: 200, height: 120, label: 'Performance Stage' },
      { id: 'restroom', type: 'restroom', x: 750, y: 550, width: 100, height: 80, label: 'Restroom' },
    ]
  }
};

// Mock restaurant menus
export const mockMenus: Record<string, MenuItem[]> = {
  'besh-qozon': [
    { id: 'm1', name: 'Traditional Wedding Plov', description: 'Aromatic basmati rice with tender lamb, carrots, and traditional spices cooked in kazan', price: 45000, category: 'Plov', features: ['signature', 'popular'], preparationTime: 25 },
    { id: 'm2', name: 'Chicken Plov', description: 'Lighter version with juicy chicken pieces and fragrant rice', price: 35000, category: 'Plov', preparationTime: 20 },
    { id: 'm3', name: 'Vegetarian Plov', description: 'Rice with seasonal vegetables, chickpeas, and aromatic herbs', price: 28000, category: 'Plov', features: ['vegetarian'], preparationTime: 18 },
    { id: 'm4', name: 'Assorted Uzbek Salads', description: 'Traditional achichuk, Korean carrot salad, and pickled vegetables', price: 15000, category: 'Appetizers' },
    { id: 'm5', name: 'Fresh Tandoor Bread', description: 'Hot non bread baked in traditional tandoor oven', price: 3000, category: 'Appetizers', features: ['fresh', 'traditional'] },
    { id: 'm6', name: 'Somsa (4 pieces)', description: 'Flaky pastry filled with spiced lamb and onions', price: 12000, category: 'Appetizers', features: ['popular'] },
    { id: 'm7', name: 'Shashlik Lamb', description: 'Grilled lamb skewers marinated in traditional spices', price: 38000, category: 'Grilled', preparationTime: 15 },
    { id: 'm8', name: 'Lagman Soup', description: 'Hand-pulled noodles in rich beef broth with vegetables', price: 22000, category: 'Soups', preparationTime: 12 },
    { id: 'm9', name: 'Manta (6 pieces)', description: 'Large steamed dumplings filled with seasoned lamb', price: 25000, category: 'Dumplings', preparationTime: 20 },
    { id: 'm10', name: 'Green Tea (Pot)', description: 'Traditional Uzbek green tea served in authentic teapot', price: 8000, category: 'Beverages' },
    { id: 'm11', name: 'Fresh Pomegranate Juice', description: 'Freshly squeezed pomegranate juice', price: 12000, category: 'Beverages' },
    { id: 'm12', name: 'Ayran', description: 'Traditional yogurt drink', price: 6000, category: 'Beverages' },
    { id: 'm13', name: 'Halva Assortment', description: 'Traditional Uzbek sweets with nuts and honey', price: 15000, category: 'Desserts' },
    { id: 'm14', name: 'Chak-chak', description: 'Honey-glazed fried dough traditional dessert', price: 12000, category: 'Desserts', features: ['traditional'] },
  ],

  'yujanin': [
    { id: 'm1', name: 'Hand-pulled Lagman', description: 'Fresh hand-pulled noodles with beef and vegetables in savory broth', price: 24000, category: 'Noodles', features: ['signature', 'handmade'], preparationTime: 15 },
    { id: 'm2', name: 'Uyghur Polo', description: 'Rice dish with lamb and vegetables in Uyghur style', price: 32000, category: 'Rice Dishes', preparationTime: 20 },
    { id: 'm3', name: 'Laghman Fried', description: 'Stir-fried hand-pulled noodles with meat and vegetables', price: 26000, category: 'Noodles', preparationTime: 12 },
    { id: 'm4', name: 'Steamed Manta', description: 'Large steamed dumplings with spiced lamb filling', price: 28000, category: 'Dumplings', features: ['popular'], preparationTime: 18 },
    { id: 'm5', name: 'Fried Manta', description: 'Crispy fried version of traditional manta', price: 30000, category: 'Dumplings', preparationTime: 15 },
    { id: 'm6', name: 'Small Chuchvara', description: 'Small boiled dumplings in clear broth', price: 18000, category: 'Dumplings', preparationTime: 10 },
    { id: 'm7', name: 'Uyghur Salad', description: 'Fresh vegetables with Uyghur spices and herbs', price: 14000, category: 'Appetizers', features: ['fresh'] },
    { id: 'm8', name: 'Pickled Vegetables', description: 'Assorted pickled vegetables traditional style', price: 8000, category: 'Appetizers' },
    { id: 'm9', name: 'Uyghur Tea', description: 'Special blend of tea with traditional spices', price: 10000, category: 'Beverages', features: ['traditional'] },
    { id: 'm10', name: 'Fruit Kompot', description: 'Homemade fruit drink', price: 8000, category: 'Beverages' },
  ],

  'sultan-saray': [
    { id: 'm1', name: 'Royal Shashlik Platter', description: 'Premium cuts of lamb and beef grilled to perfection with royal spices', price: 65000, category: 'Grilled', features: ['signature', 'premium'], preparationTime: 20 },
    { id: 'm2', name: 'Palace Plov', description: 'Exquisite plov with saffron, premium lamb, and exotic spices', price: 55000, category: 'Plov', features: ['signature'], preparationTime: 30 },
    { id: 'm3', name: 'Sultan Meze', description: 'Assorted royal appetizers with caviar and delicacies', price: 85000, category: 'Appetizers', features: ['premium'], preparationTime: 15 },
    { id: 'm4', name: 'Tandoor Royal Bread', description: 'Fresh bread with gold flakes baked in tandoor', price: 8000, category: 'Appetizers', features: ['premium', 'traditional'] },
    { id: 'm5', name: 'Samarkand Lagman', description: 'Hand-pulled noodles in rich royal broth with premium meat', price: 35000, category: 'Soups', preparationTime: 18 },
    { id: 'm6', name: 'Imperial Tea Service', description: 'Premium tea selection with royal sweets and honey', price: 25000, category: 'Beverages', features: ['premium'] },
    { id: 'm7', name: 'Royal Dessert Platter', description: 'Assorted traditional sweets with gold decoration', price: 45000, category: 'Desserts', features: ['premium'] },
  ]
};

export const mockReviews: Review[] = [
  {
    id: 'review-1',
    restaurantId: 'besh-qozon',
    userId: 'user-1',
    userName: 'Ahmad Karimov',
    userEmail: 'ahmad@example.uz',
    rating: 5,
    title: 'Incredible Traditional Plov Experience!',
    comment: 'This is hands down the best plov in Tashkent! The rice was perfectly cooked, the lamb was tender and flavorful. The traditional kazan cooking really makes a difference. Service was excellent and the atmosphere authentic.',
    date: new Date('2024-12-15'),
    verified: true,
    helpful: 23,
    photos: ['https://dynamic-media-cdn.tripadvisor.com/media/photo-o/30/16/91/f2/caption.jpg?w=900&h=500&s=1']
  },
  {
    id: 'review-2',
    restaurantId: 'besh-qozon',
    userId: 'user-2',
    userName: 'Sitora Nazarova',
    userEmail: 'sitora@example.uz',
    rating: 4,
    title: 'Great Food, Busy Place',
    comment: 'Amazing plov and traditional atmosphere. The wedding plov was exceptional. Only downside was the wait time during peak hours, but definitely worth it!',
    date: new Date('2024-12-10'),
    verified: true,
    helpful: 15
  },
  {
    id: 'review-3',
    restaurantId: 'yujanin',
    userId: 'user-3',
    userName: 'James Wilson',
    userEmail: 'james@example.com',
    rating: 5,
    title: 'Hidden Gem for Authentic Uzbek Cuisine',
    comment: 'Found this place through Tablein and what a discovery! The hand-pulled lagman noodles were incredible, and the manta dumplings were the best I\'ve had. Very authentic neighborhood feel.',
    date: new Date('2024-12-20'),
    verified: true,
    helpful: 18
  },
  {
    id: 'review-4',
    restaurantId: 'sultan-saray',
    userId: 'user-4',
    userName: 'Farrukh Abdullayev',
    userEmail: 'farrukh@example.uz',
    rating: 5,
    title: 'Royal Dining Experience',
    comment: 'Absolutely magnificent! The palatial interior sets the perfect mood for special occasions. The tandoor bread was fresh and the shashlik was grilled to perfection. Perfect for celebrations.',
    date: new Date('2024-12-18'),
    verified: true,
    helpful: 31
  },
  {
    id: 'review-5',
    restaurantId: 'bibikhanum',
    userId: 'user-5',
    userName: 'Maria Garcia',
    userEmail: 'maria@example.com',
    rating: 5,
    title: 'Fine Dining at Its Best',
    comment: 'The tasting menu was an amazing journey through Uzbek flavors with modern presentation. Each dish was beautifully plated and the wine pairing was excellent. Highly recommend for special occasions.',
    date: new Date('2024-12-12'),
    verified: true,
    helpful: 27
  },
  {
    id: 'review-6',
    restaurantId: 'chaykhana-navvot',
    userId: 'user-6',
    userName: 'Rustam Umarov',
    userEmail: 'rustam@example.uz',
    rating: 4,
    title: 'Authentic Tea House Experience',
    comment: 'Love the traditional carpet seating and the authentic atmosphere in Chorsu Bazaar. The tea selection is excellent and the sweets are delicious. Great place to experience local culture.',
    date: new Date('2024-12-08'),
    verified: true,
    helpful: 12
  }
];

// Helper function to get reviews for a restaurant
export const getRestaurantReviews = (restaurantId: string): Review[] => {
  return mockReviews.filter(review => review.restaurantId === restaurantId);
};

// Helper function to calculate average rating from reviews
export const calculateAverageRating = (reviews: Review[]): number => {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
};

export const mockRestaurants: Restaurant[] = [
  {
    id: 'besh-qozon',
    name: 'Besh-Qozon',
    slug: 'besh-qozon',
    address: 'Amir Temur Avenue 107B, Yunusabad District, Tashkent 100084, Uzbekistan',
    city: 'Tashkent',
    country: 'Uzbekistan',
    image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/30/16/91/f2/caption.jpg?w=900&h=500&s=1',
    images: [
      'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/30/16/91/f2/caption.jpg?w=900&h=500&s=1',
      'https://english.news.cn/asiapacific/20230916/eb49afc160cf40599c7386c024430d67/20230916eb49afc160cf40599c7386c024430d67_202309165c6ff9c462754f62b780a486c73531ad.jpg'
    ],
    rating: 9.2,
    reviewCount: 342,
    priceRange: '$$',
    cuisine: ['Uzbek', 'Central Asian'],
    description: 'Legendary restaurant famous for authentic Uzbek plov (pilaf) cooked in traditional kazan. Home to the best wedding plov in Tashkent with fragrant basmati rice, tender lamb, and aromatic spices.',
    features: ['Traditional Kazan Cooking', 'Wedding Plov', 'Live Music', 'Hookah Lounge'],
    openingHours: {
      monday: { open: '10:00', close: '23:00' },
      tuesday: { open: '10:00', close: '23:00' },
      wednesday: { open: '10:00', close: '23:00' },
      thursday: { open: '10:00', close: '23:00' },
      friday: { open: '10:00', close: '24:00' },
      saturday: { open: '10:00', close: '24:00' },
      sunday: { open: '10:00', close: '23:00' }
    },
    recentlyBooked: '15 minutes ago',
    reviews: getRestaurantReviews('besh-qozon'),
    layout: mockLayouts['besh-qozon'],
    menu: mockMenus['besh-qozon']
  },
  {
    id: 'yujanin',
    name: 'Южанин',
    slug: 'yujanin',
    address: 'ул. Туркистон, д. 12А, Ташкент Узбекистан',
    city: 'Tashkent',
    country: 'Uzbekistan',
    image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2e/b4/50/1f/caption.jpg?w=1000&h=600&s=1',
    images: [
      'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2e/b4/50/1f/caption.jpg?w=1000&h=600&s=1',
      'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2b/e5/d4/c2/caption.jpg?w=1000&h=600&s=1',
      'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2e/69/58/e8/caption.jpg?w=1000&h=600&s=1',
      'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2e/69/58/ed/caption.jpg?w=1000&h=600&s=1',
      'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2e/69/58/de/caption.jpg?w=1000&h=600&s=1'
    ],
    rating: 9.4,
    reviewCount: 567,
    priceRange: '$$',
    cuisine: ['Uzbek', 'Uyghur'],
    description: 'Cozy neighborhood restaurant serving authentic Uzbek and Uyghur cuisine. Famous for hand-pulled lagman noodles, tender manta dumplings, and traditional atmosphere.',
    features: ['Hand-pulled Noodles', 'Traditional Interior', 'Family Style'],
    openingHours: {
      monday: { open: '12:00', close: '22:00' },
      tuesday: { open: '12:00', close: '22:00' },
      wednesday: { open: '12:00', close: '22:00' },
      thursday: { open: '12:00', close: '22:00' },
      friday: { open: '12:00', close: '23:00' },
      saturday: { open: '12:00', close: '23:00' },
      sunday: { open: '12:00', close: '22:00' }
    },
    recentlyBooked: '25 minutes ago',
    reviews: getRestaurantReviews('yujanin'),
    layout: mockLayouts.yujanin,
    menu: mockMenus.yujanin
  },
  {
    id: 'sultan-saray',
    name: 'Sultan Saray',
    slug: 'sultan-saray',
    address: 'Islam Karimov Street 45, Shaykhantaur District, Tashkent 100031, Uzbekistan',
    city: 'Tashkent',
    country: 'Uzbekistan',
    image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2a/10/50/ce/ember-bar-side.jpg?w=1000&h=-1&s=1',
    images: [
      'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2a/10/50/ce/ember-bar-side.jpg?w=1000&h=-1&s=1'
    ],
    rating: 8.9,
    reviewCount: 289,
    priceRange: '$$$',
    cuisine: ['Uzbek', 'Oriental'],
    description: 'Elegant restaurant offering the finest Uzbek cuisine in palatial surroundings. Specializes in royal-style shashlik, aromatic plov, and traditional bread baked in tandoor ovens.',
    features: ['Palatial Interior', 'Tandoor Bread', 'Hookah Lounge', 'Live Entertainment'],
    openingHours: {
      monday: { open: '11:00', close: '23:00' },
      tuesday: { open: '11:00', close: '23:00' },
      wednesday: { open: '11:00', close: '23:00' },
      thursday: { open: '11:00', close: '23:00' },
      friday: { open: '11:00', close: '24:00' },
      saturday: { open: '11:00', close: '24:00' },
      sunday: { open: '11:00', close: '23:00' }
    },
    isNewlyJoined: true,
    recentlyBooked: 'an hour ago',
    reviews: getRestaurantReviews('sultan-saray'),
    layout: mockLayouts['sultan-saray'],
    menu: mockMenus['sultan-saray']
  },
  {
    id: 'bakhtiyor',
    name: 'Bakhtiyor',
    slug: 'bakhtiyor',
    address: 'Buyuk Ipak Yoli Street 78, Chilanzar District, Tashkent 100115, Uzbekistan',
    city: 'Tashkent',
    country: 'Uzbekistan',
    image: 'https://ext.same-assets.com/3176126672/873282675.jpeg',
    images: [
      'https://ext.same-assets.com/3176126672/873282675.jpeg'
    ],
    rating: 8.7,
    reviewCount: 423,
    priceRange: '$$',
    cuisine: ['Uzbek', 'Home Style'],
    description: 'Family-run restaurant serving home-style Uzbek dishes. Famous for grandmother\'s recipe manta, hearty shurpa soup, and fresh baked somsa pastries.',
    features: ['Family Recipes', 'Fresh Somsa', 'Home Cooking'],
    openingHours: {
      monday: { open: '09:00', close: '21:00' },
      tuesday: { open: '09:00', close: '21:00' },
      wednesday: { open: '09:00', close: '21:00' },
      thursday: { open: '09:00', close: '21:00' },
      friday: { open: '09:00', close: '22:00' },
      saturday: { open: '09:00', close: '22:00' },
      sunday: { open: '10:00', close: '21:00' }
    },
    recentlyBooked: 'an hour ago',
    reviews: []
  },
  {
    id: 'osh-markazi',
    name: 'Osh Markazi',
    slug: 'osh-markazi',
    address: 'Mustaqillik Square 12, Mirobod District, Tashkent 100047, Uzbekistan',
    city: 'Tashkent',
    country: 'Uzbekistan',
    image: 'https://ext.same-assets.com/3176126672/4104570990.jpeg',
    images: [
      'https://ext.same-assets.com/3176126672/4104570990.jpeg'
    ],
    rating: 9.1,
    reviewCount: 678,
    priceRange: '$$$',
    cuisine: ['Uzbek', 'Ferghana Valley'],
    description: 'Premium plov house specializing in Ferghana Valley style osh (plov). Features different regional variations of the national dish with perfectly seasoned rice and quality lamb.',
    features: ['Regional Plov Varieties', 'Premium Ingredients', 'Traditional Service'],
    openingHours: {
      monday: { open: '11:00', close: '22:00' },
      tuesday: { open: '11:00', close: '22:00' },
      wednesday: { open: '11:00', close: '22:00' },
      thursday: { open: '11:00', close: '22:00' },
      friday: { open: '11:00', close: '23:00' },
      saturday: { open: '11:00', close: '23:00' },
      sunday: { open: '11:00', close: '22:00' }
    },
    recentlyBooked: 'an hour ago',
    reviews: []
  },
  {
    id: 'caravan',
    name: 'Caravan',
    slug: 'caravan',
    address: 'Registan Street 28, Old City, Tashkent 100000, Uzbekistan',
    city: 'Tashkent',
    country: 'Uzbekistan',
    image: 'https://ext.same-assets.com/3176126672/4053546852.jpeg',
    images: [
      'https://ext.same-assets.com/3176126672/4053546852.jpeg'
    ],
    rating: 9.3,
    reviewCount: 445,
    priceRange: '$$$',
    cuisine: ['Uzbek', 'Silk Road'],
    description: 'Historic restaurant in traditional Uzbek architecture serving authentic Silk Road cuisine. Features ancient recipes, traditional music, and cultural performances.',
    features: ['Historic Building', 'Cultural Shows', 'Traditional Music', 'Silk Road Cuisine'],
    openingHours: {
      monday: { open: '12:00', close: '22:00' },
      tuesday: { open: '12:00', close: '22:00' },
      wednesday: { open: '12:00', close: '22:00' },
      thursday: { open: '12:00', close: '22:00' },
      friday: { open: '12:00', close: '23:00' },
      saturday: { open: '12:00', close: '23:00' },
      sunday: { open: '12:00', close: '22:00' }
    },
    recentlyBooked: '2 hours ago',
    reviews: []
  },
  {
    id: 'bibikhanum',
    name: 'Bibikhanum',
    slug: 'bibikhanum',
    address: 'Navoi Street 156, Almazar District, Tashkent 100060, Uzbekistan',
    city: 'Tashkent',
    country: 'Uzbekistan',
    image: 'https://ext.same-assets.com/3176126672/183576916.jpeg',
    images: [
      'https://ext.same-assets.com/3176126672/183576916.jpeg'
    ],
    rating: 9.6,
    reviewCount: 234,
    priceRange: '$$$',
    cuisine: ['Uzbek', 'Fine Dining'],
    description: 'Upscale restaurant offering refined Uzbek cuisine with modern presentation. Seasonal menu featuring premium local ingredients and innovative takes on traditional dishes.',
    features: ['Seasonal Menu', 'Fine Dining', 'Wine Pairing', 'Modern Uzbek'],
    openingHours: {
      monday: { closed: true, open: '', close: '' },
      tuesday: { open: '18:00', close: '23:00' },
      wednesday: { open: '18:00', close: '23:00' },
      thursday: { open: '18:00', close: '23:00' },
      friday: { open: '18:00', close: '23:00' },
      saturday: { open: '18:00', close: '23:00' },
      sunday: { closed: true, open: '', close: '' }
    },
    isNewlyJoined: true,
    reviews: getRestaurantReviews('bibikhanum')
  },
  {
    id: 'chaykhana-navvot',
    name: 'Chaykhana Navvot',
    slug: 'chaykhana-navvot',
    address: 'Chorsu Bazaar, Eski Shahar District, Tashkent 100020, Uzbekistan',
    city: 'Tashkent',
    country: 'Uzbekistan',
    image: 'https://ext.same-assets.com/3176126672/2667429207.jpeg',
    images: [
      'https://ext.same-assets.com/3176126672/2667429207.jpeg'
    ],
    rating: 8.8,
    reviewCount: 156,
    priceRange: '$',
    cuisine: ['Uzbek', 'Tea House'],
    description: 'Traditional tea house in historic Chorsu Bazaar. Authentic atmosphere with carpet seating, serving fresh tea, traditional sweets, and light Uzbek snacks.',
    features: ['Traditional Seating', 'Fresh Tea', 'Bazaar Location', 'Local Sweets'],
    openingHours: {
      monday: { open: '08:00', close: '20:00' },
      tuesday: { open: '08:00', close: '20:00' },
      wednesday: { open: '08:00', close: '20:00' },
      thursday: { open: '08:00', close: '20:00' },
      friday: { open: '08:00', close: '21:00' },
      saturday: { open: '08:00', close: '21:00' },
      sunday: { open: '09:00', close: '20:00' }
    },
    isNewlyJoined: true,
    recentlyBooked: '3 hours ago',
    reviews: getRestaurantReviews('chaykhana-navvot')
  }
];

export const mockStatistics: Statistics = {
  totalGuests: 1250000,
  guestsLastMonth: 45600,
  guestsLastWeek: 12200,
  guestsYesterday: 1890,
  totalRestaurants: 89
};

export const mockBlogPosts: BlogPost[] = [
  {
    id: 'best-plov-tashkent-2025',
    title: 'Best Plov Houses in Tashkent: Complete Guide 2025',
    slug: 'best-plov-tashkent-2025',
    excerpt: 'Discover the finest plov restaurants in Tashkent, from traditional wedding plov to regional specialties.',
    content: 'Plov, the national dish of Uzbekistan, reaches its pinnacle in Tashkent...',
    image: 'https://ext.same-assets.com/3176126672/430023779.jpeg',
    author: 'Tablein Tashkent',
    publishedDate: new Date('2024-10-29'),
    tags: ['Plov', 'Traditional Food', 'Tashkent Guide']
  },
  {
    id: 'uzbek-tea-culture',
    title: 'Tea Culture in Uzbekistan: Guide to Chaykhanas',
    slug: 'uzbek-tea-culture',
    excerpt: 'Explore the rich tea culture of Uzbekistan through its traditional tea houses.',
    content: 'Tea culture is deeply rooted in Uzbek tradition...',
    image: 'https://ext.same-assets.com/3176126672/3395866656.jpeg',
    author: 'Tablein Tashkent',
    publishedDate: new Date('2024-03-28'),
    tags: ['Tea Culture', 'Chaykhana', 'Tradition']
  },
  {
    id: 'silk-road-cuisine',
    title: 'Silk Road Flavors: Culinary Heritage of Tashkent',
    slug: 'silk-road-cuisine',
    excerpt: 'Journey through the flavors that shaped Uzbek cuisine along the ancient Silk Road.',
    content: 'The Silk Road brought together flavors from across Central Asia...',
    image: 'https://ext.same-assets.com/3176126672/1202496891.jpeg',
    author: 'Tablein Tashkent',
    publishedDate: new Date('2024-01-04'),
    tags: ['Silk Road', 'History', 'Cuisine']
  }
];

export const mockAwards: Award[] = [
  { id: '1', restaurantId: 'bibikhanum', year: 2024, category: 'Best Fine Dining', rank: 1 },
  { id: '2', restaurantId: 'yujanin', year: 2024, category: 'Best Traditional', rank: 1 },
  { id: '3', restaurantId: 'caravan', year: 2024, category: 'Best Cultural Experience', rank: 1 },
  { id: '4', restaurantId: 'besh-qozon', year: 2024, category: 'Best Plov', rank: 1 }
];

// Helper function to get recently booked restaurants
export const getRecentlyBookedRestaurants = () => {
  return mockRestaurants.filter(r => r.recentlyBooked);
};

// Helper function to get best rated restaurants
export const getBestRatedRestaurants = () => {
  return mockRestaurants
    .filter(r => r.rating > 0)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 12);
};

// Helper function to get newly joined restaurants
export const getNewlyJoinedRestaurants = () => {
  return mockRestaurants.filter(r => r.isNewlyJoined);
};
