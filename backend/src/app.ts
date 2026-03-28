import dotenv from 'dotenv';
import express, { Application, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import authRoutes from "./routes/auth.routes"
import cors from 'cors';
import connectDB from './config/db';
import volunteerRoutes from './routes/volunteer.routes';
import ngoRoutes from './routes/ngo.routes'

dotenv.config()
const app: Application = express();

// Middleware
app.use(cookieParser());
app.use(cors({ 
  origin: process.env.FRONTEND_URL, 
  credentials: true 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/volunteer', volunteerRoutes);
app.use("/api/auth", authRoutes);
app.use('/api/ngo', ngoRoutes);

// Connect to Database
connectDB();

// Test Route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World from TypeScript!');
});

const port = process.env.PORT || 8082;
app.listen(port, () => console.log(`Server running on port ${port}`));
