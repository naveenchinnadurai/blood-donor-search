import express from "express";
import dotenv from "dotenv";
import cors from 'cors'; 
import { Request, Response } from "express";
import donorsRoutes from './routers/donors.routes';

dotenv.config();

const PORT = process.env.PORT || 7000;

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({
    message:"Its working fine!!"
  })
});

app.use('/api/v1/donors/',donorsRoutes);

app.listen(PORT, () => {
  console.log(`Server is Running on http://localhost:${PORT}`);
});