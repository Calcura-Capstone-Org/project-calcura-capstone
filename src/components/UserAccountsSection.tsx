/* Jaeyeong Shin wrote all 109 lines of code for this file. */
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Check } from "lucide-react";

const accountTypes = [
  {
    id: 1,
    type: "Youth",
    tagline: "Start Your Financial Journey",
    description: "Perfect for students and young adults learning to manage money",
    price: "Free",
    features: [
      "Basic expense tracking",
      "Savings goals",
      "Educational resources",
      "Mobile app access",
      "Spending insights"
    ],
    color: "border-blue-500"
  },
  {
    id: 2,
    type: "Career",
    tagline: "Optimize Your Income",
    description: "Designed for working professionals managing multiple income streams",
    price: "$9.99/mo",
    features: [
      "Advanced budgeting tools",
      "Investment tracking",
      "Tax planning assistance",
      "What-if analysis",
      "Priority support",
      "Unlimited categories"
    ],
    color: "border-green-500",
    popular: true
  },
  {
    id: 3,
    type: "Retirement",
    tagline: "Secure Your Future",
    description: "Comprehensive planning for retirees and pre-retirees",
    price: "$14.99/mo",
    features: [
      "Retirement income planning",
      "Healthcare cost tracking",
      "Estate planning tools",
      "Social Security optimizer",
      "Legacy planning",
      "Dedicated advisor"
    ],
    color: "border-purple-500"
  }
];

export function UserAccountsSection() {
  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-gray-900 mb-4">Choose Your Plan</h2>
          <p className="text-gray-600 text-xl">
            Financial tools tailored to your life stage
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {accountTypes.map((account) => (
            <Card 
              key={account.id} 
              className={`p-8 bg-white border-2 ${account.color} ${account.popular ? 'shadow-xl scale-105' : ''} relative`}
            >
              {account.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-green-600 text-white px-4 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-gray-900 mb-2">{account.type}</h3>
                <p className="text-gray-600 mb-4">{account.tagline}</p>
                <p className="text-4xl text-gray-900 mb-2">{account.price}</p>
                <p className="text-gray-600">{account.description}</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                {account.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                className={`w-full ${account.popular ? 'bg-green-600 hover:bg-green-700' : ''}`}
                variant={account.popular ? 'default' : 'outline'}
              >
                Get Started
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
