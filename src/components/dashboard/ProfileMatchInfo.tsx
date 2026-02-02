import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  MapPin,
  Briefcase,
  GraduationCap,
  Loader2,
} from "lucide-react";
import FullImageViewer from "@/components/common/FullImageViewer";

const maritalStatusMap: { [key: string]: string } = {
  UNMARRIED: "Unmarried",
  WIDOW_WIDOWER: "Widow / Widower",
  DIVORCED: "Divorced",
  SEPARATED: "Separated",
  DOESNT_MATTER: "Doesn't Matter",
};

interface ProfileMatchInfoProps {
  matchId: number;
}

const ProfileMatchInfo = ({ matchId }: ProfileMatchInfoProps) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isImageOpen, setIsImageOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) {
        console.error("Token not found in sessionStorage");
        setLoading(false);
        return;
      }

      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL;
        const res = await fetch(`${baseUrl}/api/profiles/${matchId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (res.ok && data.payload) {
          const p = data.payload;
          setUser({
            firstName: p.firstName,
            lastName: p.lastName,
            username: p.username,
            city: p.locationResponse?.city,
            state: p.locationResponse?.state,
            occupation: p.educationOccupationDetailsResponse?.occupation,
            highestEducation:
              p.educationOccupationDetailsResponse?.highestEducation,
            religion: p.religion,
            caste: p.caste,
            about: p.about,
            heightIn: p.heightIn,
            dateOfBirth: p.dateOfBirth,
            maritalStatus: p.maritalStatus,
            motherTongue: p.motherTongue,
          });
          await fetchProfileImage(token);
        } else {
          console.error("Failed to fetch profile:", data.message);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchProfileImage = async (token: string) => {
      try {
        const imgRes = await fetch(
          `${import.meta.env.VITE_API_BASE_URL.replace("9096", "9099")}/api/images/getProfileImageById?profileId=${matchId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!imgRes.ok) throw new Error("Failed to load profile image");

        const blob = await imgRes.blob();
        const imgUrl = URL.createObjectURL(blob);
        setProfileImage(imgUrl);
      } catch (error) {
        console.error("Error fetching profile image:", error);
      }
    };

    fetchProfile();
  }, [matchId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center text-muted-foreground py-10">
        Failed to load profile.
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Profile Information */}
      <Card className="border-0 shadow-large">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Profile Picture */}
            <div className="flex flex-col items-center gap-4">
              <div
                className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-primary bg-gray-100 cursor-pointer hover:opacity-90 transition"
                onClick={() => profileImage && setIsImageOpen(true)}
              >
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Avatar className="w-full h-full">
                    <AvatarFallback className="text-4xl bg-gradient-primary text-primary-foreground">
                      {user.firstName?.[0]}
                      {user.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>

              {/* Full Image Viewer (circle mode) */}
              <FullImageViewer
                imageUrl={profileImage}
                open={isImageOpen}
                onOpenChange={setIsImageOpen}
                shape="circle"
              />
            </div>

            {/* Profile Details */}
            <div className="flex-1 space-y-6">
              <div>
                <h2 className="text-3xl font-bold">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-lg text-muted-foreground">
                  Profile ID: {user.username}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">
                      {user.city}, {user.state}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Occupation</p>
                    <p className="font-medium">{user.occupation}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Education</p>
                    <p className="font-medium">{user.highestEducation}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-bold text-primary">🕉</span>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Religion</p>
                    <p className="font-medium">
                      {user.religion}, {user.caste}
                    </p>
                  </div>
                </div>
              </div>

              {user.about && (
                <div className="pt-4 border-t">
                  <h3 className="font-semibold mb-2">About Me</h3>
                  <p className="text-muted-foreground">{user.about}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Card className="border-0 shadow-soft hover:shadow-medium transition-smooth">
          <CardContent className="pt-4 md:pt-6">
            <div className="text-center">
              <p className="text-xl md:text-2xl font-bold text-primary">
                {user.heightIn}
              </p>
              <p className="text-xs md:text-sm text-muted-foreground">Height</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-soft hover:shadow-medium transition-smooth">
          <CardContent className="pt-4 md:pt-6">
            <div className="text-center">
              <p className="text-xl md:text-2xl font-bold text-primary">
                {new Date().getFullYear() -
                  new Date(user.dateOfBirth).getFullYear()}
              </p>
              <p className="text-xs md:text-sm text-muted-foreground">Age</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-soft hover:shadow-medium transition-smooth">
          <CardContent className="pt-4 md:pt-6">
            <div className="text-center">
              <p className="text-lg md:text-xl font-bold text-primary truncate px-2">
                {maritalStatusMap[user.maritalStatus] || user.maritalStatus}
              </p>
              <p className="text-xs md:text-sm text-muted-foreground">
                Status
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-soft hover:shadow-medium transition-smooth">
          <CardContent className="pt-4 md:pt-6">
            <div className="text-center">
              <p className="text-lg md:text-xl font-bold text-primary truncate px-2">
                {user.motherTongue}
              </p>
              <p className="text-xs md:text-sm text-muted-foreground">
                Language
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileMatchInfo;
