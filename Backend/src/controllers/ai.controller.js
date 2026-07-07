import { asyncHandaler } from "../utils/asyncHandaler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponce } from "../utils/ApiResponce.js";
import { Expense } from "../model/expence.model.js";
import { Budget } from "../model/budget.model.js";

const getAIAnalysis = asyncHandaler(async (req, resp) => {
  const userId = req.user._id;
  const { question } = req.body;

  // 1. Fetch user expenses and incomes
  const expenses = await Expense.find({ user: userId });
  const incomes = await Budget.find({ user: userId });

  // 2. Perform calculations and grouping
  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
  const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0);
  const savings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (savings / totalIncome) * 100 : 0;

  // Group expenses by category
  const expenseCategoryTotals = {};
  expenses.forEach((item) => {
    expenseCategoryTotals[item.category] = (expenseCategoryTotals[item.category] || 0) + item.amount;
  });

  // Find top spending category
  let topCategory = "N/A";
  let maxExpense = 0;
  Object.entries(expenseCategoryTotals).forEach(([cat, amt]) => {
    if (amt > maxExpense) {
      maxExpense = amt;
      topCategory = cat;
    }
  });

  // Group incomes by category
  const incomeCategoryTotals = {};
  incomes.forEach((item) => {
    incomeCategoryTotals[item.category] = (incomeCategoryTotals[item.category] || 0) + item.amount;
  });

  const hasGeminiKey = !!process.env.GEMINI_API_KEY;

  if (hasGeminiKey) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
      
      let prompt = "";
      if (question) {
        prompt = `You are Aura AI, an advanced conversational financial advisor. Here is the user's financial profile:
        - User Name: ${req.user.userName}
        - Total Income: $${totalIncome.toLocaleString()}
        - Total Expenses: $${totalExpenses.toLocaleString()}
        - Savings Rate: ${savingsRate.toFixed(1)}% (Total Savings: $${savings.toLocaleString()})
        - Top Expense Category: ${topCategory} ($${maxExpense.toLocaleString()})
        - Categorized Expenses: ${JSON.stringify(expenseCategoryTotals)}
        - Categorized Incomes: ${JSON.stringify(incomeCategoryTotals)}

        The user asked this question: "${question}"
        Provide a concise, professional, and actionable response (under 4 sentences if possible) directly answering their question using their actual transaction data above. Keep formatting clean.`;
      } else {
        prompt = `You are Aura AI, a professional financial advisor. Here is the user's financial profile:
        - User Name: ${req.user.userName}
        - Total Income: $${totalIncome.toLocaleString()}
        - Total Expenses: $${totalExpenses.toLocaleString()}
        - Savings Rate: ${savingsRate.toFixed(1)}% (Total Savings: $${savings.toLocaleString()})
        - Top Expense Category: ${topCategory} ($${maxExpense.toLocaleString()})
        - Categorized Expenses: ${JSON.stringify(expenseCategoryTotals)}
        - Categorized Incomes: ${JSON.stringify(incomeCategoryTotals)}

        Generate a JSON object representing their financial health analysis. Return ONLY the JSON object, do not wrap it in markdown codeblocks. The structure must be EXACTLY:
        {
          "score": <number 1-100 representing financial health score>,
          "summary": "<short 1-2 sentence overview of their status>",
          "recommendations": [
            "<recommendation 1>",
            "<recommendation 2>",
            "<recommendation 3>"
          ],
          "topCategory": "${topCategory}",
          "savingsAlert": "<alert message if savings rate is under 20%, otherwise empty string>"
        }`;
      }

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      });

      const result = await response.json();
      const aiText = result.candidates?.[0]?.content?.parts?.[0]?.text;

      if (aiText) {
        if (question) {
          return resp.status(200).json(
            new ApiResponce(200, { chatResponse: aiText.trim() }, "AI analysis completed")
          );
        } else {
          try {
            // Attempt to clean JSON formatting from Gemini if it outputs markdown code blocks
            const cleanedText = aiText.replace(/```json|```/g, "").trim();
            const parsedData = JSON.parse(cleanedText);
            return resp.status(200).json(
              new ApiResponce(200, parsedData, "AI analysis completed")
            );
          } catch (jsonErr) {
            console.error("Gemini JSON parse failed, falling back to local:", jsonErr, aiText);
            // Fallback if JSON format was invalid
          }
        }
      }
    } catch (apiErr) {
      console.error("Gemini API call failed, falling back to local:", apiErr);
    }
  }

  // 3. Fallback / Local Rule Engine if Gemini is absent or failed
  if (question) {
    const qLower = question.toLowerCase();
    let reply = "";

    if (qLower.includes("save") || qLower.includes("saving")) {
      if (savingsRate < 10) {
        reply = `Your current savings rate is very low (${savingsRate.toFixed(1)}%). Consider setting strict budget limits, especially on your top category: ${topCategory}. Setting aside just 10-15% of your income at the start of the month can help build a cushion.`;
      } else {
        reply = `You have a healthy savings rate of ${savingsRate.toFixed(1)}% (saved $${savings.toLocaleString()}). To save even more, focus on trimming non-essential items in your "${topCategory}" category.`;
      }
    } else if (qLower.includes("spend") || qLower.includes("expense") || qLower.includes("cost")) {
      reply = `You've spent $${totalExpenses.toLocaleString()} across your categories, with your largest outlay in "${topCategory}" ($${maxExpense.toLocaleString()}). Try to audit this category first to find simple subscription cutbacks or lifestyle adjustments.`;
    } else if (qLower.includes("income") || qLower.includes("salary") || qLower.includes("earn")) {
      reply = `Your total recorded income is $${totalIncome.toLocaleString()}. If you want to increase your savings, either focus on keeping your expenses below $${(totalIncome * 0.7).toFixed(0)} or look into secondary income streams like side-hustles.`;
    } else if (qLower.includes("budget") || qLower.includes("limit")) {
      const budgetStatus = savingsRate > 20 ? "in good shape" : "a bit tight";
      reply = `Your budget is currently ${budgetStatus}. You are spending ${(100 - savingsRate).toFixed(1)}% of your income. We recommend staying under 80% to ensure you're saving enough for future goals.`;
    } else {
      reply = `Hi! I'm Aura AI. Based on your records, you earn $${totalIncome.toLocaleString()} and spend $${totalExpenses.toLocaleString()} (savings rate of ${savingsRate.toFixed(1)}%). Let me know if you want targeted recommendations for saving, budgeting, or managing your top category: "${topCategory}".`;
    }

    return resp.status(200).json(
      new ApiResponce(200, { chatResponse: reply }, "Local AI analysis completed (Fallback)")
    );
  }

  // Initial dashboard analysis fallback
  let healthScore = 50;
  if (savingsRate > 30) healthScore = 90;
  else if (savingsRate > 20) healthScore = 80;
  else if (savingsRate > 10) healthScore = 65;
  else if (savingsRate > 0) healthScore = 55;
  else healthScore = 30;

  const recommendations = [];
  if (savingsRate < 20) {
    recommendations.push("Try to increase your savings rate to 20% by cutting small subscription costs.");
  } else {
    recommendations.push("Excellent work! You are saving a healthy portion of your earnings. Consider investing the surplus.");
  }

  if (maxExpense > totalIncome * 0.4 && totalIncome > 0) {
    recommendations.push(`Your spending in "${topCategory}" is quite high (${((maxExpense/totalIncome)*100).toFixed(0)}% of income). Look for ways to reduce it.`);
  } else {
    recommendations.push("Your expenses are well distributed across categories. Keep it up!");
  }

  recommendations.push("Build a 3-6 month emergency fund with your monthly savings buffer.");

  const savingsAlert = savingsRate < 20 
    ? `Savings rate is only ${savingsRate.toFixed(1)}%! We recommend saving at least 20%.` 
    : "";

  const responseData = {
    score: healthScore,
    summary: `You earn $${totalIncome.toLocaleString()} and spend $${totalExpenses.toLocaleString()}. Your net monthly savings is $${savings.toLocaleString()} (${savingsRate.toFixed(1)}% savings rate).`,
    recommendations,
    topCategory,
    savingsAlert,
  };

  return resp.status(200).json(
    new ApiResponce(200, responseData, "Local AI analysis completed (Fallback)")
  );
});

export { getAIAnalysis };
