// Checkout functionality

let checkoutData = {
    shipping: {},
    payment: {},
    shippingCost: 5.99
};

// Initialize checkout
document.addEventListener('DOMContentLoaded', () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        showToast('Your cart is empty!', 'error');
        setTimeout(() => window.location.href = 'shop.html', 2000);
        return;
    }
    
    displayOrderSummary();
    updateCartCount();
    
    // Format card number input
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\s/g, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
        });
    }
    
    // Format expiry date
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

// Display order summary
function displayOrderSummary() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const orderItemsDiv = document.getElementById('orderItems');
    
    if (cart.length === 0) {
        orderItemsDiv.innerHTML = '<p class="empty-state">No items</p>';
        return;
    }
    
    orderItemsDiv.innerHTML = cart.map(item => `
        <div class="summary-item">
            <div class="summary-item-info">
                <span class="item-emoji">👟</span>
                <div>
                    <p class="item-name">${item.name}</p>
                    <p class="item-quantity">Qty: ${item.quantity}</p>
                </div>
            </div>
            <p class="item-price">$${(item.price * item.quantity).toFixed(2)}</p>
        </div>
    `).join('');
    
    updateTotals();
}

// Update totals
function updateTotals() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.10;
    const total = subtotal + checkoutData.shippingCost + tax;
    
    document.getElementById('summarySubtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('summaryShipping').textContent = `$${checkoutData.shippingCost.toFixed(2)}`;
    document.getElementById('summaryTax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('summaryTotal').textContent = `$${total.toFixed(2)}`;
}

// Update shipping cost
function updateShippingCost() {
    const shippingMethod = document.getElementById('shippingMethod').value;
    
    switch(shippingMethod) {
        case 'standard':
            checkoutData.shippingCost = 5.99;
            break;
        case 'express':
            checkoutData.shippingCost = 12.99;
            break;
        case 'overnight':
            checkoutData.shippingCost = 24.99;
            break;
    }
    
    updateTotals();
}

// Navigation between steps
function goToPayment() {
    // Validate shipping form
    const form = document.getElementById('shippingForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    // Save shipping data
    checkoutData.shipping = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        zip: document.getElementById('zip').value,
        country: document.getElementById('country').value,
        shippingMethod: document.getElementById('shippingMethod').options[document.getElementById('shippingMethod').selectedIndex].text
    };
    
    // Update UI
    document.getElementById('shipping-step').classList.remove('active');
    document.getElementById('payment-step').classList.add('active');
    document.getElementById('step-1').classList.remove('active');
    document.getElementById('step-1').classList.add('completed');
    document.getElementById('step-2').classList.add('active');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goToShipping() {
    document.getElementById('payment-step').classList.remove('active');
    document.getElementById('shipping-step').classList.add('active');
    document.getElementById('step-2').classList.remove('active');
    document.getElementById('step-1').classList.add('active');
    document.getElementById('step-1').classList.remove('completed');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goToReview() {
    // Validate payment form
    const form = document.getElementById('paymentForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    // Save payment data
    const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
    checkoutData.payment = {
        cardNumber: cardNumber,
        cardholderName: document.getElementById('cardholderName').value,
        expiryDate: document.getElementById('expiryDate').value,
        cvv: document.getElementById('cvv').value,
        last4: cardNumber.slice(-4),
        cardType: getCardType(cardNumber)
    };
    
    // Display review information
    displayReview();
    
    // Update UI
    document.getElementById('payment-step').classList.remove('active');
    document.getElementById('review-step').classList.add('active');
    document.getElementById('step-2').classList.remove('active');
    document.getElementById('step-2').classList.add('completed');
    document.getElementById('step-3').classList.add('active');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Display review information
function displayReview() {
    const shipping = checkoutData.shipping;
    const payment = checkoutData.payment;
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Shipping info
    document.getElementById('reviewShipping').innerHTML = `
        <p><strong>${shipping.firstName} ${shipping.lastName}</strong></p>
        <p>${shipping.address}</p>
        <p>${shipping.city}, ${shipping.state} ${shipping.zip}</p>
        <p>${shipping.country}</p>
        <p>Email: ${shipping.email}</p>
        <p>Phone: ${shipping.phone}</p>
        <p>Shipping: ${shipping.shippingMethod}</p>
    `;
    
    // Payment info
    document.getElementById('reviewPayment').innerHTML = `
        <p><strong>${payment.cardType} ending in ${payment.last4}</strong></p>
        <p>Cardholder: ${payment.cardholderName}</p>
        <p>Expires: ${payment.expiryDate}</p>
    `;
    
    // Order items
    document.getElementById('reviewItems').innerHTML = cart.map(item => `
        <div class="review-item">
            <span class="item-emoji">👟</span>
            <div class="item-details">
                <p class="item-name">${item.name}</p>
                <p class="item-quantity">Quantity: ${item.quantity}</p>
            </div>
            <p class="item-price">$${(item.price * item.quantity).toFixed(2)}</p>
        </div>
    `).join('');
}

// Place order
function placeOrder() {
    showToast('Processing your order...', 'info');
    
    // Simulate payment processing
    setTimeout(() => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * 0.10;
        const total = subtotal + checkoutData.shippingCost + tax;
        
        // Generate order ID
        const orderId = 'ORD-' + Date.now().toString().slice(-6);
        
        // Create order object
        const order = {
            id: orderId,
            date: new Date().toISOString().split('T')[0],
            status: 'pending',
            items: cart,
            subtotal: subtotal,
            shipping: checkoutData.shippingCost,
            tax: tax,
            total: total,
            shippingInfo: checkoutData.shipping,
            paymentInfo: {
                cardType: checkoutData.payment.cardType,
                last4: checkoutData.payment.last4
            },
            trackingNumber: 'TRK' + Date.now().toString().slice(-10),
            estimatedDelivery: getEstimatedDelivery(),
            timeline: {
                ordered: new Date().toLocaleString('en-US', { 
                    year: 'numeric', 
                    month: '2-digit', 
                    day: '2-digit', 
                    hour: '2-digit', 
                    minute: '2-digit' 
                }),
                confirmed: null,
                shipped: null,
                transit: null,
                delivery: null,
                delivered: null
            }
        };
        
        // Save order to localStorage
        let orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));
        
        // Save order to Supabase
        const orderData = {
            orderId: orderId,
            email: checkoutData.shipping.email,
            items: cart,
            subtotal: subtotal,
            shipping: checkoutData.shippingCost,
            tax: tax,
            total: total,
            shippingAddress: checkoutData.shipping,
            paymentMethod: checkoutData.payment.cardType + ' ending in ' + checkoutData.payment.last4
        };
        
        saveOrder(orderData).then(result => {
            if (result.success) {
                console.log('✅ Order saved to Supabase');
            } else {
                console.warn('⚠️ Order saved to localStorage only');
            }
        });
        
        // Clear cart
        localStorage.removeItem('cart');
        updateCartCount();
        
        // Show success and redirect
        showToast('Order placed successfully!', 'success');
        
        setTimeout(() => {
            window.location.href = `order-confirmation.html?orderId=${orderId}`;
        }, 1500);
        
        // Simulate order processing in background
        setTimeout(() => processOrder(orderId), 3000);
    }, 2000);
}

// Process order (simulate shipping updates)
function processOrder(orderId) {
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    const order = orders.find(o => o.id === orderId);
    
    if (!order) return;
    
    // Confirm order after 5 seconds
    setTimeout(() => {
        order.status = 'confirmed';
        order.timeline.confirmed = new Date().toLocaleString('en-US', { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit', 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        localStorage.setItem('orders', JSON.stringify(orders));
        console.log(`Order ${orderId} confirmed`);
    }, 5000);
    
    // Ship order after 10 seconds
    setTimeout(() => {
        order.status = 'shipped';
        order.timeline.shipped = new Date().toLocaleString('en-US', { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit', 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        localStorage.setItem('orders', JSON.stringify(orders));
        console.log(`Order ${orderId} shipped`);
    }, 10000);
    
    // In transit after 15 seconds
    setTimeout(() => {
        order.status = 'in_transit';
        order.timeline.transit = new Date().toLocaleString('en-US', { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit', 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        localStorage.setItem('orders', JSON.stringify(orders));
        console.log(`Order ${orderId} in transit`);
    }, 15000);
}

// Get estimated delivery date
function getEstimatedDelivery() {
    const shippingMethod = document.getElementById('shippingMethod').value;
    const today = new Date();
    let daysToAdd = 7;
    
    switch(shippingMethod) {
        case 'standard':
            daysToAdd = 7;
            break;
        case 'express':
            daysToAdd = 3;
            break;
        case 'overnight':
            daysToAdd = 1;
            break;
    }
    
    const deliveryDate = new Date(today.setDate(today.getDate() + daysToAdd));
    return deliveryDate.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

// Get card type
function getCardType(number) {
    if (number.startsWith('4')) return 'Visa';
    if (number.startsWith('5')) return 'Mastercard';
    if (number.startsWith('3')) return 'Amex';
    return 'Card';
}
