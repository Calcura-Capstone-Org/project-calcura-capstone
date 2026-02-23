*/ Jaeyeong Shin wrote all 98 lines of code for this File*/
import { Card } from "./ui/card";
import { useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Calculator } from "lucide-react";

interface WhatIfAnalysisProps {
  currentIncome: number;
  currentExpenses: number;
}

export function WhatIfAnalysis({ currentIncome, currentExpenses }: WhatIfAnalysisProps) {
  const [incomeChange, setIncomeChange] = useState(0);
  const [expenseChange, setExpenseChange] = useState(0);

  const projectedIncome = currentIncome + incomeChange;
  const projectedExpenses = currentExpenses + expenseChange;
  const projectedSavings = projectedIncome - projectedExpenses;
  const currentSavings = currentIncome - currentExpenses;
  const savingsChange = projectedSavings - currentSavings;

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="w-5 h-5 text-blue-600" />
        <h2>What-If Analysis</h2>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="income-change">Adjust Monthly Income</Label>
          <div className="flex gap-2 mt-2">
            <Input
              id="income-change"
              type="number"
              value={incomeChange}
              onChange={(e) => setIncomeChange(Number(e.target.value))}
              placeholder="0"
            />
            <Button 
              variant="outline" 
              onClick={() => setIncomeChange(0)}
            >
              Reset
            </Button>
          </div>
        </div>

        <div>
          <Label htmlFor="expense-change">Adjust Monthly Expenses</Label>
          <div className="flex gap-2 mt-2">
            <Input
              id="expense-change"
              type="number"
              value={expenseChange}
              onChange={(e) => setExpenseChange(Number(e.target.value))}
              placeholder="0"
            />
            <Button 
              variant="outline" 
              onClick={() => setExpenseChange(0)}
            >
              Reset
            </Button>
          </div>
        </div>

        <div className="border-t pt-4 mt-4">
          <h3 className="mb-3">Projected Results</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Projected Income:</span>
              <span className="text-green-600">${projectedIncome.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Projected Expenses:</span>
              <span className="text-red-600">${projectedExpenses.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span>Projected Savings:</span>
              <span className={projectedSavings >= 0 ? 'text-green-600' : 'text-red-600'}>
                ${projectedSavings.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Change from Current:</span>
              <span className={savingsChange >= 0 ? 'text-green-600' : 'text-red-600'}>
                {savingsChange >= 0 ? '+' : ''}${savingsChange.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
