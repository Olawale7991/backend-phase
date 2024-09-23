import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import userRouter from './routes/userRoutes.js';
import cors from 'cors';

dotenv.config();

const port = process.env.PORT;
const app = express();

// Enable CORS before defining routes
app.use(cors({
    origin: 'http://localhost:5173', // Allow requests from this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
    credentials: true, // Allow credentials if needed
}));

// Middleware to parse incoming requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Use the user router for your routes
app.use(userRouter);

app.listen(port, async () => {
    await connectDB();
    console.log(`server listening on port: ${port}`);
});
