import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import ResumeForm from '../components/ResumeForm'

const RESUME_TYPES = ['All', 'General', 'Technical', 'Creative', 'Executive', 'Academic', 'Industry-Specific', 'Other']
const FILE_FORMATS = ['PDF', 'DOCX', 'TXT', 'Other']

export default function Resume() {
  const { user } = useAuth()
  const [resumes, setResumes] = useState([])
  const [filteredResumes, setFilteredResumes] = useState([])
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingResume, setEditingResume] = useState(null)
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState('desc')
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    default: 0,
    recent: 0
  })

  useEffect(() => {
    fetchProfile()
    fetchResumes()
  }, [user])

  useEffect(() => {
    applyFilters()
    calculateStats()
  }, [resumes, searchTerm, typeFilter, sortBy, sortOrder])

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

  const fetchResumes = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setResumes(data || [])
    } catch (error) {
      console.error('Error fetching resumes:', error.message)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = () => {
    const total = resumes.length
    const defaultResume = resumes.filter(r => r.is_default).length
    
    // Resumes created in last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const recent = resumes.filter(r => new Date(r.created_at) > thirtyDaysAgo).length

    setStats({ total, default: defaultResume, recent })
  }

  const applyFilters = () => {
    let filtered = [...resumes]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(resume =>
        resume.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (resume.description && resume.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (resume.tags && resume.tags.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Type filter
    if (typeFilter !== 'All') {
      filtered = filtered.filter(resume => resume.resume_type === typeFilter)
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue = a[sortBy]
      let bValue = b[sortBy]

      if (!aValue) return 1
      if (!bValue) return -1

      if (sortBy === 'created_at' || sortBy === 'updated_at') {
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

    setFilteredResumes(filtered)
  }

  const handleAddResume = () => {
    setEditingResume(null)
    setShowForm(true)
  }

  const handleEditResume = (resume) => {
    setEditingResume(resume)
    setShowForm(true)
  }

  const handleDeleteResume = async (id) => {
    if (!confirm('Are you sure you want to delete this resume?')) return

    try {
      const { error } = await supabase
        .from('resumes')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchResumes()
    } catch (error) {
      console.error('Error deleting resume:', error.message)
      alert('Failed to delete resume')
    }
  }

  const handleSetDefault = async (id) => {
    try {
      // First, unset all defaults
      const { error: unsetError } = await supabase
        .from('resumes')
        .update({ is_default: false })
        .eq('user_id', user.id)

      if (unsetError) throw unsetError

      // Then set the new default
      const { error: setError } = await supabase
        .from('resumes')
        .update({ is_default: true, updated_at: new Date().toISOString() })
        .eq('id', id)

      if (setError) throw setError
      fetchResumes()
    } catch (error) {
      console.error('Error setting default resume:', error.message)
      alert('Failed to set default resume')
    }
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingResume(null)
    fetchResumes()
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

  const getTypeCount = (type) => {
    if (type === 'All') return resumes.length
    return resumes.filter(r => r.resume_type === type).length
  }

  const getFileIcon = (format) => {
    switch(format) {
      case 'PDF':
        return (
          <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
        )
      case 'DOCX':
        return (
          <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
          </svg>
        )
      default:
        return (
          <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
          </svg>
        )
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar user={user} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title="Saved Resumes" 
          subtitle="Manage and organize all your resume versions"
          profile={profile}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="px-8 py-6">
            {/* Action Bar */}
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={handleAddResume}
                className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition shadow-sm flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Resume</span>
              </button>
            </div>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Resumes</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
                  </div>
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Default Resume</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.default}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Recent (30 days)</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.recent}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
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
                      placeholder="Search by title, description, or tags..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                {/* Type Filter */}
                <div className="md:col-span-3">
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  >
                    {RESUME_TYPES.map(type => (
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
                    <option value="created_at">Date Created</option>
                    <option value="updated_at">Last Updated</option>
                    <option value="title">Title</option>
                    <option value="resume_type">Type</option>
                  </select>
                </div>

                {/* Sort Order */}
                <div className="md:col-span-2">
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  >
                    <option value="desc">Newest First</option>
                    <option value="asc">Oldest First</option>
                  </select>
                </div>

                {/* View Mode Toggle */}
                <div className="md:col-span-1 flex items-center justify-end space-x-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition ${
                      viewMode === 'grid' 
                        ? 'bg-indigo-100 text-indigo-600' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    title="Grid View"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition ${
                      viewMode === 'list' 
                        ? 'bg-indigo-100 text-indigo-600' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    title="List View"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Results count */}
              <div className="mt-4 text-sm text-gray-600">
                Showing {filteredResumes.length} of {resumes.length} resumes
              </div>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                <div className="text-gray-600 mt-4">Loading resumes...</div>
              </div>
            ) : filteredResumes.length === 0 ? (
              /* Empty State */
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {resumes.length === 0 ? 'No resumes saved yet' : 'No matching resumes'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {resumes.length === 0 
                    ? 'Get started by adding your first resume'
                    : 'Try adjusting your search or filters'
                  }
                </p>
                {resumes.length === 0 && (
                  <button
                    onClick={handleAddResume}
                    className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Your First Resume
                  </button>
                )}
              </div>
            ) : viewMode === 'grid' ? (
              /* Grid View */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResumes.map((resume) => (
                  <div key={resume.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition relative">
                    {/* Default Badge */}
                    {resume.is_default && (
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Default
                        </span>
                      </div>
                    )}

                    {/* File Icon */}
                    <div className="flex justify-center mb-4">
                      {getFileIcon(resume.file_format)}
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                      {resume.title}
                    </h3>

                    {/* Type Badge */}
                    <div className="flex justify-center mb-3">
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800">
                        {resume.resume_type}
                      </span>
                    </div>

                    {/* Description */}
                    {resume.description && (
                      <p className="text-sm text-gray-600 text-center mb-4 line-clamp-2">
                        {resume.description}
                      </p>
                    )}

                    {/* Tags */}
                    {resume.tags && (
                      <div className="flex flex-wrap justify-center gap-2 mb-4">
                        {resume.tags.split(',').map((tag, idx) => (
                          <span key={idx} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Meta Info */}
                    <div className="text-xs text-gray-500 text-center mb-4 space-y-1">
                      <div>Created: {formatDate(resume.created_at)}</div>
                      <div>Updated: {formatDate(resume.updated_at)}</div>
                      {resume.file_format && (
                        <div className="font-medium text-gray-700">Format: {resume.file_format}</div>
                      )}
                    </div>

                    {/* File Link */}
                    {resume.file_url && (
                      <a
                        href={resume.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full mb-3 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition text-center flex items-center justify-center"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        View/Download
                      </a>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-4 border-t border-gray-100">
                      {!resume.is_default && (
                        <button
                          onClick={() => handleSetDefault(resume.id)}
                          className="flex-1 px-4 py-2 bg-green-50 text-green-600 text-sm font-medium rounded-lg hover:bg-green-100 transition"
                          title="Set as Default"
                        >
                          Set Default
                        </button>
                      )}
                      <button
                        onClick={() => handleEditResume(resume)}
                        className="flex-1 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition flex items-center justify-center"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteResume(resume.id)}
                        className="px-4 py-2 border border-red-300 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* List View */
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Format
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Last Updated
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredResumes.map((resume) => (
                        <tr key={resume.id} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="flex-shrink-0">
                                {getFileIcon(resume.file_format)}
                              </div>
                              <div className="ml-4">
                                <div className="font-medium text-gray-900">{resume.title}</div>
                                {resume.description && (
                                  <div className="text-sm text-gray-500 line-clamp-1">{resume.description}</div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-3 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800">
                              {resume.resume_type}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {resume.file_format || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(resume.updated_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {resume.is_default ? (
                              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                Default
                              </span>
                            ) : (
                              <span className="text-sm text-gray-500">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-3">
                              {resume.file_url && (
                                <a
                                  href={resume.file_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-gray-600 hover:text-gray-900 transition"
                                  title="View/Download"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                </a>
                              )}
                              {!resume.is_default && (
                                <button
                                  onClick={() => handleSetDefault(resume.id)}
                                  className="text-green-600 hover:text-green-900 transition"
                                  title="Set as Default"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                </button>
                              )}
                              <button
                                onClick={() => handleEditResume(resume)}
                                className="text-indigo-600 hover:text-indigo-900 transition"
                                title="Edit"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDeleteResume(resume.id)}
                                className="text-red-600 hover:text-red-900 transition"
                                title="Delete"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Resume Form Modal */}
      {showForm && (
        <ResumeForm
          resume={editingResume}
          onClose={handleFormClose}
          userId={user.id}
        />
      )}
    </div>
  )
}
