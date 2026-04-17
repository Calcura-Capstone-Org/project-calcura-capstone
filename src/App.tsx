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
import { AdminPage } from "./components/AdminPage";
import { GoalSetPage } from "./components/GoalSetPage";
import { GoalBudget } from "./components/GoalBudget";

type PageView = "landing" | "template" | "manageTemplate" | "login" | "account" | "dashboard" | "recommendBudget" | "about" | "contact" | "signup" | "forgotPassword" | "features" | "admin" | "goalSet" | "goalBudget";

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageView>("landing");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  const handleLogin = () => {
    setIsLoggedIn(true);
    setUsername(localStorage.getItem("username") ?? "");
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
          username={username}
          onAdminClick={() => setCurrentPage("admin")}
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
          username={username}
          onAdminClick={() => setCurrentPage("admin")}
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
          username={username}
          onAdminClick={() => setCurrentPage("admin")}
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
          username={username}
          onAdminClick={() => setCurrentPage("admin")}
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
          username={username}
          onAdminClick={() => setCurrentPage("admin")}
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
          username={username}
          onAdminClick={() => setCurrentPage("admin")}
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
          username={username}
          onAdminClick={() => setCurrentPage("admin")}
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
          username={username}
          onAdminClick={() => setCurrentPage("admin")}
        />
        <FeaturesPage onRecommendBudgetClick={() => setCurrentPage("recommendBudget")} onGoalSettingClick={() => setCurrentPage("goalSet")} onGoalSeekClick={() => setCurrentPage("goalBudget")} />
        <Footer
          onAboutClick={() => setCurrentPage("about")}
          onContactClick={() => setCurrentPage("contact")}
        />
      </div>
    );
  }

  if (currentPage === "goalSet") {
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
          username={username}
          onAdminClick={() => setCurrentPage("admin")}
        />
        <GoalSetPage onGoalSaved={() => { setCurrentPage("goalBudget"); window.scrollTo(0, 0); }} />
        <Footer
          onAboutClick={() => setCurrentPage("about")}
          onContactClick={() => setCurrentPage("contact")}
        />
      </div>
    );
  }

  if (currentPage === "goalBudget") {
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
          username={username}
          onAdminClick={() => setCurrentPage("admin")}
        />
        <GoalBudget onCreateBudget={() => setCurrentPage("template")} />
        <Footer
          onAboutClick={() => setCurrentPage("about")}
          onContactClick={() => setCurrentPage("contact")}
        />
      </div>
    );
  }

  if (currentPage === "admin") {
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
          username={username}
          onAdminClick={() => setCurrentPage("admin")}
        />
        <AdminPage />
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
        username={username}
        onAdminClick={() => setCurrentPage("admin")}
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
