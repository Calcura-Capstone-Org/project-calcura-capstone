/*Jaren Schneider wrote all 30 lines of code for this file*/
import { Card } from "./ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

/* API URL */
const API_URL = import.meta.env.VITE_API_URL;

//remove later
console.log("API_URL =", API_URL);

interface SpendingChartProps {
  data: Array<{
    month: string;
    income: number;
    expenses: number;
  }>;
}

export function SpendingChart({ data }: SpendingChartProps) {
  return (
    <Card className="p-6">
      <h2 className="mb-4">Income vs Expenses</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} />
          <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
