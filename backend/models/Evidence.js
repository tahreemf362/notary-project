import mongoose from 'mongoose';

const evidenceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  files: [{
    filename: String,
    originalName: String,
    path: String,
    mimeType: String,
    size: Number,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  notarizedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'notarized', 'rejected'],
    default: 'pending'
  },
  notarizedAt: Date,
  videoRecordingUrl: String,
  audioRecordingUrl: String,
  notaryNotes: String,
  metadata: {
    ipAddress: String,
    deviceInfo: String,
    location: String
  }
}, {
  timestamps: true
});

const Evidence = mongoose.model('Evidence', evidenceSchema);

export default Evidence;
