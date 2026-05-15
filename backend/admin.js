import AdminJS, { ComponentLoader } from 'adminjs'
import AdminJSExpress from '@adminjs/express'
import * as AdminJSMongoose from '@adminjs/mongoose'
import mongoose from 'mongoose'
import { copyFile, mkdir, readdir } from 'node:fs/promises'
import { dirname, extname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import crypto from 'node:crypto'

AdminJS.registerAdapter(AdminJSMongoose)

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const modelsDirectory = join(__dirname, 'models')
const uploadDirectory = join(__dirname, 'uploads', 'admin')
const componentLoader = new ComponentLoader()
const Components = {
  Dashboard: componentLoader.add('Dashboard', join(__dirname, 'admin', 'components', 'Dashboard.jsx')),
}

const modelFiles = await readdir(modelsDirectory)

await Promise.all(
  modelFiles
    .filter((file) => file.endsWith('.js'))
    .map((file) => import(pathToFileURL(join(modelsDirectory, file)).href))
)

const modelParents = {
  User: { name: 'Users', icon: 'User' },
  Seller: { name: 'Users', icon: 'UserCheck' },
  DeliveryPerson: { name: 'Users', icon: 'Truck' },
  Food: { name: 'Catalog', icon: 'Store' },
  Category: { name: 'Catalog', icon: 'Category' },
  Order: { name: 'Sales', icon: 'ShoppingCart' },
  Address: { name: 'Locations', icon: 'Map' },
}

const modelOrder = [
  'User',
  'Food',
  'Seller',
  'Order',
  'DeliveryPerson',
  'Category',
  'Address',
]

const resources = Object.values(mongoose.models)
  .sort((firstModel, secondModel) => {
    const firstIndex = modelOrder.indexOf(firstModel.modelName)
    const secondIndex = modelOrder.indexOf(secondModel.modelName)

    return (firstIndex === -1 ? 999 : firstIndex) - (secondIndex === -1 ? 999 : secondIndex)
  })
  .map((model) => ({
    resource: model,
    options: {
      parent: modelParents[model.modelName] || { name: 'Database' },
      properties: {
        imageUrl: {
          type: 'string',
        },
        banner: {
          type: 'string',
        },
        password: {
          isVisible: {
            list: false,
            filter: false,
            show: false,
            edit: true,
          },
        },
      },
    },
  }))

const adminJs = new AdminJS({
  rootPath: '/admin',
  resources,
  componentLoader,
  dashboard: {
    component: Components.Dashboard,
  },
  branding: {
    companyName: 'Food Dash Admin',
    softwareBrothers: false,
    favicon: false,
    theme: {
      colors: {
        primary100: '#f97316',
        primary80: '#fb923c',
        primary60: '#fdba74',
        accent: '#111827',
        love: '#f97316',
      },
    },
  },
})

const ADMIN = {
  email: process.env.ADMIN_EMAIL || 'admin@gmail.com',
  password: process.env.ADMIN_PASSWORD || 'admin123',
}

const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
  adminJs,
  {
    authenticate: async (email, password) => {
      if (email === ADMIN.email && password === ADMIN.password) {
        return { email: ADMIN.email }
      }

      return null
    },
    cookieName: 'food-dash-admin',
    cookiePassword: process.env.ADMIN_COOKIE_SECRET || 'food-dash-admin-secret',
  },
  null,
  {
    resave: false,
    saveUninitialized: false,
    secret: process.env.ADMIN_COOKIE_SECRET || 'food-dash-admin-secret',
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    },
  }
)

adminRouter.post('/upload-image', async (req, res) => {
  const uploadedImage = req.files?.image
  const image = Array.isArray(uploadedImage) ? uploadedImage[0] : uploadedImage

  if (!image) {
    return res.status(400).json({ message: 'Image file is required' })
  }

  if (!image.type?.startsWith('image/')) {
    return res.status(400).json({ message: 'Only image files are allowed' })
  }

  const sourcePath = image.path || image.filepath
  const extension = extname(image.name || image.originalFilename || '') || '.jpg'
  const fileName = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${extension}`
  const destinationPath = join(uploadDirectory, fileName)

  await mkdir(uploadDirectory, { recursive: true })
  await copyFile(sourcePath, destinationPath)

  return res.json({ url: `/uploads/admin/${fileName}` })
})

export { adminJs, adminRouter }
2