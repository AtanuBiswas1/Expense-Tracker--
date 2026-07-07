// MockData.js
import { format, subDays } from 'date-fns';

// Supported Currencies
export const Currencies = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' }
];

// Target categories
export const ExpenseCategories = [
  { id: 'food', name: 'Food & Dining', color: '#EF4444', icon: 'Utensils', limit: 8000 },
  { id: 'shopping', name: 'Shopping', color: '#EC4899', icon: 'ShoppingBag', limit: 5000 },
  { id: 'transport', name: 'Transport & Auto', color: '#3B82F6', icon: 'Car', limit: 3000 },
  { id: 'utilities', name: 'Utilities & Bills', color: '#10B981', icon: 'Zap', limit: 4000 },
  { id: 'entertainment', name: 'Entertainment', color: '#8B5CF6', icon: 'Film', limit: 3500 },
  { id: 'housing', name: 'Housing & Rent', color: '#F59E0B', icon: 'Home', limit: 25000 },
  { id: 'healthcare', name: 'Healthcare', color: '#06B6D4', icon: 'HeartPulse', limit: 2000 },
  { id: 'travel', name: 'Travel & Trips', color: '#14B8A6', icon: 'Plane', limit: 10000 },
  { id: 'education', name: 'Education', color: '#6366F1', icon: 'BookOpen', limit: 5000 },
  { id: 'other_exp', name: 'Other Expenses', color: '#64748B', icon: 'HelpCircle', limit: 2000 }
];

export const IncomeCategories = [
  { id: 'salary', name: 'Salary', color: '#10B981', icon: 'Briefcase' },
  { id: 'business', name: 'Business Income', color: '#0EA5E9', icon: 'TrendingUp' },
  { id: 'freelancing', name: 'Freelancing', color: '#8B5CF6', icon: 'Laptop' },
  { id: 'investment', name: 'Investments & Dividends', color: '#F59E0B', icon: 'BarChart2' },
  { id: 'bonus', name: 'Bonus & Awards', color: '#EC4899', icon: 'Award' },
  { id: 'other_inc', name: 'Other Income', color: '#64748B', icon: 'DollarSign' }
];

// Accounts & Wallets
export const Wallets = [
  { id: 'wallet_bank', name: 'HDFC Checking', type: 'Bank Account', balance: 54200, color: 'from-indigo-500 via-purple-500 to-pink-500', icon: 'Building' },
  { id: 'wallet_cash', name: 'Cash Wallet', type: 'Cash Account', balance: 4500, color: 'from-emerald-400 to-teal-500', icon: 'DollarSign' },
  { id: 'wallet_upi', name: 'GPay UPI Link', type: 'UPI Account', balance: 12800, color: 'from-sky-400 to-blue-500', icon: 'Smartphone' },
  { id: 'wallet_cc', name: 'Sapphire Credit Card', type: 'Credit Card', limit: 150000, spent: 24350, color: 'from-slate-800 to-slate-950', icon: 'CreditCard' }
];

// Notification listings
export const InitialNotifications = [
  { id: 'notif-1', title: 'Budget Warning', message: 'You have spent 88% of your Food & Dining budget.', type: 'warning', time: '10 mins ago', read: false },
  { id: 'notif-2', title: 'Salary Credited', message: 'Your salary of ₹75,000 was successfully deposited.', type: 'success', time: '1 day ago', read: false },
  { id: 'notif-3', title: 'Bill Reminder', message: 'Netflix Premium subscription renewal of ₹649 is due in 3 days.', type: 'info', time: '2 days ago', read: true },
  { id: 'notif-4', title: 'Anomaly Detected', message: 'An unusual expense of ₹4,200 on Shopping at Zara was flagged.', type: 'danger', time: '3 days ago', read: true }
];

// Recurring Subscriptions
export const Subscriptions = [
  { id: 'sub-1', title: 'Netflix Premium', amount: 649, category: 'entertainment', billingCycle: 'monthly', nextBillingDate: format(subDays(new Date(), -3), 'yyyy-MM-dd'), status: 'active', wallet: 'wallet_cc' },
  { id: 'sub-2', title: 'Spotify Family Plan', amount: 179, category: 'entertainment', billingCycle: 'monthly', nextBillingDate: format(subDays(new Date(), -5), 'yyyy-MM-dd'), status: 'active', wallet: 'wallet_cc' },
  { id: 'sub-3', title: 'Adobe Creative Cloud', amount: 4230, category: 'utilities', billingCycle: 'monthly', nextBillingDate: format(subDays(new Date(), -8), 'yyyy-MM-dd'), status: 'active', wallet: 'wallet_bank' },
  { id: 'sub-4', title: 'Cult.Fit Gym Membership', amount: 12500, category: 'healthcare', billingCycle: 'yearly', nextBillingDate: format(subDays(new Date(), -12), 'yyyy-MM-dd'), status: 'active', wallet: 'wallet_bank' },
  { id: 'sub-5', title: 'Github Copilot', amount: 820, category: 'utilities', billingCycle: 'monthly', nextBillingDate: format(subDays(new Date(), -1), 'yyyy-MM-dd'), status: 'paused', wallet: 'wallet_upi' }
];

// Savings Goals
export const InitialGoals = [
  { id: 'goal-1', title: 'Emergency Fund', targetAmount: 150000, currentAmount: 110000, targetDate: '2026-12-31', category: 'Emergency Fund', status: 'active', icon: 'ShieldAlert' },
  { id: 'goal-2', title: 'MacBook Pro M4', targetAmount: 180000, currentAmount: 180000, targetDate: '2026-06-30', category: 'Custom Goal', status: 'completed', icon: 'Laptop' },
  { id: 'goal-3', title: 'Europe Eurotrip', targetAmount: 350000, currentAmount: 125000, targetDate: '2027-05-15', category: 'Travel', status: 'active', icon: 'Plane' },
  { id: 'goal-4', title: 'New Electric Car', targetAmount: 1200000, currentAmount: 420000, targetDate: '2028-10-01', category: 'Car', status: 'active', icon: 'Zap' }
];

// Helper to generate a realistic set of past transactions
const generateMockTransactions = () => {
  const list = [];
  const today = new Date();

  // Core Income entries
  list.push({
    id: 't-inc-1',
    title: 'Monthly Salary Credit',
    amount: 75000,
    category: 'salary',
    type: 'income',
    date: format(subDays(today, 6), 'yyyy-MM-dd'),
    time: '09:30',
    paymentMethod: 'Bank Transfer',
    wallet: 'wallet_bank',
    merchant: 'Acme Corporation',
    tags: ['salary', 'job', 'fixed'],
    notes: 'Regular salary deposit.',
    status: 'completed'
  });

  list.push({
    id: 't-inc-2',
    title: 'Freelance Frontend Dev',
    amount: 18500,
    category: 'freelancing',
    type: 'income',
    date: format(subDays(today, 2), 'yyyy-MM-dd'),
    time: '14:20',
    paymentMethod: 'UPI',
    wallet: 'wallet_upi',
    merchant: 'Upwork Client LLC',
    tags: ['freelance', 'react'],
    notes: 'Payment for landing page components.',
    status: 'completed'
  });

  list.push({
    id: 't-inc-3',
    title: 'Mutual Fund Dividend',
    amount: 4200,
    category: 'investment',
    type: 'income',
    date: format(subDays(today, 15), 'yyyy-MM-dd'),
    time: '11:00',
    paymentMethod: 'Bank Transfer',
    wallet: 'wallet_bank',
    merchant: 'Nippon India MF',
    tags: ['dividends', 'passive'],
    notes: 'Auto-credited',
    status: 'completed'
  });

  // Food Expense entries
  const foodMerchants = ['Swiggy', 'Zomato', 'Whole Foods', 'Starbucks', 'Dominos Pizza', 'Local Grocery Shop'];
  // Shopping Expense entries
  const shoppingMerchants = ['Amazon', 'Myntra', 'Zara', 'Nike Store', 'Uniqlo', 'Flipkart'];
  // Transport Expense entries
  const transportMerchants = ['Uber', 'Ola Cabs', 'HP Petrol Pump', 'Metro Rail Recharge'];
  // Entertainment
  const entMerchants = ['BookMyShow', 'Netflix', 'Spotify', 'Steam Games', 'Bowling Alley'];

  // Seed expenses over the last 30 days
  for (let i = 0; i < 45; i++) {
    const dayOffset = Math.floor(Math.random() * 30);
    const dateStr = format(subDays(today, dayOffset), 'yyyy-MM-dd');
    let title = '';
    let category = '';
    let amount = 0;
    let merchant = '';
    let paymentMethod = ['Credit Card', 'UPI', 'Cash', 'Debit Card'][Math.floor(Math.random() * 4)];
    let wallet = paymentMethod === 'Credit Card' ? 'wallet_cc' : (paymentMethod === 'UPI' ? 'wallet_upi' : (paymentMethod === 'Cash' ? 'wallet_cash' : 'wallet_bank'));
    let tags = [];

    const roll = Math.random();
    if (roll < 0.3) {
      category = 'food';
      merchant = foodMerchants[Math.floor(Math.random() * foodMerchants.length)];
      amount = Math.floor(Math.random() * 1200) + 150;
      title = amount > 800 ? `Dinner at ${merchant}` : `Coffee & Snacks at ${merchant}`;
      tags = ['food', 'dining'];
    } else if (roll < 0.5) {
      category = 'shopping';
      merchant = shoppingMerchants[Math.floor(Math.random() * shoppingMerchants.length)];
      amount = Math.floor(Math.random() * 4500) + 400;
      title = `Purchased clothes/items at ${merchant}`;
      tags = ['shopping', 'lifestyle'];
    } else if (roll < 0.7) {
      category = 'transport';
      merchant = transportMerchants[Math.floor(Math.random() * transportMerchants.length)];
      amount = Math.floor(Math.random() * 800) + 80;
      title = merchant.includes('HP') ? `Refueled vehicle at ${merchant}` : `Ride with ${merchant}`;
      tags = ['transport', 'commute'];
    } else if (roll < 0.8) {
      category = 'entertainment';
      merchant = entMerchants[Math.floor(Math.random() * entMerchants.length)];
      amount = Math.floor(Math.random() * 1500) + 200;
      title = `Movies/Subscriptions at ${merchant}`;
      tags = ['entertainment', 'leisure'];
    } else {
      // Utilities or other
      const utilityItems = [
        { name: 'Electricity Bill', cat: 'utilities', amt: 3500, merchant: 'State Electricity Board' },
        { name: 'Broadband Internet', cat: 'utilities', amt: 999, merchant: 'Airtel Fiber' },
        { name: 'Monthly Medicine refills', cat: 'healthcare', amt: 1200, merchant: 'Apollo Pharmacy' },
        { name: 'Online Coding Course', cat: 'education', amt: 2999, merchant: 'Udemy' },
        { name: 'Apartment Maintenance Charge', cat: 'housing', amt: 4500, merchant: 'RWA Society' }
      ];
      const item = utilityItems[Math.floor(Math.random() * utilityItems.length)];
      category = item.cat;
      merchant = item.merchant;
      amount = item.amt;
      title = item.name;
      tags = [item.cat, 'monthly-bills'];
    }

    list.push({
      id: `t-exp-${i}`,
      title,
      amount,
      category,
      type: 'expense',
      date: dateStr,
      time: `1${Math.floor(Math.random() * 9)}:${Math.floor(Math.random() * 5)}${Math.floor(Math.random() * 9)}`,
      paymentMethod,
      wallet,
      merchant,
      tags,
      notes: `Simulated transaction logged automatically on ${dateStr}`,
      status: 'completed'
    });
  }

  // Sort chronologically (newest first)
  return list.sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time));
};

export const InitialTransactions = generateMockTransactions();

// Health Diagnostics Score Card
export const FinancialHealthReport = {
  score: 84,
  status: 'Excellent',
  riskLevel: 'Low',
  suggestions: [
    'You spent 28% more on food this month than your usual average. Consider reducing dining out.',
    'Your subscription bills are stable, but Netflix is due. Move it to your GPay UPI autodebit to earn rewards.',
    'Increase monthly savings toward Emergency Fund. You are currently ₹40,000 away from target completion.',
    'Saturday is your highest spending day. Review weekend purchases.'
  ],
  insights: [
    { title: 'Food & Dining Expense', change: '+28%', label: 'vs last month', status: 'warning' },
    { title: 'Shopping Expenses', change: '+15%', label: 'average increase', status: 'warning' },
    { title: 'Transportation', change: '-8%', label: 'saving in commute', status: 'success' },
    { title: 'Highest Spending Day', change: 'Saturday', label: 'average spend ₹2,850', status: 'neutral' },
    { title: 'Average Daily Spending', change: '₹1,080', label: 'stable range', status: 'success' },
    { title: 'Projected Next Month Savings', change: '₹6,400', label: 'potential target', status: 'success' }
  ],
  predictions: [
    { type: 'Expense Forecast', value: '₹34,500', label: 'Expected next month outgo' },
    { type: 'Future Savings Prediction', value: '₹59,200', label: 'Accumulated within 90 days' },
    { type: 'Budget Completion Rate', value: '92.5%', label: 'Predicted categories safety' },
    { type: 'Cash Flow Projection', value: 'Positive (+ ₹18,400)', label: 'Net surplus status' }
  ]
};
