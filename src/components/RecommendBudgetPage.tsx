/* Jaehyeong Shin wrote the original version of this file */
/* Jonathan Torres updated the UI styling and added Recharts visualizations */
/* Dashboard styling applied to RecommendBudgetPage */

import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CreditCard, 
  Target, 
  ChevronDown, 
  ChevronUp, 
  Heart, 
  PiggyBank, 
  Plus, 
  Flag, 
  Settings, 
  ArrowRight 
} from "lucide-react";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

/* API URL */
const API_URL = import.meta.env.VITE_API_URL;

interface RecommendBudgetPageProps {
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
  "#3b82f6", "#22c55e", "#eab308", "#a855f7",
  "#f97316", "#ef4444", "#06b6d4", "#ec4899",
  "#6366f1", "#84cc16", "#f59e0b", "#6b7280",
];

const roundToCents = (value: number): number => Math.round(value * 100) / 100;

const toMonthlyAmount = (item: TemplateItemApi): number => {
  const amount = Number(item.planned_amt);
  if (!Number.isFinite(amount) || amount < 0) {
    return 0;
  }
  return item.period === "year" ? roundToCents(amount / 12) : roundToCents(amount);
};

const RADIAN = Math.PI / 180;
const renderPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: { cx: number; cy: number; midAngle: number; innerRadius: number; outerRadius: number; percent: number }) => {
  if (percent < 0.05) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};


// 1. Breakdown row renderer
const BreakdownRows = ({ rows, total, show, toggle }: { rows: ExpenseRow[]; total: number; show: boolean; toggle: () => void }) => (
  <>
    <button type="button" onClick={toggle} className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 mt-2">
      {show ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      {show ? "Hide" : "Show"} breakdown
    </button>
    {show && (
      rows.length > 0 ? (
        <div className="mt-3 space-y-2 border-t pt-2">
          {rows.map((row) => (
            <div key={row.name}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-600">{row.name}</span>
                <span className="text-xs font-medium text-gray-900">${row.amount.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1">
                <div
                  className="h-1 rounded-full transition-all"
                  style={{ backgroundColor: row.color, width: `${total > 0 ? Math.min((row.amount / total) * 100, 100) : 0}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-2 text-xs text-gray-400">No items found.</p>
      )
    )}
  </>
);

// 2. Category card for each budget section (Dashboard Style)
const CategoryCard = ({ title, current, target, recommended, delta, meetsTarget, note, icon: Icon, iconColor, barColor, total, children }: any) => {
  
  const pct = total > 0 ? Math.min((recommended / total) * 100, 100) : 0;

  return (
    <Card className="relative overflow-hidden p-6 !gap-0 border-gray-200 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
      {/* Background Fill Effect */}
      <div className="absolute inset-x-0 bottom-0 transition-all" style={{ height: `${pct}%`, backgroundColor: barColor, opacity: 0.05 }} />
      
      <div className="relative flex gap-4">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500 uppercase tracking-wide font-bold">{title}</span>
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
          <div className="text-2xl font-semibold text-gray-900 mb-1">${recommended.toLocaleString()}</div>
          <div className="flex items-center gap-2">
             <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${meetsTarget ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
               {meetsTarget ? "On target" : "Adjustment"}
             </span>
             <span className={`text-xs font-bold ${delta < 0 ? "text-red-500" : "text-green-600"}`}>
                {delta > 0 ? `+$${delta.toLocaleString()}` : delta < 0 ? `-$${Math.abs(delta).toLocaleString()}` : ""}
             </span>
          </div>
        </div>

        {/* Dashboard SVG Circle */}
        <div className="flex items-center shrink-0">
          <svg width="56" height="56" viewBox="0 0 56 56">
            <circle cx="28" cy="28" r="22" fill="none" stroke="#e5e7eb" strokeWidth="5" />
            <circle cx="28" cy="28" r="22" fill="none" stroke={barColor} strokeWidth="5" strokeLinecap="round"
              strokeDasharray={`${(pct / 100) * 2 * Math.PI * 22} ${2 * Math.PI * 22}`}
              transform="rotate(-90 28 28)" />
            <text x="28" y="32" textAnchor="middle" fontSize="10" fontWeight="700" fill="#374151">{Math.round(pct)}%</text>
          </svg>
        </div>
      </div>
      
      <div className="relative mt-auto pt-4">
        {note && <p className="text-[10px] leading-relaxed text-amber-600 bg-amber-50 p-2 rounded mb-2 font-medium">{note}</p>}
        {children}
      </div>
    </Card>
  );
};

export function RecommendBudgetPage({ onCreateBudget, onFinancialGoals, onManageBudgets }: RecommendBudgetPageProps) {
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
  const [showDebtBreakdown, setShowDebtBreakdown] = useState(false);

  const fetchJson = async <T,>(endpoint: string): Promise<T | null> => {
    if (!API_URL) return null;
    const baseUrl = String(API_URL).replace(/\/$/, "");
    try {
      const response = await fetch(`${baseUrl}${endpoint}`);
      if (!response.ok) throw new Error(`Request failed (${response.status})`);
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
      if (!userId) return;

      const users = await fetchJson<any[]>("/users");
      if (Array.isArray(users)) {
        const user = users.find((u) => String(u.user_id) === String(userId));
        if (user?.name) setUserName(user.name);
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
    if (selectedTemplate) {
      const refresh = async () => {
        try {
          await syncTemplateData(selectedTemplate);
        } catch (err) {
          console.warn("RecommendBudgetPage: Unable to sync selected template", err);
        }
      };
      void refresh();
    }
  }, [selectedTemplate]);

  const syncTemplateData = async (templateId: string) => {
    setSyncError("");
    const items = await fetchJson<TemplateItemApi[]>("/template_items");
    if (!Array.isArray(items)) throw new Error("Template items response was empty or invalid.");

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
    let givingSum = 0; let savingsSum = 0; let investingSum = 0;

    for (const item of selectedItems) {
      const itemCategoryId = Number(item.category_id);
      const type = categoryTypeById.get(itemCategoryId);
      const isExpense = type ? type === "expenses" : itemCategoryId >= 200 && itemCategoryId < 300;
      const itemName = typeof item.item_name === "string" ? item.item_name.trim() : "";
      const plannedAmount = toMonthlyAmount(item);
      if (plannedAmount <= 0) continue;

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
        if (itemCategoryId === 511) {
          savingsSum = roundToCents(savingsSum + plannedAmount);
          savingsByName.set(rowName, roundToCents((savingsByName.get(rowName) ?? 0) + plannedAmount));
        }
        continue;
      }
      const isInvesting = type ? type === "investments" : itemCategoryId >= 600 && itemCategoryId < 700;
      if (isInvesting) {
        if (itemCategoryId === 611) {
          investingSum = roundToCents(investingSum + plannedAmount);
          investingByName.set(rowName, roundToCents((investingByName.get(rowName) ?? 0) + plannedAmount));
        }
      }
    }

    const rows = Array.from(expenseByName.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name, amount], index) => ({ name, amount, color: chartColors[index % chartColors.length] }));
    const debtList = Array.from(debtByName.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name, amount]) => ({ name, amount }));

    setExpenseRows(rows);
    setDebtRows(debtList);
    setGivingTotal(givingSum);
    setSavingsTotal(savingsSum);
    setInvestingTotal(investingSum);

    const colorize = (map: Map<string, number>, offset = 0): ExpenseRow[] =>
      Array.from(map.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([name, amount], index) => ({ name, amount, color: chartColors[(index + offset) % chartColors.length] }));

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

  // Calculation Logic (UNCHANGED)
  const totalExpenses = expenseRows.reduce((sum, item) => sum + item.amount, 0);
  const debtBalance = debtRows.reduce((sum, item) => sum + item.amount, 0);
  const housingExpense = expenseRows.find((expense) => expense.name.trim().toLowerCase() === "housing/rent")?.amount ?? 0;
  const housingTarget = roundToCents(incomeTotal * 0.25);
  const recommendedHousing = housingExpense > 0 && housingExpense < housingTarget ? housingExpense : housingTarget;
  const housingDelta = roundToCents(recommendedHousing - housingExpense);
  const hasHousingData = housingExpense > 0;
  const givingTarget = roundToCents(incomeTotal * 0.1);
  const recommendedGiving = givingTotal > givingTarget ? givingTotal : givingTarget;
  const givingDelta = roundToCents(recommendedGiving - givingTotal);
  const givingMeetsTarget = givingTotal >= givingTarget;
  const savingsTarget = roundToCents(incomeTotal * 0.1);
  const recommendedSavings = savingsTotal > savingsTarget ? savingsTotal : savingsTarget;
  const savingsMeetsTarget = savingsTotal >= savingsTarget;
  const investingTarget = roundToCents(incomeTotal * 0.1);
  const rawRecommendedInvesting = investingTotal > investingTarget ? investingTotal : investingTarget;
  const investingMeetsTarget = investingTotal >= investingTarget;
  const personalSpendingNames = ["entertainment", "dining out"];
  const personalSpendingTotal = roundToCents(expenseRows.filter((expense) => personalSpendingNames.includes(expense.name.trim().toLowerCase())).reduce((sum, expense) => sum + expense.amount, 0));
  const personalSpendingTarget = roundToCents(incomeTotal * 0.03);
  const recommendedPersonalSpending = personalSpendingTotal > personalSpendingTarget ? personalSpendingTarget : personalSpendingTotal;
  const personalSpendingDelta = roundToCents(recommendedPersonalSpending - personalSpendingTotal);
  const personalSpendingMeetsTarget = personalSpendingTotal <= personalSpendingTarget;
  const requiredExpensesTotal = roundToCents(expenseRows.filter((expense) => { const name = expense.name.trim().toLowerCase(); return name !== "housing/rent" && !personalSpendingNames.includes(name); }).reduce((sum, expense) => sum + expense.amount, 0));
  const requiredExpensesTarget = roundToCents(incomeTotal * 0.25);
  const recommendedRequiredExpenses = requiredExpensesTotal > requiredExpensesTarget ? requiredExpensesTarget : requiredExpensesTotal;
  const requiredExpensesDelta = roundToCents(recommendedRequiredExpenses - requiredExpensesTotal);
  const requiredExpensesMeetsTarget = requiredExpensesTotal <= requiredExpensesTarget;

  const rawRemainingFunds = roundToCents(incomeTotal - recommendedHousing - recommendedRequiredExpenses - recommendedPersonalSpending - recommendedGiving - recommendedSavings - rawRecommendedInvesting);
  const investingReduction = rawRemainingFunds < 0 ? Math.min(Math.abs(rawRemainingFunds), rawRecommendedInvesting) : 0;
  const recommendedInvesting = roundToCents(rawRecommendedInvesting - investingReduction);
  const remainingRecommendedFunds = roundToCents(rawRemainingFunds + investingReduction);
  const debtShortfall = roundToCents(Math.max(0, debtBalance - Math.max(0, remainingRecommendedFunds)));
  const debtInvestingReduction = Math.min(debtShortfall, recommendedInvesting);
  const debtSavingsReduction = roundToCents(Math.min(debtShortfall - debtInvestingReduction, recommendedSavings));
  const adjustedRecommendedInvesting = roundToCents(recommendedInvesting - debtInvestingReduction);
  const adjustedRecommendedSavings = roundToCents(recommendedSavings - debtSavingsReduction);
  const adjustedRemainingFunds = roundToCents(remainingRecommendedFunds + debtInvestingReduction + debtSavingsReduction);
  const adjustedInvestingDelta = roundToCents(adjustedRecommendedInvesting - investingTotal);
  const adjustedSavingsDelta = roundToCents(adjustedRecommendedSavings - savingsTotal);
  const recommendedDebtPayoff = roundToCents(Math.max(0, adjustedRemainingFunds));
  const debtAdjustment = roundToCents(recommendedDebtPayoff - debtBalance);
  const finalBalance = roundToCents(incomeTotal - totalExpenses - debtBalance - givingTotal - savingsTotal - investingTotal);

  const allocationPieData = [
    { name: "Housing", value: recommendedHousing, color: "#6366f1" },
    { name: "Required Expenses", value: recommendedRequiredExpenses, color: "#ef4444" },
    { name: "Personal", value: recommendedPersonalSpending, color: "#f97316" },
    { name: "Giving", value: recommendedGiving, color: "#ec4899" },
    { name: "Savings", value: adjustedRecommendedSavings, color: "#22c55e" },
    { name: "Investing", value: adjustedRecommendedInvesting, color: "#3b82f6" },
    { name: "Debt Payoff", value: recommendedDebtPayoff, color: "#8b5cf6" },
  ].filter((d) => d.value > 0);

  const comparisonData = [
    { name: "Housing", current: housingExpense, recommended: recommendedHousing },
    { name: "Req. Expenses", current: requiredExpensesTotal, recommended: recommendedRequiredExpenses },
    { name: "Personal", current: personalSpendingTotal, recommended: recommendedPersonalSpending },
    { name: "Giving", current: givingTotal, recommended: recommendedGiving },
    { name: "Savings", current: savingsTotal, recommended: adjustedRecommendedSavings },
    { name: "Investing", current: investingTotal, recommended: adjustedRecommendedInvesting },
    { name: "Debt", current: debtBalance, recommended: recommendedDebtPayoff },
  ].filter((d) => d.current > 0 || d.recommended > 0);

  const adjustmentItems = [
    { name: "Housing / Rent", delta: housingDelta },
    { name: "Required Expenses", delta: requiredExpensesDelta },
    { name: "Personal Spending", delta: personalSpendingDelta },
    { name: "Giving", delta: givingDelta },
    { name: "Savings", delta: adjustedSavingsDelta },
    { name: "Investing", delta: adjustedInvestingDelta },
    { name: "Debt Contribution", delta: debtAdjustment },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Header + Template Selector (Dashboard Style) */}
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl text-gray-900 mb-1">Welcome back, {userName}!</h1>
            <p className="text-gray-600">Review your budget recommendations</p>
          </div>
          <Card className="p-4 w-full sm:w-72 shrink-0 shadow-sm border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Template Source</span>
              <Button variant="ghost" size="sm" onClick={handleUpdateIncome} className="text-blue-600">Sync</Button>
            </div>
            {userTemplates.length > 0 ? (
              <select
                className="w-full border rounded px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
              >
                <option value="" disabled>Select a template</option>
                {userTemplates.map((template) => (
                  <option key={template.id} value={String(template.id)}>{template.name}</option>
                ))}
              </select>
            ) : (
              <div className="text-sm text-gray-500">No templates found.</div>
            )}
            {syncError && <div className="mt-2 rounded border border-red-200 bg-red-50 px-2 py-1 text-xs text-red-700">{syncError}</div>}
          </Card>
        </div>

        {/* Top Summary Cards (Dashboard Style) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 !gap-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500 uppercase tracking-wide">Income</span>
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl font-semibold text-gray-900">${incomeTotal.toLocaleString()}</div>
          </Card>

          <Card className="p-6 !gap-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500 uppercase tracking-wide">Expenses</span>
              <CreditCard className="w-5 h-5 text-red-600" />
            </div>
            <div className="text-2xl font-semibold text-gray-900">${totalExpenses.toLocaleString()}</div>
          </Card>

          <Card className="p-6 !gap-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500 uppercase tracking-wide">Remaining</span>
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-2xl font-semibold text-gray-900">${(incomeTotal - totalExpenses).toLocaleString()}</div>
          </Card>

          <Card className="p-6 !gap-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500 uppercase tracking-wide">Net Balance</span>
              {finalBalance >= 0 ? <TrendingUp className="w-5 h-5 text-green-600" /> : <TrendingDown className="w-5 h-5 text-red-600" />}
            </div>
            <div className={`text-2xl font-semibold ${finalBalance >= 0 ? "text-green-700" : "text-red-600"}`}>
              ${finalBalance.toLocaleString()}
            </div>
          </Card>
        </div>

        {/* Main Charts Row */}
        {incomeTotal > 0 && (
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recommended Allocation</h2>
              {allocationPieData.length > 0 ? (
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie data={allocationPieData} cx="50%" cy="50%" labelLine={false} label={renderPieLabel} outerRadius={110} dataKey="value">
                        {allocationPieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                      </Pie>
                      <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-1.5 min-w-[150px]">
                    {allocationPieData.map((item) => (
                      <div key={item.name} className="flex items-center gap-2 text-xs">
                        <span className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="text-gray-700">{item.name}</span>
                        <span className="text-gray-500 ml-auto">${item.value.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-[260px] text-gray-400 text-sm">No data to display</div>
              )}
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Current vs Recommended</h2>
              {comparisonData.length > 0 ? (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={comparisonData} margin={{ left: 10, right: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" fontSize={11} angle={-20} textAnchor="end" height={50} />
                    <YAxis tickFormatter={(v) => `$${v.toLocaleString()}`} fontSize={11} />
                    <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} cursor={{fill: '#f3f4f6'}} />
                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                    <Bar dataKey="current" name="Current" fill="#9ca3af" radius={[3, 3, 0, 0]} barSize={18} />
                    <Bar dataKey="recommended" name="Recommended" fill="#6366f1" radius={[3, 3, 0, 0]} barSize={18} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[260px] text-gray-400 text-sm">No data to display</div>
              )}
            </Card>
          </div>
        )}

        {/* Detailed Category Cards (Dashboard 3-Column Grid with SVG Circles) */}
        {incomeTotal > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <CategoryCard
                title="Housing / Rent" current={housingExpense} target={housingTarget} recommended={recommendedHousing} delta={housingDelta} meetsTarget={!hasHousingData || housingExpense <= housingTarget}
                icon={CreditCard} iconColor="text-indigo-500" barColor="#6366f1"
                total={incomeTotal}
              />

              <CategoryCard
                title="Required Expenses" current={requiredExpensesTotal} target={requiredExpensesTarget} recommended={recommendedRequiredExpenses} delta={requiredExpensesDelta} meetsTarget={requiredExpensesMeetsTarget}
                icon={CreditCard} iconColor="text-rose-500" barColor="#ef4444"
                total={incomeTotal}
              >
                <BreakdownRows rows={expenseRows.filter((e) => !personalSpendingNames.includes(e.name.trim().toLowerCase()) && e.name.trim().toLowerCase() !== "housing/rent")} total={requiredExpensesTotal} show={showExpenseBreakdown} toggle={() => setShowExpenseBreakdown((v) => !v)} />
              </CategoryCard>

              <CategoryCard
                title="Personal Spending" current={personalSpendingTotal} target={personalSpendingTarget} recommended={recommendedPersonalSpending} delta={personalSpendingDelta} meetsTarget={personalSpendingMeetsTarget}
                icon={Target} iconColor="text-orange-500" barColor="#f97316"
                total={incomeTotal}
              >
                <BreakdownRows rows={expenseRows.filter((e) => personalSpendingNames.includes(e.name.trim().toLowerCase()))} total={personalSpendingTotal} show={showPersonalBreakdown} toggle={() => setShowPersonalBreakdown((v) => !v)} />
              </CategoryCard>

              <CategoryCard
                title="Giving" current={givingTotal} target={givingTarget} recommended={recommendedGiving} delta={givingDelta} meetsTarget={givingMeetsTarget}
                icon={Heart} iconColor="text-pink-500" barColor="#ec4899"
                total={incomeTotal} 
              >
                <BreakdownRows rows={givingRows} total={givingTotal} show={showGivingBreakdown} toggle={() => setShowGivingBreakdown((v) => !v)} />
              </CategoryCard>

              <CategoryCard
                title="Savings" current={savingsTotal} target={savingsTarget} recommended={adjustedRecommendedSavings} delta={adjustedSavingsDelta} meetsTarget={savingsMeetsTarget}
                icon={PiggyBank} iconColor="text-green-500" barColor="#22c55e" note={debtSavingsReduction > 0 ? `$${debtSavingsReduction.toLocaleString()} redirected from savings to cover debt.` : undefined}
                total={incomeTotal}
              >
                <BreakdownRows rows={savingsRows} total={savingsTotal} show={showSavingsBreakdown} toggle={() => setShowSavingsBreakdown((v) => !v)} />
              </CategoryCard>

              <CategoryCard
                title="Investing" current={investingTotal} target={investingTarget} recommended={adjustedRecommendedInvesting} delta={adjustedInvestingDelta} meetsTarget={investingMeetsTarget}
                icon={TrendingUp} iconColor="text-blue-500" barColor="#3b82f6" note={debtInvestingReduction > 0 ? `$${debtInvestingReduction.toLocaleString()} redirected from investing to cover debt.` : undefined}
                total={incomeTotal} 
              >
                <BreakdownRows rows={investingRows} total={investingTotal} show={showInvestingBreakdown} toggle={() => setShowInvestingBreakdown((v) => !v)} />
              </CategoryCard>

              <CategoryCard
                title="Debt Contribution" current={debtBalance} target="Max" recommended={recommendedDebtPayoff} delta={debtAdjustment} meetsTarget={debtAdjustment >= 0}
                icon={CreditCard} iconColor="text-purple-500" barColor="#8b5cf6"
                total={incomeTotal} 
                note={(debtInvestingReduction > 0 || debtSavingsReduction > 0) ? `To cover debt: ${[ debtInvestingReduction > 0 ? `$${debtInvestingReduction.toLocaleString()} from investing` : "", debtSavingsReduction > 0 ? `$${debtSavingsReduction.toLocaleString()} from savings` : "" ].filter(Boolean).join(", ")}` : undefined}
              >
                <BreakdownRows rows={debtRows.map((r) => ({ ...r, color: "#8b5cf6" }))} total={debtBalance} show={showDebtBreakdown} toggle={() => setShowDebtBreakdown((v) => !v)} />
              </CategoryCard>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="p-6 border-t-4 border-t-indigo-500">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Remaining Funds</h2>
                    <p className="text-sm text-gray-500 mt-0.5">After all recommended allocations</p>
                  </div>
                  <span className={`text-3xl font-bold ${adjustedRemainingFunds < 0 ? "text-red-600" : "text-indigo-600"}`}>
                    ${adjustedRemainingFunds.toLocaleString()}
                  </span>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-base font-semibold text-gray-900 mb-3">Adjustment Summary</h2>
                <div className="divide-y border-t">
                  {adjustmentItems.map(({ name, delta }) => (
                    <div key={name} className="flex items-center justify-between py-2.5">
                      <span className="text-sm text-gray-700">{name}</span>
                      <span className={`text-sm font-bold ${delta < 0 ? "text-red-600" : delta > 0 ? "text-green-600" : "text-gray-400"}`}>
                        {delta > 0 ? `+$${delta.toLocaleString()}` : delta < 0 ? `-$${Math.abs(delta).toLocaleString()}` : "On target"}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </>
        )}

        {/* Bottom Quick Actions (Dashboard Style Group Buttons) */}
        <div className="grid md:grid-cols-3 gap-6 pt-6 border-t">
          <button className="group flex items-center gap-4 p-6 bg-white rounded-xl border border-gray-200 hover:border-green-400 hover:shadow-lg transition-all text-left" onClick={() => onCreateBudget?.()}>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-green-200 transition-colors">
              <Plus className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-gray-900">Create New Budget</h3>
              <p className="text-sm text-gray-500">Apply this recommendation</p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-green-500 transition-colors" />
          </button>

          <button className="group flex items-center gap-4 p-6 bg-white rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all text-left" onClick={() => onFinancialGoals?.()}>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-blue-200 transition-colors">
              <Flag className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-gray-900">Financial Goals</h3>
              <p className="text-sm text-gray-500">Set and track your goals</p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors" />
          </button>

          <button className="group flex items-center gap-4 p-6 bg-white rounded-xl border border-gray-200 hover:border-purple-400 hover:shadow-lg transition-all text-left" onClick={() => onManageBudgets?.()}>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-purple-200 transition-colors">
              <Settings className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-gray-900">AI Recommendations</h3>
              <p className="text-sm text-gray-500">Update existing templates</p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-purple-500 transition-colors" />
          </button>
        </div>

      </div>
    </div>
  );
}