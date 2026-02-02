import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface StepProps {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

const Step6PartnerPreferences = ({ data, onNext, onBack }: StepProps) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:9099";

  // enum option arrays (label shown to user, value sent to backend)
  const maritalStatusOptions = [
    { label: "Unmarried", value: "UNMARRIED" },
    { label: "Widow / Widower", value: "WIDOW_WIDOWER" },
    { label: "Divorced", value: "DIVORCED" },
    { label: "Separated", value: "SEPARATED" },
    { label: "Doesn't Matter", value: "DOESNT_MATTER" },
  ];
  const haveChildrenOptions = [
    { label: "Doesn't Matter", value: "DOESNT_MATTER" },
    { label: "Yes - Living Together", value: "YES_LIVING_TOGETHER" },
    { label: "Yes - Not Living Together", value: "YES_NOT_LIVING_TOGETHER" },
    { label: "No", value: "NO" },
  ];
  const physicalStatusOptions = [
    { label: "Normal", value: "NORMAL" },
    { label: "Physically Challenged", value: "PHYSICALLY_CHALLENGED" },
  ];
  const religionOptions = [
    { label: "Hindu", value: "HINDU" },
    { label: "Muslim", value: "MUSLIM" },
    { label: "Christian", value: "CHRISTIAN" },
    { label: "Sikh", value: "SIKH" },
    { label: "Buddhist", value: "BUDDHIST" },
    { label: "Jain", value: "JAIN" },
    { label: "Other", value: "OTHER" },
    { label: "Prefer not to say", value: "PREFER_NOT_TO_SAY" },
  ];
  const manglikOptions = [
    { label: "Yes", value: "YES" },
    { label: "No", value: "NO" },
    { label: "Doesn't Matter", value: "DOESNT_MATTER" },
  ];
  const educationTypeOptions = [
    { label: "Any", value: "ANY" },
    { label: "Any Degree", value: "ANY_DEGREE" },
    { label: "Professional Degree", value: "PROFESSIONAL_DEGREE" },
    { label: "Specific Degree", value: "SPECIFIC_DEGREE" },
  ];
  const employmentOptions = [
    { label: "Government", value: "GOVERNMENT" },
    { label: "Defence", value: "DEFENCE" },
    { label: "Private", value: "PRIVATE" },
    { label: "Business", value: "BUSINESS" },
    { label: "Self Employed", value: "SELF_EMPLOYED" },
    { label: "Student", value: "STUDENT" },
    { label: "Not Working", value: "NOT_WORKING" },
    { label: "Other", value: "OTHER" },
  ];
  const dietaryOptions = [
    { label: "Vegetarian", value: "VEGETARIAN" },
    { label: "Non Vegetarian", value: "NON_VEGETARIAN" },
    { label: "Eggetarian", value: "EGGETARIAN" },
    { label: "Vegan", value: "VEGAN" },
    { label: "Doesn't Matter", value: "DOESNT_MATTER" },
  ];
  const smokingOptions = [
    { label: "Non Smoker", value: "NON_SMOKER" },
    { label: "Light / Social Smoker", value: "LIGHT_SOCIAL_SMOKER" },
    { label: "Regular Smoker", value: "REGULAR_SMOKER" },
    { label: "Doesn't Matter", value: "DOESNT_MATTER" },
  ];
  const drinkingOptions = [
    { label: "Non Drinker", value: "NON_DRINKER" },
    { label: "Light / Social Drinker", value: "LIGHT_SOCIAL_DRINKER" },
    { label: "Regular Drinker", value: "REGULAR_DRINKER" },
    { label: "Doesn't Matter", value: "DOESNT_MATTER" },
  ];
  const genderOptions = [
    { label: "Female", value: "FEMALE" },
    { label: "Male", value: "MALE" },
    { label: "Other", value: "OTHER" },
  ];

  // add dynamic dropdown states
  const [heights, setHeights] = useState<any[]>([]);
  const [castes, setCastes] = useState<any[]>([]);
  const [subCastes, setSubCastes] = useState<any[]>([]);
  const [gothras, setGothras] = useState<any[]>([]);
  const [stars, setStars] = useState<any[]>([]);
  const [rashiList, setRashiList] = useState<any[]>([]); // added rashi state
  const [annualIncomeList, setAnnualIncomeList] = useState<any[]>([]);
  const [motherTongueOptions, setMotherTongueOptions] = useState<any[]>([]);
  const [countries, setCountries] = useState<any[]>([]);
  const [citizenships, setCitizenships] = useState<any[]>([]);
  const [occupationCategories, setOccupationCategories] = useState<any[]>([]);
  const [educationCategories, setEducationCategories] = useState<any[]>([]);
  const [dropdownLoading, setDropdownLoading] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    minAge: data.minAge ?? "",
    maxAge: data.maxAge ?? "",
    minHeight: data.minHeight ?? "",
    maxHeight: data.maxHeight ?? "",
    gender: data.gender ?? "",
    maritalStatus: data.maritalStatus ?? "",
    haveChildren: data.haveChildren ?? null,
    physicalStatus: data.physicalStatus ?? "",
    motherTongues: Array.isArray(data.motherTongues) ? data.motherTongues : [],
    // force religion to always be HINDU (backend value) regardless of incoming data
    religion: "HINDU",
    castes: Array.isArray(data.castes) ? data.castes : [],
    subCastes: Array.isArray(data.subCastes) ? data.subCastes : [],
    gothras: Array.isArray(data.gothras) ? data.gothras : [],
    manglik: data.manglik ?? "",
    rashis: Array.isArray(data.rashis) ? data.rashis : [],
    educationType: data.educationType ?? "",
    educationLevels: Array.isArray(data.educationLevels) ? data.educationLevels : [],
    employedIn: Array.isArray(data.employedIn) ? data.employedIn : [],
    occupations: Array.isArray(data.occupations) ? data.occupations : [],
    // annualIncome now stores incomeRange string (e.g., "0-2 LPA")
    annualIncome: data.annualIncome ?? "",
    dietaryHabits: data.dietaryHabits ?? "",
    smokingHabits: data.smokingHabits ?? "",
    drinkingHabits: data.drinkingHabits ?? "",
    city: data.city ?? "",
    countriesLivedIn: Array.isArray(data.countriesLivedIn) ? data.countriesLivedIn : [],
    citizenships: Array.isArray(data.citizenships) ? data.citizenships : [],
    stars: Array.isArray(data.stars) ? data.stars : [],
    aboutMyPartner: data.aboutMyPartner ?? "",
  });

  // new: fetch dropdown data (heights + other dynamic lists)
  const fetchDropdownData = async (type: string) => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) return;
      setDropdownLoading(type);
      let url = "";

      switch (type) {
        case "heights":
          url = `${baseUrl}/api/heights`;
          break;
        case "countries":
          // removed stray trailing space and use correct endpoint
          url = `${baseUrl}/api/country`;
          break;
        case "citizenships":
          // use the same API as countries
          url = `${baseUrl}/api/country`;
          break;
        case "rashi":
          // API returns [{ id, name }]
          url = `${baseUrl}/api/raasi`;
          break;
        case "castes":
          url = `${baseUrl}/api/castes`;
          break;
        case "subCastes":
          url = `${baseUrl}/api/sub-caste`;
          break;
        case "gothras":
          url = `${baseUrl}/api/gothras`;
          break;
        case "stars":
          url = `${baseUrl}/api/stars`;
          break;
        case "annualIncome":
          url = `${baseUrl}/api/annual-income`;
          break;
        case "occupations":
          url = `${baseUrl}/api/occupation/categories`;
          break;
        case "education":
          url = `${baseUrl}/api/education/categories`;
          break;
        case "motherTongue":
          url = `${baseUrl}/api/mother-tongues`;
          break;
        default:
          return;
      }

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token") || ""}` },
      });
      if (!res.ok) throw new Error("Failed to fetch " + type);
      const json = await res.json();
      const list = json.payload || [];

      switch (type) {
        case "heights":
          setHeights(list);
          break;
        case "countries":
          setCountries(list);
          break;
        case "citizenships":
          setCitizenships(list);
          break;
        case "rashi":
          setRashiList(list);
          break;
        case "castes":
          setCastes(list);
          break;
        case "subCastes":
          setSubCastes(list);
          break;
        case "gothras":
          setGothras(list);
          break;
        case "stars":
          setStars(list);
          break;
        case "annualIncome":
          setAnnualIncomeList(list);
          break;
        case "occupations":
          setOccupationCategories(list);
          break;
        case "education":
          // Keep full category structure with nested educationOptions
          setEducationCategories(list);
          break;
        case "motherTongue":
          setMotherTongueOptions(list);
          break;
      }
    } catch (err) {
      toast({
        title: "Error",
        description: `Failed to load ${type}.`,
        variant: "destructive",
      });
    } finally {
      setDropdownLoading(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

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

    const payload = {
      minAge: formData.minAge !== "" ? Number(formData.minAge) : null,
      maxAge: formData.maxAge !== "" ? Number(formData.maxAge) : null,
      minHeight: formData.minHeight,
      maxHeight: formData.maxHeight,
      gender: formData.gender || null,
      maritalStatus: formData.maritalStatus || null,
      haveChildren: formData.haveChildren || null,
      physicalStatus: formData.physicalStatus || null,
      motherTongues: formData.motherTongues.length > 0 ? formData.motherTongues : null,
      // always send HINDU to backend
      religion: "HINDU",
      castes: formData.castes.length > 0 ? formData.castes : null,
      subCastes: formData.subCastes.length > 0 ? formData.subCastes : null,
      gothras: formData.gothras.length > 0 ? formData.gothras : null,
      manglik: formData.manglik || null,
      rashis: formData.rashis.length > 0 ? formData.rashis : null,
      educationType: formData.educationType || null,
      educationLevels: formData.educationLevels.length > 0 ? formData.educationLevels : null,
      employedIn: formData.employedIn.length > 0 ? formData.employedIn : null,
      occupations: formData.occupations.length > 0 ? formData.occupations : null,
      annualIncome: formData.annualIncome || null,
      dietaryHabits: formData.dietaryHabits || null,
      smokingHabits: formData.smokingHabits || null,
      drinkingHabits: formData.drinkingHabits || null,
      countriesLivedIn: formData.countriesLivedIn.length > 0 ? formData.countriesLivedIn : null,
      citizenships: formData.citizenships.length > 0 ? formData.citizenships : null,
      stars: formData.stars.length > 0 ? formData.stars : null,
      aboutMyPartner: formData.aboutMyPartner || null,
    };

    // compute ageValid expected by backend: true when either age is not set or max >= min
    {
      const min = payload.minAge;
      const max = payload.maxAge;
      payload["ageValid"] = (min === null || max === null) ? true : (max >= min);
    }

    try {
      const res = await fetch(`${baseUrl}/api/profile-preference/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (res.ok) {
        toast({
          title: "Saved",
          description: result.message || "Preference saved successfully.",
          variant: "default",
        });
        onNext(result.payload || payload);
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to save preferences.",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Network Error",
        description: "Could not save preference. Try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Age */}
        <div className="space-y-2">
          <Label>Minimum Age (न्यूनतम आयु)</Label>
          <Select value={formData.minAge?.toString() ?? ""} onValueChange={(v) => setFormData({ ...formData, minAge: v })}>
            <SelectTrigger><SelectValue placeholder="Select min age" /></SelectTrigger>
            <SelectContent>
              {Array.from({ length: 53 }, (_, i) => i + 18).map((age) => (
                <SelectItem key={age} value={age.toString()}>{age}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Maximum Age (अधिकतम आयु)</Label>
          <Select value={formData.maxAge?.toString() ?? ""} onValueChange={(v) => setFormData({ ...formData, maxAge: v })}>
            <SelectTrigger><SelectValue placeholder="Select max age" /></SelectTrigger>
            <SelectContent>
              {Array.from({ length: 53 }, (_, i) => i + 18).map((age) => (
                <SelectItem key={age} value={age.toString()}>{age}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Height */}
        <div className="space-y-2">
          <Label>Minimum Height (न्यूनतम कद)</Label>
          <Select
            value={formData.minHeight ?? ""}
            onValueChange={(v) => setFormData({ ...formData, minHeight: v })}
            onOpenChange={(open) => { if (open && heights.length === 0) fetchDropdownData("heights"); }}
          >
            <SelectTrigger><SelectValue placeholder="Select min height" /></SelectTrigger>
            <SelectContent>
              {dropdownLoading === "heights" ? (
                <div className="text-center py-2"><Loader2 className="animate-spin w-4 h-4 mx-auto" /></div>
              ) : (
                heights.map((h: any) => <SelectItem key={h.id || h.height} value={h.height}>{h.height}</SelectItem>)
              )}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Maximum Height (अधिकतम कद)</Label>
          <Select
            value={formData.maxHeight ?? ""}
            onValueChange={(v) => setFormData({ ...formData, maxHeight: v })}
            onOpenChange={(open) => { if (open && heights.length === 0) fetchDropdownData("heights"); }}
          >
            <SelectTrigger><SelectValue placeholder="Select max height" /></SelectTrigger>
            <SelectContent>
              {dropdownLoading === "heights" ? (
                <div className="text-center py-2"><Loader2 className="animate-spin w-4 h-4 mx-auto" /></div>
              ) : (
                heights.map((h: any) => <SelectItem key={h.id || h.height} value={h.height}>{h.height}</SelectItem>)
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Gender */}
        <div className="space-y-2">
          <Label>Gender (लिंग)</Label>
          <Select value={formData.gender} onValueChange={(v) => setFormData({ ...formData, gender: v })}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              {genderOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Marital Status */}
        <div className="space-y-2">
          <Label>Marital Status (वैवाहिक स्थिति)</Label>
          <Select value={formData.maritalStatus} onValueChange={(v) => setFormData({ ...formData, maritalStatus: v })}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              {maritalStatusOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Have Children */}
        <div className="space-y-2">
          <Label>Have Children (बच्चे हैं)</Label>
          <Select value={formData.haveChildren} onValueChange={(v) => setFormData({ ...formData, haveChildren: v })}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              {haveChildrenOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Physical Status */}
        <div className="space-y-2">
          <Label>Physical Status (शारीरिक स्थिति)</Label>
          <Select value={formData.physicalStatus} onValueChange={(v) => setFormData({ ...formData, physicalStatus: v })}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              {physicalStatusOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Mother Tongue / Religion */}
        <div className="space-y-2">
          <Label>Mother Tongue (मातृभाषा)</Label>
          <Select
            value={formData.motherTongues[0] || ""}
            onValueChange={(v) => setFormData({ ...formData, motherTongues: [v] })}
            onOpenChange={(open) => { if (open && motherTongueOptions.length === 0) fetchDropdownData("motherTongue"); }}
          >
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              {dropdownLoading === "motherTongue" ? (
                <div className="text-center py-2"><Loader2 className="animate-spin w-4 h-4 mx-auto" /></div>
              ) : (
                motherTongueOptions.map((m: any) => <SelectItem key={m.id || m.languageName} value={m.languageName}>{m.languageName}</SelectItem>)
              )}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Religion (धर्म)</Label>
          {/* non-editable display; visible text "Hindu" while backend receives "HINDU" */}
          <Input value="Hindu" disabled />
          {/* keep form state consistent (already set above). no select provided. */}
        </div>

        {/* Caste / SubCaste / Gothra */}
        <div className="space-y-2">
          <Label>Caste (जाति)</Label>
          <Select
            value={formData.castes[0] || ""}
            onValueChange={(v) => setFormData({ ...formData, castes: [v] })}
            onOpenChange={(open) => { if (open && castes.length === 0) fetchDropdownData("castes"); }}
          >
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              {dropdownLoading === "castes" ? (
                <div className="text-center py-2"><Loader2 className="animate-spin w-4 h-4 mx-auto" /></div>
              ) : (
                castes.map((c: any) => <SelectItem key={c.id || c.casteName} value={c.casteName}>{c.casteName}</SelectItem>)
              )}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Sub Caste (उप जाति)</Label>
          <Select
            value={formData.subCastes[0] || ""}
            onValueChange={(v) => setFormData({ ...formData, subCastes: [v] })}
            onOpenChange={(open) => { if (open && subCastes.length === 0) fetchDropdownData("subCastes"); }}
          >
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              {dropdownLoading === "subCastes" ? (
                <div className="text-center py-2"><Loader2 className="animate-spin w-4 h-4 mx-auto" /></div>
              ) : (
                subCastes.map((s: any) => <SelectItem key={s.id || s.subCasteName} value={s.subCasteName}>{s.subCasteName}</SelectItem>)
              )}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Gothra (गोत्र)</Label>
          <Select
            value={formData.gothras[0] || ""}
            onValueChange={(v) => setFormData({ ...formData, gothras: [v] })}
            onOpenChange={(open) => { if (open && gothras.length === 0) fetchDropdownData("gothras"); }}
          >
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              {dropdownLoading === "gothras" ? (
                <div className="text-center py-2"><Loader2 className="animate-spin w-4 h-4 mx-auto" /></div>
              ) : (
                gothras.map((g: any) => <SelectItem key={g.id || g.gothraName} value={g.gothraName}>{g.gothraName}</SelectItem>)
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Manglik */}
        <div className="space-y-2">
          <Label>Manglik (मांगलिक)</Label>
          <Select value={formData.manglik} onValueChange={(v) => setFormData({ ...formData, manglik: v })}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              {manglikOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Rashi (Raasi) - comes after Manglik */}
        <div className="space-y-2">
          <Label>Rashi (राशि)</Label>
          <Select
            value={formData.rashis[0] || ""}
            onValueChange={(v) => setFormData({ ...formData, rashis: [v] })}
            onOpenChange={(open) => { if (open && rashiList.length === 0) fetchDropdownData("rashi"); }}
          >
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              {dropdownLoading === "rashi" ? (
                <div className="text-center py-2"><Loader2 className="animate-spin w-4 h-4 mx-auto" /></div>
              ) : (
                rashiList.map((r: any) => <SelectItem key={r.id || r.name} value={r.name}>{r.name}</SelectItem>)
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Star - moved to appear after Rashi */}
        <div className="space-y-2">
          <Label>Star (नक्षत्र)</Label>
          <Select
            value={formData.stars[0] || ""}
            onValueChange={(v) => setFormData({ ...formData, stars: [v] })}
            onOpenChange={(open) => { if (open && stars.length === 0) fetchDropdownData("stars"); }}
          >
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              {dropdownLoading === "stars" ? (
                <div className="text-center py-2"><Loader2 className="animate-spin w-4 h-4 mx-auto" /></div>
              ) : (
                stars.map((s: any) => <SelectItem key={s.id || s.starName} value={s.starName}>{s.starName}</SelectItem>)
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Education */}
        <div className="space-y-2">
          <Label>Education Type (शिक्षा का प्रकार)</Label>
          <Select value={formData.educationType} onValueChange={(v) => setFormData({ ...formData, educationType: v })}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              {educationTypeOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Education Levels (शिक्षा स्तर)</Label>
          <Select
            value={formData.educationLevels[0] || ""}
            onValueChange={(v) => setFormData({ ...formData, educationLevels: [v] })}
            onOpenChange={(open) => { if (open && educationCategories.length === 0) fetchDropdownData("education"); }}
          >
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              {dropdownLoading === "education" ? (
                <div className="text-center py-2"><Loader2 className="animate-spin w-4 h-4 mx-auto" /></div>
              ) : (
                educationCategories.map((cat: any) => (
                  <div key={cat.id}>
                    <div className="px-2 py-1 font-semibold text-sm text-gray-600">
                      {cat.categoryName}
                    </div>
                    {(cat.educationOptions || []).map((opt: any) => (
                      <SelectItem key={opt.id} value={opt.optionName}>
                        {opt.optionName}
                      </SelectItem>
                    ))}
                  </div>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Employment / Occupation / Income */}
        <div className="space-y-2">
          <Label>Employed In (कार्यरत)</Label>
          <Select value={formData.employedIn[0] || ""} onValueChange={(v) => setFormData({ ...formData, employedIn: [v] })}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              {employmentOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Occupation (व्यवसाय)</Label>
          <Select
            value={formData.occupations[0] || ""}
            onValueChange={(v) => setFormData({ ...formData, occupations: [v] })}
            onOpenChange={(open) => { if (open && occupationCategories.length === 0) fetchDropdownData("occupations"); }}
          >
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              {dropdownLoading === "occupations" ? (
                <div className="text-center py-2"><Loader2 className="animate-spin w-4 h-4 mx-auto" /></div>
              ) : (
                occupationCategories.map((cat: any) => (
                  <div key={cat.id}>
                    <div className="px-2 py-1 font-semibold text-sm text-gray-600">
                      {cat.categoryName}
                    </div>
                    {(cat.occupationOptions || []).map((opt: any) => (
                      <SelectItem key={opt.id} value={opt.optionName}>
                        {opt.optionName}
                      </SelectItem>
                    ))}
                  </div>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Annual Income (वार्षिक आय)</Label>
          <Select
            value={formData.annualIncome || ""}
            onValueChange={(v) => setFormData({ ...formData, annualIncome: v })}
            onOpenChange={(open) => { if (open && annualIncomeList.length === 0) fetchDropdownData("annualIncome"); }}
          >
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              {dropdownLoading === "annualIncome" ? (
                <div className="text-center py-2"><Loader2 className="animate-spin w-4 h-4 mx-auto" /></div>
              ) : (
                annualIncomeList.map((it: any) => <SelectItem key={it.id || it.incomeRange} value={it.incomeRange}>{it.incomeRange}</SelectItem>)
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Habits */}
        <div className="space-y-2">
          <Label>Dietary Habits (खान-पान की आदतें)</Label>
          <Select value={formData.dietaryHabits} onValueChange={(v) => setFormData({ ...formData, dietaryHabits: v })}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              {dietaryOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Smoking Habits (धूम्रपान की आदतें)</Label>
          <Select value={formData.smokingHabits} onValueChange={(v) => setFormData({ ...formData, smokingHabits: v })}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              {smokingOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Drinking Habits (पीने की आदतें)</Label>
          <Select value={formData.drinkingHabits} onValueChange={(v) => setFormData({ ...formData, drinkingHabits: v })}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              {drinkingOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Location / Citizenship */}
        {/* Citizenship -> Country -> City -> About My Partner (reordered) */}
        <div className="space-y-2">
          <Label>Citizenship (नागरिकता)</Label>
          <Select
            value={formData.citizenships[0] || ""}
            onValueChange={(v) => setFormData({ ...formData, citizenships: [v] })}
            onOpenChange={(open) => { if (open && (citizenships.length === 0)) fetchDropdownData("citizenships"); }}
          >
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              {dropdownLoading === "citizenships" ? (
                <div className="text-center py-2"><Loader2 className="animate-spin w-4 h-4 mx-auto" /></div>
              ) : (
                citizenships.map((c: any) => <SelectItem key={c.id || c.countryName || c.name} value={c.countryName || c.name}>{c.countryName || c.name}</SelectItem>)
              )}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Country (देश)</Label>
          <Select
            value={formData.countriesLivedIn[0] || ""}
            onValueChange={(v) => setFormData({ ...formData, countriesLivedIn: [v] })}
            onOpenChange={(open) => { if (open && countries.length === 0) fetchDropdownData("countries"); }}
          >
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              {dropdownLoading === "countries" ? (
                <div className="text-center py-2"><Loader2 className="animate-spin w-4 h-4 mx-auto" /></div>
              ) : (
                countries.map((c: any) => <SelectItem key={c.id || c.countryName || c.name} value={c.countryName || c.name}>{c.countryName || c.name}</SelectItem>)
              )}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>City (शहर)</Label>
          <Input value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>About My Partner (मेरे साथी के बारे में)</Label>
          <Textarea rows={4} value={formData.aboutMyPartner} onChange={(e) => setFormData({ ...formData, aboutMyPartner: e.target.value })} />
        </div>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 w-4 h-4" /> Back
        </Button>
        <Button type="submit" className="bg-gradient-primary hover:opacity-90" disabled={saving}>
          {saving ? <Loader2 className="mr-2 w-4 h-4 animate-spin" /> : null}
          {!saving ? <>Next <ArrowRight className="ml-2 w-4 h-4" /></> : "Saving..."}
        </Button>
      </div>
    </form>
  );
};

export default Step6PartnerPreferences;
