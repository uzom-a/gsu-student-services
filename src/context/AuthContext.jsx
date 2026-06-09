import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [providerProfile, setProviderProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else { setProfile(null); setProviderProfile(null); setLoading(false) }
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  async function fetchProfile(userId) {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
    setProfile(data)
    if (data?.role === 'provider') {
      const { data: pp } = await supabase
        .from('provider_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle()
      setProviderProfile(pp ?? null)
    } else {
      setProviderProfile(null)
    }
    setLoading(false)
  }

  const refreshProviderProfile = useCallback(async () => {
    if (!user?.id) return
    const { data } = await supabase
      .from('provider_profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()
    setProviderProfile(data ?? null)
  }, [user?.id])

  const needsProviderProfile = profile?.role === 'provider' && !loading && !providerProfile

  async function signUp({ email, password, fullName, role }) {
    // Store fullName and role in user metadata.
    // The database trigger will create the profile row automatically
    // once the user confirms their email.
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role },
        emailRedirectTo: `${window.location.origin}/`,
      },
    })
    if (error) throw error
    return data
  }

  async function signIn({ email, password }) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, profile, providerProfile, needsProviderProfile, loading, signUp, signIn, signOut, refreshProviderProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
