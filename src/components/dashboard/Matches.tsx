import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X, MessageSquare, User, Loader2, MapPin, AlertCircle, Filter, ChevronDown, ChevronUp, SearchX } from "lucide-react";
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

const GENDER_OPTIONS = [
  { label: "Male", value: "MALE" },
  { label: "Female", value: "FEMALE" },
  { label: "Other", value: "OTHER" },
  { label: "Prefer Not To Say", value: "PREFER_NOT_TO_SAY" }
];

const MARITAL_STATUS_OPTIONS = [
  { label: "Unmarried", value: "UNMARRIED" },
  { label: "Widow / Widower", value: "WIDOW_WIDOWER" },
  { label: "Divorced", value: "DIVORCED" },
  { label: "Separated", value: "SEPARATED" },
  { label: "Doesn't Matter", value: "DOESNT_MATTER" }
];

const HAVE_CHILDREN_OPTIONS = [
  { label: "Doesn't Matter", value: "DOESNT_MATTER" },
  { label: "Yes, Living Together", value: "YES_LIVING_TOGETHER" },
  { label: "Yes, Not Living Together", value: "YES_NOT_LIVING_TOGETHER" },
  { label: "No", value: "NO" }
];

const PHYSICAL_STATUS_OPTIONS = [
  { label: "Normal", value: "NORMAL" },
  { label: "Physically Challenged", value: "PHYSICALLY_CHALLENGED" },
  { label: "Any", value: "ANY" }
];

const MANGLIK_OPTIONS = [
  { label: "Yes", value: "YES" },
  { label: "No", value: "NO" },
  { label: "Doesn't Matter", value: "DOESNT_MATTER" }
];

const EMPLOYMENT_TYPE_OPTIONS = [
  { label: "Government", value: "GOVERNMENT" },
  { label: "Defence", value: "DEFENCE" },
  { label: "Private", value: "PRIVATE" },
  { label: "Business", value: "BUSINESS" },
  { label: "Self Employed", value: "SELF_EMPLOYED" },
  { label: "Student", value: "STUDENT" },
  { label: "Not Working", value: "NOT_WORKING" },
  { label: "Other", value: "OTHER" }
];

const DIETARY_HABITS_OPTIONS = [
  { label: "Vegetarian", value: "VEGETARIAN" },
  { label: "Non-Vegetarian", value: "NON_VEGETARIAN" },
  { label: "Eggetarian", value: "EGGETARIAN" },
  { label: "Vegan", value: "VEGAN" },
  { label: "Doesn't Matter", value: "DOESNT_MATTER" }
];

const SMOKING_HABITS_OPTIONS = [
  { label: "Non Smoker", value: "NON_SMOKER" },
  { label: "Light / Social Smoker", value: "LIGHT_SOCIAL_SMOKER" },
  { label: "Regular Smoker", value: "REGULAR_SMOKER" },
  { label: "Doesn't Matter", value: "DOESNT_MATTER" }
];

const DRINKING_HABITS_OPTIONS = [
  { label: "Non Drinker", value: "NON_DRINKER" },
  { label: "Light / Social Drinker", value: "LIGHT_SOCIAL_DRINKER" },
  { label: "Regular Drinker", value: "REGULAR_DRINKER" },
  { label: "Doesn't Matter", value: "DOESNT_MATTER" }
];

const MatchCard = ({ 
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
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isFiltered, setIsFiltered] = useState(false);
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

  // Filter State
  const [showFilters, setShowFilters] = useState(false);
  const [openSections, setOpenSections] = useState<string[]>(["basic"]);
  const [filterData, setFilterData] = useState({
    gender: "",
    maritalStatus: "",
    minAge: "",
    maxAge: "",
    minHeight: "",
    maxHeight: "",
    haveChildren: "",
    physicalStatus: "",
    religion: "Hindu",
    motherTongue: "",
    caste: "",
    gothra: "",
    manglik: "",
    star: "",
    rashi: "",
    educationLevel: "",
    employedIn: "",
    occupation: "",
    annualIncome: "",
    dietaryHabits: "",
    smokingHabits: "",
    drinkingHabits: "",
    country: "",
    citizenship: ""
  });

  const [masterData, setMasterData] = useState<{
    motherTongues: string[];
    castes: string[];
    gothras: string[];
    stars: string[];
    rashis: string[];
    countries: string[];
    education: any[];
    occupations: any[];
    incomes: string[];
    heights: string[];
  }>({ motherTongues: [], castes: [], gothras: [], stars: [], rashis: [], countries: [], education: [], occupations: [], incomes: [], heights: [] });

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
        picture: "", // Will be loaded by MatchCard
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

    try {
      const response = await fetch(
        `${baseUrl}/api/suggestions/profiles?page=${pageNo}&size=20`,
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
      if (pageNo === 0) setIsFiltered(false);
    } catch (error) {
      console.error("Error fetching matches:", error);
    }

    setLoading(false);
    setLoadingMore(false);
  };

  const handleApplyFilters = async (pageNo = 0) => {
    if (!token) return;
    
    if (pageNo === 0) {
      setLoading(true);
      setShowFilters(false);
    } else {
      setLoadingMore(true);
    }

    const mapToEnum = (val: string) => val ? val.toUpperCase().replace(/ /g, "_") : null;

    const payload = {
      gender: mapToEnum(filterData.gender),
      maritalStatus: mapToEnum(filterData.maritalStatus),
      minAge: filterData.minAge ? parseInt(filterData.minAge) : null,
      maxAge: filterData.maxAge ? parseInt(filterData.maxAge) : null,
      minHeight: filterData.minHeight || null,
      maxHeight: filterData.maxHeight || null,
      haveChildren: mapToEnum(filterData.haveChildren),
      physicalStatus: mapToEnum(filterData.physicalStatus),
      religion: mapToEnum(filterData.religion),
      motherTongues: filterData.motherTongue ? [filterData.motherTongue] : null,
      castes: filterData.caste ? [filterData.caste.toUpperCase()] : null,
      gothras: filterData.gothra ? [filterData.gothra] : null,
      manglik: mapToEnum(filterData.manglik),
      stars: filterData.star ? [filterData.star] : null,
      rashis: filterData.rashi ? [filterData.rashi] : null,
      educationLevels: filterData.educationLevel ? [filterData.educationLevel] : null,
      employedIn: filterData.employedIn ? [filterData.employedIn] : null,
      occupations: filterData.occupation ? [filterData.occupation] : null,
      annualIncome: filterData.annualIncome || null,
      dietaryHabits: mapToEnum(filterData.dietaryHabits),
      smokingHabits: mapToEnum(filterData.smokingHabits),
      drinkingHabits: mapToEnum(filterData.drinkingHabits),
      countriesLivedIn: filterData.country ? [filterData.country] : null,
      citizenships: filterData.citizenship ? [filterData.citizenship] : null,
      page: pageNo,
      size: 20
    };

    try {
        const response = await fetch(`${baseUrl.replace("9096", "9099")}/api/suggestions/profiles/filter`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
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
        setIsFiltered(true);
    } catch (error) {
        console.error("Error filtering matches", error);
    }
    setLoading(false);
    setLoadingMore(false);
  };

  const updateFilter = (field: string) => (e: any) => {
    setFilterData(prev => ({ ...prev, [field]: e.target.value }));
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
        } else if (req.status === "ACCEPTED") { // It was accepted, now it's a connection
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
  }, []);

  // ----------------------------------------------------
  // Fetch Master Data for Filters
  // ----------------------------------------------------
  useEffect(() => {
    const fetchMasterData = async () => {
      if (!token) return;
      
      // Helper to handle port replacement based on existing pattern
      const getUrl = (port: string) => baseUrl.replace("9096", port);
      const headers = { Authorization: `Bearer ${token}` };

      try {
        const [mtRes, cRes, gRes, sRes, rRes, coRes, eduRes, occRes, incRes, hRes] = await Promise.all([
          fetch(`${getUrl("9090")}/api/mother-tongues`, { headers }),
          fetch(`${getUrl("9099")}/api/castes`, { headers }),
          fetch(`${getUrl("9099")}/api/gothras`, { headers }),
          fetch(`${getUrl("9099")}/api/stars`, { headers }),
          fetch(`${getUrl("9099")}/api/raasi`, { headers }),
          fetch(`${getUrl("9090")}/api/country`, { headers }),
          fetch(`${getUrl("9099")}/api/education/categories`, { headers }),
          fetch(`${getUrl("9099")}/api/occupation/categories`, { headers }),
          fetch(`${getUrl("9099")}/api/annual-income`, { headers }),
          fetch(`${getUrl("9099")}/api/heights`, { headers })
        ]);

        const results = await Promise.all([
          mtRes.ok ? mtRes.json() : { payload: [] },
          cRes.ok ? cRes.json() : { payload: [] },
          gRes.ok ? gRes.json() : { payload: [] },
          sRes.ok ? sRes.json() : { payload: [] },
          rRes.ok ? rRes.json() : { payload: [] },
          coRes.ok ? coRes.json() : { payload: [] },
          eduRes.ok ? eduRes.json() : { payload: [] },
          occRes.ok ? occRes.json() : { payload: [] },
          incRes.ok ? incRes.json() : { payload: [] },
          hRes.ok ? hRes.json() : { payload: [] }
        ]);

        setMasterData({
          motherTongues: results[0].payload?.map((i: any) => i.languageName) || [],
          castes: results[1].payload?.map((i: any) => i.casteName) || [],
          gothras: results[2].payload?.map((i: any) => i.gothraName) || [],
          stars: results[3].payload?.map((i: any) => i.starName) || [],
          rashis: results[4].payload?.map((i: any) => i.name) || [],
          countries: results[5].payload?.map((i: any) => i.countryName) || [],
          education: results[6].payload?.map((cat: any) => ({
            label: cat.categoryName,
            options: cat.educationOptions.map((opt: any) => ({
              label: opt.optionName,
              value: opt.optionName
            }))
          })) || [],
          occupations: results[7].payload?.map((cat: any) => ({
            label: cat.categoryName,
            options: cat.occupationOptions.map((opt: any) => ({
              label: opt.optionName,
              value: opt.optionName
            }))
          })) || [],
          incomes: results[8].payload?.map((i: any) => i.incomeRange) || [],
          heights: results[9].payload?.map((i: any) => i.height) || []
        });
      } catch (error) {
        console.error("Error fetching filter master data", error);
      }
    };

    fetchMasterData();
  }, [token, baseUrl]);

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

  const toggleSection = (section: string) => {
    setOpenSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const AccordionSection = ({
    id,
    title,
    children,
  }: {
    id: string;
    title: string;
    children: React.ReactNode;
  }) => {
    const isOpen = openSections.includes(id);
    return (
      <div className="border-b last:border-0">
        <button
          className="flex items-center justify-between w-full p-4 text-left font-medium hover:bg-muted/50 transition-colors"
          onClick={() => toggleSection(id)}
        >
          {title}
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
        {isOpen && (
          <div className="p-4 pt-0 space-y-4 animate-in slide-in-from-top-2">
            {children}
          </div>
        )}
      </div>
    );
  };

  const InputGroup = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="space-y-1.5">
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
      </label>
      {children}
    </div>
  );

  const StyledSelect = ({ 
    placeholder = "Select...", 
    options = [], 
    value, 
    onChange, 
    disabled 
  }: { 
    placeholder?: string, 
    options?: (string | { label: string; value: string } | { label: string; options: { label: string; value: string }[] })[], 
    value?: string, 
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void, 
    disabled?: boolean 
  }) => (
    <select
      className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      value={value || ""}
      onChange={onChange}
      disabled={disabled}
    >
      <option value="" disabled>{placeholder}</option>
      {options.map((opt, idx) => {
        if (typeof opt === 'object' && 'options' in opt) {
          return (
            <optgroup key={opt.label || idx} label={opt.label}>
              {opt.options.map((subOpt) => (
                <option key={subOpt.value} value={subOpt.value}>{subOpt.label}</option>
              ))}
            </optgroup>
          );
        }
        const label = typeof opt === 'string' ? opt : opt.label;
        const val = typeof opt === 'string' ? opt : opt.value;
        return <option key={val} value={val}>{label}</option>;
      })}
    </select>
  );

  const StyledInput = ({ 
    type = "text", 
    placeholder = "", 
    value, 
    onChange 
  }: { 
    type?: string, 
    placeholder?: string, 
    value?: string | number, 
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void 
  }) => (
    <input
      type={type}
      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      placeholder={placeholder}
      value={value || ""}
      onChange={onChange}
    />
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="border-0 shadow-medium overflow-hidden">
        <CardHeader className="pb-4 flex flex-row items-center justify-between gap-4">
          <div>
            <CardTitle className="text-2xl md:text-3xl">Matches</CardTitle>
            <p className="text-muted-foreground mt-1">
              Profiles that match your preferences
            </p>
          </div>

          <Button
            variant={showFilters ? "secondary" : "outline"}
            size="icon"
            onClick={() => setShowFilters(true)}
          >
            <Filter className="w-4 h-4" />
          </Button>
        </CardHeader>

      </Card>

      {/* Loader */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
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
        {!loading && !profileCompletion.incomplete && filteredMatches.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center p-8 text-center bg-muted/30 rounded-lg border-2 border-dashed">
            <div className="bg-primary/10 p-3 rounded-full mb-4">
              <SearchX className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Matches Found</h3>
            <p className="text-muted-foreground max-w-md mb-6">
              No matches found according to your preference. Please change your preference to see more results.
            </p>
            <Button onClick={() => navigate("/dashboard?section=partner-preference")}>Update Preferences</Button>
          </div>
        )}
        {!loading &&
          filteredMatches.map((match) => {
            const connectionInfo = connectStatus[match.id];
            return (
              <MatchCard
                key={match.id}
                match={match}
                connectionInfo={connectionInfo}
                onConnect={handleConnect}
                onAccept={handleAccept}
                onReject={handleReject}
                onSkip={handleSkip}
                onChat={handleChatClick}
                onViewProfile={(id: number) => {
                  setSelectedProfileId(id);
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
              if (isFiltered) handleApplyFilters(nextPage);
              else fetchMatches(nextPage);
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

      {/* Filter Modal */}
      <Dialog open={showFilters} onOpenChange={setShowFilters}>
        <DialogContent className="w-[90vw] sm:w-full max-w-3xl max-h-[90vh] flex flex-col p-0 gap-0 rounded-xl overflow-hidden">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle>Filter Matches</DialogTitle>
            <DialogDescription>
              Refine your search by selecting your preferences below.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-6 pt-2">
            {/* 1. Basic Preferences */}
            <AccordionSection id="basic" title="1. Basic Preferences">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputGroup label="Gender">
                  <StyledSelect 
                    placeholder="Select Gender" 
                    options={GENDER_OPTIONS} 
                    value={filterData.gender}
                    onChange={updateFilter("gender")}
                  />
                </InputGroup>
                <InputGroup label="Marital Status">
                  <StyledSelect 
                    placeholder="Select Status" 
                    options={MARITAL_STATUS_OPTIONS} 
                    value={filterData.maritalStatus}
                    onChange={updateFilter("maritalStatus")}
                  />
                </InputGroup>
                <InputGroup label="Age Range">
                  <div className="flex gap-2">
                    <StyledInput 
                      type="number" 
                      placeholder="Min" 
                      value={filterData.minAge}
                      onChange={updateFilter("minAge")}
                    />
                    <StyledInput 
                      type="number" 
                      placeholder="Max" 
                      value={filterData.maxAge}
                      onChange={updateFilter("maxAge")}
                    />
                  </div>
                </InputGroup>
                <InputGroup label="Height Range">
                  <div className="flex gap-2">
                    <StyledSelect 
                      placeholder="Min Height" 
                      options={masterData.heights} 
                      value={filterData.minHeight}
                      onChange={updateFilter("minHeight")}
                    />
                    <StyledSelect 
                      placeholder="Max Height" 
                      options={masterData.heights} 
                      value={filterData.maxHeight}
                      onChange={updateFilter("maxHeight")}
                    />
                  </div>
                </InputGroup>
                <InputGroup label="Have Children">
                  <StyledSelect 
                    placeholder="Select..." 
                    options={HAVE_CHILDREN_OPTIONS} 
                    value={filterData.haveChildren}
                    onChange={updateFilter("haveChildren")}
                  />
                </InputGroup>
                <InputGroup label="Physical Status">
                  <StyledSelect 
                    placeholder="Select" 
                    options={PHYSICAL_STATUS_OPTIONS} 
                    value={filterData.physicalStatus}
                    onChange={updateFilter("physicalStatus")}
                  />
                </InputGroup>
              </div>
            </AccordionSection>

            {/* 2. Religion & Community */}
            <AccordionSection id="religion" title="2. Religion & Community">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputGroup label="Religion">
                  <StyledSelect 
                    placeholder="Select Religion" 
                    options={["Hindu", "Muslim", "Christian", "Sikh", "Jain", "Buddhist"]} 
                    value={filterData.religion}
                    onChange={updateFilter("religion")}
                    disabled={true} 
                  />
                </InputGroup>
                <InputGroup label="Mother Tongue">
                  <StyledSelect 
                    placeholder="Select Mother Tongue" 
                    options={masterData.motherTongues} 
                    value={filterData.motherTongue}
                    onChange={updateFilter("motherTongue")}
                  />
                </InputGroup>
                <InputGroup label="Caste">
                  <StyledSelect 
                    placeholder="Select Caste" 
                    options={masterData.castes} 
                    value={filterData.caste}
                    onChange={updateFilter("caste")}
                  />
                </InputGroup>
                <InputGroup label="Gothra">
                  <StyledSelect 
                    placeholder="Select Gothra" 
                    options={masterData.gothras} 
                    value={filterData.gothra}
                    onChange={updateFilter("gothra")}
                  />
                </InputGroup>
              </div>
            </AccordionSection>

            {/* 3. Horoscope Details */}
            <AccordionSection id="horoscope" title="3. Horoscope Details">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputGroup label="Manglik">
                  <StyledSelect 
                    placeholder="Select" 
                    options={MANGLIK_OPTIONS} 
                    value={filterData.manglik}
                    onChange={updateFilter("manglik")}
                  />
                </InputGroup>
                <InputGroup label="Star (Nakshatra)">
                  <StyledSelect 
                    placeholder="Select Star" 
                    options={masterData.stars} 
                    value={filterData.star}
                    onChange={updateFilter("star")}
                  />
                </InputGroup>
                <InputGroup label="Rashi (Moon Sign)">
                  <StyledSelect 
                    placeholder="Select Rashi" 
                    options={masterData.rashis} 
                    value={filterData.rashi}
                    onChange={updateFilter("rashi")}
                  />
                </InputGroup>
              </div>
            </AccordionSection>

            {/* 4. Education & Profession */}
            <AccordionSection id="education" title="4. Education & Profession">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputGroup label="Education Level">
                  <StyledSelect 
                    placeholder="Select Level" 
                    options={masterData.education} 
                    value={filterData.educationLevel}
                    onChange={updateFilter("educationLevel")}
                  />
                </InputGroup>
                <InputGroup label="Employed In">
                  <StyledSelect 
                    placeholder="Select Sector" 
                    options={EMPLOYMENT_TYPE_OPTIONS} 
                    value={filterData.employedIn}
                    onChange={updateFilter("employedIn")}
                  />
                </InputGroup>
                <InputGroup label="Occupation">
                  <StyledSelect 
                    placeholder="Select Occupation" 
                    options={masterData.occupations} 
                    value={filterData.occupation}
                    onChange={updateFilter("occupation")}
                  />
                </InputGroup>
                <InputGroup label="Annual Income">
                  <StyledSelect 
                    placeholder="Select Income Range" 
                    options={masterData.incomes} 
                    value={filterData.annualIncome}
                    onChange={updateFilter("annualIncome")}
                  />
                </InputGroup>
              </div>
            </AccordionSection>

            {/* 5. Lifestyle Preferences */}
            <AccordionSection id="lifestyle" title="5. Lifestyle Preferences">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputGroup label="Dietary Habits">
                  <StyledSelect 
                    placeholder="Select" 
                    options={DIETARY_HABITS_OPTIONS} 
                    value={filterData.dietaryHabits}
                    onChange={updateFilter("dietaryHabits")}
                  />
                </InputGroup>
                <InputGroup label="Smoking Habits">
                  <StyledSelect 
                    placeholder="Select" 
                    options={SMOKING_HABITS_OPTIONS} 
                    value={filterData.smokingHabits}
                    onChange={updateFilter("smokingHabits")}
                  />
                </InputGroup>
                <InputGroup label="Drinking Habits">
                  <StyledSelect 
                    placeholder="Select" 
                    options={DRINKING_HABITS_OPTIONS} 
                    value={filterData.drinkingHabits}
                    onChange={updateFilter("drinkingHabits")}
                  />
                </InputGroup>
              </div>
            </AccordionSection>

            {/* 6. Location Preferences */}
            <AccordionSection id="location" title="6. Location Preferences">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputGroup label="Country Living In">
                  <StyledSelect 
                    placeholder="Select Country" 
                    options={masterData.countries} 
                    value={filterData.country}
                    onChange={updateFilter("country")}
                  />
                </InputGroup>
                <InputGroup label="Citizenship">
                  <StyledSelect 
                    placeholder="Select Citizenship" 
                    options={masterData.countries} 
                    value={filterData.citizenship}
                    onChange={updateFilter("citizenship")}
                  />
                </InputGroup>
              </div>
            </AccordionSection>
          </div>

          <DialogFooter className="p-6 border-t flex flex-row items-center justify-end gap-2">
            <Button variant="outline" onClick={() => setShowFilters(false)}>
              Cancel
            </Button>
            <Button onClick={() => handleApplyFilters(0)}>
              Apply Filters
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Matches;
