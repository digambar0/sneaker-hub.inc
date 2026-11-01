-- ============================================
-- CLEANUP SCRIPT - Run this FIRST if you get "already exists" errors
-- ============================================

-- Drop all policies first
DROP POLICY IF EXISTS "Allow public read access" ON products;
DROP POLICY IF EXISTS "Allow authenticated insert" ON products;
DROP POLICY IF EXISTS "Allow authenticated update" ON products;
DROP POLICY IF EXISTS "Users can view orders by email" ON orders;
DROP POLICY IF EXISTS "Users can create orders" ON orders;
DROP POLICY IF EXISTS "Allow public insert" ON contact_submissions;
DROP POLICY IF EXISTS "Allow public subscribe" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Users can view own wishlist" ON wishlist;
DROP POLICY IF EXISTS "Users can manage own wishlist" ON wishlist;
DROP POLICY IF EXISTS "Allow public cart access" ON cart;
DROP POLICY IF EXISTS "Allow public read reviews" ON product_reviews;
DROP POLICY IF EXISTS "Users can create reviews" ON product_reviews;

-- Drop all tables (in correct order due to foreign keys)
DROP TABLE IF EXISTS product_reviews CASCADE;
DROP TABLE IF EXISTS cart CASCADE;
DROP TABLE IF EXISTS wishlist CASCADE;
DROP TABLE IF EXISTS newsletter_subscribers CASCADE;
DROP TABLE IF EXISTS contact_submissions CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS update_order_status() CASCADE;

-- Verify cleanup
SELECT 'Cleanup complete! Now run supabase-database-setup.sql' as message;
