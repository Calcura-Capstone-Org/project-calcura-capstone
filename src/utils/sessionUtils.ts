// Session utility functions for App.tsx

export type PageView = "landing" | "template" | "manageTemplate" | "login" | "account" | "dashboard" | "recommendBudget" | "about" | "contact" | "privacy" | "terms" | "signup" | "forgotPassword" | "features" | "admin" | "goalSet" | "goalBudget";

// Pages that require authentication
export const protectedPages = new Set<PageView>([
  "dashboard",
  "account",
  "manageTemplate",
  "template",
  "recommendBudget",
  "admin",
  "goalSet",
  "goalBudget",
]);

// Check if user has an active session
export function hasActiveSession(): boolean {
  const email = localStorage.getItem("email");
  const username = localStorage.getItem("username");
  return !!(email || username);
}

// Extract page from pathname
export function getPageFromPathname(pathname: string): PageView {
  // Remove leading/trailing slashes
  const cleanPath = pathname.replace(/^\/+|\/+$/g, "").toLowerCase();
  
  // Map paths to pages
  const pathMap: Record<string, PageView> = {
    "": "landing",
    "template": "template",
    "managetemplate": "manageTemplate",
    "login": "login",
    "account": "account",
    "dashboard": "dashboard",
    "recommendbudget": "recommendBudget",
    "about": "about",
    "contact": "contact",
    "privacy": "privacy",
    "terms": "terms",
    "signup": "signup",
    "forgotpassword": "forgotPassword",
    "features": "features",
    "admin": "admin",
    "goalset": "goalSet",
    "goalbudget": "goalBudget",
  };
  
  return pathMap[cleanPath] ?? "landing";
}
