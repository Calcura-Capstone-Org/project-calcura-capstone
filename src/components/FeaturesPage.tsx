/* Jaren Schneider wrote the original version of this file */
/* Jonathan Torres updated the UI styling */
import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { BarChart3, Calendar, Search } from "lucide-react";

/* API URL */
const API_URL = import.meta.env.VITE_API_URL;

//remove later
console.log("API_URL =", API_URL);

interface Feature {
  icon: any;
  title: string;
  description: string;
  color: string;
}

interface FeaturesSectionProps {
  onRecommendBudgetClick?: () => void;
  onGoalSettingClick?: () => void;
  onGoalSeekClick?: () => void;
  isAdmin?: boolean;
}

const defaultFeatures: Feature[] = [
  {
    icon: BarChart3,
    title: "Recommended Budget",
    description: "Get a recommended budget using your own information and tested financial principles",
    color: "bg-blue-600",
  },
  {
    icon: Calendar,
    title: "Goal Setting",
    description: "Set a financial goal and we will calculate what you need to do to achieve it",
    color: "bg-green-600",
  },
  {
    icon: Search,
    title: "Goal Seek Budgeting",
    description: "Get a budget recommendation to achieve a specific financial goal",
    color: "bg-purple-600",
  }
];

export function FeaturesSection({ onRecommendBudgetClick, onGoalSettingClick, onGoalSeekClick, isAdmin = false }: FeaturesSectionProps) {
  const [sectionTitle, setSectionTitle] = useState("Features");
  const [features, setFeatures] = useState(defaultFeatures);

  useEffect(() => {
    const savedTitle = localStorage.getItem("featuresPageTitle");
    if (savedTitle) setSectionTitle(savedTitle);

    const savedFeatures = localStorage.getItem("featuresPage");
    if (savedFeatures) {
      try {
        setFeatures(JSON.parse(savedFeatures));
      } catch (e) {
        console.error("Error parsing saved features", e);
      }
    }
  }, []);

  const handleTitleChange = (e: React.FormEvent<HTMLDivElement>) => {
    const newTitle = e.currentTarget.textContent || "";
    setSectionTitle(newTitle);
    localStorage.setItem("featuresPageTitle", newTitle);
  };

  const handleFeatureChange = (index: number, field: 'title' | 'description', value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    setFeatures(newFeatures);
    localStorage.setItem("featuresPage", JSON.stringify(newFeatures));
  };

  return (
    <section id="features" className="py-20 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2
            className="text-3xl font-bold text-blue-900 mb-3"
            contentEditable={isAdmin}
            onBlur={handleTitleChange}
            suppressContentEditableWarning={true}
          >
            {sectionTitle}
          </h2>
          <div className="w-16 h-1 bg-blue-500 mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isRecommended = feature.title === "Recommended Budget";
            const isGoalSetting = feature.title === "Goal Setting";
            const isGoalSeek = feature.title === "Goal Seek Budgeting";
            return (
              <Card
                key={feature.title}
                className={`p-8 text-center hover:shadow-lg transition-shadow border-t-4 border-t-blue-500${
                  isRecommended || isGoalSetting || isGoalSeek ? " cursor-pointer" : ""
                }`}
                onClick={
                  isRecommended ? onRecommendBudgetClick
                  : isGoalSetting ? onGoalSettingClick
                  : isGoalSeek ? onGoalSeekClick
                  : undefined
                }
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 ${feature.color} rounded-2xl mb-5`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3
                  className="text-lg font-semibold text-gray-900 mb-3"
                  contentEditable={isAdmin}
                  onBlur={(e) => handleFeatureChange(index, 'title', e.currentTarget.textContent || "")}
                  suppressContentEditableWarning={true}
                >
                  {feature.title}
                </h3>
                <p
                  className="text-gray-600"
                  contentEditable={isAdmin}
                  onBlur={(e) => handleFeatureChange(index, 'description', e.currentTarget.textContent || "")}
                  suppressContentEditableWarning={true}
                >
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
