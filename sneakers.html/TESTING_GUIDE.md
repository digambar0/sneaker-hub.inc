# SneakerHub - Quick Testing Guide

## 🚀 How to Test All Features

### 1. Open the Website
- Open `index.html` in your browser
- You should see the loading screen, then the homepage with video background

### 2. Test Navigation & Dark Mode
- ✅ Click the **🌙 moon icon** to toggle dark mode
- ✅ Try all navigation links (Home, Men, Women, Children, Shop, About, Contact)
- ✅ Click the **🛒 cart icon** to view cart
- ✅ Click **Login / Sign Up** button (we'll skip auth for now)

### 3. Test Product Features (Homepage)
- ✅ **Hover over products** - see hover effects
- ✅ **Click heart icon (🤍)** - add to wishlist (turns red ❤️)
- ✅ **Click product image** - opens quick view modal
- ✅ **Select size** in modal
- ✅ **Click "Add to Cart"** - see notification
- ✅ **Check cart count** badge updates

### 4. Test Product Pages
**Men's Page:**
- Go to Men's page
- Click filter buttons (All, Running, Lifestyle, Training, Basketball)
- Add products to cart and wishlist
- Test quick view modal

**Women's Page:**
- Go to Women's page
- Test filters (All, Running, Lifestyle, Training, Casual)
- Add products to cart and wishlist

**Children's Page:**
- Go to Children's page
- Test filters (All, Running, Casual, Sports)
- Add products to cart and wishlist

### 5. Test Shop Page
- Go to Shop page
- ✅ Use **sidebar filters** (Category, Price, Size)
- ✅ Try **sort dropdown** (Featured, Price Low-High, etc.)
- ✅ Add products to cart

### 6. Test Shopping Cart
- Click cart icon (🛒)
- ✅ See all added items
- ✅ **Increase/decrease quantity** with +/- buttons
- ✅ **Remove items** with remove button
- ✅ Check **price calculations** (subtotal, tax, total)
- ✅ **Refresh page** - cart persists (localStorage)

### 7. Test Track Order
- Go to Track Order page (footer link or `track-order.html`)
- ✅ **Test Order 1:**
  - Order ID: `ORD-001`
  - Email: `john@example.com`
  - Status: Delivered (all timeline steps completed)
  
- ✅ **Test Order 2:**
  - Order ID: `ORD-002`
  - Email: `jane@example.com`
  - Status: Shipped (in transit)
  
- ✅ **Test Order 3:**
  - Order ID: `ORD-003`
  - Email: `test@example.com`
  - Status: Pending (just ordered)

- ✅ Click **"Track Another Order"** to reset
- ✅ Click **"Print Details"** to test print layout
- ✅ Click **"Contact Support"** (redirects to contact page)

### 8. Test Dashboard
- Go to `dashboard.html` directly
- ✅ **Overview Tab:**
  - See stats cards (orders, wishlist, spent, points)
  - View recent orders
  
- ✅ **My Orders Tab:**
  - See order history
  - Filter by status (All, Pending, Shipped, Delivered, Cancelled)
  - Click "Track Order" button
  
- ✅ **Wishlist Tab:**
  - See all wishlist items
  - Remove from wishlist (click ❤️)
  - Add to cart from wishlist
  
- ✅ **Profile Settings Tab:**
  - Fill in profile form
  - Click "Save Changes"
  - Try password change form
  
- ✅ **Addresses Tab:**
  - Click "Add New Address"
  - Fill in address form
  - Save address
  - Set as default
  - Delete address
  
- ✅ **Payment Methods Tab:**
  - Click "Add Payment Method"
  - Enter card details (test: 4242 4242 4242 4242)
  - Save payment method
  - Set as default
  - Remove payment method

### 9. Test Contact Form
- Go to Contact page
- ✅ Fill in name, email, message
- ✅ Click submit
- ✅ See success notification

### 10. Test Mobile Responsive
- ✅ **Resize browser** to mobile size (< 768px)
- ✅ Click **hamburger menu (☰)** to open mobile menu
- ✅ Test all features on mobile view
- ✅ Check product grids stack vertically
- ✅ Test cart on mobile
- ✅ Test dashboard on mobile

### 11. Test Additional Features

**Scroll Animations:**
- ✅ Scroll down any page
- ✅ Watch products fade in as you scroll

**Back to Top:**
- ✅ Scroll down
- ✅ Click **↑ button** in bottom right
- ✅ Smooth scroll to top

**Search:**
- ✅ Type in search box
- ✅ Products filter in real-time (on product pages)

**Newsletter:**
- ✅ Enter email in newsletter form (homepage footer)
- ✅ Click subscribe
- ✅ See success notification

**Product Comparison:**
- ✅ Add products to comparison (feature ready, UI coming soon)

**Recently Viewed:**
- ✅ Open quick view on multiple products
- ✅ Products are tracked in localStorage

## ✅ Expected Results

### What Should Work:
1. ✅ All navigation links work
2. ✅ Dark mode toggles properly
3. ✅ Products can be added to cart
4. ✅ Cart persists after page refresh
5. ✅ Wishlist works across all pages
6. ✅ Quick view modal opens and closes
7. ✅ Filters work on all product pages
8. ✅ Track order shows timeline correctly
9. ✅ Dashboard displays all data
10. ✅ Forms submit with notifications
11. ✅ Mobile menu works
12. ✅ All animations are smooth
13. ✅ No console errors (except Supabase connection)

### What Won't Work Yet:
- ❌ Login/Signup (Supabase not configured)
- ❌ Email verification
- ❌ Password reset
- ❌ Real payment processing

## 🐛 Troubleshooting

**If cart doesn't update:**
- Check browser console for errors
- Clear localStorage: `localStorage.clear()`
- Refresh page

**If dark mode doesn't persist:**
- Check localStorage is enabled in browser
- Try in incognito mode

**If video doesn't play:**
- Check internet connection
- Video URL might be blocked
- Download a local video and update path

**If Supabase errors appear:**
- Ignore them - we're not using Supabase yet
- All features work with localStorage fallback

## 📊 Browser Console Commands

Open browser console (F12) and try these:

```javascript
// View cart
console.log(JSON.parse(localStorage.getItem('cart')));

// View wishlist
console.log(JSON.parse(localStorage.getItem('wishlist')));

// Clear all data
localStorage.clear();

// Add test user
localStorage.setItem('user', JSON.stringify({
  id: 'test123',
  email: 'test@example.com',
  name: 'Test User'
}));

// Check dark mode
console.log(localStorage.getItem('darkMode'));
```

## 🎉 Success!

If all the above tests pass, your SneakerHub website is fully functional and ready for authentication integration later!

**Next Steps:**
1. ✅ All features tested and working
2. ⏳ Configure Supabase when ready
3. ⏳ Implement authentication
4. ⏳ Deploy to production
