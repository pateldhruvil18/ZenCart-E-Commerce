require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Product = require('./api/models/product.schema');
const User = require('./api/models/user.schema');

const products = [
  {
    name: "Quantum X Pro Gaming Laptop",
    description: "Ultra-fast gaming laptop with 32GB RAM, RTX 4090, and a 240Hz OLED display.",
    price: 185000,
    originalPrice: 200000,
    category: "Electronics",
    brand: "Quantum",
    images: ["https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=800"],
    stock: 15,
    rating: 4.8,
    numReviews: 24,
    isFeatured: true,
    tags: ["gaming", "laptop", "powerful"]
  },
  {
    name: "AeroStep Alpha Sneakers",
    description: "Premium lightweight running shoes designed for ultimate comfort and speed.",
    price: 8500,
    category: "Shoes",
    brand: "AeroStep",
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800"],
    stock: 50,
    rating: 4.5,
    numReviews: 120,
    isTrending: true,
    tags: ["shoes", "running", "sports"]
  },
  {
    name: "Minimalist Leather Backpack",
    description: "Sleek, handcrafted leather backpack with dedicated laptop sleeve and waterproof zippers.",
    price: 4500,
    originalPrice: 6000,
    category: "Accessories",
    brand: "LuxeCraft",
    images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800"],
    stock: 30,
    rating: 4.9,
    numReviews: 56,
    isFeatured: true,
    tags: ["bag", "leather", "travel"]
  },
  {
    name: "NoiseCanceller Pro Headphones",
    description: "Industry-leading noise cancellation with 40-hour battery life and Hi-Res Audio.",
    price: 24000,
    category: "Electronics",
    brand: "SonicWave",
    images: ["https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=800"],
    stock: 100,
    rating: 4.7,
    numReviews: 312,
    isFeatured: true,
    tags: ["headphones", "audio", "wireless"]
  },
  {
    name: "Classic Aviator Sunglasses",
    description: "Timeless aviator design with polarized UV400 lenses and a lightweight metal frame.",
    price: 2500,
    originalPrice: 3200,
    category: "Accessories",
    brand: "SunVision",
    images: ["https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=800"],
    stock: 60,
    rating: 4.6,
    numReviews: 89,
    isTrending: true,
    tags: ["sunglasses", "summer", "fashion"]
  },
  {
    name: "SmartFit Fitness Tracker",
    description: "Advanced fitness band with heart rate monitoring, sleep tracking, and 14-day battery.",
    price: 3500,
    category: "Electronics",
    brand: "TechWear",
    images: ["https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&q=80&w=800"],
    stock: 80,
    rating: 4.2,
    numReviews: 145,
    tags: ["watch", "fitness", "smart", "wearable"]
  },
  {
    name: "Organic Cotton T-Shirt",
    description: "Super soft, 100% organic cotton t-shirt. Breathable and eco-friendly.",
    price: 999,
    originalPrice: 1500,
    category: "Clothing",
    brand: "EcoWear",
    images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800"],
    stock: 200,
    rating: 4.3,
    numReviews: 210,
    isTrending: true,
    tags: ["shirt", "cotton", "casual", "clothing"]
  },
  {
    name: "Professional Chef Knife",
    description: "High-carbon stainless steel chef knife with ergonomic handle for precision cutting.",
    price: 5500,
    category: "Home",
    brand: "CulinaryPro",
    images: ["https://images.unsplash.com/photo-1593618998160-e34014e67546?auto=format&fit=crop&q=80&w=800"],
    stock: 25,
    rating: 4.9,
    numReviews: 76,
    isFeatured: true,
    tags: ["kitchen", "cooking", "knife"]
  },
  {
    name: "Yoga Mat with Alignment Lines",
    description: "Eco-friendly, non-slip yoga mat with alignment markers to perfect your poses.",
    price: 1800,
    originalPrice: 2500,
    category: "Sports",
    brand: "ZenMaster",
    images: ["https://images.unsplash.com/photo-1601925260368-ae2f83cfecaa?auto=format&fit=crop&q=80&w=800"],
    stock: 90,
    rating: 4.8,
    numReviews: 134,
    tags: ["yoga", "fitness", "mat"]
  },
  {
    name: "Wireless Charging Pad",
    description: "Fast-charging 15W wireless pad compatible with all Qi-enabled devices.",
    price: 1200,
    category: "Electronics",
    brand: "ChargeTech",
    images: ["https://images.unsplash.com/photo-1622445272461-c45802011da7?auto=format&fit=crop&q=80&w=800"],
    stock: 150,
    rating: 4.4,
    numReviews: 45,
    tags: ["charger", "wireless", "tech"]
  }
];

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce_db';
    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected for Seeding...');

    await Product.deleteMany({});
    await User.deleteMany({});

    await Product.insertMany(products);
    console.log('Products Seeded Successfully!');

    const adminPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      name: 'Admin User',
      email: 'admin@zencart.com',
      password: adminPassword,
      role: 'admin',
      isVerified: true
    });
    console.log('Admin User Created! (admin@zencart.com / admin123)');

    process.exit(0);
  } catch (err) {
    console.error(`Seeding error: ${err.message}`);
    process.exit(1);
  }
};

seedData();
