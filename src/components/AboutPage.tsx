/* Jaren Schneider wrote all 168 lines of code for this file*/
import { Card } from "./ui/card";
import { Target, Users, Heart, TrendingUp, Shield, Lightbulb } from "lucide-react";
import logoImage from "figma:asset/1a36a3a0f13bed42158cef736e0c5fd1e80a9a0c.png";

/* API URL */
const API_URL = import.meta.env.VITE_API_URL;

//remove later
console.log("API_URL =", API_URL);

export function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <img 
              src={logoImage} 
              alt="Calcura Logo" 
              className="w-24 h-24 object-contain"
            />
          </div>
          <h1 className="text-4xl text-gray-900 mb-4">About Calcura</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Smart budgeting for every stage of life
          </p>
        </div>

        {/* What We Do */}
        <Card className="p-8 mb-12">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Lightbulb className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl text-gray-900 mb-4">What We Do</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Calcura is a comprehensive financial planning tool designed to help individuals take control of their finances through intelligent budgeting and personalized insights. We believe that everyone deserves access to powerful financial tools, regardless of their life stage or financial expertise.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Our platform combines AI-driven recommendations with intuitive budget templates tailored to three key life stages: Youth, Career, and Retirement. Whether you're just starting your financial journey, building your career, or planning for retirement, Calcura provides the tools and insights you need to make informed financial decisions.
              </p>
            </div>
          </div>
        </Card>

        {/* Mission Section */}
        <Card className="p-8 mb-12 bg-gradient-to-br from-green-50 to-blue-50">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our mission is to democratize financial planning by providing accessible, intelligent, and personalized budgeting tools that empower individuals to achieve their financial goals. We're committed to making financial literacy and smart money management available to everyone, completely free of charge.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We envision a world where financial stress is minimized through proactive planning, where AI-powered insights help people make better financial decisions, and where everyone has the tools they need to build a secure financial future.
              </p>
            </div>
          </div>
        </Card>

        {/* Core Values */}
        <div className="mb-12">
          <h2 className="text-2xl text-gray-900 mb-8 text-center">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg text-gray-900 mb-2">Accessibility</h3>
              <p className="text-gray-600">
                Financial planning tools should be available to everyone, regardless of income level or financial knowledge. We're committed to keeping Calcura free and easy to use.
              </p>
            </Card>

            <Card className="p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg text-gray-900 mb-2">Privacy & Security</h3>
              <p className="text-gray-600">
                Your financial data is personal and sensitive. We prioritize your privacy and security with industry-leading protection measures.
              </p>
            </Card>

            <Card className="p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg text-gray-900 mb-2">Empowerment</h3>
              <p className="text-gray-600">
                We believe in empowering users with knowledge and insights that help them make informed financial decisions and achieve their goals.
              </p>
            </Card>
          </div>
        </div>

        {/* Who We Are */}
        <Card className="p-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Heart className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl text-gray-900 mb-4">Who We Are</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Calcura was founded by a team of financial experts, software developers, and user experience designers who recognized the need for a more intelligent, accessible approach to personal budgeting. We've experienced the challenges of managing finances firsthand and understand the stress that comes with financial uncertainty.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our diverse team brings together expertise in finance, artificial intelligence, and human-centered design to create a platform that's both powerful and approachable. We're passionate about helping people take control of their financial futures, one budget at a time.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We're constantly evolving and improving Calcura based on user feedback and the latest advancements in financial technology. Your success is our success, and we're here to support you every step of the way.
              </p>
            </div>
          </div>
        </Card>

        {/* Why Choose Calcura */}
        <div className="mt-12 bg-white rounded-lg p-8 border">
          <h2 className="text-2xl text-gray-900 mb-6 text-center">Why Choose Calcura?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex gap-3">
              <div className="text-green-600 mt-1">✓</div>
              <div>
                <h4 className="text-gray-900 mb-1">Life Stage Templates</h4>
                <p className="text-sm text-gray-600">Pre-built budget templates designed for Youth, Career, and Retirement stages</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="text-green-600 mt-1">✓</div>
              <div>
                <h4 className="text-gray-900 mb-1">AI-Powered Insights</h4>
                <p className="text-sm text-gray-600">Get personalized recommendations based on your spending patterns and goals</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="text-green-600 mt-1">✓</div>
              <div>
                <h4 className="text-gray-900 mb-1">What-If Analysis</h4>
                <p className="text-sm text-gray-600">Explore different financial scenarios to make informed decisions</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="text-green-600 mt-1">✓</div>
              <div>
                <h4 className="text-gray-900 mb-1">100% Free</h4>
                <p className="text-sm text-gray-600">No subscriptions, no hidden fees, no credit card required</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="text-green-600 mt-1">✓</div>
              <div>
                <h4 className="text-gray-900 mb-1">Comprehensive Tracking</h4>
                <p className="text-sm text-gray-600">Track income, expenses, debts, savings, and investments in one place</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="text-green-600 mt-1">✓</div>
              <div>
                <h4 className="text-gray-900 mb-1">User-Friendly Interface</h4>
                <p className="text-sm text-gray-600">Intuitive design that makes budgeting simple and stress-free</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
