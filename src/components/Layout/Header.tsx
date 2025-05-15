
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-un-blue text-white shadow-md py-4">
      <div className="container mx-auto flex justify-between items-center px-4">
        <div className="flex items-center space-x-3">
          <Link to="/" className="hover:text-un-blue-light transition-colors">
            <h1 className="text-2xl font-bold">UN-Habitat Projects</h1>
          </Link>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link 
                to="/dashboard" 
                className="hover:text-un-blue-light transition-colors"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link 
                to="/projects" 
                className="hover:text-un-blue-light transition-colors"
              >
                Projects
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
