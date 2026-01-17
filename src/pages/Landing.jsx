import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Landing = () => {
  const [openFAQ, setOpenFAQ] = useState(null)

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index)
  }

  const faqs = [
    {
      question: "Is JobTracker really free?",
      answer: "Yes! JobTracker is completely free to use. You can track unlimited applications, schedule interviews, manage resumes, and access all features without any cost."
    },
    {
      question: "How secure is my data?",
      answer: "We take security seriously. All your data is encrypted and stored securely using industry-standard practices. Your information is private and will never be shared with third parties."
    },
    {
      question: "Can I upload and store my resumes?",
      answer: "Absolutely! You can upload multiple versions of your resume and cover letters. Store different versions tailored for specific job types or companies, and access them anytime you need."
    },
    {
      question: "Does JobTracker work on mobile devices?",
      answer: "Yes! JobTracker is fully responsive and works seamlessly on all devices including smartphones, tablets, and desktop computers. Track your applications on the go, anytime, anywhere."
    },
    {
      question: "Can I set reminders for interviews and deadlines?",
      answer: "Yes! You can schedule interviews and set important dates. The system helps you stay organized and never miss an important deadline or interview appointment."
    },
    {
      question: "What kind of analytics does the dashboard provide?",
      answer: "The dashboard provides visual insights into your job search progress, including application statistics, response rates, interview conversion rates, and timeline tracking to help you optimize your job search strategy."
    },
    {
      question: "Do I need to download any software?",
      answer: "No downloads required! JobTracker is a web-based application that runs directly in your browser. Simply sign up and start tracking your applications immediately."
    },
    {
      question: "Can I export my application data?",
      answer: "Yes! Your data belongs to you. You can export all your application tracking data, notes, and information whenever you need it for your records or other purposes."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav className="bg-white/30 backdrop-blur-lg shadow-lg border-b border-white/20 sticky top-0 z-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  JobTracker
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-800 hover:text-blue-600 font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-xl transform hover:scale-105 transition-all"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-40 pb-32">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 group cursor-default">
            <span className="inline-block transition-all duration-300 hover:scale-110 hover:text-blue-600">Track</span>
            {" "}
            <span className="inline-block transition-all duration-300 hover:scale-110 hover:text-purple-600">Your</span>
            {" "}
            <span className="inline-block transition-all duration-300 hover:scale-110 hover:text-blue-600">Job</span>
            {" "}
            <span className="inline-block transition-all duration-300 hover:scale-110 hover:text-purple-600">Search</span>
            <span className="block mt-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent relative">
              <span className="inline-block transition-all duration-300 hover:scale-110">With</span>
              {" "}
              <span className="inline-block transition-all duration-300 hover:scale-110 hover:rotate-3">Confidence</span>
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500"></div>
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto hover:text-gray-900 transition-colors duration-300">
            Stay organized and never miss an opportunity. Track applications, schedule interviews, 
            manage resumes, and land your dream job faster.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
            <Link
              to="/signup"
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-xl transform hover:scale-105 transition-all relative overflow-hidden group"
            >
              <span className="relative z-10">Start Free Today</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <button
              onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto bg-white text-gray-700 px-8 py-4 rounded-lg font-semibold text-lg border-2 border-gray-200 hover:border-blue-600 hover:text-blue-600 hover:shadow-lg transition-all relative overflow-hidden group"
            >
              <span className="relative z-10">See Features</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>

        {/* Hero Image/Illustration */}
        <div className="mt-20 relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 - Applications */}
            <div className="bg-white/20 backdrop-blur-lg p-6 rounded-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group/card relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 opacity-0 group-hover/card:opacity-20 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover/card:scale-110 group-hover/card:rotate-6 transition-all duration-300 shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 group-hover/card:text-blue-700 transition-colors">Applications</h3>
                <p className="text-sm text-gray-700 group-hover/card:text-gray-900 transition-colors">Track every job application with detailed notes and status updates</p>
              </div>
            </div>

            {/* Card 2 - Interviews */}
            <div className="bg-white/20 backdrop-blur-lg p-6 rounded-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group/card relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-600 opacity-0 group-hover/card:opacity-20 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover/card:scale-110 group-hover/card:rotate-6 transition-all duration-300 shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 group-hover/card:text-purple-700 transition-colors">Interviews</h3>
                <p className="text-sm text-gray-700 group-hover/card:text-gray-900 transition-colors">Schedule and prepare for interviews with built-in reminders</p>
              </div>
            </div>

            {/* Card 3 - Resumes */}
            <div className="bg-white/20 backdrop-blur-lg p-6 rounded-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group/card relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600 opacity-0 group-hover/card:opacity-20 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4 group-hover/card:scale-110 group-hover/card:rotate-6 transition-all duration-300 shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 group-hover/card:text-green-700 transition-colors">Resumes</h3>
                <p className="text-sm text-gray-700 group-hover/card:text-gray-900 transition-colors">Manage multiple resume versions tailored for different roles</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="bg-gradient-to-br from-white/10 via-blue-50/30 to-purple-50/30 backdrop-blur-sm py-20 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Land Your Dream Job
            </h2>
            <p className="text-xl text-gray-700">
              Powerful features designed to streamline your job search
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white/30 backdrop-blur-lg p-6 rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/40">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Application Tracking</h3>
              <p className="text-gray-700">
                Keep track of every application with status updates, deadlines, and custom notes.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white/30 backdrop-blur-lg p-6 rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/40">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Interview Scheduler</h3>
              <p className="text-gray-700">
                Schedule interviews, set reminders, and never miss an important meeting.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white/30 backdrop-blur-lg p-6 rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/40">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Resume Manager</h3>
              <p className="text-gray-700">
                Store and organize multiple resume versions for different job types.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white/30 backdrop-blur-lg p-6 rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/40">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center mb-4 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Analytics Dashboard</h3>
              <p className="text-gray-700">
                Visualize your job search progress with insightful statistics and charts.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white/30 backdrop-blur-lg p-6 rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/40">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center mb-4 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Event Tracking</h3>
              <p className="text-gray-700">
                Track career fairs, networking events, and important deadlines in one place.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white/30 backdrop-blur-lg p-6 rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/40">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center mb-4 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Customizable Workflow</h3>
              <p className="text-gray-700">
                Tailor the app to your needs with custom statuses and personalized settings.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Stat 1 */}
            <div className="relative group">
              <div className="absolute inset-0 bg-white/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm">
                    <span className="text-white text-sm font-semibold">+15% this month</span>
                  </div>
                </div>
                <div className="text-white">
                  <div className="text-5xl font-bold mb-2 bg-gradient-to-br from-white to-blue-100 bg-clip-text text-transparent">10k+</div>
                  <div className="text-white/90 text-lg font-medium">Active Users</div>
                  <p className="text-white/60 text-sm mt-2">Job seekers using JobTracker daily</p>
                </div>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="relative group">
              <div className="absolute inset-0 bg-white/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm">
                    <span className="text-white text-sm font-semibold">+2.3k today</span>
                  </div>
                </div>
                <div className="text-white">
                  <div className="text-5xl font-bold mb-2 bg-gradient-to-br from-white to-purple-100 bg-clip-text text-transparent">50k+</div>
                  <div className="text-white/90 text-lg font-medium">Applications Tracked</div>
                  <p className="text-white/60 text-sm mt-2">Total applications managed successfully</p>
                </div>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="relative group">
              <div className="absolute inset-0 bg-white/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                  <div className="px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm">
                    <span className="text-white text-sm font-semibold">4.8/5 rating</span>
                  </div>
                </div>
                <div className="text-white">
                  <div className="text-5xl font-bold mb-2 bg-gradient-to-br from-white to-purple-100 bg-clip-text text-transparent">95%</div>
                  <div className="text-white/90 text-lg font-medium">User Satisfaction</div>
                  <p className="text-white/60 text-sm mt-2">Based on user reviews and feedback</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div id="faq" className="py-20 bg-gradient-to-br from-purple-50/30 via-pink-50/30 to-blue-50/30 backdrop-blur-sm relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-700">
              Everything you need to know about JobTracker
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="bg-white/30 backdrop-blur-lg rounded-xl shadow-lg border border-white/40 overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-white/20 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-gray-900 pr-8">
                    {faq.question}
                  </h3>
                  <svg
                    className={`w-6 h-6 text-gray-700 flex-shrink-0 transition-transform duration-300 ${
                      openFAQ === index ? 'transform rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <div
                  className={`transition-all duration-300 ease-in-out ${
                    openFAQ === index 
                      ? 'max-h-96 opacity-100' 
                      : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-6 pb-5 text-gray-700">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-br from-purple-50/30 via-pink-50/30 to-blue-50/30 backdrop-blur-sm relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-2xl opacity-20"></div>
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-2xl opacity-20"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Take Control of Your Job Search?
          </h2>
          <p className="text-xl text-gray-700 mb-8">
            Join thousands of job seekers who are already using JobTracker to land their dream jobs.
          </p>
          <Link
            to="/signup"
            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-xl transform hover:scale-105 transition-all"
          >
            Get Started For Free
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-xl font-bold">JobTracker</span>
              </div>
              <p className="text-gray-400">
                The modern way to track your job applications and land your dream job faster.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2026 JobTracker. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing
