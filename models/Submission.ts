import mongoose from 'mongoose';

const SubmissionSchema = new mongoose.Schema({
  userId: String,
  problemId: String,
  code: String,
  status: String,
  timestamp: { type: Date, default: Date.now }
});
export default mongoose.models.Submission || mongoose.model('Submission', SubmissionSchema);
