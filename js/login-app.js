document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const loginButton = document.getElementById('login-button');
    const loginError = document.getElementById('login-error');

    const googleLoginButton = document.getElementById('google-login');
    const facebookLoginButton = document.getElementById('facebook-login');
    const githubLoginButton = document.getElementById('github-login');

    // Check if Supabase client is available
    if (!supabase) {
        console.error('Supabase client is not available. Make sure supabase-config.js is loaded correctly.');
        return;
    }

    // --- Email/Password Login --- //
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default form submission
        loginError.classList.add('hidden');
        loginError.textContent = '';

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Disable button to prevent multiple clicks
        loginButton.disabled = true;
        loginButton.textContent = 'Đang xử lý...';

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) {
                throw error;
            }

            // SUCCESS: Redirect to the main page
            window.location.href = 'index.html';

        } catch (error) {
            console.error('Error logging in:', error.message);
            loginError.textContent = `Lỗi: ${error.message}`;
            loginError.classList.remove('hidden');
            
            // Re-enable the button
            loginButton.disabled = false;
            loginButton.textContent = 'Đăng nhập';
        }
    });

    // --- Social (OAuth) Logins --- //
    const handleOAuthLogin = async (provider) => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: provider,
                options: {
                    redirectTo: window.location.origin + '/index.html' // Use absolute URL for redirection
                }
            });

            if (error) {
                throw error;
            }
        } catch (error) {
            console.error(`Error with ${provider} login:`, error.message);
            loginError.textContent = `Lỗi đăng nhập với ${provider}: ${error.message}`;
            loginError.classList.remove('hidden');
        }
    };

    googleLoginButton.addEventListener('click', () => handleOAuthLogin('google'));
    facebookLoginButton.addEventListener('click', () => handleOAuthLogin('facebook'));
    githubLoginButton.addEventListener('click', () => handleOAuthLogin('github'));

});
