import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Plus, Trash2, ArrowRight, Check } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { useBudget } from "../contexts/BudgetContext";
import { toast } from "sonner@2.0.3";

// Data types for the form
interface Expense {
  id: string;
  type: string;
  customType: string;
  amount: string;
  period: "month" | "year";
}

interface Debt {
  id: string;
  type: string;
  amount: string;
  period: "month" | "year";
}

interface Donation {
  id: string;
  organization: string;
  amount: string;
  period: "month" | "year";
}

interface Savings {
  id: string;
  accountName: string;
  amount: string;
}

interface Investment {
  id: string;
  accountName: string;
  amount: string;
}

// Add props interface for navigation
interface TemplatePageProps {
  onBudgetCreated?: () => void;
}

export function TemplatePage({ onBudgetCreated }: TemplatePageProps) {
  const { setBudget } = useBudget();
  
  // Current section state (1, 2, 3, or 4)
  const [currentSection, setCurrentSection] = useState(1);
  
  // Section 1: Income & Expenses States
  const [incomeType, setIncomeType] = useState<"takehome" | "annual" | "">("");
  const [takeHomePay, setTakeHomePay] = useState("");
  const [annualIncome, setAnnualIncome] = useState("");
  const [filingStatus, setFilingStatus] = useState("");
  const [calculatedMonthlyTakeHome, setCalculatedMonthlyTakeHome] = useState("");
  const [calculatedYearlyTakeHome, setCalculatedYearlyTakeHome] = useState("");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  
  // Section 2: Ron Blue Model & Details States
  const [savingsAccounts, setSavingsAccounts] = useState<Savings[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  
  // Section 3: Review & Create States
  const [showRetirementQuestion, setShowRetirementQuestion] = useState(false);

  const commonExpenses = [
    "Housing/Rent",
    "Utilities",
    "Groceries",
    "Transportation",
    "Insurance",
    "Phone",
    "Internet",
    "Entertainment",
    "Dining Out",
    "Healthcare",
    "Custom"
  ];

  const debtTypes = [
    "Mortgage",
    "Car Payment",
    "Student Loan",
    "Credit Card",
    "Personal Loan",
    "Other"
  ];

  // Calculate take-home pay from annual income
  const calculateTakeHome = () => {
    if (!annualIncome || !filingStatus) return;
    
    const annual = parseFloat(annualIncome);
    let taxRate = 0.22;
    
    if (filingStatus === "single") {
      if (annual <= 11000) taxRate = 0.10;
      else if (annual <= 44725) taxRate = 0.12;
      else if (annual <= 95375) taxRate = 0.22;
      else if (annual <= 182100) taxRate = 0.24;
      else taxRate = 0.32;
    } else if (filingStatus === "married") {
      if (annual <= 22000) taxRate = 0.10;
      else if (annual <= 89050) taxRate = 0.12;
      else if (annual <= 190750) taxRate = 0.22;
      else if (annual <= 364200) taxRate = 0.24;
      else taxRate = 0.32;
    }
    
    const federalTax = annual * taxRate;
    const ficaTax = annual * 0.0765;
    const yearlyTakeHome = annual - federalTax - ficaTax;
    const monthlyTakeHome = yearlyTakeHome / 12;
    
    setCalculatedMonthlyTakeHome(monthlyTakeHome.toFixed(2));
    setCalculatedYearlyTakeHome(yearlyTakeHome.toFixed(2));
  };

  // Expense CRUD functions
  const addExpense = () => {
    setExpenses([
      ...expenses,
      { id: Date.now().toString(), type: "", customType: "", amount: "", period: "month" }
    ]);
  };

  const updateExpense = (id: string, field: keyof Expense, value: string) => {
    setExpenses(expenses.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };

  const removeExpense = (id: string) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };

  // Debt CRUD functions
  const addDebt = () => {
    setDebts([
      ...debts,
      { id: Date.now().toString(), type: "", amount: "", period: "month" }
    ]);
  };

  const updateDebt = (id: string, field: keyof Debt, value: string) => {
    setDebts(debts.map(debt => 
      debt.id === id ? { ...debt, [field]: value } : debt
    ));
  };

  const removeDebt = (id: string) => {
    setDebts(debts.filter(debt => debt.id !== id));
  };

  // Donation CRUD functions
  const addDonation = () => {
    setDonations([
      ...donations,
      { id: Date.now().toString(), organization: "", amount: "", period: "month" }
    ]);
  };

  const updateDonation = (id: string, field: keyof Donation, value: string) => {
    setDonations(donations.map(don => 
      don.id === id ? { ...don, [field]: value } : don
    ));
  };

  const removeDonation = (id: string) => {
    setDonations(donations.filter(don => don.id !== id));
  };

  // Savings CRUD functions
  const addSavings = () => {
    setSavingsAccounts([
      ...savingsAccounts,
      { id: Date.now().toString(), accountName: "", amount: "" }
    ]);
  };

  const updateSavings = (id: string, field: keyof Savings, value: string) => {
    setSavingsAccounts(savingsAccounts.map(saving => 
      saving.id === id ? { ...saving, [field]: value } : saving
    ));
  };

  const removeSavings = (id: string) => {
    setSavingsAccounts(savingsAccounts.filter(saving => saving.id !== id));
  };

  // Investment CRUD functions
  const addInvestment = () => {
    setInvestments([
      ...investments,
      { id: Date.now().toString(), accountName: "", amount: "" }
    ]);
  };

  const updateInvestment = (id: string, field: keyof Investment, value: string) => {
    setInvestments(investments.map(inv => 
      inv.id === id ? { ...inv, [field]: value } : inv
    ));
  };

  const removeInvestment = (id: string) => {
    setInvestments(investments.filter(inv => inv.id !== id));
  };

  // Check if section is complete
  const isSectionComplete = (section: number) => {
    if (section === 1) {
      return (incomeType && (takeHomePay || calculatedMonthlyTakeHome)) && expenses.length > 0;
    }
    if (section === 2) {
      return true; // Always can move to section 3
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-gray-900 mb-2">Create Your Budget Template</h1>
          <p className="text-gray-600">Let's build a personalized budget based on your financial situation</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex gap-2 border-b border-gray-200">
            {/* Tab 1: Income & Expenses */}
            <button
              onClick={() => setCurrentSection(1)}
              className={`px-6 py-3 font-medium transition-colors relative ${
                currentSection === 1 
                  ? "text-green-600 border-b-2 border-green-600" 
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center gap-2">
                {isSectionComplete(1) && currentSection !== 1 && (
                  <Check size={16} className="text-green-600" />
                )}
                Income & Expenses
              </div>
            </button>

            {/* Tab 2: Ron Blue Model */}
            <button
              onClick={() => isSectionComplete(1) && setCurrentSection(2)}
              disabled={!isSectionComplete(1)}
              className={`px-6 py-3 font-medium transition-colors relative ${
                currentSection === 2 
                  ? "text-blue-600 border-b-2 border-blue-600" 
                  : isSectionComplete(1)
                  ? "text-gray-600 hover:text-gray-900"
                  : "text-gray-400 cursor-not-allowed"
              }`}
            >
              <div className="flex items-center gap-2">
                {isSectionComplete(2) && currentSection !== 2 && (
                  <Check size={16} className="text-green-600" />
                )}
                Live. Give. Grow.
              </div>
            </button>

            {/* Tab 3: Review & Create */}
            <button
              onClick={() => isSectionComplete(1) && setCurrentSection(3)}
              disabled={!isSectionComplete(1)}
              className={`px-6 py-3 font-medium transition-colors relative ${
                currentSection === 3 
                  ? "text-purple-600 border-b-2 border-purple-600" 
                  : isSectionComplete(1)
                  ? "text-gray-600 hover:text-gray-900"
                  : "text-gray-400 cursor-not-allowed"
              }`}
            >
              Review & Create
            </button>
          </div>
        </div>

        {/* Green Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`h-2 flex-1 rounded-full transition-all ${
                  step <= currentSection ? "bg-green-600" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-sm text-gray-600">Section {currentSection} of 3</span>
            <span className="text-sm text-gray-600">{Math.round((currentSection / 3) * 100)}% Complete</span>
          </div>
        </div>

        {/* SECTION 1: Income & Expenses */}
        {currentSection === 1 && (
          <div className="space-y-6">
            {/* Income Card */}
            <Card>
              <CardHeader>
                <CardTitle>Income</CardTitle>
                <CardDescription>Tell us about your income</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <Label>Do you know your take-home pay or annual income?</Label>
                  <div className="flex gap-4">
                    <Button
                      variant={incomeType === "takehome" ? "default" : "outline"}
                      onClick={() => setIncomeType("takehome")}
                      className={incomeType === "takehome" ? "bg-green-600 hover:bg-green-700" : ""}
                    >
                      Take-Home Pay (Monthly)
                    </Button>
                    <Button
                      variant={incomeType === "annual" ? "default" : "outline"}
                      onClick={() => setIncomeType("annual")}
                      className={incomeType === "annual" ? "bg-green-600 hover:bg-green-700" : ""}
                    >
                      Annual Income
                    </Button>
                  </div>
                </div>

                {incomeType === "takehome" && (
                  <div className="space-y-2">
                    <Label htmlFor="takehome">Monthly Take-Home Pay</Label>
                    <Input
                      id="takehome"
                      type="number"
                      placeholder="Enter your monthly take-home pay"
                      value={takeHomePay}
                      onChange={(e) => setTakeHomePay(e.target.value)}
                    />
                  </div>
                )}

                {incomeType === "annual" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="annual">Annual Income (Before Taxes)</Label>
                      <Input
                        id="annual"
                        type="number"
                        placeholder="Enter your annual income"
                        value={annualIncome}
                        onChange={(e) => setAnnualIncome(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="filing-status">Filing Status</Label>
                      <Select value={filingStatus} onValueChange={setFilingStatus}>
                        <SelectTrigger id="filing-status">
                          <SelectValue placeholder="Select filing status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="single">Single</SelectItem>
                          <SelectItem value="married">Married Filing Jointly</SelectItem>
                          <SelectItem value="married-separate">Married Filing Separately</SelectItem>
                          <SelectItem value="head">Head of Household</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {filingStatus && (
                      <Button 
                        onClick={calculateTakeHome}
                        variant="outline"
                      >
                        Calculate Take-Home Pay
                      </Button>
                    )}

                    {calculatedMonthlyTakeHome && calculatedYearlyTakeHome && (
                      <Alert className="bg-green-50 border-green-200">
                        <AlertDescription>
                          <div className="space-y-2">
                            <p className="text-gray-900">
                              Estimated Monthly Take-Home: <span className="text-green-600 font-medium">${calculatedMonthlyTakeHome}</span>
                            </p>
                            <p className="text-gray-900">
                              Estimated Yearly Take-Home: <span className="text-green-600 font-medium">${calculatedYearlyTakeHome}</span>
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                              This is a simplified estimate. Actual take-home may vary.
                            </p>
                          </div>
                        </AlertDescription>
                      </Alert>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            {/* Expenses Card */}
            <Card>
              <CardHeader>
                <CardTitle>Expenses</CardTitle>
                <CardDescription>Add your regular expenses</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {expenses.map((expense) => (
                  <div key={expense.id} className="space-y-3 p-4 border rounded-lg">
                    <div className="flex gap-3 items-end">
                      <div className="flex-1 space-y-2">
                        <Label>Expense Type</Label>
                        <Select
                          value={expense.type}
                          onValueChange={(value) => updateExpense(expense.id, "type", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select expense type" />
                          </SelectTrigger>
                          <SelectContent>
                            {commonExpenses.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex-1 space-y-2">
                        <Label>Amount</Label>
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={expense.amount}
                          onChange={(e) => updateExpense(expense.id, "amount", e.target.value)}
                        />
                      </div>
                      <div className="w-32 space-y-2">
                        <Label>Period</Label>
                        <Select
                          value={expense.period}
                          onValueChange={(value: "month" | "year") => updateExpense(expense.id, "period", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="month">Monthly</SelectItem>
                            <SelectItem value="year">Yearly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeExpense(expense.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    {expense.type === "Custom" && (
                      <div className="space-y-2">
                        <Label>Custom Expense Name</Label>
                        <Input
                          placeholder="Enter custom expense name"
                          value={expense.customType}
                          onChange={(e) => updateExpense(expense.id, "customType", e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                ))}

                <Button
                  variant="outline"
                  onClick={addExpense}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Expense
                </Button>
              </CardContent>
            </Card>

            {/* Debt Card */}
            <Card>
              <CardHeader>
                <CardTitle>Debt</CardTitle>
                <CardDescription>Add your debt payments (optional)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {debts.map((debt) => (
                  <div key={debt.id} className="flex gap-3 items-end">
                    <div className="flex-1 space-y-2">
                      <Label>Debt Type</Label>
                      <Select
                        value={debt.type}
                        onValueChange={(value) => updateDebt(debt.id, "type", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select debt type" />
                        </SelectTrigger>
                        <SelectContent>
                          {debtTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label>Payment Amount</Label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={debt.amount}
                        onChange={(e) => updateDebt(debt.id, "amount", e.target.value)}
                      />
                    </div>
                    <div className="w-32 space-y-2">
                      <Label>Period</Label>
                      <Select
                        value={debt.period}
                        onValueChange={(value: "month" | "year") => updateDebt(debt.id, "period", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="month">Monthly</SelectItem>
                          <SelectItem value="year">Yearly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeDebt(debt.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}

                <Button
                  variant="outline"
                  onClick={addDebt}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Debt Payment
                </Button>
              </CardContent>
            </Card>

            {/* Donations Card */}
            <Card>
              <CardHeader>
                <CardTitle>Donations</CardTitle>
                <CardDescription>Add your charitable giving (optional)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {donations.map((donation) => (
                  <div key={donation.id} className="flex gap-3 items-end">
                    <div className="flex-1 space-y-2">
                      <Label>Organization</Label>
                      <Input
                        placeholder="e.g., Local Church, Charity Name"
                        value={donation.organization}
                        onChange={(e) => updateDonation(donation.id, "organization", e.target.value)}
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label>Amount</Label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={donation.amount}
                        onChange={(e) => updateDonation(donation.id, "amount", e.target.value)}
                      />
                    </div>
                    <div className="w-32 space-y-2">
                      <Label>Period</Label>
                      <Select
                        value={donation.period}
                        onValueChange={(value: "month" | "year") => updateDonation(donation.id, "period", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="month">Monthly</SelectItem>
                          <SelectItem value="year">Yearly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeDonation(donation.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}

                <Button
                  variant="outline"
                  onClick={addDonation}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Donation
                </Button>
              </CardContent>
            </Card>

            {/* Continue Button */}
            {isSectionComplete(1) && (
              <div className="flex justify-end">
                <Button 
                  onClick={() => setCurrentSection(2)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Continue to Budget Model <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        )}

        {/* SECTION 2: Ron Blue Live.Give.Grow Model */}
        {currentSection === 2 && (
          <div className="space-y-6">
            {/* Ron Blue Model Explanation */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-900">Live. Give. Grow. Budget Model</CardTitle>
                <CardDescription className="text-blue-700">
                  Your budget structure based on proven biblical financial principles
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert className="bg-white border-blue-300">
                  <AlertDescription>
                    <p className="text-sm text-gray-700">
                      <strong>Disclaimer:</strong> This budget template is based on the Ron Blue Live. Give. Grow. financial model. 
                      Calcura is not affiliated with or endorsed by Ron Blue. We use this model as a framework to help you organize your finances.
                    </p>
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div className="bg-green-50 p-6 rounded-lg border-2 border-green-300">
                    <h3 className="text-green-900 text-lg font-medium mb-2">Live</h3>
                    <p className="text-green-700 mb-4">
                      Your essential living expenses: housing, food, utilities, transportation, and insurance.
                    </p>
                    <p className="text-sm text-green-600">
                      <strong>From your entries:</strong> {expenses.length} expense{expenses.length !== 1 ? 's' : ''} + {debts.length} debt payment{debts.length !== 1 ? 's' : ''}
                    </p>
                  </div>

                  <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-300">
                    <h3 className="text-blue-900 text-lg font-medium mb-2">Give</h3>
                    <p className="text-blue-700 mb-4">
                      Charitable contributions and tithing to support causes you care about and honor God with your finances.
                    </p>
                    <p className="text-sm text-blue-600">
                      <strong>From your entries:</strong> {donations.length} donation{donations.length !== 1 ? 's' : ''}
                    </p>
                  </div>

                  <div className="bg-purple-50 p-6 rounded-lg border-2 border-purple-300">
                    <h3 className="text-purple-900 text-lg font-medium mb-2">Grow</h3>
                    <p className="text-purple-700 mb-4">
                      Savings, investments, and additional debt repayment to build your financial future and wealth.
                    </p>
                    <p className="text-sm text-purple-600">
                      <strong>Let's add your growth accounts below...</strong>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Savings Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-purple-900">Savings Accounts (Grow)</CardTitle>
                <CardDescription>Add your savings accounts and current balances</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {savingsAccounts.map((saving) => (
                  <div key={saving.id} className="flex gap-3 items-end">
                    <div className="flex-1 space-y-2">
                      <Label>Account Name</Label>
                      <Input
                        placeholder="e.g., Emergency Fund, Vacation Savings"
                        value={saving.accountName}
                        onChange={(e) => updateSavings(saving.id, "accountName", e.target.value)}
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label>Current Balance</Label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={saving.amount}
                        onChange={(e) => updateSavings(saving.id, "amount", e.target.value)}
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeSavings(saving.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}

                <Button
                  variant="outline"
                  onClick={addSavings}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Savings Account
                </Button>
              </CardContent>
            </Card>

            {/* Investments Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-purple-900">Investment Accounts (Grow)</CardTitle>
                <CardDescription>Add your investment accounts and current values</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {investments.map((investment) => (
                  <div key={investment.id} className="flex gap-3 items-end">
                    <div className="flex-1 space-y-2">
                      <Label>Account Name</Label>
                      <Input
                        placeholder="e.g., 401(k), IRA, Brokerage"
                        value={investment.accountName}
                        onChange={(e) => updateInvestment(investment.id, "accountName", e.target.value)}
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label>Current Value</Label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={investment.amount}
                        onChange={(e) => updateInvestment(investment.id, "amount", e.target.value)}
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeInvestment(investment.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}

                <Button
                  variant="outline"
                  onClick={addInvestment}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Investment Account
                </Button>
              </CardContent>
            </Card>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <Button 
                variant="outline"
                onClick={() => setCurrentSection(1)}
              >
                Back to Income & Expenses
              </Button>
              <Button 
                onClick={() => setCurrentSection(3)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Continue to Review <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* SECTION 3: Review & Create */}
        {currentSection === 3 && (
          <div className="space-y-6">
            {/* Summary Card */}
            <Card>
              <CardHeader>
                <CardTitle>Budget Summary</CardTitle>
                <CardDescription>Review your complete budget before creating</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Income Summary */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Income</h3>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <p className="text-green-900 font-medium text-xl">
                      ${incomeType === "takehome" ? takeHomePay : calculatedMonthlyTakeHome}/month
                    </p>
                    <p className="text-sm text-green-700 mt-1">Monthly take-home pay</p>
                  </div>
                </div>

                {/* Live Summary */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Live (Essential Expenses)</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-gray-700">Regular Expenses</span>
                      <span className="font-medium">{expenses.length} items</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-gray-700">Debt Payments</span>
                      <span className="font-medium">{debts.length} payments</span>
                    </div>
                  </div>
                </div>

                {/* Give Summary */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Give (Charitable Giving)</h3>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-700">Donations</span>
                    <span className="font-medium">{donations.length} organizations</span>
                  </div>
                </div>

                {/* Grow Summary */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Grow (Savings & Investments)</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-gray-700">Savings Accounts</span>
                      <span className="font-medium">{savingsAccounts.length} accounts</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-gray-700">Investment Accounts</span>
                      <span className="font-medium">{investments.length} accounts</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Retirement Question */}
            {!showRetirementQuestion && (
              <Card>
                <CardHeader>
                  <CardTitle>Retirement Planning</CardTitle>
                  <CardDescription>Would you like to calculate your retirement needs?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">
                    Our retirement calculator can help you estimate how much you need to save for a comfortable retirement based on your current financial situation.
                  </p>

                  <div className="flex gap-3">
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setShowRetirementQuestion(true);
                        alert("Budget template created successfully!");
                      }}
                      className="flex-1"
                    >
                      Skip for Now
                    </Button>
                    <Button 
                      onClick={() => {
                        setShowRetirementQuestion(true);
                        alert("Retirement calculator feature coming soon! Your budget template has been created.");
                      }}
                      className="bg-green-600 hover:bg-green-700 flex-1"
                    >
                      Calculate Retirement
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <Button 
                variant="outline"
                onClick={() => setCurrentSection(2)}
              >
                Back to Budget Model
              </Button>
              <Button 
                onClick={() => {
                  // Create budget data with proper type conversion
                  const monthlyIncome = incomeType === "takehome" 
                    ? parseFloat(takeHomePay || "0") 
                    : parseFloat(calculatedMonthlyTakeHome || "0");
                  
                  const yearlyIncome = incomeType === "takehome"
                    ? parseFloat(takeHomePay || "0") * 12
                    : parseFloat(calculatedYearlyTakeHome || "0");

                  setBudget({
                    incomeType: incomeType as "takehome" | "annual",
                    monthlyIncome,
                    annualIncome: yearlyIncome,
                    expenses: expenses.map(e => ({
                      id: e.id,
                      type: e.type,
                      customType: e.customType,
                      amount: parseFloat(e.amount || "0"),
                      period: e.period
                    })),
                    debts: debts.map(d => ({
                      id: d.id,
                      type: d.type,
                      amount: parseFloat(d.amount || "0"),
                      period: d.period
                    })),
                    donations: donations.map(d => ({
                      id: d.id,
                      organization: d.organization,
                      amount: parseFloat(d.amount || "0"),
                      period: d.period
                    })),
                    savingsAccounts: savingsAccounts.map(s => ({
                      id: s.id,
                      accountName: s.accountName,
                      amount: parseFloat(s.amount || "0")
                    })),
                    investments: investments.map(i => ({
                      id: i.id,
                      accountName: i.accountName,
                      amount: parseFloat(i.amount || "0")
                    })),
                    createdAt: new Date().toISOString()
                  });
                  
                  toast.success("Budget created successfully!");
                  if (onBudgetCreated) onBudgetCreated();
                }}
                className="bg-green-600 hover:bg-green-700"
              >
                <Check className="mr-2 w-4 h-4" />
                Create Budget
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}