/* Joseph Spreckels wrote all 153 lines of code for this file */
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Settings, User, Bell, Lock, CreditCard, HelpCircle } from "lucide-react";

/* API URL */
const API_URL = import.meta.env.VITE_API_URL;

//remove later
console.log("API_URL =", API_URL);

export function AccountPage() {
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const nameParts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const profileInitials =
    nameParts.length >= 2
      ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
      : (nameParts[0]?.slice(0, 2).toUpperCase() || "U");

  useEffect(() => {
    const userEmail = localStorage.getItem("email");
    const userId = localStorage.getItem("user_id");

    if (userEmail) {
      setEmail(userEmail);
    }

    if (userId) {
      fetch(`${API_URL}/users`) // fallback if we want DB truth for active user
        .then((res) => {
          if (!res.ok) {
            throw new Error("Unable to query users");
          }
          return res.json();
        })
        .then((users) => {
          const activeUser = users.find((u: any) => String(u.user_id) === String(userId));
          if (activeUser) {
            setEmail(activeUser.email);
            if (activeUser.name) {
              setName(activeUser.name);
            }
          }
        })
        .catch((err) => {
          console.warn("AccountPage: Could not load active user from API:", err);
        });
    }
  }, []);

  const handleDeleteAccount = async () => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      alert("No active user found. Cannot delete account.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error("Delete account failed", errorData);
        alert("Failed to delete account. Please try again.");
        return;
      }

      alert("Account deleted successfully.");
      localStorage.removeItem("user_id");
      localStorage.removeItem("email");
      localStorage.removeItem("username");
      window.location.href = "/";
    } catch (err) {
      console.error("Delete account network error", err);
      alert("Unable to delete account at this time. Please try again later.");
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("email");
    localStorage.removeItem("username");
    alert("Signed out successfully.");
    window.location.href = "/";
  };

  const handleSaveChanges = async () => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      alert("No active user found. Please log in again.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error("Failed to update user", errorData);
        alert(`Unable to save changes: ${errorData?.detail || response.statusText}`);
        return;
      }

      const result = await response.json();
      setEmail(email);
      setName(name);
      localStorage.setItem("email", email);
      alert("Profile updated successfully.");
      console.log("User updated", result);
    } catch (error) {
      console.error("Network error updating user", error);
      alert("Network error while saving changes. Please try again.");
    }
  };

  const handleChangePassword = async () => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      alert("No active user found. Please log in again.");
      return;
    }

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      alert("Please fill in all password fields.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      alert("New password and confirm password do not match.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/users/${userId}/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        alert(`Unable to change password: ${errorData?.detail || response.statusText}`);
        return;
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      alert("Password changed successfully.");
    } catch (error) {
      console.error("Network error changing password", error);
      alert("Network error while changing password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl text-gray-900 mb-2">Account Settings</h1>
          <p className="text-gray-600">Manage your profile and preferences</p>
        </div>

        <div className="grid md:grid-cols-[280px,1fr] gap-8">
          {/* Sidebar Navigation */}
          <div className="space-y-2">
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-3 bg-green-50 text-green-700"
            >
              <User size={20} />
              Profile
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3">
              <Bell size={20} />
              Notifications
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3">
              <Lock size={20} />
              Security
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3">
              <CreditCard size={20} />
              Billing
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3">
              <Settings size={20} />
              Preferences
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3">
              <HelpCircle size={20} />
              Help & Support
            </Button>
          </div>

          {/* Main Content Area */}
          <div className="space-y-6">
            {/* Profile Information Card */}
            <Card className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl text-gray-900 mb-1">Profile Information</h2>
                  <p className="text-sm text-gray-600">Update your personal details</p>
                </div>
                <Avatar className="w-20 h-20">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-green-100 text-green-700 text-2xl">
                    {profileInitials}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button className="bg-green-600 hover:bg-green-700" onClick={handleSaveChanges}>
                    Save Changes
                  </Button>
                  <Button variant="outline">
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>

            {/* Change Password Card */}
            <Card className="p-6">
              <h2 className="text-xl text-gray-900 mb-1">Change Password</h2>
              <p className="text-sm text-gray-600 mb-4">Update your password to keep your account secure</p>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                  <Input
                    id="confirmNewPassword"
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div className="pt-2">
                  <Button className="bg-green-600 hover:bg-green-700" onClick={handleChangePassword}>
                    Change Password
                  </Button>
                </div>
              </div>
            </Card>

            {/* Account Type Card */}
            <Card className="p-6">
              <h2 className="text-xl text-gray-900 mb-1">Account Type</h2>
              <p className="text-sm text-gray-600 mb-4">Your current budget template</p>
              
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg text-gray-900 mb-1">Career Template</div>
                    <p className="text-sm text-gray-600">
                      Optimized for mid-career professionals
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Change Template
                  </Button>
                </div>
              </div>
            </Card>

            {/* Delete Account Card */}
            <Card className="p-6 border-red-200">
              <h2 className="text-xl text-gray-900 mb-1">Danger Zone</h2>
              <p className="text-sm text-gray-600 mb-4">
                Permanently delete your account and all data
              </p>
              
              <div className="flex gap-3">
                <Button variant="destructive" onClick={handleDeleteAccount}>
                  Delete Account
                </Button>
                <Button variant="outline" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
