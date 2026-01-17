import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import InterviewForm from '../components/InterviewForm'

const INTERVIEW_STATUSES = ['All', 'Scheduled', 'Completed', 'Cancelled', 'Rescheduled']
const INTERVIEW_TYPES = ['All', 'Phone Screen', 'Video Call', 'On-site', 'Technical Interview', 'Behavioral Interview', 'Panel Interview', 'Case Study', 'Take-home Assignment', 'Final Round', 'HR Interview', 'Meet the Team', 'Other']

const STATUS_COLORS = {
  'Scheduled': 'bg-blue-100 text-blue-800 border-blue-200',
  'Completed': 'bg-green-100 text-green-800 border-green-200',
  'Cancelled': 'bg-red-100 text-red-800 border-red-200',
  'Rescheduled': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'No Show': 'bg-gray-100 text-gray-800 border-gray-200',
}

const OUTCOME_COLORS = {
  'Passed - Moving Forward': 'bg-emerald-100 text-emerald-800',
  'Passed - Waiting for Next Steps': 'bg-cyan-100 text-cyan-800',
  'Rejected': 'bg-red-100 text-red-800',
  'Pending Feedback': 'bg-yellow-100 text-yellow-800',
  'Offer Extended': 'bg-green-100 text-green-800',
  'Withdrew': 'bg-gray-100 text-gray-800',
}

export default function Interviews() {
  const { user } = useAuth()
  const [interviews, setInterviews] = useState([])
  const [applications, setApplications] = useState([])
  const [filteredInterviews, setFilteredInterviews] = useState([])
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingInterview, setEditingInterview] = useState(null)
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [typeFilter, setTypeFilter] = useState('All')
  const [sortBy, setSortBy] = useState('interview_date')
  const [sortOrder, setSortOrder] = useState('asc')
  const [viewMode, setViewMode] = useState('list') // 'list' or 'calendar'

  // Stats
  const [stats, setStats] = useState({
    upcoming: 0,
    completed: 0,
    thisWeek: 0,
    avgRating: 0
  })

  useEffect(() => {
    fetchProfile()
    fetchInterviews()
    fetchApplications()
  }, [user])

  useEffect(() => {
    applyFilters()
    calculateStats()
  }, [interviews, searchTerm, statusFilter, typeFilter, sortBy, sortOrder])

  const fetchProfile = async () => {
    try {
      const { data, error} = await supabase
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

  const fetchInterviews = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('interviews')
        .select('*')
        .eq('user_id', user.id)
        .order('interview_date', { ascending: true })

      if (error) throw error
      setInterviews(data || [])
    } catch (error) {
      console.error('Error fetching interviews:', error.message)
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
    const now = new Date()
    const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    
    const upcoming = interviews.filter(i => 
      i.status === 'Scheduled' && new Date(i.interview_date) > now
    ).length
    
    const completed = interviews.filter(i => i.status === 'Completed').length
    
    const thisWeek = interviews.filter(i => {
      const date = new Date(i.interview_date)
      return i.status === 'Scheduled' && date > now && date <= oneWeekFromNow
    }).length
    
    const completedWithRatings = interviews.filter(i => i.rating)
    const avgRating = completedWithRatings.length > 0
      ? (completedWithRatings.reduce((sum, i) => sum + i.rating, 0) / completedWithRatings.length).toFixed(1)
      : 0

    setStats({ upcoming, completed, thisWeek, avgRating })
  }

  const applyFilters = () => {
    let filtered = [...interviews]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(int =>
        int.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        int.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (int.interviewer_name && int.interviewer_name.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Status filter
    if (statusFilter !== 'All') {
      filtered = filtered.filter(int => int.status === statusFilter)
    }

    // Type filter
    if (typeFilter !== 'All') {
      filtered = filtered.filter(int => int.interview_type === typeFilter)
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue = a[sortBy]
      let bValue = b[sortBy]

      if (!aValue) return 1
      if (!bValue) return -1

      if (sortBy === 'interview_date') {
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

    setFilteredInterviews(filtered)
  }

  const handleAddInterview = () => {
    setEditingInterview(null)
    setShowForm(true)
  }

  const handleEditInterview = (interview) => {
    setEditingInterview(interview)
    setShowForm(true)
  }

  const handleDeleteInterview = async (id) => {
    if (!confirm('Are you sure you want to delete this interview?')) return

    try {
      const { error } = await supabase
        .from('interviews')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchInterviews()
    } catch (error) {
      console.error('Error deleting interview:', error.message)
      alert('Failed to delete interview')
    }
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingInterview(null)
    fetchInterviews()
  }

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleString('en-US', { 
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getTimeUntil = (dateString) => {
    const now = new Date()
    const date = new Date(dateString)
    const diff = date - now
    
    if (diff < 0) return 'Past'
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    
    if (days > 0) return `In ${days} day${days > 1 ? 's' : ''}`
    if (hours > 0) return `In ${hours} hour${hours > 1 ? 's' : ''}`
    return 'Soon'
  }

  const isPast = (dateString) => {
    return new Date(dateString) < new Date()
  }

  const getStatusCount = (status) => {
    if (status === 'All') return interviews.length
    return interviews.filter(int => int.status === status).length
  }

  const getTypeCount = (type) => {
    if (type === 'All') return interviews.length
    return interviews.filter(int => int.interview_type === type).length
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar user={user} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title="Interviews" 
          subtitle="Track and manage all your interviews"
          profile={profile}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="px-8 py-6">
            {/* Action Bar */}
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={handleAddInterview}
                className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition shadow-sm flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Schedule Interview</span>
              </button>
            </div>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Upcoming</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.upcoming}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">This Week</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.thisWeek}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
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
                    <p className="text-sm font-medium text-gray-600">Avg. Rating</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.avgRating || 'N/A'}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
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
                      placeholder="Search by company, position, or interviewer..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                {/* Status Filter */}
                <div className="md:col-span-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  >
                    {INTERVIEW_STATUSES.map(status => (
                      <option key={status} value={status}>
                        {status} ({getStatusCount(status)})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Type Filter */}
                <div className="md:col-span-2">
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  >
                    <option value="All">All Types ({interviews.length})</option>
                    {INTERVIEW_TYPES.slice(1).map(type => (
                      <option key={type} value={type}>
                        {type} ({getTypeCount(type)})
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
                    <option value="interview_date">Date</option>
                    <option value="company">Company</option>
                    <option value="status">Status</option>
                    <option value="interview_type">Type</option>
                  </select>
                </div>

                {/* Sort Order */}
                <div className="md:col-span-2">
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  >
                    <option value="asc">Earliest First</option>
                    <option value="desc">Latest First</option>
                  </select>
                </div>
              </div>

              {/* Results count */}
              <div className="mt-4 text-sm text-gray-600">
                Showing {filteredInterviews.length} of {interviews.length} interviews
              </div>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                <div className="text-gray-600 mt-4">Loading interviews...</div>
              </div>
            ) : filteredInterviews.length === 0 ? (
              /* Empty State */
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {interviews.length === 0 ? 'No interviews scheduled yet' : 'No matching interviews'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {interviews.length === 0 
                    ? 'Schedule your first interview to start tracking your progress'
                    : 'Try adjusting your search or filters'
                  }
                </p>
                {interviews.length === 0 && (
                  <button
                    onClick={handleAddInterview}
                    className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Schedule Your First Interview
                  </button>
                )}
              </div>
            ) : (
              /* Interview List */
              <div className="space-y-4">
                {filteredInterviews.map((interview) => (
                  <div key={interview.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition">
                    <div className="flex items-start justify-between">
                      {/* Left Side - Company & Details */}
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="flex-shrink-0 h-14 w-14 bg-indigo-100 rounded-lg flex items-center justify-center">
                          <span className="text-indigo-600 font-bold text-xl">
                            {interview.company.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{interview.company}</h3>
                              <p className="text-sm text-gray-600">{interview.position}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                            {/* Date & Time */}
                            <div className="flex items-center text-sm text-gray-600">
                              <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <div>
                                <div className="font-medium">{formatDateTime(interview.interview_date)}</div>
                                {interview.status === 'Scheduled' && !isPast(interview.interview_date) && (
                                  <div className="text-xs text-indigo-600 font-medium">{getTimeUntil(interview.interview_date)}</div>
                                )}
                              </div>
                            </div>

                            {/* Type & Round */}
                            <div className="flex items-center text-sm text-gray-600">
                              <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                              </svg>
                              <span>{interview.interview_type} - Round {interview.round_number}</span>
                            </div>

                            {/* Location/Link */}
                            {(interview.location || interview.meeting_link) && (
                              <div className="flex items-center text-sm text-gray-600">
                                <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {interview.meeting_link ? (
                                  <a href={interview.meeting_link} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800">
                                    Join Meeting
                                  </a>
                                ) : (
                                  <span>{interview.location}</span>
                                )}
                              </div>
                            )}

                            {/* Interviewer */}
                            {interview.interviewer_name && (
                              <div className="flex items-center text-sm text-gray-600">
                                <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span>
                                  {interview.interviewer_name}
                                  {interview.interviewer_title && ` - ${interview.interviewer_title}`}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Tags Row */}
                          <div className="flex flex-wrap items-center gap-2 mt-4">
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${STATUS_COLORS[interview.status] || 'bg-gray-100 text-gray-800'}`}>
                              {interview.status}
                            </span>
                            
                            {interview.outcome && (
                              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${OUTCOME_COLORS[interview.outcome] || 'bg-gray-100 text-gray-800'}`}>
                                {interview.outcome}
                              </span>
                            )}
                            
                            {interview.rating && (
                              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                {'⭐'.repeat(interview.rating)} ({interview.rating}/5)
                              </span>
                            )}
                            
                            {interview.follow_up_sent && (
                              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                ✓ Follow-up Sent
                              </span>
                            )}
                          </div>

                          {/* Notes Preview */}
                          {(interview.preparation_notes || interview.post_interview_notes) && (
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              {interview.preparation_notes && interview.status === 'Scheduled' && (
                                <div className="text-xs text-gray-600">
                                  <span className="font-medium">Prep Notes: </span>
                                  <span className="line-clamp-1">{interview.preparation_notes}</span>
                                </div>
                              )}
                              {interview.post_interview_notes && interview.status === 'Completed' && (
                                <div className="text-xs text-gray-600">
                                  <span className="font-medium">Notes: </span>
                                  <span className="line-clamp-1">{interview.post_interview_notes}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right Side - Actions */}
                      <div className="flex flex-col gap-2 ml-4">
                        <button
                          onClick={() => handleEditInterview(interview)}
                          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition flex items-center"
                          title="Edit"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteInterview(interview.id)}
                          className="px-4 py-2 border border-red-300 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition"
                          title="Delete"
                        >
                          <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Interview Form Modal */}
      {showForm && (
        <InterviewForm
          interview={editingInterview}
          onClose={handleFormClose}
          userId={user.id}
          applications={applications}
        />
      )}
    </div>
  )
}
