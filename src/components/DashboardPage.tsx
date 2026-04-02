/* Jaehyeong Shin wrote all 176 lines of code for this file */
import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { TrendingUp, TrendingDown, DollarSign, CreditCard, PiggyBank, Target, Heart } from "lucide-react";

/* API URL */
const API_URL = import.meta.env.VITE_API_URL;

//remove later
console.log("API_URL =", API_URL);

interface DashboardPageProps {
  onCreateBudget?: () => void;
  onFinancialGoals?: () => void;
  onManageBudgets?: () => void;
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

export function DashboardPage({ onCreateBudget, onFinancialGoals, onManageBudgets }: DashboardPageProps) {
  const [userName, setUserName] = useState("John");
  const [userTemplates, setUserTemplates] = useState<TemplateOption[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [incomeTotal, setIncomeTotal] = useState(0);
  const [expenseRows, setExpenseRows] = useState<ExpenseRow[]>([]);
  const [debtRows, setDebtRows] = useState<DebtRow[]>([]);
  const [monthlyDonationsTotal, setMonthlyDonationsTotal] = useState(0);
  const [savingsAccountsTotal, setSavingsAccountsTotal] = useState(0);
  const [investingAccountsTotal, setInvestingAccountsTotal] = useState(0);
  const [syncError, setSyncError] = useState("");

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
      console.warn(`DashboardPage: Failed to load ${endpoint}`, err);
      return null;
    }
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      let userId: string | null = null;

      try {
        userId = localStorage.getItem("user_id");
      } catch (err) {
        console.warn("DashboardPage: Unable to read local user_id", err);
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
            console.warn("DashboardPage: Unable to auto-load template data", err);
          }
        }
      }
    };

    void loadDashboardData();
  }, []);

  useEffect(() => {
    if (!selectedTemplate) {
      return;
    }

    const refresh = async () => {
      try {
        await syncTemplateData(selectedTemplate);
      } catch (err) {
        console.warn("DashboardPage: Unable to sync selected template", err);
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
    let donationsTotal = 0;
    let savingsTotal = 0;
    let investingTotal = 0;

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

      const isDonation = itemCategoryId >= 400 && itemCategoryId < 500;
      if (isDonation) {
        donationsTotal = roundToCents(donationsTotal + plannedAmount);
        continue;
      }

      const isSavings = type ? type === "savings" : itemCategoryId >= 500 && itemCategoryId < 600;
      if (isSavings) {
        savingsTotal = roundToCents(savingsTotal + plannedAmount);
        continue;
      }

      const isInvesting = type ? type === "investments" : itemCategoryId >= 600 && itemCategoryId < 700;
      if (isInvesting) {
        investingTotal = roundToCents(investingTotal + plannedAmount);
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
    setMonthlyDonationsTotal(donationsTotal);
    setSavingsAccountsTotal(savingsTotal);
    setInvestingAccountsTotal(investingTotal);
  };

  const handleTemplateSync = async () => {
    if (!selectedTemplate) {
      alert("Please select a template first.");
      return;
    }

    try {
      await syncTemplateData(selectedTemplate);
    } catch (err) {
      console.error(err);
      setSyncError("Unable to refresh chart data from template items.");
    }
  };

  const totalExpenses = expenseRows.reduce((sum, item) => sum + item.amount, 0);
  const debtBalance = debtRows.reduce((sum, item) => sum + item.amount, 0);
  const totalOtherCosts = totalExpenses + debtBalance + monthlyDonationsTotal + savingsAccountsTotal + investingAccountsTotal;
  const finalBalance = incomeTotal - totalOtherCosts;

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
          <p className="text-gray-600">Achieve your financial goals</p>
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
                      style={{ width: `${(category.amount / category.budget) * 100}%` }}
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
              <Button variant="ghost" size="sm" onClick={handleTemplateSync}>Sync</Button>
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

            {syncError && (
              <div className="mt-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {syncError}
              </div>
            )}

            <Button variant="outline" className="w-full mt-4" onClick={handleTemplateSync}>
              Update
            </Button>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-4 gap-6 mt-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Debt Balance</span>
              <CreditCard className="w-5 h-5 text-red-600" />
            </div>
            <div className="text-2xl text-gray-900">
              ${debtBalance.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm text-red-600">
              <TrendingDown size={16} />
              <span>Current monthly debt load</span>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Monthly Donations</span>
              <Heart className="w-5 h-5 text-pink-600" />
            </div>
            <div className="text-2xl text-gray-900">
              ${monthlyDonationsTotal.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm text-pink-600">
              <TrendingUp size={16} />
              <span>Giving planned this month</span>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Savings Accounts</span>
              <PiggyBank className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl text-gray-900">
              ${savingsAccountsTotal.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
              <TrendingUp size={16} />
              <span>Total monthly savings</span>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Investing Accounts</span>
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-2xl text-gray-900">
              ${investingAccountsTotal.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm text-blue-600">
              <TrendingUp size={16} />
              <span>Total monthly investing</span>
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

          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onFinancialGoals?.()}>
            <h3 className="text-lg text-gray-900 mb-2">Financial Goals</h3>
            <p className="text-sm text-gray-600">Set and track your goals</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onManageBudgets?.()}>
            <h3 className="text-lg text-gray-900 mb-2">Manage Your Budgets</h3>
            <p className="text-sm text-gray-600">Update or delete your existing budgets</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
