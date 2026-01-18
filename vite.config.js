import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { handleApiRequest } from './vite-api-helpers.js'

// API handler plugin for local development
const apiPlugin = () => ({
  name: 'api-handler',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      // Handle API routes
      if (req.url.startsWith('/api/')) {
        console.log(`[API] ${req.method} ${req.url}`)
        
        try {
          // Dynamically import and handle the API route
          if (req.url === '/api/test-connection') {
            const { default: handler } = await import('./api/test-connection.js')
            return handleApiRequest(req, res, handler)
          } else if (req.url === '/api/applications/from-extension') {
            const { default: handler } = await import('./api/applications/from-extension.js')
            return handleApiRequest(req, res, handler)
          }
          
          // Route not found
          res.statusCode = 404
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'API route not found' }))
          return
        } catch (error) {
          console.error('[API Error]:', error)
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ 
            error: 'Internal server error', 
            details: error.message 
          }))
          return
        }
      }
      next()
    })
  }
})

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file to process.env for API routes
  const env = loadEnv(mode, process.cwd(), '')
  
  // Make Vite env variables available to API routes via process.env
  Object.keys(env).forEach(key => {
    if (key.startsWith('VITE_')) {
      process.env[key] = env[key]
    }
  })

  return {
    plugins: [react(), apiPlugin()],
  }
})
