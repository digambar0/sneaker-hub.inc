// Authentication functions for Supabase

// Notification function (in case script.js isn't loaded yet)
function showNotification(message) {
    // Simple alert fallback to avoid infinite loop
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 30px;
        background: #111;
        color: #fff;
        padding: 15px 25px;
        border-radius: 5px;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Get supabase client
function getSupabase() {
    return window.supabaseClient;
}

// Sign Up
async function signUp(email, password, fullName) {
    try {
        const supabaseClient = getSupabase();
        
        console.log('📝 Attempting signup for:', email);
        
        // TEMPORARILY SKIP SUPABASE - Auth will be implemented later
        // Using localStorage only for now
        console.log('ℹ️ Using localStorage authentication (Supabase auth disabled)');
        return signUpWithLocalStorage(email, password, fullName);
        
        /* SUPABASE AUTH - UNCOMMENT WHEN READY
        // Check if Supabase is initialized
        if (!supabaseClient) {
            console.warn('⚠️ Supabase client not initialized - using localStorage fallback');
            return signUpWithLocalStorage(email, password, fullName);
        }

        console.log('📡 Sending signup request to Supabase...');
        showNotification('Creating your account...');
        
        // Add timeout to prevent hanging
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Request timeout - Supabase might be paused')), 10000)
        );
        
        const signupPromise = supabaseClient.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    full_name: fullName
                }
            }
        });
        
        const { data, error } = await Promise.race([signupPromise, timeoutPromise]);

        if (error) {
            console.error('❌ Signup error:', error);
            throw error;
        }

        console.log('✅ Signup successful!', data);
        
        // Check if email confirmation is required
        if (data.user && !data.session) {
            showNotification('Account created! Please check your email to confirm your account.');
        } else {
            showNotification('Account created successfully! You can now login.');
        }
        
        // Switch to login form after successful signup
        setTimeout(() => {
            if (typeof showForm === 'function') {
                showForm('login');
                const loginEmail = document.getElementById('login-email');
                if (loginEmail) loginEmail.value = email;
            }
        }, 2000);
        
        return { success: true, data };
        */
    } catch (error) {
        console.error('❌ Signup failed:', error);
        
        // If Supabase fails, use localStorage fallback
        if (error.message.includes('timeout') || error.message.includes('Failed to fetch')) {
            console.warn('⚠️ Supabase connection failed - using localStorage fallback');
            showNotification('Using offline mode - your account will be stored locally');
            return signUpWithLocalStorage(email, password, fullName);
        }
        
        let errorMessage = '';
        if (error.message.includes('already registered')) {
            errorMessage = 'This email is already registered. Please login instead.';
        } else {
            errorMessage = 'Error: ' + error.message;
        }
        
        showNotification(errorMessage);
        return { success: false, error };
    }
}

// Sign In
async function signIn(email, password) {
    try {
        // TEMPORARILY SKIP SUPABASE - Auth will be implemented later
        // Using localStorage only for now
        console.log('ℹ️ Using localStorage authentication (Supabase auth disabled)');
        return loginWithLocalStorage(email, password);
        
        /* SUPABASE AUTH - UNCOMMENT WHEN READY
        const supabaseClient = getSupabase();
        
        console.log('🔐 Attempting login for:', email);
        
        // Check if Supabase is initialized
        if (!supabaseClient) {
            console.error('❌ Supabase client not initialized');
            alert('Please configure Supabase first. Check supabase-config.js');
            return { success: false };
        }

        console.log('📡 Sending login request to Supabase...');
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) {
            console.error('❌ Login error:', error);
            throw error;
        }

        console.log('✅ Login successful!', data);
        showNotification('Login successful! Redirecting...');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
        return { success: true, data };
        */
    } catch (error) {
        console.error('❌ Login failed:', error);
        
        // Provide more helpful error messages
        let errorMessage = 'Error: ';
        if (error.message.includes('Invalid login credentials')) {
            errorMessage += 'Invalid email or password. Please check your credentials.';
        } else if (error.message.includes('Email not confirmed')) {
            errorMessage += 'Please confirm your email first. Check your inbox or disable email confirmation in Supabase settings.';
        } else {
            errorMessage += error.message;
        }
        
        showNotification(errorMessage);
        return { success: false, error };
    }
}

// Password Reset
async function resetPassword(email) {
    try {
        const supabaseClient = getSupabase();
        
        // Check if Supabase is initialized
        if (!supabaseClient) {
            alert('Please configure Supabase first. Check supabase-config.js');
            return { success: false };
        }

        const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + '/sneakers.html/auth.html'
        });

        if (error) throw error;

        showNotification('Password reset email sent! Check your inbox.');
        return { success: true };
    } catch (error) {
        showNotification('Error: ' + error.message);
        console.error('Password reset error:', error);
        return { success: false, error };
    }
}

// Handle forgot password click
function handleForgotPassword(event) {
    event.preventDefault();
    const email = prompt('Enter your email address:');
    if (email && email.includes('@')) {
        resetPassword(email);
    } else if (email) {
        showNotification('Please enter a valid email address');
    }
}

// Update form handlers
document.addEventListener('DOMContentLoaded', () => {
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            if (!email || !password) {
                showNotification('Please fill in all fields');
                return;
            }
            
            await signIn(email, password);
        });
    }

    // Signup form
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const fullName = document.getElementById('signup-name').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            const confirm = document.getElementById('signup-confirm').value;
            
            if (!fullName || !email || !password || !confirm) {
                showNotification('Please fill in all fields');
                return;
            }
            
            if (password !== confirm) {
                showNotification('Passwords do not match!');
                return;
            }
            
            if (password.length < 6) {
                showNotification('Password must be at least 6 characters!');
                return;
            }
            
            await signUp(email, password, fullName);
        });
    }
});


// ============================================
// LocalStorage Fallback Functions
// ============================================

// Sign up with localStorage
function signUpWithLocalStorage(email, password, fullName) {
    try {
        // Get existing users
        const users = JSON.parse(localStorage.getItem('localUsers') || '[]');
        
        // Check if email already exists
        if (users.find(u => u.email === email)) {
            showNotification('This email is already registered. Please login instead.');
            return { success: false, error: 'Email already exists' };
        }
        
        // Create new user
        const newUser = {
            id: 'local_' + Date.now(),
            email: email,
            password: password, // In production, this should be hashed!
            full_name: fullName,
            created_at: new Date().toISOString()
        };
        
        users.push(newUser);
        localStorage.setItem('localUsers', JSON.stringify(users));
        
        showNotification('Account created successfully! You can now login.');
        
        // Switch to login form
        setTimeout(() => {
            if (typeof showForm === 'function') {
                showForm('login');
                const loginEmail = document.getElementById('login-email');
                if (loginEmail) loginEmail.value = email;
            }
        }, 1500);
        
        return { success: true, data: { user: newUser } };
    } catch (error) {
        console.error('LocalStorage signup error:', error);
        showNotification('Error creating account. Please try again.');
        return { success: false, error: error.message };
    }
}

// Login with localStorage
function loginWithLocalStorage(email, password) {
    try {
        // Get existing users
        const users = JSON.parse(localStorage.getItem('localUsers') || '[]');
        
        // Find user
        const user = users.find(u => u.email === email && u.password === password);
        
        if (!user) {
            showNotification('Invalid email or password');
            return { success: false, error: 'Invalid credentials' };
        }
        
        // Store current user session
        const session = {
            id: user.id,
            email: user.email,
            name: user.full_name,
            created_at: user.created_at
        };
        
        localStorage.setItem('user', JSON.stringify(session));
        
        showNotification('Login successful! Redirecting...');
        
        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
        
        return { success: true, data: { user, session } };
    } catch (error) {
        console.error('LocalStorage login error:', error);
        showNotification('Error logging in. Please try again.');
        return { success: false, error: error.message };
    }
}

// Update the login function to use fallback
const originalLogin = window.login;
window.login = async function(email, password) {
    try {
        const supabaseClient = getSupabase();
        
        if (!supabaseClient) {
            console.warn('⚠️ Supabase not available - using localStorage');
            return loginWithLocalStorage(email, password);
        }
        
        // Try Supabase first with timeout
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Request timeout')), 10000)
        );
        
        const loginPromise = supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });
        
        const { data, error } = await Promise.race([loginPromise, timeoutPromise]);
        
        if (error) throw error;
        
        // Supabase login successful
        localStorage.setItem('user', JSON.stringify({
            id: data.user.id,
            email: data.user.email,
            name: data.user.user_metadata?.full_name || email.split('@')[0]
        }));
        
        showNotification('Login successful! Redirecting...');
        setTimeout(() => window.location.href = 'dashboard.html', 1000);
        
        return { success: true, data };
    } catch (error) {
        console.warn('⚠️ Supabase login failed - trying localStorage fallback');
        return loginWithLocalStorage(email, password);
    }
};
