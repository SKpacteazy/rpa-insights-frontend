import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../../auth/AuthContext';
import { DashboardJobsService } from '../../../../../services/dashboardJobsService';
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
    const { axiosInstance } = useAuth();
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
            if (!axiosInstance) return;

            try {
                const service = DashboardJobsService(axiosInstance);
                const [
                    snapshot, dist, trend, perf, reliability,
                    reasons, releases, triggers, risks, recentFailed
                ] = await Promise.all([
                    service.getJobsSnapshot(),
                    service.getJobsDistribution(),
                    service.getJobsTrend(),
                    service.getJobsPerformance(),
                    service.getJobsReliability(),
                    service.getJobsFailureReasons(),
                    service.getJobsByRelease(),
                    service.getJobsTriggers(),
                    service.getJobsRisk(24),
                    service.getRecentFailedJobs(10)
                ]);

                // 1. Snapshot -> jobData Matches UI format
                const s = snapshot;
                setJobData([
                    { id: 1, title: 'Total Jobs', value: s.total_jobs, growth: '+0%', icon: 'FileText', icon_bg: '#E0F2F1', icon_color: '#1F4E56' },
                    { id: 2, title: 'Pending', value: s.pending, growth: '+0%', icon: 'Clock', icon_bg: '#FFF3E0', icon_color: '#F97316' },
                    { id: 3, title: 'Running', value: s.running, growth: '+0%', icon: 'PlayCircle', icon_bg: '#E0F7FA', icon_color: '#06B6D4' },
                    { id: 4, title: 'Successful', value: s.successful, growth: '+0%', icon: 'CheckCircle2', icon_bg: '#DCFCE7', icon_color: '#10B981' },
                    { id: 5, title: 'Failed', value: s.failed, growth: '-0%', icon: 'XCircle', icon_bg: '#FEE2E2', icon_color: '#EF4444' },
                    { id: 6, title: 'Stopped', value: s.stopped, growth: '+0%', icon: 'Square', icon_bg: '#F3F4F6', icon_color: '#6B7280' }
                ]);

                // 2. Distribution
                const dCols = { 'Pending': '#F97316', 'Running': '#06B6D4', 'Successful': '#10B981', 'Failed': '#EF4444', 'Stopped': '#6B7280' };
                const distList = Object.keys(dCols).map(k => ({
                    name: k,
                    value: snapshot[k.toLowerCase()] || 0,
                    percentage: (dist[`${k.toLowerCase()}_percent`] || 0) + '%',
                    color: dCols[k]
                })).filter(i => i.value > 0);

                setDistData({
                    total: s.total_jobs,
                    data: distList
                });

                // 3. Trend
                // Merge separate lists (created, started, etc) by time_bucket
                const mergedTrend = {};
                (trend.jobs_created || []).forEach(x => { mergedTrend[x.time_bucket] = { time: x.time_bucket.substring(11, 16), Created: x.count }; });
                (trend.jobs_started || []).forEach(x => {
                    if (!mergedTrend[x.time_bucket]) mergedTrend[x.time_bucket] = { time: x.time_bucket.substring(11, 16) };
                    mergedTrend[x.time_bucket].Started = x.count;
                });
                (trend.jobs_completed || []).forEach(x => {
                    if (!mergedTrend[x.time_bucket]) mergedTrend[x.time_bucket] = { time: x.time_bucket.substring(11, 16) };
                    mergedTrend[x.time_bucket].Completed = x.count;
                });
                (trend.jobs_failed || []).forEach(x => {
                    if (!mergedTrend[x.time_bucket]) mergedTrend[x.time_bucket] = { time: x.time_bucket.substring(11, 16) };
                    mergedTrend[x.time_bucket].Failed = x.count;
                });
                setTrendData(Object.values(mergedTrend).sort((a, b) => a.time.localeCompare(b.time)));

                // 4. Performance (Time)
                // Backend returns: avg_execution_seconds, max_execution_seconds, median_execution_seconds (global)
                // And execution_trend: [{time_bucket, avg_exec_seconds}]
                setTimeData({
                    data: (perf.execution_trend || []).map(t => ({
                        day: t.time_bucket.substring(11, 16),
                        avg: Math.round(t.avg_exec_seconds / 60),
                        median: Math.round(perf.median_execution_seconds / 60), // Global median as flat line
                        max: Math.round(perf.max_execution_seconds / 60) // Global max as flat line
                    }))
                });

                // 5. Reliability
                setFailureData({
                    metrics: reliability.metrics || { failure_rate: '0%', total_failures: 0, mtbf: 'N/A' },
                    data: reliability.data || [] // Backend now returns daily trend
                });

                // 6. Top Failures
                const totalFailures = reasons.reduce((acc, r) => acc + r.count, 0);
                setTopFailures(reasons.map(r => ({
                    reason: r.failure_reason,
                    count: r.count,
                    percentage: totalFailures > 0 ? Math.round((r.count / totalFailures) * 100) + '%' : '0%'
                })));

                // 7. By Release
                setJobsByRelease(releases.map(r => ({
                    release_name: r.release_name,
                    job_count: r.job_count,
                    failure_rate: r.failure_rate_percent + '%',
                    is_high_risk: r.failure_rate_percent > 10,
                    avg_exec_time: Math.round(r.avg_execution_seconds) + 's',
                    last_failure: r.last_failure_time || '-'
                })));

                // 8. Triggers
                const tManual = triggers.by_source.find(x => x.source === 'Manual')?.count || 0;
                const tAgent = triggers.by_source.find(x => x.source === 'Agent')?.count || 0; // Assuming 'Agent' means Triggered
                // Actually source can be anything. Let's assume Manual vs Others.
                const tTotal = triggers.by_source.reduce((a, b) => a + b.count, 0);
                const tTriggered = tTotal - tManual;

                const uUnattended = triggers.by_type.find(x => x.type === 'Unattended')?.count || 0;
                const uAttended = triggers.by_type.find(x => x.type === 'Attended')?.count || 0;

                setTriggerData({
                    triggered_vs_manual: {
                        triggered: tTriggered,
                        manual: tManual
                    },
                    attended_vs_unattended: {
                        unattended: uUnattended,
                        attended: uAttended
                    },
                    runtime_type: { production: uUnattended + uAttended, development: 0, testing: 0 } // Placeholder
                });

                // 9. Risks
                setLongRunningData({
                    risk_flags: risks.risk_flags,
                    job_list: risks.job_list
                });

                // 10. Recent Failed
                setLastFailedData(recentFailed.map(j => ({
                    job_id: j.id,
                    release_name: j.release_name,
                    state: j.state,
                    start_time: j.start_time,
                    end_time: j.end_time,
                    duration: j.formatted_duration,
                    job_error: j.info,
                    source: j.source,
                    machine: j.host_machine_name
                })));

            } catch (error) {
                console.error("Error fetching Dashboard 3 data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [axiosInstance]);

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
