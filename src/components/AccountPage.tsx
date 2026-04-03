import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Settings, User, Bell, Lock, CreditCard, HelpCircle } from "lucide-react";
import { toast } from "sonner@2.0.3";

export function AccountPage() {
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@example.com");
  const [phone, setPhone] = useState("+1 (555) 123-4567");
  const [activeSection, setActiveSection] = useState("profile");

  const handleSaveChanges = () => {
    toast.success("Profile updated successfully!");
    console.log("Saved profile:", { name, email, phone });
  };

  const handleCancel = () => {
    // Reset to original values
    setName("John Doe");
    setEmail("john.doe@example.com");
    setPhone("+1 (555) 123-4567");
    toast.info("Changes discarded");
  };

  const handleChangeTemplate = () => {
    toast.info("Template selection coming soon! You'll be able to switch between Youth, Career, and Retirement templates.");
  };

  const handleDeleteAccount = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted."
    );
    if (confirmed) {
      toast.error("Account deletion feature is disabled in demo mode. Your account is safe!");
    }
  };

  const handleNotifications = () => {
    setActiveSection("notifications");
    toast.info("Notification settings coming soon!");
  };

  const handleSecurity = () => {
    setActiveSection("security");
    toast.info("Security settings coming soon! You'll be able to change your password and enable 2FA.");
  };

  const handleBilling = () => {
    setActiveSection("billing");
    toast.info("Billing section - Since Calcura is free, this will show your usage statistics!");
  };

  const handlePreferences = () => {
    setActiveSection("preferences");
    toast.info("Preferences coming soon! Customize your Calcura experience.");
  };

  const handleHelp = () => {
    setActiveSection("help");
    toast.info("Help & Support - Access tutorials, FAQs, and contact support.");
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
              className={`w-full justify-start gap-3 ${activeSection === "profile" ? "bg-green-50 text-green-700" : ""}`}
              onClick={() => setActiveSection("profile")}
            >
              <User size={20} />
              Profile
            </Button>
            <Button 
              variant="ghost" 
              className={`w-full justify-start gap-3 ${activeSection === "notifications" ? "bg-green-50 text-green-700" : ""}`}
              onClick={handleNotifications}
            >
              <Bell size={20} />
              Notifications
            </Button>
            <Button 
              variant="ghost" 
              className={`w-full justify-start gap-3 ${activeSection === "security" ? "bg-green-50 text-green-700" : ""}`}
              onClick={handleSecurity}
            >
              <Lock size={20} />
              Security
            </Button>
            <Button 
              variant="ghost" 
              className={`w-full justify-start gap-3 ${activeSection === "billing" ? "bg-green-50 text-green-700" : ""}`}
              onClick={handleBilling}
            >
              <CreditCard size={20} />
              Billing
            </Button>
            <Button 
              variant="ghost" 
              className={`w-full justify-start gap-3 ${activeSection === "preferences" ? "bg-green-50 text-green-700" : ""}`}
              onClick={handlePreferences}
            >
              <Settings size={20} />
              Preferences
            </Button>
            <Button 
              variant="ghost" 
              className={`w-full justify-start gap-3 ${activeSection === "help" ? "bg-green-50 text-green-700" : ""}`}
              onClick={handleHelp}
            >
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
                    JD
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

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={handleSaveChanges}
                  >
                    Save Changes
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={handleCancel}
                  >
                    Cancel
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
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleChangeTemplate}
                  >
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
              
              <Button 
                variant="destructive"
                onClick={handleDeleteAccount}
              >
                Delete Account
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}