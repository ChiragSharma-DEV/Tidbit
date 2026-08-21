import mongoose, { Schema, Model } from 'mongoose';
import { INicheCurriculum, CurriculumNode } from '@/types';

const CurriculumCardSchema = new Schema(
  {
    id: { type: String, required: true },
    conceptKey: { type: String, required: true },
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
  },
  { _id: false }
);

const CurriculumNodeSchema = new Schema<CurriculumNode>(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    estimatedTime: { type: Number, required: true },
    cards: [CurriculumCardSchema],
  },
  { _id: false }
);

const NicheCurriculumSchema = new Schema<INicheCurriculum>(
  {
    nicheId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    nodes: [CurriculumNodeSchema],
  },
  {
    timestamps: true,
  }
);

NicheCurriculumSchema.index({ nicheId: 1 });

const NicheCurriculum: Model<INicheCurriculum> =
  mongoose.models.NicheCurriculum ||
  mongoose.model<INicheCurriculum>('NicheCurriculum', NicheCurriculumSchema);

export default NicheCurriculum;
