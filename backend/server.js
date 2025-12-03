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
const orderRoutes = require('./routes/orders');
const promoRoutes = require('./routes/promos');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');

const app = express();
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// routes
app.use("/api/contact", contactRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/ads", adsRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/promos', promoRoutes);

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.get("/", (req, res) => {
  res.send("Backend running");
});

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));