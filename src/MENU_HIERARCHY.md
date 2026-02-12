# Calcura Website - Menu Hierarchy & Navigation Structure

## Overview
Calcura uses a state-based routing system managed in `App.tsx` with conditional rendering based on `currentPage` state and `isLoggedIn` authentication state.

---

## Page Types
```
type PageView = "landing" | "login" | "dashboard" | "account" | "template"
```

---

## 1. LANDING PAGE (Public - Default View)
**Route:** `currentPage === "landing"`  
**Authentication:** Not required  
**Components:** Header, HeroSection, FeaturesSection, BudgetTemplatesSection, Footer, FeedbackButton

### Header Navigation (Logged Out):
- **Logo (Clickable)** → Returns to Landing Page
- **Features** (Anchor link) → Scrolls to #features section
- **Templates** (Anchor link) → Scrolls to #templates section
- **Login** (Button) → Navigates to Login Page
- **Sign Up Free** (Button) → Navigates to Login Page

### Page Sections:
1. **Hero Section** - Main banner with CTA
2. **Features Section** - Showcases app capabilities
3. **Budget Templates Section** - Displays three template options:
   - Youth Template
   - Career Template
   - Retirement Template
   - Each template has "Choose Template" button → Navigates to Template Builder Page

### Footer:
- Standard footer with links and information
- Appears on all pages except Login Page

### Floating Element:
- **Feedback Button** - Fixed position feedback collection button (only on landing page)

---

## 2. LOGIN PAGE
**Route:** `currentPage === "login"`  
**Authentication:** Not required  
**Layout:** Split-screen design (beige left panel + light blue right panel)

### Left Panel (Beige):
- **Calcura Logo (Clickable)** → Returns to Landing Page
- Tagline: "Smart budgeting for every stage of life"

### Right Panel (Light Blue):
- **Welcome Message**
- **Email Input Field**
- **Password Input Field**
- **Remember Me** (Checkbox)
- **Forgot Password?** (Link)
- **Sign In** (Button) → Triggers login, navigates to Dashboard Page
- **Don't have an account? Sign up** (Link)
- **Continue as Guest** (Link) → Returns to Landing Page

### Navigation Actions:
- **Close (X)** → Returns to Landing Page
- **Create Account** → Console log (not yet implemented)
- **Continue as Guest** → Returns to Landing Page
- **Successful Login** → Sets `isLoggedIn = true`, navigates to Dashboard

---

## 3. DASHBOARD PAGE (Protected - Post-Login)
**Route:** `currentPage === "dashboard"`  
**Authentication:** Required (`isLoggedIn === true`)  
**Components:** Header, DashboardPage, Footer

### Header Navigation (Logged In):
- **Logo (Clickable)** → Returns to Landing Page
- **Dashboard** (Link) → Stays on/navigates to Dashboard Page
- **Features** (Anchor link) → Scrolls to #features (if on landing page)
- **Templates** (Anchor link) → Scrolls to #templates (if on landing page)
- **Account** (Button with User icon) → Navigates to Account Page

### Dashboard Content Sections:
1. **Welcome Header** - Personalized greeting
2. **Summary Cards (4):**
   - Total Income (with trend indicator)
   - Total Expenses (with trend indicator)
   - Remaining Budget
   - Savings Progress

3. **Spending by Category** - Visual progress bars for:
   - Housing
   - Food
   - Transportation
   - Entertainment
   - Utilities
   - Healthcare
   - Other
   - "View All" button

4. **Recent Transactions** - List of recent financial transactions
   - "See All" button
   - "Add Transaction" button

5. **Quick Actions (3 Cards):**
   - Create New Budget
   - Financial Goals
   - AI Recommendations

---

## 4. ACCOUNT PAGE (Protected - Settings)
**Route:** `currentPage === "account"`  
**Authentication:** Required (`isLoggedIn === true`)  
**Components:** Header, AccountPage, Footer

### Header Navigation (Logged In):
- Same as Dashboard Page header

### Account Page Layout:
**Sidebar Navigation (Left):**
- **Profile** (Active) ← Currently displayed
- **Notifications** (Inactive)
- **Security** (Inactive)
- **Billing** (Inactive)
- **Preferences** (Inactive)
- **Help & Support** (Inactive)

**Main Content Area (Right):**

1. **Profile Information Card:**
   - User Avatar (initials: JD)
   - Full Name (editable input)
   - Email Address (editable input)
   - Phone Number (editable input)
   - **Save Changes** (Button)
   - **Cancel** (Button)

2. **Account Type Card:**
   - Current template display (e.g., "Career Template")
   - Template description
   - **Change Template** (Button)

3. **Danger Zone Card:**
   - Account deletion warning
   - **Delete Account** (Destructive button)

---

## 5. TEMPLATE BUILDER PAGE (Multi-Section Form)
**Route:** `currentPage === "template"`  
**Authentication:** Optional (available to guests and logged-in users)  
**Components:** Header, TemplatePage, Footer

### Header Navigation:
- Shows logged-in or logged-out state based on `isLoggedIn`
- Same navigation options as Dashboard/Landing (depending on auth state)

### Template Builder Sections (9 Total):
Progressive form with section-by-section navigation:

1. **Section 1: Income**
   - Choose income type (Take-home pay OR Annual income)
   - Input income amount
   - Select pay period (Monthly/Yearly)

2. **Section 2: Housing**
   - Choose housing type (Rent, Mortgage, Own outright)
   - Input housing cost (if applicable)
   - Select payment period

3. **Section 3: Expenses**
   - Multiple expense categories with dynamic add/remove
   - Predefined types (Food, Transportation, Utilities, etc.)
   - Custom expense option
   - Amount and period for each

4. **Section 4: Debts**
   - Multiple debt entries with dynamic add/remove
   - Debt types (Student Loan, Car Loan, Credit Card, etc.)
   - Payment amount and period for each

5. **Section 5: Donations**
   - Multiple donation entries with dynamic add/remove
   - Organization name
   - Donation amount and period

6. **Section 6: Savings Accounts**
   - Multiple savings account entries
   - Account names (Emergency Fund, Vacation, etc.)
   - Current balance for each

7. **Section 7: Investments**
   - Multiple investment account entries
   - Account types (401k, IRA, Stocks, etc.)
   - Current value for each

8. **Section 8: Financial Goals**
   - Multiple goal entries
   - Goal types (Buy a home, Pay off debt, etc.)
   - Target amount and timeframe

9. **Section 9: Review & Summary**
   - Complete budget overview
   - All entered data displayed
   - **Save Budget** (Button)
   - **Start Over** (Button)

### Navigation Controls:
- **Previous** (Button) → Go to previous section
- **Next** (Button) → Go to next section
- Section progress indicator (e.g., "Section 1 of 9")

---

## Authentication State Management

### When Logged Out (`isLoggedIn === false`):
- Landing Page shows Login/Sign Up buttons
- Template Page shows Login/Sign Up buttons
- Dashboard Page is accessible but should redirect (TODO)
- Account Page is accessible but should redirect (TODO)

### When Logged In (`isLoggedIn === true`):
- Landing Page shows Account button + Dashboard link
- Dashboard Page is accessible with full functionality
- Account Page is accessible with full functionality
- Template Page shows Account button + Dashboard link

---

## Navigation Flow Diagrams

### Guest User Flow:
```
Landing Page
    ├─> Login Page
    │       └─> [Enter credentials] → Dashboard Page (now logged in)
    │
    ├─> Template Builder Page
    │       └─> [Complete template] → Review & Save
    │
    └─> [Scroll to sections via anchor links]
            ├─> #features
            └─> #templates
```

### Logged-In User Flow:
```
Dashboard Page (default after login)
    ├─> Account Page
    │       └─> [Edit profile, change template, settings]
    │
    ├─> Template Builder Page
    │       └─> [Create/edit budget templates]
    │
    ├─> Landing Page (via logo click)
    │       └─> [View marketing content]
    │
    └─> [Return to Dashboard via nav link]
```

### Global Navigation (All Pages):
```
Logo (Calcura) → Always returns to Landing Page
Footer → Appears on all pages except Login Page
```

---

## Component File Structure

### Page Components:
- `/App.tsx` - Main routing logic
- `/components/HeroSection.tsx` - Landing hero
- `/components/FeaturesSection.tsx` - Features showcase
- `/components/BudgetTemplatesSection.tsx` - Template cards
- `/components/LoginPage.tsx` - Authentication
- `/components/DashboardPage.tsx` - User dashboard
- `/components/AccountPage.tsx` - Account settings
- `/components/TemplatePage.tsx` - Budget builder

### Shared Components:
- `/components/Header.tsx` - Navigation header (dynamic based on auth state)
- `/components/Footer.tsx` - Site footer
- `/components/FeedbackButton.tsx` - Floating feedback widget

### UI Components:
- `/components/ui/*` - ShadCN UI component library (35+ components)

---

## Future Enhancements Needed:
1. **Route Protection** - Redirect unauthenticated users from Dashboard/Account pages
2. **Sign-Up Page** - Separate registration flow
3. **Logout Functionality** - Button to clear authentication state
4. **Password Reset Flow** - Forgot password implementation
5. **Template Saving** - Connect builder to user account/database
6. **Persistent Auth** - localStorage or Supabase authentication
7. **Account Sidebar Navigation** - Make other sidebar items functional
   - Notifications page
   - Security page
   - Billing page
   - Preferences page
   - Help & Support page

---

## State Management Summary

**App.tsx State:**
```typescript
const [currentPage, setCurrentPage] = useState<PageView>("landing");
const [isLoggedIn, setIsLoggedIn] = useState(false);
```

**Navigation Actions:**
```typescript
// Page transitions
setCurrentPage("landing" | "login" | "dashboard" | "account" | "template")

// Authentication
setIsLoggedIn(true)  // After successful login
setIsLoggedIn(false) // After logout (to be implemented)
```
