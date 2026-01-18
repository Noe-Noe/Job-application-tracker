import { supabase } from '../supabase-server.js'

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  )

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Get the auth token from header
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid authorization header' })
    }

    const token = authHeader.split(' ')[1]

    // Verify the token with Supabase
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' })
    }

    // Get job data from request body
    const jobData = req.body
    
    console.log('[Extension API] Received job data:', jobData)
    
    // Validate - we need at least something to identify the job
    const hasCompany = jobData.company && jobData.company.trim().length > 0
    const hasPosition = jobData.position && jobData.position.trim().length > 0
    const hasJobUrl = jobData.job_url && jobData.job_url.trim().length > 0
    
    if (!hasCompany && !hasPosition && !hasJobUrl) {
      return res.status(400).json({ 
        error: 'At least company, position, or job URL is required' 
      })
    }

    // Prepare data for database - be flexible with missing data
    const applicationData = {
      user_id: user.id,
      company: (hasCompany ? jobData.company.trim() : null) || 'Unknown Company',
      position: (hasPosition ? jobData.position.trim() : null) || 'Position from ' + (jobData.job_url ? new URL(jobData.job_url).hostname : 'website'),
      location: jobData.location && jobData.location.trim() ? jobData.location.trim() : null,
      salary: jobData.salary && jobData.salary.trim() ? jobData.salary.trim() : null,
      job_url: jobData.job_url || jobData.source_url || null,
      notes: jobData.notes || 'Auto-saved from browser extension - please verify details',
      status: 'Applied',
      applied_date: new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    console.log('[Extension API] Saving application:', applicationData)

    // Insert into Supabase
    const { data, error } = await supabase
      .from('applications')
      .insert([applicationData])
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return res.status(500).json({ error: 'Failed to save application to database' })
    }

    return res.status(201).json({
      success: true,
      data,
      message: 'Application saved successfully'
    })
  } catch (error) {
    console.error('Error in from-extension API:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
