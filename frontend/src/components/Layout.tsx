import { ReactNode } from 'react';
import Navbar from './Navbar';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-slate-100">
      {isAuthenticated && <Navbar />}
      <main className={`${isAuthenticated ? 'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10' : ''}`}>
        {children}
      </main>
    </div>
  );
};

export default Layout;

