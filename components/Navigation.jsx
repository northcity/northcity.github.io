import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navigation.css';

const Navigation = () => {
  return (
    <nav className="main-navigation">
      <ul>
        <li>
          <Link to="/" className="nav-link">
            HOME
          </Link>
        </li>
        <li>
          <Link to="/about" className="nav-link">
            ABOUT
          </Link>
        </li>
        <li>
          <Link to="/portfolio" className="nav-link">
            PORTFOLIO
          </Link>
        </li>
        <li>
          <Link to="/tags" className="nav-link">
            TAGS
          </Link>
        </li>
        <li>
          <Link to="/write" className="nav-link">
            WRITE
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation; 