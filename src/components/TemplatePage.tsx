import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Plus, Trash2, ArrowRight } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

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

export function TemplatePage() {
  const [currentSection, setCurrentSection] = useState(1);
  
  // Income section
  const [incomeType, setIncomeType] = useState<"takehome" | "annual" | "">("");
  const [takeHomePay, setTakeHomePay] = useState("");
  const [annualIncome, setAnnualIncome] = useState("");
  
  // Tax section
  const [filingStatus, setFilingStatus] = useState("");
  const [calculatedMonthlyTakeHome, setCalculatedMonthlyTakeHome] = useState("");
  const [calculatedYearlyTakeHome, setCalculatedYearlyTakeHome] = useState("");
  
  // Expenses section
  const [expenses, setExpenses] = useState<Expense[]>([]);
  
  // Debt section
  const [debts, setDebts] = useState<Debt[]>([]);
  
  // Donations section
  const [donations, setDonations] = useState<Donation[]>([]);
  
  // Savings section
  const [savingsAccounts, setSavingsAccounts] = useState<Savings[]>([]);
  
  // Investing section
  const [investments, setInvestments] = useState<Investment[]>([]);
  
  // Retirement question
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

  const calculateTakeHome = () => {
    if (!annualIncome || !filingStatus) return;
    
    const annual = parseFloat(annualIncome);
    // Simplified tax calculation (this is a rough estimate)
    let taxRate = 0.22; // Default federal rate
    
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
    
    // Rough calculation: annual - (federal tax + FICA)
    const federalTax = annual * taxRate;
    const ficaTax = annual * 0.0765; // Social Security + Medicare
    const yearlyTakeHome = annual - federalTax - ficaTax;
    const monthlyTakeHome = yearlyTakeHome / 12;
    
    setCalculatedMonthlyTakeHome(monthlyTakeHome.toFixed(2));
    setCalculatedYearlyTakeHome(yearlyTakeHome.toFixed(2));
  };

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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-gray-900 mb-2">Create Your Budget Template</h1>
          <p className="text-gray-600">Let's build a personalized budget based on your financial situation</p>
        </div>

        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((step) => (
              <div
                key={step}
                className={`h-2 flex-1 rounded-full ${
                  step <= currentSection ? "bg-green-600" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Section 1: Income */}
        {currentSection >= 1 && (
          <Card className="mb-6">
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
              )}

              {((incomeType === "takehome" && takeHomePay) || (incomeType === "annual" && annualIncome)) && (
                <Button 
                  onClick={() => setCurrentSection(2)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Continue <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Section 2: Tax Calculator (only if annual income) */}
        {currentSection >= 2 && incomeType === "annual" && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Tax Calculator</CardTitle>
              <CardDescription>Let's calculate your take-home pay</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                        Estimated Monthly Take-Home Pay: <span className="text-green-600">${calculatedMonthlyTakeHome}</span>
                      </p>
                      <p className="text-gray-900">
                        Estimated Yearly Take-Home Pay: <span className="text-green-600">${calculatedYearlyTakeHome}</span>
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        This is a simplified estimate. Actual take-home may vary based on state taxes, deductions, and other factors.
                      </p>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {calculatedMonthlyTakeHome && (
                <Button 
                  onClick={() => setCurrentSection(3)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Continue <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Auto-advance to section 3 if take-home was selected */}
        {currentSection === 2 && incomeType === "takehome" && setCurrentSection(3)}

        {/* Section 3: Expenses */}
        {currentSection >= 3 && (
          <Card className="mb-6">
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

              {expenses.length > 0 && (
                <Button 
                  onClick={() => setCurrentSection(4)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Continue to Debt <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Section 4: Debt */}
        {currentSection >= 4 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Debt</CardTitle>
              <CardDescription>Add your debt payments (loans, mortgage, car payments)</CardDescription>
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
                Add Debt
              </Button>

              <div className="flex gap-3">
                <Button 
                  variant="outline"
                  onClick={() => setCurrentSection(5)}
                >
                  Skip Debt
                </Button>
                <Button 
                  onClick={() => setCurrentSection(5)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Continue to Donations <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Section 5: Donations */}
        {currentSection >= 5 && (
          <Card className="mb-6">
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

              <div className="flex gap-3">
                <Button 
                  variant="outline"
                  onClick={() => setCurrentSection(6)}
                >
                  Skip Donations
                </Button>
                <Button 
                  onClick={() => setCurrentSection(6)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Continue to Budget Model <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Section 6: Ron Blue Live.Give.Grow Model */}
        {currentSection >= 6 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Live. Give. Grow. Model</CardTitle>
              <CardDescription>Your budget structure based on proven principles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert className="bg-blue-50 border-blue-200">
                <AlertDescription>
                  <p className="text-sm text-gray-700">
                    <strong>Disclaimer:</strong> This budget template is based on the Ron Blue Live. Give. Grow. financial model. 
                    Calcura is not affiliated with or endorsed by Ron Blue. We use this model as a framework to help you organize your finances.
                  </p>
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h3 className="text-green-900 mb-2">Live</h3>
                  <p className="text-sm text-green-700">Your essential living expenses: housing, food, utilities, transportation, and insurance.</p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="text-blue-900 mb-2">Give</h3>
                  <p className="text-sm text-blue-700">Charitable contributions and tithing to support causes you care about.</p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h3 className="text-purple-900 mb-2">Grow</h3>
                  <p className="text-sm text-purple-700">Savings, investments, and debt repayment to build your financial future.</p>
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  className="bg-green-600 hover:bg-green-700 w-full"
                  onClick={() => setCurrentSection(7)}
                >
                  Continue to Savings <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Section 7: Savings */}
        {currentSection >= 7 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Savings</CardTitle>
              <CardDescription>Add your savings accounts (optional)</CardDescription>
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
                    <Label>Current Amount</Label>
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

              <div className="flex gap-3">
                <Button 
                  variant="outline"
                  onClick={() => setCurrentSection(8)}
                >
                  Skip Savings
                </Button>
                <Button 
                  onClick={() => setCurrentSection(8)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Continue to Investing <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Section 8: Investing */}
        {currentSection >= 8 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Investing</CardTitle>
              <CardDescription>Add your investment accounts (optional)</CardDescription>
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
                    <Label>Current Amount</Label>
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

              <div className="flex gap-3">
                <Button 
                  variant="outline"
                  onClick={() => setCurrentSection(9)}
                >
                  Skip Investing
                </Button>
                <Button 
                  onClick={() => setCurrentSection(9)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Continue <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Section 9: Retirement Question */}
        {currentSection >= 9 && !showRetirementQuestion && (
          <Card className="mb-6">
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
                    alert("Budget template created successfully! (Retirement calculator would be shown in a full implementation)");
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

        {showRetirementQuestion && (
          <Alert className="bg-green-50 border-green-200">
            <AlertDescription>
              <p className="text-gray-900">✓ Budget template created successfully!</p>
              <p className="text-sm text-gray-600 mt-2">Your personalized budget is ready to help you manage your finances.</p>
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
