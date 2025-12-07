import { Button } from "./ui/button";
import { User } from "lucide-react";
import logoImage from "figma:asset/1a36a3a0f13bed42158cef736e0c5fd1e80a9a0c.png";

interface HeaderProps {
  onLoginClick?: () => void;
  onHomeClick?: () => void;
  onAccountClick?: () => void;
  onDashboardClick?: () => void;
  onAboutClick?: () => void;
  onContactClick?: () => void;
  isLoggedIn?: boolean;
}

export function Header({ onLoginClick, onHomeClick, onAccountClick, onDashboardClick, onAboutClick, onContactClick, isLoggedIn = false }: HeaderProps) {
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
            <a href="#features" className="text-gray-700 hover:text-gray-900">
              Features
            </a>
            <a href="#templates" className="text-gray-700 hover:text-gray-900">
              Templates
            </a>
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
              <Button 
                variant="outline" 
                onClick={onAccountClick}
                className="gap-2"
              >
                <User size={18} />
                Account
              </Button>
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
