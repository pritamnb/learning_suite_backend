import mongoose from 'mongoose';

const dbUrl = 'mongodb://localhost:27017/learning_suite';

const connectDB = async () => {
    try {
        await mongoose.connect(dbUrl);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1);
    }
};

mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

export default connectDB;
