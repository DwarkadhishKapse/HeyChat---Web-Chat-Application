import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

//Connect Database
connectDB();

app.listen(PORT, () => {
  console.log(`HeyChat server running on http://localhost:5000`);
});
