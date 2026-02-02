import { Heart, Settings, HelpCircle, LogOut, User, Shield, Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

// Helper function to get user info from token
function getUserFromToken() {
  const token = sessionStorage.getItem("token");
  if (!token) {
    return { firstName: "User", lastName: "", email: "user@gmail.com", profilePhoto: "" };
  }

  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    const nameParts = decoded.name ? decoded.name.trim().split(" ") : ["User"];
    return {
      firstName: nameParts[0] || "User",
      lastName: nameParts.slice(1).join(" ") || "",
      email: decoded.email || "user@gmail.com",
      profilePhoto: "", // will be set after fetching from API
    };
  } catch (error) {
    console.error("Failed to parse token:", error);
    return { firstName: "User", lastName: "", email: "user@gmail.com", profilePhoto: "" };
  }
}

interface NavbarProps {
  onMobileMenuToggle?: () => void;
}

const Navbar = ({ onMobileMenuToggle }: NavbarProps) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(getUserFromToken());

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) return;

    const fetchProfileImage = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL;
const response = await fetch(`${baseUrl}/api/images/getLoggedUserProfileImage`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});


        if (!response.ok) {
          console.warn("Profile image not found, using fallback.");
          return;
        }

        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setUser((prev) => ({ ...prev, profilePhoto: imageUrl }));
      } catch (error) {
        console.error("Error fetching profile image:", error);
      }
    };

    fetchProfileImage();
  }, []);

  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    sessionStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-card border-b border-border shadow-soft z-50">
      <div className="h-full px-4 lg:px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onMobileMenuToggle}
          >
            <Menu className="h-5 w-5" />
          </Button>
          {/* <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
            <Heart className="w-5 h-5 text-primary-foreground fill-current" />
          </div> */}
          <h1 className="text-lg lg:text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Brahmin Matrimony
          </h1>
        </div>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-3 hover:bg-muted rounded-lg p-2 transition-smooth">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <Avatar className="w-10 h-10 border-2 border-primary">
              {user.profilePhoto ? (
                <AvatarImage src={user.profilePhoto} alt={user.firstName} />
              ) : (
                <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                  {user.firstName[0]}{user.lastName[0]}
                </AvatarFallback>
              )}
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
              Profile Actions
            </DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigate("/dashboard?section=profile-info")}>
              <User className="mr-2 h-4 w-4" />
              <span>Edit Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/dashboard?section=partner-preference")}>
              <Heart className="mr-2 h-4 w-4" />
              <span>Edit Preference</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
              Settings
            </DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigate("/dashboard?section=account-settings")}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Account Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/dashboard?section=communication-settings")}>
              <Bell className="mr-2 h-4 w-4" />
              <span>Communication Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/dashboard?section=privacy-settings")}>
              <Shield className="mr-2 h-4 w-4" />
              <span>Privacy Settings</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
              Help
            </DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigate("/dashboard?section=help-center")}>
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>24×5 Help Center</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/dashboard?section=faqs")}>
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>FAQs</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/dashboard?section=success-stories")}>
              <Heart className="mr-2 h-4 w-4" />
              <span>Success Stories</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navbar;
