import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface StepProps {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

const Step5Hobbies = ({ data, onNext, onBack }: StepProps) => {
  const [formData, setFormData] = useState({
    hobbies: data.hobbies || [],
    otherHobbies: data.otherHobbies || "",
    favouriteMusic: data.favouriteMusic || [],
    otherMusic: data.otherMusic || "",
    sports: data.sports || [],
    otherSports: data.otherSports || "",
    favouriteFood: data.favouriteFood || [],
    otherFood: data.otherFood || "",
  });

  const [saving, setSaving] = useState(false);
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:9090";

  // Updated enums to match backend exactly
  const hobbiesOptions = [
    { label: "Art & Handicraft", value: "ART_HANDICRAFT" },
    { label: "Cooking", value: "COOKING" },
    { label: "Dancing", value: "DANCING" },
    { label: "Gardening", value: "GARDENING" },
    { label: "Nature", value: "NATURE" },
    { label: "Painting", value: "PAINTING" },
    { label: "Pets", value: "PETS" },
    { label: "Photography", value: "PHOTOGRAPHY" },
    { label: "Playing Musical Instruments", value: "PLAYING_MUSICAL_INSTRUMENTS" },
    { label: "Puzzles", value: "PUZZLES" },
    { label: "Internet Surfing", value: "INTERNET_SURFING" },
    { label: "Listening to Music", value: "LISTENING_TO_MUSIC" },
    { label: "Movies", value: "MOVIES" },
    { label: "Travelling", value: "TRAVELLING" },
  ];

  const musicOptions = [
    { label: "Film Songs", value: "FILM_SONGS" },
    { label: "Indian Classical Music", value: "INDIAN_CLASSICAL_MUSIC" },
    { label: "Western Music", value: "WESTERN_MUSIC" },
  ];

  const sportsOptions = [
    { label: "Badminton", value: "BADMINTON" },
    { label: "Carrom", value: "CARROM" },
    { label: "Chess", value: "CHESS" },
    { label: "Cricket", value: "CRICKET" },
    { label: "Football", value: "FOOTBALL" },
    { label: "Jogging", value: "JOGGING" },
    { label: "Swimming", value: "SWIMMING" },
  ];

  const foodOptions = [
    { label: "Arabic", value: "ARABIC" },
    { label: "Bengali", value: "BENGALI" },
    { label: "Chinese", value: "CHINESE" },
    { label: "Continental", value: "CONTINENTAL" },
    { label: "Fast Food", value: "FAST_FOOD" },
    { label: "Gujarati", value: "GUJARATI" },
    { label: "Italian", value: "ITALIAN" },
    { label: "Konkan", value: "KONKAN" },
    { label: "Mexican", value: "MEXICAN" },
    { label: "Moghlai", value: "MOGHLAI" },
    { label: "Punjabi", value: "PUNJABI" },
    { label: "Rajasthani", value: "RAJASTHANI" },
    { label: "South Indian", value: "SOUTH_INDIAN" },
    { label: "Spanish", value: "SPANISH" },
    { label: "Sushi", value: "SUSHI" },
  ];

  const handleArrayToggle = (field: string, value: string) => {
    const currentArray = formData[field as keyof typeof formData] as string[];
    const updated = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    setFormData({ ...formData, [field]: updated });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (formData.hobbies.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one hobby.",
        variant: "destructive",
      });
      return;
    }

    if (formData.favouriteMusic.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one music preference.",
        variant: "destructive",
      });
      return;
    }

    if (formData.sports.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one sport.",
        variant: "destructive",
      });
      return;
    }

    if (formData.favouriteFood.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one food preference.",
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

    const payload = {
      hobbies: formData.hobbies,
      otherHobbies: formData.otherHobbies,
      favouriteMusic: formData.favouriteMusic,
      otherMusic: formData.otherMusic,
      sports: formData.sports,
      otherSports: formData.otherSports,
      favouriteFood: formData.favouriteFood,
      otherFood: formData.otherFood,
    };

    try {
      const response = await fetch(`${baseUrl}/api/hobbies`, {
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
          description: result.message || "Hobbies details saved.",
          variant: "default",
        });
        onNext(result.payload || payload);
      } else {
        toast({
          title: "Error saving details",
          description: result.message || "Failed to save hobbies details.",
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
      <div className="space-y-6">
        {/* HOBBIES */}
        <div className="space-y-3">
          <Label>Hobbies (शौक) *</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {hobbiesOptions.map(opt => (
              <div key={opt.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`hobby-${opt.value}`}
                  checked={formData.hobbies.includes(opt.value)}
                  onCheckedChange={() => handleArrayToggle("hobbies", opt.value)}
                />
                <label htmlFor={`hobby-${opt.value}`} className="text-sm cursor-pointer">
                  {opt.label}
                </label>
              </div>
            ))}
          </div>
          <Input
            placeholder="Other hobbies..."
            value={formData.otherHobbies}
            onChange={e => setFormData({ ...formData, otherHobbies: e.target.value })}
          />
        </div>

        {/* MUSIC */}
        <div className="space-y-3">
          <Label>Favourite Music (पसंदीदा संगीत) *</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {musicOptions.map(opt => (
              <div key={opt.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`music-${opt.value}`}
                  checked={formData.favouriteMusic.includes(opt.value)}
                  onCheckedChange={() => handleArrayToggle("favouriteMusic", opt.value)}
                />
                <label htmlFor={`music-${opt.value}`} className="text-sm cursor-pointer">
                  {opt.label}
                </label>
              </div>
            ))}
          </div>
          <Input
            placeholder="Other music genres..."
            value={formData.otherMusic}
            onChange={e => setFormData({ ...formData, otherMusic: e.target.value })}
          />
        </div>

        {/* SPORTS */}
        <div className="space-y-3">
          <Label>Sports & Fitness (खेल और फिटनेस) *</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {sportsOptions.map(opt => (
              <div key={opt.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`sport-${opt.value}`}
                  checked={formData.sports.includes(opt.value)}
                  onCheckedChange={() => handleArrayToggle("sports", opt.value)}
                />
                <label htmlFor={`sport-${opt.value}`} className="text-sm cursor-pointer">
                  {opt.label}
                </label>
              </div>
            ))}
          </div>
          <Input
            placeholder="Other sports..."
            value={formData.otherSports}
            onChange={e => setFormData({ ...formData, otherSports: e.target.value })}
          />
        </div>

        {/* FOOD */}
        <div className="space-y-3">
          <Label>Favourite Food (पसंदीदा भोजन) *</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {foodOptions.map(opt => (
              <div key={opt.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`food-${opt.value}`}
                  checked={formData.favouriteFood.includes(opt.value)}
                  onCheckedChange={() => handleArrayToggle("favouriteFood", opt.value)}
                />
                <label htmlFor={`food-${opt.value}`} className="text-sm cursor-pointer">
                  {opt.label}
                </label>
              </div>
            ))}
          </div>
          <Input
            placeholder="Other cuisines..."
            value={formData.otherFood}
            onChange={e => setFormData({ ...formData, otherFood: e.target.value })}
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

export default Step5Hobbies;
