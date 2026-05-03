import { useState, useEffect } from "react";
import logoImage from "../assets/logoImage.png";

const API_URL = import.meta.env.VITE_API_URL;
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Settings, Users, Image, FileText, Trash2, Plus, Edit, Save, Shield } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface User {
  id: string;
  name: string | null;
  email: string;
  created_on: string;
  isAdmin: boolean;
}

interface PageContent {
  heroTitle: string;
  heroSubtitle: string;
  aboutText: string;
  featuresTitle: string;
}

interface SiteImage {
  id: string;
  name: string;
  location: string;
  url: string;
}

interface Role {
  id: string;
  name: string;
  permissions?: string;
  description?: string;
}

interface RoleApiResponse {
  role_id?: number | string;
  id?: number | string;
  name?: string;
  permissions?: string;
  description?: string;
}

interface UserRoleApiResponse {
  user_id?: number | string;
  role_id?: number | string;
}

export function AdminPage() {
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const currentUserId = localStorage.getItem("user_id");

  // User Management State
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/users`),
      fetch(`${API_URL}/user_roles/`),
    ])
      .then(async ([usersRes, userRolesRes]) => {
        if (!usersRes.ok) throw new Error("Failed to fetch users");
        if (!userRolesRes.ok) throw new Error("Failed to fetch user roles");

        const usersData: Array<{ user_id: number | null; name: string | null; email: string; created_on: string }> = await usersRes.json();
        const userRolesData: UserRoleApiResponse[] = await userRolesRes.json();

        const adminUserIds = new Set(
          userRolesData
            .filter((ur) => Number(ur.role_id) === 5)
            .map((ur) => String(ur.user_id))
        );

        setTotalUsers(usersData.length);
        setUsers(
          usersData.map((u) => {
            const mappedId = u.user_id != null ? String(u.user_id) : u.email;
            return {
              id: mappedId,
              name: u.name,
              email: u.email,
              created_on: u.created_on,
              isAdmin: adminUserIds.has(mappedId),
            };
          })
        );
      })
      .catch(() => setTotalUsers(null));
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/roles/`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch roles");
        return res.json();
      })
      .then((data: RoleApiResponse[]) => {
        setRoles(
          data.map((role, index) => ({
            id: String(role.role_id ?? role.id ?? index + 1),
            name: role.name ?? "Unnamed Role",
            permissions: role.permissions ?? "",
            description: role.description ?? "",
          }))
        );
      })
      .catch(() => setRoles([]));
  }, []);

  // Content Management State
  const [pageContent, setPageContent] = useState<PageContent>({
    heroTitle: "Take Control of Your Financial Future",
    heroSubtitle: "AI-powered budgeting that adapts to your life stage",
    aboutText: "Calcura is a comprehensive financial planning tool designed to help you achieve your financial goals.",
    featuresTitle: "Smart Features for Smart Budgeting"
  });

  // Image Management State
  const [siteImages, setSiteImages] = useState<SiteImage[]>([
    { id: "1", name: "Calcura Brand Logo", location: "Landing & Site Branding", url: logoImage },
    { id: "2", name: "Calcura Dashboard Preview", location: "Dashboard Page", url: logoImage },
    { id: "3", name: "Calcura Hero Visual", location: "Landing Page Hero", url: logoImage },
  ]);

  // Roles Management State
  const [roles, setRoles] = useState<Role[]>([]);
  const [newRoleId, setNewRoleId] = useState("");
  const [newRoleName, setNewRoleName] = useState("");
  const [newRolePermissions, setNewRolePermissions] = useState("");
  const [newRoleDescription, setNewRoleDescription] = useState("");

  // Dialog States
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [isEditContentOpen, setIsEditContentOpen] = useState(false);
  const [isEditImageOpen, setIsEditImageOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<PageContent>(pageContent);
  const [editingImage, setEditingImage] = useState<SiteImage | null>(null);

  // Form States for New User
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserAccountType, setNewUserAccountType] = useState<"Youth" | "Career" | "Retirement">("Career");

  // User Management Functions
  const handleCreateUser = () => {
    if (!newUserName || !newUserEmail || !newUserPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    const newUser: User = {
      id: Date.now().toString(),
      name: newUserName,
      email: newUserEmail,
      created_on: new Date().toISOString().replace('T', ' ').split('.')[0],
      isAdmin: false
    };

    setUsers([...users, newUser]);
    toast.success(`Account created for ${newUserName}`);
    
    // Reset form
    setNewUserName("");
    setNewUserEmail("");
    setNewUserPassword("");
    setNewUserAccountType("Career");
    setIsCreateUserOpen(false);
  };

  const handleDeleteUser = async (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    if (user.isAdmin) {
      toast.error("Cannot delete admin accounts");
      return;
    }

    const confirmed = window.confirm(`Are you sure you want to delete ${user.name ?? user.email}'s account? This action cannot be undone.`);
    if (!confirmed) return;

    try {
      const res = await fetch(`${API_URL}/users/${userId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setUsers(users.filter(u => u.id !== userId));
      toast.success(`${user.name ?? user.email}'s account has been deleted`);
    } catch {
      toast.error("Failed to delete account. Please try again.");
    }
  };

  const handleAdminRoleAction = async (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    if (user.isAdmin && currentUserId != null && String(currentUserId) === String(userId)) {
      toast.error("You cannot remove yourself as an admin");
      return;
    }

    const parsedUserId = Number(userId);
    if (Number.isNaN(parsedUserId)) {
      toast.error("Invalid user ID for admin role assignment");
      return;
    }

    try {
      if (user.isAdmin) {
        const removeRes = await fetch(`${API_URL}/user_roles/${parsedUserId}/5`, {
          method: "DELETE",
        });

        if (!removeRes.ok) throw new Error("Failed to remove admin role");

        setUsers(users.map((u) => (u.id === userId ? { ...u, isAdmin: false } : u)));
        toast.success(`${user.name ?? user.email} is no longer an admin`);
      } else {
        const assignRes = await fetch(`${API_URL}/user_roles/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: parsedUserId,
            role_id: 5,
          }),
        });

        if (!assignRes.ok) throw new Error("Failed to assign admin role");

        setUsers(users.map((u) => (u.id === userId ? { ...u, isAdmin: true } : u)));
        toast.success(`${user.name ?? user.email} is now an admin`);
      }
    } catch {
      toast.error("Failed to update admin role. Please try again.");
    }
  };

  // Content Management Functions
  const handleSaveContent = () => {
    setPageContent(editingContent);
    toast.success("Page content updated successfully");
    setIsEditContentOpen(false);
  };

  // Image Management Functions
  const handleSaveImage = () => {
    if (!editingImage) return;

    setSiteImages(siteImages.map(img => 
      img.id === editingImage.id ? editingImage : img
    ));
    toast.success("Image updated successfully");
    setIsEditImageOpen(false);
    setEditingImage(null);
  };

  const handleAddImage = () => {
    const newImage: SiteImage = {
      id: Date.now().toString(),
      name: "New Image",
      location: "Unassigned",
      url: "https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf"
    };
    setSiteImages([...siteImages, newImage]);
    toast.success("New image added");
  };

  const handleDeleteImage = (imageId: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this image?");
    if (confirmed) {
      setSiteImages(siteImages.filter(img => img.id !== imageId));
      toast.success("Image deleted");
    }
  };

  const handleDeleteRole = async (roleId: string, roleName: string) => {
    if (roleId === "5" || roleName.toLowerCase() === "admin") {
      toast.error("The admin role cannot be deleted");
      return;
    }

    const confirmed = window.confirm(`Are you sure you want to delete the "${roleName}" role? This action cannot be undone.`);
    if (!confirmed) return;

    try {
      const res = await fetch(`${API_URL}/roles/${roleId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setRoles(roles.filter((r) => r.id !== roleId));
      toast.success(`Role "${roleName}" deleted successfully`);
    } catch {
      toast.error("Failed to delete role. Please try again.");
    }
  };

  const handleAddRole = async () => {
    if (!newRoleId.trim() || !newRoleName.trim()) {
      toast.error("Please provide role ID and role name");
      return;
    }

    const trimmedRoleId = newRoleId.trim();
    const trimmedRoleName = newRoleName.trim();
    const trimmedRolePermissions = newRolePermissions.trim();
    const trimmedRoleDescription = newRoleDescription.trim();

    if (roles.some((role) => role.id === trimmedRoleId)) {
      toast.error("Role ID already exists");
      return;
    }

    const parsedRoleId = Number(trimmedRoleId);
    if (Number.isNaN(parsedRoleId)) {
      toast.error("Role ID must be a number");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/roles/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role_id: parsedRoleId,
          name: trimmedRoleName,
          permissions: trimmedRolePermissions || null,
          description: trimmedRoleDescription || null,
        }),
      });

      if (!res.ok) throw new Error("Failed to create role");

      const rolesRes = await fetch(`${API_URL}/roles/`);
      if (!rolesRes.ok) throw new Error("Failed to refresh roles");
      const rolesData: RoleApiResponse[] = await rolesRes.json();

      setRoles(
        rolesData.map((role, index) => ({
          id: String(role.role_id ?? role.id ?? index + 1),
          name: role.name ?? "Unnamed Role",
          permissions: role.permissions ?? "",
          description: role.description ?? "",
        }))
      );

      toast.success("Role added successfully");
      setNewRoleId("");
      setNewRoleName("");
      setNewRolePermissions("");
      setNewRoleDescription("");
    } catch {
      toast.error("Failed to add role. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Admin Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-green-600" />
            <h1 className="text-3xl text-gray-900">Admin Dashboard</h1>
          </div>
          <p className="text-gray-600">Manage users, content, and site settings</p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total Users</span>
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-2xl text-gray-900">
              {totalUsers !== null ? totalUsers : "—"}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Named Accounts</span>
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl text-gray-900">
              {users.filter(u => u.name).length}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Admin Accounts</span>
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-2xl text-gray-900">
              {users.filter(u => u.isAdmin).length}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Regular Accounts</span>
              <Users className="w-5 h-5 text-orange-600" />
            </div>
            <div className="text-2xl text-gray-900">
              {users.filter(u => !u.isAdmin).length}
            </div>
          </Card>
        </div>

        {/* Main Admin Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="flex flex-row w-full">
            <TabsTrigger value="users" className="flex-1">
              <Users className="w-4 h-4 mr-2" />
              User Management
            </TabsTrigger>
            <TabsTrigger value="content" className="flex-1">
              <FileText className="w-4 h-4 mr-2" />
              Page Content
            </TabsTrigger>
            <TabsTrigger value="images" className="flex-1">
              <Image className="w-4 h-4 mr-2" />
              Images
            </TabsTrigger>
            <TabsTrigger value="roles" className="flex-1">
              <Shield className="w-4 h-4 mr-2" />
              Roles
            </TabsTrigger>
          </TabsList>

          {/* User Management Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>User Accounts</CardTitle>
                    <CardDescription>Manage user accounts and permissions</CardDescription>
                  </div>
                  <Button 
                    onClick={() => setIsCreateUserOpen(true)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Force Create Account
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-gray-900">{user.name ?? "(no name)"}</h3>
                          {user.isAdmin && (
                            <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">
                              Admin
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-xs text-gray-500">
                            Created: {user.created_on}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAdminRoleAction(user.id)}
                          disabled={user.isAdmin && currentUserId != null && String(currentUserId) === String(user.id)}
                        >
                          <Shield className="w-4 h-4 mr-1" />
                          {user.isAdmin && currentUserId != null && String(currentUserId) === String(user.id)
                            ? 'Cannot Remove Self'
                            : user.isAdmin
                              ? 'Remove Admin'
                              : 'Make Admin'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={user.isAdmin}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Management Tab */}
          <TabsContent value="content">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Page Content</CardTitle>
                    <CardDescription>Edit text content across the website</CardDescription>
                  </div>
                  <Button 
                    onClick={() => {
                      setEditingContent(pageContent);
                      setIsEditContentOpen(true);
                    }}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Content
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Landing Page - Hero Section</h3>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-lg font-semibold text-gray-900 mb-1">{pageContent.heroTitle}</p>
                      <p className="text-sm text-gray-600">{pageContent.heroSubtitle}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">About Section</h3>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-900">{pageContent.aboutText}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Features Section Title</h3>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-900">{pageContent.featuresTitle}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Image Management Tab */}
          <TabsContent value="images">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Calcura Images</CardTitle>
                    <CardDescription>Manage Calcura brand and app images used across the site</CardDescription>
                  </div>
                  <Button 
                    onClick={handleAddImage}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Image
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {siteImages.map((image) => (
                    <div key={image.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                      <img 
                        src={image.url} 
                        alt={image.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-medium text-gray-900 mb-1">{image.name}</h3>
                        <p className="text-sm text-gray-600 mb-3">{image.location}</p>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingImage(image);
                              setIsEditImageOpen(true);
                            }}
                            className="flex-1"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteImage(image.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Roles Management Tab */}
          <TabsContent value="roles">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Roles</CardTitle>
                    <CardDescription>Add and manage role identifiers</CardDescription>
                  </div>
                  <Button
                    onClick={handleAddRole}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Roles
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="roleId">Role ID</Label>
                      <Input
                        id="roleId"
                        placeholder="Integer value (e.g. 1)"
                        value={newRoleId}
                        onChange={(e) => setNewRoleId(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="roleName">Role Name</Label>
                      <Input
                        id="roleName"
                        placeholder="e.g. Administrator"
                        value={newRoleName}
                        onChange={(e) => setNewRoleName(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="rolePermissions">Role Permissions</Label>
                      <Input
                        id="rolePermissions"
                        placeholder="User, Admin, etc."
                        value={newRolePermissions}
                        onChange={(e) => setNewRolePermissions(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="roleDescription">Role Description</Label>
                      <Input
                        id="roleDescription"
                        placeholder="e.g. Can manage user access"
                        value={newRoleDescription}
                        onChange={(e) => setNewRoleDescription(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    {roles.length === 0 ? (
                      <p className="text-sm text-gray-600">No roles added yet.</p>
                    ) : (
                      roles.map((role) => (
                        <div key={role.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <span className="text-sm text-gray-700">Role ID: {role.id}</span>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <span className="block text-sm font-medium text-gray-900">{role.name}</span>
                              <span className="block text-xs text-gray-600">Permissions: {role.permissions || "None"}</span>
                              <span className="block text-xs text-gray-600">Description: {role.description || "None"}</span>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDeleteRole(role.id, role.name)}
                              disabled={role.id === "5" || role.name.toLowerCase() === "admin"}
                              title={role.id === "5" || role.name.toLowerCase() === "admin" ? "Admin role cannot be deleted" : "Delete role"}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Create User Dialog */}
      <Dialog open={isCreateUserOpen} onOpenChange={setIsCreateUserOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Force Create User Account</DialogTitle>
            <DialogDescription>
              Create a new user account with admin privileges
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="userName">Full Name *</Label>
              <Input
                id="userName"
                placeholder="John Doe"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="userEmail">Email Address *</Label>
              <Input
                id="userEmail"
                type="email"
                placeholder="john@example.com"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="userPassword">Password *</Label>
              <Input
                id="userPassword"
                type="password"
                placeholder="Enter password"
                value={newUserPassword}
                onChange={(e) => setNewUserPassword(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="accountType">Account Type *</Label>
              <select
                id="accountType"
                value={newUserAccountType}
                onChange={(e) => setNewUserAccountType(e.target.value as "Youth" | "Career" | "Retirement")}
                className="mt-1 w-full h-10 px-3 rounded-md border border-gray-300 bg-white"
              >
                <option value="Youth">Youth</option>
                <option value="Career">Career</option>
                <option value="Retirement">Retirement</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateUserOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateUser}
              className="bg-green-600 hover:bg-green-700"
            >
              Create Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Content Dialog */}
      <Dialog open={isEditContentOpen} onOpenChange={setIsEditContentOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Page Content</DialogTitle>
            <DialogDescription>
              Update text content that appears on the website
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
            <div>
              <Label htmlFor="heroTitle">Hero Title</Label>
              <Input
                id="heroTitle"
                value={editingContent.heroTitle}
                onChange={(e) => setEditingContent({...editingContent, heroTitle: e.target.value})}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
              <Input
                id="heroSubtitle"
                value={editingContent.heroSubtitle}
                onChange={(e) => setEditingContent({...editingContent, heroSubtitle: e.target.value})}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="aboutText">About Text</Label>
              <Textarea
                id="aboutText"
                value={editingContent.aboutText}
                onChange={(e) => setEditingContent({...editingContent, aboutText: e.target.value})}
                className="mt-1"
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="featuresTitle">Features Section Title</Label>
              <Input
                id="featuresTitle"
                value={editingContent.featuresTitle}
                onChange={(e) => setEditingContent({...editingContent, featuresTitle: e.target.value})}
                className="mt-1"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditContentOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSaveContent}
              className="bg-green-600 hover:bg-green-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Image Dialog */}
      <Dialog open={isEditImageOpen} onOpenChange={setIsEditImageOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Image</DialogTitle>
            <DialogDescription>
              Update image details and URL
            </DialogDescription>
          </DialogHeader>
          
          {editingImage && (
            <div className="space-y-4 py-4">
              <div>
                <img 
                  src={editingImage.url} 
                  alt={editingImage.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>

              <div>
                <Label htmlFor="imageName">Image Name</Label>
                <Input
                  id="imageName"
                  value={editingImage.name}
                  onChange={(e) => setEditingImage({...editingImage, name: e.target.value})}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="imageLocation">Location/Section</Label>
                <Input
                  id="imageLocation"
                  value={editingImage.location}
                  onChange={(e) => setEditingImage({...editingImage, location: e.target.value})}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  value={editingImage.url}
                  onChange={(e) => setEditingImage({...editingImage, url: e.target.value})}
                  className="mt-1"
                  placeholder="https://..."
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsEditImageOpen(false);
              setEditingImage(null);
            }}>
              Cancel
            </Button>
            <Button 
              onClick={handleSaveImage}
              className="bg-green-600 hover:bg-green-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}