import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import LearningWorkspace from './pages/LearningWorkspace'
import MCQPractice from './pages/MCQPractice'
import StudyPlanner from './pages/StudyPlanner'
import Notebook from './pages/Notebook'
import AdminSyllabus from './pages/AdminSyllabus'
import Layout from './components/Layout'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full" />
      </div>
    )
  }
  
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  return <>{children}</>
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route element={<Layout />}>
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/workspace" element={
          <ProtectedRoute><LearningWorkspace /></ProtectedRoute>
        } />
        <Route path="/practice" element={
          <ProtectedRoute><MCQPractice /></ProtectedRoute>
        } />
        <Route path="/planner" element={
          <ProtectedRoute><StudyPlanner /></ProtectedRoute>
        } />
        <Route path="/notebook" element={
          <ProtectedRoute><Notebook /></ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute><AdminSyllabus /></ProtectedRoute>
        } />
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}