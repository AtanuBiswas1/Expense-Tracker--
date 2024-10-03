import mongoose from "mongoose";

const BudgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status:{
    type:String,
    default:"Income"
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Budget = mongoose.model('Budget', BudgetSchema);
