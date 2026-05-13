const API_BASE = import.meta.env.VITE_API_URL || '/api'

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token')
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  }
  
  const res = await fetch(`${API_BASE}${url}`, { ...options, headers })
  
  if (res.status === 401) {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    window.location.href = '/login'
    throw new Error('Session expired')
  }
  
  if (!res.ok) {
    const data = await res.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(data.error || 'Request failed')
  }
  
  return res.json()
}

export const api = {
  auth: {
    login: (email: string, password: string) => 
      fetchWithAuth('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
    register: (name: string, email: string, password: string) =>
      fetchWithAuth('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) }),
    logout: () => fetchWithAuth('/auth/logout', { method: 'POST' }),
    me: () => fetchWithAuth('/auth/me'),
    updateProfile: (data: { name?: string; password?: string }) =>
      fetchWithAuth('/auth/profile', { method: 'PUT', body: JSON.stringify(data) })
  },

  exams: {
    list: () => fetchWithAuth('/exams/'),
    getBranches: (examId: number) => fetchWithAuth(`/exams/${examId}/branches`),
    getSubjects: (examId: number, branchId: number) => fetchWithAuth(`/exams/${examId}/${branchId}/subjects`),
    getSyllabus: (examId: number, branchId: number, subjectId: number) => 
      fetchWithAuth(`/exams/${examId}/${branchId}/${subjectId}/syllabus`),
    getFullSyllabus: () => fetchWithAuth('/exams/syllabus/full')
  },

  questions: {
    list: (params: { examId?: number; subjectId?: number; difficulty?: string; limit?: number }) => {
      const search = new URLSearchParams()
      Object.entries(params).forEach(([k, v]) => v && search.append(k, String(v)))
      return fetchWithAuth(`/questions/?${search}`)
    },
    getRandom: (params: { examId?: number; subjectId?: number; count?: number }) => {
      const search = new URLSearchParams()
      Object.entries(params).forEach(([k, v]) => v && search.append(k, String(v)))
      return fetchWithAuth(`/questions/random?${search}`)
    },
    submit: (questionId: number, selectedOption: string, timeTaken?: number) =>
      fetchWithAuth('/questions/submit', { 
        method: 'POST', 
        body: JSON.stringify({ questionId, selectedOption, timeTaken }) 
      }),
    getStats: () => fetchWithAuth('/questions/stats')
  },

  progress: {
    get: () => fetchWithAuth('/progress/'),
    update: (topicId: number, progress: number, completed?: boolean) =>
      fetchWithAuth('/progress/update', { 
        method: 'POST', 
        body: JSON.stringify({ topicId, progress, completed }) 
      }),
    markComplete: (topicId: number, timeSpent?: number) =>
      fetchWithAuth('/progress/topic-completed', { 
        method: 'POST', 
        body: JSON.stringify({ topicId, timeSpent }) 
      })
  },

  planner: {
    calculate: (data: { examDate: string; hoursPerDay: number; subjectsLeft: number; backlogTopics: number }) =>
      fetchWithAuth('/planner/calculate', { method: 'POST', body: JSON.stringify(data) }),
    getCurrent: () => fetchWithAuth('/planner/current')
  },

  notebook: {
    list: (type?: string) => fetchWithAuth(`/notebook/${type ? `?type=${type}` : ''}`),
    create: (data: { type: string; title: string; content: string; topicId?: number }) =>
      fetchWithAuth('/notebook/', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: { title?: string; content?: string }) =>
      fetchWithAuth(`/notebook/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: number) => fetchWithAuth(`/notebook/${id}`, { method: 'DELETE' })
  }
}