import React, { useState, useEffect } from 'react';
import { ChevronDown, Calendar, CheckCircle2, MinusCircle, Star, List, Zap, LayoutDashboard, Sliders, FileText } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea, ReferenceLine, Label, LabelList } from 'recharts';
import './DashboardFour.css';

const IconMap = {
    "Calendar": Calendar,
    "CheckCircle2": CheckCircle2,
    "MinusCircle": MinusCircle,
    "Star": Star,
    "List": List,
    "Zap": Zap
};

const DashboardFour = () => {
    const [jobData, setJobData] = useState([]);
    const [botData, setBotData] = useState([]);
    const [licenseData, setLicenseData] = useState(null);
    const [costData, setCostData] = useState(null);
    const [automationData, setAutomationData] = useState(null);
    const [heatmapData, setHeatmapData] = useState(null);
    const [costActions, setCostActions] = useState([]);
    const [capacityWhatIfData, setCapacityWhatIfData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/data/dashboard.json');
                const result = await response.json();
                if (result.job_execution_analytics) {
                    setJobData(result.job_execution_analytics);
                }
                if (result.bot_busy_idle_hours) {
                    setBotData(sortByName(result.bot_busy_idle_hours));
                }
                if (result.license_machine_efficiency) {
                    const sortedLicense = {
                        ...result.license_machine_efficiency,
                        jobs_processed: sortByName(result.license_machine_efficiency.jobs_processed)
                    };
                    setLicenseData(sortedLicense);
                }
                if (result.cost_savings_roi) {
                    setCostData(result.cost_savings_roi);
                }
                if (result.automation_coverage_demand) {
                    setAutomationData(result.automation_coverage_demand);
                }
                if (result.bot_utilization_heatmap) {
                    setHeatmapData(result.bot_utilization_heatmap);
                }
                if (result.cost_optimization_actions) {
                    setCostActions(result.cost_optimization_actions);
                }
                if (result.capacity_what_if) {
                    setCapacityWhatIfData(result.capacity_what_if);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="dashboard-four-loading">Loading...</div>;

    return (
        <div className="dashboard-four-container">
            <div className="d4-header-row">
                <div className="d4-capacity-cost">
                    <span>Capacity, Cost & ROI</span>
                    <ChevronDown size={20} />
                </div>
                <div className="d4-date-picker">
                    <Calendar size={18} />
                    <span>Thursday, November 20, 2025</span>
                </div>
            </div>

            <div className="d4-cards-outer">
                <div className="d4-cards-container">
                    {jobData.map((card) => {
                        const IconComp = IconMap[card.icon] || Zap;
                        const label = card.title;
                        const growth = card.growth;
                        const isPositive = growth.startsWith('+') || growth === '100%' || growth === '+0%';
                        const isNegative = growth.startsWith('-');

                        return (
                            <div key={card.id} className="d4-stat-card">
                                <div className="d4-card-top">
                                    <div className="d4-icon-box" style={{ backgroundColor: card.icon_bg, color: card.icon_color }}>
                                        <IconComp size={20} />
                                    </div>
                                    <span className={`d4-growth-text ${isPositive ? 'd4-growth-positive' : isNegative ? 'd4-growth-negative' : 'd4-growth-neutral'}`}>
                                        {growth}
                                    </span>
                                </div>
                                <div className="d4-card-bottom">
                                    <div className="d4-card-value">{card.value}</div>
                                    <div className="d4-card-label">{label}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="d4-bot-usage-container">
                <div className="d4-bot-usage-header">
                    <h3>Bot Busy vs Idle Hours (Last 7 Days)</h3>
                </div>
                <div className="d4-bot-chart-outer">
                    <div className="d4-bot-chart-inner">
                        {botData.map((bot, index) => {
                            const busyWidth = (bot.busy / bot.total) * 100;
                            const pctValue = parseInt(bot.percentage);
                            let barColor = '#10B981';
                            let textColor = '#64748B';
                            if (pctValue < 20) {
                                barColor = '#EF4444';
                                textColor = '#EF4444';
                            } else if (pctValue < 50) {
                                barColor = '#F59E0B';
                            }

                            return (
                                <div key={index} className="d4-bot-row">
                                    <div className="d4-bot-name">{bot.name}</div>
                                    <div className="d4-bot-bar-wrapper">
                                        <div className="d4-bot-bar-bg">
                                            <div
                                                className="d4-bot-bar-fill"
                                                style={{ width: `${busyWidth}%`, backgroundColor: barColor }}
                                            ></div>
                                        </div>
                                        <div className="d4-bot-pct" style={{ color: textColor }}>{bot.percentage}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="d4-chart-xaxis">
                        <div className="d4-axis-labels">
                            <span>0h</span>
                            <span>6h</span>
                            <span>12h</span>
                            <span>18h</span>
                            <span></span>
                        </div>
                        <div className="d4-chart-legend">
                            <div className="d4-legend-item">
                                <div className="d4-legend-dot d4-busy"></div>
                                <span>Busy Hours</span>
                            </div>
                            <div className="d4-legend-item">
                                <div className="d4-legend-dot d4-idle"></div>
                                <span>Idle Hours</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="d4-bottom-section">
                {licenseData && (
                    <div className="d4-license-container">
                        <div className="d4-license-header">
                            <h3>License & Machine Efficiency</h3>
                        </div>
                        <div className="d4-license-metrics">
                            {licenseData.metrics.map((m, i) => (
                                <div key={i} className="d4-license-metric-box">
                                    <span className="d4-lm-label">{m.label}</span>
                                    <span className="d4-lm-value">{m.value}</span>
                                </div>
                            ))}
                        </div>
                        <div className="d4-jobs-processed-section">
                            <h4>Jobs Processed (Top 8 Bots)</h4>
                            <div className="d4-jobs-chart-wrapper">
                                {licenseData.jobs_processed.map((bot, idx) => {
                                    const maxVal = 500;
                                    const widthPct = (bot.count / maxVal) * 100;
                                    let barColor = '#059669';
                                    if (bot.count < 100) barColor = '#DC2626';
                                    else if (bot.count < 300) barColor = '#F59E0B';
                                    else if (bot.count < 400) barColor = '#10B981';

                                    return (
                                        <div key={idx} className="d4-jobs-row">
                                            <div className="d4-jobs-bot-name">{bot.name}</div>
                                            <div className="d4-jobs-bar-container">
                                                <div
                                                    className="d4-jobs-bar-fill"
                                                    style={{ width: `${widthPct}%`, backgroundColor: barColor }}
                                                ></div>
                                                <span className="d4-jobs-count">{bot.count}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {costData && (
                    <div className="d4-cost-roi-container">
                        <div className="d4-cost-roi-header">
                            <h3>Cost Savings & ROI</h3>
                        </div>
                        <div className="d4-cost-overview">
                            <div className="d4-cost-box cost-saved">
                                <span className="d4-co-label">Cost Saved</span>
                                <span className="d4-co-value">{costData.cost_saved}</span>
                            </div>
                            <div className="d4-cost-box automation-cost">
                                <span className="d4-co-label">Automation Cost</span>
                                <span className="d4-co-value">{costData.automation_cost}</span>
                            </div>
                        </div>
                        <div className="d4-roi-box">
                            <span className="d4-roi-label">Net ROI</span>
                            <span className="d4-roi-value">{costData.net_roi}</span>
                        </div>
                        <div className="d4-cost-comparison-section">
                            <h4>Cost vs Savings Comparison</h4>
                            <div className="d4-comparison-chart">
                                {costData.comparison.map((item, idx) => {
                                    const maxComp = Math.max(...costData.comparison.map(c => c.value));
                                    const barWidth = (item.value / maxComp) * 100;
                                    return (
                                        <div key={idx} className="d4-comp-row">
                                            <span className="d4-comp-label">{item.label}</span>
                                            <div className="d4-comp-bar-container">
                                                <div
                                                    className="d4-comp-bar-fill"
                                                    style={{ width: `${barWidth}%`, backgroundColor: item.color }}
                                                ></div>
                                                <span className="d4-comp-value" style={{ color: item.color }}>
                                                    ${item.value.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {automationData && (
                <div className="d4-automation-row">
                    <div className="d4-automation-container">
                        <div className="d4-automation-header">
                            <h3>Automation Coverage & Demand Alignment</h3>
                        </div>
                        <div className="d4-automation-content">
                            <div className="d4-automation-metrics-left">
                                {automationData.metrics.map((m, i) => (
                                    <div key={i} className="d4-auto-metric-box" style={{ backgroundColor: m.bg, borderColor: m.border, borderWidth: m.border ? '1px' : '0', borderStyle: 'solid' }}>
                                        <span className="d4-am-label">{m.label}</span>
                                        <span className="d4-am-value" style={{ color: m.color }}>{m.value}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="d4-automation-chart-right">
                                <div className="d4-auto-chart-header">
                                    <h4>Demand vs Capacity Forecast (Next 6 Months)</h4>
                                </div>
                                <div className="d4-auto-recharts-wrapper">
                                    <ResponsiveContainer width="100%" height={293}>
                                        <LineChart data={automationData.forecast} margin={{ top: 20, right: 40, left: 10, bottom: 30 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                            <XAxis
                                                dataKey="month"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fontSize: 12, fill: '#64748B', fontWeight: 500 }}
                                                dy={15}
                                                padding={{ left: 20, right: 20 }}
                                            />
                                            <YAxis
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fontSize: 12, fill: '#94A3B8' }}
                                                domain={[0, 3000]}
                                                ticks={[0, 1000, 2000, 3000]}
                                            />
                                            <Tooltip />
                                            <ReferenceArea x1="Apr" x2="Jun" y1={1500} y2={3000} fill="#FEF2F2" fillOpacity={0.6} strokeOpacity={0.3} />
                                            <Line
                                                type="monotone"
                                                dataKey="demand"
                                                stroke="#EF4444"
                                                strokeWidth={3}
                                                dot={false}
                                                name="Forecasted Demand"
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="capacity"
                                                stroke="#10B981"
                                                strokeWidth={3}
                                                strokeDasharray="5 5"
                                                dot={false}
                                                name="Current Capacity"
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                    <div className="d4-chart-labels-overlay">
                                        <span className="d4-label-demand">Forecasted Demand</span>
                                        <span className="d4-label-capacity">Current Capacity</span>
                                        <span className="d4-label-risk">SLA Risk Zone</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {heatmapData && (
                <div className="d4-utilization-section">
                    <div className="d4-utilization-container">
                        <div className="d4-utilization-header">
                            <h3>Underutilized & Overloaded Bots</h3>
                            <span className="d4-sub-title">Bot Utilization Heatmap (Week View)</span>
                        </div>
                        <div className="d4-heatmap-layout">
                            <div className="d4-heatmap-main">
                                <div className="d4-heatmap-grid">
                                    <div className="d4-header-cell"></div>
                                    {heatmapData.days.map((day, i) => (
                                        <div key={i} className="d4-day-header">{day}</div>
                                    ))}
                                    <div className="d4-header-cell"></div>

                                    {sortByName(heatmapData.bots).map((bot, botIdx) => (
                                        <React.Fragment key={botIdx}>
                                            <div className="d4-bot-row-label">{bot.name}</div>
                                            {bot.data.map((val, valIdx) => (
                                                <div
                                                    key={valIdx}
                                                    className="d4-heatmap-cell"
                                                    style={{ backgroundColor: getHeatmapColor(val) }}
                                                ></div>
                                            ))}
                                            <div className="d4-bot-row-pct" style={{ color: getHeatmapColor(parseInt(bot.utilization)) }}>
                                                {bot.utilization}
                                            </div>
                                        </React.Fragment>
                                    ))}
                                </div>
                                <div className="d4-heatmap-legend">
                                    {heatmapData.legend.map((item, i) => (
                                        <div key={i} className="d4-legend-item">
                                            <div className="d4-legend-box" style={{ backgroundColor: item.color }}></div>
                                            <span>{item.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="d4-cost-actions-sidebar">
                                <h4>Cost Optimization Actions</h4>
                                <div className="d4-cost-actions-list">
                                    {costActions.map((action) => (
                                        <div
                                            key={action.id}
                                            className="d4-action-box"
                                            style={{ backgroundColor: action.bg, borderColor: action.border, color: action.color }}
                                        >
                                            <span className="d4-action-title">{action.title}</span>
                                            <span className="d4-action-value">{action.value}</span>
                                            {action.description && <span className="d4-action-desc">{action.description}</span>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {capacityWhatIfData && (
                <div className="d4-whatif-section">
                    <div className="d4-whatif-container">
                        <div className="d4-whatif-header">
                            <h3>Capacity What-If Scenarios & Decision Intelligence</h3>
                        </div>
                        <div className="d4-whatif-content">
                            <div className="d4-scenarios-row">
                                {capacityWhatIfData.scenarios.map((s) => (
                                    <div key={s.id} className={`d4-scenario-card card-${s.type}`}>
                                        <div className="d4-scenario-top">
                                            <div className="d4-scenario-icon">
                                                <span>{s.icon_val}</span>
                                            </div>
                                            <h4>{s.title}</h4>
                                        </div>
                                        <div className="d4-scenario-metrics">
                                            {s.metrics.map((m, idx) => (
                                                <div key={idx} className="d4-smetric-row">
                                                    <span className="d4-sm-label">{m.label}</span>
                                                    <span className={`d4-sm-value ${m.highlight ? 'd4-highlight' : ''}`} style={{ color: m.color }}>{m.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="d4-scenario-footer">
                                            <div className="d4-status-line"></div>
                                            <div className="d4-status-text">
                                                {s.status_icon === 'check' && <CheckCircle2 size={14} />}
                                                {s.status_icon === 'x' && <MinusCircle size={14} />}
                                                <span>{s.status_text}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <div className="d4-sla-forecast-container">
                                    <div className="d4-sla-header">
                                        <h4>SLA Impact Forecast</h4>
                                    </div>
                                    <div className="d4-sla-chart-wrapper">
                                        <ResponsiveContainer width="100%" height={180}>
                                            <LineChart data={capacityWhatIfData.forecast} margin={{ top: 25, right: 90, left: 35, bottom: 0 }}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                                <XAxis
                                                    dataKey="week"
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{ fontSize: 11, fill: '#64748B', fontWeight: 500 }}
                                                    dy={10}
                                                    interval={0}
                                                    padding={{ left: 10, right: 10 }}
                                                />
                                                <YAxis
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{ fontSize: 11, fill: '#94A3B8' }}
                                                    domain={[80, 100]}
                                                    ticks={[80, 85, 90, 95, 100]}
                                                    tickFormatter={(val) => `${val}%`}
                                                />
                                                <Tooltip />
                                                <ReferenceLine y={100} stroke="transparent">
                                                    <Label value="100%" position="insideLeft" offset={-35} fill="#0F9D58" fontSize={11} fontWeight="800" />
                                                </ReferenceLine>
                                                <ReferenceLine y={90} stroke="#475569" strokeDasharray="3 3" strokeWidth={1}>
                                                    <Label value="90% Target" position="top" offset={10} textAnchor="end" fill="#334155" fontSize={11} fontWeight="bold" fontStyle="italic" />
                                                </ReferenceLine>
                                                <Line
                                                    type="monotone"
                                                    dataKey="add1"
                                                    stroke="#13A51A"
                                                    strokeWidth={3}
                                                    dot={{ r: 4, fill: '#13A51A', strokeWidth: 2, stroke: '#fff' }}
                                                    activeDot={{ r: 6 }}
                                                >
                                                    <LabelList
                                                        dataKey="add1"
                                                        content={(props) => {
                                                            const { x, y, value, index } = props;
                                                            if (index !== capacityWhatIfData.forecast.length - 1) return null;
                                                            return <text x={x} y={y - 15} fill="#0F9D58" fontSize={11} fontWeight="800" fontStyle="italic" textAnchor="middle">+1 Bot ({value}%)</text>;
                                                        }}
                                                    />
                                                </Line>
                                                <Line type="monotone" dataKey="current" stroke="#64748B" strokeWidth={2} strokeDasharray="3 3" dot={false}>
                                                    <LabelList
                                                        dataKey="current"
                                                        content={(props) => {
                                                            const { x, y, value, index } = props;
                                                            if (index !== capacityWhatIfData.forecast.length - 1) return null;
                                                            return <text x={x} y={y + 18} fill="#64748B" fontSize={11} fontWeight="600" textAnchor="middle">Current ({value}%)</text>;
                                                        }}
                                                    />
                                                </Line>
                                                <Line
                                                    type="monotone"
                                                    dataKey="remove1"
                                                    stroke="#C62828"
                                                    strokeWidth={3}
                                                    dot={{ r: 5, fill: '#C62828', strokeWidth: 2, stroke: '#fff' }}
                                                >
                                                    <LabelList
                                                        dataKey="remove1"
                                                        content={(props) => {
                                                            const { x, y, value, index } = props;
                                                            if (index !== capacityWhatIfData.forecast.length - 1) return null;
                                                            return <text x={x} y={y + 18} fill="#C62828" fontSize={11} fontWeight="800" fontStyle="italic" textAnchor="middle">-1 Bot ({value}%)</text>;
                                                        }}
                                                    />
                                                </Line>
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const getHeatmapColor = (val) => {
    if (val === 0) return '#E0E0E0';
    if (val < 10) return '#C62828';
    if (val < 30) return '#FF9800';
    if (val < 50) return '#FBBC09';
    if (val < 70) return '#0F9D58';
    return '#13A51A';
};

const sortByName = (data) => {
    return [...data].sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));
};

export default DashboardFour;
