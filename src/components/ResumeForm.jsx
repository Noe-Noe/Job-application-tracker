import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const RESUME_TYPES = ['General', 'Technical', 'Creative', 'Executive', 'Academic', 'Industry-Specific', 'Other']
const FILE_FORMATS = ['PDF', 'DOCX', 'TXT', 'Other']

export default function ResumeForm({ resume, onClose, userId }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    resume_type: 'General',
    file_format: 'PDF',
    file_url: '',
    tags: '',
    is_default: false,
    notes: ''
  })
  const [loading, setLoading] = useState(false)
  const [uploadMethod, setUploadMethod] = useState('link') // 'link' or 'upload'
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  useEffect(() => {
    if (resume) {
      setFormData({
        title: resume.title || '',
        description: resume.description || '',
        resume_type: resume.resume_type || 'General',
        file_format: resume.file_format || 'PDF',
        file_url: resume.file_url || '',
        tags: resume.tags || '',
        is_default: resume.is_default || false,
        notes: resume.notes || ''
      })
    }
  }, [resume])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB')
        return
      }
      
      // Check file type
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
      if (!allowedTypes.includes(file.type)) {
        alert('Only PDF, DOCX, and TXT files are allowed')
        return
      }
      
      setSelectedFile(file)
      
      // Auto-detect format
      if (file.type === 'application/pdf') {
        setFormData(prev => ({ ...prev, file_format: 'PDF' }))
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        setFormData(prev => ({ ...prev, file_format: 'DOCX' }))
      } else if (file.type === 'text/plain') {
        setFormData(prev => ({ ...prev, file_format: 'TXT' }))
      }
    }
  }

  const uploadFile = async () => {
    if (!selectedFile) return null

    try {
      setUploading(true)
      setUploadProgress(0)

      // Create unique filename
      const fileExt = selectedFile.name.split('.').pop()
      const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('resumes')
        .upload(fileName, selectedFile, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) throw error

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('resumes')
        .getPublicUrl(fileName)

      setUploadProgress(100)
      return publicUrl

    } catch (error) {
      console.error('Error uploading file:', error.message)
      alert('Failed to upload file: ' + error.message)
      return null
    } finally {
      setUploading(false)
    }
  }

  const deleteOldFile = async (fileUrl) => {
    if (!fileUrl || !fileUrl.includes('supabase')) return

    try {
      // Extract file path from URL
      const urlParts = fileUrl.split('/resumes/')
      if (urlParts.length < 2) return
      
      const filePath = urlParts[1]
      
      const { error } = await supabase.storage
        .from('resumes')
        .remove([filePath])

      if (error) console.error('Error deleting old file:', error.message)
    } catch (error) {
      console.error('Error deleting old file:', error.message)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      let fileUrl = formData.file_url

      // Handle file upload if user selected upload method
      if (uploadMethod === 'upload' && selectedFile) {
        const uploadedUrl = await uploadFile()
        if (!uploadedUrl) {
          setLoading(false)
          return
        }
        fileUrl = uploadedUrl

        // Delete old file if updating and old file was uploaded
        if (resume && resume.file_url && resume.file_url.includes('supabase')) {
          await deleteOldFile(resume.file_url)
        }
      }

      const dataToSave = {
        ...formData,
        file_url: fileUrl,
        user_id: userId,
        updated_at: new Date().toISOString()
      }

      // If setting as default, first unset all other defaults
      if (formData.is_default) {
        const { error: unsetError } = await supabase
          .from('resumes')
          .update({ is_default: false })
          .eq('user_id', userId)

        if (unsetError) throw unsetError
      }

      if (resume) {
        // Update existing resume
        const { error } = await supabase
          .from('resumes')
          .update(dataToSave)
          .eq('id', resume.id)

        if (error) throw error
      } else {
        // Create new resume
        dataToSave.created_at = new Date().toISOString()
        const { error } = await supabase
          .from('resumes')
          .insert([dataToSave])

        if (error) throw error
      }

      onClose()
    } catch (error) {
      console.error('Error saving resume:', error.message)
      alert('Failed to save resume: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
          <h2 className="text-xl font-bold text-gray-900">
            {resume ? 'Edit Resume' : 'Add New Resume'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Software Engineer Resume 2026"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Brief description of this resume version..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                />
              </div>

              {/* Resume Type and File Format */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resume Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="resume_type"
                    value={formData.resume_type}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  >
                    {RESUME_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    File Format
                  </label>
                  <select
                    name="file_format"
                    value={formData.file_format}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  >
                    {FILE_FORMATS.map(format => (
                      <option key={format} value={format}>{format}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* File Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">File Information</h3>
            <div className="space-y-4">
              {/* Upload Method Toggle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  How would you like to add your resume?
                </label>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setUploadMethod('upload')}
                    className={`flex-1 px-4 py-3 border-2 rounded-lg transition ${
                      uploadMethod === 'upload'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center justify-center mb-1">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      Upload File
                    </div>
                    <p className="text-xs text-gray-600">From your computer</p>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setUploadMethod('link')}
                    className={`flex-1 px-4 py-3 border-2 rounded-lg transition ${
                      uploadMethod === 'link'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center justify-center mb-1">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      Add Link
                    </div>
                    <p className="text-xs text-gray-600">Google Drive, Dropbox, etc.</p>
                  </button>
                </div>
              </div>

              {/* File Upload Section */}
              {uploadMethod === 'upload' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Resume File
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition">
                    {selectedFile ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-center">
                          <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{selectedFile.name}</p>
                          <p className="text-sm text-gray-500">
                            {(selectedFile.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedFile(null)}
                          className="text-sm text-red-600 hover:text-red-800"
                        >
                          Remove file
                        </button>
                      </div>
                    ) : (
                      <>
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <div className="mt-4">
                          <label htmlFor="file-upload" className="cursor-pointer">
                            <span className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition">
                              Choose file
                            </span>
                            <input
                              id="file-upload"
                              type="file"
                              accept=".pdf,.docx,.txt"
                              onChange={handleFileSelect}
                              className="sr-only"
                            />
                          </label>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          PDF, DOCX, or TXT up to 10MB
                        </p>
                      </>
                    )}
                  </div>
                  {uploading && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                        <span>Uploading...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* File URL Section */}
              {uploadMethod === 'link' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    File URL / Link
                  </label>
                  <input
                    type="url"
                    name="file_url"
                    value={formData.file_url}
                    onChange={handleChange}
                    placeholder="https://drive.google.com/... or Dropbox link"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Add a link to your resume file (Google Drive, Dropbox, etc.)
                  </p>
                </div>
              )}

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="e.g., React, Node.js, AWS (comma-separated)"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Add tags to categorize your resume (separate with commas)
                </p>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
            <div className="space-y-4">
              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Additional notes about this resume version, target companies, modifications made, etc."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                />
              </div>

              {/* Default Checkbox */}
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    name="is_default"
                    checked={formData.is_default}
                    onChange={handleChange}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                </div>
                <div className="ml-3">
                  <label className="text-sm font-medium text-gray-700">
                    Set as default resume
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    This will be your primary resume for applications
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>{resume ? 'Update Resume' : 'Save Resume'}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
