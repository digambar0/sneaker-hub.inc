// Dashboard functionality

// Sample data (replace with Supabase data later)
let orders = [
    {
        id: 'ORD-001',
        date: '2026-02-28',
        status: 'delivered',
        total: 299.97,
        items: [
            { name: 'Air Max Pro', quantity: 2, price: 129.99 },
            { name: 'Urban Runner', quantity: 1, price: 149.99 }
        ]
    },
    {
        id: 'ORD-002',
        date: '2026-03-01',
        status: 'shipped',
        total: 179.99,
        items: [
            { name: 'Elite Performance', quantity: 1, price: 179.99 }
        ]
    }
];

let addresses = [
    {
        id: 1,
        label: 'Home',
        firstName: 'John',
        lastName: 'Doe',
        street: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        country: 'United States',
        isDefault: true
    }
];

let paymentMethods = [
    {
        id: 1,
        type: 'Visa',
        last4: '4242',
        expiry: '12/25',
        isDefault: true
    }
];

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadDashboardData();
    setupTabNavigation();
    updateCartCount();
});

// Check authentication
function checkAuth() {
    // Check if user is logged in (you can integrate with Supabase here)
    const user = localStorage.getItem('user');
    if (!user) {
        // Redirect to login if not authenticated
        // window.location.href = 'auth.html';
        // For demo purposes, we'll use guest data
        document.getElementById('userName').textContent = 'Guest User';
        document.getElementById('userEmail').textContent = 'guest@example.com';
    } else {
        const userData = JSON.parse(user);
        document.getElementById('userName').textContent = userData.name || 'User';
        document.getElementById('userEmail').textContent = userData.email || '';
    }
}

// Load dashboard data
function loadDashboardData() {
    loadOverviewStats();
    loadOrders();
    loadWishlist();
    loadAddresses();
    loadPaymentMethods();
}

// Load overview statistics
function loadOverviewStats() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
    const rewardPoints = Math.floor(totalSpent * 10); // 10 points per dollar
    
    document.getElementById('totalOrders').textContent = orders.length;
    document.getElementById('wishlistCount').textContent = wishlist.length;
    document.getElementById('totalSpent').textContent = `$${totalSpent.toFixed(2)}`;
    document.getElementById('rewardPoints').textContent = rewardPoints;
    
    // Load recent orders
    const recentOrdersList = document.getElementById('recentOrdersList');
    if (orders.length === 0) {
        recentOrdersList.innerHTML = '<p class="empty-state">No recent orders</p>';
    } else {
        recentOrdersList.innerHTML = orders.slice(0, 3).map(order => `
            <div class="order-summary-card">
                <div class="order-header">
                    <span class="order-id">${order.id}</span>
                    <span class="order-status status-${order.status}">${order.status}</span>
                </div>
                <p class="order-date">${formatDate(order.date)}</p>
                <p class="order-total">$${order.total.toFixed(2)}</p>
            </div>
        `).join('');
    }
}

// Load orders
function loadOrders(status = 'all') {
    const ordersList = document.getElementById('ordersList');
    let filteredOrders = orders;
    
    if (status !== 'all') {
        filteredOrders = orders.filter(order => order.status === status);
    }
    
    if (filteredOrders.length === 0) {
        ordersList.innerHTML = '<p class="empty-state">No orders found</p>';
        return;
    }
    
    ordersList.innerHTML = filteredOrders.map(order => `
        <div class="order-card">
            <div class="order-card-header">
                <div>
                    <h3>Order ${order.id}</h3>
                    <p class="order-date">${formatDate(order.date)}</p>
                </div>
                <span class="order-status status-${order.status}">${order.status}</span>
            </div>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <span class="item-emoji">👟</span>
                        <div class="item-details">
                            <p class="item-name">${item.name}</p>
                            <p class="item-quantity">Qty: ${item.quantity}</p>
                        </div>
                        <p class="item-price">$${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                `).join('')}
            </div>
            <div class="order-card-footer">
                <p class="order-total">Total: $${order.total.toFixed(2)}</p>
                <div class="order-actions">
                    <button class="btn-secondary" onclick="trackOrder('${order.id}')">Track Order</button>
                    <button class="btn-secondary" onclick="viewOrderDetails('${order.id}')">View Details</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Load wishlist
function loadWishlist() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const wishlistGrid = document.getElementById('wishlistGrid');
    
    if (wishlist.length === 0) {
        wishlistGrid.innerHTML = '<p class="empty-state">Your wishlist is empty</p>';
        return;
    }
    
    wishlistGrid.innerHTML = wishlist.map(item => `
        <div class="shoe-card" data-id="${item.id}">
            <button class="wishlist-btn active" data-id="${item.id}" onclick="removeFromWishlist(${item.id})">❤️</button>
            <div class="shoe-img">👟</div>
            <div class="shoe-info">
                <p class="shoe-category">Sneakers</p>
                <h3>${item.name}</h3>
                <div class="product-rating">
                    <span class="stars">⭐⭐⭐⭐⭐</span>
                    <span class="rating-count">(124)</span>
                </div>
                <p class="price">$129.99</p>
                <button class="btn-add-cart" onclick="addToCartFromWishlist(${item.id}, '${item.name}', 129.99)">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

// Load addresses
function loadAddresses() {
    const addressesList = document.getElementById('addressesList');
    
    if (addresses.length === 0) {
        addressesList.innerHTML = '<p class="empty-state">No saved addresses</p>';
        return;
    }
    
    addressesList.innerHTML = addresses.map(address => `
        <div class="address-card ${address.isDefault ? 'default' : ''}">
            ${address.isDefault ? '<span class="default-badge">Default</span>' : ''}
            <h3>${address.label}</h3>
            <p>${address.firstName} ${address.lastName}</p>
            <p>${address.street}</p>
            <p>${address.city}, ${address.state} ${address.zip}</p>
            <p>${address.country}</p>
            <div class="address-actions">
                <button class="btn-secondary" onclick="editAddress(${address.id})">Edit</button>
                <button class="btn-secondary" onclick="deleteAddress(${address.id})">Delete</button>
                ${!address.isDefault ? `<button class="btn-secondary" onclick="setDefaultAddress(${address.id})">Set Default</button>` : ''}
            </div>
        </div>
    `).join('');
}

// Load payment methods
function loadPaymentMethods() {
    const paymentsList = document.getElementById('paymentsList');
    
    if (paymentMethods.length === 0) {
        paymentsList.innerHTML = '<p class="empty-state">No saved payment methods</p>';
        return;
    }
    
    paymentsList.innerHTML = paymentMethods.map(payment => `
        <div class="payment-card ${payment.isDefault ? 'default' : ''}">
            ${payment.isDefault ? '<span class="default-badge">Default</span>' : ''}
            <div class="payment-icon">💳</div>
            <h3>${payment.type} •••• ${payment.last4}</h3>
            <p>Expires ${payment.expiry}</p>
            <div class="payment-actions">
                <button class="btn-secondary" onclick="deletePayment(${payment.id})">Remove</button>
                ${!payment.isDefault ? `<button class="btn-secondary" onclick="setDefaultPayment(${payment.id})">Set Default</button>` : ''}
            </div>
        </div>
    `).join('');
}

// Tab navigation
function setupTabNavigation() {
    const navItems = document.querySelectorAll('.dashboard-nav-item');
    const tabs = document.querySelectorAll('.dashboard-tab');
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const tabName = item.dataset.tab;
            if (!tabName) return;
            
            // Remove active class from all nav items and tabs
            navItems.forEach(nav => nav.classList.remove('active'));
            tabs.forEach(tab => tab.classList.remove('active'));
            
            // Add active class to clicked nav item and corresponding tab
            item.classList.add('active');
            document.getElementById(`${tabName}-tab`).classList.add('active');
        });
    });
}

// Order filter
document.addEventListener('DOMContentLoaded', () => {
    const filterBtns = document.querySelectorAll('.orders-filter .filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            loadOrders(btn.dataset.status);
        });
    });
});

// Profile update
function updateProfile(event) {
    event.preventDefault();
    
    const profileData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('profileEmail').value,
        phone: document.getElementById('phone').value,
        dob: document.getElementById('dob').value
    };
    
    // Save to localStorage (integrate with Supabase later)
    localStorage.setItem('userProfile', JSON.stringify(profileData));
    
    showToast('Profile updated successfully!', 'success');
    return false;
}

// Change password
function changePassword(event) {
    event.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (newPassword !== confirmPassword) {
        showToast('Passwords do not match!', 'error');
        return false;
    }
    
    // Integrate with Supabase authentication
    showToast('Password updated successfully!', 'success');
    event.target.reset();
    return false;
}

// Address management
function showAddAddressModal() {
    document.getElementById('addAddressModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeAddressModal() {
    document.getElementById('addAddressModal').classList.remove('active');
    document.body.style.overflow = '';
}

function saveAddress(event) {
    event.preventDefault();
    
    const newAddress = {
        id: addresses.length + 1,
        label: document.getElementById('addressLabel').value,
        firstName: document.getElementById('addressFirstName').value,
        lastName: document.getElementById('addressLastName').value,
        street: document.getElementById('street').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        zip: document.getElementById('zip').value,
        country: document.getElementById('country').value,
        isDefault: document.getElementById('defaultAddress').checked
    };
    
    if (newAddress.isDefault) {
        addresses.forEach(addr => addr.isDefault = false);
    }
    
    addresses.push(newAddress);
    localStorage.setItem('addresses', JSON.stringify(addresses));
    
    loadAddresses();
    closeAddressModal();
    showToast('Address added successfully!', 'success');
    event.target.reset();
    return false;
}

function editAddress(id) {
    showToast('Edit address feature coming soon!', 'info');
}

function deleteAddress(id) {
    if (confirm('Are you sure you want to delete this address?')) {
        addresses = addresses.filter(addr => addr.id !== id);
        localStorage.setItem('addresses', JSON.stringify(addresses));
        loadAddresses();
        showToast('Address deleted successfully!', 'success');
    }
}

function setDefaultAddress(id) {
    addresses.forEach(addr => addr.isDefault = false);
    const address = addresses.find(addr => addr.id === id);
    if (address) address.isDefault = true;
    localStorage.setItem('addresses', JSON.stringify(addresses));
    loadAddresses();
    showToast('Default address updated!', 'success');
}

// Payment management
function showAddPaymentModal() {
    document.getElementById('addPaymentModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closePaymentModal() {
    document.getElementById('addPaymentModal').classList.remove('active');
    document.body.style.overflow = '';
}

function savePayment(event) {
    event.preventDefault();
    
    const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
    const newPayment = {
        id: paymentMethods.length + 1,
        type: getCardType(cardNumber),
        last4: cardNumber.slice(-4),
        expiry: document.getElementById('expiryDate').value,
        isDefault: document.getElementById('defaultPayment').checked
    };
    
    if (newPayment.isDefault) {
        paymentMethods.forEach(pm => pm.isDefault = false);
    }
    
    paymentMethods.push(newPayment);
    localStorage.setItem('paymentMethods', JSON.stringify(paymentMethods));
    
    loadPaymentMethods();
    closePaymentModal();
    showToast('Payment method added successfully!', 'success');
    event.target.reset();
    return false;
}

function deletePayment(id) {
    if (confirm('Are you sure you want to remove this payment method?')) {
        paymentMethods = paymentMethods.filter(pm => pm.id !== id);
        localStorage.setItem('paymentMethods', JSON.stringify(paymentMethods));
        loadPaymentMethods();
        showToast('Payment method removed!', 'success');
    }
}

function setDefaultPayment(id) {
    paymentMethods.forEach(pm => pm.isDefault = false);
    const payment = paymentMethods.find(pm => pm.id === id);
    if (payment) payment.isDefault = true;
    localStorage.setItem('paymentMethods', JSON.stringify(paymentMethods));
    loadPaymentMethods();
    showToast('Default payment method updated!', 'success');
}

// Helper functions
function getCardType(number) {
    if (number.startsWith('4')) return 'Visa';
    if (number.startsWith('5')) return 'Mastercard';
    if (number.startsWith('3')) return 'Amex';
    return 'Card';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function trackOrder(orderId) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const email = user.email || 'guest@example.com';
    window.location.href = `track-order.html?orderId=${orderId}&email=${email}`;
}

function viewOrderDetails(orderId) {
    showToast(`Viewing details for order ${orderId}...`, 'info');
}

function removeFromWishlist(id) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    wishlist = wishlist.filter(item => item.id !== id);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    loadWishlist();
    loadOverviewStats();
    showToast('Removed from wishlist', 'success');
}

function addToCartFromWishlist(id, name, price) {
    addToCart(id, name, price);
    showToast(`${name} added to cart!`, 'success');
}

function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('user');
        // Trigger storage event for other tabs
        window.dispatchEvent(new Event('storage'));
        showToast('Logged out successfully', 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }
}

// Toast notification
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: '✓',
        error: '✕',
        info: 'ℹ'
    };
    
    toast.innerHTML = `
        <span class="toast-icon">${icons[type] || 'ℹ'}</span>
        <span class="toast-message">${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 100);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Dark mode toggle
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
    
    const toggle = document.querySelector('.dark-mode-toggle');
    toggle.textContent = isDark ? '☀️' : '🌙';
}

// Load dark mode preference
document.addEventListener('DOMContentLoaded', () => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    if (isDark) {
        document.body.classList.add('dark-mode');
        const toggle = document.querySelector('.dark-mode-toggle');
        if (toggle) toggle.textContent = '☀️';
    }
});

// Format card number input
document.addEventListener('DOMContentLoaded', () => {
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\s/g, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
        });
    }
    
    const expiryInput = document.getElementById('expiryDate');
    if (expiryInput) {
        expiryInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2, 4);
            }
            e.target.value = value;
        });
    }
});
