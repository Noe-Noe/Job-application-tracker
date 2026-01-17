import React from 'react'

const STATUS_COLORS = {
  'Applied': 'bg-blue-100 text-blue-800 border-blue-200',
  'Shortlisted': 'bg-cyan-100 text-cyan-800 border-cyan-200',
  'Interview Scheduled': 'bg-purple-100 text-purple-800 border-purple-200',
  'Interview Completed': 'bg-indigo-100 text-indigo-800 border-indigo-200',
  'Offer Received': 'bg-green-100 text-green-800 border-green-200',
  'Rejected': 'bg-red-100 text-red-800 border-red-200',
  'Accepted': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'Withdrawn': 'bg-gray-100 text-gray-800 border-gray-200',
}

export default function ApplicationList({ applications, onEdit, onDelete }) {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Position
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Salary
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Applied Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {applications.map((app) => (
              <tr key={app.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{app.company}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{app.position}</div>
                  {app.job_url && (
                    <a
                      href={app.job_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-indigo-600 hover:text-indigo-800"
                    >
                      View Job Posting →
                    </a>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {app.salary || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${STATUS_COLORS[app.status] || 'bg-gray-100 text-gray-800'}`}>
                    {app.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {app.location || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(app.applied_date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => onEdit(app)}
                    className="text-indigo-600 hover:text-indigo-900 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(app.id)}
                    className="text-red-600 hover:text-red-900 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile view - Card layout */}
      <div className="lg:hidden divide-y divide-gray-200">
        {applications.map((app) => (
          <div key={app.id} className="p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-900">{app.company}</h3>
                <p className="text-sm text-gray-600">{app.position}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${STATUS_COLORS[app.status] || 'bg-gray-100 text-gray-800'}`}>
                {app.status}
              </span>
            </div>
            
            {app.location && (
              <div className="text-sm text-gray-500">📍 {app.location}</div>
            )}
            
            {app.salary && (
              <div className="text-sm text-gray-500">💰 {app.salary}</div>
            )}
            
            <div className="text-sm text-gray-500">
              📅 {formatDate(app.applied_date)}
            </div>
            
            {app.job_url && (
              <a
                href={app.job_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-indigo-600 hover:text-indigo-800 block"
              >
                View Job Posting →
              </a>
            )}
            
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => onEdit(app)}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(app.id)}
                className="flex-1 px-4 py-2 border border-red-300 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
