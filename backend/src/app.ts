import dotenv from 'dotenv';
import express, { Application, Request, Response } from 'express';
import connectDB from './config/db.js';
import volunteerRoutes from './routes/volunteer.js';
import authRoutes from "./routes/auth.routes.js"
import cors from 'cors';

dotenv.config()
const app: Application = express();

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/volunteer', volunteerRoutes);
app.use("/api/auth", authRoutes);

// Connect to Database
connectDB();

// Test Route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World from TypeScript!');
});

const port = process.env.PORT || 8082;
app.listen(port, () => console.log(`Server running on port ${port}`));
