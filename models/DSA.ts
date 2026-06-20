import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDSA extends Document {
  userId: mongoose.Types.ObjectId;
  currentTrack: '30_Days' | '45_Days' | '90_Days';
  dailyHours: number;
  completedProblems: string[];
  
  // Custom plan fields
  hasCustomPlan?: boolean;
  level?: 'Beginner' | 'Intermediate' | 'Advanced';
  totalDays?: number;
  problemsPerDay?: number;
  topics?: string[];
  planRoadmap?: Array<{
    day: number;
    topic: string;
    description: string;
  }>;
  currentDayIndex?: number;
  dailyProblems?: Array<{
    dayNumber: number;
    problems: Array<{
      id: string;
      title: string;
      description: string;
      difficulty: 'Easy' | 'Medium' | 'Hard';
      category: string;
      platform: 'LeetCode' | 'GeeksforGeeks' | 'CodeChef';
      url: string;
      codeTemplate: string;
      completed: boolean;
      solvedAt?: Date;
    }>;
  }>;
  
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
  completedProblems: { type: [String], default: [] },
  
  // Custom plan fields definitions
  hasCustomPlan: { type: Boolean, default: false },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Intermediate' },
  totalDays: { type: Number, default: 30 },
  problemsPerDay: { type: Number, default: 2 },
  topics: { type: [String], default: [] },
  planRoadmap: {
    type: [{
      day: { type: Number, required: true },
      topic: { type: String, required: true },
      description: { type: String, default: '' }
    }],
    default: []
  },
  currentDayIndex: { type: Number, default: 1 },
  dailyProblems: {
    type: [{
      dayNumber: { type: Number, required: true },
      problems: [{
        id: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, default: '' },
        difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
        category: { type: String, default: 'General' },
        platform: { type: String, enum: ['LeetCode', 'GeeksforGeeks', 'CodeChef'], required: true },
        url: { type: String, required: true },
        codeTemplate: { type: String, default: '' },
        completed: { type: Boolean, default: false },
        solvedAt: { type: Date }
      }]
    }],
    default: []
  }
}, {
  timestamps: true
});

export const DSA: Model<IDSA> = mongoose.models.DSA || mongoose.model<IDSA>('DSA', DSASchema);

