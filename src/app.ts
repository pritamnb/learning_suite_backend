import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import sparkRoutes from './routes/sparkRoutes';
import adaRoutes from './routes/adaRoutes';

import { errorHandler } from './middleware/errorHandler';
import cors from 'cors';
import { setupAdaProject } from './utils/projectSetup';

const app = express();
// Initialize the SPARK Ada project setup
setupAdaProject();
// Cross origin resource sharing 
const allowedOrigins = ['*', 'http://localhost:3000'];

const options: cors.CorsOptions = {
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};
app.use(cors(options));

app.use(bodyParser.json());
app.get('/hello', (req, res) => {
    res.json({
        message: "Hello from Spark Ada learning suite!"
    })
})
app.use('/api', adaRoutes);
app.use('/api', sparkRoutes);

// Error handler middleware should be the last middleware
app.use(errorHandler);

export default app;
