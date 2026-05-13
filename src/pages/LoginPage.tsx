import { useState } from 'react'
import { Eye, EyeOff, BookOpen } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, register } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      if (isLogin) {
        await login(form.email, form.password)
      } else {
        await register(form.name, form.email, form.password)
      }
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-accent mx-auto flex items-center justify-center mb-4">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary">Welcome to ExamPrep AI</h1>
          <p className="text-text-secondary mt-2">{isLogin ? 'Sign in to continue learning' : 'Create your account'}</p>
        </div>

        <div className="bg-surface rounded-xl border border-border p-6 shadow-sm">
          {error && (
            <div className="mb-4 p-3 bg-danger-light text-danger rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Full Name</label>
                <input
                  type="text"
                  placeholder="Arjun Kumar"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required={!isLogin}
                  className="w-full px-4 py-2.5 border border-border rounded-lg bg-surface-secondary focus:outline-none focus:ring-2 focus:ring-accent/50 text-text-primary"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Email</label>
              <input
                type="email"
                placeholder="arjun@college.edu"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="w-full px-4 py-2.5 border border-border rounded-lg bg-surface-secondary focus:outline-none focus:ring-2 focus:ring-accent/50 text-text-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min 6 characters"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  minLength={6}
                  className="w-full px-4 py-2.5 border border-border rounded-lg bg-surface-secondary focus:outline-none focus:ring-2 focus:ring-accent/50 text-text-primary pr-10"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 bg-accent text-white font-medium rounded-lg hover:bg-accent-hover transition-colors disabled:opacity-50">
              {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-surface text-text-muted">or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {['Google', 'GitHub', 'Microsoft'].map((provider) => (
              <button key={provider} className="py-2.5 border border-border rounded-lg hover:bg-surface-secondary text-sm font-medium text-text-secondary">
                {provider}
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-sm text-text-secondary mt-6">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => { setIsLogin(!isLogin); setError('') }} className="text-accent hover:text-accent-hover font-medium">
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </p>

        <div className="mt-6 p-4 bg-surface-secondary rounded-lg text-center">
          <p className="text-sm text-text-muted">Demo credentials:</p>
          <p className="text-sm font-medium text-text-primary">student@examprep.com / password123</p>
        </div>
      </div>
    </div>
  )
}