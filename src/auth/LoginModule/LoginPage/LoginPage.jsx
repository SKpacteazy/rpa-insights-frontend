import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Lock, Mail } from 'lucide-react';
import '../styles/login.css';

const LoginPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            setError(true);
            return;
        }
        // Mock login
        localStorage.setItem('isAuthenticated', 'true');
        navigate('/');
    };

    return (
        <div className="login-container">
            <div className={`login-card ${error ? 'shake' : ''}`}>
                <div className="login-header">
                    <div className="login-logo">
                        <Bot size={32} />
                    </div>
                    <h1 className="login-title">Welcome Back asasas</h1>
                    <p className="login-subtitle">Sign in to your UiPath Admin Dashboard</p>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="email">Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="form-input w-full"
                                placeholder="admin@uipath.com"
                                value={formData.email}
                                onChange={handleChange}
                                style={{ paddingLeft: '2.5rem' }}
                            />
                            <Mail size={18} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="password">Password</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                className="form-input w-full"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                style={{ paddingLeft: '2.5rem' }}
                            />
                            <Lock size={18} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                        </div>
                    </div>

                    <div className="form-actions">
                        <label className="remember-me">
                            <input type="checkbox" />
                            Remember me
                        </label>
                        <a href="#" className="forgot-password">Forgot password?</a>
                    </div>

                    <button type="submit" className="login-button">
                        LOGIN
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
