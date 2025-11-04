// run: node seed.js
const mongoose = require("mongoose");
require("dotenv").config();
const Product = require("./models/Product");
const Ad = require("./models/Ad");

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to Mongo");
  await Product.deleteMany({});
  await Ad.deleteMany({});
  const now = Date.now();
  
  const products = [
    {
      name: "Wireless Earbuds X1",
      description: "True wireless earbuds with noise cancellation.",
      price: 24.99,
      originalPrice: 49.99,
      category: "Electronics",
      brand: "SoundX",
      sizes: [],
      colors: ["Black", "White"],
      images: ["https://xmobile.lk/wp-content/uploads/2025/07/Haylou-X1-Plus.png",
        "https://gadgetceylon.lk/wp-content/uploads/2024/08/Haylou-X1plus_1080-11.webp"
      ],
      inStock: true,
      rating: 4.4,
      totalRatings: 128,
      isDeal: true,
      dealEnd: new Date(now + 1000 * 60 * 60 * 12), // 12 hours from now
    },
    {
      name: "Comfort Running Shoes",
      description: "Breathable, lightweight running shoes.",
      price: 39.99,
      originalPrice: 79.99,
      category: "Fashion",
      brand: "RunPro",
      sizes: ["7", "8", "9", "10"],
      colors: ["Blue", "Gray"],
      images: ["https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_750,h_750/global/310753/02/sv05/fnd/IND/fmt/png/Widerer-Men's-Running-Shoes",
        "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_750,h_750/global/310753/02/dt06/fnd/IND/fmt/png/Widerer-Men's-Running-Shoes"
      ],
      inStock: true,
      rating: 4.6,
      totalRatings: 220,
      isDeal: true,
      dealEnd: new Date(now + 1000 * 60 * 60 * 48), // 48 hours
    },
    {
      name: "Kitchen Knife Set (5pcs)",
      description: "Stainless steel knives with wooden block.",
      price: 29.5,
      originalPrice: 59.0,
      category: "Home",
      brand: "ChefMate",
      sizes: [],
      colors: ["Silver"],
      images: ["https://m.media-amazon.com/images/I/713FzOYpThS.jpg",
        "https://m.media-amazon.com/images/I/91aqwd2XvSS._AC_SL1500_.jpg"
      ],
      inStock: true,
      rating: 4.2,
      totalRatings: 86,
      isDeal: false,
    },
    {
      name: "Wireless Earbuds X1",
      description: "True wireless earbuds with noise cancellation.",
      price: 24.99,
      originalPrice: 49.99,
      category: "Electronics",
      brand: "SoundX",
      sizes: [],
      colors: ["Black", "White"],
      images: ["https://xmobile.lk/wp-content/uploads/2025/07/Haylou-X1-Plus.png",
        "https://gadgetceylon.lk/wp-content/uploads/2024/08/Haylou-X1plus_1080-11.webp"
      ],
      inStock: true,
      rating: 4.4,
      totalRatings: 128,
      isDeal: false,
      dealEnd: new Date(now + 1000 * 60 * 60 * 12), // 12 hours from now
    },
    // add more...
  ];
  const ads = [
    {
      title: "Mega Summer Sale — Up to 60% OFF",
      image: "https://cdn.shopify.com/s/files/1/0596/7000/3902/files/SUMMER_SALE_23..jpg?v=1688476109",
      link: "/products?isDeal=true",
      priority: 10,
      active: true,
    },
    {
      title: "Free Shipping Over $50",
      image: "https://images.milledcdn.com/2018-02-01/EDp1q83ikTV53K-W/xwROawrJTHWj.gif",
      link: "/products",
      priority: 5,
      active: true,
    },
  ];

  await Product.insertMany(products);
  await Ad.insertMany(ads);
  console.log("Seeded products and ads");
  mongoose.disconnect();
}

seed().catch((err) => { console.error(err); mongoose.disconnect(); });
