import { useState } from 'react'
import { Calculator, Calendar, Clock, Target, AlertTriangle, TrendingUp, CheckCircle2 } from 'lucide-react'
import { api } from '../api'

export default function StudyPlanner() {
  const [inputs, setInputs] = useState({
    semester: '5',
    examDate: '2026-05-20',
    hoursPerDay: '4',
    subjectsLeft: '5',
    backlogTopics: '12'
  })
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const calculatePlan = async () => {
    setLoading(true)
    try {
      const data = await api.planner.calculate({
        examDate: inputs.examDate,
        hoursPerDay: parseInt(inputs.hoursPerDay),
        subjectsLeft: parseInt(inputs.subjectsLeft),
        backlogTopics: parseInt(inputs.backlogTopics)
      })
      setResult(data)
    } catch (err) {
      console.error('Failed to calculate plan:', err)
    } finally {
      setLoading(false)
    }
  }

  const progressItems = [
    { label: 'Complete Data Structures', days: 5, status: 'in-progress' },
    { label: 'Finish Algorithm Analysis', days: 4, status: 'completed' },
    { label: 'Practice 50 MCQs weekly', days: 3, status: 'pending' },
  ]

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">Study Planner & Reality Check</h1>
        <p className="text-text-secondary mt-1">Plan your preparation based on your exam date and available time</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-surface border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-6 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-accent" />
            Enter Your Details
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Exam Date</label>
              <input type="date" value={inputs.examDate} onChange={(e) => setInputs({ ...inputs, examDate: e.target.value })} className="w-full px-4 py-2.5 border border-border rounded-lg bg-surface-secondary text-text-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Available Hours/Day</label>
              <input type="number" min="1" max="12" value={inputs.hoursPerDay} onChange={(e) => setInputs({ ...inputs, hoursPerDay: e.target.value })} className="w-full px-4 py-2.5 border border-border rounded-lg bg-surface-secondary text-text-primary" />
              <p className="text-xs text-text-muted mt-1">Recommended: 4-6 hours for GATE</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Subjects Remaining</label>
              <input type="number" min="1" max="10" value={inputs.subjectsLeft} onChange={(e) => setInputs({ ...inputs, subjectsLeft: e.target.value })} className="w-full px-4 py-2.5 border border-border rounded-lg bg-surface-secondary text-text-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Backlog Topics</label>
              <input type="number" min="0" max="50" value={inputs.backlogTopics} onChange={(e) => setInputs({ ...inputs, backlogTopics: e.target.value })} className="w-full px-4 py-2.5 border border-border rounded-lg bg-surface-secondary text-text-primary" />
            </div>
            <button onClick={calculatePlan} disabled={loading} className="w-full py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent-hover mt-4 disabled:opacity-50">
              {loading ? 'Calculating...' : 'Calculate My Plan'}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {result ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface border border-border rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center"><Clock className="w-5 h-5 text-accent" /></div>
                    <span className="text-sm text-text-muted">Daily Hours</span>
                  </div>
                  <div className="text-3xl font-bold text-text-primary">{result.dailyHours}</div>
                  <div className="text-sm text-text-muted mt-1">hours/day</div>
                </div>
                <div className="bg-surface border border-border rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-light flex items-center justify-center"><Calendar className="w-5 h-5 text-emerald" /></div>
                    <span className="text-sm text-text-muted">Monthly Quota</span>
                  </div>
                  <div className="text-3xl font-bold text-text-primary">{result.monthlyQuota}</div>
                  <div className="text-sm text-text-muted mt-1">hours/month</div>
                </div>
                <div className="bg-surface border border-border rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-warning-light flex items-center justify-center"><TrendingUp className="w-5 h-5 text-warning" /></div>
                    <span className="text-sm text-text-muted">Weeks Left</span>
                  </div>
                  <div className="text-3xl font-bold text-text-primary">{result.weeksNeeded}</div>
                  <div className="text-sm text-text-muted mt-1">weeks</div>
                </div>
                <div className="bg-surface border border-border rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-danger-light flex items-center justify-center"><AlertTriangle className="w-5 h-5 text-danger" /></div>
                    <span className="text-sm text-text-muted">Backlog</span>
                  </div>
                  <div className="text-3xl font-bold text-text-primary">{result.backlogSize}</div>
                  <div className="text-sm text-text-muted mt-1">topics</div>
                </div>
              </div>

              <div className={`p-6 rounded-xl border-2 ${result.readinessScore >= 80 ? 'bg-emerald-light border-emerald' : result.readinessScore >= 60 ? 'bg-warning-light border-warning' : 'bg-danger-light border-danger'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-text-secondary mb-1">Readiness Score</div>
                    <div className="text-4xl font-bold">{result.readinessScore}%</div>
                    <p className="text-sm mt-2">
                      {result.readinessScore >= 80 ? 'Great progress! Stay consistent.' :
                       result.readinessScore >= 60 ? 'Good progress, focus on backlog.' :
                       'Increase study hours or reduce backlog.'}
                    </p>
                  </div>
                  <div className="w-24 h-24 relative">
                    <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                      <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" strokeWidth="3" className="opacity-20" />
                      <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray={`${result.readinessScore} 100`} className={result.readinessScore >= 80 ? 'text-emerald' : result.readinessScore >= 60 ? 'text-warning' : 'text-danger'} />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">{result.readinessScore}%</span>
                  </div>
                </div>
              </div>

              {result.dailyBreakdown && (
                <div className="bg-surface border border-border rounded-xl p-6">
                  <h3 className="font-semibold text-text-primary mb-4">Daily Breakdown</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-text-secondary">Theory Study</span>
                      <span className="font-medium">{result.dailyBreakdown.theory} hrs</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-text-secondary">Practice/MCQs</span>
                      <span className="font-medium">{result.dailyBreakdown.practice} hrs</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-text-secondary">Revision</span>
                      <span className="font-medium">{result.dailyBreakdown.revision} hrs</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="bg-surface border border-border rounded-xl p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-surface-tertiary mx-auto mb-4 flex items-center justify-center">
                <Target className="w-8 h-8 text-text-muted" />
              </div>
              <h3 className="text-lg font-medium text-text-primary mb-2">Enter Your Details</h3>
              <p className="text-sm text-text-muted max-w-sm mx-auto">Fill in your study information to get a personalized plan.</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 bg-surface border border-border rounded-xl p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-6">Progress Timeline</h2>
        <div className="space-y-4">
          {progressItems.map((item, i) => (
            <div key={i} className="flex items-center gap-4 p-4 bg-surface-secondary rounded-lg">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.status === 'completed' ? 'bg-emerald text-white' : item.status === 'in-progress' ? 'bg-accent text-white' : 'bg-border text-text-muted'}`}>
                {item.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : <span>{i + 1}</span>}
              </div>
              <div className="flex-1">
                <div className="font-medium text-text-primary">{item.label}</div>
                <div className="text-sm text-text-muted">{item.days} days</div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${item.status === 'completed' ? 'bg-emerald-light text-emerald' : item.status === 'in-progress' ? 'bg-accent-light text-accent' : 'bg-surface-tertiary text-text-muted'}`}>
                {item.status === 'completed' ? 'Completed' : item.status === 'in-progress' ? 'In Progress' : 'Pending'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}