import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, MapPin, Loader2, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LocationDetailsData {
  city: string;
  state: string;
  country: string;
  postalCode: string;
  citizenship: string;
  residencyStatus: string;
  livingSinceYear: number | string;
  aboutMyAddress?: string;
  countryId?: number;
  stateId?: number;
}

// Map backend enum values to human-readable labels
const RESIDENCY_STATUS_OPTIONS: { label: string; value: string }[] = [
  { label: "Citizen", value: "CITIZEN" },
  { label: "Permanent Resident", value: "PERMANENT_RESIDENT" },
  { label: "Work Visa", value: "WORK_VISA" },
  { label: "Student Visa", value: "STUDENT_VISA" },
  { label: "Temporary Resident", value: "TEMPORARY_RESIDENT" },
  { label: "Green Card Holder", value: "GREEN_CARD_HOLDER" },
  { label: "Not Disclosed", value: "NOT_DISCLOSED" },
];

const REQUIRED_FIELDS = [
  "country",
  "state",
  "city",
  "postalCode",
  "citizenship",
  "residencyStatus",
  "livingSinceYear",
];

const FIELD_LABELS: Record<string, string> = {
  country: "Country",
  state: "State",
  city: "City",
  postalCode: "Postal Code",
  citizenship: "Citizenship",
  residencyStatus: "Residency Status",
  livingSinceYear: "Living Since Year",
  aboutMyAddress: "Full Address",
};

const LocationDetails = () => {
  // allow partial/empty data so component can render an empty form when no saved data exists
  const [locationData, setLocationData] = useState<Partial<LocationDetailsData> | null>(null);
  const [formData, setFormData] = useState<Partial<LocationDetailsData>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Set<string>>(new Set());

  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [loadingDropdown, setLoadingDropdown] = useState<string | null>(null);

  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  // Fetch location details
  useEffect(() => {
    const fetchLocationDetails = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          console.error("Token not found in sessionStorage");
          // show editable form with N/A values when unauthenticated / token missing
          setLocationData({});
          setFormData({});
          setLoading(false);
          return;
        }

        const response = await fetch(`${baseUrl}/api/location`, {
          headers: {
            Authorization: `Bearer ${token}`,
            accept: "application/json",
          },
        });

        const data = await response.json();
        if (data.statusCode === 200 && data.payload) {
          setLocationData(data.payload);
          setFormData(data.payload);
        } else {
          // Treat missing payload as "no data yet" — show empty form with N/A
          setLocationData({});
          setFormData({});
          toast({
            title: "No location data",
            description: data.message || "No location details found. You can add them by clicking Edit.",
          });
        }
      } catch (error) {
        console.error("Error fetching location details:", error);
        toast({
          title: "Error",
          description: "Something went wrong while fetching location details.",
          variant: "destructive",
        });
        // Ensure UI remains usable by rendering an empty form
        setLocationData({});
        setFormData({});
      } finally {
        setLoading(false);
      }
    };

    fetchLocationDetails();
  }, []);

  // Fetch countries
  const fetchCountries = async () => {
    try {
      setLoadingDropdown("country");
      const token = sessionStorage.getItem("token");
      const res = await fetch(`${baseUrl}/api/country`, {
        headers: {
          Authorization: `Bearer ${token}`,
          accept: "application/json",
        },
      });
      const result = await res.json();
      if (result.statusCode === 200 && result.payload) {
        setCountries(result.payload || []);
      } else {
        toast({
          title: "Failed to load countries",
          description: result.message || "Could not fetch countries.",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to load countries.",
        variant: "destructive",
      });
    } finally {
      setLoadingDropdown(null);
    }
  };

  // Fetch states
  const fetchStates = async (countryId?: number) => {
    try {
      let cid = countryId;
      if (!cid && formData.country) {
        const found = countries.find(
          (c) =>
            c.countryName === formData.country ||
            String(c.id) === String(formData.countryId)
        );
        if (found) cid = found.id;
      }
      if (!cid) {
        toast({
          title: "Select country first",
          description: "Please select a country before choosing a state.",
          variant: "destructive",
        });
        return [];
      }

      setLoadingDropdown("state");
      const token = sessionStorage.getItem("token");
      const res = await fetch(`${baseUrl}/api/state/country/${cid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          accept: "application/json",
        },
      });
      const result = await res.json();
      if (result.statusCode === 200 && result.payload) {
        setStates(result.payload || []);
        return result.payload;
      } else {
        setStates([]);
        toast({
          title: "Failed to load states",
          description: result.message || "Could not fetch states.",
          variant: "destructive",
        });
        return [];
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to load states.",
        variant: "destructive",
      });
      setStates([]);
      return [];
    } finally {
      setLoadingDropdown(null);
    }
  };

  // Prefill dropdowns when entering edit mode
  useEffect(() => {
    if (editMode) {
      if (countries.length === 0) {
        fetchCountries();
      }

      if (formData.country && countries.length > 0 && !formData.countryId) {
        const foundCountry = countries.find(
          (c) => c.countryName === formData.country
        );
        if (foundCountry) {
          setFormData((prev) => ({
            ...prev,
            countryId: foundCountry.id,
          }));
          fetchStates(foundCountry.id);
        }
      }

      if (formData.countryId && states.length === 0) {
        fetchStates(formData.countryId);
      }

      if (formData.state && states.length > 0 && !formData.stateId) {
        const foundState = states.find((s) => s.name === formData.state);
        if (foundState) {
          setFormData((prev) => ({ ...prev, stateId: foundState.id }));
        }
      }
    }
  }, [editMode, countries, states]);

  // Handle edit toggle
  const handleEditToggle = () => {
    setEditMode(!editMode);
    setFormData(locationData || {});
  };

  // Handle input change
  const handleChange = (field: keyof LocationDetailsData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (value !== undefined && value !== null && value !== "") {
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
      if (field === "state" && states.length === 0) return;
      const value = formData[field as keyof LocationDetailsData];
      if (value === undefined || value === null || value === "") {
        errors.add(field);
      }
    });
    setValidationErrors(errors);
    return errors;
  };

  // Save data
  const handleSave = async () => {
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

    try {
      const res = await fetch(`${baseUrl}/api/location`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.payload) {
        setLocationData(data.payload);
        setEditMode(false);
        toast({
          title: "Updated Successfully",
          description: "Your location details have been saved.",
        });
      } else {
        toast({
          title: "Update Failed",
          description: data.message || "Something went wrong.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Error updating location details:", err);
      toast({
        title: "Error",
        description: "Unable to save changes right now.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="w-6 h-6 animate-spin text-primary mr-2" />
        <p className="text-muted-foreground">Loading location details...</p>
      </div>
    );
  }

  const locationFields = [
    { label: "Country (देश)", field: "country" },
    { label: "State (राज्य)", field: "state" },
    { label: "City (शहर)", field: "city" },
    { label: "Postal Code (पिन कोड)", field: "postalCode" },
    { label: "Citizenship (नागरिकता)", field: "citizenship" },
    { label: "Residency Status (निवासी स्थिति)", field: "residencyStatus" },
    { label: "Living Since Year (इस वर्ष से रह रहे हैं)", field: "livingSinceYear" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <Card className="border-0 shadow-medium">
        <CardHeader className="pb-4">
          <div className="flex flex-row items-center justify-between w-full">
            <CardTitle className="text-2xl md:text-3xl">
              Location Details
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

      {/* Location Info */}
      <Card className="border-0 shadow-medium">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <CardTitle className="text-xl">Current Location</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="p-4 md:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {locationFields.map((item, index) => {
              // Hide state field if no states available
              if (item.field === "state" && editMode && states.length === 0) {
                return null;
              }

              return (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-3 md:p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-smooth"
                >
                  <span className="font-medium text-muted-foreground text-sm">
                    {item.label}
                    {REQUIRED_FIELDS.includes(item.field) && <span className="text-red-500 ml-1">*</span>}
                  </span>

                  {editMode ? (
                    item.field === "country" ? (
                      <Select
                        value={formData.countryId?.toString() || ""}
                        onValueChange={async (v) => {
                          const id = Number(v);
                          const selected = countries.find((c) => c.id === id);
                          handleChange("country", selected?.countryName || "");
                          setFormData((prev) => ({
                            ...prev,
                            countryId: id,
                            state: undefined,
                            stateId: undefined,
                          }));
                          setStates([]);
                          const result = await fetchStates(id);
                          if (!result || result.length === 0) {
                            setFormData((prev) => ({
                              ...prev,
                              state: undefined,
                              stateId: undefined,
                            }));
                          }
                        }}
                        onOpenChange={(open) => {
                          if (open && countries.length === 0) fetchCountries();
                        }}
                      >
                        <SelectTrigger className={validationErrors.has("country") ? "w-full sm:w-[60%] border-red-500 border-2" : "w-full sm:w-[60%]"}>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          {loadingDropdown === "country" ? (
                            <div className="flex justify-center items-center p-2">
                              <Loader2 className="animate-spin w-4 h-4 mr-2" /> Loading...
                            </div>
                          ) : (
                            countries.map((c) => (
                              <SelectItem key={c.id} value={String(c.id)}>
                                {c.countryName}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    ) : item.field === "state" ? (
                      <Select
                        value={formData.stateId?.toString() || ""}
                        onValueChange={(v) => {
                          const id = Number(v);
                          const selected = states.find((s) => s.id === id);
                          handleChange("state", selected?.name || "");
                          setFormData((prev) => ({ ...prev, stateId: id }));
                        }}
                      >
                        <SelectTrigger className={validationErrors.has("state") ? "w-full sm:w-[60%] border-red-500 border-2" : "w-full sm:w-[60%]"}>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          {loadingDropdown === "state" ? (
                            <div className="flex justify-center items-center p-2">
                              <Loader2 className="animate-spin w-4 h-4 mr-2" /> Loading...
                            </div>
                          ) : (
                            states.map((s) => (
                              <SelectItem key={s.id} value={String(s.id)}>
                                {s.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    ) : item.field === "residencyStatus" ? (
                      <Select
                        value={formData.residencyStatus || ""}
                        onValueChange={(v) => handleChange("residencyStatus", v)}
                      >
                        <SelectTrigger className={validationErrors.has("residencyStatus") ? "w-full sm:w-[60%] border-red-500 border-2" : "w-full sm:w-[60%]"}>
                          <SelectValue placeholder="Select residency status" />
                        </SelectTrigger>
                        <SelectContent>
                          {RESIDENCY_STATUS_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        type={item.field === "livingSinceYear" ? "number" : "text"}
                        value={
                          (formData[item.field as keyof LocationDetailsData] ?? "") as string | number
                        }
                        onChange={(e) =>
                          handleChange(item.field as keyof LocationDetailsData, e.target.value)
                        }
                        className={validationErrors.has(item.field) ? "w-full sm:w-[60%] border-red-500 border-2" : "w-full sm:w-[60%]"}
                      />
                    )
                  ) : (
                    <span className="font-semibold text-foreground text-sm sm:text-base break-all">
                      {item.field === "residencyStatus"
                        ? RESIDENCY_STATUS_OPTIONS.find((o) => o.value === formData.residencyStatus)?.label || "N/A"
                        : formData[item.field as keyof LocationDetailsData] || "N/A"}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-6 border-t">
            <h3 className="font-semibold mb-3 text-lg">Full Address (पूरा पता)</h3>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {formData.aboutMyAddress ||
                `${formData.city || "City"}, ${formData.state || "State"} ${formData.postalCode || "Postal Code"}, ${formData.country || "Country"}`}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LocationDetails;
