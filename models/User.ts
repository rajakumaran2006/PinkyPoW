import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  clerkId: string;
  username?: string;
  password?: string;
  techStack: string[];
  placementScore: number;
  dailyStreak: number;
  platformUsernames: {
    leetcode?: string;
    hackerrank?: string;
    codechef?: string;
  };
  college?: string;
  collegeLocation?: string;
  collegeCountry?: string;
  collegeState?: string;
  course?: string;
  yearOfStudy?: string;
  interests?: string[];
  fullStackStack?: string;
  fullStackLevel?: string;
  fullStackBuiltApps?: string;
  profileCalibrationScore?: number;
  isProfileCalibrated?: boolean;
  gpa?: string;
  graduationDate?: string;
  priorHackathons?: string;
  preferredLocationType?: string;
  preferredRole?: string;
  certInterests?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  clerkId: { type: String, required: true, unique: true },
  username: { type: String, unique: true, sparse: true },
  password: { type: String },
  techStack: { type: [String], default: [] },
  placementScore: { type: Number, default: 0, min: 0, max: 1000 },
  dailyStreak: { type: Number, default: 5 },
  platformUsernames: {
    leetcode: { type: String, default: "" },
    hackerrank: { type: String, default: "" },
    codechef: { type: String, default: "" },
  },
  college: { type: String, default: "" },
  collegeLocation: { type: String, default: "" },
  collegeCountry: { type: String, default: "" },
  collegeState: { type: String, default: "" },
  course: { type: String, default: "" },
  yearOfStudy: { type: String, default: "" },
  interests: { type: [String], default: [] },
  fullStackStack: { type: String, default: "" },
  fullStackLevel: { type: String, default: "" },
  fullStackBuiltApps: { type: String, default: "" },
  profileCalibrationScore: { type: Number, default: 0 },
  isProfileCalibrated: { type: Boolean, default: false },
  gpa: { type: String, default: "" },
  graduationDate: { type: String, default: "" },
  priorHackathons: { type: String, default: "" },
  preferredLocationType: { type: String, default: "" },
  preferredRole: { type: String, default: "" },
  certInterests: { type: [String], default: [] }
}, {
  timestamps: true
});

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
