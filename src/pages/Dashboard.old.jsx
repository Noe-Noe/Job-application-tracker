import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import ApplicationForm from '../components/ApplicationForm'
import ApplicationList from '../components/ApplicationList'

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingApp, setEditingApp] = useState(null)
  const [stats, setStats] = useState({
    total: 0,
    applied: 0,
    interview: 0,
    offer: 0,
    rejected: 0,
  })

  useEffect(() => {
    fetchApplications()
  }, [user])

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
      applied: apps.filter(app => app.status === 'Applied').length,
      interview: apps.filter(app => 
        app.status === 'Interview Scheduled' || app.status === 'Interview Completed'
      ).length,
      offer: apps.filter(app => app.status === 'Offer Received').length,
      rejected: apps.filter(app => app.status === 'Rejected').length,
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

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Job Application Tracker</h1>
              <p className="text-sm text-gray-600 mt-1">{user?.email}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="text-sm font-medium text-gray-600 mb-1">Total</div>
            <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
          </div>
          <div className="bg-blue-50 p-6 rounded-xl shadow-sm border border-blue-200">
            <div className="text-sm font-medium text-blue-600 mb-1">Applied</div>
            <div className="text-3xl font-bold text-blue-900">{stats.applied}</div>
          </div>
          <div className="bg-purple-50 p-6 rounded-xl shadow-sm border border-purple-200">
            <div className="text-sm font-medium text-purple-600 mb-1">Interviews</div>
            <div className="text-3xl font-bold text-purple-900">{stats.interview}</div>
          </div>
          <div className="bg-green-50 p-6 rounded-xl shadow-sm border border-green-200">
            <div className="text-sm font-medium text-green-600 mb-1">Offers</div>
            <div className="text-3xl font-bold text-green-900">{stats.offer}</div>
          </div>
          <div className="bg-red-50 p-6 rounded-xl shadow-sm border border-red-200">
            <div className="text-sm font-medium text-red-600 mb-1">Rejected</div>
            <div className="text-3xl font-bold text-red-900">{stats.rejected}</div>
          </div>
        </div>

        {/* Add Button */}
        <div className="mb-6">
          <button
            onClick={handleAddApplication}
            className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition shadow-sm"
          >
            + Add Application
          </button>
        </div>

        {/* Application List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-600">Loading applications...</div>
          </div>
        ) : applications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
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
      </main>

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
