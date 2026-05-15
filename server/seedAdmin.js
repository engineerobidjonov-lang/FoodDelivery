const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding...');

    const email = 'test@gmail.com';
    const password = 'hello123';

    // Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      console.log('User exists, updating password and role...');
      user.password = password;
      user.role = 'admin';
      await user.save();
    } else {
      console.log('Creating new admin user...');
      user = await User.create({
        name: 'Test Admin',
        email,
        password,
        role: 'admin'
      });
    }

    console.log('Admin user seeded successfully:');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Role:', user.role);

    process.exit();
  } catch (error) {
    console.error('Error seeding admin:', error.message);
    process.exit(1);
  }
};

seedAdmin();
