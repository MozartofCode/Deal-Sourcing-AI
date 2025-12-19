import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './components/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import DiscoverStartups from './pages/DiscoverStartups'
import DiscoverVCs from './pages/DiscoverVCs'
import Portfolio from './pages/Portfolio'
import StartupAnalysis from './pages/StartupAnalysis'
import Fundraising from './pages/Fundraising'
import Chat from './pages/Chat'
import Login from './pages/Login'
import AIMatches from './pages/AIMatches'
import Messages from './pages/Messages'
import Profile from './pages/Profile'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
          <Navigation />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/discover"
              element={
                <ProtectedRoute>
                  <DiscoverStartups />
                </ProtectedRoute>
              }
            />
            <Route
              path="/discover-vcs"
              element={
                <ProtectedRoute>
                  <DiscoverVCs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/portfolio"
              element={
                <ProtectedRoute>
                  <Portfolio />
                </ProtectedRoute>
              }
            />
            <Route
              path="/analysis"
              element={
                <ProtectedRoute>
                  <StartupAnalysis />
                </ProtectedRoute>
              }
            />
            <Route
              path="/fundraising"
              element={
                <ProtectedRoute>
                  <Fundraising />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ai-matches"
              element={
                <ProtectedRoute>
                  <AIMatches />
                </ProtectedRoute>
              }
            />
            <Route
              path="/messages"
              element={
                <ProtectedRoute>
                  <Messages />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/:userId"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App

