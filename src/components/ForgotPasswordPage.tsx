import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const logoImage = "";

interface ForgotPasswordPageProps {
  onBackToLogin?: () => void;
  onHomeClick?: () => void;
}

export function ForgotPasswordPage({
  onBackToLogin,
  onHomeClick,
}: ForgotPasswordPageProps) {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [verified, setVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      alert("Please enter your email address.");
      return;
    }

    setEmailSent(true);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();

    if (!verificationCode.trim()) {
      alert("Please enter the verification code.");
      return;
    }

    setVerified(true);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword.trim() || !confirmPassword.trim()) {
      alert("Please fill out both password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    alert("Password updated successfully! Please log in again.");
    onBackToLogin?.();
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
            Reset Password
          </h1>

          <form onSubmit={handleSendEmail} className="space-y-6">
            <div>
              <label className="block mb-2 text-sm text-gray-700">
                Email Address
              </label>
              <Input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-6 border-2 border-gray-900 rounded-xl"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[#A8D5A8] hover:bg-[#96C796] text-black border-2 border-gray-900 rounded-xl py-6"
            >
              Send Email
            </Button>
          </form>

          {emailSent && (
            <p className="mt-4 text-gray-700">
              A verification email has been sent.
            </p>
          )}

          {emailSent && (
            <form onSubmit={handleVerify} className="space-y-4 mt-6">
              <div>
                <label className="block mb-2 text-sm text-gray-700">
                  Verification Code
                </label>
                <Input
                  type="text"
                  placeholder="Verification Code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="w-full px-4 py-6 border-2 border-gray-900 rounded-xl"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[#A8D5A8] hover:bg-[#96C796] text-black border-2 border-gray-900 rounded-xl py-6"
              >
                Verify
              </Button>
            </form>
          )}

          {verified && (
            <p className="mt-4 text-gray-700">
              Verified! Please enter your new password.
            </p>
          )}

          {verified && (
            <form onSubmit={handleUpdatePassword} className="space-y-4 mt-6">
              <div>
                <label className="block mb-2 text-sm text-gray-700">
                  New Password
                </label>
                <Input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-6 border-2 border-gray-900 rounded-xl"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm text-gray-700">
                  Confirm Password
                </label>
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-6 border-2 border-gray-900 rounded-xl"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[#A8D5A8] hover:bg-[#96C796] text-black border-2 border-gray-900 rounded-xl py-4"
              >
                Update Password
              </Button>
            </form>
          )}

          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => onBackToLogin?.()}
              className="text-gray-700 hover:text-gray-900"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}