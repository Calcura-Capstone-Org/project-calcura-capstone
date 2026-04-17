/* Jaren Schenider wrote all 46 lines of code for this file.*/
import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import * as Icons from "lucide-react";
import { BarChart3, Calendar, Search } from "lucide-react";

/* API URL */
const API_URL = import.meta.env.VITE_API_URL;

interface FeatureData {
  feature_id: string;
  title: string;
  description: string;
  icon?: string;
}

const defaultFeatures: FeatureData[] = [
  {
    feature_id: "1",
    icon: "BarChart3",
    title: "Smart Budgeting",
    description: "Automatically categorize expenses and create intelligent budgets based on your spending patterns",
  },
  {
    feature_id: "2",
    icon: "Calendar",
    title: "Expense Tracking",
    description: "Track every dollar with ease and see where your money goes in real-time",
  },
  {
    feature_id: "3",
    icon: "Search",
    title: "Financial Insights",
    description: "Get insights and recommendations to optimize your financial health",
  },
];

export function FeaturesSection() {
  const [features, setFeatures] = useState<FeatureData[]>(defaultFeatures);

  useEffect(() => {
    fetch(`${API_URL}/content/features`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load homepage features");
        return res.json();
      })
      .then((data: FeatureData[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setFeatures(data);
        }
      })
      .catch(() => {
        // Keep fallback features if API call fails
      });
  }, []);

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-gray-900 mb-12">Features</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => {
            const IconComponent = (feature.icon && (Icons as any)[feature.icon]) || BarChart3;
            const Icon = typeof IconComponent === "function" ? IconComponent : BarChart3;
            return (
              <Card key={feature.feature_id} className="p-8 text-center hover:shadow-lg transition-shadow">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-2xl mb-6">
                  <Icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
