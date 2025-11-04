const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();

const contactRoutes = require("./routes/contact");
const productsRoutes = require("./routes/products");
const adsRoutes = require("./routes/ads");
const wishlistRoutes = require("./routes/wishlist");
const reviewsRoutes = require("./routes/reviews");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// routes
app.use("/api/contact", contactRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/ads", adsRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/reviews", reviewsRoutes);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Backend running on ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
