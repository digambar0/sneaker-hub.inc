# Quick Start Guide - Supabase Integration

## 🚀 Get Started in 5 Minutes

### Step 1: Create Supabase Project (2 minutes)
1. Go to https://supabase.com and sign up
2. Click "New Project"
3. Fill in:
   - Project name: `sneakerhub`
   - Database password: (create a strong password)
   - Region: (choose closest to you)
4. Wait for project to be created

### Step 2: Get Your Credentials (1 minute)
1. In your Supabase dashboard, click on "Settings" (gear icon)
2. Click "API" in the left sidebar
3. Copy these two values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

### Step 3: Update Configuration (1 minute)
1. Open `supabase-config.js` in your code editor
2. Replace the placeholder values:
```javascript
const SUPABASE_URL = 'https://xxxxx.supabase.co'; // Paste your URL here
const SUPABASE_ANON_KEY = 'eyJhbGc...'; // Paste your anon key here
```
3. Save the file

### Step 4: Create Database Tables (1 minute)
1. In Supabase dashboard, click "SQL Editor" in the left sidebar
2. Click "New Query"
3. Copy and paste this SQL:

```sql
-- Products Table
CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  gender TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  stock INTEGER DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON products FOR SELECT USING (true);

-- Orders Table
CREATE TABLE orders (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  items JSONB NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Contact Submissions
CREATE TABLE contact_submissions (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert" ON contact_submissions FOR INSERT WITH CHECK (true);

-- Newsletter Subscribers
CREATE TABLE newsletter_subscribers (
  id BIGSERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public subscribe" ON newsletter_subscribers FOR INSERT WITH CHECK (true);

-- Insert Sample Products
INSERT INTO products (name, category, gender, price, description) VALUES
('Air Max Pro', 'running', 'men', 129.99, 'Premium running shoes with advanced cushioning'),
('Urban Runner', 'lifestyle', 'men', 149.99, 'Stylish urban sneakers for everyday wear'),
('Classic Sport', 'training', 'men', 99.99, 'Classic training shoes for gym workouts'),
('Elite Performance', 'basketball', 'men', 179.99, 'High-performance basketball shoes'),
('Speed Racer', 'running', 'men', 139.99, 'Lightweight running shoes for speed'),
('Street Style', 'lifestyle', 'men', 129.99, 'Modern street style sneakers'),
('Gym Master', 'training', 'men', 109.99, 'Versatile training shoes'),
('Court King', 'basketball', 'men', 189.99, 'Professional basketball shoes'),
('Air Zoom Pegasus', 'running', 'women', 124.99, 'Comfortable running shoes for women'),
('Urban Chic', 'lifestyle', 'women', 139.99, 'Fashionable lifestyle sneakers'),
('Flex Trainer', 'training', 'women', 114.99, 'Flexible training shoes'),
('Classic Comfort', 'casual', 'women', 99.99, 'Comfortable casual sneakers'),
('Swift Runner', 'running', 'women', 134.99, 'Fast and light running shoes'),
('Fashion Forward', 'lifestyle', 'women', 144.99, 'Trendy fashion sneakers'),
('Power Fit', 'training', 'women', 119.99, 'Powerful training shoes'),
('Everyday Style', 'casual', 'women', 104.99, 'Everyday casual sneakers'),
('Speed Kids', 'running', 'children', 69.99, 'Kids running shoes'),
('Fun Sneakers', 'casual', 'children', 59.99, 'Fun casual sneakers for kids'),
('Active Play', 'sports', 'children', 74.99, 'Active sports shoes for children'),
('Junior Runner', 'running', 'children', 64.99, 'Junior running shoes'),
('Cool Kids', 'casual', 'children', 54.99, 'Cool casual sneakers'),
('Champion Kids', 'sports', 'children', 79.99, 'Champion sports shoes'),
('Fast Track', 'running', 'children', 69.99, 'Fast running shoes for kids'),
('Everyday Kids', 'casual', 'children', 49.99, 'Everyday casual shoes');
```

4. Click "Run" button
5. You should see "Success. No rows returned"

### Step 5: Enable Email Authentication (30 seconds)
1. In Supabase dashboard, click "Authentication" in the left sidebar
2. Click "Providers"
3. Make sure "Email" is enabled (it should be by default)
4. Done!

### Step 6: Test Your Website
1. Open `index.html` in your browser
2. Try these features:
   - ✅ Sign up with a new account
   - ✅ Login with your credentials
   - ✅ Add products to cart
   - ✅ Submit contact form
   - ✅ Subscribe to newsletter

## 🎉 You're Done!

Your website is now connected to Supabase with:
- ✅ User authentication (signup/login)
- ✅ Product database
- ✅ Order management
- ✅ Contact form submissions
- ✅ Newsletter subscriptions

## 📝 What Works Now:

### Authentication
- Users can sign up with email/password
- Users can login
- Users can logout
- Password reset via email

### Products
- Products are loaded from database
- Real-time product data
- Filter by category and gender

### Orders
- Users can place orders (requires login)
- Orders are saved to database
- Users can only see their own orders

### Contact & Newsletter
- Contact form submissions saved to database
- Newsletter subscriptions saved
- Duplicate email prevention

## 🔧 Troubleshooting

**Problem: "Invalid API key"**
- Solution: Double-check your SUPABASE_URL and SUPABASE_ANON_KEY in `supabase-config.js`

**Problem: "Products not loading"**
- Solution: Make sure you ran the SQL to create tables and insert sample data

**Problem: "Can't sign up"**
- Solution: Check that Email provider is enabled in Authentication > Providers

**Problem: "CORS error"**
- Solution: In Supabase dashboard, go to Settings > API > Site URL and add your website URL

## 🚀 Next Steps

1. **Add Product Images**: Upload images to Supabase Storage
2. **User Profile**: Create a profile page for users
3. **Order History**: Show user's past orders
4. **Admin Panel**: Create admin dashboard to manage products
5. **Payment Integration**: Add Stripe or PayPal
6. **Email Notifications**: Send order confirmations

## 📚 Learn More

- Supabase Docs: https://supabase.com/docs
- Supabase Auth: https://supabase.com/docs/guides/auth
- Supabase Database: https://supabase.com/docs/guides/database
