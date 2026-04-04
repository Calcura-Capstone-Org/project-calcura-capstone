/* Jaehyeong Shin wrote all 176 lines of code for this file */
import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { TrendingUp, TrendingDown, DollarSign, CreditCard, PiggyBank, Target, Heart, ChevronDown, ChevronUp } from "lucide-react";

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
  "#3b82f6",
  "#22c55e",
  "#eab308",
  "#a855f7",
  "#f97316",
  "#ef4444",
  "#06b6d4",
  "#ec4899",
  "#6366f1",
  "#84cc16",
  "#f59e0b",
  "#6b7280",
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
  const [savings501Total, setSavings501Total] = useState(0);
  const [investing601Total, setInvesting601Total] = useState(0);
  const [donationRows, setDonationRows] = useState<DebtRow[]>([]);
  const [savingsRows, setSavingsRows] = useState<DebtRow[]>([]);
  const [investingRows, setInvestingRows] = useState<DebtRow[]>([]);
  const [savings501Rows, setSavings501Rows] = useState<DebtRow[]>([]);
  const [investing601Rows, setInvesting601Rows] = useState<DebtRow[]>([]);
  const [expandDebt, setExpandDebt] = useState(false);
  const [expandDonations, setExpandDonations] = useState(false);
  const [expandSavings, setExpandSavings] = useState(false);
  const [expandInvesting, setExpandInvesting] = useState(false);
  const [expandSavings501, setExpandSavings501] = useState(false);
  const [expandInvesting601, setExpandInvesting601] = useState(false);
  const [viewAllSpending, setViewAllSpending] = useState(false);
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
    const donationByName = new Map<string, number>();
    const savingsByName = new Map<string, number>();
    const investingByName = new Map<string, number>();
    const savings501ByName = new Map<string, number>();
    const investing601ByName = new Map<string, number>();
    let donationsTotal = 0;
    let savingsTotal = 0;
    let investingTotal = 0;
    let savings501 = 0;
    let investing601 = 0;

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
        donationByName.set(rowName, roundToCents((donationByName.get(rowName) ?? 0) + plannedAmount));
        donationsTotal = roundToCents(donationsTotal + plannedAmount);
        continue;
      }

      const isSavings = type ? type === "savings" : itemCategoryId >= 500 && itemCategoryId < 600;
      if (isSavings) {
        if (itemCategoryId === 501) {
          savings501 = roundToCents(savings501 + plannedAmount);
          savings501ByName.set(rowName, roundToCents((savings501ByName.get(rowName) ?? 0) + plannedAmount));
        } else {
          savingsTotal = roundToCents(savingsTotal + plannedAmount);
          savingsByName.set(rowName, roundToCents((savingsByName.get(rowName) ?? 0) + plannedAmount));
        }
        continue;
      }

      const isInvesting = type ? type === "investments" : itemCategoryId >= 600 && itemCategoryId < 700;
      if (isInvesting) {
        if (itemCategoryId === 601) {
          investing601 = roundToCents(investing601 + plannedAmount);
          investing601ByName.set(rowName, roundToCents((investing601ByName.get(rowName) ?? 0) + plannedAmount));
        } else {
          investingTotal = roundToCents(investingTotal + plannedAmount);
          investingByName.set(rowName, roundToCents((investingByName.get(rowName) ?? 0) + plannedAmount));
        }
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
    setSavings501Total(savings501);
    setInvesting601Total(investing601);
    setDonationRows(Array.from(donationByName.entries()).map(([name, amount]) => ({ name, amount })));
    setSavingsRows(Array.from(savingsByName.entries()).map(([name, amount]) => ({ name, amount })));
    setInvestingRows(Array.from(investingByName.entries()).map(([name, amount]) => ({ name, amount })));
    setSavings501Rows(Array.from(savings501ByName.entries()).map(([name, amount]) => ({ name, amount })));
    setInvesting601Rows(Array.from(investing601ByName.entries()).map(([name, amount]) => ({ name, amount })));
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
    label: "Expense",
    budget: incomeTotal,
  }));

  const allSpendingCategories = [
    ...expenseRows.map((r, i) => ({ name: r.name, amount: r.amount, color: chartColors[i % chartColors.length], label: "Expense" })),
    ...debtRows.map((r) => ({ name: r.name, amount: r.amount, color: "#f87171", label: "Debt" })),
    ...donationRows.map((r) => ({ name: r.name, amount: r.amount, color: "#f472b6", label: "Donation" })),
    ...savingsRows.map((r) => ({ name: r.name, amount: r.amount, color: "#4ade80", label: "Savings" })),
    ...investingRows.map((r) => ({ name: r.name, amount: r.amount, color: "#60a5fa", label: "Investing" })),
  ].sort((a, b) => b.amount - a.amount);

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
              <Button variant="outline" size="sm" onClick={() => setViewAllSpending(!viewAllSpending)}>
                {viewAllSpending ? "Show Less" : "View All"}
              </Button>
            </div>

            <div className="space-y-4">
              {(viewAllSpending ? allSpendingCategories : categories.slice(0, 5)).map((category) => (
                <div key={`${category.name}-${category.label}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-700">
                      {category.name}
                      {viewAllSpending && (
                        <span className="ml-2 text-xs text-gray-400">({category.label})</span>
                      )}
                    </span>
                    <span className="text-sm text-gray-900">
                      ${category.amount} / ${incomeTotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{ width: incomeTotal > 0 ? `${Math.min((category.amount / incomeTotal) * 100, 100)}%` : "0%", backgroundColor: category.color }}
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
            <button
              onClick={() => setExpandDebt(!expandDebt)}
              className="flex items-center gap-1 mt-3 text-xs text-gray-500 hover:text-gray-700"
            >
              {expandDebt ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              {expandDebt ? "Hide" : "Show"} details
            </button>
            {expandDebt && (
              <div className="mt-2 space-y-1 border-t pt-2">
                {debtRows.map((item) => (
                  <div key={item.name} className="flex justify-between text-xs text-gray-600">
                    <span>{item.name}</span>
                    <span>${item.amount.toLocaleString()}</span>
                  </div>
                ))}
                {debtRows.length === 0 && <p className="text-xs text-gray-400">No items</p>}
              </div>
            )}
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
            <button
              onClick={() => setExpandDonations(!expandDonations)}
              className="flex items-center gap-1 mt-3 text-xs text-gray-500 hover:text-gray-700"
            >
              {expandDonations ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              {expandDonations ? "Hide" : "Show"} details
            </button>
            {expandDonations && (
              <div className="mt-2 space-y-1 border-t pt-2">
                {donationRows.map((item) => (
                  <div key={item.name} className="flex justify-between text-xs text-gray-600">
                    <span>{item.name}</span>
                    <span>${item.amount.toLocaleString()}</span>
                  </div>
                ))}
                {donationRows.length === 0 && <p className="text-xs text-gray-400">No items</p>}
              </div>
            )}
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Monthly Savings</span>
              <PiggyBank className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl text-gray-900">
              ${savingsAccountsTotal.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
              <TrendingUp size={16} />
              <span>Total monthly savings</span>
            </div>
            <button
              onClick={() => setExpandSavings(!expandSavings)}
              className="flex items-center gap-1 mt-3 text-xs text-gray-500 hover:text-gray-700"
            >
              {expandSavings ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              {expandSavings ? "Hide" : "Show"} details
            </button>
            {expandSavings && (
              <div className="mt-2 space-y-1 border-t pt-2">
                {savingsRows.map((item) => (
                  <div key={item.name} className="flex justify-between text-xs text-gray-600">
                    <span>{item.name}</span>
                    <span>${item.amount.toLocaleString()}</span>
                  </div>
                ))}
                {savingsRows.length === 0 && <p className="text-xs text-gray-400">No items</p>}
              </div>
            )}
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Monthly Investing</span>
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-2xl text-gray-900">
              ${investingAccountsTotal.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm text-blue-600">
              <TrendingUp size={16} />
              <span>Total monthly investing</span>
            </div>
            <button
              onClick={() => setExpandInvesting(!expandInvesting)}
              className="flex items-center gap-1 mt-3 text-xs text-gray-500 hover:text-gray-700"
            >
              {expandInvesting ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              {expandInvesting ? "Hide" : "Show"} details
            </button>
            {expandInvesting && (
              <div className="mt-2 space-y-1 border-t pt-2">
                {investingRows.map((item) => (
                  <div key={item.name} className="flex justify-between text-xs text-gray-600">
                    <span>{item.name}</span>
                    <span>${item.amount.toLocaleString()}</span>
                  </div>
                ))}
                {investingRows.length === 0 && <p className="text-xs text-gray-400">No items</p>}
              </div>
            )}
          </Card>
        </div>

        {/* Wide Savings & Investing Cards */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl text-gray-900">Savings Accounts</h2>
              <PiggyBank className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-3xl text-gray-900 mb-2">
              ${savings501Total.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 text-sm text-green-600">
              <TrendingUp size={16} />
              <span>Total balance across savings accounts</span>
            </div>
            <button
              onClick={() => setExpandSavings501(!expandSavings501)}
              className="flex items-center gap-1 mt-3 text-xs text-gray-500 hover:text-gray-700"
            >
              {expandSavings501 ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              {expandSavings501 ? "Hide" : "Show"} details
            </button>
            {expandSavings501 && (
              <div className="mt-2 space-y-1 border-t pt-2">
                {savings501Rows.map((item) => (
                  <div key={item.name} className="flex justify-between text-sm text-gray-600">
                    <span>{item.name}</span>
                    <span>${item.amount.toLocaleString()}</span>
                  </div>
                ))}
                {savings501Rows.length === 0 && <p className="text-sm text-gray-400">No items</p>}
              </div>
            )}
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl text-gray-900">Investing Accounts</h2>
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-3xl text-gray-900 mb-2">
              ${investing601Total.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 text-sm text-blue-600">
              <TrendingUp size={16} />
              <span>Total balance across investing accounts</span>
            </div>
            <button
              onClick={() => setExpandInvesting601(!expandInvesting601)}
              className="flex items-center gap-1 mt-3 text-xs text-gray-500 hover:text-gray-700"
            >
              {expandInvesting601 ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              {expandInvesting601 ? "Hide" : "Show"} details
            </button>
            {expandInvesting601 && (
              <div className="mt-2 space-y-1 border-t pt-2">
                {investing601Rows.map((item) => (
                  <div key={item.name} className="flex justify-between text-sm text-gray-600">
                    <span>{item.name}</span>
                    <span>${item.amount.toLocaleString()}</span>
                  </div>
                ))}
                {investing601Rows.length === 0 && <p className="text-sm text-gray-400">No items</p>}
              </div>
            )}
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
