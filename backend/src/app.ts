import dotenv from 'dotenv';
dotenv.config();
import express, { Application, Request, Response } from 'express';
import connectDB from './config/db';
import volunteerRoutes from './routes/volunteer.routes';
import cors from 'cors';

const app: Application = express();

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/volunteer', volunteerRoutes);

// Connect to Database
connectDB();

// Test Route
app.get('/', (req: Request, res: Response) => {
    res.send('Hello World from TypeScript!');
});

const port = process.env.PORT || 8082;
app.listen(port, () => console.log(`Server running on port ${port}`));