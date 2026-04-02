import { useState } from "react"; // Jaren Schneider lines 1-170 
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { FeaturesSection } from "./components/FeaturesSection";
import { FeaturesSection as FeaturesPage } from "./components/FeaturesPage";
import { BudgetTemplatesSection } from "./components/BudgetTemplatesSection";
import { Footer } from "./components/Footer";
import { FeedbackButton } from "./components/FeedbackButton";
import { TemplatePage } from "./components/TemplatePage";
import { TemplatePage as ManageTemplatePage } from "./components/ManageTemplate";
import { LoginPage } from "./components/LoginPage";
import { AccountPage } from "./components/AccountPage";
import { DashboardPage } from "./components/DashboardPage";
import { AboutPage } from "./components/AboutPage";
import { ContactPage } from "./components/ContactPage";
import { SignUpPage } from "./components/SignUpPage";
import { ForgotPasswordPage } from "./components/ForgotPasswordPage";
import { RecommendBudgetPage } from "./components/RecommendBudgetPage";

type PageView = "landing" | "template" | "manageTemplate" | "login" | "account" | "dashboard" | "recommendBudget" | "about" | "contact" | "signup" | "forgotPassword" | "features";

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageView>("landing");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentPage("dashboard");
  };

  if (currentPage === "login") {
    return (
      <LoginPage 
        onClose={() => setCurrentPage("landing")}
        onCreateAccount={() => setCurrentPage("signup")}
        onContinueAsGuest={() => {
          // Handle continue as guest
          setCurrentPage("landing");
        }}
        onHomeClick={() => setCurrentPage("landing")}
        onLoginSuccess={handleLogin}
        onForgotPassword={() => setCurrentPage("forgotPassword")}

      />
    );
  }

  if (currentPage === "signup") {
    return (
      <SignUpPage
        onClose={() => setCurrentPage("landing")}
        onCreateAccount={() => setCurrentPage("login")}
        onContinueAsGuest={() => setCurrentPage("landing")}
        onHomeClick={() => setCurrentPage("landing")}
        onLoginSuccess={handleLogin}  
      />
    );
  }

  if (currentPage === "forgotPassword") {
    return (
      <ForgotPasswordPage
        onBackToLogin={() => setCurrentPage("login")}
        onHomeClick={() => setCurrentPage("landing")}
      />
    );
  }

  if (currentPage === "dashboard") {
    return (
      <div className="min-h-screen bg-white">
        <Header 
          onLoginClick={() => setCurrentPage("login")}
          onSignUpClick={() => setCurrentPage("signup")}
          onHomeClick={() => setCurrentPage("landing")}
          onTemplatesClick={() => setCurrentPage("manageTemplate")}
          onAccountClick={() => setCurrentPage("account")}
          onDashboardClick={() => setCurrentPage("dashboard")}
          onAboutClick={() => setCurrentPage("about")}
          onContactClick={() => setCurrentPage("contact")}
          onFeaturesClick={() => setCurrentPage("features")}
          isLoggedIn={isLoggedIn}
        />
        <DashboardPage
        onCreateBudget={() => setCurrentPage("template")}
        onFinancialGoals={() => setCurrentPage("recommendBudget")}
        onManageBudgets={() => setCurrentPage("manageTemplate")}
      />
        <Footer 
          onAboutClick={() => setCurrentPage("about")}
          onContactClick={() => setCurrentPage("contact")}
        />
      </div>
    );
  }

  if (currentPage === "account") {
    return (
      <div className="min-h-screen bg-white">
        <Header 
          onLoginClick={() => setCurrentPage("login")}
          onSignUpClick={() => setCurrentPage("signup")}
          onHomeClick={() => setCurrentPage("landing")}
          onTemplatesClick={() => setCurrentPage("manageTemplate")}
          onAccountClick={() => setCurrentPage("account")}
          onDashboardClick={() => setCurrentPage("dashboard")}
          onAboutClick={() => setCurrentPage("about")}
          onContactClick={() => setCurrentPage("contact")}
          onFeaturesClick={() => setCurrentPage("features")}
          isLoggedIn={isLoggedIn}
        />
        <AccountPage />
        <Footer 
          onAboutClick={() => setCurrentPage("about")}
          onContactClick={() => setCurrentPage("contact")}
        />
      </div>
    );
  }

  if (currentPage === "recommendBudget") {
    return (
      <div className="min-h-screen bg-white">
        <Header 
          onLoginClick={() => setCurrentPage("login")}
          onSignUpClick={() => setCurrentPage("signup")}
          onHomeClick={() => setCurrentPage("landing")}
          onTemplatesClick={() => setCurrentPage("manageTemplate")}
          onAccountClick={() => setCurrentPage("account")}
          onDashboardClick={() => setCurrentPage("dashboard")}
          onAboutClick={() => setCurrentPage("about")}
          onContactClick={() => setCurrentPage("contact")}
          onFeaturesClick={() => setCurrentPage("features")}
          isLoggedIn={isLoggedIn}
        />
        <RecommendBudgetPage onCreateBudget={() => setCurrentPage("template")} />
        <Footer 
          onAboutClick={() => setCurrentPage("about")}
          onContactClick={() => setCurrentPage("contact")}
        />
      </div>
    );
  }

  if (currentPage === "about") {
    return (
      <div className="min-h-screen bg-white">
        <Header 
          onLoginClick={() => setCurrentPage("login")}
          onSignUpClick={() => setCurrentPage("signup")}
          onHomeClick={() => setCurrentPage("landing")}
          onTemplatesClick={() => setCurrentPage("manageTemplate")}
          onAccountClick={() => setCurrentPage("account")}
          onDashboardClick={() => setCurrentPage("dashboard")}
          onAboutClick={() => setCurrentPage("about")}
          onContactClick={() => setCurrentPage("contact")}
          onFeaturesClick={() => setCurrentPage("features")}
          isLoggedIn={isLoggedIn}
        />
        <AboutPage />
        <Footer 
          onAboutClick={() => setCurrentPage("about")}
          onContactClick={() => setCurrentPage("contact")}
        />
      </div>
    );
  }

  if (currentPage === "contact") {
    return (
      <div className="min-h-screen bg-white">
        <Header 
          onLoginClick={() => setCurrentPage("login")}
          onSignUpClick={() => setCurrentPage("signup")}
          onHomeClick={() => setCurrentPage("landing")}
          onTemplatesClick={() => setCurrentPage("manageTemplate")}
          onAccountClick={() => setCurrentPage("account")}
          onDashboardClick={() => setCurrentPage("dashboard")}
          onAboutClick={() => setCurrentPage("about")}
          onContactClick={() => setCurrentPage("contact")}
          onFeaturesClick={() => setCurrentPage("features")}
          isLoggedIn={isLoggedIn}
        />
        <ContactPage />
        <Footer 
          onAboutClick={() => setCurrentPage("about")}
          onContactClick={() => setCurrentPage("contact")}
        />
      </div>
    );
  }

  if (currentPage === "template") {
    return (
      <div className="min-h-screen bg-white">
        <Header 
          onLoginClick={() => setCurrentPage("login")}
          onSignUpClick={() => setCurrentPage("signup")}
          onHomeClick={() => setCurrentPage("landing")}
          onTemplatesClick={() => setCurrentPage("manageTemplate")}
          onAccountClick={() => setCurrentPage("account")}
          onDashboardClick={() => setCurrentPage("dashboard")}
          onAboutClick={() => setCurrentPage("about")}
          onContactClick={() => setCurrentPage("contact")}
          onFeaturesClick={() => setCurrentPage("features")}
          isLoggedIn={isLoggedIn}
        />
        <TemplatePage onTemplateSaved={() => setCurrentPage("dashboard")} />
        <Footer 
          onAboutClick={() => setCurrentPage("about")}
          onContactClick={() => setCurrentPage("contact")}
        />
      </div>
    );
  }

  if (currentPage === "manageTemplate") {
    return (
      <div className="min-h-screen bg-white">
        <Header 
          onLoginClick={() => setCurrentPage("login")}
          onSignUpClick={() => setCurrentPage("signup")}
          onHomeClick={() => setCurrentPage("landing")}
          onTemplatesClick={() => setCurrentPage("manageTemplate")}
          onAccountClick={() => setCurrentPage("account")}
          onDashboardClick={() => setCurrentPage("dashboard")}
          onAboutClick={() => setCurrentPage("about")}
          onContactClick={() => setCurrentPage("contact")}
          onFeaturesClick={() => setCurrentPage("features")}
          isLoggedIn={isLoggedIn}
        />
        <ManageTemplatePage onTemplateSaved={() => setCurrentPage("dashboard")} onCreateTemplate={() => setCurrentPage("template")} />
        <Footer 
          onAboutClick={() => setCurrentPage("about")}
          onContactClick={() => setCurrentPage("contact")}
        />
      </div>
    );
  }

  if (currentPage === "features") {
    return (
      <div className="min-h-screen bg-white">
        <Header
          onLoginClick={() => setCurrentPage("login")}
          onSignUpClick={() => setCurrentPage("signup")}
          onHomeClick={() => setCurrentPage("landing")}
          onTemplatesClick={() => setCurrentPage("manageTemplate")}
          onAccountClick={() => setCurrentPage("account")}
          onDashboardClick={() => setCurrentPage("dashboard")}
          onAboutClick={() => setCurrentPage("about")}
          onContactClick={() => setCurrentPage("contact")}
          onFeaturesClick={() => setCurrentPage("features")}
          isLoggedIn={isLoggedIn}
        />
        <FeaturesPage onRecommendBudgetClick={() => setCurrentPage("recommendBudget")} />
        <Footer
          onAboutClick={() => setCurrentPage("about")}
          onContactClick={() => setCurrentPage("contact")}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header 
        onLoginClick={() => setCurrentPage("login")}
        onSignUpClick={() => setCurrentPage("signup")}
        onHomeClick={() => setCurrentPage("landing")}
        onTemplatesClick={() => setCurrentPage("manageTemplate")}
        onAccountClick={() => setCurrentPage("account")}
        onDashboardClick={() => setCurrentPage("dashboard")}
        onAboutClick={() => setCurrentPage("about")}
        onContactClick={() => setCurrentPage("contact")}
        onFeaturesClick={() => setCurrentPage("features")}
        isLoggedIn={isLoggedIn}
      />
      <HeroSection />
      <FeaturesSection />
      <BudgetTemplatesSection onSelectTemplate={() => setCurrentPage("template")} />
      <Footer 
        onAboutClick={() => setCurrentPage("about")}
        onContactClick={() => setCurrentPage("contact")}
      />
      <FeedbackButton />
    </div>
  );
}
