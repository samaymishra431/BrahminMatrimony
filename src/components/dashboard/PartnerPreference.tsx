import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Heart, Loader2, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const REQUIRED_FIELDS = [
  "minAge",
  "maxAge",
  "minHeight",
  "maxHeight",
  "gender",
  "physicalStatus",
  "motherTongues",
  "maritalStatus",
  "haveChildren",
  "manglik",
  "dietaryHabits",
  "smokingHabits",
  "drinkingHabits",
  "educationType",
  "educationLevels",
  "employedIn",
  "occupations",
  "annualIncome",
  "aboutMyPartner",
];

const FIELD_LABELS: Record<string, string> = {
  minAge: "Min Age",
  maxAge: "Max Age",
  minHeight: "Min Height",
  maxHeight: "Max Height",
  gender: "Gender",
  physicalStatus: "Physical Status",
  motherTongues: "Mother Tongue",
  maritalStatus: "Marital Status",
  haveChildren: "Have Children",
  manglik: "Manglik",
  castes: "Caste",
  subCastes: "Sub Caste",
  gothras: "Gothra",
  stars: "Star",
  rashis: "Rashi",
  citizenships: "Citizenship",
  countriesLivedIn: "Countries Lived In",
  dietaryHabits: "Dietary Habits",
  smokingHabits: "Smoking Habits",
  drinkingHabits: "Drinking Habits",
  educationType: "Education Type",
  educationLevels: "Education Levels",
  employedIn: "Employed In",
  occupations: "Occupation",
  annualIncome: "Annual Income",
  aboutMyPartner: "About My Partner",
};

const PartnerPreference = () => {
  const [prefs, setPrefs] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState<Set<string>>(new Set());

  // Dynamic dropdown state
  const [heights, setHeights] = useState<any[]>([]);
  const [castes, setCastes] = useState<any[]>([]);
  const [subCastes, setSubCastes] = useState<any[]>([]);
  const [gothras, setGothras] = useState<any[]>([]);
  const [stars, setStars] = useState<any[]>([]);
  const [rashis, setRashis] = useState<any[]>([]);
  const [annualIncomeList, setAnnualIncomeList] = useState<any[]>([]);
  const [motherTongueOptions, setMotherTongueOptions] = useState<any[]>([]);

  const [countryOptions, setCountryOptions] = useState<any[]>([]);
  const [dropdownLoading, setDropdownLoading] = useState<string | null>(null);
  const [occupationCategories, setOccupationCategories] = useState<any[]>([]);
  const [openOccupation, setOpenOccupation] = useState(false);
  const [educationCategories, setEducationCategories] = useState<any[]>([]);

  const token = sessionStorage.getItem("token");
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  // Helper: map static enum values to human readable labels
  const formatEnumValue = (value: string) => {
    if (!value) return '';
    return value
      .toLowerCase()
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getReadableValue = (field: string, value: any) => {
    if (value === undefined || value === null || (Array.isArray(value) && value.length === 0)) return "N/A";

    // If array, map each item
    if (Array.isArray(value)) {
      return value.map(v => getReadableValue(field, v)).join(", ");
    }
    
    // First try to find in options
    const optionsMap: { [key: string]: any[] } = {
      gender: genderOptions,
      physicalStatus: physicalStatusOptions,
      manglik: manglikOptions,
      dietaryHabits: dietaryHabitsOptions,
      drinkingHabits: drinkingHabitsOptions,
      smokingHabits: smokingHabitsOptions,
      maritalStatus: maritalStatusOptions,
      educationType: educationTypeOptions,
      employedIn: employmentTypeOptions
    };

    if (typeof value === 'string' && optionsMap[field]) {
      const found = optionsMap[field].find(o => o.value === value || o.label === value);
      if (found) return found.label;
    }

    // If not found in options, format the enum value
    if (typeof value === 'string' && value === value.toUpperCase()) {
      return formatEnumValue(value);
    }

    return value;
  };

  // Helper: find label from dynamic option lists (heights, castes, etc.)
  const getOptionLabel = (options: any[], value: any, valueKey = "id", displayKey = "name") => {
    if (value === undefined || value === null || (Array.isArray(value) && value.length === 0)) return "N/A";
    if (Array.isArray(value)) {
      // join by mapping single values
      return value.map(v => getOptionLabel(options, v, valueKey, displayKey)).join(", ");
    }
    const found = options.find((o) => {
      return (o[valueKey] !== undefined && o[valueKey] === value) || o[valueKey] === value || o[displayKey] === value;
    });
    if (found) return found[displayKey] || value;
    const simpleFound = options.find((o) => Object.values(o).includes(value));
    return simpleFound ? (simpleFound[displayKey] || value) : value;
  };

  // Prefetch option lists for fields that already have values
  const prefetchOptionsForCurrentValues = () => {
    if (!formData) return;
    if (formData.minHeight || formData.maxHeight) {
      if (heights.length === 0) fetchDropdownData("heights");
    }
    if (formData.castes?.length) {
      if (castes.length === 0) fetchDropdownData("castes");
    }
    if (formData.subCastes?.length) {
      if (subCastes.length === 0) fetchDropdownData("subCastes");
    }
    if (formData.gothras?.length) {
      if (gothras.length === 0) fetchDropdownData("gothras");
    }
    if (formData.stars?.length) {
      if (stars.length === 0) fetchDropdownData("stars");
    }
    if (formData.rashis?.length) {
      if (rashis.length === 0) fetchDropdownData("raasi");
    }
    if (formData.annualIncome) {
      if (annualIncomeList.length === 0) fetchDropdownData("annualIncome");
    }
    if (formData.motherTongues?.length) {
      if (motherTongueOptions.length === 0) fetchDropdownData("motherTongue");
    }
    if (formData.educationLevels?.length) {
      if (educationCategories.length === 0) fetchDropdownData("education");
    }
    if (formData.occupations?.length) {
      if (occupationCategories.length === 0) fetchDropdownData("occupations");
    }
    if (formData.citizenships?.length) {
      if (countryOptions.length === 0) fetchDropdownData("countries");
    }
    if (formData.countriesLivedIn?.length) {
      if (countryOptions.length === 0) fetchDropdownData("countries");
    }
  };

  // Update handleEditToggle to ensure formData is synced
  const handleEditToggle = () => {
    const entering = !isEditing;
    setIsEditing(entering);
    if (entering) {
      setFormData({...prefs}); // Create new object to ensure state update
      prefetchOptionsForCurrentValues();
      
      // Fetch education and occupation categories when entering edit mode
      // This is the key fix - always fetch these when entering edit mode
      fetchDropdownData("education");
      fetchDropdownData("occupations");
    }
  };

  // Static dropdowns
  const genderOptions = [
    { value: "MALE", label: "Male" },
    { value: "FEMALE", label: "Female" },
    { value: "OTHER", label: "Other" },
    { value: "PREFER_NOT_TO_SAY", label: "Prefer not to say" },
  ];

  const physicalStatusOptions = [
    { value: "NORMAL", label: "Normal" },
    { value: "PHYSICALLY_CHALLENGED", label: "Physically Challenged" },
    { value: "ANY", label: "Doesn't Matter" }
];

  const manglikOptions = [
    { value: "YES", label: "Yes" },
    { value: "NO", label: "No" },
    { value: "DOESNT_MATTER", label: "Doesn't Matter" },
  ];

  const dietaryHabitsOptions = [
    { value: "VEGETARIAN", label: "Vegetarian" },
    { value: "NON_VEGETARIAN", label: "Non-Vegetarian" },
    { value: "EGGETARIAN", label: "Eggetarian" },
    { value: "VEGAN", label: "Vegan" },
    { value: "DOESNT_MATTER", label: "Doesn't Matter" },
  ];

  const drinkingHabitsOptions = [
    { value: "NON_DRINKER", label: "Non-Drinker" },
    { value: "LIGHT_SOCIAL_DRINKER", label: "Light/Social Drinker" },
    { value: "REGULAR_DRINKER", label: "Regular Drinker" },
    { value: "DOESNT_MATTER", label: "Doesn't Matter" },
  ];

  const smokingHabitsOptions = [
    { value: "NON_SMOKER", label: "Non-Smoker" },
    { value: "LIGHT_SOCIAL_SMOKER", label: "Light/Social Smoker" },
    { value: "REGULAR_SMOKER", label: "Regular Smoker" },
    { value: "DOESNT_MATTER", label: "Doesn't Matter" },
  ];

  const maritalStatusOptions = [
    { value: "UNMARRIED", label: "Unmarried" },
    { value: "WIDOW_WIDOWER", label: "Widow/Widower" },
    { value: "DIVORCED", label: "Divorced" },
    { value: "SEPARATED", label: "Separated" },
    { value: "DOESNT_MATTER", label: "Doesn't Matter" },
  ];

  const educationTypeOptions = [
    { value: "ANY", label: "Any Education" },
    { value: "ANY_DEGREE", label: "Any Degree" },
    { value: "PROFESSIONAL_DEGREE", label: "Professional Degree" },
    { value: "SPECIFIC_DEGREE", label: "Specific Degree" },
  ];

  const employmentTypeOptions = [
    { value: "GOVERNMENT", label: "Government" },
    { value: "DEFENCE", label: "Defence" },
    { value: "PRIVATE", label: "Private" },
    { value: "BUSINESS", label: "Business" },
    { value: "SELF_EMPLOYED", label: "Self Employed" },
    { value: "STUDENT", label: "Student" },
    { value: "NOT_WORKING", label: "Not Working" },
    { value: "OTHER", label: "Other" },
  ];

  // Add new static options for religion and have children
  const religionOptions = [
    { value: "HINDU", label: "Hindu" },
    { value: "MUSLIM", label: "Muslim" },
    { value: "CHRISTIAN", label: "Christian" },
    { value: "SIKH", label: "Sikh" },
    { value: "BUDDHIST", label: "Buddhist" },
    { value: "JAIN", label: "Jain" },
    { value: "OTHER", label: "Other" },
    { value: "PREFER_NOT_TO_SAY", label: "Prefer not to say" },
  ];

  const haveChildrenOptions = [
    { value: "DOESNT_MATTER", label: "Doesn't Matter" },
    { value: "YES_LIVING_TOGETHER", label: "Yes, Living Together" },
    { value: "YES_NOT_LIVING_TOGETHER", label: "Yes, Not Living Together" },
    { value: "NO", label: "No" },
  ];

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        if (!token) {
          setError("Authentication token not found");
          setLoading(false);
          return;
        }

        const response = await fetch(`${baseUrl}/api/profile-preference/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        
        if (response.ok) {
          // If payload present -> use it, else treat as empty record
          if (data.payload) {
            setPrefs(data.payload);
            setFormData(data.payload);
          } else {
            // No preferences found, initialize with empty object
            setPrefs({});
            setFormData({});
          }
        } else {
          // If 404 -> treat as "no data yet" and render empty form
          if (response.status === 404) {
            setPrefs({});
            setFormData({});
          } else {
            // Other errors -> show error message
            setError(data.message || "Failed to load preferences");
            toast({
              title: "Failed to load",
              description: data.message || "Could not fetch preferences.",
              variant: "destructive",
            });
          }
        }
      } catch (err: any) {
        console.error("Error fetching preferences:", err);
        setError("Something went wrong while fetching preferences");
        toast({
          title: "Error",
          description: "Something went wrong while fetching preferences.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchPreferences();
  }, []);

  // Fetch dropdown data dynamically on click
  const fetchDropdownData = async (type: string) => {
    try {
      if (!token) return;
      setDropdownLoading(type);
      let url = "";

      switch (type) {
        case "heights":
          url = `${baseUrl}/api/heights`;
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
        case "raasi":
          url = `${baseUrl}/api/raasi`;
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
        case "countries":
          url = `${baseUrl}/api/country`;
          break;
        default:
          return;
      }

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error(`Failed to fetch ${type}`);
      const data = await response.json();
      const list = data.payload || [];

      switch (type) {
        case "heights":
          setHeights(list);
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
        case "raasi":
          // Normalize raasi items to a consistent shape (id + name)
          setRashis(list.map((it: any) => ({ id: it.id, name: it.name || it.rashiName || it.rashi || it })));
          break;
        case "annualIncome":
          setAnnualIncomeList(list);
          break;
        case "occupations":
          setOccupationCategories(list);
          break;
        case "education":
          setEducationCategories(list);
          break;
        case "motherTongue":
          setMotherTongueOptions(list);
          break;
        case "countries":
          setCountryOptions(list);
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

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
    if (value && value.trim() !== "") {
      setValidationErrors((prev) => {
        const newErrors = new Set(prev);
        newErrors.delete(name);
        return newErrors;
      });
    }
  };

  // Helper to toggle values in array fields
  const toggleArrayValue = (field: string, val: any) => {
    setFormData((prev: any) => {
      const current = Array.isArray(prev[field]) ? [...prev[field]] : [];
      const idx = current.indexOf(val);
      if (idx === -1) current.push(val);
      else current.splice(idx, 1);
      
      if (current.length > 0) {
        setValidationErrors((prevErrors) => {
          const newErrors = new Set(prevErrors);
          newErrors.delete(field);
          return newErrors;
        });
      }
      
      return { ...prev, [field]: current };
    });
  };

  const validateForm = () => {
    const errors = new Set<string>();
    REQUIRED_FIELDS.forEach((field) => {
      const value = formData[field];
      if (
        value === undefined ||
        value === null ||
        value === "" ||
        (Array.isArray(value) && value.length === 0)
      ) {
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

    try {
      setSaving(true);
      const response = await fetch(`${baseUrl}/api/profile-preference/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setPrefs(data.payload || {});
        toast({
          title: "Success",
          description: "Preferences saved successfully!",
        });
        setIsEditing(false);
      } else {
        throw new Error(data.message || "Failed to save preferences");
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to save preferences. Try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // RENDER FIELD
  // fieldName: the key in formData (eg 'caste'), fetchType: the type used by fetchDropdownData (eg 'castes')
  const renderSelectField = (
    label: string,
    fieldName: string,
    options: any[],
    displayKey: string,
    valueKey: string,
    fetchType?: string
  ) => (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-3 md:p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-smooth">
      <span className="font-medium text-muted-foreground text-sm">
        {label} {REQUIRED_FIELDS.includes(fieldName) && <span className="text-red-500">*</span>}
      </span>
      {isEditing ? (
        <Select
          value={formData[fieldName] ?? ""}
          onValueChange={(v) => {
            setFormData((prev: any) => ({ ...prev, [fieldName]: v }));
            setValidationErrors((prev) => {
              const newErrors = new Set(prev);
              newErrors.delete(fieldName);
              return newErrors;
            });
          }}
          onOpenChange={(open) => {
            if (open) {
              // Dynamic fetch only if empty
              if (options.length === 0) {
                fetchDropdownData(fetchType || fieldName + "s");
              }
            }
          }}
        >
          <SelectTrigger className={validationErrors.has(fieldName) ? "w-full sm:w-[60%] border-red-500 border-2" : "w-full sm:w-[60%]"}>
            <SelectValue placeholder={`Select ${label}`} />
          </SelectTrigger>
          <SelectContent>
            {dropdownLoading === (fetchType || fieldName + "s") ? (
              <div className="text-center py-2">
                <Loader2 className="animate-spin w-4 h-4 mx-auto" />
              </div>
            ) : (
              options.map((item) => (
                <SelectItem key={item.id || item[valueKey]} value={item[valueKey]}>
                  {item[displayKey]}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      ) : (
        <span className="font-semibold text-foreground text-sm sm:text-base break-all">
          {getOptionLabel(options, prefs[fieldName], valueKey, displayKey)}
        </span>
      )}
    </div>
  );

  const renderStaticSelectField = (
    label: string,
    name: string,
    options: any[],
    isMulti = false
  ) => (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-3 md:p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-smooth">
      <span className="font-medium text-muted-foreground text-sm">
        {label} {REQUIRED_FIELDS.includes(name) && <span className="text-red-500">*</span>}
      </span>
      {isEditing ? (
        isMulti ? (
          // Use popover + command for multi-select static options + show selected tags
          <div className="w-full sm:w-[60%]">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={validationErrors.has(name) ? "w-full justify-between border-red-500 border-2" : "w-full justify-between"}>
                  <span className="text-left">
                    {(formData[name]?.length ? formData[name].map((v:string) => getReadableValue(name, v)).join(", ") : `Select ${label}`)}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0">
                <Command>
                  <CommandInput placeholder={`Search ${label}`} />
                  <CommandEmpty>No results.</CommandEmpty>
                  <CommandGroup className="max-h-60 overflow-auto">
                    {options.map((opt) => (
                      <CommandItem
                        key={opt.value}
                        onSelect={() => toggleArrayValue(name, opt.value)}
                        className="flex items-center justify-between"
                      >
                        <span>{opt.label}</span>
                        {Array.isArray(formData[name]) && formData[name].includes(opt.value) ? (
                          <Check className="w-4 h-4" />
                        ) : null}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>

            {/* Selected tags (consistent with dynamic multi-select fields) */}
            {Array.isArray(formData[name]) && formData[name].length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData[name].map((tag: string) => (
                  <div key={tag} className="flex items-center bg-gray-100 text-sm px-3 py-1 rounded-full">
                    <span className="mr-2">{getReadableValue(name, tag)}</span>
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => toggleArrayValue(name, tag)}
                      aria-hidden
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <Select
            value={formData[name] || ""}
            onValueChange={(v) => {
              setFormData((prev: any) => ({ ...prev, [name]: v }));
              setValidationErrors((prev) => {
                const newErrors = new Set(prev);
                newErrors.delete(name);
                return newErrors;
              });
            }}
          >
            <SelectTrigger className={validationErrors.has(name) ? "w-full sm:w-[60%] border-red-500 border-2" : "w-full sm:w-[60%]"}>
              <SelectValue placeholder={`Select ${label}`} />
            </SelectTrigger>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      ) : (
        <span className="font-semibold text-foreground text-sm sm:text-base break-all">
          {getReadableValue(name, prefs[name])}
        </span>
      )}
    </div>
  );

  // Insert missing renderMultiSelectField so other code (renderMotherTongueField etc.) can call it
  const renderMultiSelectField = (
    label: string,
    fieldName: string,
    options: any[],
    displayKey = "name",
    valueKey = "name",
    fetchType?: string
  ) => (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 p-3 md:p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-smooth">
      <span className="font-medium text-muted-foreground text-sm">
        {label} {REQUIRED_FIELDS.includes(fieldName) && <span className="text-red-500">*</span>}
      </span>
      {isEditing ? (
        <div className="w-full sm:w-[60%]">
          <Select
            onOpenChange={(open) => {
              if (open && options.length === 0) {
                fetchDropdownData(fetchType || fieldName);
              }
            }}
          >
            <SelectTrigger className={validationErrors.has(fieldName) ? "w-full justify-between border-red-500 border-2" : "w-full justify-between"}>
              <SelectValue placeholder={`Select ${label}`} />
            </SelectTrigger>
            <SelectContent>
              {dropdownLoading === (fetchType || fieldName) ? (
                <div className="p-4 text-center">
                  <Loader2 className="animate-spin w-4 h-4 mx-auto" />
                </div>
              ) : (
                options.map((opt: any) => {
                  const val = opt[valueKey] ?? opt[displayKey] ?? opt;
                  const labelText = opt[displayKey] ?? opt[valueKey] ?? `${opt}`;
                  const selected = Array.isArray(formData[fieldName]) && formData[fieldName].includes(val);
                  return (
                    <div
                      key={val}
                      className={`px-3 py-2 cursor-pointer rounded-md flex items-center justify-between ${selected ? "bg-primary text-white" : "hover:bg-gray-100"}`}
                      onClick={() => toggleArrayValue(fieldName, val)}
                    >
                      <span>{labelText}</span>
                      {selected ? <Check className="w-4 h-4" /> : null}
                    </div>
                  );
                })
              )}
            </SelectContent>
          </Select>

          {/* Selected tags (like Languages Known) */}
          {Array.isArray(formData[fieldName]) && formData[fieldName].length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {formData[fieldName].map((tag: string) => (
                <div key={tag} className="flex items-center bg-gray-100 text-sm px-3 py-1 rounded-full">
                  <span className="mr-2">{getOptionLabel(options, tag, valueKey, displayKey) || tag}</span>
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => toggleArrayValue(fieldName, tag)}
                    aria-hidden
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <span className="font-semibold text-foreground text-sm sm:text-base break-all">
          {Array.isArray(prefs[fieldName]) ? prefs[fieldName].join(", ") : (prefs[fieldName] || "N/A")}
        </span>
      )}
    </div>
  );

  // Replace existing renderOccupationField implementation with the following
  const renderOccupationField = () => (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-3 md:p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-smooth">
      <span className="font-medium text-muted-foreground text-sm">
        Occupation (व्यवसाय) {REQUIRED_FIELDS.includes("occupations") && <span className="text-red-500">*</span>}
      </span>
      {isEditing ? (
        <div className="w-full sm:w-[60%]">
          <Select
            onOpenChange={(open) => {
              if (open && occupationCategories.length === 0) {
                fetchDropdownData("occupations");
              }
            }}
          >
            <SelectTrigger className={validationErrors.has("occupations") ? "w-full justify-between border-red-500 border-2" : "w-full justify-between"}>
              <SelectValue placeholder="Select occupation" />
            </SelectTrigger>
            <SelectContent>
              {dropdownLoading === "occupations" ? (
                <div className="flex justify-center items-center p-2">
                  <Loader2 className="animate-spin w-4 h-4 mr-2" /> Loading...
                </div>
              ) : (
                occupationCategories.map((cat) => (
                  <div key={cat.id}>
                    <div className="px-2 py-1 font-semibold text-sm text-gray-600">
                      {cat.categoryName}
                    </div>
                    {cat.occupationOptions.map((opt: any) => {
                      const val = opt.optionName;
                      const selected = Array.isArray(formData.occupations) && formData.occupations.includes(val);
                      return (
                        <div
                          key={opt.id}
                          className={`pl-6 pr-3 py-2 cursor-pointer rounded-md flex items-center justify-between ${selected ? "bg-primary text-white" : "hover:bg-gray-100"} sm:pl-8`}
                          onClick={() => toggleArrayValue("occupations", val)}
                        >
                          <span>{val}</span>
                          {selected ? <Check className="w-4 h-4" /> : null}
                        </div>
                      );
                    })}
                  </div>
                ))
              )}
            </SelectContent>
          </Select>

          {/* Selected occupation tags */}
          {Array.isArray(formData.occupations) && formData.occupations.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.occupations.map((tag: string) => (
                <div key={tag} className="flex items-center bg-gray-100 text-sm px-3 py-1 rounded-full">
                  <span className="mr-2">{tag}</span>
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => toggleArrayValue("occupations", tag)}
                    aria-hidden
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <span className="font-semibold text-foreground text-sm sm:text-base break-all">
          {prefs.occupations?.length ? prefs.occupations.join(", ") : "N/A"}
        </span>
      )}
    </div>
  );

  // Education levels -> multi-select with categories
  const renderEducationLevelsField = () => (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-3 md:p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-smooth">
      <span className="font-medium text-muted-foreground text-sm">
        Education Levels (शिक्षा स्तर) {REQUIRED_FIELDS.includes("educationLevels") && <span className="text-red-500">*</span>}
      </span>
      {isEditing ? (
        <div className="w-full sm:w-[60%]">
          <Select
            onOpenChange={(open) => {
              if (open && educationCategories.length === 0) {
                fetchDropdownData("education");
              }
            }}
          >
            <SelectTrigger className={validationErrors.has("educationLevels") ? "w-full justify-between border-red-500 border-2" : "w-full justify-between"}>
              <SelectValue placeholder="Select education level" />
            </SelectTrigger>
            <SelectContent>
              {dropdownLoading === "education" ? (
                <div className="flex justify-center items-center p-2">
                  <Loader2 className="animate-spin w-4 h-4 mr-2" /> Loading...
                </div>
              ) : (
                educationCategories.map((cat: any) => (
                  <div key={cat.id}>
                    <div className="px-2 py-1 font-semibold text-sm text-gray-600">
                      {cat.categoryName}
                    </div>
                    {cat.educationOptions.map((opt: any) => {
                      const selected = Array.isArray(formData.educationLevels) && formData.educationLevels.includes(opt.optionName);
                      return (
                        <div
                          key={opt.id}
                          className={`pl-6 pr-3 py-2 cursor-pointer rounded-md flex items-center justify-between ${selected ? "bg-primary text-white" : "hover:bg-gray-100"} sm:pl-8`}
                          onClick={() => toggleArrayValue("educationLevels", opt.optionName)}
                        >
                          <span>{opt.optionName}</span>
                          {selected ? <Check className="w-4 h-4" /> : null}
                        </div>
                      );
                    })}
                  </div>
                ))
              )}
            </SelectContent>
          </Select>

          {/* Selected education level tags */}
          {Array.isArray(formData.educationLevels) && formData.educationLevels.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.educationLevels.map((tag: string) => (
                <div key={tag} className="flex items-center bg-gray-100 text-sm px-3 py-1 rounded-full">
                  <span className="mr-2">{tag}</span>
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => toggleArrayValue("educationLevels", tag)}
                    aria-hidden
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <span className="font-semibold text-foreground text-sm sm:text-base break-all">
          {prefs.educationLevels?.length ? prefs.educationLevels.join(", ") : "N/A"}
        </span>
      )}
    </div>
  );

  // New: Employed In -> multi-select styled like Occupation flow
  const renderEmployedInField = () => (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-3 md:p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-smooth">
      <span className="font-medium text-muted-foreground text-sm">
        Employed In (कार्यरत) {REQUIRED_FIELDS.includes("employedIn") && <span className="text-red-500">*</span>}
      </span>
      {isEditing ? (
        <div className="w-full sm:w-[60%]">
          <Select>
            <SelectTrigger className={validationErrors.has("employedIn") ? "w-full justify-between border-red-500 border-2" : "w-full justify-between"}>
              <SelectValue placeholder="Select employment types" />
            </SelectTrigger>
            <SelectContent>
              {employmentTypeOptions.map((opt) => {
                const val = opt.value;
                const selected = Array.isArray(formData.employedIn) && formData.employedIn.includes(val);
                return (
                  <div
                    key={val}
                    className={`px-3 py-2 cursor-pointer rounded-md flex items-center justify-between ${selected ? "bg-primary text-white" : "hover:bg-gray-100"}`}
                    onClick={() => toggleArrayValue("employedIn", val)}
                  >
                    <span>{opt.label}</span>
                    {selected ? <Check className="w-4 h-4" /> : null}
                  </div>
                );
              })}
            </SelectContent>
          </Select>

          {/* Selected tags */}
          {Array.isArray(formData.employedIn) && formData.employedIn.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.employedIn.map((tag: string) => (
                <div key={tag} className="flex items-center bg-gray-100 text-sm px-3 py-1 rounded-full">
                  <span className="mr-2">{getReadableValue("employedIn", tag)}</span>
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => toggleArrayValue("employedIn", tag)}
                    aria-hidden
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <span className="font-semibold text-foreground text-sm sm:text-base break-all">
          {prefs.employedIn?.length
            ? prefs.employedIn.map((v: string) => getReadableValue("employedIn", v)).join(", ")
            : "N/A"}
        </span>
      )}
    </div>
  );

  const renderField = (label: string, value: any, name: string, type?: string) => {
    // Special handling for arrays
    if (Array.isArray(value)) {
      value = value.map(v => getReadableValue(name, v)).join(", ");
    }
    
    // Age Range
    if (name === "ageRange") {
      return (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-3 md:p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-smooth">
          <span className="font-medium text-muted-foreground text-sm">
            {label} <span className="text-red-500">*</span>
          </span>
          {isEditing ? (
            <div className="flex gap-2 w-full sm:w-[60%]">
              <Select
                value={(formData.minAge || "").toString()}
                onValueChange={(v) => {
                  setFormData((prev: any) => ({ ...prev, minAge: Number(v) }));
                  setValidationErrors((prev) => {
                    const newErrors = new Set(prev);
                    newErrors.delete("minAge");
                    return newErrors;
                  });
                }}
              >
                <SelectTrigger className={validationErrors.has("minAge") ? "w-full border-red-500 border-2" : "w-full"}>
                  <SelectValue placeholder="Min age" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 53 }, (_, i) => i + 18).map((age) => (
                    <SelectItem key={age} value={age.toString()}>
                      {age}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={(formData.maxAge || "").toString()}
                onValueChange={(v) => {
                  setFormData((prev: any) => ({ ...prev, maxAge: Number(v) }));
                  setValidationErrors((prev) => {
                    const newErrors = new Set(prev);
                    newErrors.delete("maxAge");
                    return newErrors;
                  });
                }}
              >
                <SelectTrigger className={validationErrors.has("maxAge") ? "w-full border-red-500 border-2" : "w-full"}>
                  <SelectValue placeholder="Max age" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 53 }, (_, i) => i + 18).map((age) => (
                    <SelectItem key={age} value={age.toString()}>
                      {age}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <span className="font-semibold text-foreground text-sm sm:text-base break-all">
              {prefs.minAge && prefs.maxAge ? `${prefs.minAge} - ${prefs.maxAge} years` : "N/A"}
            </span>
          )}
        </div>
      );
    }

    // Height Range (Dynamic Dropdown)
    if (name === "heightRange") {
      return (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-3 md:p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-smooth">
          <span className="font-medium text-muted-foreground text-sm">
            {label} <span className="text-red-500">*</span>
          </span>
          {isEditing ? (
            <div className="flex gap-2 w-full sm:w-[60%]">
              <Select
                value={formData.minHeight || ""}
                onValueChange={(v) => {
                  setFormData((prev: any) => ({ ...prev, minHeight: v }));
                  setValidationErrors((prev) => {
                    const newErrors = new Set(prev);
                    newErrors.delete("minHeight");
                    return newErrors;
                  });
                }}
                onOpenChange={(open) => open && fetchDropdownData("heights")}
              >
                <SelectTrigger className={validationErrors.has("minHeight") ? "w-full border-red-500 border-2" : "w-full"}>
                  <SelectValue placeholder="Min height" />
                </SelectTrigger>
                <SelectContent>
                  {dropdownLoading === "heights" ? (
                    <div className="text-center py-2">
                      <Loader2 className="animate-spin w-4 h-4 mx-auto" />
                    </div>
                  ) : (
                    heights.map((h) => (
                      <SelectItem key={h.id} value={h.height}>
                        {h.height}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>

              <Select
                value={formData.maxHeight || ""}
                onValueChange={(v) => {
                  setFormData((prev: any) => ({ ...prev, maxHeight: v }));
                  setValidationErrors((prev) => {
                    const newErrors = new Set(prev);
                    newErrors.delete("maxHeight");
                    return newErrors;
                  });
                }}
                onOpenChange={(open) => open && fetchDropdownData("heights")}
              >
                <SelectTrigger className={validationErrors.has("maxHeight") ? "w-full border-red-500 border-2" : "w-full"}>
                  <SelectValue placeholder="Max height" />
                </SelectTrigger>
                <SelectContent>
                  {dropdownLoading === "heights" ? (
                    <div className="text-center py-2">
                      <Loader2 className="animate-spin w-4 h-4 mx-auto" />
                    </div>
                  ) : (
                    heights.map((h) => (
                      <SelectItem key={h.id} value={h.height}>
                        {h.height}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <span className="font-semibold text-foreground text-sm sm:text-base break-all">
              {prefs.minHeight && prefs.maxHeight ? `${prefs.minHeight} - ${prefs.maxHeight}` : "N/A"}
            </span>
          )}
        </div>
      );
    }

    // Default Input
    return (
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-3 md:p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-smooth">
        <span className="font-medium text-muted-foreground text-sm">
          {label} {REQUIRED_FIELDS.includes(name) && <span className="text-red-500">*</span>}
        </span>
        {isEditing ? (
          <Input
            type={type || "text"}
            name={name}
            value={formData[name] || ""}
            onChange={handleChange}
            className={validationErrors.has(name) ? "w-full sm:w-[60%] border-red-500 border-2" : "w-full sm:w-[60%]"}
          />
        ) : (
          <span className="font-semibold text-foreground text-sm sm:text-base break-all">
            {value || "N/A"}
          </span>
        )}
      </div>
    );
  };

  // Fixed religion (display)
  const renderFixedReligion = () => (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-3 md:p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-smooth">
      <span className="font-medium text-muted-foreground text-sm">Religion (धर्म)</span>
      <span className="font-semibold text-foreground text-sm sm:text-base break-all">
        Hindu
      </span>
    </div>
  );

  // Mother tongue now plural -> use multi-select
  const renderMotherTongueField = () => (
    renderMultiSelectField("Mother Tongue (मातृभाषा)", "motherTongues", motherTongueOptions, "languageName", "languageName", "motherTongue")
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="w-6 h-6 animate-spin text-primary mr-2" />
        <p className="text-muted-foreground">Loading preferences...</p>
      </div>
    );
  }

  // Only show failure message when fetch resulted in a true error (prefs still null).
  if (prefs === null) {
    return (
      <p className="text-center py-6 text-destructive">
        Failed to load preferences.
      </p>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* --- Header --- */}
      <Card className="border-0 shadow-medium">
        <CardHeader className="pb-4">
          <div className="flex flex-row items-center justify-between w-full">
            <CardTitle className="text-2xl md:text-3xl">
              Partner Preferences
            </CardTitle>
            {!isEditing ? (
              <Button onClick={handleEditToggle} className="bg-gradient-primary w-auto">
                <Edit className="w-4 h-4 mr-2" /> Edit
              </Button>
            ) : (
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-green-600 hover:bg-green-700 w-auto"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </>
                )}
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* --- Basic Preferences --- */}
      {isEditing ? (
        // Keep the original combined card for edit mode (unchanged)
        <Card className="border-0 shadow-medium">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary" />
              <CardTitle>Basic Preferences</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              {renderField("Age Range (आयु सीमा)", `${prefs.minAge} - ${prefs.maxAge} years`, "ageRange")}
              {renderField("Height Range (कद सीमा)", `${prefs.minHeight || ""} - ${prefs.maxHeight || ""}`, "heightRange")}
              {renderStaticSelectField("Gender (लिंग)", "gender", genderOptions)}
              {renderStaticSelectField("Physical Status (शारीरिक स्थिति)", "physicalStatus", physicalStatusOptions)}
              {renderMotherTongueField()}
              {renderStaticSelectField("Marital Status (वैवाहिक स्थिति)", "maritalStatus", maritalStatusOptions)}
              {renderStaticSelectField("Have Children (बच्चे हैं)", "haveChildren", haveChildrenOptions)}
              {renderStaticSelectField("Manglik (मांगलिक)", "manglik", manglikOptions)}
            </div>

            {/* Community Details */}
            <div className="mt-6 pt-6 border-t">
              <CardTitle className="text-lg mb-4">Community Details</CardTitle>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                {renderFixedReligion()}
                {renderMultiSelectField("Caste (जाति)", "castes", castes, "casteName", "casteName", "castes")}
                {renderMultiSelectField("Sub Caste (उप जाति)", "subCastes", subCastes, "subCasteName", "subCasteName", "subCastes")}
                {renderMultiSelectField("Gothra (गोत्र)", "gothras", gothras, "gothraName", "gothraName", "gothras")}
                {renderMultiSelectField("Star (नक्षत्र)", "stars", stars, "starName", "starName", "stars")}
                {renderMultiSelectField("Rashi (राशि)", "rashis", rashis, "name", "name", "raasi")}
                {renderMultiSelectField("Citizenship (नागरिकता)", "citizenships", countryOptions, "countryName", "countryName", "countries")}
                {renderMultiSelectField("Countries Lived In (देशों में रहे)", "countriesLivedIn", countryOptions, "countryName", "countryName", "countries")}
              </div>
            </div>

            {/* Lifestyle */}
            <div className="mt-6 pt-6 border-t">
              <CardTitle className="text-lg mb-4">Lifestyle</CardTitle>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                {renderStaticSelectField("Dietary Habits (खान-पान की आदतें)", "dietaryHabits", dietaryHabitsOptions)}
                {renderStaticSelectField("Smoking Habits (धूम्रपान की आदतें)", "smokingHabits", smokingHabitsOptions)}
                {renderStaticSelectField("Drinking Habits (पीने की आदतें)", "drinkingHabits", drinkingHabitsOptions)}
              </div>
            </div>

            {/* Education & Occupation */}
            <div className="mt-6 pt-6 border-t">
              <CardTitle className="text-lg mb-4">Education & Occupation</CardTitle>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                {renderStaticSelectField("Education Type (शिक्षा का प्रकार)", "educationType", educationTypeOptions)}
                {renderEducationLevelsField()}
                {renderEmployedInField()}
                {renderOccupationField()}
                {renderSelectField("Annual Income (वार्षिक आय)", "annualIncome", annualIncomeList, "incomeRange", "incomeRange", "annualIncome")}
              </div>
            </div>

            {/* About Partner */}
            <div className="mt-6 pt-6 border-t">
              <CardTitle className="text-lg mb-4">
                About My Partner (मेरे साथी के बारे में) {REQUIRED_FIELDS.includes("aboutMyPartner") && <span className="text-red-500">*</span>}
              </CardTitle>
              {isEditing ? (
                <textarea
                  name="aboutMyPartner"
                  value={formData.aboutMyPartner || ""}
                  onChange={handleChange}
                  className={validationErrors.has("aboutMyPartner") ? "w-full border rounded-md p-3 min-h-[100px] border-red-500 border-2" : "w-full border rounded-md p-3 min-h-[100px]"}
                />
              ) : (
                <p className="text-muted-foreground leading-relaxed">
                  {prefs.aboutMyPartner || "No details provided."}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        // Render four separate cards in view mode
        <>
          <Card className="border-0 shadow-medium">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" />
                <CardTitle>Basic Preferences</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                {renderField("Age Range (आयु सीमा)", `${prefs.minAge} - ${prefs.maxAge} years`, "ageRange")}
                {renderField("Height Range (कद सीमा)", `${prefs.minHeight || ""} - ${prefs.maxHeight || ""}`, "heightRange")}
                {renderStaticSelectField("Gender (लिंग)", "gender", genderOptions)}
                {renderStaticSelectField("Physical Status (शारीरिक स्थिति)", "physicalStatus", physicalStatusOptions)}
                {renderMotherTongueField()}
                {renderStaticSelectField("Marital Status (वैवाहिक स्थिति)", "maritalStatus", maritalStatusOptions)}
                {renderStaticSelectField("Have Children (बच्चे हैं)", "haveChildren", haveChildrenOptions)}
                {renderStaticSelectField("Manglik (मांगलिक)", "manglik", manglikOptions)}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-medium">
            <CardHeader>
              <CardTitle>Community Details</CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                {renderFixedReligion()}
                {renderMultiSelectField("Caste (जाति)", "castes", castes, "casteName", "casteName", "castes")}
                {renderMultiSelectField("Sub Caste (उप जाति)", "subCastes", subCastes, "subCasteName", "subCasteName", "subCastes")}
                {renderMultiSelectField("Gothra (गोत्र)", "gothras", gothras, "gothraName", "gothraName", "gothras")}
                {renderMultiSelectField("Star (नक्षत्र)", "stars", stars, "starName", "starName", "stars")}
                {renderMultiSelectField("Rashi (राशि)", "rashis", rashis, "name", "name", "raasi")}
                {renderMultiSelectField("Citizenship (नागरिकता)", "citizenships", countryOptions, "countryName", "countryName", "countries")}
                {renderMultiSelectField("Countries Lived In (देशों में रहे)", "countriesLivedIn", countryOptions, "countryName", "countryName", "countries")}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-medium">
            <CardHeader>
              <CardTitle>Lifestyle</CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                {renderStaticSelectField("Dietary Habits (खान-पान की आदतें)", "dietaryHabits", dietaryHabitsOptions)}
                {renderStaticSelectField("Smoking Habits (धूम्रपान की आदतें)", "smokingHabits", smokingHabitsOptions)}
                {renderStaticSelectField("Drinking Habits (पीने की आदतें)", "drinkingHabits", drinkingHabitsOptions)}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-medium">
            <CardHeader>
              <CardTitle>Education & Occupation</CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                {renderStaticSelectField("Education Type (शिक्षा का प्रकार)", "educationType", educationTypeOptions)}
                {renderEducationLevelsField()}
                {renderEmployedInField()}
                {renderOccupationField()}
                {renderSelectField("Annual Income (वार्षिक आय)", "annualIncome", annualIncomeList, "incomeRange", "incomeRange", "annualIncome")}
              </div>

              {/* About Partner (view mode) */}
              <div className="mt-6 pt-6 border-t">
                <CardTitle className="text-lg mb-4">About My Partner (मेरे साथी के बारे में)</CardTitle>
                <p className="text-muted-foreground leading-relaxed">
                  {prefs.aboutMyPartner || "No details provided."}
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default PartnerPreference;