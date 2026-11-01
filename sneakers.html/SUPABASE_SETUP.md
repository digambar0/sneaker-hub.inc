# Supabase Setup Guide for SneakerHub

## Step 1: Create a Supabase Account
1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub, Google, or email
4. Create a new project

## Step 2: Get Your Credentials
1. In your Supabase dashboard, go to Settings > API
2. Copy your:
   - Project URL (e.g., https://xxxxx.supabase.co)
   - Anon/Public Key

3. Open `supabase-config.js` and replace:
   ```javascript
   const SUPABASE_URL = 'YOUR_SUPABASE_URL';
   const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
   ```

## Step 3: Create Database Tables

### 1. Products Table
```sql
CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  gender TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  image_url TEXT,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read products
CREATE POLICY "Allow public read access" ON products
  FOR SELECT USING (true);
```

### 2. Orders Table
```sql
CREATE TABLE orders (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  items JSONB NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Users can only see their own orders
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

-- Users can create their own orders
CREATE POLICY "Users can create orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### 3. Contact Submissions Table
```sql
CREATE TABLE contact_submissions (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit contact forms
CREATE POLICY "Allow public insert" ON contact_submissions
  FOR INSERT WITH CHECK (true);
```

### 4. Newsletter Subscribers Table
```sql
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
```

## Step 4: Insert Sample Products
```sql
INSERT INTO products (name, category, gender, price, description) VALUES
('Air Max Pro', 'running', 'men', 129.99, 'Premium running shoes'),
('Urban Runner', 'lifestyle', 'men', 149.99, 'Stylish urban sneakers'),
('Classic Sport', 'training', 'men', 99.99, 'Classic training shoes'),
('Elite Performance', 'basketball', 'men', 179.99, 'High-performance basketball shoes'),
('Air Zoom Pegasus', 'running', 'women', 124.99, 'Comfortable running shoes'),
('Urban Chic', 'lifestyle', 'women', 139.99, 'Fashionable lifestyle sneakers'),
('Speed Kids', 'running', 'children', 69.99, 'Kids running shoes'),
('Fun Sneakers', 'casual', 'children', 59.99, 'Casual kids sneakers');
```

## Step 5: Enable Authentication
1. In Supabase dashboard, go to Authentication > Settings
2. Enable Email provider
3. Configure email templates (optional)
4. Set Site URL to your website URL

## Step 6: Update Your HTML Files
Add these script tags BEFORE your closing `</body>` tag in all HTML files:

```html
<!-- Supabase JS Client -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="supabase-config.js"></script>
<script src="supabase-auth.js"></script>
<script src="supabase-products.js"></script>
<script src="script.js"></script>
```

## Step 7: Test Your Integration
1. Open your website
2. Try signing up with a new account
3. Check your Supabase dashboard > Authentication to see the new user
4. Try adding products to cart
5. Test the contact form

## Features Enabled:
✅ User Authentication (Sign up, Login, Logout)
✅ Product Management
✅ Order Tracking
✅ Contact Form Submissions
✅ Newsletter Subscriptions
✅ Shopping Cart (localStorage + database sync)

## Security Notes:
- Row Level Security (RLS) is enabled on all tables
- Users can only access their own orders
- Public can read products but not modify them
- Authentication is required for placing orders

## Troubleshooting:
1. **CORS errors**: Make sure your site URL is added in Supabase dashboard
2. **Auth not working**: Check if email provider is enabled
3. **Can't insert data**: Verify RLS policies are set correctly
4. **Products not loading**: Check if sample data is inserted

## Next Steps:
- Add product images to Supabase Storage
- Implement payment gateway (Stripe, PayPal)
- Add user profile page
- Create admin dashboard for managing products
- Add order history page
