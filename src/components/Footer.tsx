/*Jaren Schneider wrote 79 lines of code for this file */
import { Twitter, Facebook, Instagram } from "lucide-react";
import changelog from "../data/changelog.json";

/* API URL */
const API_URL = import.meta.env.VITE_API_URL;

//remove later
console.log("API_URL =", API_URL);

const SEEN_KEY = "calcura.changelogSeen";

function hasUnseenChangelog(): boolean {
  if (!changelog.version) return false;
  try {
    return localStorage.getItem(SEEN_KEY) !== changelog.version;
  } catch {
    // localStorage unavailable (private mode) — show the dot rather than hide it.
    return true;
  }
}

interface FooterProps {
  onAboutClick?: () => void;
  onContactClick?: () => void;
  onFAQClick?: () => void;
  onPrivacyClick?: () => void;
  onTermsClick?: () => void;
  onUpdatesClick?: () => void;
}

export function Footer({ onAboutClick, onContactClick, onFAQClick, onPrivacyClick, onTermsClick, onUpdatesClick }: FooterProps) {
  const updatesAreFresh = hasUnseenChangelog();
  return (
    <footer className="bg-white border-t py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-gray-900 mb-4">Product</h3>
            <ul className="space-y-2">
              <li><a href="#features" className="text-gray-600 hover:text-gray-900">Features</a></li>
              <li>
                <button
                  onClick={onUpdatesClick}
                  className="text-gray-600 hover:text-gray-900 inline-flex items-center gap-2"
                >
                  Updates
                  {updatesAreFresh && (
                    <span
                      aria-label="New updates"
                      title="New updates"
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: "#16a34a",
                        display: "inline-block",
                      }}
                    />
                  )}
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-gray-900 mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={onAboutClick}
                  className="text-gray-600 hover:text-gray-900"
                >
                  About
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-gray-900 mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={onContactClick}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button 
                  onClick={onFAQClick}
                  className="text-gray-600 hover:text-gray-900"
                >
                  FAQs
                </button>
              </li>
              <li>
                <button
                  onClick={onPrivacyClick}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={onTermsClick}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-gray-900 mb-4">Follow Us</h3>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-blue-600">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-600">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-600">
                <Instagram className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 text-center text-gray-600">
          <p>© 2025 Calcura. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
