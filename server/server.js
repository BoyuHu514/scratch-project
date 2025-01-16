import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes.js';
import oauthRoutes from './routes/oauthRoutes.js';
import exerciseRoutes from './routes/exerciseRoutes.js';
import medicationRoutes from './routes/medRoutes.js';

// PORT defined in .env or defaults to 3000
const PORT = process.env.PORT || 3000;
const app = express();

// Enable CORS (Cross-Origin Resource Sharing)
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/user', userRoutes); // normal user signup/login
app.use('/api/oauth', oauthRoutes); // GitHub OAuth
app.use('/api/exercise', exerciseRoutes);
app.use('/api/medications', medicationRoutes);
// 404 or “Not Found” Handler
app.use((_req, _res, next) => {
  const error = new Error('Route Not Found');
  error.status = 404;
  next(error);
});

// Error handler (Note: the signature is usually (err, req, res, next))
app.use((err, _req, res) => {
  // Default error object
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };

  const errorObj = Object.assign({}, defaultErr, err);
  // Log the error object
  console.log('Error object:', errorObj);

  return res.status(errorObj.status).json(errorObj.message);
});

// MongoDB connection string from .env
const MONGO_URI =
  'mongodb+srv://Boyu:y5EbF1PuTBr1BVpS@codesmith.gyb8i.mongodb.net/?retryWrites=true&w=majority&appName=Codesmith';
// const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error(MONGO_URI);
  process.exit(1);
}

// MongoClientOptions object to set the Stable API version
const clientOptions = {
  serverApi: { version: '1', strict: true, deprecationErrors: true },
};

// Start the server after connecting to MongoDB
async function startServer() {
  try {
    // Attempt to connect to MongoDB
    await mongoose.connect(MONGO_URI, clientOptions);
    console.log('Successfully connected to MongoDB!');

    // If DB connection is successful, start the server
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    // If DB connection fails, log the error and exit
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
}

// Gracefully shut down server when you CTRL-C
process.on('SIGINT', async () => {
  console.log('Received SIGINT. Graceful shutdown start');
  await mongoose.disconnect();
  process.exit(0);
});

// Initiate the startup sequence
startServer();
