import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IInternship extends Document {
  userId: mongoose.Types.ObjectId;
  company: string;
  role: string;
  matchPercentage?: number;
  status: 'Saved' | 'Applied' | 'Interviewing' | 'Rejected' | 'Offer';
  applyLink?: string;
  createdAt: Date;
  updatedAt: Date;
}

const InternshipSchema = new Schema<IInternship>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  company: { type: String, required: true },
  role: { type: String, required: true },
  matchPercentage: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['Saved', 'Applied', 'Interviewing', 'Rejected', 'Offer'], 
    default: 'Saved',
    required: true
  },
  applyLink: { type: String, default: "" }
}, {
  timestamps: true
});

export const Internship: Model<IInternship> = mongoose.models.Internship || mongoose.model<IInternship>('Internship', InternshipSchema);
