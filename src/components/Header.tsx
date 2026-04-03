import { Button } from "./ui/button";
import { User, LogOut, Shield } from "lucide-react";
import logoImage from "figma:asset/1a36a3a0f13bed42158cef736e0c5fd1e80a9a0c.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface HeaderProps {
  onLoginClick?: () => void;
  onHomeClick?: () => void;
  onAccountClick?: () => void;
  onDashboardClick?: () => void;
  onAboutClick?: () => void;
  onContactClick?: () => void;
  onFeaturesClick?: () => void;
  onTemplatesClick?: () => void;
  onLogoutClick?: () => void;
  onAdminClick?: () => void;
  isLoggedIn?: boolean;
  isAdmin?: boolean;
}

export function Header({ 
  onLoginClick, 
  onHomeClick, 
  onAccountClick, 
  onDashboardClick, 
  onAboutClick, 
  onContactClick, 
  onFeaturesClick,
  onTemplatesClick,
  onLogoutClick,
  onAdminClick,
  isLoggedIn = false,
  isAdmin = false 
}: HeaderProps) {
  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={onHomeClick}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <img 
              src={logoImage} 
              alt="Calcura Logo" 
              className="w-12 h-12 object-contain"
            />
            <span className="text-xl text-gray-900">Calcura</span>
          </button>
          
          <nav className="hidden md:flex items-center gap-8">
            {isLoggedIn && (
              <button 
                onClick={onDashboardClick}
                className="text-gray-700 hover:text-gray-900"
              >
                Dashboard
              </button>
            )}
            <button 
              onClick={onFeaturesClick}
              className="text-gray-700 hover:text-gray-900"
            >
              Features
            </button>
            <button 
              onClick={onTemplatesClick}
              className="text-gray-700 hover:text-gray-900"
            >
              Templates
            </button>
            <button 
              onClick={onAboutClick}
              className="text-gray-700 hover:text-gray-900"
            >
              About
            </button>
            <button 
              onClick={onContactClick}
              className="text-gray-700 hover:text-gray-900"
            >
              Contact
            </button>
          </nav>
          
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
                  <User size={18} />
                  Account
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={onAccountClick}>
                    <User size={16} className="mr-2" />
                    Account Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onDashboardClick}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2"
                    >
                      <rect width="7" height="9" x="3" y="3" rx="1" />
                      <rect width="7" height="5" x="14" y="3" rx="1" />
                      <rect width="7" height="9" x="14" y="12" rx="1" />
                      <rect width="7" height="5" x="3" y="16" rx="1" />
                    </svg>
                    Dashboard
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem onClick={onAdminClick} className="text-green-600 focus:text-green-600">
                      <Shield size={16} className="mr-2" />
                      Admin Panel
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogoutClick} className="text-red-600 focus:text-red-600">
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="outline" onClick={onLoginClick}>
                  Login
                </Button>
                <Button className="bg-green-600 hover:bg-green-700" onClick={onLoginClick}>
                  Sign Up Free
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}