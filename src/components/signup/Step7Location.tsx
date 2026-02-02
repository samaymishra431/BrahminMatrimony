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
import { ArrowLeft, Check } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface Country {
  id: number;
  countryName: string;
  states: { id: number; name: string; countryId: number }[];
}

interface StepProps {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

const Step7Location = ({ data, onNext, onBack, isLastStep }: StepProps) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<{ id: number; name: string }[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    city: data.city || "",
    state: data.state || "",
    country: data.country || "",
    postalCode: data.postalCode || "",
    citizenship: data.citizenship || "",
    residencyStatus: data.residencyStatus || "",
    livingSinceYear: data.livingSinceYear || "",
  });

  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  // Fetch all countries
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await fetch(`${baseUrl}/api/country`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await response.json();
        if (result.statusCode === 200) {
          setCountries(result.payload);
        } else {
          toast({
            title: "Error",
            description: "Failed to load countries",
            variant: "destructive",
          });
        }
      } catch (err) {
        console.error("Error fetching countries:", err);
      } finally {
        setLoadingCountries(false);
      }
    };
    fetchCountries();
  }, [baseUrl]);

  // When country changes, update available states
  const handleCountryChange = (countryName: string) => {
    const selectedCountry = countries.find(
      (c) => c.countryName === countryName
    );
    setFormData({
      ...formData,
      country: countryName,
      state: "",
      city: "",
    });
    setStates(selectedCountry?.states || []);
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

    try {
      const response = await fetch(`${baseUrl}/api/location`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok && result.statusCode === 201) {
        toast({
          title: "Success",
          description: "Location created successfully.",
        });
        onNext(result.payload);
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to save location.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Error saving location:", err);
      toast({
        title: "Error",
        description: "Something went wrong while saving location.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Country */}
        <div className="space-y-2">
          <Label htmlFor="country">Country (देश) *</Label>
          <Select
            value={formData.country}
            onValueChange={(value) => handleCountryChange(value)}
            disabled={loadingCountries}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  loadingCountries ? "Loading countries..." : "Select country"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem
                  key={country.id}
                  value={country.countryName}
                >
                  {country.countryName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* State (conditionally rendered) */}
        {states.length > 0 && (
          <div className="space-y-2">
            <Label htmlFor="state">State (राज्य) *</Label>
            <Select
              value={formData.state}
              onValueChange={(value) =>
                setFormData({ ...formData, state: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {states.map((state) => (
                  <SelectItem key={state.id} value={state.name}>
                    {state.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* City */}
        <div className="space-y-2">
          <Label htmlFor="city">City (शहर) *</Label>
          <Input
            id="city"
            placeholder="e.g., Bangalore"
            value={formData.city}
            onChange={(e) =>
              setFormData({ ...formData, city: e.target.value })
            }
            required
          />
        </div>

        {/* Postal Code */}
        <div className="space-y-2">
          <Label htmlFor="postalCode">Postal Code (पिन कोड) *</Label>
          <Input
            id="postalCode"
            placeholder="e.g., 560001"
            value={formData.postalCode}
            onChange={(e) =>
              setFormData({ ...formData, postalCode: e.target.value })
            }
            required
          />
        </div>

        {/* Citizenship */}
        <div className="space-y-2">
          <Label htmlFor="citizenship">Citizenship (नागरिकता) *</Label>
          <Select
            value={formData.citizenship}
            onValueChange={(value) =>
              setFormData({ ...formData, citizenship: value })
            }
            disabled={loadingCountries}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select citizenship" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country.id} value={country.countryName}>
                  {country.countryName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Residency Status */}
        <div className="space-y-2">
          <Label htmlFor="residencyStatus">Residency Status (निवासी स्थिति) *</Label>
          <Select
            value={formData.residencyStatus}
            onValueChange={(value) =>
              setFormData({ ...formData, residencyStatus: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CITIZEN">Citizen</SelectItem>
              <SelectItem value="PERMANENT_RESIDENT">Permanent Resident</SelectItem>
              <SelectItem value="WORK_PERMIT">Work Permit</SelectItem>
              <SelectItem value="STUDENT_VISA">Student Visa</SelectItem>
              <SelectItem value="TEMPORARY_VISA">Temporary Visa</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Living Since Year */}
        <div className="space-y-2">
          <Label htmlFor="livingSinceYear">Living Since Year (इस वर्ष से रह रहे हैं)</Label>
          <Select
            value={formData.livingSinceYear?.toString()}
            onValueChange={(value) =>
              setFormData({ ...formData, livingSinceYear: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map(
                (year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 w-4 h-4" /> Back
        </Button>
        <Button
          type="submit"
          className="bg-gradient-primary hover:opacity-90"
          disabled={saving}
        >
          {saving
            ? "Saving..."
            : isLastStep
            ? (
              <>
                Complete Registration <Check className="ml-2 w-4 h-4" />
              </>
            )
            : "Next"}
        </Button>
      </div>
    </form>
  );
};

export default Step7Location;
