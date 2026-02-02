import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User } from "@/types/user";

import {
  Users,
  Heart,
  MessageSquare,
  X,
  Loader2,
  MapPin,
  AlertCircle,
  Star,
  SearchX,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ProfileModal from "./ProfileModal"; // added import
import SponsoredAdsCarousel from "../common/SponsoredAdCard";
import { SubscriptionModal } from "@/components/common/SubscriptionModal";

interface HomeProps {
  user: User;
  onSectionChange: (section: string) => void;
}

const MARITAL_STATUS_OPTIONS = [
  { label: "Unmarried", value: "UNMARRIED" },
  { label: "Widow / Widower", value: "WIDOW_WIDOWER" },
  { label: "Divorced", value: "DIVORCED" },
  { label: "Separated", value: "SEPARATED" },
  { label: "Doesn't Matter", value: "DOESNT_MATTER" }
];

const ProfileCard = ({ 
  profile, 
  connectionInfo, 
  onConnect, 
  onAccept, 
  onReject, 
  onSkip, 
  onChat, 
  onViewProfile, 
  formatEnumValue, 
  token, 
  baseUrl 
}: any) => {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [loadingImage, setLoadingImage] = useState<boolean>(true);
  const [details, setDetails] = useState({
    location: profile.location,
    occupation: profile.occupation
  });

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      // Fetch Image
      try {
        const imgResponse = await fetch(
          `${baseUrl.replace("9096", "9099")}/api/images/getProfileImageById?profileId=${profile.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (imgResponse.ok && isMounted) {
          const blob = await imgResponse.blob();
          setImageUrl(URL.createObjectURL(blob));
        }
      } catch (error) {
        console.error("Error loading profile image", error);
      } finally {
        if (isMounted) setLoadingImage(false);
      }

      // Fetch Details
      try {
        const detailsResponse = await fetch(
          `${baseUrl.replace("9096", "9099")}/api/profiles/getLocationAndOccupation/${profile.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (detailsResponse.ok && isMounted) {
          const detailsData = await detailsResponse.json();
          if (detailsData?.payload) {
            const { city, country, occupation: occ } = detailsData.payload;
            let loc = details.location;
            if (city) loc = city;
            if (country) loc = loc && loc !== "N/A" ? `${loc}, ${country}` : country;
            
            setDetails({
              location: loc || "N/A",
              occupation: occ || details.occupation
            });
          }
        }
      } catch (error) {
        console.error("Error loading profile details", error);
      }
    };

    loadData();
    return () => { isMounted = false; };
  }, [profile.id, token, baseUrl]);

  const status = connectionInfo?.state || "none";

  return (
    <Card
      className="border-0 shadow-medium hover:shadow-large transition-smooth cursor-pointer overflow-hidden"
      onClick={() => onViewProfile(profile.id)}
    >
      <div className="relative aspect-[8/9] w-full">
        {loadingImage ? (
           <div className="w-full h-full bg-gray-200 animate-pulse" />
        ) : imageUrl ? (
          <img src={imageUrl} alt={profile.name} className="object-cover w-full h-full" />
        ) : (
          <div className="w-full h-full bg-pink-50 flex items-center justify-center">
            <Users className="w-16 h-16 text-pink-300" />
          </div>
        )}
        
        {/* Marital Status Badge */}
        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs font-semibold px-2 py-1 rounded-full backdrop-blur-sm">
            {formatEnumValue(profile.maritalStatus)}
        </div>
        {/* Details Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-3 bg-gradient-to-t from-black/80 to-transparent text-white">
            <div className="flex items-baseline gap-2">
                <CardTitle className="text-xl">{profile.name}, {profile.age}</CardTitle>
            </div>
            <p className="text-base text-white/90">{details.occupation}</p>
            <div className="flex flex-col gap-1 mt-1 items-start">
                <div className="flex items-center gap-2">
                <div className="p-1.5 bg-white/20 rounded-full backdrop-blur-sm">
                    <MapPin className="w-3 h-3 text-white" />
                </div>
                <span className="text-base text-white/90">{details.location}</span>
                </div>
            </div>
            {/* Action Buttons */}
            <div
                className="flex gap-2 mt-3"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Skip Button */}
                {status !== "accepted" && status !== "pending" && (
                <Button
                    variant="outline"
                    size="sm"
                    className={`flex-1 bg-white/20 hover:bg-white/30 border-none text-white backdrop-blur-sm ${status === "received" ? "hidden sm:flex" : "flex"}`}
                    onClick={() => onSkip(profile.id)}
                >
                    <X className="w-4 h-4 mr-1" /> Skip
                </Button>
                )}

                {/* Chat */}
                {status === "accepted" && (
                <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-white/20 hover:bg-white/30 border-none text-white backdrop-blur-sm"
                    onClick={onChat}
                >
                    <MessageSquare className="w-4 h-4 mr-1" /> Chat
                </Button>
                )}

                {/* Dynamic Buttons */}
                {status === "none" && (
                <Button
                    size="sm"
                    className="flex-1 bg-gradient-primary"
                    onClick={() => onConnect(profile.id)}
                >
                    Connect
                </Button>
                )}

                {status === "pending" && (
                <Button size="sm" className="flex-1" disabled>
                    Pending…
                </Button>
                )}

                {status === "received" && (
                <>
                    <Button
                    size="sm"
                    className="flex-1 bg-red-500 text-white hover:bg-red-600"
                    onClick={() => onReject(connectionInfo?.requestId, profile.id)}
                    >
                    Reject
                    </Button>
                    <Button
                    size="sm"
                    className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
                    onClick={() => onAccept(connectionInfo?.requestId, profile.id)}
                    >
                    Accept
                    </Button>
                </>
                )}

                {status === "accepted" && (
                <Button
                    size="sm"
                    className="flex-1 bg-green-600 text-white"
                    disabled
                >
                    Connected
                </Button>
                )}

                {status === "rejected" && (
                <Button size="sm" className="flex-1" disabled>
                    Rejected
                </Button>
                )}

                {status === "withdrawn" && (
                <Button
                    size="sm"
                    className="flex-1 bg-gray-400 text-white"
                    disabled
                >
                    Withdrawn
                </Button>
                )}
            </div>
        </div>
      </div>
    </Card>
  );
};

const Home = ({ user, onSectionChange }: HomeProps) => {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [skippedProfiles, setSkippedProfiles] = useState<number[]>([]);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [profileCompletion, setProfileCompletion] = useState<{
    incomplete: boolean;
    message: string;
    percentage: number;
  }>({ incomplete: false, message: "", percentage: 0 });

  type RequestState = "none" | "pending" | "accepted" | "rejected" | "withdrawn" | "received";

  // DYNAMIC STATUS: none, pending, accepted, rejected, withdrawn, received
  const [connectStatus, setConnectStatus] = useState<Record<number, { state: RequestState; requestId?: number }>>({});

  const [filter, setFilter] = useState<
    "all" | "none" | "pending" | "received" | "accepted" | "rejected" | "withdrawn"
  >("all");

  const initialName =
    user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.firstName || (user as any).name || "User";

  const [displayName, setDisplayName] = useState(initialName);

  const token = sessionStorage.getItem("token");
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  // subscription states
  const [hasActiveSubscription, setHasActiveSubscription] = useState<boolean>(false);
  const [subscriptionChecked, setSubscriptionChecked] = useState<boolean>(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState<boolean>(false);

  const checkSubscription = async (): Promise<boolean> => {
    if (!token) {
      setSubscriptionChecked(true);
      setHasActiveSubscription(false);
      return false;
    }
    try {
      const res = await fetch(`${baseUrl.replace("9096", "9099")}/api/subscriptions/hasActiveSubscription`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      const active = Boolean(data?.payload);
      setHasActiveSubscription(active);
      setSubscriptionChecked(true);
      return active;
    } catch (error) {
      console.error("Error checking subscription:", error);
      setHasActiveSubscription(false);
      setSubscriptionChecked(true);
      return false;
    }
  };

  const formatEnumValue = (value: string | undefined | null): string => {
    if (!value || value === "N/A") return "N/A";
    const option = MARITAL_STATUS_OPTIONS.find((opt) => opt.value === value);
    return option ? option.label : value.charAt(0).toUpperCase() + value.slice(1).toLowerCase().replace(/_/g, " ");
  };

  const getNameFromToken = () => {
    const token = sessionStorage.getItem("token");
    if (!token) return null;
    try {
      const payload = token.split(".")[1];
      const decoded = JSON.parse(atob(payload));

      if (decoded.name) return decoded.name;

      const first = decoded.firstName || null;
      const last = decoded.lastName || "";
      if (first) return last ? `${first} ${last}` : first;

      return null;
    } catch (error) {
      console.error("Failed to parse token for name:", error);
      return null;
    }
  };

  const processMatches = (matches: any[]) => {
    return matches.map((m: any) => {
      const p = m.profile;
      // Initial values
      let location = p.location?.city || "N/A";
      let occupation = p.educationOccupationDetails?.occupation || "N/A";

        return {
          id: p.id,
          name: `${p.firstName} ${p.lastName}`,
          age:
            p.dateOfBirth !== ""
              ? new Date().getFullYear() -
                new Date(p.dateOfBirth).getFullYear()
              : "N/A",
          location: location,
          education:
            p.educationOccupationDetails?.highestEducation || "N/A",
          occupation: occupation,
          avatar: "", // Will be loaded by ProfileCard
          height: p.heightIn || "N/A",
          maritalStatus: p.maritalStatus || "N/A",
        };
    });
  };

  // ------------------------------------------------
  // FETCH DASHBOARD SUGGESTIONS
  // ------------------------------------------------
  const fetchProfiles = async () => {
    if (!token) {
      console.error("Token missing");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${baseUrl}/api/suggestions/profiles?page=0&size=6`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data?.payload?.profileComplete === false) {
        setProfileCompletion({
          incomplete: true,
          message: data.payload.message,
          percentage: data.payload.completionPercentage,
        });
        setProfiles([]);
        setLoading(false);
        return;
      }

      const matches = data?.payload?.suggestedMatches || [];
      const formattedProfiles = processMatches(matches);

      setProfiles(formattedProfiles);
    } catch (error) {
      console.error("Error fetching dashboard:", error);
    }

    setLoading(false);
  };

  // ----------------------------------------------------
  // FETCH CONNECTION STATUS (sent + received)
  // ----------------------------------------------------
  const fetchConnectionStatus = async () => {
    if (!token) return;

    try {
      const res = await fetch(
        `${baseUrl.replace("9096", "9099")}/api/connections/sentByMe`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      const sent = data?.payload?.sent || [];
      const received = data?.payload?.received || [];

      const statusMap: Record<number, { state: RequestState; requestId?: number }> = {};

      // Requests sent BY ME
      sent.forEach((req: any) => {
        switch (req.status) {
          case "PENDING":
            statusMap[req.receiverId] = { state: "pending" };
            break;
          case "ACCEPTED":
            statusMap[req.receiverId] = { state: "accepted" };
            break;
          case "REJECTED":
            statusMap[req.receiverId] = { state: "rejected" };
            break;
          case "WITHDRAWN":
            statusMap[req.receiverId] = { state: "withdrawn" };
            break;
          default:
            statusMap[req.receiverId] = { state: "none" };
        }
      });

      // Requests received BY ME
      received.forEach((req: any) => {
        if (req.status === "PENDING") {
          statusMap[req.senderId] = { state: "received", requestId: req.id };
        } else if (req.status === "ACCEPTED") {
          statusMap[req.senderId] = { state: "accepted" };
        } else if (req.status === "REJECTED") {
          statusMap[req.senderId] = { state: "rejected" };
        }
      });

      setConnectStatus(statusMap);
    } catch (error) {
      console.error("Error fetching connection status", error);
    }
  };

  // ----------------------------------------------------
  // SEND CONNECT REQUEST
  // ----------------------------------------------------
  const handleConnect = async (receiverId: number) => {
    if (!token) return;

    const active = subscriptionChecked ? hasActiveSubscription : await checkSubscription();
    if (!active) {
      setShowSubscriptionModal(true);
      return;
    }

    try {
      const res = await fetch(
        `${baseUrl.replace("9096", "9099")}/api/connections/send/${receiverId}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();

      if (res.ok) {
        setConnectStatus((prev) => ({
          ...prev,
          [receiverId]: { state: "pending" },
        }));
        fetchConnectionStatus();
      } else {
        console.error("Request failed:", data);
      }
    } catch (error) {
      console.error("Error sending connection:", error);
    }
  };

  // ----------------------------------------------------
  // ACCEPT RECEIVED REQUEST
  // ----------------------------------------------------
  const handleAccept = async (requestId: number | undefined, senderId: number) => {
    if (!token || requestId === undefined) return;

    const active = subscriptionChecked ? hasActiveSubscription : await checkSubscription();
    if (!active) {
      setShowSubscriptionModal(true);
      return;
    }

    try {
      const res = await fetch(
        `${baseUrl.replace("9096", "9099")}/api/connections/accept/${requestId}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();

      if (res.ok) {
        setConnectStatus((prev) => ({
          ...prev,
          [senderId]: { state: "accepted" },
        }));
        fetchConnectionStatus();
      } else {
        console.error("Accept failed:", data);
      }
    } catch (error) {
      console.error("Error accepting request", error);
    }
  };

  // ----------------------------------------------------
  // REJECT RECEIVED REQUEST
  // ----------------------------------------------------
  const handleReject = async (requestId: number | undefined, senderId: number) => {
    if (!token || requestId === undefined) return;

    try {
      const res = await fetch(
        `${baseUrl.replace("9096", "9099")}/api/connections/reject/${requestId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
        setConnectStatus((prev) => ({
          ...prev,
          [senderId]: { state: "rejected" },
        }));

        fetchConnectionStatus();
      } else {
        console.error("Reject failed:", data.message);
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  // ----------------------------------------------------
  // FETCH UNREAD MESSAGES COUNT
  // ----------------------------------------------------
  const fetchUnreadMessageCount = async () => {
    if (!token) return;

    try {
      const res = await fetch(
        `${baseUrl.replace("9096", "9099")}/api/messages/unread/count`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();

      if (res.ok) {
        setUnreadMessages(data.payload);
      } else {
        console.error("Failed to fetch unread message count:", data);
      }
    } catch (error) {
      console.error("Error fetching unread message count:", error);
    }
  };

  // Modal state for viewing profile details (use profileId so the modal can fetch details)
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [selectedProfileId, setSelectedProfileId] = useState<number | null>(null);

  // ----------------------------------------------------
  // LOAD EVERYTHING
  // ----------------------------------------------------
  useEffect(() => {
    fetchProfiles();
    fetchConnectionStatus();
    fetchUnreadMessageCount();

    const name = getNameFromToken();
    if (name) setDisplayName(name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleViewProfile = (profileId: number) => {
    // open profile modal by id; ProfileModal can fetch full details using profileId
    setSelectedProfileId(profileId);
    setProfileModalOpen(true);
  };

  const handleChatClick = () => {
    navigate(`/dashboard?section=messages`);
  };

  const handleSkip = (profileId: number) => {
    setSkippedProfiles((prev) => [...prev, profileId]);
  };

  const filteredProfiles = profiles.filter((profile) => {
    if (skippedProfiles.includes(profile.id)) {
      return false;
    }
    const status = connectStatus[profile.id]?.state || "none";
    return filter === "all" || status === filter;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <Card className="border-0 shadow-medium bg-gradient-primary text-primary-foreground">
        <CardHeader>
          <CardTitle className="text-2xl">
            Welcome back, {displayName}!
          </CardTitle>
          <CardDescription className="text-primary-foreground/80">
            Find your perfect life partner today
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Modified: Matches card - click to Browse Matches */}
        <Card
          className="border-0 shadow-soft hover:shadow-medium transition-smooth cursor-pointer"
          role="button"
          tabIndex={0}
          onClick={() => onSectionChange("matches")}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onSectionChange("matches"); }}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Matches
              </CardTitle>
              <Heart className="w-4 h-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {profiles.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Compatible profiles
            </p>
          </CardContent>
        </Card>

        {/* Modified: Messages card - click to Send Message */}
        <Card
          className="border-0 shadow-soft hover:shadow-medium transition-smooth cursor-pointer"
          role="button"
          tabIndex={0}
          onClick={() => onSectionChange("messages")}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onSectionChange("messages"); }}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Messages
              </CardTitle>
              <MessageSquare className="w-4 h-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{unreadMessages}</div>
            <p className="text-xs text-muted-foreground">
              {unreadMessages > 0 ? `${unreadMessages} unread messages` : "No unread messages"}
            </p>
          </CardContent>
        </Card>
        
        <Card
          className="border-0 shadow-soft hover:shadow-medium transition-smooth cursor-pointer"
          role="button"
          tabIndex={0}
          onClick={() => {
            onSectionChange("matches");
            setFilter("received");
          }}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { onSectionChange("matches"); setFilter("received"); } }}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Received Requests
              </CardTitle>
              <Users className="w-4 h-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{Object.values(connectStatus).filter(s => s.state === 'received').length}</div>
            <p className="text-xs text-muted-foreground">Approve or decline requests</p>
          </CardContent>
        </Card>

        {/* Modified: Shortlisted card - click to Browse Matches */}
        <Card
          className="border-0 shadow-soft hover:shadow-medium transition-smooth cursor-pointer"
          role="button"
          tabIndex={0}
          onClick={() => onSectionChange("matches")}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onSectionChange("matches"); }}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Shortlisted
              </CardTitle>
              <Star className="w-4 h-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {profiles.filter((p) => connectStatus[p.id]?.state === "accepted").length}
            </div>
            <p className="text-xs text-muted-foreground">Profiles you connected</p>
          </CardContent>
        </Card>
      </div>


      {/* Sponsored Ads Carousel */}
      {!loading && <SponsoredAdsCarousel />}


      {/* Recent Matches Header */}
      <Card className="border-0 shadow-medium">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <CardTitle>Recent Matches</CardTitle>
            <CardDescription>Profiles that match your preferences</CardDescription>
          </div>
        </CardHeader>
      </Card>

      {/* Loader */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {/* Profiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {!loading && profileCompletion.incomplete && (
          <div className="col-span-full flex flex-col items-center justify-center p-8 text-center bg-muted/30 rounded-lg border-2 border-dashed">
            <div className="bg-yellow-100 p-3 rounded-full mb-4">
              <AlertCircle className="w-8 h-8 text-yellow-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Profile Incomplete</h3>
            <p className="text-muted-foreground max-w-md mb-6">
              {profileCompletion.message}
            </p>
            <div className="w-full max-w-xs bg-secondary rounded-full h-2.5 mb-2">
              <div
                className="bg-primary h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${profileCompletion.percentage}%` }}
              ></div>
            </div>
            <p className="text-sm text-muted-foreground mb-6">{profileCompletion.percentage}% Completed</p>
            <Button onClick={() => navigate("/dashboard?section=basic-info")}>
              Complete Profile
            </Button>
          </div>
        )}
        {!loading && !profileCompletion.incomplete && filteredProfiles.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center p-8 text-center bg-muted/30 rounded-lg border-2 border-dashed">
            <div className="bg-primary/10 p-3 rounded-full mb-4">
              <SearchX className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Matches Found</h3>
            <p className="text-muted-foreground max-w-md mb-6">
              No matches found according to your preference. Please change your preference to see more results.
            </p>
            <Button onClick={() => onSectionChange("partner-preference")}>Update Preferences</Button>
          </div>
        )}
        {!loading &&
          filteredProfiles.slice(0, 3).map((profile) => {
            const connectionInfo = connectStatus[profile.id];
            return (
              <ProfileCard
                key={profile.id}
                profile={profile}
                connectionInfo={connectionInfo}
                onConnect={handleConnect}
                onAccept={handleAccept}
                onReject={handleReject}
                onSkip={handleSkip}
                onChat={handleChatClick}
                onViewProfile={handleViewProfile}
                formatEnumValue={formatEnumValue}
                token={token}
                baseUrl={baseUrl}
              />
            );
          })}
        {/* View More Card */}
        {!loading && !profileCompletion.incomplete && filteredProfiles.length > 3 && (
          <Card
            className="border-0 shadow-medium hover:shadow-large transition-smooth cursor-pointer overflow-hidden"
            onClick={() => onSectionChange("matches")}
          >
            <div className="relative aspect-[8/9] w-full">
              {filteredProfiles[3]?.avatar ? (
                <img src={filteredProfiles[3].avatar} alt="View more" className="object-cover w-full h-full filter blur-sm" />
              ) : (
                <div className="w-full h-full bg-pink-50 flex items-center justify-center filter blur-sm">
                  <Users className="w-16 h-16 text-pink-300" />
                </div>
              )}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-3 bg-pink-900/40 text-white">
                <Button variant="secondary" onClick={(e) => { e.stopPropagation(); onSectionChange("matches"); }}>
                  View More
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>

{/* Samaj Seva Footer Section */}
<Card className="border-0 shadow-lg rounded-xl overflow-hidden bg-gradient-to-r from-primary/70 to-primary text-white">
  <CardContent className="py-10 px-6 md:px-12">
    <div className="flex flex-col md:flex-row items-center justify-between gap-6">

      {/* Text Content */}
      <div className="max-w-lg">
        <h2 className="text-2xl md:text-3xl font-bold">
          Find Your Perfect Life Partner
        </h2>
        <p className="text-white/90 mt-3 text-sm md:text-base leading-relaxed">
          A selfless social initiative dedicated to the Brahmin community, committed to preserving Sanatan culture, classical traditions, and strong family values by helping individuals and families find a compatible life partner through trust, cultural harmony, and meaningful relationships.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-row justify-center gap-2 mt-4 md:mt-0">
        <Button
          variant="secondary"
          className="text-primary font-semibold"
          onClick={() => onSectionChange("matches")}
        >
          View Matches
        </Button>

        <Button
          className="bg-white text-primary hover:bg-white/90 font-semibold"
          onClick={() => onSectionChange("partner-preference")}
        >
          Update Preferences
        </Button>
      </div>

    </div>
  </CardContent>
</Card>


      {/* Quick Actions */}
      <Card className="border-0 shadow-medium">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2"
              onClick={() => onSectionChange("matches")}
            >
              <Users className="w-8 h-8 text-primary" />
              <span>Browse Matches</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2"
              onClick={() => onSectionChange("messages")}
            >
              <MessageSquare className="w-8 h-8 text-primary" />
              <span>Send Message</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2"
              onClick={() => onSectionChange("partner-preference")}
            >
              <Heart className="w-8 h-8 text-primary" />
              <span>Edit Preferences</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Profile Modal (opened when clicking a profile card) - pass profileId for dynamic fetch */}
      <ProfileModal
        open={profileModalOpen}
        onOpenChange={setProfileModalOpen}
        profileId={selectedProfileId}
      />

      {/* Subscription Modal */}
      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
      />
    </div>
  );
};

export default Home;
