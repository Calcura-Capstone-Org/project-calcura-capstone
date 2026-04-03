import { useState, useMemo, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "./ui/dialog";
import { TrendingUp, TrendingDown, DollarSign, CreditCard, PiggyBank, Target, Plus, Trash2, Edit, X } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface Transaction {
  id: string;
  name: string;
  amount: number;
  date: string;
  category: string;
}

interface CategoryBudget {
  name: string;
  budget: number;
  color: string;
}

export function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: "1", name: "Grocery Store", amount: -87.43, date: "2024-10-30", category: "Food" },
    { id: "2", name: "Salary Deposit", amount: 2500, date: "2024-10-29", category: "Income" },
    { id: "3", name: "Electric Bill", amount: -120.00, date: "2024-10-28", category: "Utilities" },
    { id: "4", name: "Gas Station", amount: -45.00, date: "2024-10-27", category: "Transportation" },
    { id: "5", name: "Restaurant", amount: -65.32, date: "2024-10-26", category: "Food" },
    { id: "6", name: "Netflix", amount: -15.99, date: "2024-10-25", category: "Entertainment" },
    { id: "7", name: "Rent", amount: -1200, date: "2024-10-01", category: "Housing" },
    { id: "8", name: "Doctor Visit", amount: -150, date: "2024-10-15", category: "Healthcare" },
  ]);

  const [categoryBudgets, setCategoryBudgets] = useState<CategoryBudget[]>([
    { name: "Housing", budget: 1500, color: "bg-blue-500" },
    { name: "Food", budget: 600, color: "bg-green-500" },
    { name: "Transportation", budget: 400, color: "bg-yellow-500" },
    { name: "Entertainment", budget: 300, color: "bg-purple-500" },
    { name: "Utilities", budget: 300, color: "bg-orange-500" },
    { name: "Healthcare", budget: 200, color: "bg-red-500" },
    { name: "Other", budget: 700, color: "bg-gray-500" },
  ]);

  const [savingsGoal, setSavingsGoal] = useState(1000);
  const [isViewAllOpen, setIsViewAllOpen] = useState(false);
  const [isBudgetDialogOpen, setIsBudgetDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Dragging states for budget bars
  const [draggingCategory, setDraggingCategory] = useState<string | null>(null);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartBudget, setDragStartBudget] = useState(0);

  // Form states (only for editing existing transactions)
  const [formName, setFormName] = useState("");
  const [formAmount, setFormAmount] = useState("");
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formCategory, setFormCategory] = useState("");

  const categories = ["Income", "Housing", "Food", "Transportation", "Entertainment", "Utilities", "Healthcare", "Other"];

  // Calculate totals dynamically
  const budgetSummary = useMemo(() => {
    const totalIncome = transactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = Math.abs(
      transactions
        .filter(t => t.amount < 0)
        .reduce((sum, t) => sum + t.amount, 0)
    );
    
    const remaining = totalIncome - totalExpenses;
    
    const currentSavings = remaining > 0 ? remaining : 0;
    
    return {
      totalIncome,
      totalExpenses,
      remaining,
      savingsGoal,
      currentSavings
    };
  }, [transactions, savingsGoal]);

  // Calculate spending by category
  const categorySpending = useMemo(() => {
    const spending: { [key: string]: number } = {};
    
    transactions.forEach(t => {
      if (t.amount < 0 && t.category !== "Income") {
        spending[t.category] = (spending[t.category] || 0) + Math.abs(t.amount);
      }
    });
    
    return categoryBudgets.map(cat => ({
      ...cat,
      amount: spending[cat.name] || 0
    }));
  }, [transactions, categoryBudgets]);

  const handleAddTransaction = () => {
    if (!formName || !formAmount || !formCategory) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      name: formName,
      amount: parseFloat(formAmount),
      date: formDate,
      category: formCategory
    };

    setTransactions([newTransaction, ...transactions]);
    toast.success("Transaction added successfully!");
    
    // Reset form
    setFormName("");
    setFormAmount("");
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormCategory("");
    setIsAddDialogOpen(false);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setFormName(transaction.name);
    setFormAmount(transaction.amount.toString());
    setFormDate(transaction.date);
    setFormCategory(transaction.category);
    setIsAddDialogOpen(true);
  };

  const handleUpdateTransaction = () => {
    if (!editingTransaction || !formName || !formAmount || !formCategory) {
      toast.error("Please fill in all required fields");
      return;
    }

    const updatedTransactions = transactions.map(t => 
      t.id === editingTransaction.id 
        ? { ...t, name: formName, amount: parseFloat(formAmount), date: formDate, category: formCategory }
        : t
    );

    setTransactions(updatedTransactions);
    toast.success("Transaction updated successfully!");
    
    // Reset form
    setFormName("");
    setFormAmount("");
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormCategory("");
    setEditingTransaction(null);
    setIsAddDialogOpen(false);
  };

  const handleDeleteTransaction = (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this transaction?");
    if (confirmed) {
      setTransactions(transactions.filter(t => t.id !== id));
      toast.success("Transaction deleted");
    }
  };

  const handleUpdateBudget = (categoryName: string, newBudget: number) => {
    setCategoryBudgets(categoryBudgets.map(cat => 
      cat.name === categoryName ? { ...cat, budget: newBudget } : cat
    ));
    toast.success(`${categoryName} budget updated to $${newBudget}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const resetForm = () => {
    setFormName("");
    setFormAmount("");
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormCategory("");
    setEditingTransaction(null);
  };

  // Handle mouse down on budget bar container
  const handleBarMouseDown = (e: React.MouseEvent, categoryName: string, currentBudget: number) => {
    setDraggingCategory(categoryName);
    setDragStartX(e.clientX);
    setDragStartBudget(currentBudget);
  };

  // Add global mouse move and mouse up handlers
  const handleGlobalMouseMove = (e: MouseEvent) => {
    if (!draggingCategory) return;
    
    const deltaX = e.clientX - dragStartX;
    const budgetChange = Math.round(deltaX / 2);
    const newBudget = Math.max(50, dragStartBudget + budgetChange);
    
    setCategoryBudgets(prev => prev.map(cat => 
      cat.name === draggingCategory ? { ...cat, budget: newBudget } : cat
    ));
  };

  const handleGlobalMouseUp = () => {
    if (draggingCategory) {
      const category = categoryBudgets.find(c => c.name === draggingCategory);
      if (category) {
        toast.success(`${draggingCategory} budget updated to $${category.budget}`);
      }
      setDraggingCategory(null);
    }
  };

  // Attach global event listeners when dragging
  useEffect(() => {
    if (draggingCategory) {
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleGlobalMouseMove);
        window.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [draggingCategory]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl text-gray-900 mb-2">Welcome back, John!</h1>
          <p className="text-gray-600">Here's your financial overview for {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total Income</span>
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl text-gray-900">
              ${budgetSummary.totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
              <TrendingUp size={16} />
              <span>From {transactions.filter(t => t.amount > 0).length} sources</span>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total Expenses</span>
              <CreditCard className="w-5 h-5 text-red-600" />
            </div>
            <div className="text-2xl text-gray-900">
              ${budgetSummary.totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm text-red-600">
              <TrendingDown size={16} />
              <span>{transactions.filter(t => t.amount < 0).length} transactions</span>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Remaining Budget</span>
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <div className={`text-2xl ${budgetSummary.remaining >= 0 ? 'text-gray-900' : 'text-red-600'}`}>
              ${budgetSummary.remaining.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-sm text-gray-600 mt-2">
              {budgetSummary.totalIncome > 0 
                ? `${Math.round((budgetSummary.remaining / budgetSummary.totalIncome) * 100)}% of income`
                : 'No income recorded'}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Savings Progress</span>
              <PiggyBank className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl text-gray-900">
              ${budgetSummary.currentSavings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all"
                style={{ width: `${Math.min((budgetSummary.currentSavings / budgetSummary.savingsGoal) * 100, 100)}%` }}
              />
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {Math.round((budgetSummary.currentSavings / budgetSummary.savingsGoal) * 100)}% of ${budgetSummary.savingsGoal} goal
            </div>
          </Card>
        </div>

        {/* Main Content - Full Width */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl text-gray-900">Spending by Category</h2>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsBudgetDialogOpen(true)}
            >
              Manage Budgets
            </Button>
          </div>

          <div className="space-y-4">
            {categorySpending.map((category) => (
              <div key={category.name}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700">{category.name}</span>
                  <span className="text-sm text-gray-900">
                    ${category.amount.toFixed(2)} / ${category.budget}
                  </span>
                </div>
                <div 
                  className="w-full bg-gray-200 rounded-full h-3 relative group cursor-grab active:cursor-grabbing"
                  onMouseDown={(e) => handleBarMouseDown(e, category.name, category.budget)}
                >
                  <div
                    className={`${category.color} h-3 rounded-full transition-all ${draggingCategory === category.name ? 'opacity-80' : ''}`}
                    style={{ width: `${Math.min((category.amount / category.budget) * 100, 100)}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <span className="text-xs font-medium text-gray-600 bg-white px-2 py-0.5 rounded shadow-sm">
                      Drag to adjust budget
                    </span>
                  </div>
                </div>
                {category.amount > category.budget && (
                  <p className="text-xs text-red-600 mt-1">Over budget by ${(category.amount - category.budget).toFixed(2)}</p>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <Card 
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => toast.info("Budget templates feature - Create customized budgets for different time periods")}
          >
            <h3 className="text-lg text-gray-900 mb-2">Create New Budget</h3>
            <p className="text-sm text-gray-600">Start a new budget template</p>
          </Card>

          <Card 
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => toast.info("Financial Goals - Set savings targets, debt payoff goals, and investment milestones")}
          >
            <h3 className="text-lg text-gray-900 mb-2">Financial Goals</h3>
            <p className="text-sm text-gray-600">Set and track your goals</p>
          </Card>

          <Card 
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => toast.success("AI Tip: You're spending 25% on food. Consider meal planning to reduce costs by $150/month!")}
          >
            <h3 className="text-lg text-gray-900 mb-2">AI Recommendations</h3>
            <p className="text-sm text-gray-600">Get personalized insights</p>
          </Card>
        </div>
      </div>

      {/* Add/Edit Transaction Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
        setIsAddDialogOpen(open);
        if (!open) resetForm();
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}</DialogTitle>
            <DialogDescription>
              {editingTransaction ? 'Update the transaction details below.' : 'Enter the transaction details below.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="name">Transaction Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Grocery Store"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="amount">Amount *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="Enter amount (use - for expenses)"
                value={formAmount}
                onChange={(e) => setFormAmount(e.target.value)}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Use negative numbers for expenses (e.g., -50.00) and positive for income (e.g., 2500.00)
              </p>
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={formCategory} onValueChange={setFormCategory}>
                <SelectTrigger id="category" className="mt-1">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsAddDialogOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={editingTransaction ? handleUpdateTransaction : handleAddTransaction}
              className="bg-green-600 hover:bg-green-700"
            >
              {editingTransaction ? 'Update' : 'Add'} Transaction
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View All Transactions Dialog */}
      <Dialog open={isViewAllOpen} onOpenChange={setIsViewAllOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>All Transactions</DialogTitle>
            <DialogDescription>
              View and manage all your transactions
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-2">
              {transactions.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No transactions yet. Add your first transaction!</p>
              ) : (
                transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{transaction.name}</div>
                          <div className="text-xs text-gray-500">
                            {formatDate(transaction.date)} • {transaction.category}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`text-sm font-medium ${transaction.amount > 0 ? 'text-green-600' : 'text-gray-900'}`}>
                        {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            setIsViewAllOpen(false);
                            handleEditTransaction(transaction);
                          }}
                        >
                          <Edit size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteTransaction(transaction.id)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewAllOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manage Budgets Dialog */}
      <Dialog open={isBudgetDialogOpen} onOpenChange={setIsBudgetDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Category Budgets</DialogTitle>
            <DialogDescription>
              Set monthly budget limits for each spending category
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {categoryBudgets.map((category) => (
              <div key={category.name}>
                <Label htmlFor={`budget-${category.name}`}>{category.name}</Label>
                <Input
                  id={`budget-${category.name}`}
                  type="number"
                  step="1"
                  defaultValue={category.budget}
                  onBlur={(e) => {
                    const newBudget = parseFloat(e.target.value);
                    if (newBudget > 0) {
                      handleUpdateBudget(category.name, newBudget);
                    }
                  }}
                  className="mt-1"
                />
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button onClick={() => setIsBudgetDialogOpen(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}