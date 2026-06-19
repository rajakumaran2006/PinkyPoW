import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  clerkId: string;
  techStack: string[];
  placementScore: number;
  platformUsernames: {
    leetcode?: string;
    hackerrank?: string;
    codechef?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  clerkId: { type: String, required: true, unique: true },
  techStack: { type: [String], default: [] },
  placementScore: { type: Number, default: 0, min: 0, max: 1000 },
  platformUsernames: {
    leetcode: { type: String, default: "" },
    hackerrank: { type: String, default: "" },
    codechef: { type: String, default: "" },
  }
}, {
  timestamps: true
});

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
