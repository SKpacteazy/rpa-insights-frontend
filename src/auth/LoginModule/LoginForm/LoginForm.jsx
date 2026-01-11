import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import { Bot, Lock, Mail } from 'lucide-react';
import './LoginForm.css';

const LoginForm = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // if (!formData.email || !formData.password) {
        //     setError('Please fill in all fields');
        //     return;
        // }

        // setIsLoading(true);
        // const result = await login(formData.email, formData.password);
        // setIsLoading(false);

        // if (result.success) {
        navigate('/');
        // } else {
        //     setError(result.message);
        // }
    };

    return (
        <div className="login-card">
            <div className="login-header">
                <div className="login-logo">
                    <Bot size={32} />
                </div>
                <h1 className="login-title">Welcome Back</h1>
                <p className="login-subtitle">Sign in to your UiPath Admin Dashboard</p>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label" htmlFor="email">Email Address</label>
                    <div className="input-wrapper">
                        <input
                            type="text"
                            id="email"
                            name="email"
                            className="form-input"
                            placeholder="admin@uipath.com"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <Mail className="input-icon" size={18} />
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="password">Password</label>
                    <div className="input-wrapper">
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="form-input"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <Lock className="input-icon" size={18} />
                    </div>
                </div>

                {error && <div className="error-message">{error}</div>}

                <div className="form-actions">
                    <label className="remember-me">
                        <input type="checkbox" />
                        Remember me
                    </label>
                    <a href="#" className="forgot-password">Forgot password?</a>
                </div>

                <button type="submit" className="login-button" disabled={isLoading}>
                    {isLoading ? 'LOGGING IN...' : 'LOGIN'}
                </button>
            </form>
        </div>
    );
};

export default LoginForm;
