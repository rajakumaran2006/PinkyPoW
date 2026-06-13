import mongoose from 'mongoose';

const ProblemSchema = new mongoose.Schema({
  title: String,
  difficulty: String,
  statement: String,
  testCases: Array
});
export default mongoose.models.Problem || mongoose.model('Problem', ProblemSchema);
