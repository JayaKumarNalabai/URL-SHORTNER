import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/auth/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/dashboard" className="text-2xl font-bold text-indigo-600 hover:text-indigo-700">
            LinkShort
          </Link>
          <div className="flex items-center space-x-4">
            {user && (
              <>
                <Link
                  to="/dashboard"
                  className="text-slate-600 hover:text-slate-900 font-medium"
                >
                  Dashboard
                </Link>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="text-slate-600 hover:text-slate-900 font-medium"
                  >
                    Admin
                  </Link>
                )}
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-slate-600">{user.email}</span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

