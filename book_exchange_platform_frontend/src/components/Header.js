import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import logo from '../assets/logo.png';

function Header() {
  return (
    <header className="header">
      <div className="logo-container">
        <img src={logo} alt="Book Exchange Platform Logo" className="logo" />
        <h1>Book Exchange Platform</h1>
      </div>
      <nav>
        <Link to="/">Login</Link>
        <Link to="/register">Register</Link>
        <Link to="/forgot-password">Forgot Password</Link>
      </nav>
    </header>
  );
}

export default Header;
