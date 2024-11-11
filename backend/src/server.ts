import express from "express";
import dotenv from "dotenv";
import { Request, Response } from "express";
import donorsRoutes from './routers/donors.routes';

dotenv.config();

const PORT = process.env.PORT || 7000;

const app = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({
    message:"Its working fine!!"
  })
});

app.use('/donors',donorsRoutes);

app.listen(PORT, () => {
  console.log(`Server is Running on http://localhost:${PORT}`);
});
