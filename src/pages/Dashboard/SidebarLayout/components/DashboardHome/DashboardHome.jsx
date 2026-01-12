import React, { useState, useEffect } from 'react';
import {
    ClipboardList,
    PlusSquare,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    RotateCw,
    Trash2,
    Calendar,
    ChevronDown,
    Mail,
    Layers,
    Image,
    ArrowUp,
    ArrowDown,
    ArrowUpDown,
    Split,
    Scan
} from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    AreaChart,
    Area
} from 'recharts';
import './DashboardHome.css';

const IconMap = {
    "ClipboardList": ClipboardList,
    "PlusSquare": PlusSquare,
    "Clock": Clock,
    "CheckSquare": CheckCircle2,
    "CheckCircle2": CheckCircle2,
    "XCircle": XCircle,
    "AlertCircle": AlertCircle,
    "RotateCw": RotateCw,
    "Trash2": Trash2,
    "Mail": Mail,
    "Layers": Layers,
    "Image": Image,
    "ArrowUp": ArrowUp,
    "ArrowDown": ArrowDown,
    "Split": Split,
    "Scan": Scan
};

const ColorMap = {
    "Total Items": "bg-gray",
    "New Items": "bg-green",
    "In Progress": "bg-blue",
    "Successful": "bg-green",
    "Failed": "bg-red",
    "Abandoned": "bg-red",
    "Retried": "bg-blue",
    "Deleted": "bg-gray"
};

const DashboardHome = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/data/dashboard.json');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const jsonData = await response.json();
                setData(jsonData);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching dashboard data:", err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="dashboard-container">Loading dashboard data...</div>;
    if (error) return <div className="dashboard-container">Error loading data: {error}</div>;
    if (!data) return null;

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
        <div className="dashboard-container">
         
            <div className="dashboard-header">
                <div className="header-title-group">
                    <h2>
                        Queue Operations Dashboard <ChevronDown size={18} />
                    </h2>
                </div>
                <div className="date-filter">
                    <Calendar size={16} />
                    <span>Thursday, November 20, 2025</span>
                </div>
            </div>

           
            <div className="stats-grid">
                {data.summary_cards && data.summary_cards.map((card) => {
                    const IconComponent = IconMap[card.icon];
                    const iconBgClass = ColorMap[card.title] || "bg-gray";
                    return (
                        <div key={card.id} className="stat-card">
                            <div className="stat-top">
                                <div className={`stat-icon ${iconBgClass}`}>
                                    {IconComponent && <IconComponent size={18} />}
                                </div>
                                <span className={`stat-change ${card.is_positive ? 'positive' : 'negative'}`}>
                                    {card.change}
                                </span>
                            </div>
                            <div className="stat-content">
                                <div className="stat-value">{card.value}</div>
                                <div className="stat-title">{card.title}</div>
                            </div>
                        </div>
                    );
                })}
            </div>

            
            <div className="charts-grid">
                
                {data.demand_trend && (
                    <div className="chart-card" style={{ position: 'relative' }}>
                        <div className="chart-header">
                            <div className="chart-info">
                                <h3>Demand vs Completion Trend</h3>
                                <div className="trend-metrics">
                                    <div className="trend-metric created">
                                        <h4>Items Created</h4>
                                        <p>{data.demand_trend.metrics.created}</p>
                                    </div>
                                    <div className="trend-metric completed">
                                        <h4>Completed</h4>
                                        <p>{data.demand_trend.metrics.completed}</p>
                                    </div>
                                    <div className="trend-metric backlog">
                                        <h4>Backlog</h4>
                                        <p>{data.demand_trend.metrics.backlog}</p>
                                    </div>
                                </div>
                            </div>
                            <button className="time-filter-btn">
                                <Clock size={14} /> Last 24 Hours
                            </button>
                        </div>

                        <div className="chart-custom-legend">
                            <div className="legend-item-custom">
                                <div className="legend-line" style={{ backgroundColor: '#1F2937' }}></div>
                                <span>Created</span>
                            </div>
                            <div className="legend-item-custom">
                                <div className="legend-line" style={{ backgroundColor: '#10B981' }}></div>
                                <span>Completed</span>
                            </div>
                        </div>

                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <LineChart data={data.demand_trend.data} margin={{ top: 10, right: 30, bottom: 0, left: -20 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                                    <XAxis
                                        dataKey="time"
                                        tickLine={false}
                                        axisLine={false}
                                        tick={{ fill: '#9CA3AF', fontSize: 11 }}
                                        dy={10}
                                        interval={0} 
                                    />
                                    <YAxis
                                        tickLine={false}
                                        axisLine={false}
                                        tick={{ fill: '#9CA3AF', fontSize: 11 }}
                                        ticks={[0, 2000, 4000, 6000]}
                                        domain={[0, 6000]}
                                        tickFormatter={(value) => value === 0 ? '0' : `${value / 1000}k`}
                                    />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                                    <Line
                                        type="linear" 
                                        dataKey="created"
                                        stroke="#1F2937"
                                        strokeWidth={2.5}
                                        dot={{ r: 3.5, fill: '#1F2937', strokeWidth: 0 }}
                                        activeDot={{ r: 6 }}
                                        name="Created"
                                    />
                                    <Line
                                        type="linear"
                                        dataKey="completed"
                                        stroke="#10B981"
                                        strokeWidth={2.5}
                                        dot={{ r: 3.5, fill: '#10B981', strokeWidth: 2, stroke: '#fff' }}
                                        activeDot={{ r: 6 }}
                                        strokeDasharray="5 5"
                                        name="Completed"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {data.queue_status && (
                    <div className="chart-card">
                        <div className="chart-info">
                            <h3>Queue Status Distribution</h3>
                            <p className='chart-subtitle'>Current queue breakdown by status</p>
                        </div>
                        <div style={{ position: 'relative', height: 200, marginTop: '20px', marginBottom: '10px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data.queue_status.breakdown}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={65}
                                        outerRadius={90} 
                                        paddingAngle={0}
                                        dataKey="value"
                                        stroke="none"
                                        startAngle={90}
                                        endAngle={-270}
                                    >
                                        {data.queue_status.breakdown.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="donut-inner-text">
                                <h2>{data.queue_status.total}</h2>
                                <p>Total Items</p>
                            </div>
                        </div>

                        <div className="donut-legend-grid">
                            <div className="legend-column">
                                {data.queue_status.breakdown.filter(i => ['Successful', 'New', 'Failed'].includes(i.name))
                                    .sort((a, b) => ['Successful', 'New', 'Failed'].indexOf(a.name) - ['Successful', 'New', 'Failed'].indexOf(b.name))
                                    .map((item, index) => (
                                        <div key={index} className="legend-row">
                                            <div className="legend-label-group">
                                                <div className="legend-dot" style={{ backgroundColor: item.color }}></div>
                                                <span>{item.name}</span>
                                            </div>
                                            <div className="legend-value-group">
                                                <span className="legend-val">{item.value.toLocaleString()} </span>
                                                <span className="legend-pct">{item.percentage}</span>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                            <div className="legend-column">
                                {data.queue_status.breakdown.filter(i => ['In Progress', 'Abandoned'].includes(i.name))
                                    .map((item, index) => (
                                        <div key={index} className="legend-row">
                                            <div className="legend-label-group">
                                                <div className="legend-dot" style={{ backgroundColor: item.color }}></div>
                                                <span>{item.name}</span>
                                            </div>
                                            <div className="legend-value-group">
                                                <span className="legend-val">{item.value.toLocaleString()} </span>
                                                <span className="legend-pct">{item.percentage}</span>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="queue-aging-grid">
                {data.queue_aging && (
                    <div className="chart-card aging-card">
                        <div className="chart-header">
                            <div className="chart-info">
                                <h3>Queue Aging & Wait Time Distribution</h3>
                            </div>
                            <div className="threshold-alert">
                                <AlertCircle size={14} /> {data.queue_aging.threshold_alert}
                            </div>
                        </div>

                        <div className="aging-content">
                            <div className="aging-metrics">
                                <div className="aging-metric-box">
                                    <span className="metric-label">AVG WAIT TIME</span>
                                    <div className="metric-val">{data.queue_aging.avg_wait.value}</div>
                                    <span className={`metric-change ${data.queue_aging.avg_wait.is_positive ? 'safe' : 'danger'}`}>
                                        {data.queue_aging.avg_wait.is_positive ? <Clock size={12} /> : null}
                                        {data.queue_aging.avg_wait.change}
                                    </span>
                                </div>
                                <div className="aging-metric-box">
                                    <span className="metric-label">MAX QUEUE AGE</span>
                                    <div className="metric-val red-text">{data.queue_aging.max_age.value}</div>
                                    <span className={`metric-change ${data.queue_aging.max_age.is_positive ? 'safe' : 'danger'}`}>
                                        {data.queue_aging.max_age.change}
                                    </span>
                                </div>
                            </div>

                            <div className="aging-chart">
                                <ResponsiveContainer width="100%" height={200}>
                                    <BarChart data={data.queue_aging.distribution} barSize={40}>

                                        <XAxis
                                            dataKey="range"
                                            tickLine={false}
                                            axisLine={false}
                                            tick={{ fill: '#9CA3AF', fontSize: 11 }}
                                            dy={10}
                                        />
                                        <Tooltip cursor={{ fill: 'transparent' }} />
                                        <Bar dataKey="count" radius={[4, 4, 4, 4]}>
                                            {data.queue_aging.distribution.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                )}

                {data.processing_performance && (
                    <div className="chart-card processing-card">
                        <div className="chart-header no-margin-bottom">
                            <div className="chart-info">
                                <h3>Processing Time Performance</h3>
                                <div className="processing-metrics">
                                    <div className="proc-metric">
                                        <span>Avg Processing</span>
                                        <h4>{data.processing_performance.metrics.avg}</h4>
                                    </div>
                                    <div className="proc-divider"></div>
                                    <div className="proc-metric">
                                        <span>Median</span>
                                        <h4 className="black">{data.processing_performance.metrics.median}</h4>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ width: '100%', height: 200, marginTop: '20px' }}>
                            <ResponsiveContainer>
                                <AreaChart data={data.processing_performance.data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6B7280" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#6B7280" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                                    <XAxis
                                        dataKey="time"
                                        tickLine={false}
                                        axisLine={false}
                                        tick={{ fill: '#9CA3AF', fontSize: 11 }}
                                        dy={10}
                                    />
                                    <YAxis hide />
                                    <Tooltip />
                                    <Area
                                        type="linear"
                                        dataKey="value"
                                        stroke="#1E4E58"
                                        strokeWidth={2}
                                        fillOpacity={1}
                                        fill="url(#colorValue)"
                                        dot={{ r: 3, fill: '#1E4E58', strokeWidth: 0 }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}
            </div>

            {data.queue_benchmark && (
                <div className="chart-card benchmarking-card" style={{ marginTop: '24px' }}>
                    <div className="chart-header">
                        <div className="chart-info">
                            <h3>Queue Performance Benchmarking</h3>
                        </div>
                        <button className="time-filter-btn plain-btn">
                            <ArrowUpDown size={14} /> Sort by Performance
                        </button>
                    </div>

                    <div className="benchmark-table">
                        <div className="benchmark-header">
                            <div className="col-queue">QUEUE NAME</div>
                            <div className="col-metric">ITEMS PROCESSED</div>
                            <div className="col-metric">AVG WAIT TIME</div>
                            <div className="col-metric">AVG PROCESSING</div>
                            <div className="col-metric">FAILURE RATE</div>
                            <div className="col-metric">RETRY RATE</div>
                            <div className="col-perf">PERFORMANCE</div>
                        </div>

                        <div className="benchmark-body">
                            {data.queue_benchmark.map((row) => {
                                const IconComp = IconMap[row.icon] || ClipboardList;
                                return (
                                    <div key={row.id} className="benchmark-row">
                                        <div className="col-queue queue-name-cell">
                                            <div className="queue-icon" style={{ backgroundColor: row.icon_bg, color: row.icon_color }}>
                                                <IconComp size={16} />
                                            </div>
                                            <span>{row.name}</span>
                                        </div>
                                        <div className="col-metric">{row.items_processed}</div>
                                        <div className="col-metric">{row.avg_wait}</div>
                                        <div className="col-metric">{row.avg_processing}</div>
                                        <div className="col-metric failure-cell" style={{ color: row.failure_rate.is_good ? '#10B981' : (row.failure_rate.trend === 'neutral' ? '#FBBF24' : '#DC2626') }}>
                                            {row.failure_rate.value} {row.failure_rate.trend === 'up' && <ArrowUp size={12} />} {row.failure_rate.trend === 'down' && <ArrowDown size={12} />}
                                        </div>
                                        <div className="col-metric">{row.retry_rate}</div>
                                        <div className="col-perf perf-cell">
                                            <div className="perf-bar-bg">
                                                <div className="perf-bar-fill" style={{ width: `${row.performance.score}%`, backgroundColor: row.performance.color }}></div>
                                            </div>
                                            <span className="perf-score" style={{ color: row.performance.color }}>{row.performance.score}%</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardHome;
