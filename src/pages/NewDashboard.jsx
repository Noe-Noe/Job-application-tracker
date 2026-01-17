import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import Sidebar from '../components/Sidebar'
import ApplicationForm from '../components/ApplicationForm'
import ApplicationList from '../components/ApplicationList'

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const [applications, setApplications] = useState([])
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingApp, setEditingApp] = useState(null)
  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    shortlisted: 0,
    offers: 0,
  })

  useEffect(() => {
    fetchProfile()
    fetchApplications()
  }, [user])

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error)
      } else {
        setProfile(data)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const fetchApplications = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      setApplications(data || [])
      calculateStats(data || [])
    } catch (error) {
      console.error('Error fetching applications:', error.message)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (apps) => {
    setStats({
      total: apps.length,
      upcoming: apps.filter(app => 
        app.status === 'Interview Scheduled'
      ).length,
      shortlisted: apps.filter(app => 
        app.status === 'Shortlisted' || app.status === 'Interview Completed'
      ).length,
      offers: apps.filter(app => app.status === 'Offer Received').length,
    })
  }

  const handleAddApplication = () => {
    setEditingApp(null)
    setShowForm(true)
  }

  const handleEditApplication = (app) => {
    setEditingApp(app)
    setShowForm(true)
  }

  const handleDeleteApplication = async (id) => {
    if (!confirm('Are you sure you want to delete this application?')) return

    try {
      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', id)

      if (error) throw error

      fetchApplications()
    } catch (error) {
      console.error('Error deleting application:', error.message)
      alert('Failed to delete application')
    }
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingApp(null)
    fetchApplications()
  }

  // Get current date info
  const today = new Date()
  const dateOptions = { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' }
  const formattedDate = today.toLocaleDateString('en-US', dateOptions)

  const userName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar user={user} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition relative">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="px-8 py-6">
            {/* Welcome Section */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Welcome, {userName}!</h2>
              <p className="text-gray-500">{formattedDate}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content - Left Side (2/3) */}
              <div className="lg:col-span-2 space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg mb-4">
                      <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="text-sm font-medium text-gray-600 mb-1">Job Applications</div>
                    <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
                    <div className="text-xs text-green-600 mt-2">↑ 30% vs last month</div>
                  </div>

                  <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mb-4">
                      <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="text-sm font-medium text-gray-600 mb-1">Upcoming Intervi</div>
                    <div className="text-3xl font-bold text-gray-900">{stats.upcoming}</div>
                    <div className="text-xs text-red-600 mt-2">↓ 20% vs last month</div>
                  </div>

                  <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <div className="flex items-center justify-center w-12 h-12 bg-cyan-100 rounded-lg mb-4">
                      <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                    </div>
                    <div className="text-sm font-medium text-gray-600 mb-1">Shortlisted</div>
                    <div className="text-3xl font-bold text-gray-900">{stats.shortlisted}</div>
                    <div className="text-xs text-green-600 mt-2">↑ 30% vs last month</div>
                  </div>

                  <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="text-sm font-medium text-gray-600 mb-1">Job Offers Received</div>
                    <div className="text-3xl font-bold text-gray-900">{stats.offers}</div>
                    <div className="text-xs text-green-600 mt-2">↑ 30% vs last month</div>
                  </div>
                </div>

                {/* Add Button */}
                <div>
                  <button
                    onClick={handleAddApplication}
                    className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition shadow-sm"
                  >
                    + Add Application
                  </button>
                </div>

                {/* Applications List */}
                {loading ? (
                  <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                    <div className="text-gray-600">Loading applications...</div>
                  </div>
                ) : applications.length === 0 ? (
                  <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                    <div className="text-gray-400 mb-4">
                      <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
                    <p className="text-gray-600 mb-4">Get started by adding your first job application</p>
                    <button
                      onClick={handleAddApplication}
                      className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition"
                    >
                      + Add Your First Application
                    </button>
                  </div>
                ) : (
                  <ApplicationList
                    applications={applications}
                    onEdit={handleEditApplication}
                    onDelete={handleDeleteApplication}
                  />
                )}
              </div>

              {/* Right Sidebar - Profile */}
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm font-semibold text-gray-900">interview</div>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center text-center mb-6">
                    <div className="w-24 h-24 bg-purple-200 rounded-full mb-4 flex items-center justify-center">
                      <span className="text-3xl font-bold text-purple-600">
                        {userName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{userName}</h3>
                    <p className="text-sm text-gray-600">{profile?.title || 'Job Seeker'}</p>
                    <button className="mt-4 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
                      Edit Profile
                    </button>
                  </div>

                  {/* Experience Section */}
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Experience</h4>
                    <div className="space-y-3">
                      <div className="flex">
                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                          <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="flex-1 text-sm">
                          <div className="font-medium text-gray-900">{profile?.title || 'Add your title'}</div>
                          <div className="text-gray-500">Click Edit Profile to add experience</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Education Section */}
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Education</h4>
                    <div className="space-y-3">
                      <div className="flex">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                          <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                          </svg>
                        </div>
                        <div className="flex-1 text-sm">
                          <div className="text-gray-500">Click Edit Profile to add education</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Application Form Modal */}
      {showForm && (
        <ApplicationForm
          application={editingApp}
          onClose={handleFormClose}
          userId={user.id}
        />
      )}
    </div>
  )
}
