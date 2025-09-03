import express from 'express';
import { PORT } from './config/config.js';
import router from './routes/index.js';

const app = express();

app.use(express.json());
app.use("/api/v1", router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
