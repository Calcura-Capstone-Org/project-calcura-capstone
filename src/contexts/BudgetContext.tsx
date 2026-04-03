import { createContext, useContext, useState, ReactNode } from "react";

// Budget data structure
export interface BudgetData {
  // Income information
  incomeType: "takehome" | "annual";
  monthlyIncome: number;
  annualIncome: number;
  
  // Expenses
  expenses: Array<{
    id: string;
    type: string;
    customType?: string;
    amount: number;
    period: "month" | "year";
  }>;
  
  // Debts
  debts: Array<{
    id: string;
    type: string;
    amount: number;
    period: "month" | "year";
  }>;
  
  // Donations
  donations: Array<{
    id: string;
    organization: string;
    amount: number;
    period: "month" | "year";
  }>;
  
  // Savings accounts
  savingsAccounts: Array<{
    id: string;
    accountName: string;
    amount: number;
  }>;
  
  // Investment accounts
  investments: Array<{
    id: string;
    accountName: string;
    amount: number;
  }>;
  
  // Created date
  createdAt: string;
}

// Context type
interface BudgetContextType {
  budget: BudgetData | null;
  setBudget: (budget: BudgetData) => void;
  hasBudget: boolean;
}

// Create the context
const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

// Provider component
export function BudgetProvider({ children }: { children: ReactNode }) {
  const [budget, setBudgetState] = useState<BudgetData | null>(null);

  const setBudget = (newBudget: BudgetData) => {
    setBudgetState(newBudget);
  };

  return (
    <BudgetContext.Provider 
      value={{ 
        budget, 
        setBudget,
        hasBudget: budget !== null 
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
}

// Custom hook to use the budget context
export function useBudget() {
  const context = useContext(BudgetContext);
  if (context === undefined) {
    throw new Error("useBudget must be used within a BudgetProvider");
  }
  return context;
}
