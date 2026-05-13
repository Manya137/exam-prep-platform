import { useState, useEffect } from 'react'
import { BookOpen, Sparkles, Lightbulb, FileQuestion, Calculator, Network, FileText, ChevronRight, Loader2 } from 'lucide-react'
import { api } from '../api'

const AI_ACTIONS = [
  { icon: Sparkles, label: 'Explain Simply', color: 'accent' },
  { icon: Lightbulb, label: 'Give Example', color: 'emerald' },
  { icon: FileQuestion, label: 'Generate MCQs', color: 'warning' },
  { icon: Calculator, label: 'Show Formula', color: 'accent' },
  { icon: Network, label: 'Create Mind Map', color: 'emerald' },
  { icon: FileText, label: 'Summarize', color: 'text-secondary' },
]

const EXPLANATIONS: Record<string, Record<string, string>> = {
  'Binary Trees': {
    simple: 'A binary tree is a hierarchical data structure where each node has at most two children: left and right. Think of it like a family tree but with only two branches per person.',
    example: 'Example: File system structure. Root directory has folders, each folder can have subfolders. Each folder node has at most two children (though file systems can have more).',
    formula: 'Height of complete binary tree with n nodes: ⌊log₂n⌋ + 1\nArray representation: Left child = 2i, Right child = 2i+1, Parent = ⌊i/2⌋',
    summary: 'Binary trees are fundamental data structures used in databases (B-trees), compilers (AST), and file systems. Key operations: insert, delete, search all O(log n) in balanced trees.',
    mindmap: 'Root → Left Child → Left-Left → Left-Right → Right Child → Right-Right'
  },
  'Process Scheduling': {
    simple: 'Process scheduling decides which process runs on the CPU. Like a teacher managing which student gets to speak next in class.',
    example: 'Restaurant kitchen: Orders arrive (processes), chef (CPU) must decide which order to prepare first. FCFS = first come first served, SJF = shortest order first.',
    formula: 'Waiting Time = Turnaround Time - Burst Time\nThroughput = Processes Completed / Time Unit\nCPU Utilization = Busy Time / Total Time',
    summary: 'Process scheduling manages CPU allocation. Key algorithms: FCFS (simple but convoy), SJF (optimal waiting), Round Robin (fair time-sharing), Priority (may starve).',
    mindmap: 'Types: Long-term → Short-term → Medium-term\nAlgorithms: FCFS | SJF | Round Robin | Priority'
  },
  'SQL': {
    simple: 'SQL (Structured Query Language) is how we talk to databases. Think of it as asking questions in a structured way to get answers from organized data.',
    example: 'SELECT name FROM students WHERE marks > 80 ORDER BY name;\nThis asks: "Give me names of students with marks above 80, sorted alphabetically"',
    formula: 'SELECT columns FROM table WHERE conditions GROUP BY column HAVING aggregate condition ORDER BY column;',
    summary: 'SQL is essential for database operations. Key clauses: SELECT (what to show), FROM (where to look), WHERE (filter conditions), GROUP BY (aggregate), HAVING (filter groups).',
    mindmap: 'DDL: CREATE, ALTER, DROP | DML: INSERT, UPDATE, DELETE | DQL: SELECT | DCL: GRANT, REVOKE'
  },
  'TCP': {
    simple: 'TCP (Transmission Control Protocol) is how computers reliably send data over the internet. It ensures all packets arrive in order and intact.',
    example: 'Like sending a document by courier: you split it into pages, number them, and the courier must confirm each page arrived and resend any missing ones.',
    formula: 'Three-way handshake: SYN → SYN-ACK → ACK\nWindow size controls how much data can be sent before acknowledgment',
    summary: 'TCP provides reliable, ordered, error-checked delivery. Key features: flow control, congestion control, retransmission of lost packets.',
    mindmap: 'Connection: SYN → SYN-ACK → ACK\nStates: LISTEN | ESTABLISHED | CLOSE_WAIT | FIN_WAIT'
  }
}

export default function LearningWorkspace() {
  const [selectedTopic, setSelectedTopic] = useState('Binary Trees')
  const [selectedUnit, setSelectedUnit] = useState(1)
  const [syllabus, setSyllabus] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [content, setContent] = useState<{ title: string; text: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadSyllabus()
  }, [])

  const loadSyllabus = async () => {
    try {
      const data = await api.exams.getSyllabus(1, 1, 1)
      setSyllabus(data)
    } catch (err) {
      console.error('Failed to load syllabus:', err)
      setSyllabus({ units: [] })
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (action: string) => {
    setIsLoading(true)
    setContent(null)
    
    const explanation = EXPLANATIONS[selectedTopic] || EXPLANATIONS['Process Scheduling']
    
    setTimeout(() => {
      let text = ''
      switch (action) {
        case 'Explain Simply': text = explanation.simple; break
        case 'Give Example': text = explanation.example; break
        case 'Show Formula': text = explanation.formula; break
        case 'Summarize': text = explanation.summary; break
        case 'Create Mind Map': text = explanation.mindmap; break
        case 'Generate MCQs':
          handleGenerateMCQs()
          return
      }
      setContent({ title: action + ': ' + selectedTopic, text })
      setIsLoading(false)
    }, 500)
  }

  const handleGenerateMCQs = async () => {
    try {
      const mcqs = await api.questions.list({ examId: 1, subjectId: 1, limit: 5 })
      setContent({
        title: 'Practice Questions: ' + selectedTopic,
        text: mcqs.slice(0, 3).map((q: any, i: number) => 
          `${i + 1}. ${q.question}\n   A. ${q.options?.[0]}\n   B. ${q.options?.[1]}\n   C. ${q.options?.[2]}\n   D. ${q.options?.[3]}`
        ).join('\n\n')
      })
    } catch (err) {
      setContent({ title: 'Practice Questions', text: 'Questions will be loaded from the database when server is running.' })
    }
    setIsLoading(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full" />
      </div>
    )
  }

  const currentUnit = syllabus?.units?.[0] || { name: 'Data Structures & Algorithms', topics: ['Arrays', 'Linked Lists', 'Stacks', 'Queues', 'Trees', 'Graphs'] }

  return (
    <div className="h-[calc(100vh-7rem)] flex gap-6">
      <div className="w-72 bg-surface border border-border rounded-xl flex flex-col">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold text-text-primary">GATE CS Syllabus</h3>
          <p className="text-sm text-text-muted mt-1">Data Structures & Algorithms</p>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {syllabus?.units?.map((unit: any) => (
            <div key={unit.id}>
              <button onClick={() => setSelectedUnit(unit.id)} className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium mb-2 ${selectedUnit === unit.id ? 'bg-accent text-white' : 'text-text-primary hover:bg-surface-secondary'}`}>
                {unit.name}
              </button>
              {selectedUnit === unit.id && unit.topics && (
                <div className="space-y-1 ml-2">
                  {unit.topics.map((topic: any, i: number) => (
                    <button
                      key={topic.id || i}
                      onClick={() => setSelectedTopic(topic.name || topic)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedTopic === (topic.name || topic) ? 'bg-accent-light text-accent' : 'hover:bg-surface-secondary text-text-secondary'}`}
                    >
                      {topic.name || topic}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 bg-surface border border-border rounded-xl flex flex-col min-w-0">
        <div className="p-4 border-b border-border flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-accent" />
          <div>
            <h3 className="font-semibold text-text-primary">{selectedTopic}</h3>
            <div className="flex gap-2 mt-1">
              <span className="px-2 py-0.5 rounded text-xs bg-accent-light text-accent">GATE</span>
              <span className="px-2 py-0.5 rounded text-xs bg-surface-tertiary text-text-muted">{currentUnit.name}</span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 text-accent animate-spin" />
            </div>
          ) : content ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-text-primary">{content.title}</h3>
              <pre className="whitespace-pre-wrap text-text-secondary leading-relaxed font-sans">{content.text}</pre>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center max-w-md">
                <div className="w-16 h-16 rounded-2xl bg-surface-tertiary mx-auto mb-4 flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-text-muted" />
                </div>
                <h3 className="text-lg font-medium text-text-primary mb-2">Select a Topic</h3>
                <p className="text-sm text-text-muted">Choose a topic from the syllabus or use AI tools to get explanations.</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-border flex flex-wrap gap-2">
          {AI_ACTIONS.map((action) => (
            <button
              key={action.label}
              onClick={() => handleAction(action.label)}
              disabled={isLoading}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                action.color === 'accent' ? 'bg-accent text-white hover:bg-accent-hover' :
                action.color === 'emerald' ? 'bg-emerald text-white hover:bg-emerald/90' :
                action.color === 'warning' ? 'bg-warning text-white hover:bg-warning/90' :
                'bg-surface-secondary text-text-primary hover:bg-border'
              }`}
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <action.icon className="w-4 h-4" />}
              {action.label}
            </button>
          ))}
        </div>
      </div>

      <div className="w-80 bg-surface border border-border rounded-xl flex flex-col">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold text-text-primary">Quick Actions</h3>
        </div>
        <div className="flex-1 p-4 space-y-4">
          <div className="space-y-2">
            {['Generate 10 MCQs', 'Create Mind Map', 'Add to Notebook'].map((action) => (
              <button key={action} className="w-full text-left px-4 py-3 rounded-lg bg-surface-secondary hover:bg-border transition-colors text-sm flex items-center gap-3">
                <FileQuestion className="w-4 h-4 text-accent" />
                <span>{action}</span>
                <ChevronRight className="w-4 h-4 ml-auto text-text-muted" />
              </button>
            ))}
          </div>
          <div>
            <label className="text-sm font-medium text-text-primary mb-2 block">Selected Context</label>
            <div className="p-4 bg-accent-light rounded-lg border border-accent/20">
              <div className="text-sm text-accent font-medium">{selectedTopic}</div>
              <div className="text-xs text-text-muted mt-1">From: {currentUnit.name}</div>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-text-primary mb-2 block">Ask AI</label>
            <textarea placeholder="Type your question..." className="w-full px-4 py-3 rounded-lg border border-border bg-surface-secondary text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-accent/50" />
            <button className="w-full mt-2 px-4 py-2.5 bg-accent text-white rounded-lg hover:bg-accent-hover text-sm font-medium">Ask Question</button>
          </div>
        </div>
      </div>
    </div>
  )
}