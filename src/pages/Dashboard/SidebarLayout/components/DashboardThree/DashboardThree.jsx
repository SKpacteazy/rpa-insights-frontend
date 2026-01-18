import React, { useState, useEffect } from 'react';
import { ChevronDown, Calendar, FileText, Clock, PlayCircle, CheckCircle2, XCircle, Square, AlertTriangle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart, Area } from 'recharts';
import './DashboardThree.css';

const IconMap = {
    "FileText": FileText,
    "Clock": Clock,
    "PlayCircle": PlayCircle,
    "CheckCircle2": CheckCircle2,
    "XCircle": XCircle,
    "Square": Square
};

const DashboardThree = () => {
    const [jobData, setJobData] = useState([]);
    const [distData, setDistData] = useState(null);
    const [trendData, setTrendData] = useState(null);
    const [timeData, setTimeData] = useState(null);
    const [failureData, setFailureData] = useState(null);
    const [topFailures, setTopFailures] = useState(null);
    const [jobsByRelease, setJobsByRelease] = useState(null);
    const [triggerData, setTriggerData] = useState(null);
    const [longRunningData, setLongRunningData] = useState(null);
    const [lastFailedData, setLastFailedData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/data/dashboard.json');
                const result = await response.json();
                if (result.job_execution_analytics) {
                    setJobData(result.job_execution_analytics);
                }
                if (result.job_state_distribution) {
                    setDistData(result.job_state_distribution);
                }
                if (result.job_volume_trend) {
                    setTrendData(result.job_volume_trend);
                }
                if (result.job_time_performance) {
                    setTimeData(result.job_time_performance);
                }
                if (result.failure_stability) {
                    setFailureData(result.failure_stability);
                }
                if (result.top_failure_reasons_extended) {
                    setTopFailures(result.top_failure_reasons_extended);
                }
                if (result.jobs_by_release_health) {
                    setJobsByRelease(result.jobs_by_release_health);
                }
                if (result.job_trigger_analysis) {
                    setTriggerData(result.job_trigger_analysis);
                }
                if (result.long_running_jobs) {
                    setLongRunningData(result.long_running_jobs);
                }
                if (result.last_10_failed_jobs) {
                    setLastFailedData(result.last_10_failed_jobs);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="dashboard-three-loading">Loading...</div>;

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{ background: 'white', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
                    <p style={{ fontSize: '12px', fontWeight: 'bold' }}>{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} style={{ fontSize: '12px', color: entry.color }}>
                            {entry.name}: {entry.value}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="dashboard-three-container">
            <div className="d3-header-row">
                <div className="d3-title-container">
                    <h2>Job Execution Analytics <ChevronDown size={20} /></h2>
                </div>
                <div className="d3-date-picker">
                    <Calendar size={18} />
                    <span>Thursday, November 20, 2025</span>
                </div>
            </div>

            <div className="d3-cards-outer-limit">
                <div className="d3-cards-container">
                    {jobData.map((card) => {
                        const IconComp = IconMap[card.icon] || FileText;
                        return (
                            <div key={card.id} className="d3-stat-card">
                                <div className="d3-card-top">
                                    <div className="d3-icon-box" style={{ backgroundColor: card.icon_bg, color: card.icon_color }}>
                                        <IconComp size={20} />
                                    </div>
                                    <span className="d3-growth-text">{card.growth}</span>
                                </div>
                                <div className="d3-card-bottom">
                                    <div className="d3-card-value">{card.value}</div>
                                    <div className="d3-card-label">{card.title}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="d3-charts-row">
                {distData && (
                    <div className="d3-chart-card d3-dist-card">
                        <h3>Job State Distribution</h3>
                        <div className="d3-pie-content">
                            <div className="d3-pie-wrapper">
                                <ResponsiveContainer width="100%" height={240}>
                                    <PieChart>
                                        <Pie
                                            data={distData.data}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={90}
                                            paddingAngle={0}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {distData.data.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="d3-pie-center-text">
                                    <div className="d3-pie-total">{distData.total}</div>
                                    <div className="d3-pie-sub">Total Jobs</div>
                                </div>
                            </div>
                            <div className="d3-pie-legend">
                                {distData.data.map((item, index) => (
                                    <div key={index} className="d3-legend-item">
                                        <div className="d3-legend-color" style={{ backgroundColor: item.color }}></div>
                                        <div className="d3-legend-info">
                                            <span className="d3-legend-name">{item.name}</span>
                                            <span className="d3-legend-val">{item.value.toLocaleString()} ({item.percentage})</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {trendData && (
                    <div className="d3-chart-card d3-trend-card">
                        <div className="d3-trend-header">
                            <h3>Job Throughput & Volume Trend</h3>
                            <div className="d3-custom-legend-trend">
                                <div className="d3-legend-item-h">
                                    <div className="line-indicator" style={{ backgroundColor: '#1F4E56' }}></div> Created
                                </div>
                                <div className="d3-legend-item-h">
                                    <div className="line-indicator" style={{ backgroundColor: '#10B981' }}></div> Started
                                </div>
                                <div className="d3-legend-item-h">
                                    <div className="line-indicator" style={{ backgroundColor: '#059669', borderStyle: 'dashed' }}></div> Completed
                                </div>
                                <div className="d3-legend-item-h">
                                    <div className="line-indicator" style={{ backgroundColor: '#EF4444' }}></div> Failed
                                </div>
                            </div>
                        </div>
                        <div style={{ width: '100%', height: 260 }}>
                            <ResponsiveContainer>
                                <LineChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                                    <XAxis
                                        dataKey="time"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#9CA3AF', fontSize: 11 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#9CA3AF', fontSize: 11 }}
                                        ticks={[0, 100, 200, 300]}
                                        domain={[0, 300]}
                                    />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />

                                    <Line type="linear" dataKey="Created" stroke="#1F4E56" strokeWidth={2} dot={false} />
                                    <Line type="linear" dataKey="Started" stroke="#10B981" strokeWidth={2} dot={false} />
                                    <Line type="linear" dataKey="Completed" stroke="#059669" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                                    <Line type="linear" dataKey="Failed" stroke="#EF4444" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                )}
            </div>

            <div className="d3-performance-row">
                {timeData && (
                    <div className="d3-time-perf-card">
                        <div className="d3-card-header-row">
                            <h3>Job Execution Time Performance</h3>
                        </div>
                        <div className="d3-legend-custom-row">
                            <div className="d3-legend-item-h"><div className="line-indicator" style={{ backgroundColor: '#1F4E56' }}></div> Avg Time</div>
                            <div className="d3-legend-item-h"><div className="line-indicator" style={{ backgroundColor: '#10B981' }}></div> Median Time</div>
                            <div className="d3-legend-item-h"><div className="line-indicator" style={{ backgroundColor: '#EF4444', borderStyle: 'dashed' }}></div> Max Time</div>
                        </div>
                        <div style={{ width: '100%', height: 220 }}>
                            <ResponsiveContainer>
                                <LineChart data={timeData.data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 11 }} dy={10} />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#9CA3AF', fontSize: 11 }}
                                        ticks={[0, 5, 10, 15]}
                                        domain={[0, 15]}
                                        tickFormatter={(value) => `${value}m`}
                                    />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                                    <Line type="monotone" dataKey="avg" stroke="#1F4E56" strokeWidth={2} dot={false} />
                                    <Line type="monotone" dataKey="median" stroke="#10B981" strokeWidth={2} dot={false} />
                                    <Line type="monotone" dataKey="max" stroke="#EF4444" strokeWidth={2} strokeDasharray="3 3" dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {failureData && (
                    <div className="d3-failure-card">
                        <h3>Failure & Stability Analysis</h3>
                        <div className="d3-failure-content">
                            <div className="d3-failure-metrics">
                                <div className="d3-metric-box d3-box-yellow">
                                    <span>Job Failure Rate</span>
                                    <strong>{failureData.metrics.failure_rate}</strong>
                                </div>
                                <div className="d3-metric-box d3-box-red">
                                    <span>Total Failures (24h)</span>
                                    <strong>{failureData.metrics.total_failures}</strong>
                                </div>
                                <div className="d3-metric-box d3-box-green">
                                    <span>MTBF (Mean Time)</span>
                                    <strong>{failureData.metrics.mtbf}</strong>
                                </div>
                            </div>
                            <div className="d3-failure-chart">
                                <div className="d3-legend-custom-row" style={{ marginBottom: '10px', justifyContent: 'flex-end' }}>
                                    <div className="d3-legend-item-h"><div className="line-indicator" style={{ backgroundColor: '#EF4444' }}></div> Failure Count</div>
                                    <div className="d3-legend-item-h"><div className="line-indicator" style={{ backgroundColor: '#F59E0B' }}></div> Failure Rate %</div>
                                </div>
                                <ResponsiveContainer width="100%" height={185}>
                                    <ComposedChart data={failureData.data} margin={{ top: 10, right: 0, left: 10, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} dy={10} />
                                        <YAxis
                                            yAxisId="left"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#EF4444', fontSize: 12 }}
                                            ticks={[0, 50, 100, 150]}
                                            domain={[0, 150]}
                                            label={{ value: 'Count', angle: -90, position: 'insideLeft', offset: -5, fill: '#EF4444', fontSize: 12 }}
                                        />
                                        <YAxis
                                            yAxisId="right"
                                            orientation="right"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#F59E0B', fontSize: 12 }}
                                            ticks={[0, 3, 6, 9]}
                                            domain={[0, 9]}
                                            unit="%"
                                            label={{ value: 'Rate %', angle: 90, position: 'insideRight', offset: -5, fill: '#F59E0B', fontSize: 12 }}
                                        />
                                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                                        <Area yAxisId="left" type="monotone" dataKey="count" fill="#FEF2F2" stroke="#EF4444" strokeWidth={2} />
                                        <Line yAxisId="right" type="monotone" dataKey="rate" stroke="#F59E0B" strokeWidth={2} dot={false} />
                                    </ComposedChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="d3-bottom-row">
                {topFailures && (
                    <div className="d3-bottom-card d3-top-failures">
                        <h3>Top 10 Failure Reasons</h3>
                        <div className="d3-failures-list">
                            {topFailures.map((item, index) => (
                                <div key={index} className="d3-failure-item">
                                    <span className="d3-failure-name">{item.reason}</span>
                                    <div className="d3-failure-bar-group">
                                        <div className="d3-failure-bar-bg">
                                            <div className="d3-failure-bar" style={{ width: item.percentage }}></div>
                                        </div>
                                        <span className="d3-failure-count"><b>{item.count}</b></span>
                                        <span className="d3-failure-pct">{item.percentage}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {jobsByRelease && (
                    <div className="d3-bottom-card d3-jobs-release">
                        <h3>Jobs by Release (Process Health)</h3>
                        <div className="d3-table-container">
                            <table className="d3-custom-table">
                                <thead>
                                    <tr>
                                        <th>Release Name</th>
                                        <th>Job Count</th>
                                        <th>Failure Rate</th>
                                        <th>Avg Exec Time</th>
                                        <th>Last Failure</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {jobsByRelease.map((job, index) => (
                                        <tr key={index}>
                                            <td className="d3-release-name">{job.release_name}</td>
                                            <td className="d3-table-val"><b>{job.job_count}</b></td>
                                            <td className="d3-table-val" style={{ color: job.is_high_risk ? '#EF4444' : '#10B981' }}>
                                                <b>{job.failure_rate}</b>
                                            </td>
                                            <td className="d3-table-val">{job.avg_exec_time}</td>
                                            <td className="d3-table-val" style={{ color: '#6B7280' }}>{job.last_failure}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            <div className="d3-analysis-row">
                {triggerData && (
                    <div className="d3-trigger-card">
                        <h3>Job Trigger & Source Analysis</h3>
                        <div className="d3-trigger-content">

                            <div className="d3-trigger-section">
                                <div className="d3-trigger-labels">
                                    <span>Manual vs Triggered</span>
                                </div>
                                <div className="d3-progress-bar-container">
                                    <div className="d3-progress-segment dark" style={{ width: '78%' }}>
                                        Triggered: {triggerData.triggered_vs_manual.triggered.toLocaleString()}
                                    </div>
                                    <div className="d3-progress-segment light" style={{ width: '22%' }}>
                                        Manual: {triggerData.triggered_vs_manual.manual}
                                    </div>
                                </div>
                                <div className="d3-legend-small">
                                    <span className="dot dark"></span> Triggered (78%)
                                    <span className="dot light"></span> Manual (22%)
                                </div>
                            </div>

                            <div className="d3-trigger-section">
                                <div className="d3-trigger-labels">
                                    <span>Attended vs Unattended</span>
                                </div>
                                <div className="d3-progress-bar-container">
                                    <div className="d3-progress-segment green" style={{ width: '85%' }}>
                                        Unattended: {triggerData.attended_vs_unattended.unattended.toLocaleString()}
                                    </div>
                                    <div className="d3-progress-segment yellow" style={{ width: '15%' }}>
                                        {triggerData.attended_vs_unattended.attended}
                                    </div>
                                </div>
                                <div className="d3-legend-small">
                                    <span className="dot green"></span> Unattended (85%)
                                    <span className="dot yellow"></span> Attended (15%)
                                </div>
                            </div>

                            <div className="d3-trigger-section">
                                <div className="d3-trigger-labels">
                                    <span>Runtime Type Distribution</span>
                                </div>
                                <div className="d3-runtime-row">
                                    <div className="d3-runtime-box dark">
                                        <strong>{triggerData.runtime_type.production.toLocaleString()}</strong>
                                        <span>Production</span>
                                    </div>
                                    <div className="d3-runtime-box yellow">
                                        <strong>{triggerData.runtime_type.development}</strong>
                                        <span>Development</span>
                                    </div>
                                    <div className="d3-runtime-box gray">
                                        <strong>{triggerData.runtime_type.testing}</strong>
                                        <span>Testing</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                )}

                {longRunningData && (
                    <div className="d3-long-running-card">
                        <h3>Long-Running & Stuck Jobs (Risk Flags)</h3>
                        <div className="d3-long-content">
                            <div className="d3-risk-cards">
                                {longRunningData.risk_flags.map((item) => {
                                    let Icon = AlertTriangle;
                                    if (item.icon === 'Clock') Icon = Clock;
                                    if (item.icon === 'XCircle') Icon = XCircle;

                                    let styleClass = "risk-yellow";
                                    if (item.id === 'pending_long') styleClass = "risk-orange";
                                    if (item.id === 'zombie') styleClass = "risk-red";

                                    return (
                                        <div key={item.id} className={`d3-risk-box ${styleClass}`}>
                                            <div className="d3-risk-icon">
                                                <Icon size={24} />
                                            </div>
                                            <div className="d3-risk-text">
                                                <strong>{item.count}</strong>
                                                <span>{item.label}</span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            <div className="d3-risk-table-container">
                                <table className="d3-risk-table">
                                    <thead>
                                        <tr>
                                            <th>Job ID</th>
                                            <th>Release</th>
                                            <th>State</th>
                                            <th>Duration</th>
                                            <th>Risk</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {longRunningData.job_list.map((job, idx) => (
                                            <tr key={idx}>
                                                <td>{job.id}</td>
                                                <td>{job.release}</td>
                                                <td>
                                                    <span className={`status-badge ${job.state.toLowerCase()}`}>{job.state}</span>
                                                </td>
                                                <td>{job.duration}</td>
                                                <td>
                                                    <span className={`risk-badge ${job.risk.toLowerCase()}`}>{job.risk}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {lastFailedData && (
                <div className="d3-live-ops-row">
                    <div className="d3-live-ops-card">
                        <h3>Last 10 Failed Jobs (Live Ops Table)</h3>
                        <div className="d3-live-table-container">
                            <table className="d3-live-table">
                                <thead>
                                    <tr>
                                        <th>Job ID</th>
                                        <th>Release Name</th>
                                        <th>State</th>
                                        <th>Start Time</th>
                                        <th>End Time</th>
                                        <th>Duration</th>
                                        <th>Job Error</th>
                                        <th>Source</th>
                                        <th>Machine</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {lastFailedData.map((job, idx) => (
                                        <tr key={idx}>
                                            <td className="job-id-col">{job.job_id}</td>
                                            <td>{job.release_name}</td>
                                            <td><span className="live-status-badge faulted">{job.state}</span></td>
                                            <td>{job.start_time}</td>
                                            <td>{job.end_time}</td>
                                            <td><b>{job.duration}</b></td>
                                            <td className="error-text">{job.job_error}</td>
                                            <td>
                                                <span className={`live-source-badge ${job.source.toLowerCase()}`}>{job.source}</span>
                                            </td>
                                            <td className="machine-text">{job.machine}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default DashboardThree;
