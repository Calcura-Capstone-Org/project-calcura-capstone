import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { TrendingUp, TrendingDown, DollarSign, CreditCard, PiggyBank, Target } from "lucide-react";

export function DashboardPage() {
  // Mock data for the dashboard
  const budgetSummary = {
    totalIncome: 5000,
    totalExpenses: 3240,
    remaining: 1760,
    savingsGoal: 1000,
    currentSavings: 760
  };

  const categories = [
    { name: "Housing", amount: 1200, budget: 1500, color: "bg-blue-500" },
    { name: "Food", amount: 450, budget: 600, color: "bg-green-500" },
    { name: "Transportation", amount: 300, budget: 400, color: "bg-yellow-500" },
    { name: "Entertainment", amount: 200, budget: 300, color: "bg-purple-500" },
    { name: "Utilities", amount: 290, budget: 300, color: "bg-orange-500" },
    { name: "Healthcare", amount: 150, budget: 200, color: "bg-red-500" },
    { name: "Other", amount: 650, budget: 700, color: "bg-gray-500" },
  ];

  const recentTransactions = [
    { id: 1, name: "Grocery Store", amount: -87.43, date: "Oct 30", category: "Food" },
    { id: 2, name: "Salary Deposit", amount: 2500, date: "Oct 29", category: "Income" },
    { id: 3, name: "Electric Bill", amount: -120.00, date: "Oct 28", category: "Utilities" },
    { id: 4, name: "Gas Station", amount: -45.00, date: "Oct 27", category: "Transportation" },
    { id: 5, name: "Restaurant", amount: -65.32, date: "Oct 26", category: "Food" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl text-gray-900 mb-2">Welcome back, John!</h1>
          <p className="text-gray-600">Here's your financial overview for October 2024</p>
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
              <span className="text-sm text-gray-600">Savings Progress</span>
              <PiggyBank className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl text-gray-900">
              ${budgetSummary.currentSavings.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 mt-2">
              {Math.round((budgetSummary.currentSavings / budgetSummary.savingsGoal) * 100)}% of goal
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

          {/* Recent Transactions */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl text-gray-900">Recent Transactions</h2>
              <Button variant="ghost" size="sm">See All</Button>
            </div>

            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-900">{transaction.name}</div>
                    <div className="text-xs text-gray-500">{transaction.date}</div>
                  </div>
                  <div className={`text-sm ${transaction.amount > 0 ? 'text-green-600' : 'text-gray-900'}`}>
                    {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <Button variant="outline" className="w-full mt-4">
              Add Transaction
            </Button>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
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
