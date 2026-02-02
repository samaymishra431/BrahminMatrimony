import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Edit, Save, Loader2, Eye, EyeOff } from "lucide-react";

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Decode JWT token to extract username/email
function getUserFromToken() {
  const token = sessionStorage.getItem("token");
  if (!token) {
    return { email: "user@gmail.com", username: "user" };
  }

  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    return {
      email: decoded.email || "user@gmail.com",
      username: decoded.username || decoded.email?.split("@")[0] || "user",
    };
  } catch (error) {
    console.error("Failed to parse token:", error);
    return { email: "user@gmail.com", username: "user" };
  }
}

const AccountSettings = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    email: "",
    username: "",
  });

  const [editCredentials, setEditCredentials] = useState(false);
  const [editPassword, setEditPassword] = useState(false);
  const [saving, setSaving] = useState(false);

  // Password visibility state
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Fetch user info from token
  useEffect(() => {
    const user = getUserFromToken();
    setFormData((prev) => ({
      ...prev,
      email: user.email,
      username: user.username,
    }));
  }, []);

  // Save Login Credentials
  const handleSaveCredentials = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setSaving(true);
    const user = getUserFromToken();

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/update-credentials`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          oldUsername: user.username,
          newUsername: formData.username,
          newEmail: formData.email,
        }),
      });

      const data = await response.json(); // ResponseEntity

      if (data.statusCode === 200) {
        toast({
          title: "Profile Updated",
          description: data.message || "Your login credentials have been updated successfully. Please login again.",
        });
        setEditCredentials(false);
        sessionStorage.removeItem("token");
        navigate("/login");
      } else {
        toast({
          title: "Update Failed",
          description: data.message || "Failed to update credentials.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong while updating credentials.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  // Save Password with validation
  const handleSavePassword = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const user = getUserFromToken();

    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirm password do not match.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.currentPassword || !formData.newPassword) {
      toast({
        title: "Missing Fields",
        description: "Please fill all password fields.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);

    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/users/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${token}`,
        },
        body: new URLSearchParams({
          username: user.username,
          oldPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      const data = await response.json(); // ResponseEntity

      if (data.statusCode === 200) {
        toast({
          title: "Password Changed",
          description: data.message || "Your password has been changed successfully. Please login again.",
        });
        setEditPassword(false);
        setFormData((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
        sessionStorage.removeItem("token");
        navigate("/login");
      } else {
        toast({
          title: "Password Change Failed",
          description: data.message || "Failed to change password.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong while changing the password.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const renderPasswordInput = (id, value, onChange, showPassword, setShowPassword, placeholder, autoComplete) => (
    <div className="relative">
      <Input
        id={id}
        type={showPassword ? "text" : "password"}
        disabled={!editPassword}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
      >
        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <Card className="border-0 shadow-medium">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl md:text-3xl">
            Account Settings
          </CardTitle>
          <p className="text-muted-foreground mt-1">
            Manage your account security and preferences
          </p>
        </CardHeader>
      </Card>

      {/* Login Credentials Section */}
      <form onSubmit={handleSaveCredentials}>
        <Card className="border-0 shadow-medium">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Login Credentials</CardTitle>
              <CardDescription>Update your email and username</CardDescription>
            </div>
            {!editCredentials ? (
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setEditCredentials(true);
                }}
                className="bg-gradient-primary"
              >
                <Edit className="w-4 h-4 mr-2" /> Edit
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={saving}
                className="bg-green-600 hover:bg-green-700"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save
              </Button>
            )}
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                disabled={!editCredentials}
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                disabled={!editCredentials}
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
              />
            </div>
          </CardContent>
        </Card>
      </form>

      {/* Change Password Section */}
      <form onSubmit={handleSavePassword}>
        <Card className="border-0 shadow-medium">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Keep your account secure</CardDescription>
            </div>
            {!editPassword ? (
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setEditPassword(true);
                }}
                className="bg-gradient-primary"
              >
                <Edit className="w-4 h-4 mr-2" /> Edit
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={saving}
                className="bg-green-600 hover:bg-green-700"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save
              </Button>
            )}
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Hidden username field for accessibility and password managers */}
            <input
              type="text"
              autoComplete="username"
              value={formData.username}
              readOnly
              className="hidden"
            />
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              {renderPasswordInput(
                "currentPassword",
                formData.currentPassword,
                (e) => setFormData({ ...formData, currentPassword: e.target.value }),
                showCurrentPassword,
                setShowCurrentPassword,
                "Enter current password",
                "current-password"
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              {renderPasswordInput(
                "newPassword",
                formData.newPassword,
                (e) => setFormData({ ...formData, newPassword: e.target.value }),
                showNewPassword,
                setShowNewPassword,
                "Enter new password",
                "new-password"
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              {renderPasswordInput(
                "confirmPassword",
                formData.confirmPassword,
                (e) => setFormData({ ...formData, confirmPassword: e.target.value }),
                showConfirmPassword,
                setShowConfirmPassword,
                "Confirm new password",
                "new-password"
              )}
              {editPassword &&
                formData.newPassword &&
                formData.confirmPassword &&
                formData.newPassword !== formData.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    New password and confirm password do not match.
                  </p>
                )}
            </div>
          </CardContent>
        </Card>
      </form>

      {/* Danger Zone */}
      <Card className="border-0 shadow-medium bg-destructive/5 border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>
            Permanent actions that cannot be undone
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="font-semibold">Delete Account</p>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all data
              </p>
            </div>
            <Button variant="destructive" size="sm">
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountSettings;
