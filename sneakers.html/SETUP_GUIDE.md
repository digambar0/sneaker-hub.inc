# SneakerHub - Complete Setup Guide

## 🎯 Quick Start (5 Minutes)

### Step 1: Setup Supabase Database
1. Open your Supabase dashboard at https://supabase.com
2. Go to **SQL Editor**
3. Open the file `supabase-database-setup.sql`
4. Copy ALL the content
5. Paste into Supabase SQL Editor
6. Click **Run** button
7. Wait for "Success" message

### Step 2: Verify Database
Run this query in SQL Editor:
```sql
SELECT 
  (SELECT COUNT(*) FROM products) as products,
  (SELECT COUNT(*) FROM orders) as orders,
  (SELECT COUNT(*) FROM contact_submissions) as contacts,
  (SELECT COUNT(*) FROM newsletter_subscribers) as subscribers;
```

Expected result:
- products: 40
- orders: 0
- contacts: 0
- subscribers: 0

### Step 3: Test the Website
1. Open `index.html` in your browser
2. Check browser console (F12) - should see:
   ```
   ✅ Supabase initialized successfully
   ✅ Products loaded from Supabase: 4
   ```
3. Navigate to Men's page - should load 10 products
4. Add item to cart
5. Complete checkout
6. Check Supabase `orders` table - new order should appear!

## 📊 What's Stored in Supabase

### ✅ Products (40 items)
- **Men**: 10 products (Running, Lifestyle, Training, Basketball)
- **Women**: 10 products (Running, Lifestyle, Training, Casual)
- **Children**: 10 products (Running, Casual, Sports)
- **Shop**: 10 unisex products

### ✅ Orders
- Complete order details
- Customer information
- Items purchased
- Shipping address
- Payment method
- Order status tracking

### ✅ Contact Submissions
- Customer inquiries
- Support requests
- Feedback

### ✅ Newsletter Subscriptions
- Email addresses
- Subscription dates
- Duplicate prevention

### ✅ Shopping Cart (Optional)
- Cart items per user
- Sync across devices
- Quantity tracking

### ✅ Wishlist (Ready for Auth)
- Favorite products
- User preferences

### ✅ Product Reviews (Ready)
- Customer ratings
- Review text
- User information

## 🔧 Configuration

### Your Supabase Credentials
Located in `supabase-config.js`:
```javascript
const SUPABASE_URL = 'https://xpokjoextyuozeltwrqo.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';
```

These are already configured and working!

## 📁 File Structure

```
sneakers.html/
├── index.html                          # Homepage
├── men.html                            # Men's products
├── women.html                          # Women's products
├── children.html                       # Children's products
├── shop.html                           # All products
├── cart.html                           # Shopping cart
├── checkout.html                       # Checkout process
├── order-confirmation.html             # Order success
├── track-order.html                    # Order tracking
├── dashboard.html                      # User dashboard
├── contact.html                        # Contact form
├── about.html                          # About page
├── auth.html                           # Login/Signup (future)
├── size-guide.html                     # Size guide
├── shipping-info.html                  # Shipping info
├── returns.html                        # Returns policy
├── faq.html                            # FAQ
├── style.css                           # All styles
├── script.js                           # Main JavaScript
├── supabase-config.js                  # Supabase setup
├── supabase-auth.js                    # Auth functions
├── supabase-products.js                # Product & data management
├── checkout.js                         # Checkout logic
├── dashboard.js                        # Dashboard logic
├── track-order.js                      # Order tracking
└── supabase-database-setup.sql         # Database schema
```

## 🎨 Features Implemented

### Shopping Experience
- ✅ Product browsing by category
- ✅ Product filtering
- ✅ Quick view modal
- ✅ Add to cart
- ✅ Shopping cart management
- ✅ Wishlist
- ✅ Product comparison
- ✅ Recently viewed
- ✅ Product ratings

### Checkout Process
- ✅ 3-step checkout
- ✅ Shipping information
- ✅ Payment details
- ✅ Order review
- ✅ Order calculation
- ✅ Order confirmation
- ✅ Email receipt (simulated)

### Order Management
- ✅ Order tracking
- ✅ Status updates
- ✅ Tracking timeline
- ✅ Order history
- ✅ Order details

### Customer Service
- ✅ Contact form
- ✅ FAQ page
- ✅ Size guide
- ✅ Shipping information
- ✅ Returns policy
- ✅ Newsletter subscription

### UI/UX Features
- ✅ Dark mode
- ✅ Mobile responsive
- ✅ Loading animations
- ✅ Smooth scrolling
- ✅ Toast notifications
- ✅ Breadcrumb navigation
- ✅ Back to top button
- ✅ Search functionality

## 🔄 Data Flow

### Products Loading:
```
Supabase Database
    ↓
supabase-products.js (fetchProducts)
    ↓
Page Display (men.html, women.html, etc.)
    ↓
User sees products
```

### Order Placement:
```
User fills checkout form
    ↓
checkout.js (placeOrder)
    ↓
Save to Supabase (orders table)
    ↓
Save to localStorage (backup)
    ↓
Redirect to confirmation page
```

### Contact Form:
```
User submits form
    ↓
saveContactForm()
    ↓
Supabase (contact_submissions table)
    ↓
Success notification
```

## 🧪 Testing Checklist

### Products
- [ ] Homepage shows 4 featured products
- [ ] Men's page shows 10 products
- [ ] Women's page shows 10 products
- [ ] Children's page shows 10 products
- [ ] Shop page shows 10 products
- [ ] Category filters work
- [ ] Quick view modal works
- [ ] Add to cart works

### Shopping Cart
- [ ] Items added to cart
- [ ] Cart count updates
- [ ] Quantity can be changed
- [ ] Items can be removed
- [ ] Cart persists on refresh

### Checkout
- [ ] Shipping form validates
- [ ] Payment form validates
- [ ] Order review shows correct info
- [ ] Order placement works
- [ ] Order saved to Supabase
- [ ] Confirmation page shows order details

### Order Tracking
- [ ] Can track order by ID
- [ ] Timeline shows correctly
- [ ] Status updates work
- [ ] Order details display

### Contact & Newsletter
- [ ] Contact form submits
- [ ] Saved to Supabase
- [ ] Newsletter subscription works
- [ ] Duplicate email prevented

### UI Features
- [ ] Dark mode toggles
- [ ] Mobile menu works
- [ ] Search works
- [ ] Notifications show
- [ ] Loading states work
- [ ] All links work

## 🐛 Troubleshooting

### Products Not Loading
**Problem**: Page shows "Loading products..." forever

**Solutions**:
1. Check browser console for errors
2. Verify Supabase URL and key in `supabase-config.js`
3. Run verification query in Supabase SQL Editor:
   ```sql
   SELECT COUNT(*) FROM products;
   ```
4. Check if RLS policies are enabled
5. Clear browser cache and reload

### Orders Not Saving
**Problem**: Order completes but doesn't appear in Supabase

**Solutions**:
1. Check browser console for errors
2. Verify `orders` table exists
3. Check RLS policies:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'orders';
   ```
4. Test with this query:
   ```sql
   SELECT * FROM orders ORDER BY created_at DESC LIMIT 5;
   ```

### Contact Form Not Working
**Problem**: Form submits but no data in Supabase

**Solutions**:
1. Check `contact_submissions` table exists
2. Verify RLS policy allows public insert
3. Test manually:
   ```sql
   INSERT INTO contact_submissions (name, email, subject, message)
   VALUES ('Test', 'test@test.com', 'Test', 'Test message');
   ```

### Console Errors
**Problem**: "Supabase not initialized" error

**Solutions**:
1. Check if Supabase CDN script is loaded:
   ```html
   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
   ```
2. Verify script load order in HTML
3. Check network tab for failed requests
4. Verify Supabase credentials

## 📈 Database Statistics

Run these queries to monitor your data:

### Product Statistics
```sql
SELECT 
  gender,
  category,
  COUNT(*) as count,
  AVG(price) as avg_price,
  MIN(price) as min_price,
  MAX(price) as max_price
FROM products
GROUP BY gender, category
ORDER BY gender, category;
```

### Order Statistics
```sql
SELECT 
  status,
  COUNT(*) as count,
  SUM(total) as total_revenue
FROM orders
GROUP BY status;
```

### Popular Products (from orders)
```sql
SELECT 
  jsonb_array_elements(items)->>'name' as product_name,
  COUNT(*) as times_ordered
FROM orders
GROUP BY product_name
ORDER BY times_ordered DESC
LIMIT 10;
```

### Recent Activity
```sql
SELECT 
  'Order' as type,
  id as reference,
  created_at
FROM orders
UNION ALL
SELECT 
  'Contact' as type,
  id::text as reference,
  created_at
FROM contact_submissions
UNION ALL
SELECT 
  'Newsletter' as type,
  email as reference,
  subscribed_at as created_at
FROM newsletter_subscribers
ORDER BY created_at DESC
LIMIT 20;
```

## 🚀 Next Steps

### Phase 1: Current (Complete) ✅
- [x] Database setup
- [x] Product management
- [x] Shopping cart
- [x] Checkout process
- [x] Order tracking
- [x] Contact form
- [x] Newsletter

### Phase 2: Authentication (Future)
- [ ] User signup/login
- [ ] User profiles
- [ ] Password reset
- [ ] Email verification
- [ ] Social login (Google, Facebook)

### Phase 3: Advanced Features (Future)
- [ ] Product images (Supabase Storage)
- [ ] User reviews and ratings
- [ ] Wishlist sync with account
- [ ] Saved addresses
- [ ] Payment methods storage
- [ ] Order history per user
- [ ] Email notifications
- [ ] Real-time inventory
- [ ] Admin dashboard

### Phase 4: Enhancements (Future)
- [ ] Product recommendations
- [ ] Search with filters
- [ ] Price alerts
- [ ] Gift cards
- [ ] Loyalty program
- [ ] Referral system
- [ ] Analytics dashboard
- [ ] A/B testing

## 📞 Support

If you need help:
1. Check browser console for error messages
2. Review this guide
3. Check `SUPABASE_INTEGRATION_COMPLETE.md`
4. Verify database setup with SQL queries
5. Test with sample data

## 🎉 Success Indicators

You'll know everything is working when:
- ✅ Console shows "Supabase initialized successfully"
- ✅ Products load on all category pages
- ✅ Orders save to Supabase after checkout
- ✅ Contact form submissions appear in database
- ✅ Newsletter subscriptions save
- ✅ No console errors
- ✅ All features work smoothly

---

**Status**: ✅ Fully Integrated with Supabase
**Version**: 1.0
**Last Updated**: 2026-03-02
