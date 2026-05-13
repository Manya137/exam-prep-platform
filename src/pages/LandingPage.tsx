import { Link } from 'react-router-dom'
import { BookOpen, Brain, Calendar, Sparkles, FileUp, Play } from 'lucide-react'

const features = [
  { icon: BookOpen, title: 'Explain', desc: 'Get clear explanations with examples tailored to your syllabus.' },
  { icon: Brain, title: 'Practice', desc: 'Generate GATE/CAT MCQs and previous year questions with instant feedback.' },
  { icon: Calendar, title: 'Plan', desc: 'Calculate study hours, track backlog, and optimize your timeline.' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface">
      <header className="h-16 border-b border-border flex items-center justify-between px-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-text-primary">ExamPrep AI</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary">
            Sign In
          </Link>
          <Link to="/dashboard" className="px-4 py-2 text-sm font-medium bg-accent text-white rounded-lg hover:bg-accent-hover">
            Start Learning
          </Link>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-8 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-light text-accent text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            AI-Powered Syllabus Learning
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-text-primary leading-tight mb-6">
            Study smarter with<br />
            <span className="text-accent">syllabus-aware AI tutoring</span>
          </h1>
          <p className="text-lg text-text-secondary mb-10 max-w-2xl mx-auto">
            Get easy explanations, generate practice questions, plan your study schedule, and track your readiness for GATE, CAT, and other competitive exams.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/dashboard" className="px-6 py-3 bg-accent text-white font-medium rounded-lg hover:bg-accent-hover flex items-center gap-2 shadow-lg shadow-accent/20">
              Start Learning
            </Link>
            <button className="px-6 py-3 border border-border text-text-primary font-medium rounded-lg hover:bg-surface-secondary flex items-center gap-2">
              <FileUp className="w-4 h-4" />
              Import Syllabus
            </button>
            <button className="px-6 py-3 border border-border text-text-primary font-medium rounded-lg hover:bg-surface-secondary flex items-center gap-2">
              <Play className="w-4 h-4" />
              See Demo
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-20">
          {features.map((f) => (
            <div key={f.title} className="p-6 bg-surface-secondary border border-border rounded-xl hover:border-accent/30 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-accent-light flex items-center justify-center mb-4 group-hover:bg-accent transition-colors">
                <f.icon className="w-6 h-6 text-accent group-hover:text-white" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">{f.title}</h3>
              <p className="text-text-secondary">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 p-8 bg-surface-secondary rounded-2xl border border-border">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-accent">500+</div>
              <div className="text-sm text-text-muted mt-1">Topics Covered</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald">10K+</div>
              <div className="text-sm text-text-muted mt-1">Practice Questions</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-warning">95%</div>
              <div className="text-sm text-text-muted mt-1">Success Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-text-primary">24/7</div>
              <div className="text-sm text-text-muted mt-1">AI Availability</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}