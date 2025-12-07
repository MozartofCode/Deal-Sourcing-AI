import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import DiscoverStartups from './pages/DiscoverStartups'
import Portfolio from './pages/Portfolio'
import StartupAnalysis from './pages/StartupAnalysis'
import Search from './pages/Search'
import Chat from './pages/Chat'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/discover" element={<DiscoverStartups />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/analysis" element={<StartupAnalysis />} />
          <Route path="/search" element={<Search />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

