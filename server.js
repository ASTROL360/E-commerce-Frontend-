import express from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()

const PORT = process.env.PORT || 3000
const API_TARGET = process.env.API_TARGET || 'https://ecommerce-backend-mddx.onrender.com'

app.use(
  '/api',
  createProxyMiddleware({
    target: API_TARGET,
    changeOrigin: true,
    on: {
      proxyReq: (proxyReq) => {
        proxyReq.removeHeader('origin')
      },
    },
  })
)

app.use(express.static(path.join(__dirname, 'dist')))

app.use((req, res, next) => {
  if (req.method !== 'GET' || req.path.startsWith('/api')) return next()
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Frontend serving on port ${PORT}, proxying /api -> ${API_TARGET}`)
})
