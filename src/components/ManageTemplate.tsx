/*Joseph Spreckels wrote 853 lines of code for this file */
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Plus, Trash2, ArrowRight } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

interface TemplatePageProps {
  onTemplateSaved?: () => void;
}

/* API URL */
const API_URL = import.meta.env.VITE_API_URL;

//remove later
console.log("API_URL =", API_URL);

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

interface TemplateOption {
  id: number;
  name: string;
}

interface TemplateItemApi {
  item_id: number;
  template_id: number;
  category_id: number;
  planned_amt: number;
  item_name?: string;
  period?: "month" | "year";
}

export function TemplatePage({ onTemplateSaved }: TemplatePageProps) {
  const [currentSection, setCurrentSection] = useState(1);
  const [activeUserEmail, setActiveUserEmail] = useState("");
  const [userTemplates, setUserTemplates] = useState<TemplateOption[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [isLoadingTemplate, setIsLoadingTemplate] = useState(false);
  const [templateLoadError, setTemplateLoadError] = useState("");
  
  // Income section
  const [incomeType, setIncomeType] = useState<"takehome" | "">("");
  const [takeHomePay, setTakeHomePay] = useState("");
  
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

  // Template save state
  const [templateName, setTemplateName] = useState("");
  const [templateSaved, setTemplateSaved] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [isDeletingTemplate, setIsDeletingTemplate] = useState(false);

  const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  useEffect(() => {
    const userEmail = localStorage.getItem("email");
    if (userEmail) {
      setActiveUserEmail(userEmail);
    }
    const userId = localStorage.getItem("user_id");
    if (userId) {
      setCurrentUserId(Number(userId));
    }
  }, []);

  useEffect(() => {
    if (!currentUserId || !API_URL) {
      return;
    }

    const loadUserTemplates = async () => {
      try {
        const response = await fetch(`${API_URL}/templates/`);
        if (!response.ok) {
          throw new Error(`Failed loading templates: ${response.status}`);
        }

        const templates = (await response.json()) as Array<{ template_id: number; user_id: number; name: string }>;
        const ownedTemplates = templates
          .filter((template) => Number(template.user_id) === Number(currentUserId))
          .map((template) => ({ id: template.template_id, name: template.name }));
        setUserTemplates(ownedTemplates);
      } catch (error) {
        console.error(error);
        setTemplateLoadError("Unable to load your templates right now.");
      }
    };

    void loadUserTemplates();
  }, [currentUserId]);

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
    if (!takeHomePay || !filingStatus) return;

    const monthly = parseFloat(takeHomePay);
    if (!Number.isFinite(monthly) || monthly <= 0) return;
    const annual = monthly * 12;
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

  const loadTemplateData = async (templateId: number) => {
    if (!API_URL) {
      setTemplateLoadError("API URL is not configured.");
      return;
    }

    setIsLoadingTemplate(true);
    setTemplateLoadError("");

    try {
      const response = await fetch(`${API_URL}/template_items/`);
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed loading template items: ${response.status} ${text}`);
      }

      const allItems = (await response.json()) as TemplateItemApi[];
      const items = allItems.filter((item) => Number(item.template_id) === Number(templateId));

      const loadedExpenses: Expense[] = [];
      const loadedDebts: Debt[] = [];
      const loadedDonations: Donation[] = [];
      const loadedSavings: Savings[] = [];
      const loadedInvestments: Investment[] = [];

      const expenseCategoryNames: Record<number, string> = {
        201: "Housing/Rent",
        202: "Utilities",
        203: "Groceries",
        204: "Transportation",
        205: "Insurance",
        206: "Phone",
        207: "Internet",
        208: "Entertainment",
        209: "Dining Out",
        210: "Healthcare",
        211: "Custom",
      };

      const debtCategoryNames: Record<number, string> = {
        301: "Mortgage",
        302: "Car Payment",
        303: "Student Loan",
        304: "Credit Card",
        305: "Personal Loan",
        306: "Other",
      };

      let loadedIncome = "";

      for (const item of items) {
        const categoryId = Number(item.category_id);
        const amount = Number(item.planned_amt);
        if (!Number.isFinite(amount) || amount < 0) {
          continue;
        }

        if (categoryId === 101) {
          loadedIncome = String(amount);
          continue;
        }

        if (categoryId >= 201 && categoryId <= 211) {
          const type = expenseCategoryNames[categoryId] ?? "Custom";
          loadedExpenses.push({
            id: createId(),
            type,
            customType: type === "Custom" ? (item.item_name ?? "") : "",
            amount: String(amount),
            period: item.period === "year" ? "year" : "month",
          });
          continue;
        }

        if (categoryId >= 301 && categoryId <= 306) {
          loadedDebts.push({
            id: createId(),
            type: debtCategoryNames[categoryId] ?? "Other",
            amount: String(amount),
            period: item.period === "year" ? "year" : "month",
          });
          continue;
        }

        if (categoryId >= 400 && categoryId < 500) {
          loadedDonations.push({
            id: createId(),
            organization: item.item_name ?? "",
            amount: String(amount),
            period: item.period === "year" ? "year" : "month",
          });
          continue;
        }

        if (categoryId >= 500 && categoryId < 600) {
          loadedSavings.push({
            id: createId(),
            accountName: item.item_name ?? "",
            amount: String(amount),
          });
          continue;
        }

        if (categoryId >= 600 && categoryId < 700) {
          loadedInvestments.push({
            id: createId(),
            accountName: item.item_name ?? "",
            amount: String(amount),
          });
        }
      }

      const selectedTemplate = userTemplates.find((template) => Number(template.id) === Number(templateId));
      setTemplateName(selectedTemplate?.name ?? "");
      setIncomeType(loadedIncome ? "takehome" : "");
      setTakeHomePay(loadedIncome);
      setExpenses(loadedExpenses);
      setDebts(loadedDebts);
      setDonations(loadedDonations);
      setSavingsAccounts(loadedSavings);
      setInvestments(loadedInvestments);
      setCurrentSection(10);
      setTemplateSaved(false);
    } catch (error) {
      console.error(error);
      setTemplateLoadError("Unable to load that template.");
    } finally {
      setIsLoadingTemplate(false);
    }
  };

  const deleteTemplateItemsForTemplate = async (templateId: number) => {
    const existingItemsResponse = await fetch(`${API_URL}/template_items/`);
    if (!existingItemsResponse.ok) {
      const text = await existingItemsResponse.text();
      throw new Error(`Failed loading existing template items: ${existingItemsResponse.status} ${text}`);
    }

    const existingItems = (await existingItemsResponse.json()) as TemplateItemApi[];
    const existingForTemplate = existingItems.filter(
      (item) => Number(item.template_id) === templateId
    );

    if (existingForTemplate.length === 0) {
      return;
    }

    const deleteResponses = await Promise.all(
      existingForTemplate.map((item) => fetch(`${API_URL}/template_items/${item.item_id}`, { method: "DELETE" }))
    );

    for (const deleteResponse of deleteResponses) {
      if (!deleteResponse.ok) {
        const text = await deleteResponse.text();
        throw new Error(`Failed deleting old template item: ${deleteResponse.status} ${text}`);
      }
    }
  };

  const saveTemplate = async () => {
    if (!selectedTemplateId) {
      alert("Please select a template to update.");
      return;
    }
    if (!currentUserId) {
      alert("Please sign in to save a template.");
      return;
    }

    if (!API_URL) {
      alert("API URL is not configured.");
      return;
    }

    try {
      const templateId = Number(selectedTemplateId);
      await deleteTemplateItemsForTemplate(templateId);

      const incomeAmt = parseFloat(takeHomePay);
      if (Number.isFinite(incomeAmt) && incomeAmt > 0) {
        const incomeResponse = await fetch(`${API_URL}/template_items/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            template_id: templateId,
            category_id: 101,
            planned_amt: incomeAmt,
            item_name: "Income"
          })
        });

        if (!incomeResponse.ok) {
          const text = await incomeResponse.text();
          throw new Error(`Failed saving income template item: ${incomeResponse.status} ${text}`);
        }
      }

      const categoryMap: { [key: string]: number } = {
        "Housing/Rent": 201,
        "Utilities": 202,
        "Groceries": 203,
        "Transportation": 204,
        "Insurance": 205,
        "Phone": 206,
        "Internet": 207,
        "Entertainment": 208,
        "Dining Out": 209,
        "Healthcare": 210,
        "Custom": 211
      };

      const expenseFetches = expenses
        .map((exp) => {
          const amount = parseFloat(exp.amount);
          if (!exp.type || Number.isNaN(amount) || amount <= 0) {
            return null;
          }
          const category_id = categoryMap[exp.type] ?? 211;
          const item_name = exp.type === "Custom"
            ? exp.customType?.trim() || "Custom"
            : exp.type;

          return fetch(`${API_URL}/template_items/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              template_id: templateId,
              category_id,
              planned_amt: amount,
              item_name
            })
          });
        })
        .filter((req) => req !== null) as Promise<Response>[];

      const debtMap: { [key: string]: number } = {
        "Mortgage": 301,
        "Car Payment": 302,
        "Student Loan": 303,
        "Credit Card": 304,
        "Personal Loan": 305,
        "Other": 306
      };

      const debtFetches = debts
        .map((debt) => {
          const amount = parseFloat(debt.amount);
          if (!debt.type || Number.isNaN(amount) || amount <= 0) {
            return null;
          }
          const category_id = debtMap[debt.type] ?? 306;

          return fetch(`${API_URL}/template_items/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              template_id: templateId,
              category_id,
              planned_amt: amount,
              item_name: debt.type
            })
          });
        })
        .filter((req) => req !== null) as Promise<Response>[];

      const donationFetches = donations
        .map((donation) => {
          const amount = parseFloat(donation.amount);
          if (!donation.organization || Number.isNaN(amount) || amount <= 0) {
            return null;
          }

          return fetch(`${API_URL}/template_items/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              template_id: templateId,
              category_id: 401,
              planned_amt: amount,
              item_name: donation.organization
            })
          });
        })
        .filter((req) => req !== null) as Promise<Response>[];

      const savingsFetches = savingsAccounts
        .map((saving) => {
          const amount = parseFloat(saving.amount);
          if (!saving.accountName || Number.isNaN(amount) || amount <= 0) {
            return null;
          }

          return fetch(`${API_URL}/template_items/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              template_id: templateId,
              category_id: 501,
              planned_amt: amount,
              item_name: saving.accountName
            })
          });
        })
        .filter((req) => req !== null) as Promise<Response>[];

      const investingFetches = investments
        .map((investment) => {
          const amount = parseFloat(investment.amount);
          if (!investment.accountName || Number.isNaN(amount) || amount <= 0) {
            return null;
          }
          return fetch(`${API_URL}/template_items/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              template_id: templateId,
              category_id: 601,
              planned_amt: amount,
              item_name: investment.accountName
            })
          });
        })
        .filter((req) => req !== null) as Promise<Response>[];

      const itemFetches = [...expenseFetches, ...debtFetches, ...donationFetches, ...savingsFetches, ...investingFetches];

      if (itemFetches.length > 0) {
        const itemResponses = await Promise.all(itemFetches);
        for (const itemResponse of itemResponses) {
          if (!itemResponse.ok) {
            const text = await itemResponse.text();
            throw new Error(`Failed saving template item: ${itemResponse.status} ${text}`);
          }
        }
      }

      setTemplateSaved(true);
      // user confirmation before redirecting
      alert("Template updated");
      if (onTemplateSaved) {
        onTemplateSaved();
      }
    } catch (error) {
      console.error(error);
      alert("Unable to save template right now. Please try again.");
    }
  };

  const handleDeleteBudget = async () => {
    if (!selectedTemplateId) {
      alert("Please select a template to delete.");
      return;
    }

    if (!API_URL) {
      alert("API URL is not configured.");
      return;
    }

    const selectedTemplate = userTemplates.find((template) => String(template.id) === selectedTemplateId);
    const templateLabel = selectedTemplate?.name ?? "this template";
    const shouldDelete = window.confirm(`Delete ${templateLabel}? This will permanently remove the template and all of its budget items.`);
    if (!shouldDelete) {
      return;
    }

    try {
      setIsDeletingTemplate(true);
      const templateId = Number(selectedTemplateId);

      await deleteTemplateItemsForTemplate(templateId);

      const deleteTemplateResponse = await fetch(`${API_URL}/templates/${templateId}`, {
        method: "DELETE",
      });

      if (!deleteTemplateResponse.ok) {
        const text = await deleteTemplateResponse.text();
        throw new Error(`Failed deleting template: ${deleteTemplateResponse.status} ${text}`);
      }

      setUserTemplates((current) => current.filter((template) => Number(template.id) !== templateId));
      setSelectedTemplateId("");
      setTemplateName("");
      setIncomeType("");
      setTakeHomePay("");
      setExpenses([]);
      setDebts([]);
      setDonations([]);
      setSavingsAccounts([]);
      setInvestments([]);
      setTemplateSaved(false);
      setCurrentSection(1);

      alert("Budget deleted.");
    } catch (error) {
      console.error(error);
      alert("Unable to delete budget right now. Please try again.");
    } finally {
      setIsDeletingTemplate(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-gray-900 mb-2">Manage Your Budget Template</h1>
          {activeUserEmail && (
            <p className="text-sm text-gray-500 mb-1">Signed in as: {activeUserEmail}</p>
          )}
          <p className="text-gray-600">Select one of your existing templates, edit it, then save changes.</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Select Existing Template</CardTitle>
            <CardDescription>Choose a template you already created to load and edit.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <select
              className="w-full border rounded px-3 py-2"
              value={selectedTemplateId}
              onChange={(e) => {
                const nextTemplateId = e.target.value;
                setSelectedTemplateId(nextTemplateId);
                setTemplateSaved(false);
                setTemplateLoadError("");
                if (nextTemplateId) {
                  void loadTemplateData(Number(nextTemplateId));
                }
              }}
            >
              <option value="">Select a template</option>
              {userTemplates.map((template) => (
                <option key={template.id} value={String(template.id)}>
                  {template.name}
                </option>
              ))}
            </select>

            {isLoadingTemplate && <p className="text-sm text-gray-500">Loading template data...</p>}
            {templateLoadError && <p className="text-sm text-red-600">{templateLoadError}</p>}
            {!isLoadingTemplate && userTemplates.length === 0 && !templateLoadError && (
              <p className="text-sm text-gray-500">No templates found for your account.</p>
            )}
          </CardContent>
        </Card>

        {selectedTemplateId && (
          <>

        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((step) => (
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
                <Label>Take-home pay</Label>
                <div className="flex gap-4">
                  <Button
                    variant={incomeType === "takehome" ? "default" : "outline"}
                    onClick={() => setIncomeType("takehome")}
                    className={incomeType === "takehome" ? "bg-green-600 hover:bg-green-700" : ""}
                  >
                    Monthly Take-Home
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

              {(incomeType === "takehome" && takeHomePay) && (
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
                        onValueChange={(value: "month") => updateExpense(expense.id, "period", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="month">Monthly</SelectItem>
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
        {currentSection >= 9 && (
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
                    setCurrentSection(10);
                  }}
                  className="flex-1"
                >
                  Skip for Now
                </Button>
                <Button 
                  onClick={() => {
                    setShowRetirementQuestion(true);
                    setCurrentSection(10);
                  }}
                  className="bg-green-600 hover:bg-green-700 flex-1"
                >
                  Calculate Retirement
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Section 10: Save Template */}
        {currentSection >= 10 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Save Template Changes</CardTitle>
              <CardDescription>This replaces all existing template items for the selected template.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {templateName && <p className="text-sm text-gray-600">Editing template: {templateName}</p>}

              <div className="flex gap-3">
                <Button
                  className="bg-green-600 hover:bg-green-700 flex-1"
                  onClick={saveTemplate}
                  disabled={!selectedTemplateId || isDeletingTemplate}
                >
                  Save Changes
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={handleDeleteBudget}
                  disabled={!selectedTemplateId || isDeletingTemplate}
                >
                  {isDeletingTemplate ? "Deleting..." : "Delete Budget"}
                </Button>
              </div>

              {templateSaved && (
                <Alert className="bg-green-50 border-green-200">
                  <AlertDescription>Template saved</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}
          </>
        )}
      </div>
    </div>
  );
}
