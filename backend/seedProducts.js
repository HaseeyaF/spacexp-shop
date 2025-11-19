const mongoose = require("mongoose");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const Product = require("./models/Product");
const Ad = require("./models/Ad");
const User = require("./models/User");
const Promo = require("./models/Promo");

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to Mongo");

  await Product.deleteMany({});
  await Ad.deleteMany({});
  await User.deleteMany({});
  await Promo.deleteMany({});

  const now = Date.now();

  // sample products with variants + 3D model placeholders
  const products = [
    {
      name: "Wireless Earbuds X1",
      description: "True wireless earbuds with noise cancellation.",
      brand: "SoundX",
      category: "Electronics",
      tags: ["audio", "wireless"],
      basePrice: 24.99,
      variants: [
        {
          color: "Black",
          colorCode: "#000000",
          images: ["https://picsum.photos/seed/earbuds-black/800/600"],
          model3d: "https://example.com/models/earbuds.glb",
          arOverlay: "https://picsum.photos/seed/earbuds-overlay/400/400",
          price: 24.99,
          originalPrice: 49.99,
          sizes: [],
        },
      ],
      isDeal: true,
      dealEnd: new Date(now + 1000 * 60 * 60 * 12),
      seoTitle: "Wireless Earbuds X1 - SoundX",
      seoDescription: "True wireless earbuds with long battery and ANC.",
      structuredData: {},
    },
    {
      name: "Comfort Running Shoes",
      description: "Breathable, lightweight running shoes.",
      brand: "RunPro",
      category: "Fashion",
      tags: ["shoes", "running"],
      basePrice: 39.99,
      variants: [
        {
          color: "Blue",
          colorCode: "#3b82f6",
          images: ["https://picsum.photos/seed/shoes-blue/800/600"],
          model3d: "",
          arOverlay: "",
          price: 39.99,
          originalPrice: 79.99,
          sizes: [
            {
              sizeLabel: "7",
              countrySizes: { US: "7", UK: "6", EU: "40" },
              stock: 10,
              sku: "SH-BL-7",
            },
            {
              sizeLabel: "8",
              countrySizes: { US: "8", UK: "7", EU: "41" },
              stock: 8,
              sku: "SH-BL-8",
            },
          ],
        },
      ],
      isDeal: true,
      dealEnd: new Date(now + 1000 * 60 * 60 * 48),
      seoTitle: "Comfort Running Shoes - RunPro",
      seoDescription: "Lightweight running shoes with cushioning.",
      structuredData: {},
    },
    {
      name: "Classic Leather Wallet",
      description: "Slim leather wallet with RFID protection.",
      brand: "LeatherCo",
      category: "Fashion",
      tags: ["wallet", "leather"],
      basePrice: 14.99,
      variants: [
        {
          color: "Brown",
          colorCode: "#8b5e3c",
          images: ["https://picsum.photos/seed/wallet-brown/800/600"],
          price: 14.99,
          sizes: [],
        },
      ],
      seoTitle: "Classic Leather Wallet",
      seoDescription: "Slim RFID wallet for everyday carry.",
      structuredData: {},
    },
    {
      name: "Red Sneakers",
      slug: "red-sneakers",
      description: "Stylish red sneakers",
      brand: "Brand A",
      category: "Footwear",
      tags: ["shoes", "sneakers", "red"],
      basePrice: 5000,
      variants: [
        {
          color: "Red",
          images: ["img1.jpg", "img2.jpg"],
          video: "https://example.com/videos/red_sneakers.mp4",
          price: 5200,
          deliveryDate: "2025-09-15",
          deliveryTime: "2-3 days",
          deliveryCharge: 200,
          preDeliveryCharge: 50,
        },
      ],
      similarProducts: [], // can be linked later
    },
  ];

  const ads = [
    {
      title: "Mega Summer Sale — Up to 60% OFF",
      image: "https://picsum.photos/seed/sale1/1200/300",
      link: "/products?isDeal=true",
      priority: 10,
      active: true,
    },
    {
      title: "Free Shipping Over $50",
      image: "https://picsum.photos/seed/sale2/1200/300",
      link: "/products",
      priority: 5,
      active: true,
    },
  ];

  const users = [
    {
      name: "Admin User",
      email: "admin@demo.com",
      password: "password",
      role: "admin",
    },
    {
      name: "Marketing",
      email: "marketing@demo.com",
      password: "password",
      role: "marketing",
    },
    {
      name: "Content",
      email: "content@demo.com",
      password: "password",
      role: "content",
    },
    {
      name: "Sales",
      email: "sales@demo.com",
      password: "password",
      role: "sales",
    },
    {
      name: "Customer",
      email: "user@demo.com",
      password: "password",
      role: "customer",
    },
  ];

  const promos = [
    {
      code: "WELCOME10",
      discountType: "percent",
      discountValue: 10,
      minAmount: 10,
      maxUses: 100,
      validFrom: new Date(now - 1000 * 60 * 60),
      validTo: new Date(now + 1000 * 60 * 60 * 24 * 30),
      active: true,
    },
    {
      code: "FLAT5",
      discountType: "fixed",
      discountValue: 5,
      minAmount: 20,
      maxUses: 100,
      active: true,
    },
  ];

  await Product.insertMany(products);
  await Ad.insertMany(ads);
  for (const u of users) {
    const hash = await bcrypt.hash(u.password, 10);
    const user = new User({
      name: u.name,
      email: u.email,
      passwordHash: hash,
      role: u.role,
    });
    await user.save();
  }
  await Promo.insertMany(promos);

  console.log("Seeded products, ads, users, promos");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  mongoose.disconnect();
});
