import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const INTERVIEW_TYPES = [
  'Phone Screen',
  'Video Call',
  'On-site',
  'Technical Interview',
  'Behavioral Interview',
  'Panel Interview',
  'Case Study',
  'Take-home Assignment',
  'Final Round',
  'HR Interview',
  'Meet the Team',
  'Other'
]

const INTERVIEW_STATUSES = [
  'Scheduled',
  'Completed',
  'Cancelled',
  'Rescheduled',
  'No Show'
]

const OUTCOME_OPTIONS = [
  'Passed - Moving Forward',
  'Passed - Waiting for Next Steps',
  'Rejected',
  'Pending Feedback',
  'Offer Extended',
  'Withdrew'
]

export default function InterviewForm({ interview, onClose, userId, applications = [] }) {
  const [formData, setFormData] = useState({
    application_id: '',
    company: '',
    position: '',
    interview_type: 'Phone Screen',
    interview_date: '',
    duration_minutes: 60,
    location: '',
    meeting_link: '',
    interviewer_name: '',
    interviewer_title: '',
    interviewer_email: '',
    interviewer_linkedin: '',
    round_number: 1,
    status: 'Scheduled',
    preparation_notes: '',
    questions_to_ask: '',
    post_interview_notes: '',
    outcome: '',
    rating: null,
    follow_up_sent: false,
    follow_up_date: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedApp, setSelectedApp] = useState(null)

  useEffect(() => {
    if (interview) {
      setFormData({
        application_id: interview.application_id || '',
        company: interview.company || '',
        position: interview.position || '',
        interview_type: interview.interview_type || 'Phone Screen',
        interview_date: interview.interview_date 
          ? new Date(interview.interview_date).toISOString().slice(0, 16)
          : '',
        duration_minutes: interview.duration_minutes || 60,
        location: interview.location || '',
        meeting_link: interview.meeting_link || '',
        interviewer_name: interview.interviewer_name || '',
        interviewer_title: interview.interviewer_title || '',
        interviewer_email: interview.interviewer_email || '',
        interviewer_linkedin: interview.interviewer_linkedin || '',
        round_number: interview.round_number || 1,
        status: interview.status || 'Scheduled',
        preparation_notes: interview.preparation_notes || '',
        questions_to_ask: interview.questions_to_ask || '',
        post_interview_notes: interview.post_interview_notes || '',
        outcome: interview.outcome || '',
        rating: interview.rating || null,
        follow_up_sent: interview.follow_up_sent || false,
        follow_up_date: interview.follow_up_date 
          ? new Date(interview.follow_up_date).toISOString().split('T')[0]
          : '',
      })
    }
  }, [interview])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleApplicationSelect = (e) => {
    const appId = e.target.value
    setFormData({ ...formData, application_id: appId })
    
    if (appId) {
      const app = applications.find(a => a.id === appId)
      if (app) {
        setSelectedApp(app)
        setFormData(prev => ({
          ...prev,
          application_id: appId,
          company: app.company,
          position: app.position
        }))
      }
    } else {
      setSelectedApp(null)
      setFormData(prev => ({
        ...prev,
        company: '',
        position: ''
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.company || !formData.position || !formData.interview_date) {
      setError('Company, Position, and Interview Date are required')
      return
    }

    try {
      setLoading(true)
      setError('')

      const dataToSave = {
        ...formData,
        user_id: userId,
        interview_date: new Date(formData.interview_date).toISOString(),
        follow_up_date: formData.follow_up_date 
          ? new Date(formData.follow_up_date).toISOString() 
          : null,
        rating: formData.rating ? parseInt(formData.rating) : null,
        updated_at: new Date().toISOString(),
      }

      // Remove empty optional fields
      if (!dataToSave.application_id) delete dataToSave.application_id
      if (!dataToSave.location) delete dataToSave.location
      if (!dataToSave.meeting_link) delete dataToSave.meeting_link
      if (!dataToSave.interviewer_name) delete dataToSave.interviewer_name
      if (!dataToSave.interviewer_title) delete dataToSave.interviewer_title
      if (!dataToSave.interviewer_email) delete dataToSave.interviewer_email
      if (!dataToSave.interviewer_linkedin) delete dataToSave.interviewer_linkedin
      if (!dataToSave.preparation_notes) delete dataToSave.preparation_notes
      if (!dataToSave.questions_to_ask) delete dataToSave.questions_to_ask
      if (!dataToSave.post_interview_notes) delete dataToSave.post_interview_notes
      if (!dataToSave.outcome) delete dataToSave.outcome
      if (!dataToSave.follow_up_date) delete dataToSave.follow_up_date

      let result
      if (interview) {
        // Update existing
        result = await supabase
          .from('interviews')
          .update(dataToSave)
          .eq('id', interview.id)
      } else {
        // Create new
        result = await supabase
          .from('interviews')
          .insert([dataToSave])
      }

      if (result.error) throw result.error

      onClose()
    } catch (err) {
      console.error('Error saving interview:', err)
      setError(err.message || 'Failed to save interview')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-900">
            {interview ? 'Edit Interview' : 'Schedule Interview'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h3>
            
            {/* Link to Application */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Link to Job Application (Optional)
              </label>
              <select
                value={formData.application_id}
                onChange={handleApplicationSelect}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              >
                <option value="">Select an application (or enter manually below)</option>
                {applications.map(app => (
                  <option key={app.id} value={app.id}>
                    {app.company} - {app.position}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  disabled={!!formData.application_id}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none disabled:bg-gray-100"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Position <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  disabled={!!formData.application_id}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none disabled:bg-gray-100"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interview Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="interview_type"
                  value={formData.interview_type}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  required
                >
                  {INTERVIEW_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Round Number
                </label>
                <input
                  type="number"
                  name="round_number"
                  value={formData.round_number}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                >
                  {INTERVIEW_STATUSES.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Schedule Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Schedule Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interview Date & Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  name="interview_date"
                  value={formData.interview_date}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  name="duration_minutes"
                  value={formData.duration_minutes}
                  onChange={handleChange}
                  min="15"
                  step="15"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  placeholder="e.g., 123 Main St, Office, Remote"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meeting Link
                </label>
                <input
                  type="url"
                  name="meeting_link"
                  value={formData.meeting_link}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  placeholder="Zoom, Google Meet, etc."
                />
              </div>
            </div>
          </div>

          {/* Interviewer Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Interviewer Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interviewer Name
                </label>
                <input
                  type="text"
                  name="interviewer_name"
                  value={formData.interviewer_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interviewer Title
                </label>
                <input
                  type="text"
                  name="interviewer_title"
                  value={formData.interviewer_title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  placeholder="e.g., Senior Engineer, Hiring Manager"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interviewer Email
                </label>
                <input
                  type="email"
                  name="interviewer_email"
                  value={formData.interviewer_email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LinkedIn Profile
                </label>
                <input
                  type="url"
                  name="interviewer_linkedin"
                  value={formData.interviewer_linkedin}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  placeholder="https://linkedin.com/in/..."
                />
              </div>
            </div>
          </div>

          {/* Preparation */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Preparation</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preparation Notes
              </label>
              <textarea
                name="preparation_notes"
                value={formData.preparation_notes}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                placeholder="Topics to review, common questions to prepare for, company research notes..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Questions to Ask
              </label>
              <textarea
                name="questions_to_ask"
                value={formData.questions_to_ask}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                placeholder="List questions you want to ask the interviewer..."
              />
            </div>
          </div>

          {/* Post-Interview */}
          {(formData.status === 'Completed' || interview) && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Post-Interview</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Post-Interview Notes
                </label>
                <textarea
                  name="post_interview_notes"
                  value={formData.post_interview_notes}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                  placeholder="How did it go? What was discussed? What went well or could be improved?"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Outcome
                  </label>
                  <select
                    name="outcome"
                    value={formData.outcome}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  >
                    <option value="">Select outcome...</option>
                    {OUTCOME_OPTIONS.map(outcome => (
                      <option key={outcome} value={outcome}>{outcome}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Self-Rating (1-5)
                  </label>
                  <select
                    name="rating"
                    value={formData.rating || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  >
                    <option value="">Not rated</option>
                    <option value="1">⭐ 1 - Poor</option>
                    <option value="2">⭐⭐ 2 - Below Average</option>
                    <option value="3">⭐⭐⭐ 3 - Average</option>
                    <option value="4">⭐⭐⭐⭐ 4 - Good</option>
                    <option value="5">⭐⭐⭐⭐⭐ 5 - Excellent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="follow_up_sent"
                    checked={formData.follow_up_sent}
                    onChange={handleChange}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label className="ml-2 text-sm font-medium text-gray-700">
                    Thank you email sent
                  </label>
                </div>

                {formData.follow_up_sent && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Follow-up Date
                    </label>
                    <input
                      type="date"
                      name="follow_up_date"
                      value={formData.follow_up_date}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : (interview ? 'Update Interview' : 'Schedule Interview')}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
