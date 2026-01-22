import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WriteLetter from './pages/WriteLetter';
import Home from './pages/Home';
import About from './pages/About';
import Portfolio from './pages/Portfolio';
import Tags from './pages/Tags';
import Navigation from './components/Navigation';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/tags" element={<Tags />} />
            <Route path="/write" element={<WriteLetter />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 