import express from 'express';
import bodyParser from 'body-parser';
import itemRoutes from './routes/itemRoutes';
import { errorHandler } from './middlewares/errorHandler';
import connectDB from './config/database';

const app = express();

// Connect to the database
connectDB();

app.use(bodyParser.json());

app.use('/api', itemRoutes);

// Error handler middleware should be the last middleware
app.use(errorHandler);

export default app;
