import React from 'react';
import { Search, Bell, Menu, Bot, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../../auth/AuthContext';
import './Navbar.css';

const Navbar = ({ onToggleSidebar }) => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <button className="nav-icon-btn mobile-toggle" onClick={onToggleSidebar}>
                    <Menu size={20} />
                </button>

                <div className="brand">
                    <span className="navbar-brand-highlight">Ui</span>Path
                </div>

                <div className="global-search">
                    <Search size={16} className="search-icon" />
                    <input type="text" placeholder="Search resources..." className="search-input" />
                </div>
            </div>

            <div className="navbar-right">
                <button className="nav-icon-btn">
                    <Bell size={20} />
                </button>

                <div className="user-profile logout-container" onClick={handleLogout} title="Logout">
                    <div className="avatar">JD</div>
                    <span className="logout-text">Logout</span>
                </div>

                {/* Robot Icon at Right-End */}
                <button
                    className="nav-icon-btn bot-icon-btn"
                    onClick={() => navigate('/')}
                >
                    <Bot size={24} />
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
