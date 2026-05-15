import 'dotenv/config'
import Seller from '../models/Seller.js'
import Category from '../models/Category.js'
import Food from '../models/Food.js'
import DeliveryPerson from '../models/DeliveryPerson.js'
import Address from '../models/Address.js'
import User from '../models/User.js'
import connectDB from '../config/db.js'

const seedData = async () => {
  try {
    await connectDB()

    await Seller.deleteMany({})
    await Category.deleteMany({})
    await Food.deleteMany({})
    await DeliveryPerson.deleteMany({})
    await Address.deleteMany({})
    await User.deleteMany({})

    console.log('Data cleared')

    const sellers = await Seller.insertMany([
      { name: 'Choyxona Milliy', phone: '+998 71 200 10 10' },
      { name: 'Dengiz Market', phone: '+998 71 200 20 20' },
      { name: 'Fast Food Express', phone: '+998 71 200 30 30' },
    ])

    const categories = await Category.insertMany([
      {
        name: 'Milliy taomlar',
        subtitle: 'Eng mazali ozbek milliy taomlari',
        banner: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=1200&q=80',
        deliveryEta: '25-35 daqiqa',
        seller: sellers[0]._id,
      },
      {
        name: 'Dengiz taomlar',
        subtitle: 'Yangi va mazali dengiz mahsulotlari',
        banner: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1200&q=80',
        deliveryEta: '30-40 daqiqa',
        seller: sellers[1]._id,
      },
      {
        name: 'Fast food',
        subtitle: 'Tez va sifatli tayyorlanadigan taomlar',
        banner: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=1200&q=80',
        deliveryEta: '15-25 daqiqa',
        seller: sellers[2]._id,
      },
    ])

    const [national, seafood, fastFood] = categories

    await Food.insertMany([
      {
        name: 'Choyxona Palov',
        description: 'Qoy goshti va sabzi bilan tayyorlangan milliy palov.',
        price: 45000,
        category: national._id,
        imageUrl: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=600&q=80',
        available: true,
        prepTimeMinutes: 35,
      },
      {
        name: 'Qozon Kabob',
        description: 'Yumshoq gosht va qovurilgan kartoshka.',
        price: 55000,
        category: national._id,
        imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
        available: true,
        prepTimeMinutes: 30,
      },
      {
        name: 'Manti',
        description: 'Goshtli va xamirli ananaviy taom.',
        price: 35000,
        category: national._id,
        imageUrl: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=600&q=80',
        available: true,
        prepTimeMinutes: 25,
      },
      {
        name: 'Somsa',
        description: 'Tandirda pishirilgan goshtli somsa.',
        price: 12000,
        category: national._id,
        imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
        available: true,
        prepTimeMinutes: 15,
      },
      {
        name: 'Shashlik',
        description: 'Komirda pishirilgan yumshoq gosht.',
        price: 18000,
        category: national._id,
        imageUrl: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=600&q=80',
        available: true,
        prepTimeMinutes: 20,
      },
      {
        name: 'Lagmon',
        description: 'Chozma xamir va sabzavotli qayla.',
        price: 32000,
        category: national._id,
        imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
        available: true,
        prepTimeMinutes: 25,
      },
      {
        name: 'Qovurilgan Baliq',
        description: 'Tilla rang bolib qovurilgan baliq.',
        price: 65000,
        category: seafood._id,
        imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80',
        available: true,
        prepTimeMinutes: 25,
      },
      {
        name: 'Krevetka Grill',
        description: 'Sarimsoqli sous bilan pishirilgan krevetkalar.',
        price: 85000,
        category: seafood._id,
        imageUrl: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?auto=format&fit=crop&w=600&q=80',
        available: true,
        prepTimeMinutes: 20,
      },
      {
        name: 'Losos Steyk',
        description: 'Grilda pishirilgan yangi losos.',
        price: 95000,
        category: seafood._id,
        imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=600&q=80',
        available: true,
        prepTimeMinutes: 25,
      },
      {
        name: 'Sushi Set',
        description: 'Turli xil sushilar toplami.',
        price: 120000,
        category: seafood._id,
        imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80',
        available: true,
        prepTimeMinutes: 20,
      },
      {
        name: 'Classic Burger',
        description: 'Goshtli kotlet, pishloq va yangi sabzavotlar.',
        price: 35000,
        category: fastFood._id,
        imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
        available: true,
        prepTimeMinutes: 15,
      },
      {
        name: 'Cheeseburger',
        description: 'Ikki hissa pishloq bilan yanada mazali.',
        price: 40000,
        category: fastFood._id,
        imageUrl: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?auto=format&fit=crop&w=600&q=80',
        available: true,
        prepTimeMinutes: 15,
      },
      {
        name: 'Pepperoni Pizza',
        description: 'Motsarella va pepperoni kolbasasi.',
        price: 75000,
        category: fastFood._id,
        imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80',
        available: true,
        prepTimeMinutes: 20,
      },
      {
        name: 'Lavash',
        description: 'Goshtli va sousli mazali lavash.',
        price: 28000,
        category: fastFood._id,
        imageUrl: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&w=600&q=80',
        available: true,
        prepTimeMinutes: 12,
      },
    ])

    await DeliveryPerson.create({
      name: 'Ali Courier',
      phone: '+998 90 111 22 33',
      currentLocation: { lat: 41.3111, lng: 69.2797 },
      available: true,
    })

    await Address.insertMany([
      {
        label: 'Uy',
        street: 'Amir Temur kochasi 12',
        city: 'Toshkent',
        region: 'Toshkent',
        postalCode: '100000',
        isDefault: true,
      },
      {
        label: 'Ish',
        street: 'Mustaqillik shoh kochasi 25',
        city: 'Toshkent',
        region: 'Toshkent',
        postalCode: '100000',
        isDefault: false,
      },
    ])

    await User.create({
      name: 'Abdurahmon',
      email: 'abdurahmon@gmail.com',
      password: 'obidjonov123',
    })

    console.log('Data seeded successfully')
    process.exit(0)
  } catch (error) {
    console.error(`Seed error: ${error.message}`)
    process.exit(1)
  }
}

seedData()
