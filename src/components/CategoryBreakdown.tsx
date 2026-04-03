import { Card } from "./ui/card";
import { Progress } from "./ui/progress";

interface Category {
  name: string;
  spent: number;
  budget: number;
  color: string;
}

interface CategoryBreakdownProps {
  categories: Category[];
}

export function CategoryBreakdown({ categories }: CategoryBreakdownProps) {
  return (
    <Card className="p-6">
      <h2 className="mb-4">Budget by Category</h2>
      <div className="space-y-4">
        {categories.map((category) => {
          const percentage = (category.spent / category.budget) * 100;
          const isOverBudget = percentage > 100;
          
          return (
            <div key={category.name}>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: category.color }}
                  />
                  <span>{category.name}</span>
                </div>
                <span className={isOverBudget ? 'text-red-600' : ''}>
                  ${category.spent} / ${category.budget}
                </span>
              </div>
              <Progress 
                value={Math.min(percentage, 100)} 
                className="h-2"
              />
              {isOverBudget && (
                <p className="text-red-600 mt-1">
                  Over budget by ${category.spent - category.budget}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
