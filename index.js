import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import analyseStock from './routes/analyseStock.js';
import authRouter from './routes/auth/authRouter.js'
import {initDb} from './lib/initDb.js'

const app = express();
app.use(cors());
app.use(express.json());

app.use('/analyze',analyseStock);
app.use('/auth',authRouter)

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await initDb(); 

  app.listen(PORT, () => {
    console.log(` Backend running on port ${PORT}`);
  });
};

startServer();