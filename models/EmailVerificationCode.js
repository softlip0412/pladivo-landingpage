import mongoose from 'mongoose';

const EmailVerificationCodeSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  code: {
    type: String,
    required: true,
    length: 6
  },
  purpose: {
    type: String,
    enum: ['registration', 'account_update', 'password_reset'],
    required: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  expires_at: {
    type: Date,
    required: true,
    index: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Auto-delete expired codes
EmailVerificationCodeSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });

const EmailVerificationCode = mongoose.models.EmailVerificationCode || 
  mongoose.model('EmailVerificationCode', EmailVerificationCodeSchema);

export default EmailVerificationCode;
