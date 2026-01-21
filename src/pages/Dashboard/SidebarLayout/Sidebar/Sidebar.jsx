import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Activity, Settings, LogOut, Bot, Sliders, PieChart } from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    // const handleLogout = () => {
    //     // Perform logout logic (handled by Navbar generally, but sidebar has one too)
    //     // Ideally should use AuthContext logout here too
    //     navigate('/login');
    // };

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={`sidebar-overlay ${isOpen ? 'open' : ''}`}
                onClick={onClose}
            />

            <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <div className="sidebar-logo-container">
                        <Bot size={20} />
                    </div>
                    <span className="sidebar-title">Admin</span>
                </div>

                <ul className="sidebar-menu">
                    <li className="menu-item">
                        <NavLink to="/" className={({ isActive }) => `menu-link ${isActive ? 'active' : ''}`} end>
                            <LayoutDashboard size={20} />
                            <span>Dashboard 1</span>
                        </NavLink>
                    </li>
                    <li className="menu-item">
                        <NavLink to="/dashboard-2" className={({ isActive }) => `menu-link ${isActive ? 'active' : ''}`}>
                            <Activity size={20} />
                            <span>Dashboard 2</span>
                        </NavLink>
                    </li>
                    <li className="menu-item">
                        <NavLink to="/dashboard-3" className={({ isActive }) => `menu-link ${isActive ? 'active' : ''}`}>
                            <LayoutDashboard size={20} />
                            <span>Dashboard 3</span>
                        </NavLink>
                    </li>
                    <li className="menu-item">
                        <NavLink to="/dashboard-4" className={({ isActive }) => `menu-link ${isActive ? 'active' : ''}`}>
                            <LayoutDashboard size={20} />
                            <span>Dashboard 4</span>
                        </NavLink>
                    </li>
                    <li className="menu-item">
                        <NavLink to="/configuration" className={({ isActive }) => `menu-link ${isActive ? 'active' : ''}`}>
                            <Sliders size={20} />
                            <span>Configuration</span>
                        </NavLink>
                    </li>
                    <li className="menu-item">
                        <NavLink to="/settings" className={({ isActive }) => `menu-link ${isActive ? 'active' : ''}`}>
                            <Settings size={20} />
                            <span>Settings</span>
                        </NavLink>
                    </li>
                    {/* <li className="menu-item menu-item-logout">
                        <button onClick={handleLogout} className="menu-link w-full logout-btn">
                            <LogOut size={20} />
                            <span>Logout</span>
                        </button>
                    </li> */}
                </ul>
            </aside>
        </>
    );
};

export default Sidebar;
