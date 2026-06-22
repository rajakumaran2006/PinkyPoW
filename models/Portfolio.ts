import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICertificate {
  title: string;
  issuer: string;
  cloudinaryImageUrl?: string;
  isAiValidated: boolean;
  date?: string;
  link?: string;
  category?: 'Cloud' | 'AI' | 'Frontend' | 'Backend' | 'General';
}

export interface IProjectPhaseTask {
  id: string;
  name: string;
  completed: boolean;
}

export interface IProjectPhase {
  name: string;
  tasks: IProjectPhaseTask[];
}

export interface IProject {
  title: string;
  techStack: string[];
  description: string;
  cloudinaryImageUrl?: string;
  repoLink?: string;
  phases?: IProjectPhase[];
}

export interface IPortfolio extends Document {
  userId: mongoose.Types.ObjectId;
  projects: IProject[];
  certificates: ICertificate[];
  createdAt: Date;
  updatedAt: Date;
}

const ProjectPhaseTaskSchema = new Schema<IProjectPhaseTask>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  completed: { type: Boolean, default: false }
});

const ProjectPhaseSchema = new Schema<IProjectPhase>({
  name: { type: String, required: true },
  tasks: { type: [ProjectPhaseTaskSchema], default: [] }
});

const ProjectSchema = new Schema<IProject>({
  title: { type: String, required: true },
  techStack: { type: [String], default: [] },
  description: { type: String, default: "" },
  cloudinaryImageUrl: { type: String, default: "" },
  repoLink: { type: String, default: "" },
  phases: { type: [ProjectPhaseSchema], default: [] }
});

const CertificateSchema = new Schema<ICertificate>({
  title: { type: String, required: true },
  issuer: { type: String, required: true },
  cloudinaryImageUrl: { type: String, default: "" },
  isAiValidated: { type: Boolean, default: false },
  date: { type: String, default: "" },
  link: { type: String, default: "" },
  category: { type: String, enum: ['Cloud', 'AI', 'Frontend', 'Backend', 'General'], default: 'General' }
});

const PortfolioSchema = new Schema<IPortfolio>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  projects: { type: [ProjectSchema], default: [] },
  certificates: { type: [CertificateSchema], default: [] }
}, {
  timestamps: true
});

export const Portfolio: Model<IPortfolio> = mongoose.models.Portfolio || mongoose.model<IPortfolio>('Portfolio', PortfolioSchema);

