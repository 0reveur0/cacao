import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      navigate('/dashboard');
    } catch (error) {
      alert(error.error_description || error.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-dark-cacao to-rich-chocolate font-sans text-milk-cream">
      <div className="w-full max-w-md p-8 space-y-8 bg-espresso-black/50 rounded-lg shadow-lg backdrop-blur-sm">
        <div className="text-center">
          <h1 className="text-4xl font-serif text-milk-cream">Welcome Back</h1>
          <p className="mt-2 text-milk-cream/80">Login to your cozy learning workspace.</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full p-4 bg-dark-cacao/50 rounded-lg border border-milk-cream/20 focus:ring-2 focus:ring-caramel-accent focus:border-caramel-accent transition duration-300 ease-in-out shadow-inner"
            />
          </div>
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full p-4 bg-dark-cacao/50 rounded-lg border border-milk-cream/20 focus:ring-2 focus:ring-caramel-accent focus:border-caramel-accent transition duration-300 ease-in-out shadow-inner"
            />
          </div>
          <button
            type="submit"
            className="w-full py-4 font-bold text-lg bg-caramel-accent text-espresso-black rounded-lg hover:bg-opacity-90 transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
          >
            Enter the Café
          </button>
        </form>
        <div className="text-center text-milk-cream/60">
          <p>Don't have an account? <a href="/register" className="text-caramel-accent hover:underline">Join us</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
