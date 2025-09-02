import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import connectDB from "./config/db.js";

const PORT: number = parseInt(process.env.PORT || "5000", 10);

(async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start the server:", error);
    process.exit(1); 
  }
})();
