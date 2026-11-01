// Supabase Configuration
const SUPABASE_URL = 'https://xpokjoextyuozeltwrqo.supabase.co';

const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhwb2tqb2V4dHl1b3plbHR3cnFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0MjI1NzAsImV4cCI6MjA4Nzk5ODU3MH0.tX5ZnU5drtS9NLtQZV-zEh0wElEKYFXHuYRZXxzFU2w';

// Initialize Supabase client on window object to avoid redeclaration
(function() {
    if (!window.supabaseClient) {
        try {
            if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
                window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
                console.log('✅ Supabase initialized successfully');
            } else {
                console.error('❌ Supabase library not loaded. Make sure the CDN script is included.');
            }
        } catch (error) {
            console.error('❌ Error initializing Supabase:', error);
        }
    }
})();

// Helper function to get supabase client
function getSupabaseClient() {
    return window.supabaseClient;
}

// Check if user is logged in
async function checkAuth() {
    const client = getSupabaseClient();
    if (!client) {
        console.warn('Supabase not initialized');
        return null;
    }
    try {
        const { data: { user } } = await client.auth.getUser();
        return user;
    } catch (error) {
        console.error('Auth check error:', error);
        return null;
    }
}

// Update UI based on auth state
async function updateAuthUI() {
    const user = await checkAuth();
    const authLink = document.querySelector('.icon-link[href="auth.html"]');
    
    if (user && authLink) {
        authLink.innerHTML = '👤 ' + (user.email?.split('@')[0] || 'User');
        authLink.href = '#';
        authLink.onclick = (e) => {
            e.preventDefault();
            if (confirm('Do you want to logout?')) {
                logout();
            }
        };
    }
}

// Logout function
async function logout() {
    const client = getSupabaseClient();
    if (!client) return;
    try {
        const { error } = await client.auth.signOut();
        if (!error) {
            window.location.href = 'index.html';
        }
    } catch (error) {
        console.error('Logout error:', error);
    }
}

// Initialize auth state on page load
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        updateAuthUI();
    });
}
