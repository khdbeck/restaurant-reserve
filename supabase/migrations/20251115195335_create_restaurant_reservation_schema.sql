/*
  # Restaurant Reservation System Database Schema

  ## Overview
  Complete database schema for a restaurant reservation platform with support for:
  - Restaurant management with layouts and tables
  - User authentication and profiles
  - Booking system with pre-orders
  - Reviews and ratings
  - Real-time table status updates

  ## Tables Created
  1. **profiles** - Extended user information
     - id (references auth.users)
     - name, phone, avatar_url
     - role (user, owner, admin)
     - created_at, updated_at

  2. **restaurants** - Restaurant information
     - id, name, slug, description
     - address, city, country
     - cuisine (array), features (array)
     - price_range, rating, review_count
     - opening_hours (jsonb)
     - images (array), owner_id
     - is_newly_joined, is_michelin_guide
     - created_at, updated_at

  3. **restaurant_layouts** - Table layouts for restaurants
     - id, restaurant_id, name
     - width, height
     - tables (jsonb array), obstacles (jsonb array)
     - is_template
     - created_at, updated_at

  4. **menu_items** - Restaurant menu items
     - id, restaurant_id, name, description
     - price, category
     - features (array), preparation_time
     - is_available, image_url
     - created_at, updated_at

  5. **bookings** - Reservation bookings
     - id, restaurant_id, user_id
     - customer_name, customer_email, customer_phone
     - booking_date, booking_time, guests
     - selected_table_id, special_requests
     - status (pending, confirmed, cancelled, completed)
     - payment_status, payment_amount, payment_intent_id
     - created_at, updated_at

  6. **booking_pre_orders** - Pre-ordered menu items for bookings
     - id, booking_id, menu_item_id
     - quantity, special_instructions
     - created_at

  7. **reviews** - Restaurant reviews
     - id, restaurant_id, user_id
     - rating, title, comment
     - verified, helpful_count
     - photos (array)
     - created_at, updated_at

  ## Security
  - RLS enabled on all tables
  - Policies for authenticated users to manage their own data
  - Restaurant owners can manage their restaurants
  - Public read access for restaurant information
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- PROFILES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'owner', 'admin')),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles"
    ON profiles FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON profiles FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

-- =====================================================
-- RESTAURANTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS restaurants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL DEFAULT 'Tashkent',
    country TEXT NOT NULL DEFAULT 'Uzbekistan',
    cuisine TEXT[] NOT NULL DEFAULT '{}',
    features TEXT[] NOT NULL DEFAULT '{}',
    price_range TEXT NOT NULL DEFAULT '$$' CHECK (price_range IN ('$', '$$', '$$$')),
    rating NUMERIC(3, 2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 10),
    review_count INTEGER DEFAULT 0 CHECK (review_count >= 0),
    opening_hours JSONB NOT NULL DEFAULT '{}',
    images TEXT[] NOT NULL DEFAULT '{}',
    owner_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    is_newly_joined BOOLEAN DEFAULT false,
    is_michelin_guide BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view restaurants"
    ON restaurants FOR SELECT
    TO authenticated, anon
    USING (true);

CREATE POLICY "Owners can insert restaurants"
    ON restaurants FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update own restaurants"
    ON restaurants FOR UPDATE
    TO authenticated
    USING (auth.uid() = owner_id)
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can delete own restaurants"
    ON restaurants FOR DELETE
    TO authenticated
    USING (auth.uid() = owner_id);

-- =====================================================
-- RESTAURANT LAYOUTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS restaurant_layouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    name TEXT NOT NULL DEFAULT 'Main Layout',
    width INTEGER NOT NULL DEFAULT 800 CHECK (width > 0),
    height INTEGER NOT NULL DEFAULT 600 CHECK (height > 0),
    tables JSONB NOT NULL DEFAULT '[]',
    obstacles JSONB NOT NULL DEFAULT '[]',
    is_template BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    UNIQUE(restaurant_id)
);

ALTER TABLE restaurant_layouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view layouts"
    ON restaurant_layouts FOR SELECT
    TO authenticated, anon
    USING (true);

CREATE POLICY "Restaurant owners can manage layouts"
    ON restaurant_layouts FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM restaurants
            WHERE restaurants.id = restaurant_layouts.restaurant_id
            AND restaurants.owner_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM restaurants
            WHERE restaurants.id = restaurant_layouts.restaurant_id
            AND restaurants.owner_id = auth.uid()
        )
    );

-- =====================================================
-- MENU ITEMS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price INTEGER NOT NULL CHECK (price >= 0),
    category TEXT NOT NULL,
    features TEXT[] DEFAULT '{}',
    preparation_time INTEGER CHECK (preparation_time > 0),
    is_available BOOLEAN DEFAULT true,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view menu items"
    ON menu_items FOR SELECT
    TO authenticated, anon
    USING (true);

CREATE POLICY "Restaurant owners can manage menu items"
    ON menu_items FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM restaurants
            WHERE restaurants.id = menu_items.restaurant_id
            AND restaurants.owner_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM restaurants
            WHERE restaurants.id = menu_items.restaurant_id
            AND restaurants.owner_id = auth.uid()
        )
    );

-- =====================================================
-- BOOKINGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    guests INTEGER NOT NULL CHECK (guests > 0 AND guests <= 20),
    selected_table_id TEXT,
    special_requests TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    payment_amount INTEGER CHECK (payment_amount >= 0),
    payment_intent_id TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bookings"
    ON bookings FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Restaurant owners can view their bookings"
    ON bookings FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM restaurants
            WHERE restaurants.id = bookings.restaurant_id
            AND restaurants.owner_id = auth.uid()
        )
    );

CREATE POLICY "Authenticated users can create bookings"
    ON bookings FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookings"
    ON bookings FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Restaurant owners can update their bookings"
    ON bookings FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM restaurants
            WHERE restaurants.id = bookings.restaurant_id
            AND restaurants.owner_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM restaurants
            WHERE restaurants.id = bookings.restaurant_id
            AND restaurants.owner_id = auth.uid()
        )
    );

-- =====================================================
-- BOOKING PRE-ORDERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS booking_pre_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    menu_item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    special_instructions TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE booking_pre_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own booking pre-orders"
    ON booking_pre_orders FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM bookings
            WHERE bookings.id = booking_pre_orders.booking_id
            AND bookings.user_id = auth.uid()
        )
    );

CREATE POLICY "Restaurant owners can view their booking pre-orders"
    ON booking_pre_orders FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM bookings
            JOIN restaurants ON restaurants.id = bookings.restaurant_id
            WHERE bookings.id = booking_pre_orders.booking_id
            AND restaurants.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can create booking pre-orders"
    ON booking_pre_orders FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM bookings
            WHERE bookings.id = booking_pre_orders.booking_id
            AND bookings.user_id = auth.uid()
        )
    );

-- =====================================================
-- REVIEWS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT NOT NULL,
    comment TEXT NOT NULL,
    verified BOOLEAN DEFAULT false,
    helpful_count INTEGER DEFAULT 0 CHECK (helpful_count >= 0),
    photos TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    UNIQUE(restaurant_id, user_id)
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reviews"
    ON reviews FOR SELECT
    TO authenticated, anon
    USING (true);

CREATE POLICY "Authenticated users can create reviews"
    ON reviews FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
    ON reviews FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews"
    ON reviews FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_restaurants_slug ON restaurants(slug);
CREATE INDEX IF NOT EXISTS idx_restaurants_city ON restaurants(city);
CREATE INDEX IF NOT EXISTS idx_restaurants_owner ON restaurants(owner_id);
CREATE INDEX IF NOT EXISTS idx_restaurants_rating ON restaurants(rating DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_restaurant ON bookings(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(booking_date, booking_time);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_reviews_restaurant ON reviews(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_restaurant ON menu_items(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category);

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_restaurants_updated_at BEFORE UPDATE ON restaurants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_restaurant_layouts_updated_at BEFORE UPDATE ON restaurant_layouts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON menu_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update restaurant rating when reviews change
CREATE OR REPLACE FUNCTION update_restaurant_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE restaurants
    SET 
        rating = (
            SELECT ROUND(AVG(rating)::numeric, 2)
            FROM reviews
            WHERE restaurant_id = COALESCE(NEW.restaurant_id, OLD.restaurant_id)
        ),
        review_count = (
            SELECT COUNT(*)
            FROM reviews
            WHERE restaurant_id = COALESCE(NEW.restaurant_id, OLD.restaurant_id)
        )
    WHERE id = COALESCE(NEW.restaurant_id, OLD.restaurant_id);
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Apply rating update trigger
CREATE TRIGGER update_restaurant_rating_on_review_insert
    AFTER INSERT ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_restaurant_rating();

CREATE TRIGGER update_restaurant_rating_on_review_update
    AFTER UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_restaurant_rating();

CREATE TRIGGER update_restaurant_rating_on_review_delete
    AFTER DELETE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_restaurant_rating();
