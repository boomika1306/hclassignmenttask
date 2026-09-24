import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Vote, PlusCircle, LayoutDashboard, ListOrdered, LogOut, Database, User } from 'lucide-react';

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand-logo">
          <div className="brand-icon-wrapper">
            <Vote size={22} />
          </div>
          <span>Live<span style={{ color: '#818cf8' }}>Poll</span></span>
        </Link>

        <nav className="nav-links">
          {isAuthenticated ? (
            <>
              <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <LayoutDashboard size={16} />
                <span>Dashboard</span>
              </NavLink>

              <NavLink to="/create" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <PlusCircle size={16} />
                <span>Create Poll</span>
              </NavLink>

              <NavLink to="/my-polls" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <ListOrdered size={16} />
                <span>My Polls</span>
              </NavLink>

              <NavLink to="/admin/db" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} title="Manual MongoDB Dashboard">
                <Database size={16} />
                <span>DB Explorer</span>
              </NavLink>

              <div className="user-pill">
                <div className="user-avatar">
                  {user?.name ? user.name.charAt(0).toUpperCase() : <User size={14} />}
                </div>
                <span className="user-name-text" style={{ fontWeight: 600 }}>{user?.name}</span>
              </div>

              <button onClick={handleLogout} className="btn btn-secondary btn-sm" title="Log Out">
                <LogOut size={15} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Home
              </NavLink>

              <NavLink to="/admin/db" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <Database size={15} />
                <span>DB Explorer</span>
              </NavLink>

              <Link to="/login" className="btn btn-secondary btn-sm">
                Login
              </Link>

              <Link to="/signup" className="btn btn-primary btn-sm">
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
