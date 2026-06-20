import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IHackathon extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  hosts?: string;
  date?: string;
  location?: string;
  isOnline?: boolean;
  prizePool?: string;
  category?: string;
  description?: string;
  skills: string[];
  status: 'Saved' | 'Applied' | 'Participated' | 'Shortlisted' | 'Won';
  shortlistedRounds?: number;
  applyLink?: string;
  createdAt: Date;
  updatedAt: Date;
}

const HackathonSchema = new Schema<IHackathon>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  hosts: { type: String, default: "" },
  date: { type: String, default: "" },
  location: { type: String, default: "" },
  isOnline: { type: Boolean, default: false },
  prizePool: { type: String, default: "" },
  category: { type: String, default: "" },
  description: { type: String, default: "" },
  skills: { type: [String], default: [] },
  status: { 
    type: String, 
    enum: ['Saved', 'Applied', 'Participated', 'Shortlisted', 'Won'], 
    default: 'Saved',
    required: true
  },
  shortlistedRounds: { type: Number, default: 0 },
  applyLink: { type: String, default: "" }
}, {
  timestamps: true
});

export const Hackathon: Model<IHackathon> = mongoose.models.Hackathon || mongoose.model<IHackathon>('Hackathon', HackathonSchema);
