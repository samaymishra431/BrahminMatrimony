import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Users, Loader2, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FamilyDetailsData {
  id: number;
  familyValue: string;
  familyType: string;
  familyStatus: string;
  fatherOccupation: string;
  motherOccupation: string;
  grandFatherOccupation?: string;
  grandMotherOccupation?: string;
  nativePlace?: string;
  noOfBrothers: number;
  brothersMarried: number;
  noOfSisters: number;
  sistersMarried: number;
  parentsContactNo?: string;
  aboutMyFamily?: string;
}

const REQUIRED_FIELDS = [
  "familyValue",
  "familyType",
  "familyStatus",
  "fatherOccupation",
  "motherOccupation",
  "grandFatherOccupation",
  "grandMotherOccupation",
  "nativePlace",
  "noOfBrothers",
  "brothersMarried",
  "noOfSisters",
  "sistersMarried",
];

const FIELD_LABELS: Record<string, string> = {
  familyValue: "Family Value",
  familyType: "Family Type",
  familyStatus: "Family Status",
  fatherOccupation: "Father's Occupation",
  motherOccupation: "Mother's Occupation",
  grandFatherOccupation: "Grandfather's Occupation",
  grandMotherOccupation: "Grandmother's Occupation",
  nativePlace: "Native Place",
  noOfBrothers: "No. of Brothers",
  brothersMarried: "Brothers Married",
  noOfSisters: "No. of Sisters",
  sistersMarried: "Sisters Married",
  aboutMyFamily: "About My Family",
};

const FamilyDetails = () => {
  // allow empty object as "no data yet"
  const [familyData, setFamilyData] = useState<Partial<FamilyDetailsData> | null>(null);
  const [formData, setFormData] = useState<Partial<FamilyDetailsData>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Set<string>>(new Set());

  const [occupationCategories, setOccupationCategories] = useState<any[]>([]);
  const [loadingDropdown, setLoadingDropdown] = useState<string | null>(null);

  useEffect(() => {
    const fetchFamilyDetails = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          console.error("Token not found in sessionStorage");
          setLoading(false);
          return;
        }

        const baseUrl = import.meta.env.VITE_API_BASE_URL;
        const response = await fetch(`${baseUrl}/api/family`, {
          headers: {
            Authorization: `Bearer ${token}`,
            accept: "application/json",
          },
        });

        const data = await response.json();
        // If API returned OK
        if (response.ok) {
          // If payload present -> use it, else treat as empty record so UI renders form with "N/A"
          if (data.payload) {
            setFamilyData(data.payload);
            setFormData(data.payload);
          } else {
            setFamilyData({});
            setFormData({});
          }
        } else {
          // If 404 -> treat as "no data yet" and render empty form
          if (response.status === 404) {
            setFamilyData({});
            setFormData({});
          } else {
            // Other errors -> show toast (keep previous behavior)
            toast({
              title: "Failed to load",
              description: data.message || "Could not fetch family details.",
              variant: "destructive",
            });
          }
        }
      } catch (error) {
        console.error("Error fetching family details:", error);
        toast({
          title: "Error",
          description: "Something went wrong while fetching family details.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFamilyDetails();
  }, []);

  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const fetchOccupationOptions = async () => {
    try {
      setLoadingDropdown("occupation");
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${baseUrl}/api/occupation/categories`, {
        headers: {
          Authorization: `Bearer ${token}`,
          accept: "application/json",
        },
      });
      const result = await response.json();
      if (result.statusCode === 200 || result.statusCode === "OK") {
        setOccupationCategories(result.payload || []);
      } else {
        toast({
          title: "Failed to load options",
          description: result.message || "Could not fetch occupation data.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to load occupation options.",
        variant: "destructive",
      });
    } finally {
      setLoadingDropdown(null);
    }
  };

  const handleEditToggle = () => {
    setEditMode(!editMode);
    setFormData(familyData || {});
    if (!editMode && familyData) {
      if (
        (familyData.fatherOccupation && occupationCategories.length === 0) ||
        (familyData.motherOccupation && occupationCategories.length === 0) ||
        (familyData.grandFatherOccupation && occupationCategories.length === 0) ||
        (familyData.grandMotherOccupation && occupationCategories.length === 0)
      ) {
        fetchOccupationOptions();
      }
    }
  };

  const handleChange = (field: keyof FamilyDetailsData, value: any) => {
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
      const value = formData[field as keyof FamilyDetailsData];
      if (value === undefined || value === null || value === "") {
        errors.add(field);
      }
    });
    setValidationErrors(errors);
    return errors;
  };

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
    const baseUrl = import.meta.env.VITE_API_BASE_URL;

    try {
      const res = await fetch(`${baseUrl}/api/family`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.payload) {
        setFamilyData(data.payload);
        setEditMode(false);
        toast({
          title: "Updated Successfully",
          description: "Your family details have been saved.",
        });
      } else {
        toast({
          title: "Update Failed",
          description: data.message || "Something went wrong.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Error updating family details:", err);
      toast({
        title: "Error",
        description: "Unable to save changes right now.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="w-6 h-6 animate-spin text-primary mr-2" />
        <p className="text-muted-foreground">Loading family details...</p>
      </div>
    );
  }

  // Only show failure message when fetch resulted in a true error (familyData still null).
  if (familyData === null) {
    return (
      <p className="text-center py-6 text-destructive">
        Failed to load family details.
      </p>
    );
  }

  const familyFields = [
    { label: "Family Value (पारिवारिक मूल्य)", field: "familyValue" },
    { label: "Family Type (परिवार का प्रकार)", field: "familyType" },
    { label: "Family Status (पारिवारिक स्थिति)", field: "familyStatus" },
    { label: "Father's Occupation (पिता का व्यवसाय)", field: "fatherOccupation" },
    { label: "Mother's Occupation (माता का व्यवसाय)", field: "motherOccupation" },
    { label: "Grandfather's Occupation (दादा का व्यवसाय)", field: "grandFatherOccupation" },
    { label: "Grandmother's Occupation (दादी का व्यवसाय)", field: "grandMotherOccupation" },
    { label: "Native Place (मूल स्थान)", field: "nativePlace" },
    { label: "No. of Brothers (भाइयों की संख्या)", field: "noOfBrothers" },
    { label: "Brothers Married (विवाहित भाई)", field: "brothersMarried" },
    { label: "No. of Sisters (बहनों की संख्या)", field: "noOfSisters" },
    { label: "Sisters Married (विवाहित बहनें)", field: "sistersMarried" },
    { label: "Parents Contact (माता-पिता का संपर्क)", field: "parentsContactNo" },
  ];

  const familyValueEnum = [
    { value: "TRADITIONAL", label: "Traditional" },
    { value: "MODERATE", label: "Moderate" },
    { value: "LIBERAL", label: "Liberal" },
    { value: "ORTHODOX", label: "Orthodox" },
  ];
  const familyTypeEnum = [
    { value: "JOINT", label: "Joint" },
    { value: "NUCLEAR", label: "Nuclear" },
    { value: "EXTENDED", label: "Extended" },
  ];
  const familyStatusEnum = [
    { value: "LOWER_CLASS", label: "Lower Class" },
    { value: "MIDDLE_CLASS", label: "Middle Class" },
    { value: "UPPER_MIDDLE_CLASS", label: "Upper Middle Class" },
    { value: "UPPER_CLASS", label: "Upper Class" },
    { value: "RICH_AFFLUENT", label: "Rich/Affluent" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="border-0 shadow-medium">
        <CardHeader className="pb-4">
          <div className="flex flex-row items-center justify-between w-full">
            <CardTitle className="text-2xl md:text-3xl">Family Details</CardTitle>
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

      <Card className="border-0 shadow-medium">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <CardTitle className="text-xl">Family Information</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="p-4 md:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {familyFields.map((item, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-3 md:p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-smooth"
              >
                <span className="font-medium text-muted-foreground text-sm">
                  {item.label}
                  {REQUIRED_FIELDS.includes(item.field) && <span className="text-red-500 ml-1">*</span>}
                </span>

                {editMode ? (
                  item.field === "familyValue" ? (
                    <Select
                      value={formData.familyValue || ""}
                      onValueChange={(v) => handleChange("familyValue", v)}
                    >
                      <SelectTrigger className={validationErrors.has("familyValue") ? "w-full sm:w-[60%] border-red-500 border-2" : "w-full sm:w-[60%]"}>
                        <SelectValue placeholder="Select family value" />
                      </SelectTrigger>
                      <SelectContent>
                        {familyValueEnum.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : item.field === "familyType" ? (
                    <Select
                      value={formData.familyType || ""}
                      onValueChange={(v) => handleChange("familyType", v)}
                    >
                      <SelectTrigger className={validationErrors.has("familyType") ? "w-full sm:w-[60%] border-red-500 border-2" : "w-full sm:w-[60%]"}>
                        <SelectValue placeholder="Select family type" />
                      </SelectTrigger>
                      <SelectContent>
                        {familyTypeEnum.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : item.field === "familyStatus" ? (
                    <Select
                      value={formData.familyStatus || ""}
                      onValueChange={(v) => handleChange("familyStatus", v)}
                    >
                      <SelectTrigger className={validationErrors.has("familyStatus") ? "w-full sm:w-[60%] border-red-500 border-2" : "w-full sm:w-[60%]"}>
                        <SelectValue placeholder="Select family status" />
                      </SelectTrigger>
                      <SelectContent>
                        {familyStatusEnum.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : item.field === "fatherOccupation" ? (
                    <Select
                      value={formData.fatherOccupation || ""}
                      onValueChange={(v) => handleChange("fatherOccupation", v)}
                      onOpenChange={(open) => {
                        if (open && occupationCategories.length === 0) fetchOccupationOptions();
                      }}
                    >
                      <SelectTrigger className={validationErrors.has("fatherOccupation") ? "w-full sm:w-[60%] border-red-500 border-2" : "w-full sm:w-[60%]"}>
                        <SelectValue placeholder="Select father's occupation" />
                      </SelectTrigger>
                      <SelectContent>
                        {loadingDropdown === "occupation" ? (
                          <div className="flex justify-center items-center p-2">
                            <Loader2 className="animate-spin w-4 h-4 mr-2" /> Loading...
                          </div>
                        ) : (
                          occupationCategories.map((cat: any) => (
                            <div key={cat.id}>
                              <div className="px-2 py-1 font-semibold text-sm text-gray-600">
                                {cat.categoryName}
                              </div>
                              {cat.occupationOptions.map((opt: any) => (
                                <SelectItem key={opt.id} value={opt.optionName}>
                                  {opt.optionName}
                                </SelectItem>
                              ))}
                            </div>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  ) : item.field === "motherOccupation" ? (
                    <Select
                      value={formData.motherOccupation || ""}
                      onValueChange={(v) => handleChange("motherOccupation", v)}
                      onOpenChange={(open) => {
                        if (open && occupationCategories.length === 0) fetchOccupationOptions();
                      }}
                    >
                      <SelectTrigger className={validationErrors.has("motherOccupation") ? "w-full sm:w-[60%] border-red-500 border-2" : "w-full sm:w-[60%]"}>
                        <SelectValue placeholder="Select mother's occupation" />
                      </SelectTrigger>
                      <SelectContent>
                        {loadingDropdown === "occupation" ? (
                          <div className="flex justify-center items-center p-2">
                            <Loader2 className="animate-spin w-4 h-4 mr-2" /> Loading...
                          </div>
                        ) : (
                          occupationCategories.map((cat: any) => (
                            <div key={cat.id}>
                              <div className="px-2 py-1 font-semibold text-sm text-gray-600">
                                {cat.categoryName}
                              </div>
                              {cat.occupationOptions.map((opt: any) => (
                                <SelectItem key={opt.id} value={opt.optionName}>
                                  {opt.optionName}
                                </SelectItem>
                              ))}
                            </div>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  ) : item.field === "grandFatherOccupation" ? (
                    <Select
                      value={formData.grandFatherOccupation || ""}
                      onValueChange={(v) => handleChange("grandFatherOccupation", v)}
                      onOpenChange={(open) => {
                        if (open && occupationCategories.length === 0) fetchOccupationOptions();
                      }}
                    >
                      <SelectTrigger className={validationErrors.has("grandFatherOccupation") ? "w-full sm:w-[60%] border-red-500 border-2" : "w-full sm:w-[60%]"}>
                        <SelectValue placeholder="Select grandfather's occupation" />
                      </SelectTrigger>
                      <SelectContent>
                        {loadingDropdown === "occupation" ? (
                          <div className="flex justify-center items-center p-2">
                            <Loader2 className="animate-spin w-4 h-4 mr-2" /> Loading...
                          </div>
                        ) : (
                          occupationCategories.map((cat: any) => (
                            <div key={cat.id}>
                              <div className="px-2 py-1 font-semibold text-sm text-gray-600">
                                {cat.categoryName}
                              </div>
                              {cat.occupationOptions.map((opt: any) => (
                                <SelectItem key={opt.id} value={opt.optionName}>
                                  {opt.optionName}
                                </SelectItem>
                              ))}
                            </div>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  ) : item.field === "grandMotherOccupation" ? (
                    <Select
                      value={formData.grandMotherOccupation || ""}
                      onValueChange={(v) => handleChange("grandMotherOccupation", v)}
                      onOpenChange={(open) => {
                        if (open && occupationCategories.length === 0) fetchOccupationOptions();
                      }}
                    >
                      <SelectTrigger className={validationErrors.has("grandMotherOccupation") ? "w-full sm:w-[60%] border-red-500 border-2" : "w-full sm:w-[60%]"}>
                        <SelectValue placeholder="Select grandmother's occupation" />
                      </SelectTrigger>
                      <SelectContent>
                        {loadingDropdown === "occupation" ? (
                          <div className="flex justify-center items-center p-2">
                            <Loader2 className="animate-spin w-4 h-4 mr-2" /> Loading...
                          </div>
                        ) : (
                          occupationCategories.map((cat: any) => (
                            <div key={cat.id}>
                              <div className="px-2 py-1 font-semibold text-sm text-gray-600">
                                {cat.categoryName}
                              </div>
                              {cat.occupationOptions.map((opt: any) => (
                                <SelectItem key={opt.id} value={opt.optionName}>
                                  {opt.optionName}
                                </SelectItem>
                              ))}
                            </div>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  ) : ["noOfBrothers","brothersMarried","noOfSisters","sistersMarried"].includes(item.field) ? (
                    <Select
                      value={(formData[item.field as keyof FamilyDetailsData]?.toString()) || ""}
                      onValueChange={(v) => handleChange(item.field as keyof FamilyDetailsData, Number(v))}
                    >
                      <SelectTrigger className={validationErrors.has(item.field) ? "w-full sm:w-[60%] border-red-500 border-2" : "w-full sm:w-[60%]"}>
                        <SelectValue placeholder="Select number" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 11 }, (_, i) => i.toString()).map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      type={typeof formData[item.field as keyof FamilyDetailsData] === "number" ? "number" : "text"}
                      value={(formData[item.field as keyof FamilyDetailsData] ?? "") as string | number}
                      onChange={(e) => handleChange(item.field as keyof FamilyDetailsData, e.target.value)}
                      className={validationErrors.has(item.field) ? "w-full sm:w-[60%] border-red-500 border-2" : "w-full sm:w-[60%]"}
                    />
                  )
                ) : (
                  <span className="font-semibold text-foreground text-sm sm:text-base break-all">
                    {item.field === "familyValue"
                      ? familyValueEnum.find((opt) => opt.value === formData.familyValue)?.label || "N/A"
                      : item.field === "familyType"
                      ? familyTypeEnum.find((opt) => opt.value === formData.familyType)?.label || "N/A"
                      : item.field === "familyStatus"
                      ? familyStatusEnum.find((opt) => opt.value === formData.familyStatus)?.label || "N/A"
                      : formData[item.field as keyof FamilyDetailsData] || "N/A"}
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t">
            <h3 className="font-semibold mb-3 text-lg">About My Family (मेरे परिवार के बारे में)</h3>
            {editMode ? (
              <textarea
                value={formData.aboutMyFamily || ""}
                onChange={(e) => handleChange("aboutMyFamily", e.target.value)}
                className={validationErrors.has("aboutMyFamily") ? "w-full border rounded-md p-3 min-h-[100px] border-red-500 border-2" : "w-full border rounded-md p-3 min-h-[100px]"}
              />
            ) : (
              <p className="text-muted-foreground leading-relaxed">
                {familyData.aboutMyFamily || "N/A"}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FamilyDetails;
