require('dotenv').config();
const mongoose = require('mongoose');
const { CategoryModel } = require('./app/models/category');
const { UserModel } = require('./app/models/user');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/sbworks';

const categories = [
  { title: 'Web Development', description: 'websites and web applications', type: 'project' },
  { title: 'Mobile Development', description: 'android and ios app development', type: 'project' },
  { title: 'Graphic Design', description: 'logos branding and visual design', type: 'project' },
  { title: 'Content Writing', description: 'articles blogs and copywriting', type: 'project' },
  { title: 'Digital Marketing', description: 'seo social media and advertising', type: 'project' },
  { title: 'Video Editing', description: 'video production and editing', type: 'project' },
  { title: 'Data Science', description: 'data analysis and machine learning', type: 'project' },
  { title: 'UI/UX Design', description: 'user interface and experience design', type: 'project' },
  { title: 'DevOps', description: 'cloud infrastructure and deployment', type: 'project' },
  { title: 'Other', description: 'other services and tasks', type: 'project' },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Seed Categories
    for (const cat of categories) {
      const exists = await CategoryModel.findOne({ title: cat.title });
      if (!exists) {
        await CategoryModel.create(cat);
        console.log(`✅ Category created: ${cat.title}`);
      } else {
        console.log(`⏭️  Category exists: ${cat.title}`);
      }
    }

    // Seed Admin User
    const adminPhone = '+10000000000';
    const existingAdmin = await UserModel.findOne({ phoneNumber: adminPhone });
    if (!existingAdmin) {
      await UserModel.create({
        phoneNumber: adminPhone,
        name: 'Admin User',
        email: 'admin@sbworks.com',
        role: 'ADMIN',
        isActive: true,
        isVerifiedPhoneNumber: true,
        status: 2,
        otp: { code: 123456, expiresIn: new Date('2099-01-01') },
      });
      console.log('\n🔑 ADMIN USER CREATED:');
      console.log('   Phone: +10000000000');
      console.log('   OTP:   123456 (permanent, for testing)');
    } else {
      // Make sure otp is set for easy login
      await UserModel.updateOne({ phoneNumber: adminPhone }, {
        $set: { otp: { code: 123456, expiresIn: new Date('2099-01-01') }, status: 2, isActive: true, role: 'ADMIN' }
      });
      console.log('\n🔑 ADMIN USER (already exists):');
      console.log('   Phone: +10000000000');
      console.log('   OTP:   123456 (permanent, for testing)');
    }

    console.log('\n✅ Seed complete! You can now run the server.\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
}

seed();
