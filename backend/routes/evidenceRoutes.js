import express from 'express';
import { protect, authorize, requireNotaryVerification } from '../middleware/auth.js';
import Evidence from '../models/Evidence.js';
import { body } from 'express-validator';
import { validate } from '../middleware/validator.js';

const router = express.Router();

// Validation for creating evidence
const createEvidenceValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required')
];

// @desc    Create new evidence/document
// @route   POST /api/evidence
// @access  Private
router.post('/', protect, createEvidenceValidation, validate, async (req, res) => {
  try {
    const { title, description, files } = req.body;

    const evidence = await Evidence.create({
      title,
      description,
      uploadedBy: req.user._id,
      files: files || [],
      status: 'pending'
    });

    await evidence.populate('uploadedBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Evidence created successfully',
      evidence
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating evidence',
      error: error.message
    });
  }
});

// @desc    Get all evidence (user's own or all for notary/admin)
// @route   GET /api/evidence
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let query = {};

    // Regular users can only see their own evidence
    if (req.user.role === 'user') {
      query.uploadedBy = req.user._id;
    }
    // Notaries can see evidence assigned to them or pending
    else if (req.user.role === 'notary') {
      query = {
        $or: [
          { notarizedBy: req.user._id },
          { status: 'pending' },
          { status: 'in-progress', notarizedBy: req.user._id }
        ]
      };
    }
    // Admins can see all evidence

    const evidence = await Evidence.find(query)
      .populate('uploadedBy', 'name email')
      .populate('notarizedBy', 'name email')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: evidence.length,
      evidence
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching evidence'
    });
  }
});

// @desc    Get single evidence by ID
// @route   GET /api/evidence/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const evidence = await Evidence.findById(req.params.id)
      .populate('uploadedBy', 'name email phone')
      .populate('notarizedBy', 'name email phone notaryCredentials');

    if (!evidence) {
      return res.status(404).json({
        success: false,
        message: 'Evidence not found'
      });
    }

    // Check access permissions
    const isOwner = evidence.uploadedBy._id.toString() === req.user._id.toString();
    const isAssignedNotary = evidence.notarizedBy && evidence.notarizedBy._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAssignedNotary && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this evidence'
      });
    }

    res.status(200).json({
      success: true,
      evidence
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching evidence'
    });
  }
});

// @desc    Update evidence
// @route   PUT /api/evidence/:id
// @access  Private (Owner only)
router.put('/:id', protect, async (req, res) => {
  try {
    let evidence = await Evidence.findById(req.params.id);

    if (!evidence) {
      return res.status(404).json({
        success: false,
        message: 'Evidence not found'
      });
    }

    // Only owner can update (unless it's already notarized)
    if (evidence.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this evidence'
      });
    }

    if (evidence.status === 'notarized') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update notarized evidence'
      });
    }

    const { title, description, files } = req.body;

    evidence = await Evidence.findByIdAndUpdate(
      req.params.id,
      { title, description, files },
      { new: true, runValidators: true }
    ).populate('uploadedBy', 'name email');

    res.status(200).json({
      success: true,
      message: 'Evidence updated successfully',
      evidence
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating evidence'
    });
  }
});

// @desc    Assign notary to evidence (Notary can self-assign)
// @route   PUT /api/evidence/:id/assign
// @access  Private/Notary/Admin
router.put('/:id/assign', protect, authorize('notary', 'admin'), requireNotaryVerification, async (req, res) => {
  try {
    const evidence = await Evidence.findById(req.params.id);

    if (!evidence) {
      return res.status(404).json({
        success: false,
        message: 'Evidence not found'
      });
    }

    if (evidence.status === 'notarized') {
      return res.status(400).json({
        success: false,
        message: 'Evidence is already notarized'
      });
    }

    evidence.notarizedBy = req.user._id;
    evidence.status = 'in-progress';
    await evidence.save();

    await evidence.populate('uploadedBy', 'name email');
    await evidence.populate('notarizedBy', 'name email');

    res.status(200).json({
      success: true,
      message: 'Notary assigned successfully',
      evidence
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error assigning notary'
    });
  }
});

// @desc    Complete notarization
// @route   PUT /api/evidence/:id/notarize
// @access  Private/Notary
router.put('/:id/notarize', protect, authorize('notary'), requireNotaryVerification, async (req, res) => {
  try {
    const { notaryNotes, videoRecordingUrl, audioRecordingUrl } = req.body;

    const evidence = await Evidence.findById(req.params.id);

    if (!evidence) {
      return res.status(404).json({
        success: false,
        message: 'Evidence not found'
      });
    }

    // Only assigned notary can complete notarization
    if (!evidence.notarizedBy || evidence.notarizedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not assigned to this evidence'
      });
    }

    if (evidence.status === 'notarized') {
      return res.status(400).json({
        success: false,
        message: 'Evidence is already notarized'
      });
    }

    evidence.status = 'notarized';
    evidence.notarizedAt = new Date();
    evidence.notaryNotes = notaryNotes;
    evidence.videoRecordingUrl = videoRecordingUrl;
    evidence.audioRecordingUrl = audioRecordingUrl;
    
    await evidence.save();
    await evidence.populate('uploadedBy', 'name email');
    await evidence.populate('notarizedBy', 'name email');

    res.status(200).json({
      success: true,
      message: 'Evidence notarized successfully',
      evidence
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error notarizing evidence'
    });
  }
});

// @desc    Delete evidence
// @route   DELETE /api/evidence/:id
// @access  Private (Owner or Admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    const evidence = await Evidence.findById(req.params.id);

    if (!evidence) {
      return res.status(404).json({
        success: false,
        message: 'Evidence not found'
      });
    }

    // Only owner or admin can delete
    const isOwner = evidence.uploadedBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this evidence'
      });
    }

    if (evidence.status === 'notarized') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete notarized evidence'
      });
    }

    await evidence.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Evidence deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting evidence'
    });
  }
});

export default router;
