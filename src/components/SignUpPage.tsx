import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import logoImage from "../assets/logoImage.png";

const API_URL = import.meta.env.VITE_API_URL;
const PASSWORD_REQUIREMENTS_MESSAGE =
  "Password must be at least 14 characters and include at least one letter, one uppercase letter, one number, and one symbol.";

const isValidPassword = (value: string) => {
  return (
    value.length >= 14 &&
    /[A-Za-z]/.test(value) &&
    /[A-Z]/.test(value) &&
    /\d/.test(value) &&
    /[^A-Za-z0-9]/.test(value)
  );
};

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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [age, setAge] = useState(18);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter your name.");
      return;
    }

    if (!email.trim()) {
      alert("Please enter your email.");
      return;
    }

    if (!password.trim()) {
      alert("Please enter your password.");
      return;
    }

    if (!isValidPassword(password)) {
      alert(PASSWORD_REQUIREMENTS_MESSAGE);
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (!Number.isInteger(age) || age < 13) {
      alert("Please enter a valid age (13 or older).");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/users/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email: email.trim().toLowerCase(),
          password,
          age,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error("Signup failed:", errorData);
        alert("Could not create account. Please try again.");
        return;
      }

      console.log("Signup successful");
      alert("Account created successfully. You can now log in.");
      onCreateAccount?.();
    } catch (error) {
      console.error("Network error during signup:", error);
      alert("Unable to reach the server. Please try again later.");
    }
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
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-6 border-2 border-gray-900 rounded-xl"
              required
            />

            <Input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-6 border-2 border-gray-900 rounded-xl"
              required
            />

            <Input
              type="number"
              placeholder="Age"
              value={age}
              min={13}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full px-4 py-6 border-2 border-gray-900 rounded-xl"
              required
            />

            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={14}
              className="w-full px-4 py-6 border-2 border-gray-900 rounded-xl"
              required
            />
            <p className="text-sm text-gray-700 -mt-3">
              Must be 14+ characters with a letter, uppercase letter, number,
              and symbol.
            </p>

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