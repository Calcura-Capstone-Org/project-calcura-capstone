import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const logoImage = "";

interface SignUpPageProps {
  onClose?: () => void;
  onCreateAccount?: () => void;
  onContinueAsGuest?: () => void;
  onHomeClick?: () => void;
  onLoginSuccess?: () => void;
}

export function SignUpPage({
  onClose,
  onCreateAccount,
  onContinueAsGuest,
  onHomeClick,
  onLoginSuccess,
}: SignUpPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      alert("Please enter your email.");
      return;
    }

    if (!password.trim()) {
      alert("Please enter your password.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    alert("Account created successfully! Please log in.");
    onCreateAccount?.();
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden md:flex md:w-1/2 bg-[#F5F1E8] items-center justify-center relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[600px] h-[600px] rounded-full bg-white/30 flex items-center justify-center">
            <div className="w-[500px] h-[500px] rounded-full bg-white/50 flex items-center justify-center">
              <div className="w-[400px] h-[400px] rounded-full bg-white flex items-center justify-center">
                <img
                  src={logoImage}
                  alt="Calcura Logo"
                  className="w-80 h-80 object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onHomeClick}
          className="absolute bottom-16 text-center hover:opacity-80 transition-opacity"
        >
          <img
            src={logoImage}
            alt="Calcura"
            className="w-24 h-24 mx-auto mb-2 object-contain"
          />
          <div className="text-3xl text-[#4A7BA7]">Calcura</div>
          <div className="text-gray-600">
            Smart budgeting for every stage of life
          </div>
        </button>
      </div>

      <div className="w-full md:w-1/2 bg-[#D4E5F7] flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8 border-2 border-gray-900">
          <h1 className="text-3xl text-center mb-8 text-gray-900">
            Create Account
          </h1>

          <form onSubmit={handleSignup} className="space-y-6">
            <Input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-6 border-2 border-gray-900 rounded-xl"
              required
            />

            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-6 border-2 border-gray-900 rounded-xl"
              required
            />

            <Input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-6 border-2 border-gray-900 rounded-xl"
              required
            />

            <Button
              type="submit"
              className="w-full bg-[#A8D5A8] hover:bg-[#96C796] text-gray-900 py-6 rounded-xl border-2 border-gray-900"
            >
              Sign Up
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => onCreateAccount?.()}
              className="text-gray-700 hover:text-gray-900"
            >
              Already have an account? Login
            </button>
          </div>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={onContinueAsGuest}
              className="text-gray-700 hover:text-gray-900"
            >
              Continue as a Guest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}