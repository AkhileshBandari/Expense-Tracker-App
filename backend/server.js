require("dotenv").config();

const jwtSecret = process.env.JWT_SECRET;
const dbUrl = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;
