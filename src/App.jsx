import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/layout/Layout'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Browse from './pages/Browse'
import CreateProfile from './pages/CreateProfile'
import Dashboard from './pages/Dashboard'
import AdminQueue from './pages/AdminQueue'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/browse/:category" element={<Browse />} />
            <Route path="/create-profile" element={<CreateProfile />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<AdminQueue />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  )
}
