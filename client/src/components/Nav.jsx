import React from 'react';
import { Link } from 'react-router-dom';

const Nav = () => {
  return (
    <nav className="navbar">
      <Link to="/profile">My Profile</Link>
      <Link to="/signup">Sign Up/Log In</Link>
      <Link to="/fridge">Fridge</Link>
    </nav>
  );
};

export default Nav;