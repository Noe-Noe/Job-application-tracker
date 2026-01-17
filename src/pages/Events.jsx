import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import EventForm from '../components/EventForm'

const EVENT_TYPES = ['All', 'Career Fair', 'Networking Event', 'Application Deadline', 'Follow-up Reminder', 'Company Event', 'Offer Decision Deadline', 'Info Session', 'Workshop', 'Other']
const EVENT_STATUSES = ['All', 'Upcoming', 'Completed', 'Cancelled']

const STATUS_COLORS = {
  'Upcoming': 'bg-blue-100 text-blue-800 border-blue-200',
  'Completed': 'bg-green-100 text-green-800 border-green-200',
  'Cancelled': 'bg-gray-100 text-gray-800 border-gray-200',
}

const TYPE_ICONS = {
  'Career Fair': 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  'Networking Event': 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
  'Application Deadline': 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  'Follow-up Reminder': 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
  'Company Event': 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  'Offer Decision Deadline': 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  'Info Session': 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  'Workshop': 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
  'Other': 'M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z',
}

export default function Events() {
  const { user } = useAuth()
  const [events, setEvents] = useState([])
  const [applications, setApplications] = useState([])
  const [filteredEvents, setFilteredEvents] = useState([])
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [typeFilter, setTypeFilter] = useState('All')
  const [sortBy, setSortBy] = useState('event_date')
  const [sortOrder, setSortOrder] = useState('asc')

  // Stats
  const [stats, setStats] = useState({
    upcoming: 0,
    thisWeek: 0,
    completed: 0,
    thisMonth: 0
  })

  useEffect(() => {
    fetchProfile()
    fetchEvents()
    fetchApplications()
  }, [user])

  useEffect(() => {
    applyFilters()
    calculateStats()
  }, [events, searchTerm, statusFilter, typeFilter, sortBy, sortOrder])

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

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', user.id)
        .order('event_date', { ascending: true })

      if (error) throw error
      setEvents(data || [])
    } catch (error) {
      console.error('Error fetching events:', error.message)
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
    const oneMonthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
    
    const upcoming = events.filter(e => 
      e.status === 'Upcoming' && new Date(e.event_date) > now
    ).length
    
    const completed = events.filter(e => e.status === 'Completed').length
    
    const thisWeek = events.filter(e => {
      const date = new Date(e.event_date)
      return e.status === 'Upcoming' && date > now && date <= oneWeekFromNow
    }).length
    
    const thisMonth = events.filter(e => {
      const date = new Date(e.event_date)
      return e.status === 'Upcoming' && date > now && date <= oneMonthFromNow
    }).length

    setStats({ upcoming, thisWeek, completed, thisMonth })
  }

  const applyFilters = () => {
    let filtered = [...events]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.company && event.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (event.location && event.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Status filter
    if (statusFilter !== 'All') {
      filtered = filtered.filter(event => event.status === statusFilter)
    }

    // Type filter
    if (typeFilter !== 'All') {
      filtered = filtered.filter(event => event.event_type === typeFilter)
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue = a[sortBy]
      let bValue = b[sortBy]

      if (!aValue) return 1
      if (!bValue) return -1

      if (sortBy === 'event_date') {
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

    setFilteredEvents(filtered)
  }

  const handleAddEvent = () => {
    setEditingEvent(null)
    setShowForm(true)
  }

  const handleEditEvent = (event) => {
    setEditingEvent(event)
    setShowForm(true)
  }

  const handleDeleteEvent = async (id) => {
    if (!confirm('Are you sure you want to delete this event?')) return

    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchEvents()
    } catch (error) {
      console.error('Error deleting event:', error.message)
      alert('Failed to delete event')
    }
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingEvent(null)
    fetchEvents()
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
    if (status === 'All') return events.length
    return events.filter(e => e.status === status).length
  }

  const getTypeCount = (type) => {
    if (type === 'All') return events.length
    return events.filter(e => e.event_type === type).length
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar user={user} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title="Events" 
          subtitle="Track career fairs, networking events, deadlines, and reminders"
          profile={profile}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="px-8 py-6">
            {/* Action Bar */}
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={handleAddEvent}
                className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition shadow-sm flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Event</span>
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
                    <p className="text-sm font-medium text-gray-600">This Month</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.thisMonth}</p>
                  </div>
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
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
                      placeholder="Search events..."
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
                    {EVENT_STATUSES.map(status => (
                      <option key={status} value={status}>
                        {status} ({getStatusCount(status)})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Type Filter */}
                <div className="md:col-span-3">
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  >
                    {EVENT_TYPES.map(type => (
                      <option key={type} value={type}>
                        {type} {type === 'All' ? `(${events.length})` : `(${getTypeCount(type)})`}
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
                    <option value="event_date">Date</option>
                    <option value="title">Title</option>
                    <option value="event_type">Type</option>
                  </select>
                </div>

                {/* Sort Order */}
                <div className="md:col-span-1">
                  <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    title={sortOrder === 'asc' ? 'Sort Ascending' : 'Sort Descending'}
                  >
                    <svg className={`w-5 h-5 mx-auto transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Results count */}
              <div className="mt-4 text-sm text-gray-600">
                Showing {filteredEvents.length} of {events.length} events
              </div>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                <div className="text-gray-600 mt-4">Loading events...</div>
              </div>
            ) : filteredEvents.length === 0 ? (
              /* Empty State */
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {events.length === 0 ? 'No events yet' : 'No matching events'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {events.length === 0 
                    ? 'Add your first event to start tracking career fairs, deadlines, and reminders'
                    : 'Try adjusting your search or filters'
                  }
                </p>
                {events.length === 0 && (
                  <button
                    onClick={handleAddEvent}
                    className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Your First Event
                  </button>
                )}
              </div>
            ) : (
              /* Event List */
              <div className="space-y-4">
                {filteredEvents.map((event) => (
                  <div key={event.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition">
                    <div className="flex items-start justify-between">
                      {/* Left Side - Event Details */}
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="flex-shrink-0 h-14 w-14 bg-indigo-100 rounded-lg flex items-center justify-center">
                          <svg className="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={TYPE_ICONS[event.event_type] || TYPE_ICONS['Other']} />
                          </svg>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-sm text-gray-600">{event.event_type}</span>
                                {event.company && (
                                  <>
                                    <span className="text-gray-300">•</span>
                                    <span className="text-sm text-gray-600">{event.company}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                            {/* Date & Time */}
                            <div className="flex items-center text-sm text-gray-600">
                              <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <div>
                                <div className="font-medium">
                                  {event.is_all_day ? formatDate(event.event_date) : formatDateTime(event.event_date)}
                                </div>
                                {event.status === 'Upcoming' && !isPast(event.event_date) && (
                                  <div className="text-xs text-indigo-600 font-medium">{getTimeUntil(event.event_date)}</div>
                                )}
                              </div>
                            </div>

                            {/* Location/Link */}
                            {(event.location || event.event_link) && (
                              <div className="flex items-center text-sm text-gray-600">
                                <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {event.event_link ? (
                                  <a href={event.event_link} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 truncate">
                                    View Event
                                  </a>
                                ) : (
                                  <span className="truncate">{event.location}</span>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Description */}
                          {event.description && (
                            <p className="text-sm text-gray-600 mt-3 line-clamp-2">{event.description}</p>
                          )}

                          {/* Tags Row */}
                          <div className="flex flex-wrap items-center gap-2 mt-4">
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${STATUS_COLORS[event.status] || 'bg-gray-100 text-gray-800'}`}>
                              {event.status}
                            </span>
                            
                            {event.is_all_day && (
                              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                                All Day
                              </span>
                            )}
                          </div>

                          {/* Outcome/Notes */}
                          {event.status === 'Completed' && event.outcome && (
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              <div className="text-xs text-gray-600">
                                <span className="font-medium">Outcome: </span>
                                <span className="line-clamp-1">{event.outcome}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right Side - Actions */}
                      <div className="flex flex-col gap-2 ml-4">
                        <button
                          onClick={() => handleEditEvent(event)}
                          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition flex items-center"
                          title="Edit"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
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

      {/* Event Form Modal */}
      {showForm && (
        <EventForm
          event={editingEvent}
          onClose={handleFormClose}
          userId={user.id}
          applications={applications}
        />
      )}
    </div>
  )
}
