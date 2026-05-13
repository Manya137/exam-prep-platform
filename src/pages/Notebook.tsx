import { useState, useEffect } from 'react'
import { FileText, Network, Layers, Star, Calculator, Plus, Edit2, Bookmark, Trash2 } from 'lucide-react'
import { api } from '../api'

const TABS = [
  { id: 'summary', label: 'Summary', icon: FileText },
  { id: 'mindmap', label: 'Mind Map', icon: Network },
  { id: 'flashcards', label: 'Flashcards', icon: Layers },
  { id: 'questions', label: 'Important Qs', icon: Star },
  { id: 'formulas', label: 'Formula Sheet', icon: Calculator },
]

const FLASHARDS = [
  { id: 1, front: 'What are the 4 conditions for deadlock?', back: '1. Mutual Exclusion\n2. Hold and Wait\n3. No Preemption\n4. Circular Wait', topic: 'OS - Deadlock' },
  { id: 2, front: 'What is thrashing?', back: 'Excessive paging where system spends more time swapping pages than executing processes.', topic: 'OS - Memory' },
  { id: 3, front: 'Difference between paging and segmentation?', back: 'Paging: Fixed-size blocks, no external fragmentation.\nSegmentation: Variable-size logical divisions, may have external fragmentation.', topic: 'OS - Memory' },
]

export default function Notebook() {
  const [activeTab, setActiveTab] = useState('summary')
  const [notes, setNotes] = useState<any[]>([])
  const [flashcardIndex, setFlashcardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadNotes()
  }, [])

  const loadNotes = async () => {
    try {
      const data = await api.notebook.list()
      setNotes(data || [])
    } catch (err) {
      console.error('Failed to load notes:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveNote = async () => {
    try {
      const newNote = {
        type: activeTab,
        title: `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Note`,
        content: 'New note content...'
      }
      await api.notebook.create(newNote)
      loadNotes()
    } catch (err) {
      console.error('Failed to save note:', err)
    }
  }

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Revision Notebook</h1>
          <p className="text-text-secondary mt-1">Save and review your study materials</p>
        </div>
        <button onClick={handleSaveNote} className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover">
          <Plus className="w-4 h-4" />
          Add Note
        </button>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        <div className="w-80 bg-surface border border-border rounded-xl flex flex-col">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold text-text-primary">Saved Notes</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {notes.length > 0 ? notes.map((note) => (
              <div key={note.id} className="p-3 bg-surface-secondary rounded-lg hover:bg-border cursor-pointer group">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-text-primary truncate">{note.title}</div>
                    <div className="text-xs text-text-muted mt-1">{note.content?.substring(0, 50)}...</div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
                    <button className="p-1 hover:bg-border rounded"><Edit2 className="w-4 h-4 text-text-muted" /></button>
                    <button className="p-1 hover:bg-border rounded"><Bookmark className="w-4 h-4 text-text-muted" /></button>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2 py-0.5 rounded text-xs bg-surface-tertiary text-text-muted">{note.type}</span>
                </div>
              </div>
            )) : (
              <p className="text-sm text-text-muted text-center py-8">No notes yet. Click "Add Note" to create one.</p>
            )}
          </div>
        </div>

        <div className="flex-1 bg-surface border border-border rounded-xl flex flex-col min-w-0">
          <div className="flex border-b border-border overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap ${
                  activeTab === tab.id ? 'border-accent text-accent' : 'border-transparent text-text-muted hover:text-text-primary'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'summary' && (
              <div className="space-y-4">
                <div className="p-4 bg-surface-secondary rounded-xl border border-border">
                  <h3 className="font-semibold text-text-primary mb-2">Process Scheduling</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    Process scheduling is the method by which the OS decides which process runs on the CPU. 
                    Main types: <strong>Long-term scheduler</strong> (job admission), <strong>Short-term scheduler</strong> (CPU allocation), 
                    <strong>Medium-term scheduler</strong> (process suspension).
                  </p>
                </div>
                <div className="p-4 bg-surface-secondary rounded-xl border border-border">
                  <h3 className="font-semibold text-text-primary mb-2">Key Algorithms</h3>
                  <ul className="text-sm text-text-secondary space-y-2 ml-4">
                    <li>• <strong>FCFS:</strong> First come, first served. Simple but may cause convoy effect.</li>
                    <li>• <strong>SJF:</strong> Shortest job first. Optimal for minimizing waiting time.</li>
                    <li>• <strong>Round Robin:</strong> Time-slice based. Good for time-sharing systems.</li>
                    <li>• <strong>Priority:</strong> Based on process priority. May cause starvation.</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'mindmap' && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center max-w-lg">
                  <div className="w-20 h-20 rounded-2xl bg-surface-tertiary mx-auto mb-4 flex items-center justify-center">
                    <Network className="w-10 h-10 text-text-muted" />
                  </div>
                  <h3 className="text-lg font-medium text-text-primary mb-2">Memory Management Mind Map</h3>
                  <p className="text-sm text-text-muted mb-4">Visual representation of memory concepts.</p>
                  <div className="flex justify-center gap-2 flex-wrap">
                    <span className="px-3 py-1 rounded-full bg-accent-light text-accent text-sm">Paging</span>
                    <span className="px-3 py-1 rounded-full bg-emerald-light text-emerald text-sm">Segmentation</span>
                    <span className="px-3 py-1 rounded-full bg-warning-light text-warning text-sm">Virtual Memory</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'flashcards' && (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="text-sm text-text-muted mb-4">Card {flashcardIndex + 1} of {FLASHARDS.length}</div>
                <div onClick={() => setIsFlipped(!isFlipped)} className="w-full max-w-lg aspect-[3/2] cursor-pointer">
                  <div className={`relative w-full h-full transition-transform duration-500`} style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : '' }}>
                    <div className="absolute inset-0 bg-surface-secondary rounded-xl border-2 border-accent p-6 flex flex-col items-center justify-center" style={{ backfaceVisibility: 'hidden' }}>
                      <span className="px-2 py-1 rounded text-xs bg-surface-tertiary text-text-muted mb-4">{FLASHARDS[flashcardIndex].topic}</span>
                      <p className="text-lg font-medium text-text-primary text-center">{FLASHARDS[flashcardIndex].front}</p>
                      <p className="text-sm text-text-muted mt-4">Click to reveal answer</p>
                    </div>
                    <div className="absolute inset-0 bg-accent text-white rounded-xl p-6 flex flex-col items-center justify-center" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                      <p className="text-center whitespace-pre-line">{FLASHARDS[flashcardIndex].back}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-6">
                  <button onClick={() => { setFlashcardIndex(Math.max(0, flashcardIndex - 1)); setIsFlipped(false) }} disabled={flashcardIndex === 0} className="px-4 py-2 border border-border rounded-lg hover:bg-surface-secondary disabled:opacity-50">Previous</button>
                  <button onClick={() => { setFlashcardIndex(Math.min(FLASHARDS.length - 1, flashcardIndex + 1)); setIsFlipped(false) }} disabled={flashcardIndex === FLASHARDS.length - 1} className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover disabled:opacity-50">Next</button>
                </div>
              </div>
            )}

            {activeTab === 'questions' && (
              <div className="space-y-4">
                {[
                  { q: 'Explain the difference between preemptive and non-preemptive scheduling.', topic: 'Process Management', marks: 5 },
                  { q: 'What is a deadlock? Explain the necessary conditions for deadlock.', topic: 'Process Sync', marks: 8 },
                  { q: 'Discuss the Banker\'s algorithm for deadlock avoidance.', topic: 'Process Sync', marks: 10 },
                ].map((item, i) => (
                  <div key={i} className="p-4 bg-surface-secondary rounded-xl border border-border">
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-sm flex-shrink-0">{i + 1}</span>
                      <div className="flex-1">
                        <p className="font-medium text-text-primary">{item.q}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="px-2 py-0.5 rounded text-xs bg-surface-tertiary text-text-muted">{item.topic}</span>
                          <span className="px-2 py-0.5 rounded text-xs bg-accent-light text-accent">{item.marks} marks</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'formulas' && (
              <div className="space-y-4">
                <div className="p-4 bg-surface-secondary rounded-xl border border-border">
                  <h3 className="font-semibold text-text-primary mb-3">CPU Scheduling Formulas</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between p-2 bg-surface rounded"><span className="text-text-secondary">Turnaround Time</span><code className="text-accent">= Completion Time - Arrival Time</code></div>
                    <div className="flex justify-between p-2 bg-surface rounded"><span className="text-text-secondary">Waiting Time</span><code className="text-accent">= Turnaround Time - Burst Time</code></div>
                    <div className="flex justify-between p-2 bg-surface rounded"><span className="text-text-secondary">Throughput</span><code className="text-accent">= Processes / Time</code></div>
                  </div>
                </div>
                <div className="p-4 bg-surface-secondary rounded-xl border border-border">
                  <h3 className="font-semibold text-text-primary mb-3">Memory Management</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between p-2 bg-surface rounded"><span className="text-text-secondary">Effective Access Time</span><code className="text-accent">= (1-p)×ma + p×t</code></div>
                    <div className="flex justify-between p-2 bg-surface rounded"><span className="text-text-secondary">Page Fault Rate</span><code className="text-accent">= Faults / Total Refs</code></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}