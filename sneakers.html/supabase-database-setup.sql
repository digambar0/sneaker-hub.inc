-- ============================================
-- SNEAKERHUB DATABASE SETUP FOR SUPABASE
-- ============================================

-- NOTE: If you get "already exists" errors, run supabase-cleanup.sql first

-- 1. CREATE PRODUCTS TABLE
-- ============================================
DROP TABLE IF EXISTS products CASCADE;

CREATE TABLE products (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  gender TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  rating DECIMAL(2,1) DEFAULT 4.5,
  review_count INTEGER DEFAULT 0,
  badge TEXT,
  image_url TEXT,
  stock INTEGER DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read products
CREATE POLICY "Allow public read access" ON products
  FOR SELECT USING (true);

-- Only authenticated users can insert/update (for admin)
CREATE POLICY "Allow authenticated insert" ON products
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update" ON products
  FOR UPDATE USING (auth.role() = 'authenticated');


-- 2. CREATE ORDERS TABLE
-- ============================================
DROP TABLE IF EXISTS orders CASCADE;

CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  user_email TEXT NOT NULL,
  items JSONB NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  shipping DECIMAL(10,2) NOT NULL,
  tax DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  shipping_address JSONB NOT NULL,
  payment_method TEXT NOT NULL,
  tracking_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Allow public to view orders by email (for guest checkout)
CREATE POLICY "Users can view orders by email" ON orders
  FOR SELECT USING (true);

-- Allow public to create orders (for guest checkout)
CREATE POLICY "Users can create orders" ON orders
  FOR INSERT WITH CHECK (true);


-- 3. CREATE CONTACT SUBMISSIONS TABLE
-- ============================================
DROP TABLE IF EXISTS contact_submissions CASCADE;

CREATE TABLE contact_submissions (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit contact forms
CREATE POLICY "Allow public insert" ON contact_submissions
  FOR INSERT WITH CHECK (true);


-- 4. CREATE NEWSLETTER SUBSCRIBERS TABLE
-- ============================================
DROP TABLE IF EXISTS newsletter_subscribers CASCADE;

CREATE TABLE newsletter_subscribers (
  id BIGSERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow anyone to subscribe
CREATE POLICY "Allow public subscribe" ON newsletter_subscribers
  FOR INSERT WITH CHECK (true);


-- 5. CREATE WISHLIST TABLE
-- ============================================
DROP TABLE IF EXISTS wishlist CASCADE;

CREATE TABLE wishlist (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  product_id INTEGER REFERENCES products(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Enable Row Level Security
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;

-- Users can only see their own wishlist
CREATE POLICY "Users can view own wishlist" ON wishlist
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own wishlist" ON wishlist
  FOR ALL USING (auth.uid() = user_id);


-- ============================================
-- INSERT ALL PRODUCTS DATA
-- ============================================

-- MEN'S PRODUCTS (IDs 101-110)
-- ============================================
INSERT INTO products (id, name, category, gender, price, description, rating, review_count, badge) VALUES
(101, 'Air Max Pro', 'running', 'men', 129.99, 'Premium running shoes with advanced cushioning technology', 5.0, 98, 'new'),
(102, 'Urban Runner', 'lifestyle', 'men', 149.99, 'Stylish urban sneakers for everyday wear', 5.0, 112, NULL),
(103, 'Power Trainer', 'training', 'men', 119.99, 'High-performance training shoes', 4.0, 76, 'sale'),
(104, 'Elite Performance', 'basketball', 'men', 179.99, 'Professional basketball shoes with superior grip', 5.0, 143, NULL),
(105, 'Speed Racer', 'running', 'men', 139.99, 'Lightweight running shoes for speed', 5.0, 87, NULL),
(106, 'Classic Leather', 'lifestyle', 'men', 159.99, 'Premium leather sneakers with timeless design', 5.0, 134, 'new'),
(107, 'CrossFit Pro', 'training', 'men', 134.99, 'Versatile training shoes for CrossFit', 4.0, 92, NULL),
(108, 'Court Master', 'basketball', 'men', 169.99, 'High-top basketball shoes with ankle support', 5.0, 156, 'sale'),
(109, 'Marathon Elite', 'running', 'men', 144.99, 'Long-distance running shoes with maximum comfort', 5.0, 201, NULL),
(110, 'Street Style', 'lifestyle', 'men', 124.99, 'Modern street-style sneakers', 4.0, 84, NULL);

-- WOMEN'S PRODUCTS (IDs 201-210)
-- ============================================
INSERT INTO products (id, name, category, gender, price, description, rating, review_count, badge) VALUES
(201, 'Air Zoom Pegasus', 'running', 'women', 124.99, 'Comfortable running shoes with responsive cushioning', 5.0, 102, 'new'),
(202, 'Urban Chic', 'lifestyle', 'women', 139.99, 'Fashionable lifestyle sneakers for the modern woman', 5.0, 128, NULL),
(203, 'Flex Trainer', 'training', 'women', 114.99, 'Flexible training shoes for gym workouts', 4.0, 87, 'sale'),
(204, 'Classic Comfort', 'casual', 'women', 99.99, 'All-day comfort casual sneakers', 5.0, 156, NULL),
(205, 'Swift Runner', 'running', 'women', 134.99, 'Swift and lightweight running shoes', 5.0, 91, NULL),
(206, 'Fashion Forward', 'lifestyle', 'women', 144.99, 'Trendy lifestyle sneakers with bold design', 5.0, 118, 'new'),
(207, 'Power Fit', 'training', 'women', 119.99, 'Powerful training shoes for intense workouts', 4.0, 73, NULL),
(208, 'Everyday Style', 'casual', 'women', 104.99, 'Versatile casual sneakers for daily wear', 5.0, 143, NULL),
(209, 'React Infinity', 'running', 'women', 154.99, 'Premium running shoes with React technology', 5.0, 189, 'new'),
(210, 'Retro Classic', 'lifestyle', 'women', 109.99, 'Vintage-inspired lifestyle sneakers', 4.0, 95, 'sale');

-- CHILDREN'S PRODUCTS (IDs 301-310)
-- ============================================
INSERT INTO products (id, name, category, gender, price, description, rating, review_count, badge) VALUES
(301, 'Speed Kids', 'running', 'children', 69.99, 'Fast and fun running shoes for active kids', 5.0, 78, 'new'),
(302, 'Fun Sneakers', 'casual', 'children', 59.99, 'Colorful casual sneakers for everyday play', 4.0, 92, NULL),
(303, 'Active Play', 'sports', 'children', 64.99, 'Durable sports shoes for active children', 4.0, 65, 'sale'),
(304, 'Junior Runner', 'running', 'children', 64.99, 'Comfortable running shoes for young athletes', 5.0, 88, NULL),
(305, 'Cool Kids', 'casual', 'children', 54.99, 'Stylish casual sneakers kids will love', 4.0, 71, NULL),
(306, 'Champion Kids', 'sports', 'children', 74.99, 'High-performance sports shoes for champions', 5.0, 103, 'new'),
(307, 'Fast Track', 'running', 'children', 69.99, 'Lightweight running shoes for speed', 5.0, 96, NULL),
(308, 'Everyday Kids', 'casual', 'children', 49.99, 'Affordable everyday sneakers for kids', 5.0, 81, NULL),
(309, 'Little Athlete', 'sports', 'children', 59.99, 'Sports shoes designed for little athletes', 5.0, 112, 'sale'),
(310, 'Zoom Kids', 'running', 'children', 74.99, 'Premium kids running shoes with Zoom technology', 5.0, 98, 'new');

-- SHOP/GENERAL PRODUCTS (IDs 1-10) - Mixed categories
-- ============================================
INSERT INTO products (id, name, category, gender, price, description, rating, review_count, badge) VALUES
(1, 'Air Max Pro', 'running', 'unisex', 129.99, 'Premium running shoes for everyone', 5.0, 124, 'new'),
(2, 'Urban Runner', 'lifestyle', 'unisex', 149.99, 'Stylish urban sneakers', 5.0, 89, NULL),
(3, 'Classic Sport', 'training', 'unisex', 99.99, 'Classic training shoes', 4.0, 67, 'sale'),
(4, 'Elite Performance', 'basketball', 'unisex', 179.99, 'High-performance basketball shoes', 5.0, 156, NULL),
(5, 'Speed Racer', 'running', 'unisex', 139.99, 'Lightweight speed running shoes', 5.0, 91, NULL),
(6, 'Street Style', 'lifestyle', 'unisex', 129.99, 'Modern street-style sneakers', 4.0, 84, 'new'),
(7, 'Gym Master', 'training', 'unisex', 109.99, 'Versatile gym training shoes', 4.0, 69, NULL),
(8, 'Court King', 'basketball', 'unisex', 189.99, 'Professional court basketball shoes', 5.0, 134, NULL),
(9, 'Marathon Pro', 'running', 'unisex', 159.99, 'Long-distance marathon shoes', 5.0, 176, 'new'),
(10, 'Casual Comfort', 'lifestyle', 'unisex', 94.99, 'All-day casual comfort sneakers', 4.0, 89, 'sale');


-- ============================================
-- CREATE INDEXES FOR BETTER PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_gender ON products(gender);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);


-- ============================================
-- CREATE FUNCTION TO UPDATE ORDER STATUS
-- ============================================
CREATE OR REPLACE FUNCTION update_order_status()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_order_status();


-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these to verify your setup:

-- Check total products count
-- SELECT COUNT(*) as total_products FROM products;

-- Check products by gender
-- SELECT gender, COUNT(*) as count FROM products GROUP BY gender;

-- Check products by category
-- SELECT category, COUNT(*) as count FROM products GROUP BY category;

-- View all men's products
-- SELECT id, name, category, price, badge FROM products WHERE gender = 'men' ORDER BY id;

-- View all women's products
-- SELECT id, name, category, price, badge FROM products WHERE gender = 'women' ORDER BY id;

-- View all children's products
-- SELECT id, name, category, price, badge FROM products WHERE gender = 'children' ORDER BY id;



-- ============================================
-- 6. CREATE CART TABLE (Optional - for syncing cart across devices)
-- ============================================
DROP TABLE IF EXISTS cart CASCADE;

CREATE TABLE cart (
  id BIGSERIAL PRIMARY KEY,
  user_email TEXT NOT NULL,
  product_id INTEGER REFERENCES products(id),
  product_name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE cart ENABLE ROW LEVEL SECURITY;

-- Allow public cart management (for all users including guests)
CREATE POLICY "Allow public cart access" ON cart
  FOR ALL USING (true);

-- Create index for cart
CREATE INDEX IF NOT EXISTS idx_cart_user_email ON cart(user_email);
CREATE INDEX IF NOT EXISTS idx_cart_product_id ON cart(product_id);

-- Trigger to update cart updated_at
CREATE TRIGGER update_cart_updated_at
  BEFORE UPDATE ON cart
  FOR EACH ROW
  EXECUTE FUNCTION update_order_status();


-- ============================================
-- 7. CREATE PRODUCT REVIEWS TABLE (Future feature)
-- ============================================
DROP TABLE IF EXISTS product_reviews CASCADE;

CREATE TABLE product_reviews (
  id BIGSERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id),
  user_email TEXT NOT NULL,
  user_name TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can read reviews
CREATE POLICY "Allow public read reviews" ON product_reviews
  FOR SELECT USING (true);

-- Users can create reviews
CREATE POLICY "Users can create reviews" ON product_reviews
  FOR INSERT WITH CHECK (true);

-- Create index for reviews
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON product_reviews(product_id);


-- ============================================
-- FINAL VERIFICATION
-- ============================================
-- Run these queries to verify everything is set up correctly:

-- 1. Check all tables exist
-- SELECT table_name FROM information_schema.tables 
-- WHERE table_schema = 'public' 
-- ORDER BY table_name;

-- 2. Check total records
-- SELECT 
--   (SELECT COUNT(*) FROM products) as products,
--   (SELECT COUNT(*) FROM orders) as orders,
--   (SELECT COUNT(*) FROM contact_submissions) as contacts,
--   (SELECT COUNT(*) FROM newsletter_subscribers) as subscribers,
--   (SELECT COUNT(*) FROM wishlist) as wishlist_items,
--   (SELECT COUNT(*) FROM cart) as cart_items;

-- 3. Check RLS policies
-- SELECT schemaname, tablename, policyname 
-- FROM pg_policies 
-- WHERE schemaname = 'public';

