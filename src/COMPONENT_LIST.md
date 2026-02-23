# Calcura Component List

## Main Application

### App.tsx
Main application component that manages state-based routing between all pages (landing, template, login, account, dashboard, about, contact) and handles user authentication state. Written by Jaren Schneider. 

---

## Page Components

### AboutPage.tsx
Informational page that displays the company's mission, values, and background story about the Calcura budget app.

### AccountPage.tsx
User account management page with sidebar navigation for managing profile settings, preferences, and account details.

### ContactPage.tsx
Contact form page where users can submit inquiries via email, phone, or feedback text box.

### DashboardPage.tsx
Main dashboard page that displays financial overview, budget summary, charts, and transaction data for logged-in users.

### LoginPage.tsx
Split-layout authentication page with Calcura logo on beige left panel and login form on light blue right panel.

### TemplatePage.tsx
Comprehensive 9-section budget template builder where users create customized budgets based on their selected account type (Youth, Career, or Retirement).

---

## Landing Page Sections

### HeroSection.tsx
Top section of the landing page featuring the main headline, value proposition, and primary call-to-action buttons.

### FeaturesSection.tsx
Section showcasing the key features of Calcura including AI-driven budgeting recommendations and what-if analysis capabilities.

### BudgetTemplatesSection.tsx
Section displaying the three budget templates (Youth, Career, Retirement) with descriptions and selection functionality.

### TestimonialsSection.tsx
Section displaying user testimonials and reviews to build trust and credibility.

---

## Dashboard Components

### AIInsights.tsx
Component that displays AI-generated budgeting recommendations and personalized financial insights.

### BudgetSummary.tsx
Component showing an overview of the user's budget including income, expenses, and savings totals.

### CategoryBreakdown.tsx
Component that breaks down spending by category with visual indicators and percentages.

### SpendingChart.tsx
Visual chart component displaying spending patterns over time using the recharts library.

### TimePeriodSelector.tsx
Component allowing users to filter data by selecting different time periods (week, month, year).

### TransactionsList.tsx
Component displaying a list of recent financial transactions with details like date, category, and amount.

### UserAccountsSection.tsx
Component showing connected user accounts and financial account information.

### WhatIfAnalysis.tsx
Interactive component enabling users to perform scenario planning and what-if financial analysis.

---

## Shared Components

### Header.tsx
Global navigation header component with Calcura logo and conditional navigation links (Login/Sign Up when logged out, Account/Dashboard when logged in).

### Footer.tsx
Global footer component with links to About and Contact pages, plus additional site information.

### FeedbackButton.tsx
Floating feedback button component that allows users to quickly submit feedback from any page.

---

## UI Components (shadcn/ui)

### components/ui/accordion.tsx
Collapsible accordion component for displaying expandable content sections.

### components/ui/alert-dialog.tsx
Modal dialog component for displaying important alerts and confirmations.

### components/ui/alert.tsx
Alert component for displaying inline notifications and messages.

### components/ui/aspect-ratio.tsx
Utility component for maintaining consistent aspect ratios for media elements.

### components/ui/avatar.tsx
Avatar component for displaying user profile pictures or initials.

### components/ui/badge.tsx
Badge component for displaying labels, tags, or status indicators.

### components/ui/breadcrumb.tsx
Breadcrumb navigation component for showing the current page hierarchy.

### components/ui/button.tsx
Reusable button component with multiple variants and sizes.

### components/ui/calendar.tsx
Calendar component for date selection and date-related inputs.

### components/ui/card.tsx
Card container component for grouping related content with consistent styling.

### components/ui/carousel.tsx
Carousel component for displaying sliding content panels.

### components/ui/chart.tsx
Chart wrapper component providing utilities for data visualization.

### components/ui/checkbox.tsx
Checkbox input component for binary selections.

### components/ui/collapsible.tsx
Collapsible component for showing/hiding content sections.

### components/ui/command.tsx
Command palette component for quick actions and search functionality.

### components/ui/context-menu.tsx
Right-click context menu component for contextual actions.

### components/ui/dialog.tsx
Dialog/modal component for displaying overlay content and forms.

### components/ui/drawer.tsx
Drawer component that slides in from the screen edge for side panels.

### components/ui/dropdown-menu.tsx
Dropdown menu component for displaying a list of actions or options.

### components/ui/form.tsx
Form wrapper component with validation and error handling utilities.

### components/ui/hover-card.tsx
Popover component that appears on hover for additional information.

### components/ui/input-otp.tsx
One-time password input component for authentication codes.

### components/ui/input.tsx
Text input component for form fields and user data entry.

### components/ui/label.tsx
Form label component for describing input fields.

### components/ui/menubar.tsx
Menubar component for application-level menu navigation.

### components/ui/navigation-menu.tsx
Navigation menu component for site-wide navigation structures.

### components/ui/pagination.tsx
Pagination component for navigating through paginated content.

### components/ui/popover.tsx
Popover component for displaying floating content relative to trigger elements.

### components/ui/progress.tsx
Progress bar component for showing completion status.

### components/ui/radio-group.tsx
Radio button group component for mutually exclusive selections.

### components/ui/resizable.tsx
Resizable panel component for user-adjustable layouts.

### components/ui/scroll-area.tsx
Custom scrollable area component with styled scrollbars.

### components/ui/select.tsx
Select dropdown component for choosing from a list of options.

### components/ui/separator.tsx
Visual separator component for dividing content sections.

### components/ui/sheet.tsx
Sheet component for slide-in panels and side drawers.

### components/ui/sidebar.tsx
Sidebar navigation component for persistent side navigation.

### components/ui/skeleton.tsx
Loading skeleton component for placeholder content while data loads.

### components/ui/slider.tsx
Slider input component for selecting numeric values within a range.

### components/ui/sonner.tsx
Toast notification component wrapper for displaying temporary messages.

### components/ui/switch.tsx
Toggle switch component for on/off settings.

### components/ui/table.tsx
Table component for displaying structured tabular data.

### components/ui/tabs.tsx
Tabs component for organizing content into switchable panels.

### components/ui/textarea.tsx
Multi-line text input component for longer text entries.

### components/ui/toggle-group.tsx
Toggle button group component for multiple toggle options.

### components/ui/toggle.tsx
Single toggle button component for binary state changes.

### components/ui/tooltip.tsx
Tooltip component for displaying helpful hints on hover.

### components/ui/use-mobile.ts
Custom hook for detecting mobile viewport and responsive behavior.

### components/ui/utils.ts
Utility functions for UI component styling and class name management.

---

## System Components

### components/figma/ImageWithFallback.tsx
Protected system component for handling images with automatic fallback support (do not modify).

---

## Styles

### styles/globals.css
Global CSS file containing Tailwind configuration, custom tokens, typography defaults, and design system variables.

---

## Documentation Files

### Attributions.md
Documentation file containing credits and attributions for third-party resources used in the project.

### MENU_HIERARCHY.md
Documentation file outlining the navigation structure and menu hierarchy of the application.

### guidelines/Guidelines.md
Project guidelines and coding standards documentation for maintaining consistency.
