import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDSA extends Document {
  userId: mongoose.Types.ObjectId;
  currentTrack: '30_Days' | '45_Days' | '90_Days';
  dailyHours: number;
  completedProblems: string[];
  createdAt: Date;
  updatedAt: Date;
}

const DSASchema = new Schema<IDSA>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  currentTrack: { 
    type: String, 
    enum: ['30_Days', '45_Days', '90_Days'], 
    default: '30_Days',
    required: true
  },
  dailyHours: { type: Number, default: 0 },
  completedProblems: { type: [String], default: [] }
}, {
  timestamps: true
});

export const DSA: Model<IDSA> = mongoose.models.DSA || mongoose.model<IDSA>('DSA', DSASchema);
