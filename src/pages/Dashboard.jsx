import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const { profile } = useAuth()

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">Welcome, {profile?.full_name}</h1>

      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-xl p-4 mb-8 text-sm">
        Your profile is pending approval. You'll be notified once it goes live.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          to="/create-profile"
          className="bg-white rounded-2xl shadow p-6 hover:shadow-md transition-all"
        >
          <p className="font-semibold text-gray-900 mb-1">Edit Profile</p>
          <p className="text-sm text-gray-500">Update your bio, photos, and category</p>
        </Link>
      </div>
    </div>
  )
}
