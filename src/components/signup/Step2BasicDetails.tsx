import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ArrowRight, Loader2, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const DECLARATION_TEXT = "I hereby declare that the information provided above is true and accurate to the best of my knowledge, and I will be liable for any action if the details are incorrect.";

interface StepProps {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

const Step2BasicDetails = ({ data, onNext, onBack }: StepProps) => {
  const [formData, setFormData] = useState({
    firstName: data.firstName || "",
    lastName: data.lastName || "",
    gender: data.gender || "",
    profileCreatedFor: data.profileCreatedFor || "",
    dateOfBirth: data.dateOfBirth || "",
    timeOfBirth: data.timeOfBirth || "",
    placeOfBirth: data.placeOfBirth || "",
    // force religion to HINDU for backend; display will show "Hindu"
    religion: "HINDU",
    caste: data.caste || "",
    subCaste: data.subCaste || "",
    maritalStatus: data.maritalStatus || "",
    heightIn: data.heightIn || "",
    weight: data.weight || "",
    physicalStatus: data.physicalStatus || "",
    motherTongue: data.motherTongue || "",
    languagesKnown: data.languagesKnown || [],
    gothra: data.gothra || "",
    star: data.star || "",
    rashi: data.rashi || "",
    manglik: data.manglik || "",
    about: data.about || "",
    dietaryHabits: data.dietaryHabits || "",
    drinkingHabits: data.drinkingHabits || "",
    smokingHabits: data.smokingHabits || "",
    hasDisease: data.hasDisease || false,
    diseaseDetails: data.diseaseDetails || "",
    declarationAccepted: data.declarationAccepted || false,
    declarationText: DECLARATION_TEXT,
  });

  // Dropdown options
  const [createdForOptions, setCreatedForOptions] = useState<any[]>([]);
  const [casteOptions, setCasteOptions] = useState<any[]>([]);
  const [subCasteOptions, setSubCasteOptions] = useState<any[]>([]);
  const [heightOptions, setHeightOptions] = useState<any[]>([]);
  const [weightOptions, setWeightOptions] = useState<any[]>([]);
  const [motherTongueOptions, setMotherTongueOptions] = useState<any[]>([]);
  const [gothraOptions, setGothraOptions] = useState<any[]>([]);
  const [rashiOptions, setRashiOptions] = useState<any[]>([]);
  const [starOptions, setStarOptions] = useState<any[]>([]);
  const [loadingDropdown, setLoadingDropdown] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:9099";

  // Lazy fetch utility
  const fetchOptions = async (
    endpoint: string,
    setter: (data: any[]) => void,
    key: string
  ) => {
    try {
      setLoadingDropdown(key);
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${baseUrl}${endpoint}`, {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.statusCode === 200 || data.statusCode === "OK") {
        setter(data.payload || []);
      } else {
        toast({
          title: "Failed to load options",
          description: data.message || "Could not fetch dropdown data.",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to load dropdown options.",
        variant: "destructive",
      });
    } finally {
      setLoadingDropdown(null);
    }
  };

  // Preload mother tongues so Languages Known multiselect is ready
  useEffect(() => {
    fetchOptions("/api/mother-tongues", setMotherTongueOptions, "motherTongue");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation for required fields
    const requiredFields = [
      { key: "firstName", label: "First Name" },
      { key: "lastName", label: "Last Name" },
      { key: "gender", label: "Gender" },
      { key: "profileCreatedFor", label: "Profile Created For" },
      { key: "dateOfBirth", label: "Date of Birth" },
      { key: "timeOfBirth", label: "Time of Birth" },
      { key: "placeOfBirth", label: "Place of Birth" },
      { key: "caste", label: "Caste" },
      { key: "subCaste", label: "Sub Caste" },
      { key: "maritalStatus", label: "Marital Status" },
      { key: "heightIn", label: "Height" },
      { key: "weight", label: "Weight" },
      { key: "physicalStatus", label: "Physical Status" },
      { key: "motherTongue", label: "Mother Tongue" },
      { key: "gothra", label: "Gothra" },
      { key: "manglik", label: "Manglik" },
      { key: "dietaryHabits", label: "Dietary Habits" },
      { key: "drinkingHabits", label: "Drinking Habits" },
      { key: "smokingHabits", label: "Smoking Habits" },
    ];

    for (const field of requiredFields) {
      if (!formData[field.key as keyof typeof formData]) {
        toast({
          title: "Validation Error",
          description: `${field.label} is required.`,
          variant: "destructive",
        });
        return;
      }
    }

    if (formData.languagesKnown.length === 0) {
      toast({
        title: "Validation Error",
        description: "Languages Known is required.",
        variant: "destructive",
      });
      return;
    }

    if (formData.hasDisease && !formData.diseaseDetails) {
      toast({
        title: "Validation Error",
        description: "Disease Details is required.",
        variant: "destructive",
      });
      return;
    }

    // Validate declaration acceptance
    if (!formData.declarationAccepted) {
      toast({
        title: "Validation Error",
        description: "You must accept the declaration before proceeding.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);

    // get token stored during login
    const token = sessionStorage.getItem("token");
    if (!token) {
      setSaving(false);
      toast({
        title: "Unauthorized",
        description: "No token found. Please login and try again.",
        variant: "destructive",
      });
      return;
    }

    try {
      // ensure religion is always HINDU before sending
      const payload = { ...formData, religion: "HINDU" };

      const response = await fetch(`${baseUrl}/api/profiles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (response.ok) {
        toast({
          title: "Profile saved",
          description: "Your basic details have been saved.",
          variant: "default",
        });
        onNext(payload);
      } else {
        toast({
          title: "Error saving profile",
          description: result.message || "Failed to save profile.",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Network Error",
        description: "Could not save profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Toggle for languagesKnown (multi-select)
  const handleLanguageSelect = (language: string) => {
    if (formData.languagesKnown.includes(language)) {
      setFormData({
        ...formData,
        languagesKnown: formData.languagesKnown.filter((l: string) => l !== language),
      });
    } else {
      setFormData({
        ...formData,
        languagesKnown: [...formData.languagesKnown, language],
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* First Name */}
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name (नाम) *</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            required
          />
        </div>

        {/* Last Name */}
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name (उपनाम) *</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            required
          />
        </div>

        {/* Gender */}
        <div className="space-y-2">
          <Label htmlFor="gender">Gender (लिंग) *</Label>
          <Select
            value={formData.gender}
            onValueChange={(value) => setFormData({ ...formData, gender: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MALE">Male</SelectItem>
              <SelectItem value="FEMALE">Female</SelectItem>
              <SelectItem value="OTHER">Other</SelectItem>
              <SelectItem value="PREFER_NOT_TO_SAY">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Profile Created For (API) */}
        <div className="space-y-2">
          <Label htmlFor="profileCreatedFor">Profile Created For (प्रोफ़ाइल किसके लिए) *</Label>
          <Select
            value={formData.profileCreatedFor}
            onValueChange={(value) => setFormData({ ...formData, profileCreatedFor: value })}
            onOpenChange={(open) => {
              if (open && createdForOptions.length === 0) {
                fetchOptions("/api/created-for", setCreatedForOptions, "createdFor");
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {loadingDropdown === "createdFor" ? (
                <div className="flex justify-center py-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              ) : (
                createdForOptions.map((item) => (
                  <SelectItem key={item.id} value={item.targetPerson}>
                    {item.targetPerson}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Date of Birth */}
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth (जन्म तिथि) *</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
            required
          />
        </div>

        {/* Time of Birth */}
        <div className="space-y-2">
          <Label htmlFor="timeOfBirth">Time of Birth (जन्म समय) *</Label>
          <Input
            id="timeOfBirth"
            type="time"
            value={formData.timeOfBirth}
            onChange={(e) => setFormData({ ...formData, timeOfBirth: e.target.value })}
            required
          />
        </div>

        {/* Place of Birth */}
        <div className="space-y-2">
          <Label htmlFor="placeOfBirth">Place of Birth (जन्म स्थान) *</Label>
          <Input
            id="placeOfBirth"
            value={formData.placeOfBirth}
            onChange={(e) => setFormData({ ...formData, placeOfBirth: e.target.value })}
            required
          />
        </div>

        {/* Religion - fixed to Hindu (HINDU sent to backend) */}
        <div className="space-y-2">
          <Label htmlFor="religion">Religion (धर्म)</Label>
          <Input
            id="religion"
            value={"Hindu"}
            readOnly
            onFocus={() => {
              /* intentionally non-editable */
            }}
          />
        </div>

        {/* Caste (API) */}
        <div className="space-y-2">
          <Label htmlFor="caste">Caste (जाति) *</Label>
          <Select
            value={formData.caste}
            onValueChange={(value) => setFormData({ ...formData, caste: value })}
            onOpenChange={(open) => {
              if (open && casteOptions.length === 0) {
                fetchOptions("/api/castes", setCasteOptions, "caste");
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select caste" />
            </SelectTrigger>
            <SelectContent>
              {loadingDropdown === "caste" ? (
                <div className="flex justify-center py-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              ) : (
                casteOptions.map((item) => (
                  <SelectItem key={item.id} value={item.casteName}>
                    {item.casteName}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Sub Caste (API) */}
        <div className="space-y-2">
          <Label htmlFor="subCaste">Sub Caste (उप जाति) *</Label>
          <Select
            value={formData.subCaste}
            onValueChange={(value) => setFormData({ ...formData, subCaste: value })}
            onOpenChange={(open) => {
              if (open && subCasteOptions.length === 0) {
                fetchOptions("/api/sub-caste", setSubCasteOptions, "subCaste");
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select sub-caste" />
            </SelectTrigger>
            <SelectContent>
              {loadingDropdown === "subCaste" ? (
                <div className="flex justify-center py-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              ) : (
                subCasteOptions.map((item) => (
                  <SelectItem key={item.id} value={item.subCasteName}>
                    {item.subCasteName}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Marital Status - updated to backend enum values */}
        <div className="space-y-2">
          <Label htmlFor="maritalStatus">Marital Status (वैवाहिक स्थिति) *</Label>
          <Select
            value={formData.maritalStatus}
            onValueChange={(value) => setFormData({ ...formData, maritalStatus: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="UNMARRIED">Unmarried</SelectItem>
              <SelectItem value="WIDOW_WIDOWER">Widow / Widower</SelectItem>
              <SelectItem value="DIVORCED">Divorced</SelectItem>
              <SelectItem value="SEPARATED">Separated</SelectItem>
              <SelectItem value="DOESNT_MATTER">Doesn't matter</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Height (API) */}
        <div className="space-y-2">
          <Label htmlFor="heightIn">Height (कद) *</Label>
          <Select
            value={formData.heightIn}
            onValueChange={(value) => setFormData({ ...formData, heightIn: value })}
            onOpenChange={(open) => {
              if (open && heightOptions.length === 0) {
                fetchOptions("/api/heights", setHeightOptions, "height");
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select height" />
            </SelectTrigger>
            <SelectContent>
              {loadingDropdown === "height" ? (
                <div className="flex justify-center py-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              ) : (
                heightOptions.map((item) => (
                  <SelectItem key={item.id} value={item.height}>
                    {item.height}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Weight */}
        <div className="space-y-2">
          <Label htmlFor="weight">Weight (वजन) (kg) *</Label>
          <Select
            value={formData.weight}
            onValueChange={(value) => setFormData({ ...formData, weight: value })}
            onOpenChange={(open) => {
              if (open && weightOptions.length === 0) {
                fetchOptions("/api/weight/kgs", (data) => {
                  // Sort weights numerically (e.g., "45 kg" vs "100 kg")
                  const sortedData = [...data].sort((a: any, b: any) => {
                    const valA = parseInt(a.weightInKgs) || 0;
                    const valB = parseInt(b.weightInKgs) || 0;
                    return valA - valB;
                  });
                  setWeightOptions(sortedData);
                }, "weight");
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select weight" />
            </SelectTrigger>
            <SelectContent>
              {loadingDropdown === "weight" ? (
                <div className="flex justify-center py-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              ) : (
                weightOptions.map((item) => (
                  <SelectItem key={item.id} value={item.weightInKgs}>
                    {item.weightInKgs}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Physical Status */}
        <div className="space-y-2">
          <Label htmlFor="physicalStatus">Physical Status (शारीरिक स्थिति) *</Label>
          <Select
            value={formData.physicalStatus}
            onValueChange={(value) => setFormData({ ...formData, physicalStatus: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NORMAL">Normal</SelectItem>
              <SelectItem value="PHYSICALLY_CHALLENGED">Physically Challenged</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Mother Tongue (API) */}
        <div className="space-y-2">
          <Label htmlFor="motherTongue">Mother Tongue (मातृभाषा) *</Label>
          <Select
            value={formData.motherTongue}
            onValueChange={(value) => setFormData({ ...formData, motherTongue: value })}
            onOpenChange={(open) => {
              if (open && motherTongueOptions.length === 0) {
                fetchOptions("/api/mother-tongues", setMotherTongueOptions, "motherTongue");
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {loadingDropdown === "motherTongue" ? (
                <div className="flex justify-center py-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              ) : (
                motherTongueOptions.map((item) => (
                  <SelectItem key={item.id} value={item.languageName}>
                    {item.languageName}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Languages Known (multi-select using mother-tongues API) */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="languagesKnown">Languages Known (ज्ञात भाषाएं) *</Label>

          <Select
            onOpenChange={(open) => {
              if (open && motherTongueOptions.length === 0) {
                fetchOptions("/api/mother-tongues", setMotherTongueOptions, "motherTongue");
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select languages" />
            </SelectTrigger>
            <SelectContent>
              {loadingDropdown === "motherTongue" ? (
                <div className="flex justify-center py-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              ) : (
                motherTongueOptions.map((item) => (
                  <div
                    key={item.id}
                    className={`px-3 py-2 cursor-pointer rounded-md ${
                      formData.languagesKnown.includes(item.languageName)
                        ? "bg-primary text-white"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => handleLanguageSelect(item.languageName)}
                  >
                    {item.languageName}
                  </div>
                ))
              )}
            </SelectContent>
          </Select>

          {/* Selected languages badges */}
          {formData.languagesKnown.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.languagesKnown.map((lang: string) => (
                <div key={lang} className="flex items-center bg-gray-100 text-sm px-3 py-1 rounded-full">
                  {lang}
                  <X className="ml-2 w-3 h-3 cursor-pointer" onClick={() => handleLanguageSelect(lang)} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Gothra (API) */}
        <div className="space-y-2">
          <Label htmlFor="gothra">Gothra (गोत्र) *</Label>
          <Select
            value={formData.gothra}
            onValueChange={(value) => setFormData({ ...formData, gothra: value })}
            onOpenChange={(open) => {
              if (open && gothraOptions.length === 0) {
                fetchOptions("/api/gothras", setGothraOptions, "gothra");
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select gothra" />
            </SelectTrigger>
            <SelectContent>
              {loadingDropdown === "gothra" ? (
                <div className="flex justify-center py-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              ) : (
                gothraOptions.map((item) => (
                  <SelectItem key={item.id} value={item.gothraName}>
                    {item.gothraName}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Star (API) */}
        <div className="space-y-2">
          <Label htmlFor="star">Star (नक्षत्र)</Label>
          <Select
            value={formData.star}
            onValueChange={(value) => setFormData({ ...formData, star: value })}
            onOpenChange={(open) => {
              if (open && starOptions.length === 0) {
                fetchOptions("/api/stars", setStarOptions, "star");
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select star" />
            </SelectTrigger>
            <SelectContent>
              {loadingDropdown === "star" ? (
                <div className="flex justify-center py-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              ) : (
                starOptions.map((item) => (
                  <SelectItem key={item.id} value={item.starName}>
                    {item.starName}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Rashi (API) */}
        <div className="space-y-2">
          <Label htmlFor="rashi">Rashi (राशि)</Label>
          <Select
            value={formData.rashi}
            onValueChange={(value) => setFormData({ ...formData, rashi: value })}
            onOpenChange={(open) => {
              if (open && rashiOptions.length === 0) {
                fetchOptions("/api/raasi", setRashiOptions, "rashi");
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select rashi" />
            </SelectTrigger>
            <SelectContent>
              {loadingDropdown === "rashi" ? (
                <div className="flex justify-center py-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              ) : (
                rashiOptions.map((item) => (
                  <SelectItem key={item.id} value={item.name}>
                    {item.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Manglik */}
        <div className="space-y-2">
          <Label htmlFor="manglik">Manglik (मांगलिक) *</Label>
          <Select
            value={formData.manglik}
            onValueChange={(value) => setFormData({ ...formData, manglik: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="YES">Yes</SelectItem>
              <SelectItem value="NO">No</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Dietary Habits - include VEGAN and DOESNT_MATTER */}
        <div className="space-y-2">
          <Label htmlFor="dietaryHabits">Dietary Habits (खान-पान की आदतें) *</Label>
          <Select
            value={formData.dietaryHabits}
            onValueChange={(value) => setFormData({ ...formData, dietaryHabits: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="VEGETARIAN">Vegetarian</SelectItem>
              <SelectItem value="NON_VEGETARIAN">Non-Vegetarian</SelectItem>
              <SelectItem value="EGGETARIAN">Eggetarian</SelectItem>
              <SelectItem value="VEGAN">Vegan</SelectItem>
              <SelectItem value="DOESNT_MATTER">Doesn't matter</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Drinking Habits - map occasional to LIGHT_SOCIAL_DRINKER and add DOESNT_MATTER */}
        <div className="space-y-2">
          <Label htmlFor="drinkingHabits">Drinking Habits (पीने की आदतें) *</Label>
          <Select
            value={formData.drinkingHabits}
            onValueChange={(value) => setFormData({ ...formData, drinkingHabits: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NON_DRINKER">Non Drinker</SelectItem>
              <SelectItem value="LIGHT_SOCIAL_DRINKER">Light / Social Drinker</SelectItem>
              <SelectItem value="REGULAR_DRINKER">Regular Drinker</SelectItem>
              <SelectItem value="DOESNT_MATTER">Doesn't matter</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Smoking Habits - map occasional to LIGHT_SOCIAL_SMOKER and add DOESNT_MATTER */}
        <div className="space-y-2">
          <Label htmlFor="smokingHabits">Smoking Habits (धूम्रपान की आदतें) *</Label>
          <Select
            value={formData.smokingHabits}
            onValueChange={(value) => setFormData({ ...formData, smokingHabits: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NON_SMOKER">Non Smoker</SelectItem>
              <SelectItem value="LIGHT_SOCIAL_SMOKER">Light / Social Smoker</SelectItem>
              <SelectItem value="REGULAR_SMOKER">Regular Smoker</SelectItem>
              <SelectItem value="DOESNT_MATTER">Doesn't matter</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Has Disease field */}
        <div className="space-y-2">
          <Label htmlFor="hasDisease">Has Disease? (क्या कोई बीमारी है?) *</Label>
          <Select
            value={formData.hasDisease === undefined || formData.hasDisease === null ? "" : String(formData.hasDisease)}
            onValueChange={(value) => setFormData({ ...formData, hasDisease: value === "true" })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Yes</SelectItem>
              <SelectItem value="false">No</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Disease Details - only show if hasDisease is true */}
        {formData.hasDisease && (
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="diseaseDetails">Disease Details (बीमारी का विवरण) *</Label>
            <Textarea
              id="diseaseDetails"
              rows={3}
              placeholder="Please describe the disease details..."
              value={formData.diseaseDetails}
              onChange={(e) => setFormData({ ...formData, diseaseDetails: e.target.value })}
            />
          </div>
        )}
      </div>

      {/* About */}
      <div className="space-y-2">
        <Label htmlFor="about">About Me (मेरे बारे में)</Label>
        <Textarea
          id="about"
          rows={4}
          placeholder="Tell us about yourself..."
          value={formData.about}
          onChange={(e) => setFormData({ ...formData, about: e.target.value })}
        />
      </div>

      {/* Declaration block */}
      <div className="space-y-4 pt-6 border-t">
        <h3 className="font-semibold text-lg">Declaration Text (घोषणा पाठ)</h3>
        
        <p className="text-muted-foreground leading-relaxed">
          {DECLARATION_TEXT}
        </p>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={formData.declarationAccepted}
            onChange={(e) => setFormData({ ...formData, declarationAccepted: e.target.checked })}
            className="w-4 h-4 rounded border"
          />
          <span className="text-sm font-medium">I have read and accept the declaration</span>
        </label>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 w-4 h-4" /> Back
        </Button>
        <Button type="submit" className="bg-gradient-primary hover:opacity-90" disabled={saving}>
          {saving ? <Loader2 className="mr-2 w-4 h-4 animate-spin" /> : <>Next <ArrowRight className="ml-2 w-4 h-4" /></>}
        </Button>
      </div>
    </form>
  );
};

export default Step2BasicDetails;
