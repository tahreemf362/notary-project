import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/database.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import joinRoutes from './routes/joinRoutes.js';
import evidenceRoutes from './routes/evidenceRoutes.js';

// 🆕 New import for face verification
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import * as faceapi from 'face-api.js';
import canvas from 'canvas';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as tf from '@tensorflow/tfjs-node';

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Serve static models folder for face-api
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use('/models', express.static(path.join(__dirname, 'models')));

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/join', joinRoutes);
app.use('/api/evidence', evidenceRoutes);

//////////////////////////////////////////////////////
// 🆕 FACE VERIFICATION SETUP START
//////////////////////////////////////////////////////

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

// Canvas binding (required by face-api)
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

// Load models once (server startup)
const modelPath = path.join(__dirname, 'models');
Promise.all([
  faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath),
  faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath),
  faceapi.nets.faceRecognitionNet.loadFromDisk(modelPath),
])
  .then(() => console.log('✅ Face-API Models Loaded'))
  .catch((err) => console.error('❌ Model loading error:', err));

// Compare faces
app.post('/api/verify-face', upload.fields([
  { name: 'liveImage', maxCount: 1 },
  { name: 'cnicImage', maxCount: 1 }
]), async (req, res) => {
  try {
    if (!req.files || !req.files.liveImage || !req.files.cnicImage) {
      return res.status(400).json({ success: false, message: 'Both images are required' });
    }

    const livePath = req.files.liveImage[0].path;
    const cnicPath = req.files.cnicImage[0].path;

    // Load both images
    const liveImage = await canvas.loadImage(livePath);
    const cnicImage = await canvas.loadImage(cnicPath);

    // Detect face descriptors
    const liveDesc = await faceapi
      .detectSingleFace(liveImage)
      .withFaceLandmarks()
      .withFaceDescriptor();
    const cnicDesc = await faceapi
      .detectSingleFace(cnicImage)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!liveDesc || !cnicDesc) {
      return res.status(400).json({ success: false, message: 'Face not detected properly in one or both images' });
    }

    // Calculate Euclidean distance
    const distance = faceapi.euclideanDistance(liveDesc.descriptor, cnicDesc.descriptor);
    const similarity = ((1 - distance) * 100).toFixed(2);

    // 80%+ means valid
    if (similarity >= 80) {
      res.json({
        success: true,
        match: true,
        similarity,
        message: `✅ Face Match Successful (${similarity}%)`
      });
    } else {
      res.json({
        success: true,
        match: false,
        similarity,
        message: `❌ Face Mismatch (${similarity}%)`
      });
    }

    // Optionally delete uploaded images
    fs.unlinkSync(livePath);
    fs.unlinkSync(cnicPath);

  } catch (error) {
    console.error('Face verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during face verification',
      error: error.message
    });
  }
});

//////////////////////////////////////////////////////
// 🆕 FACE VERIFICATION SETUP END
//////////////////////////////////////////////////////

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Project-Nos API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      admin: '/api/admin',
      join: '/api/join',
      evidence: '/api/evidence',
      verifyFace: '/api/verify-face',
      health: '/health'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 Project-Nos Backend Server                           ║
║                                                           ║
║   📡 Server running on port: ${PORT}                      ║
║   🌍 Environment: ${process.env.NODE_ENV || 'development'}                   ║
║   🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}    ║
║                                                           ║
║   ✅ Face Verification Endpoint Added: /api/verify-face   ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

export default app;
