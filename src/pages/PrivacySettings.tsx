import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Edit, Save, Lock } from "lucide-react";

const PrivacySettings = () => {
  // Default fallback so UI remains usable when auth is missing or server has no record (404)
  const defaultSettings = {
    profileVisibility: "all",
    showLastActive: true,
    showPhotosTo: "matches",
    showContactTo: "premium",
    allowSearch: true,
    hideProfile: false,
  };

  const [settings, setSettings] = useState(defaultSettings);

  // Edit mode states
  const [editProfile, setEditProfile] = useState(false);
  const [editPhotos, setEditPhotos] = useState(false);
  const [editContact, setEditContact] = useState(false);

  // Loading & error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Saving state for buttons
  const [saving, setSaving] = useState(false);

  // Utility: convert camelCase to Title Case for toast messages
  const toTitleCase = (str: string) => {
    const result = str.replace(/([A-Z])/g, " $1").trim();
    return result
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Fetch current user's privacy settings from API
  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      const token = sessionStorage.getItem("token");
      if (!token) {
        // No token: fallback to defaults (render UI with defaults so user can edit)
        setSettings(defaultSettings);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/privacy-settings`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // If 404 -> treat as "no settings yet" and use defaults
        if (!res.ok) {
          if (res.status === 404) {
            setSettings(defaultSettings);
            setLoading(false);
            return;
          }
          throw new Error("Failed to fetch privacy settings");
        }

        const data = await res.json();
        // If payload missing treat as default
        setSettings(data?.payload || defaultSettings);
      } catch (err: any) {
        console.error(err);
        // keep UI usable by falling back to defaults; also set an error message in case callers want it
        setSettings(defaultSettings);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Save settings to backend
  const handleSave = async (updated: typeof settings = settings, field: string) => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      // No auth — inform user, keep local state (defaults or edits) intact
      toast({ title: "Authentication", description: "Token not found. Please login to save changes.", variant: "destructive" });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/privacy-settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updated),
      });

      if (!res.ok) throw new Error("Failed to update settings");

      const data = await res.json();
      setSettings(data.payload); // update local state
      toast({
        title: "Settings saved",
        description: `${toTitleCase(field)} updated successfully.`,
      });
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Error",
        description: err.message || "Failed to save settings.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Toggle switch handler
  const handleToggle = async (key: keyof typeof settings, checked: boolean, editable: boolean) => {
    if (!editable) return; // prevent toggling if not in edit mode

    const updatedSettings = { ...settings, [key]: checked };
    setSettings(updatedSettings);

    if (key === "hideProfile") {
      await handleSave(updatedSettings, key);
    } else {
      // For other toggles, save immediately
      await handleSave(updatedSettings, key);
    }
  };

  if (loading) return <div className="text-center py-10">Loading privacy settings...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <Card className="border-0 shadow-medium">
        <CardHeader className="pb-4">
          <div>
            <CardTitle className="text-2xl md:text-3xl">Privacy Settings</CardTitle>
            <p className="text-muted-foreground mt-1">Control who can see your information</p>
          </div>
        </CardHeader>
      </Card>

      {/* Profile Visibility */}
      <Card className="border-0 shadow-medium">
        <CardHeader className="flex flex-row justify-between items-center">
          <div>
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" />
              <CardTitle>Profile Visibility</CardTitle>
            </div>
            <CardDescription>Control who can view your profile</CardDescription>
          </div>
          {!editProfile ? (
            <Button onClick={() => setEditProfile(true)} className="bg-gradient-primary text-white">
              <Edit className="w-4 h-4 mr-2" /> Edit
            </Button>
          ) : (
            <Button
              onClick={() => {
                setEditProfile(false);
                handleSave(undefined, "Profile Visibility");
              }}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {saving ? (
                <span className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full inline-block"></span>
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Who can see my profile?</Label>
            <Select
              disabled={!editProfile}
              value={settings.profileVisibility}
              onValueChange={(value) => setSettings({ ...settings, profileVisibility: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Members</SelectItem>
                <SelectItem value="matches">My Matches Only</SelectItem>
                <SelectItem value="premium">Premium Members Only</SelectItem>
                <SelectItem value="none">No One (Hidden)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="last-active">Show Last Active</Label>
              <p className="text-sm text-muted-foreground">Let others see when you were last online</p>
            </div>
            <Switch
              id="last-active"
              checked={settings.showLastActive}
              disabled={!editProfile}
              onCheckedChange={(checked) => handleToggle("showLastActive", checked, editProfile)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="allow-search">Allow Search</Label>
              <p className="text-sm text-muted-foreground">Let others find your profile in search results</p>
            </div>
            <Switch
              id="allow-search"
              checked={settings.allowSearch}
              disabled={!editProfile}
              onCheckedChange={(checked) => handleToggle("allowSearch", checked, editProfile)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Photo Privacy */}
      <Card className="border-0 shadow-medium">
        <CardHeader className="flex flex-row justify-between items-center">
          <div>
            <CardTitle>Photo Privacy</CardTitle>
            <CardDescription>Manage who can see your photos</CardDescription>
          </div>
          {!editPhotos ? (
            <Button onClick={() => setEditPhotos(true)} className="bg-gradient-primary text-white">
              <Edit className="w-4 h-4 mr-2" /> Edit
            </Button>
          ) : (
            <Button
              onClick={() => {
                setEditPhotos(false);
                handleSave(undefined, "Photo Privacy");
              }}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {saving ? (
                <span className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full inline-block"></span>
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-2">
          <Label>Show my photos to</Label>
          <Select
            disabled={!editPhotos}
            value={settings.showPhotosTo}
            onValueChange={(value) => setSettings({ ...settings, showPhotosTo: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Everyone</SelectItem>
              <SelectItem value="matches">My Matches Only</SelectItem>
              <SelectItem value="premium">Premium Members</SelectItem>
              <SelectItem value="accepted">Accepted Requests Only</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="border-0 shadow-medium">
        <CardHeader className="flex flex-row justify-between items-center">
          <div>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>Control access to your contact details</CardDescription>
          </div>
          {!editContact ? (
            <Button onClick={() => setEditContact(true)} className="bg-gradient-primary text-white">
              <Edit className="w-4 h-4 mr-2" /> Edit
            </Button>
          ) : (
            <Button
              onClick={() => {
                setEditContact(false);
                handleSave(undefined, "Contact Information");
              }}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {saving ? (
                <span className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full inline-block"></span>
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-2">
          <Label>Show contact details to</Label>
          <Select
            disabled={!editContact}
            value={settings.showContactTo}
            onValueChange={(value) => setSettings({ ...settings, showContactTo: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Everyone</SelectItem>
              <SelectItem value="matches">My Matches</SelectItem>
              <SelectItem value="premium">Premium Members</SelectItem>
              <SelectItem value="accepted">Accepted Requests</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Hide Profile */}
      <Card className="border-0 shadow-medium bg-muted/50">
        <CardHeader>
          <CardTitle>Hide Profile Temporarily</CardTitle>
          <CardDescription>Your profile will be hidden from all searches and matches</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="hide-profile">Hide My Profile</Label>
              <p className="text-sm text-muted-foreground">Temporarily make your profile invisible</p>
            </div>
            <Switch
              id="hide-profile"
              checked={settings.hideProfile}
              onCheckedChange={(checked) => handleToggle("hideProfile", checked, true)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacySettings;
