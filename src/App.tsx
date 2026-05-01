import { useState, useEffect } from "react"; // Jaren Schneider lines 1-170
/* Jonathan Torres added browser history navigation */
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
import { PrivacyPolicy } from "./components/PrivacyPolicy";
import { TermsOfService } from "./components/TermsOfService";
import { SignUpPage } from "./components/SignUpPage";
import { ForgotPasswordPage } from "./components/ForgotPasswordPage";
import { RecommendBudgetPage } from "./components/RecommendBudgetPage";
import { AdminPage } from "./components/AdminPage";
import { GoalSetPage } from "./components/GoalSetPage";
import { GoalBudget } from "./components/GoalBudget";
import { FAQPage } from "./components/FAQPage";

import { hasActiveSession, getPageFromPathname, protectedPages, type PageView as PageViewBase } from "./utils/sessionUtils";

const API_URL = import.meta.env.VITE_API_URL;

interface UserRoleApiResponse {
  user_id?: number | string;
  role_id?: number | string;
}

type PageView = PageViewBase | "faq";

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageView>("landing");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const refreshAdminStatus = async (userId: string | null) => {
    if (!userId) {
      setIsAdmin(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/user_roles/`);
      if (!res.ok) throw new Error("Failed to fetch user roles");

      const userRoles: UserRoleApiResponse[] = await res.json();
      const hasAdminRole = userRoles.some(
        (ur) => String(ur.user_id) === String(userId) && Number(ur.role_id) === 5
      );
      setIsAdmin(hasAdminRole);
    } catch {
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    const storedEmail = localStorage.getItem("email") ?? "";
    const storedUsername = localStorage.getItem("username") ?? "";
    const storedUserId = localStorage.getItem("user_id");
    if (storedEmail || storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
      setEmail(storedEmail);
      void refreshAdminStatus(storedUserId);
    }
  }, []);

  const navigate = (page: PageView) => {
    window.history.pushState({ page }, "", `/${page === "landing" ? "" : page}`);
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const loggedIn = hasActiveSession();
    const storedUsername = localStorage.getItem("username") ?? "";
    const requestedPage = getPageFromPathname(window.location.pathname);
    const initialPage = !loggedIn && protectedPages.has(requestedPage) ? "login" : requestedPage;

    setIsLoggedIn(loggedIn);
    setUsername(storedUsername);
    setCurrentPage(initialPage);
    window.history.replaceState({ page: initialPage }, "", `/${initialPage === "landing" ? "" : initialPage}`);

    const handlePopState = (e: PopStateEvent) => {
      const requestedPage: PageView = e.state?.page ?? getPageFromPathname(window.location.pathname);
      const page = !hasActiveSession() && protectedPages.has(requestedPage) ? "login" : requestedPage;
      setCurrentPage(page);
      window.scrollTo(0, 0);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    const storedUsername = localStorage.getItem("username") ?? "";
    const storedEmail = localStorage.getItem("email") ?? "";
    const storedUserId = localStorage.getItem("user_id");
    setUsername(storedUsername);
    setEmail(storedEmail);
    void refreshAdminStatus(storedUserId);
    navigate("dashboard");
  };

  if (currentPage === "login") {
    return (
      <LoginPage
        onClose={() => navigate("landing")}
        onCreateAccount={() => navigate("signup")}
        onContinueAsGuest={() => {
          // Handle continue as guest
          navigate("landing");
        }}
        onHomeClick={() => navigate("landing")}
        onLoginSuccess={handleLogin}
        onForgotPassword={() => navigate("forgotPassword")}

      />
    );
  }

  if (currentPage === "signup") {
    return (
      <SignUpPage
        onClose={() => navigate("landing")}
        onCreateAccount={() => navigate("login")}
        onContinueAsGuest={() => navigate("landing")}
        onHomeClick={() => navigate("landing")}
        onLoginSuccess={handleLogin}
      />
    );
  }

  if (currentPage === "forgotPassword") {
    return (
      <ForgotPasswordPage
        onBackToLogin={() => navigate("login")}
        onHomeClick={() => navigate("landing")}
      />
    );
  }

  const headerProps = {
    onLoginClick: () => navigate("login"),
    onSignUpClick: () => navigate("signup"),
    onHomeClick: () => navigate("landing"),
    onTemplatesClick: () => navigate("manageTemplate"),
    onAccountClick: () => navigate("account"),
    onDashboardClick: () => navigate("dashboard"),
    onAboutClick: () => navigate("about"),
    onContactClick: () => navigate("contact"),
    onFeaturesClick: () => navigate("features"),
    isLoggedIn,
    username,
    isAdmin,
    onAdminClick: () => navigate("admin"),
    onFAQClick: () => navigate("faq"),
  };

  const footerProps = {
    onAboutClick: () => navigate("about"),
    onContactClick: () => navigate("contact"),
    onFAQClick: () => navigate("faq"),
    onPrivacyClick: () => navigate("privacy"),
    onTermsClick: () => navigate("terms"),
  };

  if (currentPage === "dashboard") {
    return (
      <div className="min-h-screen bg-white">
        <Header {...headerProps} activePage="dashboard" />
        <DashboardPage
          onCreateBudget={() => navigate("template")}
          onFinancialGoals={() => navigate("recommendBudget")}
          onManageBudgets={() => navigate("manageTemplate")}
        />
        <Footer {...footerProps} />
      </div>
    );
  }

  if (currentPage === "account") {
    return (
      <div className="min-h-screen bg-white">
        <Header {...headerProps} />
        <AccountPage />
        <Footer {...footerProps} />
      </div>
    );
  }

  if (currentPage === "recommendBudget") {
    return (
      <div className="min-h-screen bg-white">
        <Header {...headerProps} />
        <RecommendBudgetPage onCreateBudget={() => navigate("template")} />
        <Footer {...footerProps} />
      </div>
    );
  }

  if (currentPage === "about") {
    return (
      <div className="min-h-screen bg-purple-50">
        <Header {...headerProps} activePage="about" />
        <AboutPage isAdmin={isAdmin} />
        <Footer {...footerProps} />
      </div>
    );
  }

  if (currentPage === "contact") {
    return (
      <div className="min-h-screen bg-teal-50">
        <Header {...headerProps} activePage="contact" />
        <ContactPage isAdmin={isAdmin} />
        <Footer {...footerProps} />
      </div>
    );
  }

  if (currentPage === "privacy") {
    return (
      <div className="min-h-screen bg-white">
        <Header {...headerProps} />
        <PrivacyPolicy />
        <Footer {...footerProps} />
      </div>
    );
  }

  if (currentPage === "terms") {
    return (
      <div className="min-h-screen bg-white">
        <Header {...headerProps} />
        <TermsOfService />
        <Footer {...footerProps} />
      </div>
    );
  }

  if (currentPage === "template") {
    return (
      <div className="min-h-screen bg-green-50">
        <Header {...headerProps} activePage="template" />
        <TemplatePage onTemplateSaved={() => navigate("dashboard")} isAdmin={isAdmin} />
        <Footer {...footerProps} />
      </div>
    );
  }

  if (currentPage === "manageTemplate") {
    return (
      <div className="min-h-screen bg-green-50">
        <Header {...headerProps} activePage="manageTemplate" />
        <ManageTemplatePage onTemplateSaved={() => navigate("dashboard")} onCreateTemplate={() => navigate("template")} />
        <Footer {...footerProps} />
      </div>
    );
  }

  if (currentPage === "features") {
    return (
      <div className="min-h-screen bg-blue-50">
        <Header {...headerProps} activePage="features" />
        <FeaturesPage onRecommendBudgetClick={() => navigate("recommendBudget")} onGoalSettingClick={() => navigate("goalSet")} onGoalSeekClick={() => navigate("goalBudget")} isAdmin={isAdmin} />
        <Footer {...footerProps} />
      </div>
    );
  }

  if (currentPage === "goalSet") {
    return (
      <div className="min-h-screen bg-white">
        <Header {...headerProps} />
        <GoalSetPage onGoalSaved={() => navigate("goalBudget")} />
        <Footer {...footerProps} />
      </div>
    );
  }

  if (currentPage === "goalBudget") {
    return (
      <div className="min-h-screen bg-white">
        <Header {...headerProps} />
        <GoalBudget onCreateBudget={() => navigate("template")} />
        <Footer {...footerProps} />
      </div>
    );
  }

  if (currentPage === "admin") {
    return (
      <div className="min-h-screen bg-white">
        <Header {...headerProps} />
        <AdminPage />
        <Footer {...footerProps} />
      </div>
    );
  }

if (currentPage === "faq") {
    return (
      <div className="min-h-screen bg-white">
        <Header {...headerProps} />
        <FAQPage onContactClick={() => navigate("contact")} />  
        <Footer {...footerProps} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header {...headerProps} />
      <HeroSection isAdmin={isAdmin} />
      <FeaturesSection isAdmin={isAdmin} />
      <BudgetTemplatesSection onSelectTemplate={() => navigate("template")} isAdmin={isAdmin} />
      <Footer {...footerProps} />
      <FeedbackButton />
    </div>
  );
}
