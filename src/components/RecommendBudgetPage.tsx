/* Jaehyeong Shin wrote all 176 lines of code for this file */
import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { TrendingUp, TrendingDown, DollarSign, CreditCard, PiggyBank, Target } from "lucide-react";

/* API URL */
const API_URL = import.meta.env.VITE_API_URL;

interface RecommendBudgetPageProps {
  onCreateBudget?: () => void;
}

interface TemplateOption {
  id: number;
  name: string;
}

interface CategoryApi {
  category_id: number;
  name?: string;
  type?: string;
}

interface TemplateItemApi {
  template_id: number;
  category_id: number;
  planned_amt: number;
  item_name?: string;
  period?: "month" | "year";
}

interface ExpenseRow {
  name: string;
  amount: number;
  color: string;
}

interface DebtRow {
  name: string;
  amount: number;
}

const chartColors = [
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-orange-500",
  "bg-red-500",
  "bg-cyan-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-lime-500",
  "bg-amber-500",
  "bg-gray-500",
];

const roundToCents = (value: number): number => Math.round(value * 100) / 100;

const toMonthlyAmount = (item: TemplateItemApi): number => {
  const amount = Number(item.planned_amt);
  if (!Number.isFinite(amount) || amount < 0) {
    return 0;
  }
  return item.period === "year" ? roundToCents(amount / 12) : roundToCents(amount);
};

export function RecommendBudgetPage({ onCreateBudget }: RecommendBudgetPageProps) {
  const [userName, setUserName] = useState("Guest");
  const [userTemplates, setUserTemplates] = useState<TemplateOption[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [incomeTotal, setIncomeTotal] = useState(0);
  const [expenseRows, setExpenseRows] = useState<ExpenseRow[]>([]);
  const [debtRows, setDebtRows] = useState<DebtRow[]>([]);
  const [givingRows, setGivingRows] = useState<ExpenseRow[]>([]);
  const [savingsRows, setSavingsRows] = useState<ExpenseRow[]>([]);
  const [investingRows, setInvestingRows] = useState<ExpenseRow[]>([]);
  const [givingTotal, setGivingTotal] = useState(0);
  const [savingsTotal, setSavingsTotal] = useState(0);
  const [investingTotal, setInvestingTotal] = useState(0);
  const [syncError, setSyncError] = useState("");
  const [showExpenseBreakdown, setShowExpenseBreakdown] = useState(false);
  const [showPersonalBreakdown, setShowPersonalBreakdown] = useState(false);
  const [showGivingBreakdown, setShowGivingBreakdown] = useState(false);
  const [showSavingsBreakdown, setShowSavingsBreakdown] = useState(false);
  const [showInvestingBreakdown, setShowInvestingBreakdown] = useState(false);

  const fetchJson = async <T,>(endpoint: string): Promise<T | null> => {
    if (!API_URL) {
      return null;
    }

    const baseUrl = String(API_URL).replace(/\/$/, "");
    const url = `${baseUrl}${endpoint}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Request failed (${response.status}) for ${endpoint}`);
      }
      return (await response.json()) as T;
    } catch (err) {
      console.warn(`RecommendBudgetPage: Failed to load ${endpoint}`, err);
      return null;
    }
  };

  useEffect(() => {
    const loadFinancialGoalData = async () => {
      let userId: string | null = null;

      try {
        userId = localStorage.getItem("user_id");
      } catch (err) {
        console.warn("RecommendBudgetPage: Unable to read local user_id", err);
        return;
      }

      if (!userId) {
        return;
      }

      const users = await fetchJson<any[]>("/users");
      if (Array.isArray(users)) {
        const user = users.find((u) => String(u.user_id) === String(userId));
        if (user?.name) {
          setUserName(user.name);
        }
      }

      const templates = await fetchJson<any[]>("/templates");
      if (Array.isArray(templates)) {
        const ownTemplates = templates
          .filter((t) => String(t.user_id) === String(userId))
          .map((t) => ({ id: t.template_id, name: t.name }));
        setUserTemplates(ownTemplates);
        if (ownTemplates.length > 0) {
          setSelectedTemplate(String(ownTemplates[0].id));
          try {
            await syncTemplateData(String(ownTemplates[0].id));
          } catch (err) {
            console.warn("RecommendBudgetPage: Unable to auto-load template data", err);
          }
        }
      }
    };

    void loadFinancialGoalData();
  }, []);

  useEffect(() => {
    if (!selectedTemplate) {
      return;
    }

    const refresh = async () => {
      try {
        await syncTemplateData(selectedTemplate);
      } catch (err) {
        console.warn("RecommendBudgetPage: Unable to sync selected template", err);
      }
    };

    void refresh();
  }, [selectedTemplate]);

  const syncTemplateData = async (templateId: string) => {
    setSyncError("");
    const items = await fetchJson<TemplateItemApi[]>("/template_items");
    if (!Array.isArray(items)) {
      throw new Error("Template items response was empty or invalid.");
    }

    const categories = await fetchJson<CategoryApi[]>("/categories");
    const categoryTypeById = new Map<number, string>();
    const categoryNameById = new Map<number, string>();
    if (Array.isArray(categories)) {
      for (const category of categories) {
        const categoryId = Number(category.category_id);
        categoryTypeById.set(categoryId, String(category.type ?? "").toLowerCase());
        categoryNameById.set(categoryId, String(category.name ?? "").trim());
      }
    }

    const selectedItems = items.filter((item) => Number(item.template_id) === Number(templateId));

    const incomeSum = roundToCents(
      selectedItems
        .filter((item) => {
          const categoryId = Number(item.category_id);
          const type = categoryTypeById.get(categoryId);
          return type ? type === "income" : categoryId === 101;
        })
        .reduce((sum, item) => sum + toMonthlyAmount(item), 0)
    );

    setIncomeTotal(incomeSum);

    const expenseByName = new Map<string, number>();
    const debtByName = new Map<string, number>();
    const givingByName = new Map<string, number>();
    const savingsByName = new Map<string, number>();
    const investingByName = new Map<string, number>();
    let givingSum = 0;
    let savingsSum = 0;
    let investingSum = 0;

    for (const item of selectedItems) {
      const itemCategoryId = Number(item.category_id);
      const type = categoryTypeById.get(itemCategoryId);
      const isExpense = type ? type === "expenses" : itemCategoryId >= 200 && itemCategoryId < 300;
      const itemName = typeof item.item_name === "string" ? item.item_name.trim() : "";
      const plannedAmount = toMonthlyAmount(item);
      if (plannedAmount <= 0) {
        continue;
      }

      const fallbackCategoryName = categoryNameById.get(itemCategoryId) ?? `Expense ${itemCategoryId}`;
      const rowName = itemName || fallbackCategoryName;

      if (isExpense) {
        expenseByName.set(rowName, roundToCents((expenseByName.get(rowName) ?? 0) + plannedAmount));
        continue;
      }

      const isDebt = type ? type === "debt" : itemCategoryId >= 300 && itemCategoryId < 400;
      if (isDebt) {
        debtByName.set(rowName, roundToCents((debtByName.get(rowName) ?? 0) + plannedAmount));
        continue;
      }

      const isGiving = itemCategoryId >= 400 && itemCategoryId < 500;
      if (isGiving) {
        givingSum = roundToCents(givingSum + plannedAmount);
        givingByName.set(rowName, roundToCents((givingByName.get(rowName) ?? 0) + plannedAmount));
        continue;
      }

      const isSavings = type ? type === "savings" : itemCategoryId >= 500 && itemCategoryId < 600;
      if (isSavings) {
        savingsSum = roundToCents(savingsSum + plannedAmount);
        savingsByName.set(rowName, roundToCents((savingsByName.get(rowName) ?? 0) + plannedAmount));
        continue;
      }

      const isInvesting = type ? type === "investments" : itemCategoryId >= 600 && itemCategoryId < 700;
      if (isInvesting) {
        investingSum = roundToCents(investingSum + plannedAmount);
        investingByName.set(rowName, roundToCents((investingByName.get(rowName) ?? 0) + plannedAmount));
      }
    }

    const rows = Array.from(expenseByName.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name, amount], index) => ({
        name,
        amount,
        color: chartColors[index % chartColors.length],
      }));

    const debtList = Array.from(debtByName.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name, amount]) => ({
        name,
        amount,
      }));

    setExpenseRows(rows);
    setDebtRows(debtList);
    setGivingTotal(givingSum);
    setSavingsTotal(savingsSum);
    setInvestingTotal(investingSum);

    const colorize = (map: Map<string, number>, offset = 0): ExpenseRow[] =>
      Array.from(map.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([name, amount], index) => ({
          name,
          amount,
          color: chartColors[(index + offset) % chartColors.length],
        }));

    setGivingRows(colorize(givingByName, 2));
    setSavingsRows(colorize(savingsByName, 4));
    setInvestingRows(colorize(investingByName, 6));
  };

  const handleUpdateIncome = async () => {
    if (!selectedTemplate) {
      alert("Please select a template first.");
      return;
    }

    try {
      await syncTemplateData(selectedTemplate);
    } catch (err) {
      console.error(err);
      setSyncError("Unable to refresh recommendation data from template items.");
    }
  };

  const totalExpenses = expenseRows.reduce((sum, item) => sum + item.amount, 0);
  const debtBalance = debtRows.reduce((sum, item) => sum + item.amount, 0);
  const housingExpense = expenseRows.find(
    (expense) => expense.name.trim().toLowerCase() === "housing/rent"
  )?.amount ?? 0;
  const housingTarget = roundToCents(incomeTotal * 0.25);
  const recommendedHousing = housingExpense > 0 && housingExpense < housingTarget
    ? housingExpense
    : housingTarget;
  const housingDelta = roundToCents(recommendedHousing - housingExpense);
  const hasHousingData = housingExpense > 0;
  const givingTarget = roundToCents(incomeTotal * 0.1);
  const recommendedGiving = givingTotal > givingTarget ? givingTotal : givingTarget;
  const givingDelta = roundToCents(recommendedGiving - givingTotal);
  const givingMeetsTarget = givingTotal >= givingTarget;
  const savingsTarget = roundToCents(incomeTotal * 0.1);
  const recommendedSavings = savingsTotal > savingsTarget ? savingsTotal : savingsTarget;
  const savingsDelta = roundToCents(recommendedSavings - savingsTotal);
  const savingsMeetsTarget = savingsTotal >= savingsTarget;
  const investingTarget = roundToCents(incomeTotal * 0.1);
  const rawRecommendedInvesting = investingTotal > investingTarget ? investingTotal : investingTarget;
  const investingMeetsTarget = investingTotal >= investingTarget;
  const personalSpendingNames = ["entertainment", "dining out"];
  const personalSpendingTotal = roundToCents(
    expenseRows
      .filter((expense) => personalSpendingNames.includes(expense.name.trim().toLowerCase()))
      .reduce((sum, expense) => sum + expense.amount, 0)
  );
  const personalSpendingTarget = roundToCents(incomeTotal * 0.03);
  const recommendedPersonalSpending = personalSpendingTotal > personalSpendingTarget
    ? personalSpendingTarget
    : personalSpendingTotal;
  const personalSpendingDelta = roundToCents(recommendedPersonalSpending - personalSpendingTotal);
  const personalSpendingMeetsTarget = personalSpendingTotal <= personalSpendingTarget;
  const requiredExpensesTotal = roundToCents(
    expenseRows
      .filter((expense) => {
        const name = expense.name.trim().toLowerCase();
        return name !== "housing/rent" && !personalSpendingNames.includes(name);
      })
      .reduce((sum, expense) => sum + expense.amount, 0)
  );
  const requiredExpensesTarget = roundToCents(incomeTotal * 0.25);
  const recommendedRequiredExpenses = requiredExpensesTotal > requiredExpensesTarget
    ? requiredExpensesTarget
    : requiredExpensesTotal;
  const requiredExpensesDelta = roundToCents(recommendedRequiredExpenses - requiredExpensesTotal);
  const requiredExpensesMeetsTarget = requiredExpensesTotal <= requiredExpensesTarget;

  const rawRemainingFunds = roundToCents(
    incomeTotal - recommendedHousing - recommendedRequiredExpenses - recommendedPersonalSpending - recommendedGiving - recommendedSavings - rawRecommendedInvesting
  );
  const investingReduction = rawRemainingFunds < 0
    ? Math.min(Math.abs(rawRemainingFunds), rawRecommendedInvesting)
    : 0;
  const recommendedInvesting = roundToCents(rawRecommendedInvesting - investingReduction);
  const investingDelta = roundToCents(recommendedInvesting - investingTotal);
  const remainingRecommendedFunds = roundToCents(rawRemainingFunds + investingReduction);

  const finalBalance = roundToCents(
    incomeTotal - totalExpenses - debtBalance - givingTotal - savingsTotal - investingTotal
  );

  const budgetSummary = {
    totalIncome: incomeTotal,
    totalExpenses,
    remaining: incomeTotal - totalExpenses,
    savingsGoal: 1000,
    currentSavings: 760,
  };

  const categories = expenseRows.map((expense) => ({
    ...expense,
    budget: incomeTotal,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl text-gray-900 mb-2">Welcome back, {userName}!</h1>
          <p className="text-gray-600">Here is your recommended budget.</p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total Income</span>
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl text-gray-900">
              ${budgetSummary.totalIncome.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
              <TrendingUp size={16} />
              <span>+12% from last month</span>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total Expenses</span>
              <CreditCard className="w-5 h-5 text-red-600" />
            </div>
            <div className="text-2xl text-gray-900">
              ${budgetSummary.totalExpenses.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm text-red-600">
              <TrendingDown size={16} />
              <span>-5% from last month</span>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Remaining Budget</span>
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-2xl text-gray-900">
              ${budgetSummary.remaining.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 mt-2">
              35% of monthly income
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Final Balance</span>
              <DollarSign className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="text-2xl text-gray-900">
              ${finalBalance.toLocaleString()}
            </div>
            <div className={`flex items-center gap-1 mt-2 text-sm ${finalBalance >= 0 ? "text-green-600" : "text-red-600"}`}>
              {finalBalance >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span>Income minus all tracked costs</span>
            </div>
          </Card>
        </div>

        {/* Income Card */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl text-gray-900 mb-4">Recommended Budget</h2>
          {syncError && (
            <div className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {syncError}
            </div>
          )}
          <div className="rounded-lg border bg-white p-5">
            <p className="text-xs text-gray-500">Total Income</p>
            <p className="text-3xl text-gray-900 mt-1">${incomeTotal.toLocaleString()}</p>
          </div>
        </Card>

        {/* Housing Card */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl text-gray-900 mb-4">Housing / Rent</h2>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="rounded-lg border bg-white p-4">
              <p className="text-xs text-gray-500">Current Housing/Rent</p>
              <p className="text-xl text-gray-900 mt-1">${housingExpense.toLocaleString()}</p>
            </div>
            <div className="rounded-lg border bg-white p-4">
              <p className="text-xs text-gray-500">Recommended Housing/Rent</p>
              <p className="text-xl text-gray-900 mt-1">${recommendedHousing.toLocaleString()}</p>
            </div>
            <div className="rounded-lg border bg-white p-4">
              <p className="text-xs text-gray-500">Adjustment Needed</p>
              <p className={`text-xl mt-1 ${housingDelta < 0 ? "text-red-600" : "text-green-700"}`}>
                {housingDelta < 0 ? `-$${Math.abs(housingDelta).toLocaleString()}` : `$${housingDelta.toLocaleString()}`}
              </p>
            </div>
          </div>
          {incomeTotal > 0 ? (
            <div className="rounded border bg-gray-50 px-4 py-3 text-sm text-gray-700">
              {hasHousingData ? (
                housingExpense <= housingTarget
                  ? `Your current housing/rent spending is already within the recommended limit, so the recommended amount stays at $${recommendedHousing.toLocaleString()}.`
                  : `To stay near 25% of income, reduce housing/rent from $${housingExpense.toLocaleString()} to about $${recommendedHousing.toLocaleString()}.`
              ) : (
                `No Housing/Rent expense was found in this template. Based on total income, the recommended housing/rent amount is $${recommendedHousing.toLocaleString()}.`
              )}
            </div>
          ) : (
            <div className="rounded border bg-gray-50 px-3 py-2 text-sm text-gray-600">
              No income data found for this template. Add income to receive a housing recommendation.
            </div>
          )}
        </Card>

        {incomeTotal > 0 && (
          <>
            {/* Required Expenses Card */}
            <Card className="p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl text-gray-900">Required Expenses</h2>
                <Button variant="outline" size="sm" onClick={() => setShowExpenseBreakdown((v) => !v)}>
                  {showExpenseBreakdown ? "Hide Breakdown" : "See Breakdown"}
                </Button>
              </div>
              <div className="grid md:grid-cols-4 gap-4 mb-4">
                <div className="rounded-lg border bg-white p-4">
                  <p className="text-xs text-gray-500">Current Required Expenses</p>
                  <p className="text-xl text-gray-900 mt-1">${requiredExpensesTotal.toLocaleString()}</p>
                </div>
                <div className="rounded-lg border bg-white p-4">
                  <p className="text-xs text-gray-500">Required Expenses Target</p>
                  <p className="text-xl text-gray-900 mt-1">${requiredExpensesTarget.toLocaleString()}</p>
                </div>
                <div className="rounded-lg border bg-white p-4">
                  <p className="text-xs text-gray-500">Recommended Required Expenses</p>
                  <p className="text-xl text-gray-900 mt-1">${recommendedRequiredExpenses.toLocaleString()}</p>
                </div>
                <div className="rounded-lg border bg-white p-4">
                  <p className="text-xs text-gray-500">Expenses Adjustment</p>
                  <p className={`text-xl mt-1 ${requiredExpensesDelta < 0 ? "text-red-600" : "text-green-700"}`}>
                    {requiredExpensesDelta < 0 ? `-$${Math.abs(requiredExpensesDelta).toLocaleString()}` : `$${requiredExpensesDelta.toLocaleString()}`}
                  </p>
                </div>
              </div>
              <div className="rounded border bg-gray-50 px-4 py-3 text-sm text-gray-700">
                {requiredExpensesMeetsTarget
                  ? `Your required expenses are already within the 25% recommended limit at $${requiredExpensesTotal.toLocaleString()}.`
                  : `To meet the 25% guideline, reduce required expenses from $${requiredExpensesTotal.toLocaleString()} to about $${recommendedRequiredExpenses.toLocaleString()}.`}
              </div>

              {showExpenseBreakdown && (() => {
                const breakdownRows = expenseRows.filter(
                  (e) => !personalSpendingNames.includes(e.name.trim().toLowerCase()) && e.name.trim().toLowerCase() !== "housing/rent"
                );
                return breakdownRows.length > 0 ? (
                  <div className="mt-4 space-y-3">
                    {breakdownRows.map((expense) => (
                      <div key={expense.name}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-700">{expense.name}</span>
                          <span className="text-sm text-gray-900">
                            ${expense.amount.toLocaleString()} / ${requiredExpensesTotal.toLocaleString()}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`${expense.color} h-2 rounded-full transition-all`}
                            style={{
                              width: `${requiredExpensesTotal > 0
                                ? Math.min((expense.amount / requiredExpensesTotal) * 100, 100)
                                : 0}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-gray-500">No required expense items found.</p>
                );
              })()}
            </Card>

            {/* Personal Spending Card */}
            <Card className="p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl text-gray-900">Personal Spending</h2>
                <Button variant="outline" size="sm" onClick={() => setShowPersonalBreakdown((v) => !v)}>
                  {showPersonalBreakdown ? "Hide Breakdown" : "See Breakdown"}
                </Button>
              </div>
              <div className="grid md:grid-cols-4 gap-4 mb-4">
                <div className="rounded-lg border bg-white p-4">
                  <p className="text-xs text-gray-500">Current Personal Spending</p>
                  <p className="text-xl text-gray-900 mt-1">${personalSpendingTotal.toLocaleString()}</p>
                </div>
                <div className="rounded-lg border bg-white p-4">
                  <p className="text-xs text-gray-500">Personal Spending Target</p>
                  <p className="text-xl text-gray-900 mt-1">${personalSpendingTarget.toLocaleString()}</p>
                </div>
                <div className="rounded-lg border bg-white p-4">
                  <p className="text-xs text-gray-500">Recommended Personal Spending</p>
                  <p className="text-xl text-gray-900 mt-1">${recommendedPersonalSpending.toLocaleString()}</p>
                </div>
                <div className="rounded-lg border bg-white p-4">
                  <p className="text-xs text-gray-500">Spending Adjustment</p>
                  <p className={`text-xl mt-1 ${personalSpendingDelta < 0 ? "text-red-600" : "text-green-700"}`}>
                    {personalSpendingDelta < 0 ? `-$${Math.abs(personalSpendingDelta).toLocaleString()}` : `$${personalSpendingDelta.toLocaleString()}`}
                  </p>
                </div>
              </div>
              <div className="rounded border bg-gray-50 px-4 py-3 text-sm text-gray-700">
                {personalSpendingMeetsTarget
                  ? `Your personal spending (Entertainment + Dining Out) is already within the 3% recommended limit at $${personalSpendingTotal.toLocaleString()}.`
                  : `To meet the 3% guideline, reduce personal spending from $${personalSpendingTotal.toLocaleString()} to about $${recommendedPersonalSpending.toLocaleString()}.`}
              </div>

              {showPersonalBreakdown && (() => {
                const breakdownRows = expenseRows.filter(
                  (e) => personalSpendingNames.includes(e.name.trim().toLowerCase())
                );
                return breakdownRows.length > 0 ? (
                  <div className="mt-4 space-y-3">
                    {breakdownRows.map((expense) => (
                      <div key={expense.name}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-700">{expense.name}</span>
                          <span className="text-sm text-gray-900">
                            ${expense.amount.toLocaleString()} / ${personalSpendingTotal.toLocaleString()}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`${expense.color} h-2 rounded-full transition-all`}
                            style={{
                              width: `${personalSpendingTotal > 0
                                ? Math.min((expense.amount / personalSpendingTotal) * 100, 100)
                                : 0}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-gray-500">No personal spending items found.</p>
                );
              })()}
            </Card>
            <Card className="p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl text-gray-900">Giving</h2>
                <Button variant="outline" size="sm" onClick={() => setShowGivingBreakdown((v) => !v)}>
                  {showGivingBreakdown ? "Hide Breakdown" : "See Breakdown"}
                </Button>
              </div>
              <div className="grid md:grid-cols-4 gap-4 mb-4">
                <div className="rounded-lg border bg-white p-4">
                  <p className="text-xs text-gray-500">Current Giving</p>
                  <p className="text-xl text-gray-900 mt-1">${givingTotal.toLocaleString()}</p>
                </div>
                <div className="rounded-lg border bg-white p-4">
                  <p className="text-xs text-gray-500">Giving Target</p>
                  <p className="text-xl text-gray-900 mt-1">${givingTarget.toLocaleString()}</p>
                </div>
                <div className="rounded-lg border bg-white p-4">
                  <p className="text-xs text-gray-500">Recommended Giving</p>
                  <p className="text-xl text-gray-900 mt-1">${recommendedGiving.toLocaleString()}</p>
                </div>
                <div className="rounded-lg border bg-white p-4">
                  <p className="text-xs text-gray-500">Giving Adjustment</p>
                  <p className={`text-xl mt-1 ${givingDelta > 0 ? "text-amber-600" : "text-green-700"}`}>
                    {givingDelta > 0 ? `+$${givingDelta.toLocaleString()}` : `$${givingDelta.toLocaleString()}`}
                  </p>
                </div>
              </div>
              <div className="rounded border bg-gray-50 px-4 py-3 text-sm text-gray-700">
                {givingMeetsTarget
                  ? `Your current giving already meets or exceeds the 10% recommendation, so the recommended amount stays at $${recommendedGiving.toLocaleString()}.`
                  : `A recommended giving amount is $${recommendedGiving.toLocaleString()}, which is 10% of total income.`}
              </div>

              {showGivingBreakdown && (
                givingRows.length > 0 ? (
                  <div className="mt-4 space-y-3">
                    {givingRows.map((row) => (
                      <div key={row.name}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-700">{row.name}</span>
                          <span className="text-sm text-gray-900">
                            ${row.amount.toLocaleString()} / ${givingTotal.toLocaleString()}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`${row.color} h-2 rounded-full transition-all`}
                            style={{ width: `${givingTotal > 0 ? Math.min((row.amount / givingTotal) * 100, 100) : 0}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-gray-500">No giving items found.</p>
                )
              )}
            </Card>

            {/* Savings Card */}
            <Card className="p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl text-gray-900">Savings</h2>
                <Button variant="outline" size="sm" onClick={() => setShowSavingsBreakdown((v) => !v)}>
                  {showSavingsBreakdown ? "Hide Breakdown" : "See Breakdown"}
                </Button>
              </div>
              <div className="grid md:grid-cols-4 gap-4 mb-4">
                <div className="rounded-lg border bg-white p-4">
                  <p className="text-xs text-gray-500">Current Savings</p>
                  <p className="text-xl text-gray-900 mt-1">${savingsTotal.toLocaleString()}</p>
                </div>
                <div className="rounded-lg border bg-white p-4">
                  <p className="text-xs text-gray-500">Savings Target</p>
                  <p className="text-xl text-gray-900 mt-1">${savingsTarget.toLocaleString()}</p>
                </div>
                <div className="rounded-lg border bg-white p-4">
                  <p className="text-xs text-gray-500">Recommended Savings</p>
                  <p className="text-xl text-gray-900 mt-1">${recommendedSavings.toLocaleString()}</p>
                </div>
                <div className="rounded-lg border bg-white p-4">
                  <p className="text-xs text-gray-500">Savings Adjustment</p>
                  <p className={`text-xl mt-1 ${savingsDelta > 0 ? "text-amber-600" : "text-green-700"}`}>
                    {savingsDelta > 0 ? `+$${savingsDelta.toLocaleString()}` : `$${savingsDelta.toLocaleString()}`}
                  </p>
                </div>
              </div>
              <div className="rounded border bg-gray-50 px-4 py-3 text-sm text-gray-700">
                {savingsMeetsTarget
                  ? `Your current savings already meet or exceed the 10% recommendation, so the recommended amount stays at $${recommendedSavings.toLocaleString()}.`
                  : `A recommended savings amount is $${recommendedSavings.toLocaleString()}, which is 10% of total income.`}
              </div>

              {showSavingsBreakdown && (
                savingsRows.length > 0 ? (
                  <div className="mt-4 space-y-3">
                    {savingsRows.map((row) => (
                      <div key={row.name}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-700">{row.name}</span>
                          <span className="text-sm text-gray-900">
                            ${row.amount.toLocaleString()} / ${savingsTotal.toLocaleString()}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`${row.color} h-2 rounded-full transition-all`}
                            style={{ width: `${savingsTotal > 0 ? Math.min((row.amount / savingsTotal) * 100, 100) : 0}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-gray-500">No savings items found.</p>
                )
              )}
            </Card>

            {/* Investing Card */}
            <Card className="p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl text-gray-900">Investing</h2>
                <Button variant="outline" size="sm" onClick={() => setShowInvestingBreakdown((v) => !v)}>
                  {showInvestingBreakdown ? "Hide Breakdown" : "See Breakdown"}
                </Button>
              </div>
              <div className="grid md:grid-cols-4 gap-4 mb-4">
                <div className="rounded-lg border bg-white p-4">
                  <p className="text-xs text-gray-500">Current Investing</p>
                  <p className="text-xl text-gray-900 mt-1">${investingTotal.toLocaleString()}</p>
                </div>
                <div className="rounded-lg border bg-white p-4">
                  <p className="text-xs text-gray-500">Investing Target</p>
                  <p className="text-xl text-gray-900 mt-1">${investingTarget.toLocaleString()}</p>
                </div>
                <div className="rounded-lg border bg-white p-4">
                  <p className="text-xs text-gray-500">Recommended Investing</p>
                  <p className="text-xl text-gray-900 mt-1">${recommendedInvesting.toLocaleString()}</p>
                </div>
                <div className="rounded-lg border bg-white p-4">
                  <p className="text-xs text-gray-500">Investing Adjustment</p>
                  <p className={`text-xl mt-1 ${investingDelta > 0 ? "text-amber-600" : investingDelta < 0 ? "text-red-600" : "text-green-700"}`}>
                    {investingDelta > 0 ? `+$${investingDelta.toLocaleString()}` : `$${investingDelta.toLocaleString()}`}
                  </p>
                </div>
              </div>
              <div className="rounded border bg-gray-50 px-4 py-3 text-sm text-gray-700">
                {investingMeetsTarget
                  ? `Your current investing already meets or exceeds the 10% recommendation, so the recommended amount stays at $${recommendedInvesting.toLocaleString()}.`
                  : `A recommended investing amount is $${recommendedInvesting.toLocaleString()}, which is 10% of total income.`}
              </div>

              {showInvestingBreakdown && (
                investingRows.length > 0 ? (
                  <div className="mt-4 space-y-3">
                    {investingRows.map((row) => (
                      <div key={row.name}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-700">{row.name}</span>
                          <span className="text-sm text-gray-900">
                            ${row.amount.toLocaleString()} / ${investingTotal.toLocaleString()}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`${row.color} h-2 rounded-full transition-all`}
                            style={{ width: `${investingTotal > 0 ? Math.min((row.amount / investingTotal) * 100, 100) : 0}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-gray-500">No investing items found.</p>
                )
              )}
            </Card>

            {/* Remaining Funds Card */}
            <Card className="p-6 mb-8">
              <h2 className="text-xl text-gray-900 mb-4">Remaining Funds</h2>
              <div className="rounded-lg border bg-white px-5 py-4">
                <p className="text-xs text-gray-500">Remaining Funds Based on Recommendations</p>
                <p className={`text-3xl mt-1 ${remainingRecommendedFunds < 0 ? "text-red-600" : "text-gray-900"}`}>
                  ${remainingRecommendedFunds.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Total income minus recommended housing/rent, required expenses, giving, savings, and investing.
                </p>
              </div>
            </Card>
          </>
        )}

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Spending by Category */}
          <Card className="lg:col-span-2 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl text-gray-900">Spending by Category</h2>
              <Button variant="outline" size="sm">View All</Button>
            </div>

            <div className="space-y-4">
              {categories.map((category) => (
                <div key={category.name}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-700">{category.name}</span>
                    <span className="text-sm text-gray-900">
                      ${category.amount} / ${category.budget}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${category.color} h-2 rounded-full transition-all`}
                      style={{
                        width: `${category.budget > 0
                          ? Math.min((category.amount / category.budget) * 100, 100)
                          : 0}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Template Source and Debt Snapshot */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl text-gray-900">Template Data Source</h2>
              <Button variant="ghost" size="sm" onClick={handleUpdateIncome}>Sync</Button>
            </div>

            <div className="space-y-4">
            {userTemplates.length > 0 ? (
              <select
                className="w-full border rounded px-3 py-2"
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
              >
                <option value="" disabled>
                  Select a template
                </option>
                {userTemplates.map((template) => (
                  <option key={template.id} value={String(template.id)}>
                    {template.name}
                  </option>
                ))}
              </select>
            ) : (
              <div className="text-sm text-gray-500">No templates found for your account.</div>
            )}
          </div>

            <Button variant="outline" className="w-full mt-4" onClick={handleUpdateIncome}>
              Update
            </Button>

            <div className="mt-6">
              <h3 className="text-sm text-gray-600 mb-2">Debt Balance by Item</h3>
              {debtRows.length > 0 ? (
                <div className="space-y-2">
                  {debtRows.map((debt) => (
                    <div key={debt.name} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">{debt.name}</span>
                      <span className="text-gray-900">${debt.amount.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 mt-2 flex items-center justify-between text-sm">
                    <span className="text-gray-600">Total debt balance</span>
                    <span className="text-gray-900">${debtBalance.toLocaleString()}</span>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-500">No debt items found in this template.</div>
              )}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <Card
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => onCreateBudget?.()}
          >
            <h3 className="text-lg text-gray-900 mb-2">Create New Budget</h3>
            <p className="text-sm text-gray-600">Start a new budget template</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <h3 className="text-lg text-gray-900 mb-2">Financial Goals</h3>
            <p className="text-sm text-gray-600">Set and track your goals</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <h3 className="text-lg text-gray-900 mb-2">AI Recommendations</h3>
            <p className="text-sm text-gray-600">Get personalized insights</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
