import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  rating: { type: Number, default: 800 },
  solvedProblems: [String]
});
export default mongoose.models.User || mongoose.model('User', UserSchema);
