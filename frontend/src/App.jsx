import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './context/AuthContext'

// Pages
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import JobSearch from './pages/JobSearch'
import Skills from './pages/Skills'
import ResumeAI from './pages/ResumeAI'
import Forecast from './pages/Forecast'
import Roles from './pages/Roles'

// Layout
import Navbar from './components/Navbar'

// Protected route wrapper
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100vh', background: 'var(--bg-primary)'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 40, height: 40, border: '3px solid var(--border-light)',
          borderTop: '3px solid var(--accent-primary)', borderRadius: '50%',
          animation: 'spin 0.8s linear infinite', margin: '0 auto 12px'
        }} />
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Loading SkilLintel...</p>
      </div>
    </div>
  )
  return user ? children : <Navigate to="/login" replace />
}

// App layout with navbar
function AppLayout({ children, showNav = true }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {showNav && <Navbar />}
      {children}
    </div>
  )
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={
          <AppLayout showNav={false}>
            <Landing />
          </AppLayout>
        } />
        <Route path="/login" element={
          <AppLayout showNav={false}>
            <Login />
          </AppLayout>
        } />
        <Route path="/register" element={
          <AppLayout showNav={false}>
            <Register />
          </AppLayout>
        } />

        {/* Protected routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/jobs" element={
          <ProtectedRoute>
            <AppLayout>
              <JobSearch />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/skills" element={
          <ProtectedRoute>
            <AppLayout>
              <Skills />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/resume" element={
          <ProtectedRoute>
            <AppLayout>
              <ResumeAI />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/forecast" element={
          <ProtectedRoute>
            <AppLayout>
              <Forecast />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/roles" element={
          <ProtectedRoute>
            <AppLayout>
              <Roles />
            </AppLayout>
          </ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-light)',
              fontSize: '14px'
            },
            success: { iconTheme: { primary: '#10b981', secondary: 'white' } },
            error: { iconTheme: { primary: '#ef4444', secondary: 'white' } }
          }}
        />
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </AuthProvider>
    </ThemeProvider>
  )
}