import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import SurveyForm from '../components/SurveyForm'

const SURVEY_STATUSES = ['All', 'Pending', 'In Progress', 'Completed', 'Declined', 'Expired']
const PRIORITY_LEVELS = ['All', 'Low', 'Medium', 'High', 'Urgent']

const STATUS_COLORS = {
  'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'In Progress': 'bg-blue-100 text-blue-800 border-blue-200',
  'Completed': 'bg-green-100 text-green-800 border-green-200',
  'Declined': 'bg-red-100 text-red-800 border-red-200',
  'Expired': 'bg-gray-100 text-gray-800 border-gray-200',
}

const PRIORITY_COLORS = {
  'Low': 'bg-gray-100 text-gray-800 border-gray-200',
  'Medium': 'bg-blue-100 text-blue-800 border-blue-200',
  'High': 'bg-orange-100 text-orange-800 border-orange-200',
  'Urgent': 'bg-red-100 text-red-800 border-red-200',
}

export default function Survey() {
  const { user } = useAuth()
  const [surveys, setSurveys] = useState([])
  const [applications, setApplications] = useState([])
  const [filteredSurveys, setFilteredSurveys] = useState([])
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingSurvey, setEditingSurvey] = useState(null)
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [priorityFilter, setPriorityFilter] = useState('All')
  const [sortBy, setSortBy] = useState('due_date')
  const [sortOrder, setSortOrder] = useState('asc')

  // Stats
  const [stats, setStats] = useState({
    pending: 0,
    completed: 0,
    dueSoon: 0,
    total: 0
  })

  useEffect(() => {
    fetchProfile()
    fetchSurveys()
    fetchApplications()
  }, [user])

  useEffect(() => {
    applyFilters()
    calculateStats()
  }, [surveys, searchTerm, statusFilter, priorityFilter, sortBy, sortOrder])

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

  const fetchSurveys = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('surveys')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setSurveys(data || [])
    } catch (error) {
      console.error('Error fetching surveys:', error.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('user_id', user.id)
        .order('company', { ascending: true })

      if (error) throw error
      setApplications(data || [])
    } catch (error) {
      console.error('Error fetching applications:', error.message)
    }
  }

  const calculateStats = () => {
    const pending = surveys.filter(s => s.status === 'Pending').length
    const completed = surveys.filter(s => s.status === 'Completed').length
    
    const now = new Date()
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)
    
    const dueSoon = surveys.filter(s => {
      if (!s.due_date || s.status === 'Completed' || s.status === 'Declined') return false
      const dueDate = new Date(s.due_date)
      return dueDate <= threeDaysFromNow && dueDate >= now
    }).length

    setStats({ pending, completed, dueSoon, total: surveys.length })
  }

  const applyFilters = () => {
    let filtered = [...surveys]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(survey =>
        survey.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (survey.position && survey.position.toLowerCase().includes(searchTerm.toLowerCase())) ||
        survey.survey_type.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== 'All') {
      filtered = filtered.filter(survey => survey.status === statusFilter)
    }

    // Priority filter
    if (priorityFilter !== 'All') {
      filtered = filtered.filter(survey => survey.priority === priorityFilter)
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue = a[sortBy]
      let bValue = b[sortBy]

      if (!aValue) return 1
      if (!bValue) return -1

      if (sortBy === 'due_date' || sortBy === 'requested_date' || sortBy === 'completed_date') {
        aValue = new Date(aValue)
        bValue = new Date(bValue)
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    setFilteredSurveys(filtered)
  }

  const handleAddSurvey = () => {
    setEditingSurvey(null)
    setShowForm(true)
  }

  const handleEditSurvey = (survey) => {
    setEditingSurvey(survey)
    setShowForm(true)
  }

  const handleDeleteSurvey = async (id) => {
    if (!confirm('Are you sure you want to delete this survey request?')) return

    try {
      const { error } = await supabase
        .from('surveys')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchSurveys()
    } catch (error) {
      console.error('Error deleting survey:', error.message)
      alert('Failed to delete survey')
    }
  }

  const handleQuickStatusUpdate = async (id, newStatus) => {
    try {
      const updateData = { 
        status: newStatus, 
        updated_at: new Date().toISOString() 
      }
      
      // If marking as completed, set completed_date
      if (newStatus === 'Completed') {
        updateData.completed_date = new Date().toISOString()
      }

      const { error } = await supabase
        .from('surveys')
        .update(updateData)
        .eq('id', id)

      if (error) throw error
      fetchSurveys()
    } catch (error) {
      console.error('Error updating status:', error.message)
      alert('Failed to update status')
    }
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingSurvey(null)
    fetchSurveys()
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const getDaysUntilDue = (dateString) => {
    if (!dateString) return null
    const now = new Date()
    const dueDate = new Date(dateString)
    const diff = dueDate - now
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
    
    if (days < 0) return { text: 'Overdue', color: 'text-red-600' }
    if (days === 0) return { text: 'Due today', color: 'text-red-600' }
    if (days === 1) return { text: 'Due tomorrow', color: 'text-orange-600' }
    if (days <= 3) return { text: `Due in ${days} days`, color: 'text-orange-600' }
    return { text: `Due in ${days} days`, color: 'text-gray-600' }
  }

  const getStatusCount = (status) => {
    if (status === 'All') return surveys.length
    return surveys.filter(s => s.status === status).length
  }

  const getPriorityCount = (priority) => {
    if (priority === 'All') return surveys.length
    return surveys.filter(s => s.priority === priority).length
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar user={user} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title="Survey Requests" 
          subtitle="Track and manage all survey and feedback requests"
          profile={profile}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="px-8 py-6">
            {/* Action Bar */}
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={handleAddSurvey}
                className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition shadow-sm flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Survey Request</span>
              </button>
            </div>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.pending}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Due Soon</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.dueSoon}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completed</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.completed}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
                  </div>
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Search */}
                <div className="md:col-span-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Search by company, position, or type..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                {/* Status Filter */}
                <div className="md:col-span-3">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  >
                    {SURVEY_STATUSES.map(status => (
                      <option key={status} value={status}>
                        {status} ({getStatusCount(status)})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Priority Filter */}
                <div className="md:col-span-2">
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  >
                    {PRIORITY_LEVELS.map(priority => (
                      <option key={priority} value={priority}>
                        {priority} ({getPriorityCount(priority)})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort By */}
                <div className="md:col-span-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  >
                    <option value="due_date">Due Date</option>
                    <option value="requested_date">Requested Date</option>
                    <option value="company">Company</option>
                    <option value="priority">Priority</option>
                    <option value="status">Status</option>
                  </select>
                </div>

                {/* Sort Order */}
                <div className="md:col-span-1">
                  <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center justify-center"
                    title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                  >
                    <svg className={`w-5 h-5 text-gray-600 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Results count */}
              <div className="mt-4 text-sm text-gray-600">
                Showing {filteredSurveys.length} of {surveys.length} surveys
              </div>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                <div className="text-gray-600 mt-4">Loading surveys...</div>
              </div>
            ) : filteredSurveys.length === 0 ? (
              /* Empty State */
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {surveys.length === 0 ? 'No survey requests yet' : 'No matching surveys'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {surveys.length === 0 
                    ? 'Add your first survey request to start tracking feedback opportunities'
                    : 'Try adjusting your search or filters'
                  }
                </p>
                {surveys.length === 0 && (
                  <button
                    onClick={handleAddSurvey}
                    className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Your First Survey
                  </button>
                )}
              </div>
            ) : (
              /* Survey List */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSurveys.map((survey) => {
                  const daysUntil = getDaysUntilDue(survey.due_date)
                  
                  return (
                    <div key={survey.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition">
                      {/* Card Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3 flex-1">
                          <div className="flex-shrink-0 h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <span className="text-indigo-600 font-bold text-lg">
                              {survey.company.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate">{survey.company}</h3>
                            {survey.position && (
                              <p className="text-sm text-gray-600 truncate">{survey.position}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Survey Type */}
                      <div className="mb-3">
                        <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                          {survey.survey_type}
                        </span>
                      </div>

                      {/* Status & Priority */}
                      <div className="flex gap-2 mb-4">
                        <select
                          value={survey.status}
                          onChange={(e) => handleQuickStatusUpdate(survey.id, e.target.value)}
                          className={`flex-1 px-3 py-1.5 text-xs font-semibold rounded-lg border cursor-pointer ${STATUS_COLORS[survey.status] || 'bg-gray-100 text-gray-800'}`}
                        >
                          {SURVEY_STATUSES.slice(1).map(status => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                        <span className={`px-3 py-1.5 text-xs font-semibold rounded-lg border ${PRIORITY_COLORS[survey.priority] || 'bg-gray-100 text-gray-800'}`}>
                          {survey.priority}
                        </span>
                      </div>

                      {/* Dates */}
                      <div className="space-y-2 mb-4">
                        {survey.due_date && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Due:</span>
                            <div className="text-right">
                              <div className="font-medium text-gray-900">{formatDate(survey.due_date)}</div>
                              {daysUntil && survey.status !== 'Completed' && (
                                <div className={`text-xs font-medium ${daysUntil.color}`}>{daysUntil.text}</div>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {survey.requested_date && (
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <span>Requested:</span>
                            <span>{formatDate(survey.requested_date)}</span>
                          </div>
                        )}

                        {survey.requester_name && (
                          <div className="flex items-center text-sm text-gray-600">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span className="truncate">{survey.requester_name}</span>
                          </div>
                        )}
                      </div>

                      {/* Survey URL */}
                      {survey.survey_url && (
                        <a
                          href={survey.survey_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full mb-3 px-3 py-2 text-sm text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition text-center font-medium"
                        >
                          Open Survey
                        </a>
                      )}

                      {/* Description */}
                      {survey.description && (
                        <div className="mb-4 pt-3 border-t border-gray-100">
                          <p className="text-xs text-gray-600 line-clamp-2">{survey.description}</p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 pt-4 border-t border-gray-100">
                        <button
                          onClick={() => handleEditSurvey(survey)}
                          className="flex-1 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition flex items-center justify-center"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteSurvey(survey.id)}
                          className="px-4 py-2 border border-red-300 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Survey Form Modal */}
      {showForm && (
        <SurveyForm
          survey={editingSurvey}
          onClose={handleFormClose}
          userId={user.id}
          applications={applications}
        />
      )}
    </div>
  )
}
