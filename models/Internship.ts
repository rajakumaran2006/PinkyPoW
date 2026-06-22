import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IInternship extends Document {
  userId: mongoose.Types.ObjectId;
  company: string;
  role: string;
  matchPercentage?: number;
  status: 'Saved' | 'Applied' | 'Interviewing' | 'Rejected' | 'Offer' | 'Decided';
  applyLink?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  type?: 'internship' | 'fulltime';
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
    enum: ['Saved', 'Applied', 'Interviewing', 'Rejected', 'Offer', 'Decided'], 
    default: 'Saved',
    required: true
  },
  applyLink: { type: String, default: "" },
  location: { type: String, default: "" },
  startDate: { type: String, default: "" },
  endDate: { type: String, default: "" },
  description: { type: String, default: "" },
  type: { type: String, enum: ['internship', 'fulltime'], default: 'internship' }
}, {
  timestamps: true
});

export const Internship: Model<IInternship> = mongoose.models.Internship || mongoose.model<IInternship>('Internship', InternshipSchema);
