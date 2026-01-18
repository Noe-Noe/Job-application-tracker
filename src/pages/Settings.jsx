import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'

export default function Settings() {
  const { user, signOut } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  
  // Profile settings
  const [profile, setProfile] = useState({
    full_name: '',
    title: '',
    email: user?.email || '',
    phone: '',
    location: '',
    linkedin_url: '',
    github_url: '',
    portfolio_url: ''
  })

  // Notification settings
  const [notifications, setNotifications] = useState({
    email_notifications: true,
    interview_reminders: true,
    application_updates: true,
    survey_reminders: true,
    event_reminders: true
  })

  // Privacy settings
  const [privacy, setPrivacy] = useState({
    share_analytics: false
  })

  // API Token for browser extension
  const [apiToken, setApiToken] = useState('')
  const [showToken, setShowToken] = useState(false)
  const [tokenCopied, setTokenCopied] = useState(false)

  useEffect(() => {
    fetchProfile()
    generateApiToken()
  }, [user])

  const generateApiToken = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setApiToken(session.access_token)
      }
    } catch (error) {
      console.error('Error getting session token:', error)
    }
  }

  const copyTokenToClipboard = () => {
    navigator.clipboard.writeText(apiToken)
    setTokenCopied(true)
    setTimeout(() => setTokenCopied(false), 2000)
  }

  const refreshApiToken = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.refreshSession()
      if (error) throw error
      if (session) {
        setApiToken(session.access_token)
        showMessage('success', 'API token refreshed successfully!')
      }
    } catch (error) {
      console.error('Error refreshing token:', error)
      showMessage('error', 'Failed to refresh API token')
    }
  }

  const fetchProfile = async () => {
    try {
      setLoading(true)
      
      console.log('Fetching profile for user:', user?.id)
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()

      console.log('Profile query result:', { data, error })

      // PGRST116 means no rows returned, which is fine for a new user
      if (error) {
        console.error('Error fetching profile:', error)
        if (error.code !== 'PGRST116') {
          throw error
        }
      }
      
      if (data) {
        console.log('Profile data found:', data)
        setProfile(prev => ({
          ...prev,
          full_name: data.full_name || '',
          title: data.title || '',
          phone: data.phone || '',
          location: data.location || '',
          linkedin_url: data.linkedin_url || '',
          github_url: data.github_url || '',
          portfolio_url: data.portfolio_url || ''
        }))
        
        setNotifications({
          email_notifications: data.email_notifications ?? true,
          interview_reminders: data.interview_reminders ?? true,
          application_updates: data.application_updates ?? true,
          survey_reminders: data.survey_reminders ?? true,
          event_reminders: data.event_reminders ?? true
        })
        
        setPrivacy({
          share_analytics: data.share_analytics || false
        })
      } else {
        console.log('No profile found - will create on first save')
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      showMessage('error', `Failed to load profile settings. Error: ${error.message || 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const showMessage = (type, text) => {
    setMessage({ type, text })
    setTimeout(() => setMessage({ type: '', text: '' }), 5000)
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          user_id: user.id,
          full_name: profile.full_name,
          title: profile.title,
          phone: profile.phone,
          location: profile.location,
          linkedin_url: profile.linkedin_url,
          github_url: profile.github_url,
          portfolio_url: profile.portfolio_url,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        })

      if (error) throw error
      showMessage('success', 'Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
      showMessage('error', 'Failed to update profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveNotifications = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          user_id: user.id,
          ...notifications,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        })

      if (error) throw error
      showMessage('success', 'Notification settings updated!')
    } catch (error) {
      console.error('Error updating notifications:', error)
      showMessage('error', 'Failed to update notification settings. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleSavePrivacy = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          user_id: user.id,
          ...privacy,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        })

      if (error) throw error
      showMessage('success', 'Privacy settings updated!')
    } catch (error) {
      console.error('Error updating privacy:', error)
      showMessage('error', 'Failed to update privacy settings. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.'
    )
    
    if (!confirmed) return

    const doubleConfirm = window.confirm(
      'This is your last chance. Are you absolutely sure you want to delete your account?'
    )
    
    if (!doubleConfirm) return

    try {
      // Note: Actual account deletion would require backend/admin API
      // This is a placeholder for the UI flow
      alert('Account deletion request submitted. Please contact support to complete the process.')
      await signOut()
    } catch (error) {
      console.error('Error deleting account:', error.message)
      showMessage('error', 'Failed to delete account')
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar user={user} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <div className="text-gray-600 mt-4">Loading settings...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar user={user} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title="Settings" 
          subtitle="Manage your account settings and preferences"
          profile={profile}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-8 py-6">
            {/* Message Banner */}
            {message.text && (
              <div className={`mb-6 p-4 rounded-lg ${
                message.type === 'success' 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    {message.type === 'success' ? (
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    ) : (
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    )}
                  </svg>
                  {message.text}
                </div>
              </div>
            )}

            {/* Profile Settings */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h2>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profile.full_name}
                      onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={profile.email}
                      disabled
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={profile.location}
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      placeholder="San Francisco, CA"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={profile.linkedin_url}
                    onChange={(e) => setProfile({ ...profile, linkedin_url: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={profile.github_url}
                    onChange={(e) => setProfile({ ...profile, github_url: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    placeholder="https://github.com/yourusername"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Portfolio URL
                  </label>
                  <input
                    type="url"
                    value={profile.portfolio_url}
                    onChange={(e) => setProfile({ ...profile, portfolio_url: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    placeholder="https://yourportfolio.com"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? 'Saving...' : 'Save Profile'}
                  </button>
                </div>
              </form>
            </div>

            {/* Notification Settings */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h2>
              <form onSubmit={handleSaveNotifications} className="space-y-4">
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={notifications.email_notifications}
                      onChange={(e) => setNotifications({ ...notifications, email_notifications: e.target.checked })}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <span className="ml-3 text-sm text-gray-700">
                      Email notifications
                    </span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={notifications.interview_reminders}
                      onChange={(e) => setNotifications({ ...notifications, interview_reminders: e.target.checked })}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <span className="ml-3 text-sm text-gray-700">
                      Interview reminders
                    </span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={notifications.application_updates}
                      onChange={(e) => setNotifications({ ...notifications, application_updates: e.target.checked })}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <span className="ml-3 text-sm text-gray-700">
                      Application status updates
                    </span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={notifications.survey_reminders}
                      onChange={(e) => setNotifications({ ...notifications, survey_reminders: e.target.checked })}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <span className="ml-3 text-sm text-gray-700">
                      Survey request reminders
                    </span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={notifications.event_reminders}
                      onChange={(e) => setNotifications({ ...notifications, event_reminders: e.target.checked })}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <span className="ml-3 text-sm text-gray-700">
                      Event reminders
                    </span>
                  </label>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? 'Saving...' : 'Save Preferences'}
                  </button>
                </div>
              </form>
            </div>

            {/* Browser Extension API Access */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Browser Extension</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Use this API token to connect the Job Tracker browser extension
                  </p>
                </div>
                <a
                  href="/extension.zip"
                  download
                  className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition"
                >
                  Download Extension
                </a>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    API Endpoint
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={window.location.origin}
                      disabled
                      className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 font-mono text-sm"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.origin)
                        showMessage('success', 'API endpoint copied!')
                      }}
                      className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    API Token
                  </label>
                  <div className="flex gap-2">
                    <input
                      type={showToken ? 'text' : 'password'}
                      value={apiToken}
                      readOnly
                      className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 font-mono text-sm"
                    />
                    <button
                      onClick={() => setShowToken(!showToken)}
                      className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                      title={showToken ? 'Hide' : 'Show'}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {showToken ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        )}
                      </svg>
                    </button>
                    <button
                      onClick={copyTokenToClipboard}
                      className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                    >
                      {tokenCopied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Keep this token secure. It provides access to your account.
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={refreshApiToken}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm"
                  >
                    Refresh Token
                  </button>
                  <div className="text-sm text-gray-600">
                    Token automatically refreshes on login
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-blue-900 mb-2">How to use:</h3>
                  <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                    <li>Download and install the browser extension</li>
                    <li>Copy the API Endpoint and Token above</li>
                    <li>Open the extension and paste both values</li>
                    <li>Click "Save Configuration" and "Test Connection"</li>
                    <li>Visit any job posting page and click "Save to Job Tracker"</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Privacy Settings */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Privacy Settings</h2>
              <form onSubmit={handleSavePrivacy} className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={privacy.share_analytics}
                    onChange={(e) => setPrivacy({ ...privacy, share_analytics: e.target.checked })}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    Share anonymous analytics to help improve the app
                  </span>
                </label>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? 'Saving...' : 'Save Privacy Settings'}
                  </button>
                </div>
              </form>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-xl border border-red-200 p-6">
              <h2 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Delete Account</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Permanently delete your account and all associated data
                    </p>
                  </div>
                  <button
                    onClick={handleDeleteAccount}
                    className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
