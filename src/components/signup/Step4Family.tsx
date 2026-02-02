import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

const Step4Family = ({ data, onNext, onBack }: StepProps) => {
  const [formData, setFormData] = useState({
    familyValue: data.familyValue || "",
    familyType: data.familyType || "",
    familyStatus: data.familyStatus || "",
    fatherOccupation: data.fatherOccupation || "",
    motherOccupation: data.motherOccupation || "",
    grandfatherOccupation: data.grandfatherOccupation || "",
    grandmotherOccupation: data.grandmotherOccupation || "",
    nativePlace: data.nativePlace || "",
    noOfBrothers: data.noOfBrothers || "",
    brothersMarried: data.brothersMarried || "",
    noOfSisters: data.noOfSisters || "",
    sistersMarried: data.sistersMarried || "",
    parentsContactNo: data.parentsContactNo || "",
    aboutMyFamily: data.aboutMyFamily || "",
  });

  const [saving, setSaving] = useState(false);
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:9090";

  // occupation dropdown data & loader (same integration used in FamilyDetails.tsx)
  const [occupationCategories, setOccupationCategories] = useState<any[]>([]);
  const [loadingDropdown, setLoadingDropdown] = useState<string | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    // Validation
    const requiredFields = [
      { key: "familyValue", label: "Family Value" },
      { key: "familyType", label: "Family Type" },
      { key: "familyStatus", label: "Family Status" },
      { key: "fatherOccupation", label: "Father's Occupation" },
      { key: "motherOccupation", label: "Mother's Occupation" },
      { key: "grandfatherOccupation", label: "Grandfather's Occupation" },
      { key: "grandmotherOccupation", label: "Grandmother's Occupation" },
      { key: "nativePlace", label: "Native Place" },
      { key: "noOfBrothers", label: "Number of Brothers" },
      { key: "brothersMarried", label: "Brothers Married" },
      { key: "noOfSisters", label: "Number of Sisters" },
      { key: "sistersMarried", label: "Sisters Married" },
    ];

    for (const field of requiredFields) {
      if (!formData[field.key as keyof typeof formData]) {
        setSaving(false);
        toast({
          title: "Validation Error",
          description: `${field.label} is required.`,
          variant: "destructive",
        });
        return;
      }
    }

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
      familyValue: formData.familyValue,
      familyType: formData.familyType,
      familyStatus: formData.familyStatus,
      fatherOccupation: formData.fatherOccupation,
      motherOccupation: formData.motherOccupation,
      grandfatherOccupation: formData.grandfatherOccupation,
      grandmotherOccupation: formData.grandmotherOccupation,
      nativePlace: formData.nativePlace,
      noOfBrothers: formData.noOfBrothers !== "" ? Number(formData.noOfBrothers) : null,
      brothersMarried: formData.brothersMarried !== "" ? Number(formData.brothersMarried) : null,
      noOfSisters: formData.noOfSisters !== "" ? Number(formData.noOfSisters) : null,
      sistersMarried: formData.sistersMarried !== "" ? Number(formData.sistersMarried) : null,
      parentsContactNo: formData.parentsContactNo,
      aboutMyFamily: formData.aboutMyFamily,
    };

    try {
      const response = await fetch(`${baseUrl}/api/family`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (response.ok) {
        toast({
          title: "Saved",
          description: result.message || "Family details saved.",
          variant: "default",
        });
        onNext(result.payload || payload);
      } else {
        toast({
          title: "Error saving details",
          description: result.message || "Failed to save family details.",
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="familyValue">Family Value (पारिवारिक मूल्य) *</Label>
          <Select value={formData.familyValue} onValueChange={(value) => setFormData({ ...formData, familyValue: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TRADITIONAL">Traditional</SelectItem>
              <SelectItem value="MODERATE">Moderate</SelectItem>
              <SelectItem value="LIBERAL">Liberal</SelectItem>
              <SelectItem value="ORTHODOX">Orthodox</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="familyType">Family Type (परिवार का प्रकार) *</Label>
          <Select value={formData.familyType} onValueChange={(value) => setFormData({ ...formData, familyType: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="JOINT">Joint Family</SelectItem>
              <SelectItem value="NUCLEAR">Nuclear Family</SelectItem>
              <SelectItem value="EXTENDED">Extended Family</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="familyStatus">Family Status (पारिवारिक स्थिति) *</Label>
          <Select value={formData.familyStatus} onValueChange={(value) => setFormData({ ...formData, familyStatus: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LOWER_CLASS">Lower Class</SelectItem>
              <SelectItem value="MIDDLE_CLASS">Middle Class</SelectItem>
              <SelectItem value="UPPER_MIDDLE_CLASS">Upper Middle Class</SelectItem>
              <SelectItem value="UPPER_CLASS">Upper Class</SelectItem>
              <SelectItem value="RICH_AFFLUENT">Rich / Affluent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fatherOccupation">Father's Occupation (पिता का व्यवसाय) *</Label>
          <Select
            value={formData.fatherOccupation}
            onValueChange={(v) => setFormData({ ...formData, fatherOccupation: v })}
            onOpenChange={(open) => {
              if (open && occupationCategories.length === 0) fetchOccupationOptions();
            }}
          >
            <SelectTrigger>
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
        </div>

        <div className="space-y-2">
          <Label htmlFor="motherOccupation">Mother's Occupation (माता का व्यवसाय) *</Label>
          <Select
            value={formData.motherOccupation}
            onValueChange={(v) => setFormData({ ...formData, motherOccupation: v })}
            onOpenChange={(open) => {
              if (open && occupationCategories.length === 0) fetchOccupationOptions();
            }}
          >
            <SelectTrigger>
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
        </div>

        <div className="space-y-2">
          <Label htmlFor="grandfatherOccupation">Grandfather's Occupation (दादा का व्यवसाय) *</Label>
          <Select
            value={formData.grandfatherOccupation}
            onValueChange={(v) => setFormData({ ...formData, grandfatherOccupation: v })}
            onOpenChange={(open) => {
              if (open && occupationCategories.length === 0) fetchOccupationOptions();
            }}
          >
            <SelectTrigger>
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
        </div>

        <div className="space-y-2">
          <Label htmlFor="grandmotherOccupation">Grandmother's Occupation (दादी का व्यवसाय) *</Label>
          <Select
            value={formData.grandmotherOccupation}
            onValueChange={(v) => setFormData({ ...formData, grandmotherOccupation: v })}
            onOpenChange={(open) => {
              if (open && occupationCategories.length === 0) fetchOccupationOptions();
            }}
          >
            <SelectTrigger>
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
        </div>

        <div className="space-y-2">
          <Label htmlFor="nativePlace">Native Place (मूल स्थान) *</Label>
          <Input
            id="nativePlace"
            placeholder="e.g., Pune, Maharashtra"
            value={formData.nativePlace}
            onChange={(e) => setFormData({ ...formData, nativePlace: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="noOfBrothers">Number of Brothers (भाइयों की संख्या) *</Label>
          <Select
            value={formData.noOfBrothers?.toString() || ""}
            onValueChange={(v) => setFormData({ ...formData, noOfBrothers: v })}
          >
            <SelectTrigger>
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
        </div>

        <div className="space-y-2">
          <Label htmlFor="brothersMarried">Brothers Married (विवाहित भाई) *</Label>
          <Select
            value={formData.brothersMarried?.toString() || ""}
            onValueChange={(v) => setFormData({ ...formData, brothersMarried: v })}
          >
            <SelectTrigger>
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
        </div>

        <div className="space-y-2">
          <Label htmlFor="noOfSisters">Number of Sisters (बहनों की संख्या) *</Label>
          <Select
            value={formData.noOfSisters?.toString() || ""}
            onValueChange={(v) => setFormData({ ...formData, noOfSisters: v })}
          >
            <SelectTrigger>
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
        </div>

        <div className="space-y-2">
          <Label htmlFor="sistersMarried">Sisters Married (विवाहित बहनें) *</Label>
          <Select
            value={formData.sistersMarried?.toString() || ""}
            onValueChange={(v) => setFormData({ ...formData, sistersMarried: v })}
          >
            <SelectTrigger>
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
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="parentsContactNo">Parents Contact Number (माता-पिता का संपर्क नंबर)</Label>
          <Input
            id="parentsContactNo"
            type="tel"
            placeholder="+91 98765 43210"
            value={formData.parentsContactNo}
            onChange={(e) => setFormData({ ...formData, parentsContactNo: e.target.value })}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="aboutMyFamily">About My Family (मेरे परिवार के बारे में)</Label>
          <Textarea
            id="aboutMyFamily"
            placeholder="Tell us about your family..."
            rows={4}
            value={formData.aboutMyFamily}
            onChange={(e) => setFormData({ ...formData, aboutMyFamily: e.target.value })}
          />
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

export default Step4Family;
