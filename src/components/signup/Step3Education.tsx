import { useState, useEffect } from "react";
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
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface StepProps {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

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

interface District {
  id: number;
  name: string;
  stateId: number;
}

interface State {
  id: number;
  name: string;
  countryId: number;
  districts?: District[];
}

interface Country {
  id: number;
  countryName: string;
  states?: State[];
}

const Step3Education = ({ data, onNext, onBack }: StepProps) => {
  const [formData, setFormData] = useState({
    highestEducation: data.highestEducation || "",
    additionalDegree: data.additionalDegree || "",
    collegeInstitution: data.collegeInstitution || "",
    educationInDetail: data.educationInDetail || "",
    employedIn: data.employedIn || "",
    occupation: data.occupation || "",
    organizationName: data.organizationName || "",
    occupationInDetail: data.occupationInDetail || "",
    annualIncome: data.annualIncome || "",
    incomeCurrency: data.incomeCurrency || "",
    workCountry: data.workCountry || "",
    workState: data.workState || "",
    workCity: data.workCity || "",
  });

  const [educationCategories, setEducationCategories] = useState<EducationCategory[]>([]);
  const [occupationCategories, setOccupationCategories] = useState<OccupationCategory[]>([]);
  const [annualIncomeList, setAnnualIncomeList] = useState<AnnualIncome[]>([]);
  const [currencyCountries, setCurrencyCountries] = useState<CurrencyCountry[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedState, setSelectedState] = useState<State | null>(null);
  const [loadingDropdown, setLoadingDropdown] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:9090";

  // Generic reusable fetch
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

  // Handle country change
  const handleCountryChange = (value: string) => {
    setFormData({ ...formData, workCountry: value, workState: "", workCity: "" });
    const country = countries.find((c) => c.countryName === value) || null;
    setSelectedCountry(country);
    setSelectedState(null);
  };

  // Handle state change
  const handleStateChange = (value: string) => {
    setFormData({ ...formData, workState: value, workCity: "" });
    const state = selectedCountry?.states?.find((s) => s.name === value) || null;
    setSelectedState(state);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const requiredFields = [
      { key: "highestEducation", label: "Highest Education" },
      { key: "additionalDegree", label: "Additional Degree" },
      { key: "collegeInstitution", label: "College / Institution" },
      { key: "employedIn", label: "Employed In" },
      { key: "occupation", label: "Occupation" },
      { key: "organizationName", label: "Organization Name" },
      { key: "annualIncome", label: "Annual Income" },
      { key: "incomeCurrency", label: "Income Currency" },
      { key: "workCountry", label: "Work Country" },
      { key: "workCity", label: "Work City" },
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

    if (selectedCountry?.states && selectedCountry.states.length > 0 && !formData.workState) {
      toast({
        title: "Validation Error",
        description: "Work State is required.",
        variant: "destructive",
      });
      return;
    }

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

    try {
      const response = await fetch(`${baseUrl}/api/education-occupation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (response.ok) {
        toast({
          title: "Saved",
          description: "Education & occupation details saved.",
          variant: "default",
        });
        onNext(formData);
      } else {
        toast({
          title: "Error saving details",
          description: result.message || "Failed to save details.",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Network Error",
        description: "Could not save details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* ======================= EDUCATION SECTION ======================= */}
      <div>
        <div className="border-b border-gray-300 mb-4 pb-1">
          <h2 className="text-lg font-semibold text-gray-800">Education Details</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Highest Education */}
          <div className="space-y-2">
            <Label htmlFor="highestEducation">Highest Education (उच्चतम शिक्षा) *</Label>
            <Select
              value={formData.highestEducation}
              onValueChange={(value) => setFormData({ ...formData, highestEducation: value })}
              onOpenChange={(open) => {
                if (open && educationCategories.length === 0)
                  fetchOptions("/api/education/categories", setEducationCategories, "education");
              }}
            >
              <SelectTrigger>
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
          </div>

          {/* Additional Degree */}
          <div className="space-y-2">
            <Label htmlFor="additionalDegree">Additional Degree (अतिरिक्त डिग्री) *</Label>
            <Select
              value={formData.additionalDegree}
              onValueChange={(value) => setFormData({ ...formData, additionalDegree: value })}
              onOpenChange={(open) => {
                if (open && educationCategories.length === 0)
                  fetchOptions("/api/education/categories", setEducationCategories, "education");
              }}
            >
              <SelectTrigger>
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
          </div>

          {/* College / Institution */}
          <div className="space-y-2">
            <Label htmlFor="collegeInstitution">College / Institution (कॉलेज / संस्थान) *</Label>
            <Input
              id="collegeInstitution"
              value={formData.collegeInstitution}
              onChange={(e) => setFormData({ ...formData, collegeInstitution: e.target.value })}
            />
          </div>

          {/* Education in Detail */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="educationInDetail">Education in Detail (शिक्षा विवरण)</Label>
            <Textarea
              id="educationInDetail"
              rows={3}
              value={formData.educationInDetail}
              onChange={(e) => setFormData({ ...formData, educationInDetail: e.target.value })}
              placeholder="Write brief details about your education..."
            />
          </div>
        </div>
      </div>

      {/* ======================= OCCUPATION SECTION ======================= */}
      <div>
        <div className="border-b border-gray-300 mb-4 pb-1">
          <h2 className="text-lg font-semibold text-gray-800">Occupation Details</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Employed In */}
          <div className="space-y-2">
            <Label htmlFor="employedIn">Employed In (कार्यरत) *</Label>
            <Select
              value={formData.employedIn}
              onValueChange={(value) => setFormData({ ...formData, employedIn: value })}
            >
              <SelectTrigger>
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
          </div>

          {/* Occupation */}
          <div className="space-y-2">
            <Label htmlFor="occupation">Occupation (व्यवसाय) *</Label>
            <Select
              value={formData.occupation}
              onValueChange={(value) => setFormData({ ...formData, occupation: value })}
              onOpenChange={(open) => {
                if (open && occupationCategories.length === 0)
                  fetchOptions("/api/occupation/categories", setOccupationCategories, "occupation");
              }}
            >
              <SelectTrigger>
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
          </div>

          {/* Organization Name */}
          <div className="space-y-2">
            <Label htmlFor="organizationName">Organization Name (संस्था का नाम) *</Label>
            <Input
              id="organizationName"
              value={formData.organizationName}
              onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
              placeholder="Enter organization name"
            />
          </div>

          {/* Annual Income */}
          <div className="space-y-2">
            <Label htmlFor="annualIncome">Annual Income (वार्षिक आय) *</Label>
            <Select
              value={formData.annualIncome}
              onValueChange={(value) => setFormData({ ...formData, annualIncome: value })}
              onOpenChange={(open) => {
                if (open && annualIncomeList.length === 0)
                  fetchOptions("/api/annual-income", setAnnualIncomeList, "income", baseUrl);
              }}
            >
              <SelectTrigger>
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
          </div>

          {/* Currency */}
          <div className="space-y-2">
            <Label htmlFor="incomeCurrency">Currency (मुद्रा) *</Label>
            <Select
              value={formData.incomeCurrency}
              onValueChange={(value) => setFormData({ ...formData, incomeCurrency: value })}
              onOpenChange={(open) => {
                if (open && currencyCountries.length === 0)
                  fetchOptions("/api/currency-country", setCurrencyCountries, "currency", baseUrl);
              }}
            >
              <SelectTrigger>
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
          </div>

          {/* Work Country */}
          <div className="space-y-2">
            <Label htmlFor="workCountry">Work Country (कार्य देश) *</Label>
            <Select
              value={formData.workCountry}
              onValueChange={handleCountryChange}
              onOpenChange={(open) => {
                if (open && countries.length === 0)
                  fetchOptions("/api/country", setCountries, "country", baseUrl);
              }}
            >
              <SelectTrigger>
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
          </div>

          {/* Work State (only if available) */}
          {selectedCountry?.states && selectedCountry.states.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="workState">Work State (कार्य राज्य) *</Label>
              <Select
                value={formData.workState}
                onValueChange={handleStateChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {selectedCountry.states.map((s) => (
                    <SelectItem key={s.id} value={s.name}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Work City - dropdown if districts exist, else text input */}
          <div className="space-y-2">
            <Label htmlFor="workCity">Work City (कार्य शहर) *</Label>
            {selectedState?.districts && selectedState.districts.length > 0 ? (
              <Select
                value={formData.workCity}
                onValueChange={(value) => setFormData({ ...formData, workCity: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  {selectedState.districts.map((d) => (
                    <SelectItem key={d.id} value={d.name}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                id="workCity"
                value={formData.workCity}
                onChange={(e) => setFormData({ ...formData, workCity: e.target.value })}
                placeholder="Enter work city"
              />
            )}
          </div>

          {/* Occupation in Detail */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="occupationInDetail">Occupation in Detail (व्यवसाय विवरण)</Label>
            <Textarea
              id="occupationInDetail"
              rows={3}
              value={formData.occupationInDetail}
              onChange={(e) =>
                setFormData({ ...formData, occupationInDetail: e.target.value })
              }
              placeholder="Describe your job or business..."
            />
          </div>
        </div>
      </div>

      {/* ======================= NAVIGATION BUTTONS ======================= */}
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

export default Step3Education;
