import React, { useState, useEffect } from 'react';
import { Calendar, AlertCircle, TrendingUp, TrendingDown, AlertTriangle, Activity, Clock, RefreshCw } from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    Cell, PieChart, Pie, BarChart, Bar, Legend, AreaChart, Area, LabelList
} from 'recharts';
import SLAThresholdAnalysis from './SLAThresholdAnalysis';
import './DashboardTwo.css';

const CustomTrendTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="custom-trend-tooltip">
                <p className="tooltip-label">{label}</p>
                <div className="tooltip-value">
                    <span className="label-text">failures : </span>
                    <span className="value-text">{payload[0].value}</span>
                </div>
            </div>
        );
    }
    return null;
};

const staticFailedItems = [
    { queue: "Payment Processing", item_id: "QI-2847", creation_time: "09:45:23", failure_time: "09:47:12", exception_type: "Business", reason: "Invalid payment credentials", retry: 2, sla_status: "Breached" },
    { queue: "Email Notification", item_id: "QI-2846", creation_time: "09:42:15", failure_time: "09:46:08", exception_type: "System", reason: "SMTP connection timeout", retry: 3, sla_status: "At Risk" },
    { queue: "Data Validation", item_id: "QI-2845", creation_time: "09:40:34", failure_time: "09:45:22", exception_type: "Business", reason: "Missing required field", retry: 1, sla_status: "Normal" },
    { queue: "Payment Processing", item_id: "QI-2844", creation_time: "09:38:56", failure_time: "09:44:11", exception_type: "System", reason: "Database connection lost", retry: 4, sla_status: "Breached" },
    { queue: "Report Generation", item_id: "QI-2843", creation_time: "09:35:12", failure_time: "09:43:45", exception_type: "Application", reason: "Memory limit exceeded", retry: 2, sla_status: "At Risk" },
    { queue: "Data Validation", item_id: "QI-2842", creation_time: "09:32:48", failure_time: "09:42:33", exception_type: "Business", reason: "Duplicate record found", retry: 1, sla_status: "Normal" },
    { queue: "Email Notification", item_id: "QI-2841", creation_time: "09:30:22", failure_time: "09:41:18", exception_type: "System", reason: "Service unavailable (503)", retry: 3, sla_status: "Breached" },
    { queue: "Payment Processing", item_id: "QI-2840", creation_time: "09:28:09", failure_time: "09:40:05", exception_type: "Business", reason: "Insufficient balance", retry: 0, sla_status: "Normal" },
    { queue: "Image Processing", item_id: "QI-2839", creation_time: "09:25:44", failure_time: "09:38:52", exception_type: "Application", reason: "Invalid file format", retry: 2, sla_status: "At Risk" },
    { queue: "Data Validation", item_id: "QI-2838", creation_time: "09:22:31", failure_time: "09:37:20", exception_type: "System", reason: "API rate limit exceeded", retry: 5, sla_status: "Breached" }
];

const DashboardTwo = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/data/dashboard.json')
            .then(response => response.json())
            .then(data => {
                setDashboardData(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error loading dashboard data:', error);
                setLoading(false);
            });
    }, []);

    if (loading || !dashboardData) {
        return <div className="dashboard-two-container">Loading...</div>;
    }

    const { sla_monitoring } = dashboardData;

    const gaugeData = [
        { name: 'Compliance', value: sla_monitoring.compliance.percentage, fill: '#1F4E58' },
        { name: 'Remaining', value: 100 - sla_monitoring.compliance.percentage, fill: '#E5E7EB' }
    ];

    const agingData = sla_monitoring.aging_analysis.data;

    const exceptionData = sla_monitoring.exception_analysis.breakdown;

    const maxQueueFailures = Math.max(...sla_monitoring.failures_by_queue.map(q => q.failures));

    const maxRetryCount = Math.max(...sla_monitoring.retry_metrics.distribution.map(r => r.count));

    const maxFailureCount = Math.max(...sla_monitoring.top_failure_reasons.map(f => f.count));

    return (
        <div className="dashboard-two-container">
            <div className="dashboard-two-header">
                <div className="header-title-group">
                    <h2>SLA &amp; Exception Monitoring</h2>
                </div>
                <button className="date-filter">
                    <Calendar size={16} />
                    <span>Thursday, November 20, 2025</span>
                </button>
            </div>

            <div className="sla-section-1">
                <div className="sla-card sla-compliance-card">
                    <h3 className="sla-card-title">SLA Compliance</h3>
                    <div className="gauge-wrapper">
                        <ResponsiveContainer width="100%" height={210}>
                            <PieChart>
                                <Pie
                                    data={gaugeData}
                                    cx="50%"
                                    cy="50%"
                                    startAngle={180}
                                    endAngle={0}
                                    innerRadius={60}
                                    outerRadius={80}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {gaugeData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="gauge-center-value">
                            <h2>{sla_monitoring.compliance.percentage}%</h2>
                            <p>SLA Met</p>
                        </div>
                    </div>
                    <div className="sla-compliance-footer">
                        <div className="footer-metric">
                            <span className="footer-label">TARGET</span>
                            <span className="footer-value">{sla_monitoring.compliance.target}%</span>
                        </div>
                        <div className="footer-metric">
                            <span className="footer-label">BREACH</span>
                            <span className="footer-value breach-value">{sla_monitoring.compliance.breach_count}</span>
                        </div>
                    </div>
                </div>

                <div className="sla-metrics-container">
                    <div className="sla-metric-card">
                        <div className="metric-header">
                            <div className="metric-icon-wrapper danger">
                                <AlertCircle size={18} />
                            </div>
                            <div className={`metric-change ${sla_monitoring.breach_metrics.is_positive ? 'positive' : 'negative'}`}>
                                {sla_monitoring.breach_metrics.change}
                            </div>
                        </div>
                        <div className="metric-content">
                            <h3 className="metric-value">{sla_monitoring.breach_metrics.total_items} Items</h3>
                            <p className="metric-label">SLA Breach Count</p>
                        </div>
                    </div>

                    <div className="sla-metric-card">
                        <div className="metric-header">
                            <div className="metric-icon-wrapper success">
                                <TrendingUp size={18} />
                            </div>
                            <div className={`metric-change ${sla_monitoring.breach_metrics.duration_positive ? 'positive' : 'negative'}`}>
                                {sla_monitoring.breach_metrics.duration_change}
                            </div>
                        </div>
                        <div className="metric-content">
                            <h3 className="metric-value">{sla_monitoring.breach_metrics.avg_duration}</h3>
                            <p className="metric-label">Avg Breach Duration</p>
                        </div>
                    </div>
                </div>

                <div className="sla-card sla-trend-card">
                    <h3 className="sla-card-title">SLA Breach Trend (7 Days)</h3>
                    <div className="trend-chart-wrapper">
                        <ResponsiveContainer width="100%" height={210}>
                            <LineChart
                                data={sla_monitoring.breach_trend}
                                margin={{ top: 30, right: 20, left: 20, bottom: 10 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={true} />
                                <XAxis
                                    dataKey="day"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9CA3AF', fontSize: 11 }}
                                    padding={{ left: 15, right: 15 }}
                                />
                                <YAxis
                                    hide
                                    domain={[0, 100]}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'white',
                                        border: '1px solid #E5E7EB',
                                        borderRadius: '8px',
                                        fontSize: '12px'
                                    }}
                                />
                                <Line
                                    type="linear"
                                    dataKey="breaches"
                                    stroke="#DC2626"
                                    strokeWidth={2}
                                    dot={{ fill: '#DC2626', r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="sla-card sla-breaches-card">
                    <h3 className="sla-card-title">Recent SLA Breaches</h3>
                    <div className="breaches-list">
                        {sla_monitoring.recent_breaches.map((breach) => (
                            <div key={breach.id} className="breach-item">
                                <div className="breach-info">
                                    <h4>{breach.name}</h4>
                                    <span className="breach-time">{breach.time}</span>
                                </div>
                                <div className="breach-count-badge">{breach.count}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="sla-section-2">
                <SLAThresholdAnalysis
                    metrics={sla_monitoring.status_metrics}
                    agingData={sla_monitoring.aging_analysis.data}
                />
            </div>

            <div className="sla-section-3">
                <div className="sla-card exception-card">
                    <h3 className="sla-card-title">Failure & Exception Analysis</h3>
                    <div className="exception-chart-container">
                        <div className="donut-chart-wrapper">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={exceptionData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={70}
                                        outerRadius={95}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {exceptionData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="donut-center-text">
                                <h2>{sla_monitoring.exception_analysis.total_failures.toLocaleString()}</h2>
                                <p>Total Failures</p>
                            </div>
                        </div>
                        <div className="exception-legend">
                            {exceptionData.map((item, index) => (
                                <div key={index} className="exception-legend-item">
                                    <div className="legend-color" style={{ backgroundColor: item.color }}></div>
                                    <div className="legend-details">
                                        <span className="legend-name">{item.name}</span>
                                        <div className="legend-values">
                                            <span className="legend-count">{item.value.toLocaleString()}</span>
                                            <span className="legend-percentage">{item.percentage}%</span>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="failure-rate-box">
                                <div className="failure-rate-header">
                                    <span className="failure-rate-title">FAILURE RATE</span>
                                    <span className="failure-rate-value">2.85%</span>
                                </div>
                                <div className="failure-rate-bar-bg">
                                    <div className="failure-rate-bar-fill" style={{ width: `${(2.85 / 10) * 100}%` }}></div>
                                </div>
                                <div className="failure-rate-submetrics">
                                    <div className="submetric-row">
                                        <span className="submetric-label">Business Exception Rate</span>
                                        <span className="submetric-value">1.65%</span>
                                    </div>
                                    <div className="submetric-row">
                                        <span className="submetric-label">System Exception Rate</span>
                                        <span className="submetric-value">0.91%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="sla-card failures-queue-card">
                    <h3 className="sla-card-title">Failures by Queue</h3>
                    <div className="process-platform-badge">Process vs Platform Analysis</div>
                    <div className="queue-failures-list">
                        {sla_monitoring.failures_by_queue.map((queue, index) => {
                            let barColor = '#607D8B';
                            if (index < 2) barColor = '#C62828'; 
                            else if (index < 4) barColor = '#FBC02D'; 

                            return (
                                <div key={index} className="queue-failure-item">
                                    <span className="queue-name">{queue.queue}</span>
                                    <div className="queue-bar-container">
                                        <div
                                            className="queue-bar-fill"
                                            style={{
                                                width: `${(queue.failures / maxQueueFailures) * 100}%`,
                                                backgroundColor: barColor
                                            }}
                                        ></div>
                                    </div>
                                    <div className="queue-count">
                                        <span>{queue.failures}</span>
                                        <span className="queue-percentage">{(queue.failures / 82).toFixed(1)}%</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="sla-section-4">
                <div className="sla-card retry-card">
                    <h3 className="sla-card-title">Retry & Rework Indicators</h3>
                    <div className="retry-metrics-grid">
                        <div className="retry-metric">
                            <span className="retry-metric-label">RETRY RATE</span>
                            <h4 className="retry-metric-value">{sla_monitoring.retry_metrics.retry_rate.value}</h4>
                            <span className={`retry-metric-change ${sla_monitoring.retry_metrics.retry_rate.is_positive ? 'positive' : 'negative'}`}>
                                {sla_monitoring.retry_metrics.retry_rate.is_positive ? '↑' : '↓'} {sla_monitoring.retry_metrics.retry_rate.change}
                            </span>
                        </div>
                        <div className="retry-metric">
                            <span className="retry-metric-label">AVG RETRY COUNT</span>
                            <h4 className="retry-metric-value">{sla_monitoring.retry_metrics.avg_retry_count.value}</h4>
                            <span className="retry-metric-subtext">per failed item</span>
                        </div>
                        <div className="retry-metric">
                            <span className="retry-metric-label">RETRY SUCCESS</span>
                            <h4 className="retry-metric-value success-text">{sla_monitoring.retry_metrics.retry_success.value}</h4>
                            <span className="retry-metric-subtext">eventually succeed</span>
                        </div>
                    </div>
                    <div className="retry-distribution">
                        <ResponsiveContainer width="100%" height={150}>
                            <BarChart data={sla_monitoring.retry_metrics.distribution}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                                <XAxis
                                    dataKey="retries"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9CA3AF', fontSize: 11 }}
                                    formatter={(value) => `${value} Retr${value === '1' ? 'y' : 'ies'}`}
                                />
                                <YAxis hide />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={60}>
                                    {sla_monitoring.retry_metrics.distribution.map((entry, index) => {
                                        let color = '#819D99';
                                        if (index === 3) color = '#FCD34D';
                                        if (index === 4) color = '#E0807D';
                                        return <Cell key={`cell-${index}`} fill={color} />;
                                    })}
                                    <LabelList dataKey="count" position="top" style={{ fill: '#111827', fontSize: 11, fontWeight: 700 }} />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="system-health-container">
                    <div className={`health-alert-card ${sla_monitoring.system_health.orphan_items.status}`}>
                        <span className="health-alert-tag">{sla_monitoring.system_health.orphan_items.status === 'critical' ? 'Alert' : sla_monitoring.system_health.orphan_items.status === 'warning' ? 'Warning' : 'Normal'}</span>
                        <div className="health-alert-header">
                            <div className="health-icon-bg">
                                <AlertTriangle size={18} />
                            </div>
                        </div>
                        <div className="health-alert-content">
                            <h3 className="health-alert-value">{sla_monitoring.system_health.orphan_items.value} Items</h3>
                            <p className="health-alert-subtext">Orphan Queue Items</p>
                        </div>
                    </div>

                    <div className={`health-alert-card ${sla_monitoring.system_health.zombie_items.status}`}>
                        <span className="health-alert-tag">{sla_monitoring.system_health.zombie_items.status === 'critical' ? 'Alert' : sla_monitoring.system_health.zombie_items.status === 'warning' ? 'Warning' : 'Normal'}</span>
                        <div className="health-alert-header">
                            <div className="health-icon-bg">
                                <Clock size={18} />
                            </div>
                        </div>
                        <div className="health-alert-content">
                            <h3 className="health-alert-value">{sla_monitoring.system_health.zombie_items.value} Items</h3>
                            <p className="health-alert-subtext">Zombie Items (Long Running)</p>
                        </div>
                    </div>

                    <div className={`health-alert-card ${sla_monitoring.system_health.abandoned_rate.status}`}>
                        <span className="health-alert-tag">Indicator</span>
                        <div className="health-alert-header">
                            <div className="health-icon-bg">
                                <Activity size={18} />
                            </div>
                        </div>
                        <div className="health-alert-content">
                            <h3 className="health-alert-value">{sla_monitoring.system_health.abandoned_rate.value}</h3>
                            <p className="health-alert-subtext">Abandoned Item Rate</p>
                        </div>
                    </div>
                </div>

                <div className="sla-card failure-trend-card">
                    <div className="failure-trend-header">
                        <h3 className="sla-card-title">Failure Trend (Last 24 Hours)</h3>
                        {sla_monitoring.failure_trend_24h.some(p => p.spike) && (
                            <div className="trend-badge">Spike detected: {sla_monitoring.failure_trend_24h.find(p => p.spike).time}</div>
                        )}
                    </div>
                    <div className="failure-trend-wrapper">
                        <ResponsiveContainer width="100%" height={280}>
                            <AreaChart
                                data={sla_monitoring.failure_trend_24h}
                                margin={{ top: 30, right: 10, left: -20, bottom: 5 }}
                            >
                                <defs>
                                    <linearGradient id="colorFailuresFlat" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#FF0000" stopOpacity={0.08} />
                                        <stop offset="95%" stopColor="#FF0000" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="4 4" stroke="#F1F3F4" vertical={false} />
                                <XAxis
                                    dataKey="time"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9CA3AF', fontSize: 11 }}
                                    ticks={["04:00", "08:00", "12:00", "16:00", "20:00", "24:00"]}
                                    padding={{ left: 20, right: 20 }}
                                />
                                <YAxis hide domain={[0, 100]} />
                                <Tooltip
                                    content={<CustomTrendTooltip />}
                                    cursor={{ stroke: '#E5E7EB', strokeWidth: 1 }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="failures"
                                    stroke="#FF0000"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorFailuresFlat)"
                                    dot={(props) => {
                                        const { cx, cy, payload } = props;
                                        if (payload.isLowPoint) {
                                            return (
                                                <circle
                                                    key={`low-point-${payload.time}`}
                                                    cx={cx}
                                                    cy={cy}
                                                    r={4}
                                                    fill="#FF0000"
                                                    stroke="#FFFFFF"
                                                    strokeWidth={1.5}
                                                />
                                            );
                                        }
                                        return null;
                                    }}
                                    activeDot={{
                                        r: 6,
                                        fill: "#FF0000",
                                        stroke: "#FFFFFF",
                                        strokeWidth: 2
                                    }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="sla-section-5">
                <div className="sla-card top-failures-card">
                    <div className="top-failures-header">
                        <h3 className="sla-card-title">Top 10 Failure Reasons</h3>
                        <span className="coverage-badge">Accounts For  {sla_monitoring.top_failures_coverage}% of all failures
                        </span>
                    </div>
                    <div className="top-failures-table">
                        {sla_monitoring.top_failure_reasons.map((failure, index) => {
                            let barColor = '#819D99';
                            if (index < 2) barColor = '#D35555'; 
                            else if (index < 5) barColor = '#FCD34D'; 

                            const barWidth = (failure.count / 550) * 100;
                            const showValueInside = barWidth > 20;

                            return (
                                <div key={failure.id} className="failure-reason-row">
                                    <span className="failure-rank">{failure.id}</span>
                                    <span className="failure-reason">{failure.reason}</span>
                                    <div className="failure-bar-outer-container">
                                        <div className="failure-bar-container">
                                            <div
                                                className="failure-bar-fill"
                                                style={{
                                                    width: `${barWidth}%`,
                                                    backgroundColor: barColor
                                                }}
                                            >
                                                {showValueInside && (
                                                    <span className="failure-count-inner">{failure.count}</span>
                                                )}
                                            </div>
                                        </div>
                                        {!showValueInside && (
                                            <span className="failure-count-outer">{failure.count}</span>
                                        )}
                                    </div>
                                    <span className="failure-percentage">{failure.percentage}%</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            <div className="sla-section-6">
                <div className="sla-card failed-items-card">
                    <div className="failed-items-header">
                        <div className="title-group">
                            <h3 className="sla-card-title">Last 10 Failed Queue Items</h3>
                            <p className="sla-card-subtitle">Real-time failure monitoring - requires immediate attention</p>
                        </div>
                        <button className="refresh-btn">
                            <RefreshCw size={14} />
                            <span>Refresh</span>
                        </button>
                    </div>
                    <div className="failed-items-table-wrapper">
                        <table className="failed-items-table">
                            <thead>
                                <tr>
                                    <th>QUEUE NAME</th>
                                    <th>ITEM ID</th>
                                    <th>CREATION TIME</th>
                                    <th>FAILURE TIME</th>
                                    <th>EXCEPTION TYPE</th>
                                    <th>FAILURE REASON</th>
                                    <th>RETRY</th>
                                    <th>SLA STATUS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {staticFailedItems.map((item, index) => (
                                    <tr key={index}>
                                        <td className="queue-cell">
                                            <span className={`status-dot ${item.sla_status.toLowerCase().replace(' ', '-')}`}></span>
                                            {item.queue}
                                        </td>
                                        <td>{item.item_id}</td>
                                        <td>{item.creation_time}</td>
                                        <td>{item.failure_time}</td>
                                        <td>
                                            <span className={`exception-badge ${item.exception_type.toLowerCase()}`}>
                                                {item.exception_type}
                                            </span>
                                        </td>
                                        <td className="reason-cell">{item.reason}</td>
                                        <td className="retry-cell">{item.retry}</td>
                                        <td>
                                            <span className={`sla-status-badge ${item.sla_status.toLowerCase().replace(' ', '-')}`}>
                                                {item.sla_status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardTwo;
