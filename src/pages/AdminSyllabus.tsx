import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, ChevronRight, FileUp, Save, Eye, BookOpen, Users } from 'lucide-react'
import { api } from '../api'

const BRANCHES = ['Computer Science', 'Electronics', 'Electrical', 'Mechanical', 'Civil']
const SEMESTERS = ['1', '2', '3', '4', '5', '6', '7', '8']
const SUBJECTS = ['Data Structures & Algorithms', 'Algorithms', 'Operating Systems', 'Database', 'Computer Networks', 'Theory of Computation']

export default function AdminSyllabus() {
  const [selectedSemester, setSelectedSemester] = useState('5')
  const [selectedBranch, setSelectedBranch] = useState('Computer Science')
  const [selectedSubject, setSelectedSubject] = useState('Data Structures & Algorithms')
  const [units, setUnits] = useState<any[]>([
    { id: 1, name: 'Unit 1: Arrays & Linked Lists', topics: ['Arrays', 'Linked Lists', 'Doubly Linked Lists'], status: 'published' },
    { id: 2, name: 'Unit 2: Stacks and Queues', topics: ['Stack Operations', 'Queue Operations'], status: 'published' },
    { id: 3, name: 'Unit 3: Trees', topics: ['Binary Trees', 'BST', 'AVL Trees'], status: 'draft' },
  ])
  const [editingUnit, setEditingUnit] = useState<number | null>(null)
  const [newTopic, setNewTopic] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadSyllabus()
  }, [selectedSubject])

  const loadSyllabus = async () => {
    setLoading(true)
    try {
      const data = await api.exams.getSyllabus(1, 1, 1)
      if (data?.units) {
        setUnits(data.units.map((u: any) => ({ ...u, status: 'draft', topics: u.topics?.map((t: any) => t.name) || [] })))
      }
    } catch (err) {
      console.error('Failed to load syllabus:', err)
    } finally {
      setLoading(false)
    }
  }

  const addUnit = () => {
    const newUnit = { id: Date.now(), name: `Unit ${units.length + 1}: New Unit`, topics: [], status: 'draft' }
    setUnits([...units, newUnit])
    setEditingUnit(newUnit.id)
  }

  const addTopic = (unitId: number) => {
    if (!newTopic.trim()) return
    setUnits(units.map(u => u.id === unitId ? { ...u, topics: [...u.topics, newTopic.trim()] } : u))
    setNewTopic('')
  }

  const deleteUnit = (unitId: number) => setUnits(units.filter(u => u.id !== unitId))

  const updateUnitName = (unitId: number, name: string) => {
    setUnits(units.map(u => u.id === unitId ? { ...u, name } : u))
  }

  const publishSyllabus = () => {
    setUnits(units.map(u => ({ ...u, status: 'published' })))
    alert('Syllabus published successfully!')
  }

  const totalTopics = units.reduce((a, u) => a + (u.topics?.length || 0), 0)

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Admin Syllabus Manager</h1>
          <p className="text-text-secondary mt-1">Create and manage syllabi for all courses</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-surface-secondary">
            <FileUp className="w-4 h-4" />
            Import Syllabus
          </button>
          <button onClick={publishSyllabus} className="flex items-center gap-2 px-4 py-2 bg-emerald text-white rounded-lg hover:bg-emerald/90">
            <Save className="w-4 h-4" />
            Save & Publish
          </button>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-xl mb-6 p-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">Semester</label>
            <select value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)} className="w-full px-4 py-2.5 border border-border rounded-lg bg-surface-secondary text-text-primary">
              {SEMESTERS.map(s => <option key={s} value={s}>Semester {s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">Branch</label>
            <select value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)} className="w-full px-4 py-2.5 border border-border rounded-lg bg-surface-secondary text-text-primary">
              {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">Subject</label>
            <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className="w-full px-4 py-2.5 border border-border rounded-lg bg-surface-secondary text-text-primary">
              {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
        <div className="col-span-8 bg-surface border border-border rounded-xl flex flex-col min-h-0">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-accent" />
              <h3 className="font-semibold text-text-primary">{selectedSubject} Syllabus</h3>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${units.every(u => u.status === 'published') ? 'bg-emerald-light text-emerald' : 'bg-warning-light text-warning'}`}>
              {units.every(u => u.status === 'published') ? 'Published' : `${units.filter(u => u.status === 'draft').length} Draft`}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin w-6 h-6 border-2 border-accent border-t-transparent rounded-full" />
              </div>
            ) : units.map((unit, index) => (
              <div key={unit.id} className="border border-border rounded-xl overflow-hidden">
                <div className="p-4 bg-surface-secondary flex items-center justify-between">
                  {editingUnit === unit.id ? (
                    <input
                      type="text"
                      value={unit.name}
                      onChange={(e) => updateUnitName(unit.id, e.target.value)}
                      onBlur={() => setEditingUnit(null)}
                      autoFocus
                      className="flex-1 px-3 py-1.5 border border-accent rounded-lg bg-surface text-text-primary mr-4"
                    />
                  ) : (
                    <div className="flex items-center gap-3 flex-1">
                      <span className="w-8 h-8 rounded-lg bg-accent text-white flex items-center justify-center text-sm font-bold">{index + 1}</span>
                      <span className="font-medium text-text-primary">{unit.name}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${unit.status === 'published' ? 'bg-emerald-light text-emerald' : 'bg-surface-tertiary text-text-muted'}`}>{unit.status}</span>
                    <button onClick={() => setEditingUnit(unit.id)} className="p-2 hover:bg-border rounded-lg"><Edit2 className="w-4 h-4 text-text-muted" /></button>
                    <button onClick={() => deleteUnit(unit.id)} className="p-2 hover:bg-danger-light rounded-lg"><Trash2 className="w-4 h-4 text-danger" /></button>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  {(unit.topics || []).map((topic: string, i: number) => (
                    <div key={i} className="flex items-center gap-3 p-2 hover:bg-surface-secondary rounded-lg group">
                      <ChevronRight className="w-4 h-4 text-text-muted" />
                      <span className="text-text-secondary text-sm flex-1">{topic}</span>
                      <button className="p-1 opacity-0 group-hover:opacity-100 hover:bg-border rounded"><Trash2 className="w-4 h-4 text-danger" /></button>
                    </div>
                  ))}
                  <div className="flex items-center gap-2 mt-3">
                    <input
                      type="text"
                      placeholder="Add new topic..."
                      value={newTopic}
                      onChange={(e) => setNewTopic(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addTopic(unit.id)}
                      className="flex-1 px-3 py-2 border border-border rounded-lg bg-surface-secondary text-sm text-text-primary"
                    />
                    <button onClick={() => addTopic(unit.id)} className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover text-sm">Add</button>
                  </div>
                </div>
              </div>
            ))}

            <button onClick={addUnit} className="w-full p-4 border-2 border-dashed border-border rounded-xl flex items-center justify-center gap-2 text-text-muted hover:border-accent hover:text-accent">
              <Plus className="w-5 h-5" />
              Add New Unit
            </button>
          </div>
        </div>

        <div className="col-span-4 space-y-4">
          <div className="bg-surface border border-border rounded-xl p-4">
            <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-accent" />
              Preview
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-border"><span className="text-text-muted">Semester</span><span className="font-medium">{selectedSemester}</span></div>
              <div className="flex justify-between py-2 border-b border-border"><span className="text-text-muted">Branch</span><span className="font-medium">{selectedBranch}</span></div>
              <div className="flex justify-between py-2 border-b border-border"><span className="text-text-muted">Subject</span><span className="font-medium">{selectedSubject}</span></div>
              <div className="flex justify-between py-2 border-b border-border"><span className="text-text-muted">Units</span><span className="font-medium">{units.length}</span></div>
              <div className="flex justify-between py-2"><span className="text-text-muted">Topics</span><span className="font-medium">{totalTopics}</span></div>
            </div>
          </div>

          <div className="bg-surface border border-border rounded-xl p-4">
            <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
              <FileUp className="w-5 h-5 text-accent" />
              Import Sources
            </h3>
            <div className="space-y-3">
              {[
                { color: 'accent', label: 'Upload PDF', desc: 'Import from syllabus PDF' },
                { color: 'emerald', label: 'Paste Text', desc: 'Paste syllabus text' },
                { color: 'warning', label: 'Web Source', desc: 'Fetch from official website' },
              ].map((item, i) => (
                <button key={i} className="w-full flex items-center gap-3 p-3 bg-surface-secondary rounded-lg hover:bg-border text-left">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `var(--color-${item.color}-light)` }}>
                    <FileUp className={`w-5 h-5 text-${item.color}`} />
                  </div>
                  <div>
                    <div className="font-medium text-text-primary text-sm">{item.label}</div>
                    <div className="text-xs text-text-muted">{item.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-surface border border-border rounded-xl p-4">
            <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-accent" />
              Recent Activity
            </h3>
            <div className="space-y-3">
              {[
                { text: 'Unit 1 & 2 published', time: '2 hours ago' },
                { text: 'Unit 3 & 4 draft saved', time: 'Yesterday' },
                { text: 'Syllabus created', time: '3 days ago' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald mt-2" />
                  <div>
                    <p className="text-sm text-text-primary">{item.text}</p>
                    <p className="text-xs text-text-muted">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}