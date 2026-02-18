import React, { useState, useEffect } from 'react'
import type { FormEvent } from 'react'
import axios from 'axios'
import {
  XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid
} from 'recharts'
import './App.css'

const API_BASE = 'http://localhost:8080/api'

interface Project {
  id: number;
  title: string;
  deadline: number;
  expectedRevenue: number;
  status: string;
  createdAt?: string;
  completedAt?: string;
}



interface ScheduleResponse {
  schedule: Record<number, Project>;
  totalRevenue: number;
}

interface DashboardStats {
  weeklyRevenue: number;
  monthlyRevenue: number;
  projectsCompletedThisMonth: number;
  projectsCompletedThisWeek: number;
}

interface AnalyticsData {
  date: string;
  revenue: number;
}

interface StrategyPrediction {
  strategyKey: string;
  strategyName: string;
  projectedRevenue: number;
}

interface PredictionResponse {
  predictions: StrategyPrediction[];
  bestStrategyKey: string;
}

const ALGORITHMS = [
  {
    key: 'greedy',
    name: 'Greedy',
    full: 'Greedy — Revenue · Deadline',
    complexity: 'O(n log n)',
    tagClass: 'recommended',
    tagLabel: 'Recommended',
    description: 'The most intelligent algorithm. Sorts projects by highest revenue and slots each one as late as possible before its deadline — reserving earlier slots for tighter deadlines. Maximizes total revenue without missing any feasible project.',
    best: 'When you want to maximize total revenue across all projects.',
  },
  {
    key: 'priority',
    name: 'Priority',
    full: 'Priority — Highest Revenue First',
    complexity: 'O(n log n)',
    tagClass: 'simple',
    tagLabel: 'Simple',
    description: 'A straightforward revenue-first approach. Projects are sorted by expected revenue in descending order and assigned to the earliest available day. Fast and predictable, but may miss high-value projects if their deadlines conflict.',
    best: 'When all projects have generous deadlines and you want the highest-value ones done first.',
  },
  {
    key: 'edf',
    name: 'EDF',
    full: 'Earliest Deadline First',
    complexity: 'O(n log n)',
    tagClass: 'urgent',
    tagLabel: 'Urgent',
    description: 'Prioritizes urgency over revenue. Projects are sorted by deadline ascending — the most time-critical tasks are always scheduled first. Minimizes the risk of missing deadlines but may sacrifice total revenue.',
    best: 'When client deadlines are strict and missing them has severe consequences.',
  },
  {
    key: 'fcfs',
    name: 'FCFS',
    full: 'First Come, First Served',
    complexity: 'O(n)',
    tagClass: 'fair',
    tagLabel: 'Fair',
    description: 'The classic queue model. Projects are scheduled in the order they were created (by ID). No prioritization — whoever submitted first gets scheduled first. Simple, transparent, and fair.',
    best: 'When fairness and submission order matter more than revenue optimization.',
  },
]

const AboutView = () => (
  <div className="about-view">
    <div className="about-hero">
      <div className="about-hero-tag">System Documentation</div>
      <h2 className="about-title">Optima<span>Scheduler</span></h2>
      <p className="about-subtitle">
        An intelligent project scheduling engine that uses classical computer science algorithms
        to maximize revenue while respecting client deadlines. Built on the{' '}
        <strong>Strategy Design Pattern</strong>, the active algorithm can be hot-swapped at
        runtime without restarting the system.
      </p>
    </div>

    <div className="about-section">
      <div className="about-section-label">How It Works</div>
      <div className="about-flow">
        {[
          { step: '01', title: 'Ingest', desc: 'Add a project with a title, deadline (in days), and expected revenue via the Enqueue Asset form.' },
          { step: '02', title: 'Select Algorithm', desc: 'Choose a scheduling algorithm. The engine will select the top 5 projects that maximize revenue under that strategy.' },
          { step: '03', title: 'Preview Schedule', desc: 'The engine instantly computes the optimal schedule for those 5 slots and projected yield.' },
          { step: '04', title: 'Execute', desc: 'Authorize the release — the top 5 projects are marked completed and revenue is committed.' },
          { step: '05', title: 'Analyze', desc: 'The Yield Analytics graph updates with your historical revenue trends over the last 30 days.' },
        ].map(({ step, title, desc }) => (
          <div key={step} className="about-flow-item">
            <div className="about-flow-step">{step}</div>
            <div className="about-flow-content">
              <div className="about-flow-title">{title}</div>
              <div className="about-flow-desc">{desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="about-section">
      <div className="about-section-label">Scheduling Algorithms</div>
      <div className="about-algo-grid">
        {ALGORITHMS.map(algo => (
          <div key={algo.key} className="about-algo-card">
            <div className="about-algo-header">
              <span className="about-algo-name">{algo.name}</span>
              <span className={`about-algo-tag ${algo.tagClass}`}>{algo.tagLabel}</span>
            </div>
            <div className="about-algo-body">
              <div className="about-algo-full">{algo.full}</div>
              <div className="about-algo-complexity">
                Time Complexity: <code>{algo.complexity}</code>
              </div>
              <p className="about-algo-desc">{algo.description}</p>
              <div className="about-algo-best">
                <span className="about-algo-best-label">Best For</span>
                {algo.best}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="about-section">
      <div className="about-section-label">Technology Stack</div>
      <div className="about-stack-grid">
        {[
          { layer: 'Backend', items: ['Java 17', 'Spring Boot 3.2', 'Spring Data JPA', 'PostgreSQL', 'Swagger / OpenAPI'] },
          { layer: 'Frontend', items: ['React 19', 'TypeScript', 'Vite', 'Recharts', 'Axios'] },
          { layer: 'Architecture', items: ['Strategy Pattern', 'REST API', 'DTO / Record Types', 'CORS Config', 'Auto Data Seeding'] },
        ].map(({ layer, items }) => (
          <div key={layer} className="about-stack-card">
            <div className="about-stack-layer">{layer}</div>
            <ul className="about-stack-list">
              {items.map(item => (
                <li key={item} className="about-stack-item">
                  <span className="about-stack-dot" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>

    <div className="about-section">
      <div className="about-section-label">Design Language</div>
      <div className="about-design-note">
        The interface follows <strong>Luxury Obsidian</strong> — a perfect fusion of <em>dense matt black</em> surfaces 
        and <em>sharp shiny reflections</em>. Featuring backdrop-blurs, 1:1 semantic theme transitions, 
        and a high-end satin texture, creating an aesthetic that is both solid and hyper-smooth.
      </div>
    </div>
  </div>
)

const ProjectDetailModal: React.FC<{ 
  project: Project, 
  totalPendingRevenue: number, 
  onClose: () => void 
}> = ({ project, totalPendingRevenue, onClose }) => {
  const contribution = ((project.expectedRevenue / totalPendingRevenue) * 100).toFixed(1)
  const arrivalDate = project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'N/A'
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="modal-tag">Project Blueprint</div>
            <h3 className="modal-title">{project.title}</h3>
          </div>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        
        <div className="modal-body">
          <div className="modal-grid">
            <div className="modal-stat">
              <label>Revenue Impact</label>
              <div className="modal-value">${project.expectedRevenue.toLocaleString()}</div>
              <div className="modal-subtext">Contribution: {contribution}% of queue</div>
            </div>
            <div className="modal-stat">
              <label>Time Criticality</label>
              <div className="modal-value">{project.deadline} Days</div>
              <div className="modal-subtext">Expires by: {new Date(Date.now() + project.deadline * 86400000).toLocaleDateString()}</div>
            </div>
          </div>

          <div className="modal-details">
            <div className="modal-detail-row">
              <span>Status</span>
              <span className="status-pending" style={{ textTransform: 'uppercase', fontSize: '10px', fontWeight: 600 }}>{project.status}</span>
            </div>
            <div className="modal-detail-row">
              <span>Arrival Timestamp</span>
              <span>{arrivalDate}</span>
            </div>
            <div className="modal-detail-row">
              <span>Asset Engine ID</span>
              <span style={{ fontFamily: 'monospace' }}>#{project.id.toString().padStart(4, '0')}</span>
            </div>
          </div>

          <p className="modal-description">
            This asset is currently in the <strong>{project.status.toLowerCase()} queue</strong>. 
            The scheduling engine will prioritize it based on the active protocol. 
            Missing the {project.deadline}-day window will result in a total loss of the projected yield.
          </p>
        </div>
        
        <div className="modal-footer">
          <button className="btn-prime" onClick={onClose}>Close Overview</button>
        </div>
      </div>
    </div>
  )
}

const PredictiveAnalytics: React.FC<{ predictions: PredictionResponse | null }> = ({ predictions }) => {
  if (!predictions || predictions.predictions.length === 0) return null;

  return (
    <div className="prediction-panel">
      <div className="section-header">
        <h2>Intelligence: Yield Simulation</h2>
      </div>
      <div className="prediction-grid">
        {predictions.predictions
          .sort((a, b) => b.projectedRevenue - a.projectedRevenue)
          .map(pred => (
          <div key={pred.strategyKey} className={`prediction-card ${predictions.bestStrategyKey === pred.strategyKey ? 'best' : ''}`}>
             <div className="prediction-label">{pred.strategyName.split('(')[0]}</div>
             <div className="prediction-value">${pred.projectedRevenue.toLocaleString()}</div>
             {predictions.bestStrategyKey === pred.strategyKey && (
               <div className="prediction-badge">Optimized Target</div>
             )}
          </div>
        ))}
      </div>
    </div>
  )
}

const App: React.FC = () => {
  // ... existing states ...
  // (Assuming I'm inserting this above App, I need to make sure I don't duplicate App)
  const [view, setView] = useState<'dashboard' | 'history' | 'about'>('about')
  const [theme] = useState<'dark'>('dark')
  const [projects, setProjects] = useState<Project[]>([])
  const [allProjects, setAllProjects] = useState<Project[]>([])
  const [schedule, setSchedule] = useState<ScheduleResponse>({ schedule: {}, totalRevenue: 0 })
  const [strategy, setStrategy] = useState<string>('')
  const [stats, setStats] = useState<DashboardStats>({
    weeklyRevenue: 0,
    monthlyRevenue: 0,
    projectsCompletedThisMonth: 0,
    projectsCompletedThisWeek: 0,
  })
  const [analytics, setAnalytics] = useState<AnalyticsData[]>([])
  const [newProject, setNewProject] = useState({ title: '', deadline: '', expectedRevenue: '' })
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [predictions, setPredictions] = useState<PredictionResponse | null>(null)

  const fetchData = async () => {
    try {
      const [pRes, sRes, stRes, dsRes, anRes, predRes] = await Promise.all([
        axios.get<Project[]>(`${API_BASE}/projects`),
        axios.get<ScheduleResponse>(`${API_BASE}/schedule/current`),
        axios.get<{ currentStrategy: string }>(`${API_BASE}/schedule/strategy`),
        axios.get<DashboardStats>(`${API_BASE}/schedule/stats`),
        axios.get<AnalyticsData[]>(`${API_BASE}/schedule/analytics`),
        axios.get<PredictionResponse>(`${API_BASE}/schedule/predictions`),
      ])
      setAllProjects(pRes.data)
      setProjects(pRes.data.filter(p => p.status === 'PENDING'))
      setSchedule(sRes.data)
      setStrategy(stRes.data.currentStrategy)
      setStats(dsRes.data)
      setAnalytics(anRes.data)
      setPredictions(predRes.data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => { fetchData() }, [])

  // Theme Config
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark')
  }, [])

  const handleCreateProject = async (e: FormEvent) => {
    e.preventDefault()
    await axios.post(`${API_BASE}/projects`, newProject)
    setNewProject({ title: '', deadline: '', expectedRevenue: '' })
    fetchData()
  }

  const handleSelectStrategy = async (type: string) => {
    await axios.post(`${API_BASE}/schedule/strategy?type=${type}`)
    fetchData()
  }

  const handleExecute = async () => {
    await axios.post(`${API_BASE}/schedule/execute`)
    fetchData()
  }

  const handleDeleteProject = async (id: number) => {
    if (window.confirm('Discard this project from the queue?')) {
      await axios.delete(`${API_BASE}/projects/${id}`)
      fetchData()
    }
  }

  const focusForm = () => {
    const input = document.getElementById('project-title-input')
    if (input) {
      input.focus()
      input.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const viewLabel: Record<string, string> = {
    dashboard: 'Operations',
    history:   'Archive',
    about:     'About',
  }

  // Chart Colors (Fixed Dark Theme - Neutral Grey / Obsidian)
  const chartStroke = '#a3a3a3'
  const chartGrid = 'rgba(255, 255, 255, 0.05)'
  const chartText = '#525252'

  return (
    <div className="layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-eyebrow">Scheduling Engine</div>
          <div className="logo-name">Optima<span>V1</span></div>
          <div className="logo-sub">v1.0 · Strategy Pattern</div>
        </div>

        <nav>
          {[
            { key: 'about',     icon: '○', label: 'About' },
            { key: 'dashboard', icon: '◈', label: 'Dashboard' },
            { key: 'history',   icon: '≡', label: 'Archive' },
          ].map(({ key, icon, label }) => (
            <div
              key={key}
              className={`nav-item ${view === key ? 'active' : ''}`}
              onClick={() => setView(key as typeof view)}
            >
              <span className="nav-icon">{icon}</span>
              {label}
            </div>
          ))}
        </nav>

        <div className="sidebar-stats">
          <div className="sidebar-stats-title">Live Metrics</div>
          {[
            { label: 'Weekly Yield',    value: `$${stats.weeklyRevenue.toLocaleString()}` },
            { label: 'Monthly Yield',   value: `$${stats.monthlyRevenue.toLocaleString()}` },
            { label: 'Done This Week',  value: String(stats.projectsCompletedThisWeek) },
            { label: 'Done This Month', value: String(stats.projectsCompletedThisMonth) },
          ].map(({ label, value }) => (
            <div key={label} className="sidebar-stat">
              <div className="sidebar-stat-label">{label}</div>
              <div className="sidebar-stat-value">{value}</div>
            </div>
          ))}
        </div>
      </aside>

      {/* MAIN */}
      <main className="main-content">
        <div className="top-bar">
          <h1>
            Optima
            <span>{viewLabel[view]}</span>
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div className="status-badge">
              <span className="status-dot" />
              System Online
            </div>
          </div>
        </div>

        {view === 'about' && <AboutView />}

        {view === 'dashboard' && (
          <div className="dashboard-grid">
            {/* TOP WIDE PANEL: PREDICTIONS */}
            <PredictiveAnalytics predictions={predictions} />

            {/* COL 1: CONTROLS */}
            <div className="panel">
              <div className="section-header">
                <h2>Algorithm Protocol</h2>
              </div>
              <div className="algo-list">
                {ALGORITHMS.map(algo => (
                  <button
                    key={algo.key}
                    className={`algo-btn ${strategy.toLowerCase().includes(algo.key) ? 'active' : ''}`}
                    onClick={() => handleSelectStrategy(algo.key)}
                  >
                    {algo.name}
                    <span className="algo-btn-indicator" />
                  </button>
                ))}
              </div>

              <div className="section-header" style={{ borderTop: '1px solid var(--ice-3)' }}>
                <h2>Enqueue Asset</h2>
              </div>
              <form onSubmit={handleCreateProject} className="form-group">
                <input
                  id="project-title-input"
                  placeholder="Project title"
                  value={newProject.title}
                  onChange={e => setNewProject({ ...newProject, title: e.target.value })}
                  required
                />
                <input
                  type="number"
                  placeholder="Deadline (days)"
                  value={newProject.deadline}
                  onChange={e => setNewProject({ ...newProject, deadline: e.target.value })}
                  required
                />
                <input
                  type="number"
                  placeholder="Expected revenue ($)"
                  value={newProject.expectedRevenue}
                  onChange={e => setNewProject({ ...newProject, expectedRevenue: e.target.value })}
                  required
                />
                <button type="submit" className="btn-prime">Submit Project</button>
              </form>
            </div>

            {/* COL 2: GRAPH + QUEUE */}
            <div className="panel">
              <div className="graph-container">
                <div className="section-header">
                  <h2>Yield Analytics — 30 Days</h2>
                </div>
                <div className="chart-wrapper">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analytics}>
                      <defs>
                        <linearGradient id="iceGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor={chartStroke} stopOpacity={0.2} />
                          <stop offset="95%" stopColor={chartStroke} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={chartGrid} vertical={false} />
                      <XAxis dataKey="date" stroke={chartText} fontSize={10} axisLine={false} tickLine={false} />
                      <YAxis stroke={chartText} fontSize={10} axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          background: 'var(--frost-bg)',
                          backdropFilter: 'blur(12px)',
                          border: '1px solid var(--ice-3)',
                          borderRadius: 4,
                          fontFamily: 'Inter, sans-serif',
                          fontSize: 12,
                          color: 'var(--text-primary)',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke={chartStroke}
                        fill="url(#iceGrad)"
                        strokeWidth={1.5}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="section-header">
                <h2>Pending Queue</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="section-header-count">{projects.length} </span>
                  <button 
                    className="action-btn-plus" 
                    onClick={focusForm}
                    title="Add Project"
                  >+</button>
                </div>
              </div>
              <div className="stream-list">
                {projects.length === 0 && (
                  <div className="no-data">No pending projects in queue.</div>
                )}
                {projects.map(p => (
                  <div key={p.id} className="queue-item-wrapper">
                    <div className="queue-item" onClick={() => setSelectedProject(p)} style={{ cursor: 'pointer' }}>
                      <span className="queue-item-title">{p.title}</span>
                      <span className="queue-item-revenue">${p.expectedRevenue.toLocaleString()}</span>
                    </div>
                    <button 
                      className="queue-action-minus" 
                      onClick={() => handleDeleteProject(p.id)}
                      title="Remove Project"
                    >−</button>
                  </div>
                ))}
              </div>
            </div>

            {/* COL 3: SCHEDULE */}
            <div className="panel">
              <div className="stream-panel">
                <div className="section-header">
                  <h2>Execution Stream (Batch Limit: 5)</h2>
                </div>
                <div className="batch-summary">
                  <div className="batch-summary-label">Projected Yield</div>
                  <div className="batch-summary-value">${schedule.totalRevenue.toLocaleString()}</div>
                </div>
                 {/* Total Loss Display for current batch */}
                 {(() => {
                    const scheduledIds = Object.values(schedule.schedule).map((p: any) => p.id);
                    const pending = projects.filter(p => !scheduledIds.includes(p.id));
                    const totalLoss = pending.reduce((sum, p) => sum + p.expectedRevenue, 0);
                    
                    if (totalLoss > 0) {
                        return (
                            <div className="batch-summary" style={{ borderTop: '1px solid var(--ice-3)', background: 'rgba(255, 100, 100, 0.05)' }}>
                                <div className="batch-summary-label" style={{ color: '#e65b5b' }}>Proj. Loss (Missed)</div>
                                <div className="batch-summary-value" style={{ color: '#e65b5b' }}>${totalLoss.toLocaleString()}</div>
                            </div>
                        )
                    }
                    return null;
                })()}

                <div className="stream-list">
                  {Object.keys(schedule.schedule).length === 0 && (
                    <div className="no-data">
                      No batch optimized.<br />
                      Select a protocol to select top 5.
                    </div>
                  )}
                  {Object.entries(schedule.schedule)
                    .sort(([a], [b]) => Number(a) - Number(b))
                    .map(([day, p], index) => (
                      <div key={day} className="stream-item">
                        <div>
                          <div className="stream-item-day">Task Selection #{index + 1}</div>
                          <div className="stream-item-title">{p.title}</div>
                        </div>
                        <div className="stream-item-revenue">${p.expectedRevenue.toLocaleString()}</div>
                      </div>
                    ))}
                </div>

                {Object.keys(schedule.schedule).length > 0 && (
                  <button className="btn-execute" onClick={handleExecute}>
                    Authorize &amp; Execute
                  </button>
                )}
              </div>
            </div>

          </div>
        )}

        {view === 'history' && (
          <div className="table-scroll">
            <table className="nothing-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Project Title</th>
                  <th>Arrived</th>
                  <th>Completed</th>
                  <th>Revenue</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {allProjects.filter(p => p.status === 'COMPLETED' || p.status === 'NOT_COMPLETED').length === 0 && (
                  <tr>
                    <td colSpan={6} className="no-data">No history available yet.</td>
                  </tr>
                )}
                {allProjects.filter(p => p.status === 'COMPLETED' || p.status === 'NOT_COMPLETED').map((p, i) => (
                  <tr key={p.id}>
                    <td style={{ color: 'var(--text-faint)', fontVariantNumeric: 'tabular-nums' }}>{i + 1}</td>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.title}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>
                        {/* Safe date parsing */}
                        {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '—'}
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>
                      {p.completedAt ? new Date(p.completedAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="revenue-cell">${p.expectedRevenue.toLocaleString()}</td>
                    <td>
                        {p.status === 'COMPLETED' ? (
                            <span className="status-verified">Verified</span>
                        ) : (
                            <span className="status-missed">Missed</span>
                        )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {selectedProject && (
        <ProjectDetailModal 
          project={selectedProject} 
          totalPendingRevenue={projects.reduce((sum, p) => sum + p.expectedRevenue, 0)}
          onClose={() => setSelectedProject(null)} 
        />
      )}
    </div>
  )
}

export default App
