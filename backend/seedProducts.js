// scripts/seedProducts.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");

dotenv.config(); // Load .env file (for MONGO_URI)

// --- MongoDB Connection ---
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// --- Sample Seed Data ---
const sampleProducts = [
  {
    name: "Nike Air Zoom Pegasus 40",
    slug: "nike-air-zoom-pegasus-40",
    description:
      "Experience comfort and speed with the Nike Air Zoom Pegasus 40 running shoes.",
    brand: "Nike",
    category: "Shoes",
    tags: ["running", "men", "sport"],
    basePrice: 18000,
    variants: [
      {
        color: "Black",
        colorCode: "#000000",
        images: [
          "https://example.com/images/nike-black-1.jpg",
          "https://example.com/images/nike-black-2.jpg",
        ],
        model3d: "https://example.com/models/nike_black.glb",
        arOverlay: "https://example.com/ar/nike_black.usdz",
        price: 18500,
        originalPrice: 20000,
        sizes: [
          {
            sizeLabel: "M",
            countrySizes: { US: "9", UK: "8", EU: "42", AU: "8", JP: "27" },
            stock: 12,
            sku: "NK-PGS-BLK-M",
          },
          {
            sizeLabel: "L",
            countrySizes: { US: "10", UK: "9", EU: "43", AU: "9", JP: "28" },
            stock: 8,
            sku: "NK-PGS-BLK-L",
          },
        ],
      },
      {
        color: "White",
        colorCode: "#FFFFFF",
        images: [
          "https://example.com/images/nike-white-1.jpg",
          "https://example.com/images/nike-white-2.jpg",
        ],
        model3d: "https://example.com/models/nike_white.glb",
        arOverlay: "https://example.com/ar/nike_white.usdz",
        price: 19000,
        originalPrice: 21000,
        sizes: [
          {
            sizeLabel: "M",
            countrySizes: { US: "9", UK: "8", EU: "42", AU: "8", JP: "27" },
            stock: 5,
            sku: "NK-PGS-WHT-M",
          },
        ],
      },
    ],
    rating: 4.6,
    totalSold: 342,
    isDeal: true,
    dealEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // ends in 7 days
  },
  {
    name: "Adidas Ultraboost 23",
    slug: "adidas-ultraboost-23",
    description: "Premium comfort running shoe with Boost cushioning.",
    brand: "Adidas",
    category: "Shoes",
    tags: ["running", "unisex", "comfort"],
    basePrice: 22000,
    variants: [
      {
        color: "Grey",
        colorCode: "#888888",
        images: [
          "https://example.com/images/adidas-grey-1.jpg",
          "https://example.com/images/adidas-grey-2.jpg",
        ],
        price: 22500,
        originalPrice: 24000,
        sizes: [
          {
            sizeLabel: "S",
            countrySizes: { US: "7", UK: "6", EU: "40", AU: "6", JP: "25" },
            stock: 15,
            sku: "AD-UB23-GRY-S",
          },
          {
            sizeLabel: "M",
            countrySizes: { US: "9", UK: "8", EU: "42", AU: "8", JP: "27" },
            stock: 10,
            sku: "AD-UB23-GRY-M",
          },
        ],
      },
    ],
    rating: 4.8,
    totalSold: 529,
    isDeal: false,
  },
  {
    name: "Apple AirPods Pro (2nd Gen)",
    slug: "apple-airpods-pro-2",
    description:
      "Noise-cancelling wireless earbuds with improved sound and battery life.",
    brand: "Apple",
    category: "Electronics",
    tags: ["audio", "wireless", "apple"],
    basePrice: 95000,
    variants: [
      {
        color: "White",
        colorCode: "#FFFFFF",
        images: [
          "https://example.com/images/airpods-1.jpg",
          "https://example.com/images/airpods-2.jpg",
        ],
        price: 95000,
        originalPrice: 99900,
        sizes: [],
      },
    ],
    rating: 4.9,
    totalSold: 2451,
    isDeal: true,
    dealEnd: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  },
];

async function seedProducts() {
  try {
    await Product.deleteMany({});
    console.log("🗑️ Cleared existing products");

    const created = await Product.insertMany(sampleProducts);
    console.log(`✅ Inserted ${created.length} products`);

    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
}

seedProducts();
