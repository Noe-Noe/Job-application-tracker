import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const EVENT_TYPES = [
  'Career Fair',
  'Networking Event',
  'Application Deadline',
  'Follow-up Reminder',
  'Company Event',
  'Offer Decision Deadline',
  'Info Session',
  'Workshop',
  'Other'
]

const EVENT_STATUSES = ['Upcoming', 'Completed', 'Cancelled']

export default function EventForm({ event, onClose, userId, applications = [] }) {
  const [formData, setFormData] = useState({
    application_id: '',
    title: '',
    event_type: 'Career Fair',
    event_date: '',
    end_date: '',
    location: '',
    event_link: '',
    company: '',
    description: '',
    notes: '',
    is_all_day: false,
    reminder_hours_before: 24,
    status: 'Upcoming',
    outcome: '',
    contacts_made: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (event) {
      setFormData({
        application_id: event.application_id || '',
        title: event.title || '',
        event_type: event.event_type || 'Career Fair',
        event_date: event.event_date 
          ? new Date(event.event_date).toISOString().slice(0, 16)
          : '',
        end_date: event.end_date 
          ? new Date(event.end_date).toISOString().slice(0, 16)
          : '',
        location: event.location || '',
        event_link: event.event_link || '',
        company: event.company || '',
        description: event.description || '',
        notes: event.notes || '',
        is_all_day: event.is_all_day || false,
        reminder_hours_before: event.reminder_hours_before || 24,
        status: event.status || 'Upcoming',
        outcome: event.outcome || '',
        contacts_made: event.contacts_made || '',
      })
    }
  }, [event])

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
        setFormData(prev => ({
          ...prev,
          application_id: appId,
          company: app.company
        }))
      }
    } else {
      setFormData(prev => ({
        ...prev,
        company: ''
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title || !formData.event_date) {
      setError('Title and Event Date are required')
      return
    }

    try {
      setLoading(true)
      setError('')

      const dataToSave = {
        ...formData,
        user_id: userId,
        event_date: new Date(formData.event_date).toISOString(),
        end_date: formData.end_date 
          ? new Date(formData.end_date).toISOString() 
          : null,
        reminder_hours_before: parseInt(formData.reminder_hours_before),
        updated_at: new Date().toISOString(),
      }

      // Remove empty optional fields
      if (!dataToSave.application_id) delete dataToSave.application_id
      if (!dataToSave.location) delete dataToSave.location
      if (!dataToSave.event_link) delete dataToSave.event_link
      if (!dataToSave.company) delete dataToSave.company
      if (!dataToSave.description) delete dataToSave.description
      if (!dataToSave.notes) delete dataToSave.notes
      if (!dataToSave.outcome) delete dataToSave.outcome
      if (!dataToSave.contacts_made) delete dataToSave.contacts_made
      if (!dataToSave.end_date) delete dataToSave.end_date

      let result
      if (event) {
        // Update existing
        result = await supabase
          .from('events')
          .update(dataToSave)
          .eq('id', event.id)
      } else {
        // Create new
        result = await supabase
          .from('events')
          .insert([dataToSave])
      }

      if (result.error) throw result.error

      onClose()
    } catch (err) {
      console.error('Error saving event:', err)
      setError(err.message || 'Failed to save event')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-900">
            {event ? 'Edit Event' : 'Add Event'}
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
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                placeholder="e.g., Tech Career Fair, Follow-up with Google Recruiter"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="event_type"
                  value={formData.event_type}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  required
                >
                  {EVENT_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
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
                  {EVENT_STATUSES.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>

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
                <option value="">No linked application</option>
                {applications.map(app => (
                  <option key={app.id} value={app.id}>
                    {app.company} - {app.position}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company (Optional)
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                disabled={!!formData.application_id}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none disabled:bg-gray-100"
                placeholder="Company name (if applicable)"
              />
            </div>
          </div>

          {/* Date & Time */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Date & Time</h3>
            
            <div className="flex items-center mb-3">
              <input
                type="checkbox"
                name="is_all_day"
                checked={formData.is_all_day}
                onChange={handleChange}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label className="ml-2 text-sm font-medium text-gray-700">
                All-day event
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date & Time <span className="text-red-500">*</span>
                </label>
                <input
                  type={formData.is_all_day ? "date" : "datetime-local"}
                  name="event_date"
                  value={formData.is_all_day ? formData.event_date.slice(0, 10) : formData.event_date}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date & Time (Optional)
                </label>
                <input
                  type={formData.is_all_day ? "date" : "datetime-local"}
                  name="end_date"
                  value={formData.is_all_day && formData.end_date ? formData.end_date.slice(0, 10) : formData.end_date}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reminder (hours before)
              </label>
              <select
                name="reminder_hours_before"
                value={formData.reminder_hours_before}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              >
                <option value="1">1 hour before</option>
                <option value="2">2 hours before</option>
                <option value="4">4 hours before</option>
                <option value="24">1 day before</option>
                <option value="48">2 days before</option>
                <option value="168">1 week before</option>
              </select>
            </div>
          </div>

          {/* Location & Link */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Location & Link</h3>
            
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
                  placeholder="e.g., Convention Center, Online, 123 Main St"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Link
                </label>
                <input
                  type="url"
                  name="event_link"
                  value={formData.event_link}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  placeholder="Registration or event page URL"
                />
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Details</h3>
            
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
                placeholder="What is this event about? What to expect?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                placeholder="Your notes, preparation items, things to bring..."
              />
            </div>
          </div>

          {/* Post-Event (only show if status is Completed) */}
          {formData.status === 'Completed' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Post-Event</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Outcome
                </label>
                <textarea
                  name="outcome"
                  value={formData.outcome}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                  placeholder="What happened? Any leads or opportunities?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contacts Made
                </label>
                <textarea
                  name="contacts_made"
                  value={formData.contacts_made}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                  placeholder="Names, titles, and contact info of people you met..."
                />
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : (event ? 'Update Event' : 'Add Event')}
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
