import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
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
        .eq('user_id', user.id)
        .maybeSingle()

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
        <Header title="Dashboard" profile={profile} />

        <main className="flex-1 overflow-y-auto">
          <div className="px-8 py-6">
            {/* Welcome Section */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Welcome, {userName}!</h2>
              <p className="text-gray-500">{formattedDate}</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {/* Main Content - Full Width */}
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition">
                    <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg mb-4">
                      <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="text-sm font-medium text-gray-600 mb-1">Job Applications</div>
                    <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
                    <div className="text-xs text-green-600 mt-2">↑ 30% vs last month</div>
                  </div>

                  <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition">
                    <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mb-4">
                      <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="text-sm font-medium text-gray-600 mb-1">Upcoming Interviews</div>
                    <div className="text-3xl font-bold text-gray-900">{stats.upcoming}</div>
                    <div className="text-xs text-red-600 mt-2">↓ 20% vs last month</div>
                  </div>

                  <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition">
                    <div className="flex items-center justify-center w-12 h-12 bg-cyan-100 rounded-lg mb-4">
                      <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                    </div>
                    <div className="text-sm font-medium text-gray-600 mb-1">Shortlisted</div>
                    <div className="text-3xl font-bold text-gray-900">{stats.shortlisted}</div>
                    <div className="text-xs text-green-600 mt-2">↑ 30% vs last month</div>
                  </div>

                  <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition">
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
