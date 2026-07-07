import mongoose from "mongoose";

const SavingsGoalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  targetAmount: {
    type: Number,
    required: true,
  },
  currentAmount: {
    type: Number,
    default: 0,
  },
  category: {
    type: String,
    default: "General",
  },
  targetDate: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const SavingsGoal = mongoose.model('SavingsGoal', SavingsGoalSchema);
