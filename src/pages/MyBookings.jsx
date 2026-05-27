import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const STATUS_STYLES = {
  pending:   'bg-yellow-50 text-yellow-700 border-yellow-200',
  confirmed: 'bg-green-50 text-green-700 border-green-200',
  cancelled: 'bg-red-50 text-red-600 border-red-200',
  completed: 'bg-gray-50 text-gray-500 border-gray-200',
}

export default function MyBookings() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('bookings')
        .select('*, services(name, price), provider_profiles(*, profiles(full_name))')
        .eq('student_id', user.id)
        .order('date', { ascending: false })
      setBookings(data || [])
      setLoading(false)
    }
    load()
  }, [user.id])

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="font-heading text-3xl font-bold text-gray-900 mb-8">My Bookings</h1>

      {loading && <p className="text-gray-400">Loading…</p>}

      {!loading && bookings.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg">No bookings yet!</p>
          <p className="text-sm mt-1">Browse providers and book your first appointment.</p>
        </div>
      )}

      <div className="space-y-4">
        {bookings.map((b) => (
          <div key={b.id} className="bg-white rounded-2xl border border-blush-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="font-semibold text-gray-900">{b.provider_profiles?.profiles?.full_name}</p>
              <span className={`text-xs font-medium border px-3 py-0.5 rounded-full capitalize ${STATUS_STYLES[b.status]}`}>
                {b.status}
              </span>
            </div>
            <p className="text-sm text-gray-600">{b.services?.name}</p>
            <p className="text-sm text-gray-400 mt-1">
              {new Date(b.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' })}
              {' · '}
              {b.time?.slice(0, 5)}
            </p>
            <p className="text-sm font-semibold text-blush-600 mt-2">${b.services?.price}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
