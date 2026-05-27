import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function Messages() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      // Get all messages involving this user
      const { data } = await supabase
        .from('messages')
        .select('*, sender:profiles!messages_sender_id_fkey(id, full_name), receiver:profiles!messages_receiver_id_fkey(id, full_name)')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false })

      if (!data) { setLoading(false); return }

      // Group into conversations by the other person
      const seen = new Set()
      const convos = []
      for (const msg of data) {
        const other = msg.sender_id === user.id ? msg.receiver : msg.sender
        if (!seen.has(other.id)) {
          seen.add(other.id)
          convos.push({ other, lastMessage: msg })
        }
      }
      setConversations(convos)
      setLoading(false)
    }
    load()
  }, [user.id])

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="font-heading text-3xl font-bold text-gray-900 mb-8">Messages</h1>

      {loading && <p className="text-gray-400">Loading…</p>}

      {!loading && conversations.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg">No messages yet!</p>
          <p className="text-sm mt-1">Book a provider to start a conversation.</p>
        </div>
      )}

      <div className="space-y-3">
        {conversations.map(({ other, lastMessage }) => (
          <Link
            key={other.id}
            to={`/messages/${other.id}`}
            className="flex items-center gap-4 bg-white rounded-2xl border border-blush-100 shadow-sm p-4 hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            <div className="w-12 h-12 rounded-full bg-blush-200 flex items-center justify-center text-blush-600 font-heading font-bold text-lg flex-shrink-0">
              {other.full_name?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900">{other.full_name}</p>
              <p className="text-sm text-gray-400 truncate">{lastMessage.content}</p>
            </div>
            <p className="text-xs text-gray-300 flex-shrink-0">
              {new Date(lastMessage.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
