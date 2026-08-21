import mongoose, { Schema, Model } from 'mongoose';
import { IFeedCard } from '@/types';

const FeedCardSchema = new Schema<IFeedCard>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course ID is required'],
    },
    conceptKey: {
      type: String,
      required: [true, 'Concept key is required'],
      trim: true,
    },
    order: {
      type: Number,
      required: [true, 'Card order is required'],
      min: [0, 'Order must be non-negative'],
    },
    variants: {
      short: {
        headline: { type: String, required: true },
        summary: { type: String, required: true },
        takeaway: { type: String, required: true },
      },
      medium: {
        summary: { type: String, required: true },
        explanation: { type: String, required: true },
        bullets: [{ type: String }],
        example: { type: String, required: true },
      },
      long: {
        title: { type: String, required: true },
        introduction: { type: String, required: true },
        content: { type: String, required: true },
        takeaways: [{ type: String }],
      },
    },
    activeRecallQuiz: {
      id: { type: String },
      nodeId: { type: String },
      question: { type: String },
      options: [
        {
          id: { type: String },
          text: { type: String },
          isCorrect: { type: Boolean },
          explanation: { type: String },
        },
      ],
      refresherCard: {
        title: { type: String },
        summary: { type: String },
        keyTakeaway: { type: String },
        bulletPoints: [{ type: String }],
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
FeedCardSchema.index({ courseId: 1 });
FeedCardSchema.index({ courseId: 1, order: 1 });

const FeedCard: Model<IFeedCard> =
  mongoose.models.FeedCard || mongoose.model<IFeedCard>('FeedCard', FeedCardSchema);

export default FeedCard;
