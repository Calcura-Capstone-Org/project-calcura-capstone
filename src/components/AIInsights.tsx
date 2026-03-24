/* Jaeyeong Shin programmed all 69 lines of code in this file*/
import { Card } from "./ui/card";
import { Sparkles, TrendingUp, AlertCircle, Target } from "lucide-react";
import { Badge } from "./ui/badge";

/* API URL */
const API_URL = import.meta.env.VITE_API_URL;

//remove later
console.log("API_URL =", API_URL);

interface Insight {
  id: string;
  type: 'recommendation' | 'warning' | 'goal';
  title: string;
  description: string;
}

interface AIInsightsProps {
  insights: Insight[];
}

export function AIInsights({ insights }: AIInsightsProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'recommendation':
        return <TrendingUp className="w-5 h-5 text-blue-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-orange-600" />;
      case 'goal':
        return <Target className="w-5 h-5 text-green-600" />;
      default:
        return <Sparkles className="w-5 h-5 text-purple-600" />;
    }
  };

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'recommendation':
        return 'default';
      case 'warning':
        return 'destructive';
      case 'goal':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-purple-600" />
        <h2>AI-Driven Insights</h2>
      </div>
      <div className="space-y-4">
        {insights.map((insight) => (
          <div key={insight.id} className="flex gap-3 p-4 bg-gray-50 rounded-lg">
            <div className="mt-0.5">
              {getIcon(insight.type)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span>{insight.title}</span>
                <Badge variant={getBadgeVariant(insight.type)} className="capitalize">
                  {insight.type}
                </Badge>
              </div>
              <p className="text-gray-600">{insight.description}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
