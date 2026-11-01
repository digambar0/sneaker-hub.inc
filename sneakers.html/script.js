// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

function addToCart(id, name, price) {
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Show notification
    showNotification(`${name} added to cart!`);
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    if (typeof displayCart === 'function') {
        displayCart();
    }
}

function updateQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            localStorage.setItem('cart', JSON.stringify(cart));
            if (typeof displayCart === 'function') {
                displayCart();
            }
        }
    }
    updateCartCount();
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Newsletter subscription
async function subscribeNewsletter(event) {
    event.preventDefault();
    const email = event.target.querySelector('input[type="email"]').value;
    
    // Save to Supabase if available
    if (typeof subscribeToNewsletter === 'function') {
        const result = await subscribeToNewsletter(email);
        if (result.success) {
            showNotification('Thank you for subscribing!');
            event.target.reset();
        } else {
            if (result.error.code === '23505') { // Unique constraint violation
                showNotification('You are already subscribed!');
            } else {
                showNotification('Error subscribing. Please try again.');
            }
        }
    } else {
        showNotification('Thank you for subscribing!');
        event.target.reset();
    }
    return false;
}

// Back to top button
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.addEventListener('scroll', () => {
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    }
});

// Initialize cart count on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
});

// Product filtering
function filterProducts(category) {
    const cards = document.querySelectorAll('.shoe-card');
    cards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Search functionality
const searchInput = document.querySelector('.search-box input');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const cards = document.querySelectorAll('.shoe-card');
        
        cards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const category = card.querySelector('.shoe-category')?.textContent.toLowerCase() || '';
            
            if (title.includes(searchTerm) || category.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
}


// Loading Screen
window.addEventListener('load', () => {
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
        }, 500);
    }
});

// Wishlist functionality
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

function toggleWishlist(id, name) {
    const index = wishlist.findIndex(item => item.id === id);
    
    if (index > -1) {
        wishlist.splice(index, 1);
        showNotification(`${name} removed from wishlist`);
    } else {
        wishlist.push({ id, name });
        showNotification(`${name} added to wishlist`);
    }
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistUI();
}

function updateWishlistUI() {
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        const id = parseInt(btn.dataset.id);
        if (wishlist.some(item => item.id === id)) {
            btn.classList.add('active');
            btn.innerHTML = '❤️';
        } else {
            btn.classList.remove('active');
            btn.innerHTML = '🤍';
        }
    });
}

// Quick View Modal
function openQuickView(id, name, price, category) {
    const modal = document.getElementById('quickViewModal');
    if (!modal) return;
    
    document.getElementById('modalProductName').textContent = name;
    document.getElementById('modalProductPrice').textContent = `$${price}`;
    document.getElementById('modalProductCategory').textContent = category;
    document.getElementById('modalAddToCart').onclick = () => {
        addToCart(id, name, price);
        closeQuickView();
    };
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeQuickView() {
    const modal = document.getElementById('quickViewModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Size selector
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('size-option')) {
        document.querySelectorAll('.size-option').forEach(opt => opt.classList.remove('selected'));
        e.target.classList.add('selected');
    }
});

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
    updateWishlistUI();
});

// Mobile menu toggle
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('mobile-active');
}

// Close modal on outside click
window.addEventListener('click', (e) => {
    const modal = document.getElementById('quickViewModal');
    if (e.target === modal) {
        closeQuickView();
    }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});


// Dark mode functionality
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
    
    const toggle = document.querySelector('.dark-mode-toggle');
    if (toggle) {
        toggle.textContent = isDark ? '☀️' : '🌙';
    }
}

// Load dark mode preference on page load
(function() {
    const isDark = localStorage.getItem('darkMode') === 'true';
    if (isDark) {
        document.body.classList.add('dark-mode');
        const toggle = document.querySelector('.dark-mode-toggle');
        if (toggle) toggle.textContent = '☀️';
    }
})();

// Recently viewed products
function addToRecentlyViewed(productId, productName, productPrice, productCategory) {
    let recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
    
    // Remove if already exists
    recentlyViewed = recentlyViewed.filter(item => item.id !== productId);
    
    // Add to beginning
    recentlyViewed.unshift({
        id: productId,
        name: productName,
        price: productPrice,
        category: productCategory,
        timestamp: Date.now()
    });
    
    // Keep only last 10 items
    recentlyViewed = recentlyViewed.slice(0, 10);
    
    localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
}

// Product comparison
let compareList = JSON.parse(localStorage.getItem('compareList')) || [];

function addToCompare(id, name) {
    if (compareList.length >= 4) {
        showToast('You can only compare up to 4 products', 'error');
        return;
    }
    
    if (compareList.find(item => item.id === id)) {
        showToast('Product already in comparison', 'info');
        return;
    }
    
    compareList.push({ id, name });
    localStorage.setItem('compareList', JSON.stringify(compareList));
    updateCompareBar();
    showToast(`${name} added to comparison`, 'success');
}

function removeFromCompare(id) {
    compareList = compareList.filter(item => item.id !== id);
    localStorage.setItem('compareList', JSON.stringify(compareList));
    updateCompareBar();
}

function updateCompareBar() {
    let compareBar = document.querySelector('.compare-bar');
    
    if (!compareBar && compareList.length > 0) {
        compareBar = document.createElement('div');
        compareBar.className = 'compare-bar';
        compareBar.innerHTML = `
            <div class="compare-content">
                <div class="compare-items"></div>
                <button class="btn-compare" onclick="viewComparison()">Compare (${compareList.length})</button>
            </div>
        `;
        document.body.appendChild(compareBar);
    }
    
    if (compareBar) {
        const itemsContainer = compareBar.querySelector('.compare-items');
        itemsContainer.innerHTML = compareList.map(item => `
            <div class="compare-item">
                <span>${item.name}</span>
                <button onclick="removeFromCompare(${item.id})">×</button>
            </div>
        `).join('');
        
        const compareBtn = compareBar.querySelector('.btn-compare');
        compareBtn.textContent = `Compare (${compareList.length})`;
        
        if (compareList.length > 0) {
            compareBar.classList.add('active');
        } else {
            compareBar.classList.remove('active');
        }
    }
}

function viewComparison() {
    showToast('Comparison feature coming soon!', 'info');
}

// Enhanced toast with icons
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

// Track product views
document.addEventListener('DOMContentLoaded', () => {
    // Track when quick view is opened
    const originalOpenQuickView = window.openQuickView;
    if (originalOpenQuickView) {
        window.openQuickView = function(id, name, price, category) {
            addToRecentlyViewed(id, name, price, category);
            originalOpenQuickView(id, name, price, category);
        };
    }
    
    // Initialize compare bar
    updateCompareBar();
});

// Skeleton loading simulation
function showSkeletonLoading(container, count = 4) {
    const skeletons = Array(count).fill(0).map(() => `
        <div class="skeleton-card">
            <div class="skeleton-img"></div>
            <div class="skeleton-info">
                <div class="skeleton-text"></div>
                <div class="skeleton-text title"></div>
                <div class="skeleton-text"></div>
                <div class="skeleton-text price"></div>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = skeletons;
}

// Price range filter
function initPriceRangeFilter() {
    const priceRange = document.getElementById('priceRange');
    if (priceRange) {
        priceRange.addEventListener('input', (e) => {
            const value = e.target.value;
            document.getElementById('priceValue').textContent = `$${value}`;
            filterByPrice(value);
        });
    }
}

function filterByPrice(maxPrice) {
    const cards = document.querySelectorAll('.shoe-card');
    cards.forEach(card => {
        const priceText = card.querySelector('.price').textContent;
        const price = parseFloat(priceText.replace('$', ''));
        
        if (price <= maxPrice) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initPriceRangeFilter();
});


// Check authentication status and update navigation
function updateAuthUI() {
    const user = localStorage.getItem('user');
    const authButton = document.getElementById('authButton');
    const dashboardIcon = document.getElementById('dashboardIcon');
    
    if (authButton && dashboardIcon) {
        if (user) {
            // User is logged in - show dashboard icon, hide login button
            authButton.style.display = 'none';
            dashboardIcon.style.display = 'flex';
        } else {
            // User is not logged in - show login button, hide dashboard icon
            authButton.style.display = 'inline-block';
            dashboardIcon.style.display = 'none';
        }
    }
}

// Call on page load
document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
});

// Update UI after login/logout
window.addEventListener('storage', (e) => {
    if (e.key === 'user') {
        updateAuthUI();
    }
});
