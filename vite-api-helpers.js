// Helper functions for handling API requests in Vite dev mode

export function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', chunk => {
      body += chunk.toString()
    })
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {})
      } catch (error) {
        reject(error)
      }
    })
    req.on('error', reject)
  })
}

export function createMockRes(res) {
  return {
    status(code) {
      res.statusCode = code
      return this
    },
    json(data) {
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(data))
    },
    end() {
      res.end()
    },
    setHeader(key, value) {
      res.setHeader(key, value)
    }
  }
}

export async function handleApiRequest(req, res, handler) {
  try {
    // Parse body for POST requests
    if (req.method === 'POST') {
      req.body = await parseBody(req)
    }

    // Create mock response object
    const mockRes = createMockRes(res)

    // Call the handler
    await handler(req, mockRes)
  } catch (error) {
    console.error('API Handler Error:', error)
    res.statusCode = 500
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ 
      error: 'Internal server error', 
      details: error.message 
    }))
  }
}
