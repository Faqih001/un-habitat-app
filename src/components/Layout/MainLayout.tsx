
import React from 'react';
import Header from './Header';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-3 sm:px-4 py-4 sm:py-6 overflow-x-hidden">
        {children}
      </main>
      <footer className="bg-gray-100 text-gray-600 text-xs sm:text-sm py-3 sm:py-4">
        <div className="container mx-auto px-3 sm:px-4 text-center">
          UN-Habitat Project Management System &copy; {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
