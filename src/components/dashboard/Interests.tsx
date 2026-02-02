import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X, MessageSquare, User, Loader2, MapPin, AlertCircle } from "lucide-react";
import ProfileModal from "./ProfileModal";
import { SubscriptionModal } from "@/components/common/SubscriptionModal";


interface MatchesProps {
  onViewProfile?: (matchId: number) => void;
}

type RequestState =
  | "none"
  | "pending"        // I sent request
  | "received"       // Someone sent request TO ME
  | "accepted"
  | "rejected"
  | "withdrawn";

const MARITAL_STATUS_OPTIONS = [
  { label: "Unmarried", value: "UNMARRIED" },
  { label: "Widow / Widower", value: "WIDOW_WIDOWER" },
  { label: "Divorced", value: "DIVORCED" },
  { label: "Separated", value: "SEPARATED" },
  { label: "Doesn't Matter", value: "DOESNT_MATTER" }
];

const InterestCard = ({ 
  match, 
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
    location: match.location,
    occupation: match.occupation
  });

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      // Fetch Image
      try {
        const imgResponse = await fetch(
          `${baseUrl.replace("9096", "9099")}/api/images/getProfileImageById?profileId=${match.id}`,
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
          `${baseUrl.replace("9096", "9099")}/api/profiles/getLocationAndOccupation/${match.id}`,
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

      // Fetch Image
      try {
        const imgResponse = await fetch(
          `${baseUrl.replace("9096", "9099")}/api/images/getProfileImageById?profileId=${match.id}`,
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
    };

    loadData();
    return () => { isMounted = false; };
  }, [match.id, token, baseUrl]);

  const status = connectionInfo?.state || "none";

  return (
    <Card
      className="border-0 shadow-medium hover:shadow-large transition-smooth cursor-pointer overflow-hidden"
      onClick={() => onViewProfile(match.id)}
    >
      <div className="relative aspect-[8/9] w-full">
        {loadingImage ? (
           <div className="w-full h-full bg-gray-200 animate-pulse" />
        ) : imageUrl ? (
          <img src={imageUrl} alt={match.name} className="object-cover w-full h-full" />
        ) : (
          <div className="w-full h-full bg-pink-50 flex items-center justify-center">
            <User className="w-16 h-16 text-pink-300" />
          </div>
        )}
        
        {/* Marital Status Badge */}
        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs font-semibold px-2 py-1 rounded-full backdrop-blur-sm">
            {formatEnumValue(match.maritalStatus)}
        </div>
        {/* Details Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-3 bg-gradient-to-t from-black/80 to-transparent text-white">
            <div className="flex items-baseline gap-2">
                <CardTitle className="text-xl">{match.name}, {match.age}</CardTitle>
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
                    onClick={() => onSkip(match.id)}
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
                    onClick={() => onChat(match.id)}
                >
                    <MessageSquare className="w-4 h-4 mr-1" /> Chat
                </Button>
                )}

                {/* Dynamic Buttons */}
                {status === "none" && (
                <Button
                    size="sm"
                    className="flex-1 bg-gradient-primary"
                    onClick={() => onConnect(match.id)}
                >
                    Send Interest
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
                    onClick={() => onReject(connectionInfo?.requestId, match.id)}
                    >
                    Reject
                    </Button>
                    <Button
                    size="sm"
                    className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
                    onClick={() => onAccept(connectionInfo?.requestId, match.id)}
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

const Matches = ({ onViewProfile }: MatchesProps = {}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"received" | "sent" | "accepted">("received");
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [skippedMatches, setSkippedMatches] = useState<number[]>([]);
  const [profileCompletion, setProfileCompletion] = useState<{
    incomplete: boolean;
    message: string;
    percentage: number;
  }>({ incomplete: false, message: "", percentage: 0 });

  const [connectStatus, setConnectStatus] = useState<Record<number, { state: RequestState; requestId?: number }>>({});
  
  // Subscription states for connect flow
  const [hasActiveSubscription, setHasActiveSubscription] = useState<boolean>(false);
  const [subscriptionChecked, setSubscriptionChecked] = useState<boolean>(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState<boolean>(false);

  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [selectedProfileId, setSelectedProfileId] = useState<number | null>(null);

  const token = sessionStorage.getItem("token");
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  // Check subscription helper (returns boolean)
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

  const processMatches = (suggested: any[]) => {
    return suggested.map((m: any) => {
      const profile = m.profile;
      // Initial values
      let location = profile.location?.city || "N/A";
      let occupation = profile.educationOccupationDetails?.occupation || "N/A";

        return {
          id: profile.id,
          name: `${profile.firstName} ${profile.lastName}`,
          age:
            profile.dateOfBirth !== ""
              ? new Date().getFullYear() -
                new Date(profile.dateOfBirth).getFullYear()
              : "N/A",
          location: location,
          education:
            profile.educationOccupationDetails?.highestEducation || "N/A",
          occupation: occupation,
          picture: "", // Will be loaded by InterestCard
          height: profile.heightIn || "N/A",
          maritalStatus: profile.maritalStatus || "N/A",
        };
    });
  };

  // ----------------------------------------------------
  // Fetch Suggested Matches
  // ----------------------------------------------------
  const fetchMatches = async (pageNo = 0) => {
    if (!token) {
      setLoading(false);
      return;
    }

    if (pageNo === 0) setLoading(true);
    else setLoadingMore(true);

    const apiBase = baseUrl.replace("9096", "9099");
    let url = `${apiBase}/api/suggestions/profiles/getInvitations?page=${pageNo}&size=20`;

    if (activeTab === "sent") {
      url = `${apiBase}/api/suggestions/profiles/sendInvitations?page=${pageNo}&size=20`;
    } else if (activeTab === "accepted") {
      url = `${apiBase}/api/suggestions/profiles/getAcceptedMatches?page=${pageNo}&size=20`;
    }

    try {
      const response = await fetch(
        url,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
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
        setMatches([]);
        setLoading(false);
        setLoadingMore(false);
        return;
      }

      const suggested = data?.payload?.suggestedMatches || [];
      const totalPages = data?.payload?.totalPages || 0;
      const matchesWithImages = processMatches(suggested);

      if (pageNo === 0) {
        setMatches(matchesWithImages);
      } else {
        setMatches((prev) => [...prev, ...matchesWithImages]);
      }

      setHasMore(pageNo < totalPages - 1);
      setPage(pageNo);
    } catch (error) {
      console.error("Error fetching matches:", error);
    }

    setLoading(false);
    setLoadingMore(false);
  };

  // ----------------------------------------------------
  // Fetch connection status (sent + received)
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
        }
      });

      // Requests received BY ME
      received.forEach((req: any) => {
        if (req.status === "PENDING") { // It has a request ID to be accepted
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
  // Send connection request
  // ----------------------------------------------------
  const handleConnect = async (receiverId: number) => {
    if (!token) return;

    // Ensure we know subscription status
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
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await res.json();

      if (res.ok) {
        setConnectStatus((prev) => ({
          ...prev,
          [receiverId]: { state: "pending" },
        }));
        fetchConnectionStatus();
      }
    } catch (error) {
      console.error("Error sending connection:", error);
    }
  };

  // ----------------------------------------------------
  // Accept received request
  // ----------------------------------------------------
  const handleAccept = async (requestId: number | undefined, senderId: number) => {
    if (!token || requestId === undefined) return;

    // Ensure subscription is active before accepting
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
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
        console.error("Accept failed:", data.message);
      }
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  // ----------------------------------------------------
  // Reject received request
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
  // Load on init
  // ----------------------------------------------------
  useEffect(() => {
    fetchMatches(0);
    fetchConnectionStatus();
  }, [activeTab]);

  const handleSkip = (matchId: number) => {
    setSkippedMatches((prev) => [...prev, matchId]);
  };

  const filteredMatches = matches.filter((match) => {
    if (skippedMatches.includes(match.id)) {
      return false;
    }
    return true;
  });

  const handleChatClick = (matchId: number) => {
    navigate(`/dashboard?section=messages`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="border-0 shadow-medium overflow-hidden">
        <CardHeader className="pb-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex gap-2 w-full">
            <Button
              variant={activeTab === "received" ? "default" : "outline"}
              onClick={() => setActiveTab("received")}
              className="flex-1"
            >
              Received <span className="hidden md:inline">Invitations</span>
            </Button>
            <Button
              variant={activeTab === "sent" ? "default" : "outline"}
              onClick={() => setActiveTab("sent")}
              className="flex-1"
            >
              Sent <span className="hidden md:inline">Invitations</span>
            </Button>
            <Button
              variant={activeTab === "accepted" ? "default" : "outline"}
              onClick={() => setActiveTab("accepted")}
              className="flex-1"
            >
              Accepted
            </Button>
          </div>
        </CardHeader>

      </Card>

      {/* Loader */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {/* No Matches */}
      {!loading && !profileCompletion.incomplete && filteredMatches.length === 0 && (
        <div className="text-center py-10 text-muted-foreground">
          No invitations found
        </div>
      )}

      {/* Cards */}
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
        {!loading &&
          filteredMatches.map((match) => {
            const connectionInfo = connectStatus[match.id];
            return (
              <InterestCard
                key={match.id}
                match={match}
                connectionInfo={connectionInfo}
                onConnect={handleConnect}
                onAccept={handleAccept}
                onReject={handleReject}
                onSkip={handleSkip}
                onChat={handleChatClick}
                onViewProfile={(id: number) => {
                  setSelectedProfileId(match.id);
                  setProfileModalOpen(true);
                }}
                formatEnumValue={formatEnumValue}
                token={token}
                baseUrl={baseUrl}
              />
            );
          })}
      </div>

      {/* Load More Button */}
      {!loading && hasMore && (
        <div className="flex justify-center mt-8 pb-8">
          <Button 
            variant="outline" 
            onClick={() => {
              const nextPage = page + 1;
              fetchMatches(nextPage);
            }}
            disabled={loadingMore}
            className="min-w-[150px]"
          >
            {loadingMore ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More Matches"
            )}
          </Button>
        </div>
      )}

      {/* Profile Modal */}
      <ProfileModal
        open={profileModalOpen}
        onOpenChange={setProfileModalOpen}
        user={selectedUser}
        profileId={selectedProfileId}
      />

      {/* Subscription Modal (opened when user has no active subscription) */}
      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
      />
    </div>
  );
};

export default Matches;
