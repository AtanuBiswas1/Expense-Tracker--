import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type:Date,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  status:{
    type:String,
    default:"Expence"
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Expense = mongoose.model('Expense', ExpenseSchema);
