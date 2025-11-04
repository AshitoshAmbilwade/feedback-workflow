import mongoose, { Schema, model, models } from 'mongoose';

const FeedbackRequestSchema = new Schema(
  {
    hrUserId: { type: String, required: true },
    hrEmail: { type: String, required: true },
    hrName: { type: String, required: true },
    clientEmail: { type: String, required: true },
    clientName: { type: String, required: true },
    token: { type: String, required: true },
    status: { type: String, default: 'pending' },
    submittedAt: { type: Date },
  },
  { timestamps: true }
);

const FeedbackRequest =
  models.FeedbackRequest || model('FeedbackRequest', FeedbackRequestSchema);

export default FeedbackRequest;
