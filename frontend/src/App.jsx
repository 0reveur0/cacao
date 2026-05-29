
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Course from './pages/Course';
import PrivateRoute from './components/PrivateRoute';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;600&display=swap');

  body {
    font-family: 'Inter', sans-serif;
  }
`;

const AppContainer = styled.div`
  /* You can add app-wide container styles here if needed */
`;

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const userData = JSON.parse(atob(token.split('.')[1]));
        setUser(userData);
      } catch (e) {
        console.error("Invalid token", e);
        localStorage.removeItem('token');
      }
    }
  }, []);

  return (
    <Router>
      <GlobalStyle />
      <AppContainer>
        {/* The navigation can be improved and moved to a separate component */}
        <nav>
          <ul>
            {user ? (
              <>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><a href="#" onClick={() => {setUser(null); localStorage.removeItem('token');}}>Logout</a></li>
              </>
            ) : (
              <>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
              </>
            )}
          </ul>
        </nav>

        <Routes>
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<PrivateRoute user={user}><Dashboard user={user} /></PrivateRoute>} />
          <Route path="/course/:courseId" element={<PrivateRoute user={user}><Course user={user} /></PrivateRoute>} />
          <Route path="/" element={user ? <Dashboard user={user}/> : <Login setUser={setUser} />} />
        </Routes>
      </AppContainer>
    </Router>
  );
};

export default App;
