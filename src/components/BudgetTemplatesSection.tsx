/* Joseph St.John write all 96 lines of code for this file */
import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Sparkles, Briefcase, Palmtree } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

interface TemplateDescription {
  id: string;
  stage_id: number;
  stage_name: string;
  description: string;
}

interface TemplateCardData {
  id: number;
  title: string;
  description: string;
  services: string[];
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const templateCards: TemplateCardData[] = [
  {
    id: 1,
    icon: Sparkles,
    title: "Young Adult",
    description: "Start your financial journey with simple budgeting and savings goals",
    services: [
      "Basic expense tracking",
      "Savings goals",
      "Educational resources",
      "Spending insights",
    ],
    color: "bg-blue-600",
  },
  {
    id: 2,
    icon: Briefcase,
    title: "Career",
    description: "Advanced tools for managing income, investments, and career growth",
    services: [
      "Advanced budgeting tools",
      "Investment tracking",
      "Tax planning assistance",
      "What-if analysis",
    ],
    color: "bg-green-600",
  },
  {
    id: 3,
    icon: Palmtree,
    title: "Retirement",
    description: "Comprehensive planning for a secure and comfortable retirement",
    services: [
      "Retirement income planning",
      "Healthcare cost tracking",
      "Estate planning tools",
      "Social Security optimizer",
    ],
    color: "bg-purple-600",
  },
];

interface BudgetTemplatesSectionProps {
  onSelectTemplate?: () => void;
}

export function BudgetTemplatesSection({ onSelectTemplate }: BudgetTemplatesSectionProps) {
  const [descriptions, setDescriptions] = useState<Record<number, string>>({});

  useEffect(() => {
    fetch(`${API_URL}/content/templates`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load template descriptions");
        return res.json();
      })
      .then((data: TemplateDescription[]) => {
        const loadedDescriptions: Record<number, string> = {};
        data.forEach((template) => {
          loadedDescriptions[template.stage_id] = template.description;
        });
        setDescriptions(loadedDescriptions);
      })
      .catch(() => {
        // Keep default descriptions if API call fails
      });
  }, []);

  return (
    <section id="templates" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-gray-900 mb-4">Budget Templates</h2>
          <p className="text-gray-600 text-xl">
            Choose the template that matches your life stage
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {templateCards.map((template) => {
            const Icon = template.icon;
            const description = descriptions[template.id] ?? template.description;
            return (
              <Card key={template.id} className="p-8 bg-white hover:shadow-lg transition-shadow">
                <div className={`inline-flex items-center justify-center w-16 h-16 ${template.color} rounded-2xl mb-6`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-gray-900 mb-3">{template.title}</h3>
                <p className="text-gray-600 mb-6">{description}</p>
                
                <ul className="space-y-2 mb-6">
                  {template.services.map((service, index) => (
                    <li key={index} className="text-gray-700 flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span>{service}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={onSelectTemplate}
                >
                  Get Started
                </Button>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
