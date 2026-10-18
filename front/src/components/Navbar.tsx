import { NavLink, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogIn, UserPlus, FileText, LogOut, LayoutDashboard } from 'lucide-react';


const Navbar = () => {
    const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };


  const guestLinks = [
    { to: '/login', label: 'Login', icon: <LogIn size={18} /> },
    { to: '/register', label: 'SignUp', icon: <UserPlus size={18} />, isButton: true },
  ];

  const authLinks = [
    { to: '/posts', label: 'Posts', icon: <FileText size={18} /> },
  ];

  const navLinks = token ? authLinks : guestLinks;
  return (
      <header className="bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        
        <NavLink to="/" className="text-xl font-bold text-blue-600 flex items-center gap-2">
          <LayoutDashboard className="w-6 h-6" />
          <span>SJR</span>
        </NavLink>
        
        <nav className="flex gap-3 items-center">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => {
                if (link.isButton) {
                  return `flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
                    isActive
                      ? 'bg-blue-800 text-white font-semibold '
                      : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                  }`;
                }
                return `flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-800 text-white font-semibold '
                    : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                }`;
              }}
            >
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          ))}

          {token && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm hover:bg-red-100 transition-colors font-medium"
            >
              <LogOut size={18} />
              <span>LogOut</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Navbar
