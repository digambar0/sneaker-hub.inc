// Product management with Supabase

// Get Supabase client
function getSupabase() {
    return window.supabaseClient || getSupabaseClient();
}

// Fetch all products
async function fetchProducts(category = null) {
    try {
        const client = getSupabase();
        if (!client) {
            console.warn('Supabase not initialized, using fallback');
            return { success: false, error: 'Supabase not initialized' };
        }

        let query = client.from('products').select('*');
        
        if (category && category !== 'all') {
            query = query.eq('category', category);
        }
        
        const { data, error } = await query.order('id', { ascending: true });
        
        if (error) throw error;
        
        console.log('✅ Products loaded from Supabase:', data.length);
        return { success: true, data };
    } catch (error) {
        console.error('Error fetching products:', error);
        return { success: false, error };
    }
}

// Fetch products by gender
async function fetchProductsByGender(gender) {
    try {
        const client = getSupabase();
        if (!client) {
            console.warn('Supabase not initialized');
            return { success: false, error: 'Supabase not initialized' };
        }

        const { data, error } = await client
            .from('products')
            .select('*')
            .eq('gender', gender)
            .order('id', { ascending: true });
        
        if (error) throw error;
        
        console.log(`✅ ${gender} products loaded:`, data.length);
        return { success: true, data };
    } catch (error) {
        console.error('Error fetching products:', error);
        return { success: false, error };
    }
}

// Fetch single product
async function fetchProduct(id) {
    try {
        const client = getSupabase();
        if (!client) {
            return { success: false, error: 'Supabase not initialized' };
        }

        const { data, error } = await client
            .from('products')
            .select('*')
            .eq('id', id)
            .single();
        
        if (error) throw error;
        
        return { success: true, data };
    } catch (error) {
        console.error('Error fetching product:', error);
        return { success: false, error };
    }
}

// Load products into page
async function loadProductsToPage(gender = null) {
    const shoeGrid = document.querySelector('.shoe-grid');
    if (!shoeGrid) return;

    // Show loading state
    shoeGrid.innerHTML = '<div class="loading-products">Loading products...</div>';

    try {
        let result;
        if (gender) {
            result = await fetchProductsByGender(gender);
        } else {
            result = await fetchProducts();
        }

        if (result.success && result.data && result.data.length > 0) {
            displayProducts(result.data, shoeGrid);
        } else {
            // Fallback: keep existing HTML products if Supabase fails
            console.warn('Using existing HTML products as fallback');
            shoeGrid.innerHTML = '<p>Products loaded from page</p>';
            // Remove the loading message to show existing products
            const loadingDiv = shoeGrid.querySelector('.loading-products');
            if (loadingDiv) loadingDiv.remove();
        }
    } catch (error) {
        console.error('Error loading products:', error);
        // Keep existing HTML products on error
        const loadingDiv = shoeGrid.querySelector('.loading-products');
        if (loadingDiv) loadingDiv.remove();
    }
}

// Display products in grid
function displayProducts(products, container) {
    container.innerHTML = '';
    
    products.forEach(product => {
        const productCard = createProductCard(product);
        container.innerHTML += productCard;
    });

    // Re-initialize scroll animations
    if (typeof observeElements === 'function') {
        observeElements();
    }
}

// Create product card HTML
function createProductCard(product) {
    const badge = product.badge ? `<span class="badge ${product.badge}">${product.badge}</span>` : '';
    const stars = '⭐'.repeat(Math.floor(product.rating || 4));
    
    return `
        <div class="shoe-card fade-in" data-category="${product.category}" data-id="${product.id}">
            ${badge}
            <button class="wishlist-btn" data-id="${product.id}" onclick="toggleWishlist(${product.id}, '${product.name}')">🤍</button>
            <div class="shoe-img" onclick="openQuickView(${product.id}, '${product.name}', ${product.price}, '${product.category}')">👟</div>
            <div class="shoe-info">
                <p class="shoe-category">${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</p>
                <h3>${product.name}</h3>
                <div class="product-rating">
                    <span class="stars">${stars}</span>
                    <span class="rating-count">(${product.review_count || 0})</span>
                </div>
                <p class="price">$${product.price}</p>
                <button class="btn-add-cart" onclick="addToCart(${product.id}, '${product.name}', ${product.price})">Add to Cart</button>
            </div>
        </div>
    `;
}

// Save order to database
async function saveOrder(orderData) {
    try {
        const client = getSupabase();
        if (!client) {
            console.warn('Supabase not initialized, order saved to localStorage only');
            return { success: false, error: 'Supabase not initialized' };
        }

        const user = await checkAuth();
        
        const orderRecord = {
            id: orderData.orderId,
            user_id: user ? user.id : null,
            user_email: orderData.email,
            items: orderData.items,
            subtotal: orderData.subtotal,
            shipping: orderData.shipping,
            tax: orderData.tax,
            total: orderData.total,
            status: 'pending',
            shipping_address: orderData.shippingAddress,
            payment_method: orderData.paymentMethod,
            tracking_number: orderData.orderId
        };

        const { data, error } = await client
            .from('orders')
            .insert([orderRecord])
            .select();
        
        if (error) throw error;
        
        console.log('✅ Order saved to Supabase:', data);
        showNotification('Order placed successfully!');
        return { success: true, data };
    } catch (error) {
        console.error('Error saving order:', error);
        console.warn('Order saved to localStorage as fallback');
        return { success: false, error };
    }
}

// Fetch user orders
async function fetchUserOrders(email) {
    try {
        const client = getSupabase();
        if (!client) {
            return { success: false, error: 'Supabase not initialized' };
        }

        const { data, error } = await client
            .from('orders')
            .select('*')
            .eq('user_email', email)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        return { success: true, data };
    } catch (error) {
        console.error('Error fetching orders:', error);
        return { success: false, error };
    }
}

// Save contact form submission
async function saveContactForm(formData) {
    try {
        const client = getSupabase();
        if (!client) {
            return { success: false, error: 'Supabase not initialized' };
        }

        const { data, error } = await client
            .from('contact_submissions')
            .insert([formData])
            .select();
        
        if (error) throw error;
        
        console.log('✅ Contact form saved to Supabase');
        return { success: true, data };
    } catch (error) {
        console.error('Error saving contact form:', error);
        return { success: false, error };
    }
}

// Subscribe to newsletter
async function subscribeToNewsletter(email) {
    try {
        const client = getSupabase();
        if (!client) {
            return { success: false, error: 'Supabase not initialized' };
        }

        const { data, error } = await client
            .from('newsletter_subscribers')
            .insert([{ email: email }])
            .select();
        
        if (error) {
            if (error.code === '23505') { // Unique violation
                return { success: false, error: 'Email already subscribed' };
            }
            throw error;
        }
        
        console.log('✅ Newsletter subscription saved');
        return { success: true, data };
    } catch (error) {
        console.error('Error subscribing:', error);
        return { success: false, error };
    }
}

// Initialize products on page load
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        // TEMPORARILY DISABLED - Supabase project may be paused
        // Uncomment when Supabase is active
        
        /*
        // Determine which page we're on and load appropriate products
        const path = window.location.pathname;
        
        if (path.includes('men.html')) {
            loadProductsToPage('men');
        } else if (path.includes('women.html')) {
            loadProductsToPage('women');
        } else if (path.includes('children.html')) {
            loadProductsToPage('children');
        } else if (path.includes('shop.html')) {
            loadProductsToPage('unisex');
        } else if (path.includes('index.html') || path.endsWith('/')) {
            // Load featured products on homepage (first 4 from shop)
            loadFeaturedProducts();
        }
        */
        
        console.log('ℹ️ Using HTML products (Supabase loading disabled)');
    });
}

// Load featured products for homepage
async function loadFeaturedProducts() {
    try {
        const result = await fetchProducts();
        if (result.success && result.data) {
            const featured = result.data.filter(p => p.gender === 'unisex').slice(0, 4);
            const container = document.querySelector('.featured .shoe-grid');
            if (container && featured.length > 0) {
                displayProducts(featured, container);
            }
        }
    } catch (error) {
        console.error('Error loading featured products:', error);
    }
}



// ============================================
// CART MANAGEMENT WITH SUPABASE
// ============================================

// Save cart to Supabase
async function saveCartToSupabase(email, cartItems) {
    try {
        const client = getSupabase();
        if (!client) {
            return { success: false, error: 'Supabase not initialized' };
        }

        // Delete existing cart items for this user
        await client.from('cart').delete().eq('user_email', email);

        // Insert new cart items
        const cartRecords = cartItems.map(item => ({
            user_email: email,
            product_id: item.id,
            product_name: item.name,
            price: item.price,
            quantity: item.quantity
        }));

        const { data, error } = await client
            .from('cart')
            .insert(cartRecords)
            .select();
        
        if (error) throw error;
        
        console.log('✅ Cart saved to Supabase');
        return { success: true, data };
    } catch (error) {
        console.error('Error saving cart:', error);
        return { success: false, error };
    }
}

// Load cart from Supabase
async function loadCartFromSupabase(email) {
    try {
        const client = getSupabase();
        if (!client) {
            return { success: false, error: 'Supabase not initialized' };
        }

        const { data, error } = await client
            .from('cart')
            .select('*')
            .eq('user_email', email);
        
        if (error) throw error;
        
        // Convert to cart format
        const cartItems = data.map(item => ({
            id: item.product_id,
            name: item.product_name,
            price: item.price,
            quantity: item.quantity
        }));
        
        console.log('✅ Cart loaded from Supabase:', cartItems.length, 'items');
        return { success: true, data: cartItems };
    } catch (error) {
        console.error('Error loading cart:', error);
        return { success: false, error };
    }
}

// Sync cart with Supabase (call this when cart changes)
async function syncCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const userEmail = localStorage.getItem('userEmail'); // Store user email when they checkout
    
    if (userEmail && cart.length > 0) {
        await saveCartToSupabase(userEmail, cart);
    }
}

// Add to wishlist in Supabase
async function addToWishlistSupabase(userId, productId) {
    try {
        const client = getSupabase();
        if (!client) {
            return { success: false, error: 'Supabase not initialized' };
        }

        const { data, error } = await client
            .from('wishlist')
            .insert([{ user_id: userId, product_id: productId }])
            .select();
        
        if (error) {
            if (error.code === '23505') { // Already in wishlist
                return { success: false, error: 'Already in wishlist' };
            }
            throw error;
        }
        
        console.log('✅ Added to wishlist in Supabase');
        return { success: true, data };
    } catch (error) {
        console.error('Error adding to wishlist:', error);
        return { success: false, error };
    }
}

// Remove from wishlist in Supabase
async function removeFromWishlistSupabase(userId, productId) {
    try {
        const client = getSupabase();
        if (!client) {
            return { success: false, error: 'Supabase not initialized' };
        }

        const { error } = await client
            .from('wishlist')
            .delete()
            .eq('user_id', userId)
            .eq('product_id', productId);
        
        if (error) throw error;
        
        console.log('✅ Removed from wishlist in Supabase');
        return { success: true };
    } catch (error) {
        console.error('Error removing from wishlist:', error);
        return { success: false, error };
    }
}

// Get user wishlist from Supabase
async function getUserWishlist(userId) {
    try {
        const client = getSupabase();
        if (!client) {
            return { success: false, error: 'Supabase not initialized' };
        }

        const { data, error } = await client
            .from('wishlist')
            .select(`
                *,
                products (*)
            `)
            .eq('user_id', userId);
        
        if (error) throw error;
        
        return { success: true, data };
    } catch (error) {
        console.error('Error fetching wishlist:', error);
        return { success: false, error };
    }
}

// Add product review
async function addProductReview(productId, userEmail, userName, rating, reviewText) {
    try {
        const client = getSupabase();
        if (!client) {
            return { success: false, error: 'Supabase not initialized' };
        }

        const { data, error } = await client
            .from('product_reviews')
            .insert([{
                product_id: productId,
                user_email: userEmail,
                user_name: userName,
                rating: rating,
                review_text: reviewText
            }])
            .select();
        
        if (error) throw error;
        
        console.log('✅ Review added to Supabase');
        return { success: true, data };
    } catch (error) {
        console.error('Error adding review:', error);
        return { success: false, error };
    }
}

// Get product reviews
async function getProductReviews(productId) {
    try {
        const client = getSupabase();
        if (!client) {
            return { success: false, error: 'Supabase not initialized' };
        }

        const { data, error } = await client
            .from('product_reviews')
            .select('*')
            .eq('product_id', productId)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        return { success: true, data };
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return { success: false, error };
    }
}

// Update order status (for admin or automated processes)
async function updateOrderStatus(orderId, newStatus) {
    try {
        const client = getSupabase();
        if (!client) {
            return { success: false, error: 'Supabase not initialized' };
        }

        const { data, error } = await client
            .from('orders')
            .update({ status: newStatus })
            .eq('id', orderId)
            .select();
        
        if (error) throw error;
        
        console.log(`✅ Order ${orderId} status updated to ${newStatus}`);
        return { success: true, data };
    } catch (error) {
        console.error('Error updating order status:', error);
        return { success: false, error };
    }
}

// Get all orders (for admin)
async function getAllOrders() {
    try {
        const client = getSupabase();
        if (!client) {
            return { success: false, error: 'Supabase not initialized' };
        }

        const { data, error } = await client
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        return { success: true, data };
    } catch (error) {
        console.error('Error fetching all orders:', error);
        return { success: false, error };
    }
}

// Search products
async function searchProducts(searchTerm) {
    try {
        const client = getSupabase();
        if (!client) {
            return { success: false, error: 'Supabase not initialized' };
        }

        const { data, error } = await client
            .from('products')
            .select('*')
            .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`)
            .order('name', { ascending: true });
        
        if (error) throw error;
        
        console.log(`✅ Found ${data.length} products matching "${searchTerm}"`);
        return { success: true, data };
    } catch (error) {
        console.error('Error searching products:', error);
        return { success: false, error };
    }
}

console.log('✅ Supabase products module loaded with all features');
