/* Jaren Schneider programmed all 72 lines of code in this file */
import { Card } from "./ui/card";
import { TrendingUp, TrendingDown, Wallet, ArrowUpCircle, ArrowDownCircle } from "lucide-react";

/* API URL */
const API_URL = import.meta.env.VITE_API_URL;

//remove later
console.log("API_URL =", API_URL);

interface BudgetSummaryProps {
  balance: number;
  income: number;
  expenses: number;
  incomeChange: number;
  expenseChange: number;
}

export function BudgetSummary({ balance, income, expenses, incomeChange, expenseChange }: BudgetSummaryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600">Total Balance</p>
            <p className="text-3xl mt-2">${balance.toLocaleString()}</p>
          </div>
          <div className="bg-blue-100 p-3 rounded-full">
            <Wallet className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600">Income</p>
            <p className="text-3xl mt-2 text-green-600">${income.toLocaleString()}</p>
            <div className="flex items-center gap-1 mt-2">
              {incomeChange >= 0 ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
              <span className={`${incomeChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(incomeChange)}% from last month
              </span>
            </div>
          </div>
          <div className="bg-green-100 p-3 rounded-full">
            <ArrowUpCircle className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600">Expenses</p>
            <p className="text-3xl mt-2 text-red-600">${expenses.toLocaleString()}</p>
            <div className="flex items-center gap-1 mt-2">
              {expenseChange <= 0 ? (
                <TrendingDown className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingUp className="w-4 h-4 text-red-600" />
              )}
              <span className={`${expenseChange <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(expenseChange)}% from last month
              </span>
            </div>
          </div>
          <div className="bg-red-100 p-3 rounded-full">
            <ArrowDownCircle className="w-6 h-6 text-red-600" />
          </div>
        </div>
      </Card>
    </div>
  );
}
