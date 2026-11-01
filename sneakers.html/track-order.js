// Track Order Functionality

// Sample order data (replace with Supabase data later)
const sampleOrders = {
    'ORD-001': {
        id: 'ORD-001',
        email: 'john@example.com',
        date: '2026-02-28',
        status: 'delivered',
        items: [
            { name: 'Air Max Pro', quantity: 2, price: 129.99, image: '👟' },
            { name: 'Urban Runner', quantity: 1, price: 149.99, image: '👟' }
        ],
        total: 409.97,
        shippingAddress: '123 Main Street, New York, NY 10001, United States',
        contact: 'john@example.com | +1 (555) 123-4567',
        trackingNumber: 'TRK1234567890',
        estimatedDelivery: 'March 5, 2026',
        timeline: {
            ordered: '2026-02-28 10:30 AM',
            confirmed: '2026-02-28 11:00 AM',
            shipped: '2026-03-01 09:00 AM',
            transit: '2026-03-02 02:00 PM',
            delivery: '2026-03-04 08:00 AM',
            delivered: '2026-03-04 03:30 PM'
        }
    },
    'ORD-002': {
        id: 'ORD-002',
        email: 'jane@example.com',
        date: '2026-03-01',
        status: 'shipped',
        items: [
            { name: 'Elite Performance', quantity: 1, price: 179.99, image: '👟' }
        ],
        total: 179.99,
        shippingAddress: '456 Oak Avenue, Los Angeles, CA 90001, United States',
        contact: 'jane@example.com | +1 (555) 987-6543',
        trackingNumber: 'TRK0987654321',
        estimatedDelivery: 'March 6, 2026',
        timeline: {
            ordered: '2026-03-01 02:15 PM',
            confirmed: '2026-03-01 02:45 PM',
            shipped: '2026-03-02 10:00 AM',
            transit: '2026-03-03 01:00 PM',
            delivery: null,
            delivered: null
        }
    },
    'ORD-003': {
        id: 'ORD-003',
        email: 'test@example.com',
        date: '2026-03-02',
        status: 'pending',
        items: [
            { name: 'Speed Racer', quantity: 1, price: 139.99, image: '👟' },
            { name: 'Street Style', quantity: 1, price: 119.99, image: '👟' }
        ],
        total: 259.98,
        shippingAddress: '789 Pine Road, Chicago, IL 60601, United States',
        contact: 'test@example.com | +1 (555) 456-7890',
        trackingNumber: 'TRK5555555555',
        estimatedDelivery: 'March 8, 2026',
        timeline: {
            ordered: '2026-03-02 04:00 PM',
            confirmed: '2026-03-02 04:30 PM',
            shipped: null,
            transit: null,
            delivery: null,
            delivered: null
        }
    }
};

// Track order function
function trackOrder(event) {
    event.preventDefault();
    
    const orderId = document.getElementById('orderId').value.trim().toUpperCase();
    const email = document.getElementById('trackEmail').value.trim().toLowerCase();
    
    // First check localStorage orders
    const localOrders = JSON.parse(localStorage.getItem('orders')) || [];
    let order = localOrders.find(o => o.id === orderId);
    
    // If not found in localStorage, check sample orders
    if (!order) {
        order = sampleOrders[orderId];
    }
    
    if (!order) {
        showToast('Order not found. Please check your Order ID.', 'error');
        return false;
    }
    
    // Verify email
    const orderEmail = order.email || order.shippingInfo?.email || '';
    if (orderEmail.toLowerCase() !== email) {
        showToast('Email does not match our records.', 'error');
        return false;
    }
    
    // Display tracking results
    displayTrackingResults(order);
    
    // Scroll to results
    document.getElementById('trackingResults').scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    return false;
}

// Display tracking results
function displayTrackingResults(order) {
    const resultsDiv = document.getElementById('trackingResults');
    
    // Update header
    document.getElementById('resultOrderId').textContent = order.id;
    document.getElementById('resultOrderDate').textContent = formatDate(order.date);
    
    // Update status badge
    const statusBadge = document.getElementById('resultStatus');
    statusBadge.textContent = order.status.toUpperCase();
    statusBadge.className = `status-badge status-${order.status}`;
    
    // Display order items
    const itemsList = document.getElementById('orderItemsList');
    itemsList.innerHTML = order.items.map(item => `
        <div class="tracking-item">
            <span class="item-image">${item.image}</span>
            <div class="item-info">
                <h4>${item.name}</h4>
                <p>Quantity: ${item.quantity}</p>
            </div>
            <p class="item-price">$${(item.price * item.quantity).toFixed(2)}</p>
        </div>
    `).join('');
    
    // Update timeline
    updateTimeline(order);
    
    // Update delivery info
    document.getElementById('shippingAddress').textContent = order.shippingAddress;
    document.getElementById('contactInfo').textContent = order.contact;
    document.getElementById('orderTotal').textContent = `$${order.total.toFixed(2)}`;
    document.getElementById('estimatedDelivery').textContent = order.estimatedDelivery;
    document.getElementById('trackingNumber').textContent = order.trackingNumber;
    
    // Show results
    resultsDiv.style.display = 'block';
}

// Update timeline based on order status
function updateTimeline(order) {
    const timeline = order.timeline;
    
    // Reset all timeline items
    document.querySelectorAll('.timeline-item').forEach(item => {
        item.classList.remove('completed', 'active');
    });
    
    // Update ordered
    if (timeline.ordered) {
        document.getElementById('timeline-ordered').classList.add('completed');
        document.getElementById('date-ordered').textContent = timeline.ordered;
    }
    
    // Update confirmed
    if (timeline.confirmed) {
        document.getElementById('timeline-confirmed').classList.add('completed');
        document.getElementById('date-confirmed').textContent = timeline.confirmed;
    }
    
    // Update shipped
    if (timeline.shipped) {
        document.getElementById('timeline-shipped').classList.add('completed');
        document.getElementById('date-shipped').textContent = timeline.shipped;
    }
    
    // Update transit
    if (timeline.transit) {
        document.getElementById('timeline-transit').classList.add('completed');
        document.getElementById('date-transit').textContent = timeline.transit;
    }
    
    // Update delivery
    if (timeline.delivery) {
        document.getElementById('timeline-delivery').classList.add('completed');
        document.getElementById('date-delivery').textContent = timeline.delivery;
    }
    
    // Update delivered
    if (timeline.delivered) {
        document.getElementById('timeline-delivered').classList.add('completed');
        document.getElementById('date-delivered').textContent = timeline.delivered;
    } else if (timeline.delivery) {
        document.getElementById('timeline-delivered').classList.add('active');
    } else if (timeline.transit) {
        document.getElementById('timeline-delivery').classList.add('active');
    } else if (timeline.shipped) {
        document.getElementById('timeline-transit').classList.add('active');
    } else if (timeline.confirmed) {
        document.getElementById('timeline-shipped').classList.add('active');
    } else {
        document.getElementById('timeline-confirmed').classList.add('active');
    }
}

// Reset tracking form
function resetTracking() {
    document.getElementById('trackingResults').style.display = 'none';
    document.getElementById('orderId').value = '';
    document.getElementById('trackEmail').value = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Print tracking details
function printTracking() {
    window.print();
}

// Contact support
function contactSupport() {
    window.location.href = 'contact.html';
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

// Auto-fill from URL parameters (if coming from dashboard)
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('orderId');
    const email = urlParams.get('email');
    
    if (orderId) {
        document.getElementById('orderId').value = orderId;
    }
    
    if (email) {
        document.getElementById('trackEmail').value = email;
    }
    
    // Auto-submit if both parameters are present
    if (orderId && email) {
        setTimeout(() => {
            document.querySelector('.track-form').dispatchEvent(new Event('submit'));
        }, 500);
    }
});
