import React from 'react';
import { Home, AlertCircle, Layers } from 'lucide-react';
import './SLAThresholdAnalysis.css';

const SLAThresholdAnalysis = ({ metrics, agingData }) => {
    const displayMetrics = metrics ? [
        {
            ...metrics.close_to_breach,
            id: 'close',
            icon: <Home size={20} />,
            iconClass: 'icon-yellow',
            badgeClass: 'badge-yellow'
        },
        {
            ...metrics.breached,
            id: 'breached',
            icon: <AlertCircle size={20} />,
            iconClass: 'icon-red',
            badgeClass: 'badge-red'
        },
        {
            ...metrics.aging_rate,
            id: 'aging',
            icon: <Layers size={20} />,
            iconClass: 'icon-green',
            badgeClass: 'badge-green'
        }
    ] : [];

    const displayAgingData = agingData || [];

    const maxValue = displayAgingData.length > 0
        ? Math.max(...displayAgingData.flatMap(item => [item.safe, item.at_risk, item.breached]))
        : 100;

    return (
        <div className="sla-threshold-wrapper">
            <div className="sla-metrics-grid">
                {displayMetrics.map((metric) => (
                    <div key={metric.id} className="sla-metric-card-compact">
                        <div className="metric-header-compact">
                            <div className={`metric-icon-compact ${metric.iconClass}`}>
                                {metric.icon}
                            </div>
                            <span className={`metric-badge ${metric.badgeClass}`}>
                                {metric.change}
                            </span>
                        </div>
                        <div className="metric-content-compact">
                            <h3 className="metric-value-compact">
                                {metric.value} {metric.label || ''}
                            </h3>
                            <p className="metric-label-compact">{metric.title}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="sla-chart-card">
                <div className="chart-main-content">
                    <div className="chart-left-section">
                        <h3 className="chart-title">Aging vs SLA Threshold Analysis</h3>

                        <div className="vertical-bar-chart">
                            {displayAgingData.map((item, index) => (
                                <div key={index} className="bar-group">
                                    <div className="bars-container">
                                        <div className="bar-wrapper">
                                            <span className="bar-label-value safe-text">{item.safe}</span>
                                            <div
                                                className="vertical-bar safe-bar"
                                                style={{ height: `${(item.safe / maxValue) * 70}%` }}
                                            ></div>
                                        </div>
                                        <div className="bar-wrapper">
                                            <span className="bar-label-value at-risk-text">{item.at_risk}</span>
                                            <div
                                                className="vertical-bar at-risk-bar"
                                                style={{ height: `${(item.at_risk / maxValue) * 70}%` }}
                                            ></div>
                                        </div>
                                        <div className="bar-wrapper">
                                            <span className="bar-label-value breached-text">{item.breached}</span>
                                            <div
                                                className="vertical-bar breached-bar"
                                                style={{ height: `${(item.breached / maxValue) * 70}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    <div className="bar-group-label">{item.range}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="chart-legend-vertical">
                        <div className="legend-item">
                            <div className="legend-dot safe"></div>
                            <span>Safe</span>
                        </div>
                        <div className="legend-item">
                            <div className="legend-dot at-risk"></div>
                            <span>At Risk</span>
                        </div>
                        <div className="legend-item">
                            <div className="legend-dot breached"></div>
                            <span>Breached</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SLAThresholdAnalysis;
