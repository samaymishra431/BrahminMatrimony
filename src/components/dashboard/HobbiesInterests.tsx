import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Edit,
  Heart,
  Music,
  Trophy,
  Utensils,
  Loader2,
  Save,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

interface HobbiesData {
  id: number;
  hobbies: string[];
  otherHobbies: string;
  favouriteMusic: string[];
  otherMusic: string;
  sports: string[];
  otherSports: string;
  favouriteFood: string[];
  otherFood: string;
}

const HobbiesInterests = () => {
  const [user, setUser] = useState<HobbiesData | null>(null);
  const [formData, setFormData] = useState<Partial<HobbiesData>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState("");

  // ✅ Fetch hobbies data
  useEffect(() => {
    const fetchHobbies = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          console.error("Token not found");
          setLoading(false);
          return;
        }

        const baseUrl = import.meta.env.VITE_API_BASE_URL;
        const res = await fetch(`${baseUrl}/api/hobbies`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const result = await res.json();

        // If API returns 404 or payload is empty, treat as empty record so UI renders editable form with N/A
        if (!res.ok) {
          if (res.status === 404) {
            setUser({} as HobbiesData);
            setFormData({});
            setLoading(false);
            return;
          } else {
            throw new Error(result.message || "Failed to fetch data");
          }
        }

        if (!result.payload) {
          setUser({} as HobbiesData);
          setFormData({});
          setLoading(false);
          return;
        }

        setUser(result.payload);
        setFormData(result.payload);
      } catch (err: any) {
        console.error("Error fetching hobbies:", err);
        setError("Failed to load hobbies & interests");
      } finally {
        setLoading(false);
      }
    };

    fetchHobbies();
  }, []);

  // ✅ Handle edit toggle
  const handleEditToggle = () => {
    setEditMode(!editMode);
    setFormData(user || {});
  };

  // ✅ Handle input change
  const handleChange = (field: keyof HobbiesData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // ✅ Handle save
  const handleSave = async () => {
    setSaving(true);
    const token = sessionStorage.getItem("token");
    const baseUrl = import.meta.env.VITE_API_BASE_URL;

    try {
      const res = await fetch(`${baseUrl}/api/hobbies`, {
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
          description: "Your hobbies & interests have been saved.",
        });
      } else {
        toast({
          title: "Update Failed",
          description: data.message || "Something went wrong.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Error updating hobbies:", err);
      toast({
        title: "Error",
        description: "Unable to save changes right now.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // helper to get label for a field/value using checkboxOptions or hobbyLabels fallback
  const getOptionLabel = (field: keyof HobbiesData, value: string) => {
    const options = (checkboxOptions as any)[field] as { value: string; label: string }[] | undefined;
    if (options) {
      const found = options.find((o) => o.value === value);
      if (found) return found.label;
    }
    // fallback for hobbies mapping and generic fallback
    return hobbyLabels[value] || value;
  };

  // ✅ Enum Mapping
  const hobbyLabels: Record<string, string> = {
    ART_HANDICRAFT: "Art / Handicraft",
    COOKING: "Cooking",
    DANCING: "Dancing",
    GARDENING: "Gardening / Landscaping",
    NATURE: "Nature",
    PAINTING: "Painting",
    PETS: "Pets",
    PHOTOGRAPHY: "Photography",
    PLAYING_MUSICAL_INSTRUMENTS: "Playing musical instruments",
    PUZZLES: "Puzzles",
    INTERNET_SURFING: "Internet Surfing",
    LISTENING_TO_MUSIC: "Listening to Music",
    MOVIES: "Movies",
    TRAVELLING: "Travelling",
  };

  const checkboxOptions = {
    hobbies: Object.entries(hobbyLabels).map(([value, label]) => ({
      value,
      label,
    })),
    favouriteMusic: [
      { value: "FILM_SONGS", label: "Film Songs" },
      { value: "INDIAN_CLASSICAL_MUSIC", label: "Indian / Classical Music" },
      { value: "WESTERN_MUSIC", label: "Western Music" },
    ],
    sports: [
      { value: "BADMINTON", label: "Badminton" },
      { value: "CARROM", label: "Carrom" },
      { value: "CHESS", label: "Chess" },
      { value: "CRICKET", label: "Cricket" },
      { value: "FOOTBALL", label: "Football" },
      { value: "JOGGING", label: "Jogging" },
      { value: "SWIMMING", label: "Swimming" },
    ],
    favouriteFood: [
      { value: "ARABIC", label: "Arabic" },
      { value: "BENGALI", label: "Bengali" },
      { value: "CHINESE", label: "Chinese" },
      { value: "CONTINENTAL", label: "Continental" },
      { value: "FAST_FOOD", label: "Fast Food" },
      { value: "GUJARATI", label: "Gujarati" },
      { value: "ITALIAN", label: "Italian" },
      { value: "KONKAN", label: "Konkan" },
      { value: "MEXICAN", label: "Mexican" },
      { value: "MOGHLAI", label: "Moghlai" },
      { value: "PUNJABI", label: "Punjabi" },
      { value: "RAJASTHANI", label: "Rajasthani" },
      { value: "SOUTH_INDIAN", label: "South Indian" },
      { value: "SPANISH", label: "Spanish" },
      { value: "SUSHI", label: "Sushi" },
    ],
  };

  // ✅ Render Checkbox Section (4 in a row)
  const renderList = (field: keyof HobbiesData, label: string) => {
    const options = checkboxOptions[field as keyof typeof checkboxOptions] || [];

    const handleCheckboxChange = (value: string) => {
      setFormData((prev) => {
        const current = Array.isArray(prev[field]) ? (prev[field] as string[]) : [];
        const selected = new Set(current);
        if (selected.has(value)) selected.delete(value);
        else selected.add(value);
        return { ...prev, [field]: Array.from(selected) };
      });
    };

    return (
      <div className="p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-smooth">
        <p className="text-sm text-muted-foreground mb-2 font-medium">{label}</p>
        {editMode ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
            {options.map((opt, index) => (
              <label key={index} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={
                    Array.isArray(formData[field]) &&
                    (formData[field] as string[]).includes(opt.value)
                  }
                  onChange={() => handleCheckboxChange(opt.value)}
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-sm text-foreground">{opt.label}</span>
              </label>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {Array.isArray(formData[field]) &&
              (formData[field] as string[]).map((val, index) => (
                <Badge key={index} variant="secondary" className="text-sm py-1 px-3">
                  {getOptionLabel(field, val)}
                </Badge>
              ))}
          </div>
        )}
      </div>
    );
  };

  // ✅ Render "Other" Inputs
  const renderOther = (field: keyof HobbiesData, label: string) => (
    <div className="p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-smooth mt-3">
      <p className="text-sm text-muted-foreground mb-2 font-medium">{label}</p>
      {editMode ? (
        <Input
          value={formData[field] || ""}
          onChange={(e) => handleChange(field, e.target.value)}
          placeholder={`Enter your ${label.toLowerCase()}`}
        />
      ) : (
        <p className="text-muted-foreground leading-relaxed">
          {formData[field] || "N/A"}
        </p>
      )}
    </div>
  );

  // Final JSX
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <Card className="border-0 shadow-medium">
        <CardHeader className="pb-4">
          <div className="flex flex-row items-center justify-between w-full">
            <CardTitle className="text-2xl md:text-3xl">
              Hobbies & Interests
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

      {/* Hobbies Section */}
      <Card className="border-0 shadow-medium">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary" />
            <CardTitle>Hobbies (शौक)</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {renderList("hobbies", "Hobbies (शौक)")}
          {renderOther("otherHobbies", "Other Hobbies (अन्य शौक)")}
        </CardContent>
      </Card>

      {/* Music Section */}
      <Card className="border-0 shadow-medium">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Music className="w-5 h-5 text-primary" />
            <CardTitle>Favourite Music (पसंदीदा संगीत)</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {renderList("favouriteMusic", "Favourite Music (पसंदीदा संगीत)")}
          {renderOther("otherMusic", "Other Music (अन्य संगीत)")}
        </CardContent>
      </Card>

      {/* Sports Section */}
      <Card className="border-0 shadow-medium">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            <CardTitle>Sports & Fitness (खेल और फिटनेस)</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {renderList("sports", "Sports (खेल)")}
          {renderOther("otherSports", "Other Sports (अन्य खेल)")}
        </CardContent>
      </Card>

      {/* Food Section */}
      <Card className="border-0 shadow-medium">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Utensils className="w-5 h-5 text-primary" />
            <CardTitle>Favourite Food (पसंदीदा भोजन)</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {renderList("favouriteFood", "Favourite Food (पसंदीदा भोजन)")}
          {renderOther("otherFood", "Other Food (अन्य भोजन)")}
        </CardContent>
      </Card>
    </div>
  );
};

export default HobbiesInterests;
