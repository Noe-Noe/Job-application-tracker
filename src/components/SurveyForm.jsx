import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const SURVEY_TYPES = [
  'Post-Interview Feedback',
  'Candidate Experience',
  'Compensation Survey',
  'Company Culture',
  'Glassdoor Review',
  'Indeed Review',
  'LinkedIn Review',
  'Referral Program',
  'Exit Survey',
  'Market Research',
  'Other'
]

const SURVEY_STATUSES = [
  'Pending',
  'In Progress',
  'Completed',
  'Declined',
  'Expired'
]

const PRIORITY_LEVELS = [
  'Low',
  'Medium',
  'High',
  'Urgent'
]

const PRIORITY_COLORS = {
  'Low': 'bg-gray-100 text-gray-800',
  'Medium': 'bg-blue-100 text-blue-800',
  'High': 'bg-orange-100 text-orange-800',
  'Urgent': 'bg-red-100 text-red-800'
}

export default function SurveyForm({ survey, onClose, userId, applications = [] }) {
  const [formData, setFormData] = useState({
    application_id: '',
    company: '',
    position: '',
    survey_type: 'Post-Interview Feedback',
    survey_url: '',
    status: 'Pending',
    priority: 'Medium',
    due_date: '',
    requested_date: '',
    completed_date: '',
    requester_name: '',
    requester_email: '',
    description: '',
    notes: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (survey) {
      setFormData({
        application_id: survey.application_id || '',
        company: survey.company || '',
        position: survey.position || '',
        survey_type: survey.survey_type || 'Post-Interview Feedback',
        survey_url: survey.survey_url || '',
        status: survey.status || 'Pending',
        priority: survey.priority || 'Medium',
        due_date: survey.due_date 
          ? new Date(survey.due_date).toISOString().split('T')[0]
          : '',
        requested_date: survey.requested_date 
          ? new Date(survey.requested_date).toISOString().split('T')[0]
          : '',
        completed_date: survey.completed_date 
          ? new Date(survey.completed_date).toISOString().split('T')[0]
          : '',
        requester_name: survey.requester_name || '',
        requester_email: survey.requester_email || '',
        description: survey.description || '',
        notes: survey.notes || '',
      })
    }
  }, [survey])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleApplicationSelect = (e) => {
    const appId = e.target.value
    setFormData({ ...formData, application_id: appId })
    
    if (appId) {
      const app = applications.find(a => a.id === appId)
      if (app) {
        setFormData(prev => ({
          ...prev,
          application_id: appId,
          company: app.company,
          position: app.position
        }))
      }
    } else {
      setFormData(prev => ({
        ...prev,
        company: '',
        position: ''
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.company || !formData.survey_type) {
      setError('Company and Survey Type are required')
      return
    }

    try {
      setLoading(true)
      setError('')

      const dataToSave = {
        ...formData,
        user_id: userId,
        due_date: formData.due_date 
          ? new Date(formData.due_date).toISOString() 
          : null,
        requested_date: formData.requested_date 
          ? new Date(formData.requested_date).toISOString() 
          : null,
        completed_date: formData.completed_date 
          ? new Date(formData.completed_date).toISOString() 
          : null,
        updated_at: new Date().toISOString(),
      }

      // Remove empty optional fields
      if (!dataToSave.application_id) delete dataToSave.application_id
      if (!dataToSave.position) delete dataToSave.position
      if (!dataToSave.survey_url) delete dataToSave.survey_url
      if (!dataToSave.due_date) delete dataToSave.due_date
      if (!dataToSave.requested_date) delete dataToSave.requested_date
      if (!dataToSave.completed_date) delete dataToSave.completed_date
      if (!dataToSave.requester_name) delete dataToSave.requester_name
      if (!dataToSave.requester_email) delete dataToSave.requester_email
      if (!dataToSave.description) delete dataToSave.description
      if (!dataToSave.notes) delete dataToSave.notes

      let result
      if (survey) {
        // Update existing
        result = await supabase
          .from('surveys')
          .update(dataToSave)
          .eq('id', survey.id)
      } else {
        // Create new
        result = await supabase
          .from('surveys')
          .insert([dataToSave])
      }

      if (result.error) throw result.error

      onClose()
    } catch (err) {
      console.error('Error saving survey:', err)
      setError(err.message || 'Failed to save survey')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-900">
            {survey ? 'Edit Survey Request' : 'Add Survey Request'}
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
                  Position
                </label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  disabled={!!formData.application_id}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none disabled:bg-gray-100"
                />
              </div>
            </div>
          </div>

          {/* Survey Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Survey Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Survey Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="survey_type"
                  value={formData.survey_type}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  required
                >
                  {SURVEY_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                >
                  {PRIORITY_LEVELS.map(priority => (
                    <option key={priority} value={priority}>{priority}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Survey URL
              </label>
              <input
                type="url"
                name="survey_url"
                value={formData.survey_url}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                placeholder="What is this survey about?"
              />
            </div>
          </div>

          {/* Status & Dates */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Status & Timeline</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  {SURVEY_STATUSES.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  name="due_date"
                  value={formData.due_date}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Requested Date
                </label>
                <input
                  type="date"
                  name="requested_date"
                  value={formData.requested_date}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Completed Date
                </label>
                <input
                  type="date"
                  name="completed_date"
                  value={formData.completed_date}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
          </div>

          {/* Requester Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Requester Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Requester Name
                </label>
                <input
                  type="text"
                  name="requester_name"
                  value={formData.requester_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  placeholder="e.g., HR Manager, Recruiter"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Requester Email
                </label>
                <input
                  type="email"
                  name="requester_email"
                  value={formData.requester_email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Additional Notes</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                placeholder="Any additional notes or comments..."
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : (survey ? 'Update Survey' : 'Add Survey')}
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
