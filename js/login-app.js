import { supabase } from './supabase-config.js';

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const loginForm = document.getElementById('login-form');
    const loginButton = document.getElementById('login-button');
    const loginError = document.getElementById('login-error');

    const googleLoginBtn = document.getElementById('google-login');
    const facebookLoginBtn = document.getElementById('facebook-login');
    const githubLoginBtn = document.getElementById('github-login');

    // --- Helper: Show Error ---
    const showError = (message) => {
        loginError.textContent = message;
        loginError.classList.remove('hidden');
    };

    // --- Helper: Hide Error ---
    const hideError = () => {
        loginError.textContent = '';
        loginError.classList.add('hidden');
    };

    // --- Helper: Set Loading State ---
    const setLoading = (isLoading) => {
        loginButton.disabled = isLoading;
        loginButton.textContent = isLoading ? 'Đang xử lý...' : 'Đăng nhập';
    };

    // --- Email/Password Login ---
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        hideError();
        setLoading(true);

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) {
                throw error;
            }

            // SUCCESS - Redirect immediately
            window.location.href = 'index.html';

        } catch (error) {
            console.error('Login error:', error.message);
            showError(error.message);
            setLoading(false);
        }
    });

    // --- OAuth Login Handler ---
    const handleOAuthLogin = async (provider) => {
        hideError();
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: provider,
                options: {
                    redirectTo: window.location.origin + '/index.html'
                }
            });

            if (error) {
                throw error;
            }
            // Provider will handle the redirect automatically
        } catch (error) {
            console.error(`OAuth login error (${provider}):`, error.message);
            showError(`Lỗi đăng nhập với ${provider}: ${error.message}`);
        }
    };

    // --- Social Login Button Events ---
    googleLoginBtn.addEventListener('click', () => handleOAuthLogin('google'));
    facebookLoginBtn.addEventListener('click', () => handleOAuthLogin('facebook'));
    githubLoginBtn.addEventListener('click', () => handleOAuthLogin('github'));
});
