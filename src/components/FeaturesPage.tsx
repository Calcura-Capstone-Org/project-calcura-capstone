/* Jaren Schenider wrote all 46 lines of code for this file.*/
import { Card } from "./ui/card";
import { BarChart3, Calendar, Search, Lightbulb, Target, Zap } from "lucide-react";
import { useState, useEffect } from "react";

/* API URL */
const API_URL = import.meta.env.VITE_API_URL;

//remove later
console.log("API_URL =", API_URL);

// Icon mapping
const iconMap: { [key: string]: React.ComponentType<any> } = {
  BarChart3,
  Calendar,
  Search,
  Lightbulb,
  Target,
  Zap,
};

interface Feature {
  feature_id: string;
  title: string;
  description: string;
  icon: string;
}

interface FeaturesSectionProps {
  onRecommendBudgetClick?: () => void;
  onGoalSettingClick?: () => void;
  onGoalSeekClick?: () => void;
}

export function FeaturesSection({ onRecommendBudgetClick, onGoalSettingClick, onGoalSeekClick }: FeaturesSectionProps) {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/content/features`)
      .then((res) => res.json())
      .then((data) => {
        setFeatures(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-gray-900 mb-12">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-8 bg-gray-100 rounded-lg animate-pulse h-64"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-gray-900 mb-12">Features</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = iconMap[feature.icon] || BarChart3;
            const isRecommended = feature.title === "Recommended Budget";
            const isGoalSetting = feature.title === "Goal Setting";
            const isGoalSeek = feature.title === "Goal Seek Budgeting";
            return (
              <Card
                key={feature.feature_id}
                className={`p-8 text-center hover:shadow-lg transition-shadow${
                  isRecommended || isGoalSetting || isGoalSeek ? " cursor-pointer" : ""
                }`}
                onClick={
                  isRecommended ? onRecommendBudgetClick
                  : isGoalSetting ? onGoalSettingClick
                  : isGoalSeek ? onGoalSeekClick
                  : undefined
                }
              >
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
