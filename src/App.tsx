import { useState, useEffect } from "react";
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
import { AdminPage } from "./components/AdminPage";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner@2.0.3";
import { BudgetProvider } from "./contexts/BudgetContext";

type PageView = "landing" | "template" | "login" | "account" | "dashboard" | "about" | "contact" | "admin";

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageView>("landing");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [scrollToSection, setScrollToSection] = useState<string | null>(null);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentPage("dashboard");
  };
  
  // Special admin login handler
  const handleAdminLogin = (email: string) => {
    // Check if it's the admin account
    if (email === "admin@calcura.com") {
      setIsLoggedIn(true);
      setIsAdmin(true);
      setCurrentPage("admin");
      toast.success("Welcome, Admin!");
    } else {
      setIsLoggedIn(true);
      setIsAdmin(false);
      setCurrentPage("dashboard");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setCurrentPage("landing");
    toast.success("You have been logged out successfully");
  };

  const handleCreateAccount = () => {
    // In a real app, this would navigate to a sign-up page
    console.log("Navigate to create account");
    // For now, we'll just show a message and navigate to template builder
    setCurrentPage("template");
  };
  
  // Handle budget creation
  const handleBudgetCreated = () => {
    setCurrentPage("dashboard");
  };

  const handleFeaturesClick = () => {
    setCurrentPage("landing");
    setScrollToSection("features");
  };

  const handleTemplatesClick = () => {
    setCurrentPage("landing");
    setScrollToSection("templates");
  };

  // Scroll to section after page changes
  useEffect(() => {
    if (scrollToSection && currentPage === "landing") {
      // Small delay to ensure the DOM is rendered
      setTimeout(() => {
        const element = document.getElementById(scrollToSection);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        setScrollToSection(null);
      }, 100);
    }
  }, [scrollToSection, currentPage]);

  // Wrap entire app in BudgetProvider
  return (
    <BudgetProvider>
      {currentPage === "login" && (
        <>
          <LoginPage 
            onClose={() => setCurrentPage("landing")}
            onCreateAccount={handleCreateAccount}
            onContinueAsGuest={() => {
              // Handle continue as guest
              setCurrentPage("landing");
            }}
            onHomeClick={() => setCurrentPage("landing")}
            onLoginSuccess={handleAdminLogin}
          />
          <Toaster />
        </>
      )}

      {currentPage === "dashboard" && (
        <>
          <div className="min-h-screen bg-white">
            <Header 
              onLoginClick={() => setCurrentPage("login")}
              onHomeClick={() => setCurrentPage("landing")}
              onAccountClick={() => setCurrentPage("account")}
              onDashboardClick={() => setCurrentPage("dashboard")}
              onAboutClick={() => setCurrentPage("about")}
              onContactClick={() => setCurrentPage("contact")}
              onFeaturesClick={handleFeaturesClick}
              onTemplatesClick={handleTemplatesClick}
              onLogoutClick={handleLogout}
              onAdminClick={() => setCurrentPage("admin")}
              isLoggedIn={isLoggedIn}
              isAdmin={isAdmin}
            />
            <DashboardPage />
            <Footer 
              onAboutClick={() => setCurrentPage("about")}
              onContactClick={() => setCurrentPage("contact")}
            />
          </div>
          <Toaster />
        </>
      )}

      {currentPage === "account" && (
        <>
          <div className="min-h-screen bg-white">
            <Header 
              onLoginClick={() => setCurrentPage("login")}
              onHomeClick={() => setCurrentPage("landing")}
              onAccountClick={() => setCurrentPage("account")}
              onDashboardClick={() => setCurrentPage("dashboard")}
              onAboutClick={() => setCurrentPage("about")}
              onContactClick={() => setCurrentPage("contact")}
              onFeaturesClick={handleFeaturesClick}
              onTemplatesClick={handleTemplatesClick}
              onLogoutClick={handleLogout}
              onAdminClick={() => setCurrentPage("admin")}
              isLoggedIn={isLoggedIn}
              isAdmin={isAdmin}
            />
            <AccountPage />
            <Footer 
              onAboutClick={() => setCurrentPage("about")}
              onContactClick={() => setCurrentPage("contact")}
            />
          </div>
          <Toaster />
        </>
      )}

      {currentPage === "about" && (
        <>
          <div className="min-h-screen bg-white">
            <Header 
              onLoginClick={() => setCurrentPage("login")}
              onHomeClick={() => setCurrentPage("landing")}
              onAccountClick={() => setCurrentPage("account")}
              onDashboardClick={() => setCurrentPage("dashboard")}
              onAboutClick={() => setCurrentPage("about")}
              onContactClick={() => setCurrentPage("contact")}
              onFeaturesClick={handleFeaturesClick}
              onTemplatesClick={handleTemplatesClick}
              onLogoutClick={handleLogout}
              onAdminClick={() => setCurrentPage("admin")}
              isLoggedIn={isLoggedIn}
              isAdmin={isAdmin}
            />
            <AboutPage />
            <Footer 
              onAboutClick={() => setCurrentPage("about")}
              onContactClick={() => setCurrentPage("contact")}
            />
          </div>
          <Toaster />
        </>
      )}

      {currentPage === "contact" && (
        <>
          <div className="min-h-screen bg-white">
            <Header 
              onLoginClick={() => setCurrentPage("login")}
              onHomeClick={() => setCurrentPage("landing")}
              onAccountClick={() => setCurrentPage("account")}
              onDashboardClick={() => setCurrentPage("dashboard")}
              onAboutClick={() => setCurrentPage("about")}
              onContactClick={() => setCurrentPage("contact")}
              onFeaturesClick={handleFeaturesClick}
              onTemplatesClick={handleTemplatesClick}
              onLogoutClick={handleLogout}
              onAdminClick={() => setCurrentPage("admin")}
              isLoggedIn={isLoggedIn}
              isAdmin={isAdmin}
            />
            <ContactPage />
            <Footer 
              onAboutClick={() => setCurrentPage("about")}
              onContactClick={() => setCurrentPage("contact")}
            />
          </div>
          <Toaster />
        </>
      )}

      {currentPage === "template" && (
        <>
          <div className="min-h-screen bg-white">
            <Header 
              onLoginClick={() => setCurrentPage("login")}
              onHomeClick={() => setCurrentPage("landing")}
              onAccountClick={() => setCurrentPage("account")}
              onDashboardClick={() => setCurrentPage("dashboard")}
              onAboutClick={() => setCurrentPage("about")}
              onContactClick={() => setCurrentPage("contact")}
              onFeaturesClick={handleFeaturesClick}
              onTemplatesClick={handleTemplatesClick}
              onLogoutClick={handleLogout}
              onAdminClick={() => setCurrentPage("admin")}
              isLoggedIn={isLoggedIn}
              isAdmin={isAdmin}
            />
            <TemplatePage onBudgetCreated={handleBudgetCreated} />
            <Footer 
              onAboutClick={() => setCurrentPage("about")}
              onContactClick={() => setCurrentPage("contact")}
            />
          </div>
          <Toaster />
        </>
      )}

      {currentPage === "landing" && (
        <>
          <div className="min-h-screen bg-white">
            <Header 
              onLoginClick={() => setCurrentPage("login")}
              onHomeClick={() => setCurrentPage("landing")}
              onAccountClick={() => setCurrentPage("account")}
              onDashboardClick={() => setCurrentPage("dashboard")}
              onAboutClick={() => setCurrentPage("about")}
              onContactClick={() => setCurrentPage("contact")}
              onFeaturesClick={handleFeaturesClick}
              onTemplatesClick={handleTemplatesClick}
              onLogoutClick={handleLogout}
              onAdminClick={() => setCurrentPage("admin")}
              isLoggedIn={isLoggedIn}
              isAdmin={isAdmin}
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
          <Toaster />
        </>
      )}

      {currentPage === "admin" && (
        <>
          <div className="min-h-screen bg-white">
            <Header 
              onLoginClick={() => setCurrentPage("login")}
              onHomeClick={() => setCurrentPage("landing")}
              onAccountClick={() => setCurrentPage("account")}
              onDashboardClick={() => setCurrentPage("dashboard")}
              onAboutClick={() => setCurrentPage("about")}
              onContactClick={() => setCurrentPage("contact")}
              onFeaturesClick={handleFeaturesClick}
              onTemplatesClick={handleTemplatesClick}
              onLogoutClick={handleLogout}
              onAdminClick={() => setCurrentPage("admin")}
              isLoggedIn={isLoggedIn}
              isAdmin={isAdmin}
            />
            <AdminPage />
            <Footer 
              onAboutClick={() => setCurrentPage("about")}
              onContactClick={() => setCurrentPage("contact")}
            />
          </div>
          <Toaster />
        </>
      )}
    </BudgetProvider>
  );
}