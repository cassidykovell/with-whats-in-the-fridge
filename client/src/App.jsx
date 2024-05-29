import React from 'react';
import { Outlet } from 'react-router-dom';
import './index.css';
import Header from './components/Header';
import Nav from './components/Nav';
import Footer from './components/Footer';

const App = () => {
  return (
    <div className="layout">
      <header className="header">
        <Header />
        <Nav />
      </header>
      <div id="content">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default App;