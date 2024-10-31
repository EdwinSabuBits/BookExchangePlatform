import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import logo from '../assets/logo.png';

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogout = () => {
    setIsLoggedIn(false);
    // Perform additional logout actions like clearing tokens, etc.
  };

  return (
    <header className="header">
      <div className="logo-container">
        <img src={logo} alt="Book Exchange Platform Logo" className="logo" />
        <h1>Book Exchange Platform</h1>
      </div>
      <nav>
        {isLoggedIn ? (
          <>
            <Link to="/profile">Profile</Link>
            <Link to="/search-books">Search Books</Link>
            <Link to="/book-listing">Book Listing</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/">Login</Link>
            <Link to="/register">Register</Link>
            <Link to="/forgot-password">Forgot Password</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
