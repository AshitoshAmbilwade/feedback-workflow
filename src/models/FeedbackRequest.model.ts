import mongoose from 'mongoose';

export interface IFeedbackRequest extends mongoose.Document {
  hrUserId: mongoose.Types.ObjectId;
  clientEmail: string;
  clientName: string;
  status: 'pending' | 'submitted' | 'expired';
  token: string;
  submittedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const feedbackRequestSchema = new mongoose.Schema({
  hrUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  clientEmail: {
    type: String,
    required: true,
  },
  clientName: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'submitted', 'expired'],
    default: 'pending',
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
  submittedAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

export default mongoose.models.FeedbackRequest || mongoose.model<IFeedbackRequest>('FeedbackRequest', feedbackRequestSchema);