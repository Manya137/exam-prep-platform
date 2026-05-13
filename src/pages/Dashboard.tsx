import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Target, Clock, ChevronRight, Play, AlertTriangle, BookOpen, TrendingUp } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { api } from '../api'

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const [progressData, questionStats] = await Promise.all([
        api.progress.get(),
        api.questions.getStats().catch(() => ({ total: 0, correct: 0, accuracy: 0 }))
      ])
      
      setStats({
        syllabusProgress: progressData?.summary?.averageProgress || 0,
        topicsCompleted: progressData?.summary?.completedTopics || 0,
        topicsRemaining: (progressData?.summary?.totalTopics || 0) - (progressData?.summary?.completedTopics || 0),
        backlogItems: 7,
        hoursStudied: Math.round((progressData?.summary?.totalTimeSpent || 0) / 60),
        accuracy: questionStats?.accuracy || 0,
        questionsAttempted: questionStats?.total || 0,
        streak: 12,
        todayHours: 4.5,
        weekHours: 28,
        readiness: 78
      })
    } catch (err) {
      console.error('Failed to load dashboard:', err)
    } finally {
      setLoading(false)
    }
  }

  const recentTopics = [
    { title: 'Operating Systems - Process Scheduling', progress: 75, lastStudied: '2 hours ago' },
    { title: 'Database Management - Query Optimization', progress: 45, lastStudied: 'Yesterday' },
    { title: 'Computer Networks - TCP/IP Model', progress: 90, lastStudied: '3 days ago' },
  ]

  const todaysTargets = [
    { label: 'Complete Memory Management', hours: 2, status: 'pending' },
    { label: 'Practice 20 MCQs', hours: 1, status: 'pending' },
    { label: 'Create Mind Map', hours: 0.5, status: 'pending' },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Welcome back, {user?.name || 'Student'}!</h1>
          <p className="text-text-secondary mt-1">Continue your GATE preparation</p>
        </div>
        <Link to="/workspace" className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover">
          <Play className="w-4 h-4" />
          Continue Study
        </Link>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-surface border border-border rounded-xl p-6">
            <div className="flex flex-wrap gap-3 mb-6">
              <span className="px-3 py-1.5 rounded-full bg-accent text-white text-sm font-medium">GATE 2026</span>
              <span className="px-3 py-1.5 rounded-full bg-surface-tertiary text-text-secondary text-sm">Computer Science</span>
              <span className="px-3 py-1.5 rounded-full bg-emerald-light text-emerald text-sm font-medium">{stats?.readiness || 0}% Ready</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-surface-secondary rounded-lg">
                <div className="text-2xl font-bold text-text-primary">{stats?.topicsCompleted || 0}</div>
                <div className="text-sm text-text-muted">Topics Completed</div>
              </div>
              <div className="p-4 bg-surface-secondary rounded-lg">
                <div className="text-2xl font-bold text-accent">{stats?.questionsAttempted || 0}</div>
                <div className="text-sm text-text-muted">Questions Attempted</div>
              </div>
              <div className="p-4 bg-surface-secondary rounded-lg">
                <div className="text-2xl font-bold text-emerald">{stats?.accuracy || 0}%</div>
                <div className="text-sm text-text-muted">Accuracy</div>
              </div>
              <div className="p-4 bg-surface-secondary rounded-lg">
                <div className="text-2xl font-bold text-warning">{stats?.hoursStudied || 0}</div>
                <div className="text-sm text-text-muted">Hours Studied</div>
              </div>
            </div>
          </div>

          <div className="bg-surface border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4">Progress Overview</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-text-secondary">Syllabus Completion</span>
                  <span className="font-medium text-text-primary">{stats?.syllabusProgress || 0}%</span>
                </div>
                <div className="h-2 bg-surface-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${stats?.syllabusProgress || 0}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-text-secondary">Questions Mastered</span>
                  <span className="font-medium text-text-primary">{stats?.accuracy || 0}%</span>
                </div>
                <div className="h-2 bg-surface-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-emerald rounded-full transition-all" style={{ width: `${stats?.accuracy || 0}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-text-primary">Recent Topics</h2>
              <Link to="/workspace" className="text-sm text-accent hover:text-accent-hover flex items-center gap-1">
                View all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {recentTopics.map((topic, i) => (
                <div key={i} className="flex items-center gap-4 p-3 bg-surface-secondary rounded-lg">
                  <BookOpen className="w-5 h-5 text-accent" />
                  <div className="flex-1">
                    <div className="font-medium text-text-primary">{topic.title}</div>
                    <div className="text-sm text-text-muted">{topic.lastStudied}</div>
                  </div>
                  <div className="w-32">
                    <div className="h-2 bg-border rounded-full overflow-hidden">
                      <div className="h-full bg-accent rounded-full" style={{ width: `${topic.progress}%` }} />
                    </div>
                  </div>
                  <span className="text-sm font-medium text-text-secondary">{topic.progress}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-surface border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-5 h-5 text-accent" />
              <h3 className="font-semibold text-text-primary">Today's Target</h3>
            </div>
            <div className="space-y-3">
              {todaysTargets.map((t, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-surface-secondary rounded-lg">
                  <div className="w-8 h-8 rounded-lg bg-border text-text-secondary flex items-center justify-center text-sm font-bold">{i + 1}</div>
                  <div className="flex-1">
                    <div className="font-medium text-text-primary">{t.label}</div>
                    <div className="text-sm text-text-muted">{t.hours} hours</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-5 h-5 text-warning" />
              <h3 className="font-semibold text-text-primary">Study Stats</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between"><span className="text-sm text-text-secondary">Today</span><span className="font-medium">{stats?.todayHours || 0} hours</span></div>
              <div className="flex justify-between"><span className="text-sm text-text-secondary">This Week</span><span className="font-medium">{stats?.weekHours || 0} hours</span></div>
              <div className="flex justify-between"><span className="text-sm text-text-secondary">Total Study Time</span><span className="font-medium">{stats?.hoursStudied || 0} hours</span></div>
              <div className="flex justify-between"><span className="text-sm text-text-secondary">Streak</span><span className="font-medium text-accent">{stats?.streak || 0} days</span></div>
            </div>
          </div>

          <div className="bg-warning-light border border-warning/20 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-warning mt-0.5" />
              <div>
                <div className="font-medium text-text-primary">Backlog Alert</div>
                <p className="text-sm text-text-secondary mt-1">You have topics pending review. Use Study Planner to catch up.</p>
                <Link to="/planner" className="inline-block mt-3 text-sm text-warning font-medium hover:underline">Open Study Planner</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}