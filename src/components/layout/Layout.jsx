import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Navbar from './Navbar'

const PUBLIC_PATHS = new Set(['/login', '/signup', '/check-email'])

export default function Layout({ children }) {
  const { needsProviderProfile } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (
      needsProviderProfile &&
      location.pathname !== '/create-profile' &&
      !PUBLIC_PATHS.has(location.pathname)
    ) {
      navigate('/create-profile', { replace: true })
    }
  }, [needsProviderProfile, location.pathname, navigate])

  return (
    <div className="min-h-screen bg-blush-50">
      <Navbar />
      <main>{children}</main>
    </div>
  )
}
