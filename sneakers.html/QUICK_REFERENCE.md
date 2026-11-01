# 🚀 Quick Reference Card

## Setup in 3 Steps

### 1️⃣ Run SQL Script
```
Supabase Dashboard → SQL Editor → Paste supabase-database-setup.sql → Run
```

### 2️⃣ Verify
```sql
SELECT COUNT(*) FROM products;  -- Should return 40
```

### 3️⃣ Test
```
Open index.html → Check console → Should see "✅ Supabase initialized"
```

## 📊 What's Stored in Supabase

| Table | Purpose | Count |
|-------|---------|-------|
| products | All sneakers | 40 |
| orders | Customer orders | Dynamic |
| contact_submissions | Contact forms | Dynamic |
| newsletter_subscribers | Email list | Dynamic |
| cart | Shopping cart sync | Dynamic |
| wishlist | Favorite products | Dynamic |
| product_reviews | Customer reviews | Dynamic |

## 🔑 Key Functions

### Products
```javascript
fetchProducts()                    // Get all products
fetchProductsByGender('men')       // Get men's products
fetchProduct(101)                  // Get single product
searchProducts('running')          // Search products
```

### Orders
```javascript
saveOrder(orderData)               // Save order to Supabase
fetchUserOrders(email)             // Get user's orders
updateOrderStatus(id, 'shipped')   // Update order status
```

### Contact & Newsletter
```javascript
saveContactForm(formData)          // Save contact submission
subscribeToNewsletter(email)       // Subscribe to newsletter
```

### Cart & Wishlist
```javascript
saveCartToSupabase(email, items)   // Sync cart
loadCartFromSupabase(email)        // Load cart
addToWishlistSupabase(userId, id)  // Add to wishlist
```

## 🧪 Quick Tests

### Test 1: Products Loading
```
Open men.html → Should see 10 products
Console: "✅ men products loaded: 10"
```

### Test 2: Order Placement
```
Add to cart → Checkout → Place order
Check Supabase orders table → New order appears
```

### Test 3: Contact Form
```
Fill contact form → Submit
Check contact_submissions table → New entry
```

### Test 4: Newsletter
```
Enter email → Subscribe
Check newsletter_subscribers table → New subscriber
```

## 🐛 Common Issues

### Products Not Loading
```
✓ Check Supabase URL in supabase-config.js
✓ Verify products table has 40 rows
✓ Check RLS policies enabled
✓ Clear browser cache
```

### Orders Not Saving
```
✓ Check orders table exists
✓ Verify RLS policies
✓ Check browser console for errors
✓ Test with sample order
```

### Console Errors
```
✓ Verify Supabase CDN script loaded
✓ Check script load order
✓ Verify credentials correct
✓ Check network tab for failed requests
```

## 📈 Useful Queries

### Check Setup
```sql
-- Verify all tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Count all data
SELECT 
  (SELECT COUNT(*) FROM products) as products,
  (SELECT COUNT(*) FROM orders) as orders,
  (SELECT COUNT(*) FROM contact_submissions) as contacts,
  (SELECT COUNT(*) FROM newsletter_subscribers) as subscribers;
```

### View Recent Activity
```sql
-- Recent orders
SELECT id, user_email, total, status, created_at 
FROM orders 
ORDER BY created_at DESC 
LIMIT 5;

-- Recent contacts
SELECT name, email, subject, created_at 
FROM contact_submissions 
ORDER BY created_at DESC 
LIMIT 5;
```

### Product Stats
```sql
-- Products by category
SELECT gender, category, COUNT(*) 
FROM products 
GROUP BY gender, category;

-- Price ranges
SELECT 
  gender,
  MIN(price) as min_price,
  MAX(price) as max_price,
  AVG(price) as avg_price
FROM products
GROUP BY gender;
```

## 🎯 Success Checklist

- [ ] SQL script executed successfully
- [ ] 40 products in database
- [ ] Products load on all pages
- [ ] Orders save to Supabase
- [ ] Contact form works
- [ ] Newsletter works
- [ ] No console errors
- [ ] All pages responsive
- [ ] Dark mode works
- [ ] Cart persists

## 📁 Important Files

| File | Purpose |
|------|---------|
| `supabase-database-setup.sql` | Complete database schema |
| `supabase-config.js` | Supabase credentials |
| `supabase-products.js` | All data functions |
| `checkout.js` | Order processing |
| `SETUP_GUIDE.md` | Detailed setup |
| `README.md` | Project overview |

## 🔗 Quick Links

- **Supabase Dashboard**: https://supabase.com/dashboard
- **SQL Editor**: Dashboard → SQL Editor
- **Table Editor**: Dashboard → Table Editor
- **API Docs**: Dashboard → API → Documentation

## 💡 Pro Tips

1. **Always check console** - Errors show there first
2. **Use SQL Editor** - Test queries before using in code
3. **Check RLS policies** - Most access issues are RLS-related
4. **Test incrementally** - Test each feature as you build
5. **Use fallbacks** - localStorage backup prevents data loss

## 🎨 Product IDs

| Range | Category |
|-------|----------|
| 1-10 | Shop (Unisex) |
| 101-110 | Men |
| 201-210 | Women |
| 301-310 | Children |

## 📞 Need Help?

1. Check browser console (F12)
2. Review SETUP_GUIDE.md
3. Verify database with SQL queries
4. Check Supabase dashboard logs
5. Test with sample data

---

**Quick Start**: Run SQL → Verify → Test → Done! ✅
