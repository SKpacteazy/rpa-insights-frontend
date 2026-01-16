import React, { useState, useEffect } from 'react';
import { Save, Loader2, CircleSlash, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { UiPathConfigService } from '../../services/uipathConfigService';
import './UiPathConfiguration.css'; // We'll create this next

const UiPathConfiguration = () => {
    const { axiosInstance } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [showSecret, setShowSecret] = useState(false);

    const [config, setConfig] = useState({
        base_url: '',
        client_id: '',
        client_secret: '',
        org: '',
        tenant: '',
        scope: ''
    });

    useEffect(() => {
        if (axiosInstance) {
            fetchConfig();
        }
    }, [axiosInstance]);

    const fetchConfig = async () => {
        setLoading(true);
        setError(null);
        try {
            const service = UiPathConfigService(axiosInstance);
            const data = await service.getConfig();
            if (data) {
                setConfig({
                    base_url: data.base_url || '',
                    client_id: data.client_id || '',
                    client_secret: data.client_secret || '', // Might be empty if backend masks it
                    org: data.org || '',
                    tenant: data.tenant || '',
                    scope: data.scope || ''
                });
            }
        } catch (err) {
            setError("Failed to load configuration.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setConfig(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setSuccess(null);

        try {
            const service = UiPathConfigService(axiosInstance);
            await service.updateConfig(config);
            setSuccess("Configuration updated successfully!");
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError("Failed to save configuration. Please check your inputs.");
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="config-container loading">
                <Loader2 className="animate-spin" size={32} />
                <p>Loading configuration...</p>
            </div>
        );
    }

    return (
        <div className="config-container">
            <div className="config-header">
                <h2>UiPath API Configuration</h2>
                <p>Manage connection settings for your UiPath Orchestrator.</p>
            </div>

            {error && (
                <div className="config-alert error">
                    <CircleSlash size={18} />
                    <span>{error}</span>
                </div>
            )}

            {success && (
                <div className="config-alert success">
                    <span>{success}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="config-form">
                <div className="form-group">
                    <label>Base URL</label>
                    <input
                        type="url"
                        name="base_url"
                        value={config.base_url}
                        onChange={handleChange}
                        placeholder="https://cloud.uipath.com"
                        required
                    />
                    <small>The base URL of your UiPath Cloud or Orchestrator instance.</small>
                </div>

                <div className="form-group-row">
                    <div className="form-group">
                        <label>Organization Name</label>
                        <input
                            type="text"
                            name="org"
                            value={config.org}
                            onChange={handleChange}
                            placeholder="my-org"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Tenant Name</label>
                        <input
                            type="text"
                            name="tenant"
                            value={config.tenant}
                            onChange={handleChange}
                            placeholder="DefaultTenant"
                            required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Client ID</label>
                    <input
                        type="text"
                        name="client_id"
                        value={config.client_id}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Client Secret</label>
                    <div className="password-input-wrapper">
                        <input
                            type={showSecret ? "text" : "password"}
                            name="client_secret"
                            value={config.client_secret}
                            onChange={handleChange}
                            required
                        />
                        <button
                            type="button"
                            className="toggle-visibility"
                            onClick={() => setShowSecret(!showSecret)}
                        >
                            {showSecret ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                <div className="form-group">
                    <label>Scope</label>
                    <input
                        type="text"
                        name="scope"
                        value={config.scope}
                        onChange={handleChange}
                        placeholder="OR.Queues.Read"
                        required
                    />
                </div>

                <div className="form-actions">
                    <button type="submit" className="save-btn" disabled={saving}>
                        {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        {saving ? 'Saving...' : 'Save Configuration'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UiPathConfiguration;
