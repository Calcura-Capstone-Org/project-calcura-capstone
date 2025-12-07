import { useState } from "react";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { FeaturesSection } from "./components/FeaturesSection";
import { BudgetTemplatesSection } from "./components/BudgetTemplatesSection";
import { Footer } from "./components/Footer";
import { FeedbackButton } from "./components/FeedbackButton";
import { TemplatePage } from "./components/TemplatePage";
import { LoginPage } from "./components/LoginPage";
import { AccountPage } from "./components/AccountPage";
import { DashboardPage } from "./components/DashboardPage";
import { AboutPage } from "./components/AboutPage";
import { ContactPage } from "./components/ContactPage";

type PageView = "landing" | "template" | "login" | "account" | "dashboard" | "about" | "contact";

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
        onCreateAccount={() => {
          // Handle create account navigation
          console.log("Navigate to create account");
        }}
        onContinueAsGuest={() => {
          // Handle continue as guest
          setCurrentPage("landing");
        }}
        onHomeClick={() => setCurrentPage("landing")}
        onLoginSuccess={handleLogin}
      />
    );
  }

  if (currentPage === "dashboard") {
    return (
      <div className="min-h-screen bg-white">
        <Header 
          onLoginClick={() => setCurrentPage("login")}
          onHomeClick={() => setCurrentPage("landing")}
          onAccountClick={() => setCurrentPage("account")}
          onDashboardClick={() => setCurrentPage("dashboard")}
          onAboutClick={() => setCurrentPage("about")}
          onContactClick={() => setCurrentPage("contact")}
          isLoggedIn={isLoggedIn}
        />
        <DashboardPage />
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
          onHomeClick={() => setCurrentPage("landing")}
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

  if (currentPage === "about") {
    return (
      <div className="min-h-screen bg-white">
        <Header 
          onLoginClick={() => setCurrentPage("login")}
          onHomeClick={() => setCurrentPage("landing")}
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
          onHomeClick={() => setCurrentPage("landing")}
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
          onHomeClick={() => setCurrentPage("landing")}
          onAccountClick={() => setCurrentPage("account")}
          onDashboardClick={() => setCurrentPage("dashboard")}
          onAboutClick={() => setCurrentPage("about")}
          onContactClick={() => setCurrentPage("contact")}
          isLoggedIn={isLoggedIn}
        />
        <TemplatePage />
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
        onHomeClick={() => setCurrentPage("landing")}
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
