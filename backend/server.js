import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import connectDB from './config/db.js'

// AdminJS
import { adminJs, adminRouter } from './admin.js'

// Routes
import catalogRoutes from './routes/catalogRoutes.js'
import locationRoutes from './routes/locationRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
import favoriteRoutes from './routes/favoriteRoutes.js'
import adminRoutes from './routes/adminRoutes.js'

// Middleware
import notFound from './middleware/notFound.js'
import errorHandler from './middleware/errorHandler.js'

const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// =====================
// 1. Middleware
// =====================
app.use(cors())
app.use('/uploads', express.static(join(__dirname, 'uploads')))

// =====================
// 2. AdminJS (dashboard)
// =====================
app.use(adminJs.options.rootPath, adminRouter)

app.use(express.json())

// =====================
// 3. Routes (clean structure)
// =====================
app.use('/api/catalog', catalogRoutes)
app.use('/api/location', locationRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/favorites', favoriteRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/admin', adminRoutes)

// =====================
// 4. Health check
// =====================
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'food-dash-backend',
    timestamp: new Date().toISOString()
  })
})

// =====================
// 5. Error handling
// =====================
app.use(notFound)
app.use(errorHandler)

// =====================
// 6. DB + Server start
// =====================
const PORT = process.env.PORT || 5000

connectDB()
  .then(() => {
    console.log('MongoDB connected')

    const server = app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`)
      console.log(`Admin panel: http://localhost:${PORT}/admin`)
    })

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Stop the existing server or set a different PORT in .env.`)
        process.exit(1)
      }

      throw err
    })
  })
  .catch((err) => {
    console.error('Database connection failed', err)
  })

export default app
