import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import User from '../models/User.js';
import { body } from 'express-validator';
import { validate } from '../middleware/validator.js';

const router = express.Router();

// Validation for notary application
const notaryApplicationValidation = [
  body('licenseNumber').notEmpty().withMessage('License number is required'),
  body('state').notEmpty().withMessage('State is required'),
  body('expirationDate').isISO8601().withMessage('Valid expiration date is required')
];

// @desc    Apply to become a notary
// @route   POST /api/join/notary
// @access  Private
router.post('/notary', protect, notaryApplicationValidation, validate, async (req, res) => {
  try {
    const { licenseNumber, state, expirationDate } = req.body;

    const user = await User.findById(req.user._id);

    if (user.role === 'notary') {
      return res.status(400).json({
        success: false,
        message: 'You are already registered as a notary'
      });
    }

    // Update user to notary role with credentials
    user.role = 'notary';
    user.notaryCredentials = {
      licenseNumber,
      state,
      expirationDate: new Date(expirationDate),
      isVerified: false // Admin will verify
    };
    
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Notary application submitted successfully. Your credentials will be verified by an admin.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        notaryCredentials: user.notaryCredentials
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error submitting notary application',
      error: error.message
    });
  }
});

// @desc    Get notary application status
// @route   GET /api/join/notary/status
// @access  Private
router.get('/notary/status', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user.role !== 'notary') {
      return res.status(400).json({
        success: false,
        message: 'You have not applied to become a notary'
      });
    }

    res.status(200).json({
      success: true,
      status: {
        role: user.role,
        credentials: user.notaryCredentials,
        isVerified: user.notaryCredentials?.isVerified || false
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching notary status'
    });
  }
});

// @desc    Update notary credentials
// @route   PUT /api/join/notary/credentials
// @access  Private/Notary
router.put('/notary/credentials', protect, authorize('notary'), notaryApplicationValidation, validate, async (req, res) => {
  try {
    const { licenseNumber, state, expirationDate } = req.body;

    const user = await User.findById(req.user._id);

    user.notaryCredentials = {
      licenseNumber,
      state,
      expirationDate: new Date(expirationDate),
      isVerified: false // Needs re-verification after update
    };

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Notary credentials updated successfully. They will be re-verified by an admin.',
      credentials: user.notaryCredentials
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating notary credentials'
    });
  }
});

export default router;
