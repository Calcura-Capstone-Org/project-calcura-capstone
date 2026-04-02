import { useState } from "react"; // Jaren Schneider lines 1-170 
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { FeaturesSection } from "./components/FeaturesSection";
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
import { FinancialGoals } from "./components/FinancialGoals";

type PageView = "landing" | "template" | "manageTemplate" | "login" | "account" | "dashboard" | "financialgoals" | "about" | "contact" | "signup" | "forgotPassword";

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
          isLoggedIn={isLoggedIn}
        />
        <DashboardPage
        onCreateBudget={() => setCurrentPage("template")}
        onFinancialGoals={() => setCurrentPage("financialgoals")}
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

  if (currentPage === "financialgoals") {
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
          isLoggedIn={isLoggedIn}
        />
        <FinancialGoals onCreateBudget={() => setCurrentPage("template")} />
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
          isLoggedIn={isLoggedIn}
        />
        <ManageTemplatePage onTemplateSaved={() => setCurrentPage("dashboard")} />
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
        onTemplatesClick={() => setCurrentPage("manageTemplate")}
        onAccountClick={() => setCurrentPage("account")}
        onDashboardClick={() => setCurrentPage("dashboard")}
        onAboutClick={() => setCurrentPage("about")}
        onContactClick={() => setCurrentPage("contact")}
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
