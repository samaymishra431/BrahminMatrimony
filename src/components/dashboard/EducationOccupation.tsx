import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, GraduationCap, Briefcase, Loader2, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EducationCategory {
  id: number;
  categoryName: string;
  educationOptions: { id: number; optionName: string }[];
}
interface OccupationCategory {
  id: number;
  categoryName: string;
  occupationOptions: { id: number; optionName: string }[];
}
interface AnnualIncome {
  id: number;
  incomeRange: string;
}
interface CurrencyCountry {
  id: number;
  currencyCountryName: string;
}
interface Country {
  id: number;
  countryName: string;
}

const REQUIRED_FIELDS = [
  "highestEducation",
  "additionalDegree",
  "collegeInstitution",
  "educationInDetail",
  "employedIn",
  "occupation",
  "organizationName",
  "annualIncome",
  "incomeCurrency",
  "workCountry",
  "workCity",
];

const FIELD_LABELS: Record<string, string> = {
  highestEducation: "Highest Education",
  additionalDegree: "Additional Degree",
  collegeInstitution: "College / Institution",
  educationInDetail: "Education Details",
  employedIn: "Employed In",
  occupation: "Occupation",
  organizationName: "Organization Name",
  annualIncome: "Annual Income",
  incomeCurrency: "Income Currency",
  workCountry: "Work Country",
  workCity: "Work City",
  occupationInDetail: "Occupation Details",
};

const EducationOccupation = () => {
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState<Set<string>>(new Set());

  // Dropdown states
  const [educationCategories, setEducationCategories] = useState<EducationCategory[]>([]);
  const [occupationCategories, setOccupationCategories] = useState<OccupationCategory[]>([]);
  const [annualIncomeList, setAnnualIncomeList] = useState<AnnualIncome[]>([]);
  const [currencyCountries, setCurrencyCountries] = useState<CurrencyCountry[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loadingDropdown, setLoadingDropdown] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          setError("Authentication required. Please log in again.");
          setUser({});
          setFormData({});
          setLoading(false);
          return;
        }

        const baseUrl = import.meta.env.VITE_API_BASE_URL;
        const res = await fetch(`${baseUrl}/api/education-occupation`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const result = await res.json();

        // Handle "not found" (404) or empty payload as "no data yet"
        if (!res.ok) {
          if (res.status === 404) {
            // Treat as empty record so UI shows fields with N/A and user can edit
            setUser({});
            setFormData({});
            setLoading(false);
            return;
          } else {
            throw new Error(result.message || "Failed to fetch data");
          }
        }

        // If response ok but payload is null/empty, treat as empty record
        if (!result.payload) {
          setUser({});
          setFormData({});
          setLoading(false);
          return;
        }

        setUser(result.payload);
        setFormData(result.payload);
      } catch (err: any) {
        console.error("Error fetching education-occupation:", err);
        // Keep UI usable by showing empty form when fetch fails
        setUser({});
        setFormData({});
        setError("Failed to load education & occupation details.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Prefetch dropdown options for fields with values when entering edit mode
  const prefetchDropdownOptions = () => {
    if (!user) return;
    if (user.highestEducation && educationCategories.length === 0) {
      fetchOptions("/api/education/categories", setEducationCategories, "education");
    }
    if (user.additionalDegree && educationCategories.length === 0) {
      fetchOptions("/api/education/categories", setEducationCategories, "education");
    }
    if (user.occupation && occupationCategories.length === 0) {
      fetchOptions("/api/occupation/categories", setOccupationCategories, "occupation");
    }
    if (user.annualIncome && annualIncomeList.length === 0) {
      fetchOptions("/api/annual-income", setAnnualIncomeList, "income", baseUrl);
    }
    if (user.incomeCurrency && currencyCountries.length === 0) {
      fetchOptions("/api/currency-country", setCurrencyCountries, "currency", baseUrl);
    }
    if (user.workCountry && countries.length === 0) {
      fetchOptions("/api/country", setCountries, "country", baseUrl);
    }
  };

  const handleEditToggle = () => {
    setEditMode((prev) => !prev);
    setFormData(user);
    // Prefetch dropdowns for current values so Select shows label
    if (!editMode) {
      prefetchDropdownOptions();
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
    if (value && value.trim() !== "") {
      setValidationErrors((prev) => {
        const newErrors = new Set(prev);
        newErrors.delete(field);
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const errors = new Set<string>();
    REQUIRED_FIELDS.forEach((field) => {
      if (!formData[field] || formData[field].toString().trim() === "") {
        errors.add(field);
      }
    });
    setValidationErrors(errors);
    return errors;
  };

  const handleSave = async () => {
    if (!formData) return;

    const errors = validateForm();
    if (errors.size > 0) {
      const firstErrorField = Array.from(errors)[0];
      const label = FIELD_LABELS[firstErrorField] || firstErrorField;
      toast({
        title: "Validation Error",
        description: `${label} is required.`,
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    const token = sessionStorage.getItem("token");
    const baseUrl = import.meta.env.VITE_API_BASE_URL;

    try {
      const res = await fetch(`${baseUrl}/api/education-occupation`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.payload) {
        setUser(data.payload);
        setEditMode(false);
        toast({
          title: "Updated Successfully",
          description: "Your education & occupation details have been saved.",
        });
      } else {
        throw new Error(data.message || "Failed to update.");
      }
    } catch (err: any) {
      console.error("Error updating education-occupation:", err);
      toast({
        title: "Update Failed",
        description: err.message || "Unable to save changes.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Generic fetch for dropdowns
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const fetchOptions = async (
    endpoint: string,
    setter: (data: any[]) => void,
    key: string,
    customBaseUrl?: string
  ) => {
    try {
      setLoadingDropdown(key);
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${customBaseUrl || baseUrl}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          accept: "application/json",
        },
      });
      const result = await response.json();
      if (result.statusCode === 200 || result.statusCode === "OK") {
        setter(result.payload || []);
      } else {
        toast({
          title: "Failed to load options",
          description: result.message || "Could not fetch dropdown data.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to load dropdown options.",
        variant: "destructive",
      });
    } finally {
      setLoadingDropdown(null);
    }
  };

  // Add: mapping and helper to show user-friendly labels for enum values
  const EMPLOYED_IN_LABELS: Record<string, string> = {
    GOVERNMENT: "Government",
    PRIVATE: "Private",
    BUSINESS: "Business",
    SELF_EMPLOYED: "Self Employed",
    NOT_WORKING: "Not Working",
  };

  const humanizeEnum = (value?: string) => {
    if (!value) return "N/A";
    if (EMPLOYED_IN_LABELS[value]) return EMPLOYED_IN_LABELS[value];
    // fallback: turn "SOME_ENUM_VALUE" -> "Some Enum Value"
    return value
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="w-6 h-6 animate-spin text-primary mr-2" />
        <p className="text-muted-foreground">
          Loading education & occupation details...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-center text-destructive font-medium mt-10">{error}</p>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Card */}
      <Card className="border-0 shadow-medium">
        <CardHeader className="pb-4">
          <div className="flex flex-row items-center justify-between w-full">
            <CardTitle className="text-2xl md:text-3xl">
              Education & Occupation
            </CardTitle>
            {!editMode ? (
              <Button
                onClick={handleEditToggle}
                className="bg-gradient-primary w-auto"
              >
                <Edit className="w-4 h-4 mr-2" /> Edit
              </Button>
            ) : (
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-green-600 hover:bg-green-700 w-auto"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Education Details */}
      <Card className="border-0 shadow-medium">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary" />
            </div>
            <CardTitle className="text-xl">Education Details</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {/* Highest Education Dropdown */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-3 md:p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-smooth">
              <span className="font-medium text-muted-foreground text-sm">
                Highest Education (उच्चतम शिक्षा) <span className="text-red-500">*</span>
              </span>
              {editMode ? (
                <Select
                  value={formData.highestEducation || ""}
                  onValueChange={(value) => handleChange("highestEducation", value)}
                  onOpenChange={(open) => {
                    if (open && educationCategories.length === 0)
                      fetchOptions("/api/education/categories", setEducationCategories, "education");
                  }}
                >
                  <SelectTrigger className={validationErrors.has("highestEducation") ? "w-full sm:w-[60%] border-red-500 border-2" : "w-full sm:w-[60%]"}>
                    <SelectValue placeholder="Select highest education" />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingDropdown === "education" ? (
                      <div className="flex justify-center items-center p-2">
                        <Loader2 className="animate-spin w-4 h-4 mr-2" /> Loading...
                      </div>
                    ) : (
                      educationCategories.map((cat) => (
                        <div key={cat.id}>
                          <div className="px-2 py-1 font-semibold text-sm text-gray-600">
                            {cat.categoryName}
                          </div>
                          {cat.educationOptions.map((opt) => (
                            <SelectItem key={opt.id} value={opt.optionName}>
                              {opt.optionName}
                            </SelectItem>
                          ))}
                        </div>
                      ))
                    )}
                  </SelectContent>
                </Select>
              ) : (
                <span className="font-semibold text-foreground text-sm sm:text-base break-all">
                  {formData.highestEducation || "N/A"}
                </span>
              )}
            </div>

            {/* Additional Degree Dropdown */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-3 md:p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-smooth">
              <span className="font-medium text-muted-foreground text-sm">
                Additional Degree (अतिरिक्त डिग्री) <span className="text-red-500">*</span>
              </span>
              {editMode ? (
                <Select
                  value={formData.additionalDegree || ""}
                  onValueChange={(value) => handleChange("additionalDegree", value)}
                  onOpenChange={(open) => {
                    if (open && educationCategories.length === 0)
                      fetchOptions("/api/education/categories", setEducationCategories, "education");
                  }}
                >
                  <SelectTrigger className={validationErrors.has("additionalDegree") ? "w-full sm:w-[60%] border-red-500 border-2" : "w-full sm:w-[60%]"}>
                    <SelectValue placeholder="Select additional degree" />
                  </SelectTrigger>
                  <SelectContent>
                    {educationCategories.map((cat) => (
                      <div key={cat.id}>
                        <div className="px-2 py-1 font-semibold text-sm text-gray-600">
                          {cat.categoryName}
                        </div>
                        {cat.educationOptions.map((opt) => (
                          <SelectItem key={opt.id} value={opt.optionName}>
                            {opt.optionName}
                          </SelectItem>
                        ))}
                      </div>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <span className="font-semibold text-foreground text-sm sm:text-base break-all">
                  {formData.additionalDegree || "N/A"}
                </span>
              )}
            </div>

            {/* College / Institution */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-3 md:p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-smooth">
              <span className="font-medium text-muted-foreground text-sm">
                College / Institution (कॉलेज / संस्थान) <span className="text-red-500">*</span>
              </span>
              {editMode ? (
                <Input
                  value={formData.collegeInstitution || ""}
                  onChange={(e) => handleChange("collegeInstitution", e.target.value)}
                  className={validationErrors.has("collegeInstitution") ? "w-full sm:w-[60%] border-red-500 border-2" : "w-full sm:w-[60%]"}
                />
              ) : (
                <span className="font-semibold text-foreground text-sm sm:text-base break-all">
                  {formData.collegeInstitution || "N/A"}
                </span>
              )}
            </div>
          </div>

          <div className="mt-6 pt-6 border-t">
            <h3 className="font-semibold mb-3 text-lg">
              Education Details (in brief) (शिक्षा विवरण) <span className="text-red-500">*</span>
            </h3>
            {editMode ? (
              <textarea
                value={formData.educationInDetail || ""}
                onChange={(e) =>
                  handleChange("educationInDetail", e.target.value)
                }
                className={validationErrors.has("educationInDetail") ? "w-full border rounded-md p-3 min-h-[100px] border-red-500 border-2" : "w-full border rounded-md p-3 min-h-[100px]"}
              />
            ) : (
              <p className="text-muted-foreground leading-relaxed">
                {formData.educationInDetail || "N/A"}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Occupation Details */}
      <Card className="border-0 shadow-medium">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-primary" />
            </div>
            <CardTitle className="text-xl">Occupation Details</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {/* Employed In Dropdown */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-3 md:p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-smooth">
              <span className="font-medium text-muted-foreground text-sm">
                Employed In (कार्यरत) <span className="text-red-500">*</span>
              </span>
              {editMode ? (
                <Select
                  value={formData.employedIn || ""}
                  onValueChange={(value) => handleChange("employedIn", value)}
                >
                  <SelectTrigger className={validationErrors.has("employedIn") ? "w-full sm:w-[60%] border-red-500 border-2" : "w-full sm:w-[60%]"}>
                    <SelectValue placeholder="Select employment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GOVERNMENT">Government</SelectItem>
                    <SelectItem value="PRIVATE">Private</SelectItem>
                    <SelectItem value="BUSINESS">Business</SelectItem>
                    <SelectItem value="SELF_EMPLOYED">Self Employed</SelectItem>
                    <SelectItem value="NOT_WORKING">Not Working</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <span className="font-semibold text-foreground text-sm sm:text-base break-all">
                  {humanizeEnum(formData.employedIn)}
                </span>
              )}
            </div>

            {/* Occupation Dropdown */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-3 md:p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-smooth">
              <span className="font-medium text-muted-foreground text-sm">
                Occupation (व्यवसाय) <span className="text-red-500">*</span>
              </span>
              {editMode ? (
                <Select
                  value={formData.occupation || ""}
                  onValueChange={(value) => handleChange("occupation", value)}
                  onOpenChange={(open) => {
                    if (open && occupationCategories.length === 0)
                      fetchOptions("/api/occupation/categories", setOccupationCategories, "occupation");
                  }}
                >
                  <SelectTrigger className={validationErrors.has("occupation") ? "w-full sm:w-[60%] border-red-500 border-2" : "w-full sm:w-[60%]"}>
                    <SelectValue placeholder="Select occupation" />
                  </SelectTrigger>
                  <SelectContent>
                    {occupationCategories.map((cat) => (
                      <div key={cat.id}>
                        <div className="px-2 py-1 font-semibold text-sm text-gray-600">
                          {cat.categoryName}
                        </div>
                        {cat.occupationOptions.map((opt) => (
                          <SelectItem key={opt.id} value={opt.optionName}>
                            {opt.optionName}
                          </SelectItem>
                        ))}
                      </div>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <span className="font-semibold text-foreground text-sm sm:text-base break-all">
                  {formData.occupation || "N/A"}
                </span>
              )}
            </div>

            {/* Organization Name */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-3 md:p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-smooth">
              <span className="font-medium text-muted-foreground text-sm">
                Organization Name (संस्था का नाम) <span className="text-red-500">*</span>
              </span>
              {editMode ? (
                <Input
                  value={formData.organizationName || ""}
                  onChange={(e) => handleChange("organizationName", e.target.value)}
                  className={validationErrors.has("organizationName") ? "w-full sm:w-[60%] border-red-500 border-2" : "w-full sm:w-[60%]"}
                />
              ) : (
                <span className="font-semibold text-foreground text-sm sm:text-base break-all">
                  {formData.organizationName || "N/A"}
                </span>
              )}
            </div>

            {/* Annual Income Dropdown */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-3 md:p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-smooth">
              <span className="font-medium text-muted-foreground text-sm">
                Annual Income (वार्षिक आय) <span className="text-red-500">*</span>
              </span>
              {editMode ? (
                <Select
                  value={formData.annualIncome || ""}
                  onValueChange={(value) => handleChange("annualIncome", value)}
                  onOpenChange={(open) => {
                    if (open && annualIncomeList.length === 0)
                      fetchOptions("/api/annual-income", setAnnualIncomeList, "income", baseUrl);
                  }}
                >
                  <SelectTrigger className={validationErrors.has("annualIncome") ? "w-full sm:w-[60%] border-red-500 border-2" : "w-full sm:w-[60%]"}>
                    <SelectValue placeholder="Select income range" />
                  </SelectTrigger>
                  <SelectContent>
                    {annualIncomeList.map((item) => (
                      <SelectItem key={item.id} value={item.incomeRange}>
                        {item.incomeRange}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <span className="font-semibold text-foreground text-sm sm:text-base break-all">
                  {formData.annualIncome || "N/A"}
                </span>
              )}
            </div>

            {/* Currency Dropdown */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-3 md:p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-smooth">
              <span className="font-medium text-muted-foreground text-sm">
                Income Currency (आय मुद्रा) <span className="text-red-500">*</span>
              </span>
              {editMode ? (
                <Select
                  value={formData.incomeCurrency || ""}
                  onValueChange={(value) => handleChange("incomeCurrency", value)}
                  onOpenChange={(open) => {
                    if (open && currencyCountries.length === 0)
                      fetchOptions("/api/currency-country", setCurrencyCountries, "currency", baseUrl);
                  }}
                >
                  <SelectTrigger className={validationErrors.has("incomeCurrency") ? "w-full sm:w-[60%] border-red-500 border-2" : "w-full sm:w-[60%]"}>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencyCountries.map((item) => (
                      <SelectItem key={item.id} value={item.currencyCountryName}>
                        {item.currencyCountryName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <span className="font-semibold text-foreground text-sm sm:text-base break-all">
                  {formData.incomeCurrency || "N/A"}
                </span>
              )}
            </div>

            {/* Work Country Dropdown */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-3 md:p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-smooth">
              <span className="font-medium text-muted-foreground text-sm">
                Work Country (कार्य देश) <span className="text-red-500">*</span>
              </span>
              {editMode ? (
                <Select
                  value={formData.workCountry || ""}
                  onValueChange={(value) => handleChange("workCountry", value)}
                  onOpenChange={(open) => {
                    if (open && countries.length === 0)
                      fetchOptions("/api/country", setCountries, "country", baseUrl);
                  }}
                >
                  <SelectTrigger className={validationErrors.has("workCountry") ? "w-full sm:w-[60%] border-red-500 border-2" : "w-full sm:w-[60%]"}>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((item) => (
                      <SelectItem key={item.id} value={item.countryName}>
                        {item.countryName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <span className="font-semibold text-foreground text-sm sm:text-base break-all">
                  {formData.workCountry || "N/A"}
                </span>
              )}
            </div>

            {/* Work City (unchanged, still input) */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-3 md:p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-smooth">
              <span className="font-medium text-muted-foreground text-sm">
                Work City (कार्य शहर) <span className="text-red-500">*</span>
              </span>
              {editMode ? (
                <Input
                  value={formData.workCity || ""}
                  onChange={(e) => handleChange("workCity", e.target.value)}
                  className={validationErrors.has("workCity") ? "w-full sm:w-[60%] border-red-500 border-2" : "w-full sm:w-[60%]"}
                />
              ) : (
                <span className="font-semibold text-foreground text-sm sm:text-base break-all">
                  {formData.workCity || "N/A"}
                </span>
              )}
            </div>
          </div>

          <div className="mt-6 pt-6 border-t">
            <h3 className="font-semibold mb-3 text-lg">
              Occupation Details (in brief) (व्यवसाय विवरण)
            </h3>
            {editMode ? (
              <textarea
                value={formData.occupationInDetail || ""}
                onChange={(e) =>
                  handleChange("occupationInDetail", e.target.value)
                }
                className={validationErrors.has("occupationInDetail") ? "w-full border rounded-md p-3 min-h-[100px] border-red-500 border-2" : "w-full border rounded-md p-3 min-h-[100px]"}
              />
            ) : (
              <p className="text-muted-foreground leading-relaxed">
                {formData.occupationInDetail || "N/A"}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EducationOccupation;
