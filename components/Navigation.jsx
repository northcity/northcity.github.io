import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <header>
      <nav>
        <Link to="/">HOME</Link>
        <Link to="/about">ABOUT</Link>
        <Link to="/portfolio">PORTFOLIO</Link>
        <Link to="/tags">TAGS</Link>
        <Link to="/write">WRITE</Link>
      </nav>
    </header>
  );
};

export default Navigation; 