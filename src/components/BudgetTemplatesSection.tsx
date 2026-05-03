/* Joseph St.John wrote the original version of this file */
/* Jonathan Torres updated the UI styling */
import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Sparkles, Briefcase, Palmtree } from "lucide-react";

//* API URL */
const API_URL = import.meta.env.VITE_API_URL;

//remove later
console.log("API_URL =", API_URL);

interface Template {
  id: number;
  icon: any;
  title: string;
  description: string;
  services: string[];
  color: string;
}

interface BudgetTemplatesSectionProps {
  onSelectTemplate?: () => void;
  isAdmin?: boolean;
}

const defaultTemplates: Template[] = [
  {
    id: 1,
    icon: Sparkles,
    title: "Young Adult",
    description: "Start your financial journey with simple budgeting and savings goals",
    services: [
      "Basic expense tracking",
      "Savings goals",
      "Educational resources",
      "Spending insights"
    ],
    color: "bg-blue-600"
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
      "What-if analysis"
    ],
    color: "bg-green-600"
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
      "Social Security optimizer"
    ],
    color: "bg-purple-600"
  }
];

export function BudgetTemplatesSection({ onSelectTemplate, isAdmin = false }: BudgetTemplatesSectionProps) {
  const [sectionTitle, setSectionTitle] = useState("Budget Templates");
  const [sectionSubtitle, setSectionSubtitle] = useState("Choose the template that matches your life stage");
  const [templates, setTemplates] = useState(defaultTemplates);

  useEffect(() => {
    const savedTitle = localStorage.getItem("templatesTitle");
    const savedSubtitle = localStorage.getItem("templatesSubtitle");
    if (savedTitle) setSectionTitle(savedTitle);
    if (savedSubtitle) setSectionSubtitle(savedSubtitle);

    const savedTemplates = localStorage.getItem("templates");
    if (savedTemplates) {
      try {
        setTemplates(JSON.parse(savedTemplates));
      } catch (e) {
        console.error("Error parsing saved templates", e);
      }
    }
  }, []);

  const handleTitleChange = (key: string, value: string) => {
    localStorage.setItem(key, value);
    if (key === "templatesTitle") setSectionTitle(value);
    else if (key === "templatesSubtitle") setSectionSubtitle(value);
  };

  const handleTemplateChange = (index: number, field: 'title' | 'description', value: string) => {
    const newTemplates = [...templates];
    newTemplates[index] = { ...newTemplates[index], [field]: value };
    setTemplates(newTemplates);
    localStorage.setItem("templates", JSON.stringify(newTemplates));
  };

  return (
    <section id="templates" className="py-20 bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2
            className="text-3xl font-bold text-green-900 mb-3"
            contentEditable={isAdmin}
            onBlur={(e) => handleTitleChange("templatesTitle", e.currentTarget.textContent || "")}
            suppressContentEditableWarning={true}
          >
            {sectionTitle}
          </h2>
          <div className="w-16 h-1 bg-green-500 mx-auto rounded-full mb-4" />
          <p
            className="text-gray-600 text-lg"
            contentEditable={isAdmin}
            onBlur={(e) => handleTitleChange("templatesSubtitle", e.currentTarget.textContent || "")}
            suppressContentEditableWarning={true}
          >
            {sectionSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {templates.map((template, index) => {
            const Icon = template.icon;
            return (
              <Card key={template.id} className="p-8 bg-white hover:shadow-lg transition-shadow">
                <div className={`inline-flex items-center justify-center w-14 h-14 ${template.color} rounded-xl mb-5`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3
                  className="text-lg font-semibold text-gray-900 mb-3"
                  contentEditable={isAdmin}
                  onBlur={(e) => handleTemplateChange(index, 'title', e.currentTarget.textContent || "")}
                  suppressContentEditableWarning={true}
                >
                  {template.title}
                </h3>
                <p
                  className="text-gray-600 mb-5"
                  contentEditable={isAdmin}
                  onBlur={(e) => handleTemplateChange(index, 'description', e.currentTarget.textContent || "")}
                  suppressContentEditableWarning={true}
                >
                  {template.description}
                </p>

                <ul className="space-y-2 mb-6">
                  {template.services.map((service, serviceIndex) => (
                    <li key={serviceIndex} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">•</span>
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
