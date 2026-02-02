import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

import ProfileInfoModal from "./modal/ProfileInfoModal";
import BasicInformationModal from "./modal/BasicInformationModal";
import EducationOccupationModal from "./modal/EducationOccupationModal";
import FamilyDetailsModal from "./modal/FamilyDetailsModal";
import HobbiesInterestsModal from "./modal/HobbiesInterestsModal";
import PartnerPreferenceModal from "./modal/PartnerPreferenceModal";
import ContactDetailsModal from "./modal/ContactDetailsModal";
import LocationDetailsModal from "./modal/LocationDetailsModal";

/* ------------------------------------------------------------------
  ENUM LABELS
------------------------------------------------------------------ */
const enumLabels: Record<string, string> = {
  MALE: "Male",
  FEMALE: "Female",
  OTHER: "Other",
  PREFER_NOT_TO_SAY: "Prefer not to say",

  UNMARRIED: "Unmarried",
  WIDOW_WIDOWER: "Widow / Widower",
  DIVORCED: "Divorced",
  SEPARATED: "Separated",

  NORMAL: "Normal",
  PHYSICALLY_CHALLENGED: "Physically Challenged",

  YES: "Yes",
  NO: "No",

  VEGETARIAN: "Vegetarian",
  NON_VEGETARIAN: "Non-Vegetarian",
  EGGETARIAN: "Eggetarian",
  VEGAN: "Vegan",

  NON_DRINKER: "Non-Drinker",
  LIGHT_SOCIAL_DRINKER: "Light Social Drinker",
  REGULAR_DRINKER: "Regular Drinker",

  NON_SMOKER: "Non-Smoker",
  LIGHT_SOCIAL_SMOKER: "Light Social Smoker",
  REGULAR_SMOKER: "Regular Smoker",

  JOINT: "Joint",
  NUCLEAR: "Nuclear",
  EXTENDED: "Extended",

  TRADITIONAL: "Traditional",
  MODERATE: "Moderate",
  LIBERAL: "Liberal",
  ORTHODOX: "Orthodox",

  PRIVATE: "Private Sector",
  GOVERNMENT: "Government",
  STUDENT: "Student",

  ART_HANDICRAFT: "Art & Handicraft",
  COOKING: "Cooking",
  DANCING: "Dancing",
  GARDENING: "Gardening",
  NATURE: "Nature",
  PAINTING: "Painting",
  PETS: "Pets",

  CRICKET: "Cricket",
  FOOTBALL: "Football",
  BADMINTON: "Badminton",
  CARROM: "Carrom",
  CHESS: "Chess",
  JOGGING: "Jogging",
  SWIMMING: "Swimming",

  FILM_SONGS: "Film Songs",
  INDIAN_CLASSICAL_MUSIC: "Indian Classical Music",
  WESTERN_MUSIC: "Western Music",

  /* Food Preferences */
  ARABIC: "Arabic",
  BENGALI: "Bengali",
  CHINESE: "Chinese",
  CONTINENTAL: "Continental",
  FAST_FOOD: "Fast Food",
  GUJARATI: "Gujarati",
  ITALIAN: "Italian",
  KONKAN: "Konkan",
  MEXICAN: "Mexican",
  MOGHLAI: "Moghlai",
  PUNJABI: "Punjabi",
  RAJASTHANI: "Rajasthani",
  SOUTH_INDIAN: "South Indian",
  SPANISH: "Spanish",
  SUSHI: "Sushi",
};

const makeReadable = (value?: string) => {
  if (!value) return "";
  return (
    enumLabels[value] ||
    value.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
  );
};

// Add props interface to accept `user`
interface ProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profileId?: number | null;
  user?: any;
}

const ProfileModal = ({ open, onOpenChange, profileId, user }: ProfileModalProps) => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const token = sessionStorage.getItem("token");
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (!open) return;

    // If a `user` object was provided by the caller, prefer it and skip fetching.
    if (user) {
      setProfile(user);
      return;
    }

    if (profileId && token) fetchProfileData();
  }, [open, profileId, user]); // added `user` to dependencies

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${baseUrl.replace("9096", "9099")}/api/profiles/${profileId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response.ok) throw new Error("Failed to fetch");

      const data = await response.json();
      const p = data.payload;

      /* FETCH PROFILE IMAGE */
      let profileImage = "";
      try {
        const imgResponse = await fetch(
          `${baseUrl.replace(
            "9096",
            "9099"
          )}/api/images/getProfileImageById?profileId=${profileId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (imgResponse.ok) {
          const blob = await imgResponse.blob();
          profileImage = URL.createObjectURL(blob);
        }
      } catch {}

      /* -------------------------------------------------------------
      TRANSFORM → UI OBJECT (EVERY SINGLE FIELD MAPPED)
      ------------------------------------------------------------- */
      const transformedProfile = {
        /* BASIC PROFILE */
        id: p.id,
        userId: p.userId,
        username: p.username,
        email: p.email,
        firstName: p.firstName,
        lastName: p.lastName,
        fullName: `${p.firstName} ${p.lastName}`,
        gender: makeReadable(p.gender),

        profileCreatedFor: p.profileCreatedFor,
        age: p.age,
        dateOfBirth: p.dateOfBirth,
        timeOfBirth: p.timeOfBirth,
        placeOfBirth: p.placeOfBirth,

        heightIn: p.heightIn,
        weight: p.weight,

        motherTongue: p.motherTongue,
        languagesKnown: p.languagesKnown || [],

        about: p.about,

        physicalStatus: makeReadable(p.physicalStatus),
        maritalStatus: makeReadable(p.maritalStatus),

        religion: makeReadable(p.religion),
        caste: p.caste,
        subCaste: p.subCaste,

        gothra: p.gothra,
        star: p.star,
        rashi: p.rashi,
        manglik: makeReadable(p.manglik),

        profilePhoto: profileImage,

        /* DIET & HABITS */
        dietaryHabits: makeReadable(p.dietaryHabits),
        smokingHabits: makeReadable(p.smokingHabits),
        drinkingHabits: makeReadable(p.drinkingHabits),

        /* STATUS */
        verificationStatus: p.verificationStatus,
        profileComplete: p.profileComplete,
        profileCompletionPercentage: p.profileCompletionPercentage,

        createdAt: p.createdAt,
        updatedAt: p.updatedAt,

        /* ---------------- GALLERY IMAGES ---------------- */
        images: p.images?.map((img) => ({
          id: img.id,
          url: img.imageUrl,
          uploadedAt: img.uploadedAt,
        })),

        /* ---------------- EDUCATION & OCCUPATION ---------------- */
        highestEducation: p.educationOccupationDetailsResponse?.highestEducation,
        additionalDegree: p.educationOccupationDetailsResponse?.additionalDegree,
        collegeInstitution: p.educationOccupationDetailsResponse?.collegeInstitution,
        educationInDetail: p.educationOccupationDetailsResponse?.educationInDetail,

        employedIn: makeReadable(
          p.educationOccupationDetailsResponse?.employedIn
        ),
        occupation: p.educationOccupationDetailsResponse?.occupation,
        occupationInDetail:
          p.educationOccupationDetailsResponse?.occupationInDetail,
        annualIncome: p.educationOccupationDetailsResponse?.annualIncome,
        incomeCurrency: p.educationOccupationDetailsResponse?.incomeCurrency,
        workCity: p.educationOccupationDetailsResponse?.workCity,
        workCountry: p.educationOccupationDetailsResponse?.workCountry,

        /* ---------------- LOCATION ---------------- */
        city: p.locationResponse?.city,
        state: p.locationResponse?.state,
        country: p.locationResponse?.country,
        postalCode: p.locationResponse?.postalCode,
        citizenship: p.locationResponse?.citizenship,
        residencyStatus: makeReadable(
          p.locationResponse?.residencyStatus
        ),
        livingSinceYear: p.locationResponse?.livingSinceYear,

        /* ---------------- FAMILY DETAILS ---------------- */
        familyValue: makeReadable(p.familyDetails?.familyValue),
        familyType: makeReadable(p.familyDetails?.familyType),
        familyStatus: makeReadable(p.familyDetails?.familyStatus),

        fatherOccupation: p.familyDetails?.fatherOccupation,
        motherOccupation: p.familyDetails?.motherOccupation,
        nativePlace: p.familyDetails?.nativePlace,

        noOfBrothers: p.familyDetails?.noOfBrothers,
        brothersMarried: p.familyDetails?.brothersMarried,
        noOfSisters: p.familyDetails?.noOfSisters,
        sistersMarried: p.familyDetails?.sistersMarried,

        parentsContactNo: p.familyDetails?.parentsContactNo,
        aboutMyFamily: p.familyDetails?.aboutMyFamily,

        /* ---------------- HOBBIES & INTERESTS ---------------- */
        hobbies:
          p.hobbiesAndInterestsResponse?.hobbies?.map(makeReadable) || [],
        favouriteMusic:
          p.hobbiesAndInterestsResponse?.favouriteMusic?.map(makeReadable) ||
          [],
        sports:
          p.hobbiesAndInterestsResponse?.sports?.map(makeReadable) || [],

        favouriteFood:
          p.hobbiesAndInterestsResponse?.favouriteFood?.map(makeReadable) ||
          [],
        otherHobbies: p.hobbiesAndInterestsResponse?.otherHobbies,
        otherMusic: p.hobbiesAndInterestsResponse?.otherMusic,
        otherSports: p.hobbiesAndInterestsResponse?.otherSports,
        otherFood: p.hobbiesAndInterestsResponse?.otherFood,

        /* ---------------- PARTNER PREFERENCE ---------------- */
        preference: {
          id: p.preference?.id,
          minAge: p.preference?.minAge,
          maxAge: p.preference?.maxAge,
          minHeight: p.preference?.minHeight,
          maxHeight: p.preference?.maxHeight,

          gender: makeReadable(p.preference?.gender),
          maritalStatus: makeReadable(p.preference?.maritalStatus),
          haveChildren: makeReadable(p.preference?.haveChildren),
          physicalStatus: makeReadable(p.preference?.physicalStatus),

          motherTongues: p.preference?.motherTongues || [],
          religion: p.preference?.religion,
          castes: p.preference?.castes || [],
          subCastes: p.preference?.subCastes || [],
          gothras: p.preference?.gothras || [],
          stars: p.preference?.stars || [],
          rashis: p.preference?.rashis || [],

          manglik: makeReadable(p.preference?.manglik),

          educationType: makeReadable(p.preference?.educationType),
          educationLevels: p.preference?.educationLevels || [],

          employedIn: p.preference?.employedIn || [],
          occupations: p.preference?.occupations || [],

          annualIncome: p.preference?.annualIncome,

          dietaryHabits: makeReadable(p.preference?.dietaryHabits),
          smokingHabits: makeReadable(p.preference?.smokingHabits),
          drinkingHabits: makeReadable(p.preference?.drinkingHabits),

          citizenships: p.preference?.citizenships || [],
          countriesLivedIn: p.preference?.countriesLivedIn || [],

          aboutMyPartner: p.preference?.aboutMyPartner,
        },
      };

      setProfile(transformedProfile);
    } catch (err) {
      console.error("ERROR:", err);
    }
    setLoading(false);
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-2xl">Profile Details</DialogTitle>
          <DialogDescription className="sr-only"></DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : profile ? (
          <ScrollArea className="h-[calc(90vh-80px)] px-6 pb-6">
            <div className="space-y-6">
              <ProfileInfoModal user={profile} />
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="flex flex-wrap w-full h-auto md:grid md:grid-cols-7">
                  <TabsTrigger value="basic">Basic</TabsTrigger>
                  <TabsTrigger value="education">Professional</TabsTrigger>
                  <TabsTrigger value="family">Family</TabsTrigger>
                  <TabsTrigger value="hobbies">Hobbies</TabsTrigger>
                  <TabsTrigger value="partner">Preference</TabsTrigger>
                  <TabsTrigger value="contact">Contact</TabsTrigger>
                  <TabsTrigger value="location">Location</TabsTrigger>
                </TabsList>
                <TabsContent value="basic" className="mt-4">
                  <BasicInformationModal user={profile} />
                </TabsContent>
                <TabsContent value="education" className="mt-4">
                  <EducationOccupationModal user={profile} />
                </TabsContent>
                <TabsContent value="family" className="mt-4">
                  <FamilyDetailsModal user={profile} />
                </TabsContent>
                <TabsContent value="hobbies" className="mt-4">
                  <HobbiesInterestsModal user={profile} />
                </TabsContent>
                <TabsContent value="partner" className="mt-4">
                  <PartnerPreferenceModal user={profile} />
                </TabsContent>
                <TabsContent value="contact" className="mt-4">
                  <ContactDetailsModal user={profile} />
                </TabsContent>
                <TabsContent value="location" className="mt-4">
                  <LocationDetailsModal user={profile} />
                </TabsContent>
              </Tabs>
            </div>
          </ScrollArea>
        ) : (
          <div className="text-center py-10 text-muted-foreground">
            Failed to load profile
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;
