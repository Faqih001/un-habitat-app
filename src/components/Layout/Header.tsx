
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Header = () => {
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-un-blue text-white shadow-md py-4">
      <div className="container mx-auto flex justify-between items-center px-4">
        <div className="flex items-center space-x-3">
          <Link to="/" className="hover:text-un-blue-light transition-colors">
            <h1 className="text-2xl font-bold truncate max-w-[200px] sm:max-w-none">UN-Habitat Projects</h1>
          </Link>
        </div>
        
        {isMobile ? (
          <>
            <button 
              onClick={toggleMobileMenu}
              className="text-white focus:outline-none p-2"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            
            {mobileMenuOpen && (
              <div className="absolute top-16 left-0 right-0 bg-un-blue z-50 shadow-lg py-4 px-4">
                <nav>
                  <ul className="flex flex-col space-y-4">
                    <li>
                      <Link 
                        to="/dashboard" 
                        className="block hover:text-un-blue-light transition-colors text-lg py-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/projects" 
                        className="block hover:text-un-blue-light transition-colors text-lg py-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Projects
                      </Link>
                    </li>
                  </ul>
                </nav>
              </div>
            )}
          </>
        ) : (
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
        )}
      </div>
    </header>
  );
};

export default Header;
