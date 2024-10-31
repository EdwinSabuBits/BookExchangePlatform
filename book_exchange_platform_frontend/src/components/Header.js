import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import logo from '../assets/logo.png';

function Header() {
  const isLoggedIn = !!localStorage.getItem('token'); // Check login state
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
          </>
        ) : (
          <>
            <Link to="/">Login</Link>
            <Link to="/register">Register</Link>
            <Link to="/forgot-password">Forgot Password</Link>
          </>
        )}
      </nav>
      {isLoggedIn && (
        <Link to="/" className="button_logout" onClick={() => {
          localStorage.removeItem('token');
        }}>
          Logout
        </Link>
      )}
    </header>
  );
}

export default Header;
