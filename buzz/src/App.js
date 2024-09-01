import './App.css';
import React, { useState, useEffect } from 'react';
import Home from './Components/Home/Home'
import Login from './Components/Register/Login'
import Register from './Components/Register/Register'
import Start from './Components/Register/Start'

import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';

function App() {
  // Logged in
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('authToken') !== null;
  });

  // Light/dark mode
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const lightModeColors = {
    Background: '#F4F4F4',
    Highlight: '#FFFFFF',
    Input: '#EEEEEE',
    Hover: '#FEEFE5',
    Text: '#333333',
  };

  const darkModeColors = {
    Background: '#0C0C0C',
    Highlight: '#181818',
    Input: '#2E2E2E',
    Hover: '#555555',
    Text: '#ffffff',
  };

  const currentColors = isDarkMode ? darkModeColors : lightModeColors;

  return (
    <Router>
      <div className="App" style={{ color: currentColors.Text, backgroundColor: currentColors.Background }}>
        <Routes>
            <Route path="/*" element={isLoggedIn ? 
                <Home colors={currentColors} toggleTheme={toggleTheme} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/> : 
                <Navigate to="/start" />} 
            />
          
            <Route path="/login" element={<Login colors={currentColors} setIsLoggedIn={setIsLoggedIn} />} />
            
            <Route path="/register" element={<Register colors={currentColors} />} />
            
            <Route path="/start" element={<Start colors={currentColors} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;