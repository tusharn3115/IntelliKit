import express from 'express';
import cors from 'cors';
import "dotenv/config";
import { clerkMiddleware, requireAuth } from '@clerk/express'
import aiRouter from './routes/aiRoutes.js';
import connectCloudinary from './configs/cloudinary.js';
import userRouter from './routes/userRoutes.js';

const app = express();

await connectCloudinary();

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

app.get('/', (req, res) => {
    res.send('Server is live!');
});

// protect all routes after this middleware i.e only authenticated users can access
app.use(requireAuth());

app.use("/api/ai", aiRouter)
app.use("/api/user", userRouter)

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 