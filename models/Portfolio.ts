import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProject {
  title: string;
  techStack: string[];
  description: string;
  cloudinaryImageUrl?: string;
  repoLink?: string;
}

export interface ICertificate {
  title: string;
  issuer: string;
  cloudinaryImageUrl?: string;
  isAiValidated: boolean;
}

export interface IPortfolio extends Document {
  userId: mongoose.Types.ObjectId;
  projects: IProject[];
  certificates: ICertificate[];
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>({
  title: { type: String, required: true },
  techStack: { type: [String], default: [] },
  description: { type: String, default: "" },
  cloudinaryImageUrl: { type: String, default: "" },
  repoLink: { type: String, default: "" }
});

const CertificateSchema = new Schema<ICertificate>({
  title: { type: String, required: true },
  issuer: { type: String, required: true },
  cloudinaryImageUrl: { type: String, default: "" },
  isAiValidated: { type: Boolean, default: false }
});

const PortfolioSchema = new Schema<IPortfolio>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  projects: { type: [ProjectSchema], default: [] },
  certificates: { type: [CertificateSchema], default: [] }
}, {
  timestamps: true
});

export const Portfolio: Model<IPortfolio> = mongoose.models.Portfolio || mongoose.model<IPortfolio>('Portfolio', PortfolioSchema);
