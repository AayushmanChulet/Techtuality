import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { MONGO_URL, PORT } from './config/config.js';
import router from './routes/index.js';
import connectDB from './config/db.js';

const app = express();
console.log(MONGO_URL);
connectDB(MONGO_URL);

app.use(express.json());
app.use("/api/v1", router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
