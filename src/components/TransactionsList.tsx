import { Card } from "./ui/card";
import { Badge } from "./ui/badge";

interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  type: 'income' | 'expense';
}

interface TransactionsListProps {
  transactions: Transaction[];
}

export function TransactionsList({ transactions }: TransactionsListProps) {
  return (
    <Card className="p-6">
      <h2 className="mb-4">Recent Transactions</h2>
      <div className="space-y-3">
        {transactions.map((transaction) => (
          <div 
            key={transaction.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex-1">
              <p>{transaction.description}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline">{transaction.category}</Badge>
                <span className="text-gray-500">{transaction.date}</span>
              </div>
            </div>
            <p className={`${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
              {transaction.type === 'income' ? '+' : '-'}${Math.abs(transaction.amount).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
