import { User } from "@/types/user";
import { Heart, Users, Briefcase, Globe, Utensils, Cigarette, Wine, ChevronDown } from "lucide-react";
import { useState } from "react";
import { SubscriptionModal } from "@/components/common/SubscriptionModal";

interface PartnerPreferenceModalProps {
  user: User;
}

const safeJoin = (val: any) => {
  if (val === undefined || val === null) return "N/A";
  if (Array.isArray(val)) return val.length ? val.join(", ") : "N/A";
  return String(val);
};

const safeVal = (val: any, fallback = "N/A") => {
  if (val === undefined || val === null || (typeof val === "string" && val.trim() === "")) return fallback;
  return val;
};

const employmentTypeMap: { [key: string]: string } = {
	GOVERNMENT: "Government",
	DEFENCE: "Defence",
	PRIVATE: "Private",
	BUSINESS: "Business",
	SELF_EMPLOYED: "Self Employed",
	STUDENT: "Student",
	NOT_WORKING: "Not Working",
	OTHER: "Other"
};

const religionMap: { [key: string]: string } = {
    HINDU: "Hindu",
    MUSLIM: "Muslim",
    CHRISTIAN: "Christian",
    SIKH: "Sikh",
    BUDDHIST: "Buddhist",
    JAIN: "Jain",
    OTHER: "Other",
    PREFER_NOT_TO_SAY: "Prefer not to say"
};

const mapEnumArray = (arr: any, map: { [key: string]: string }) => {
  if (!Array.isArray(arr)) return arr;
  return arr.map(item => map[item] || item);
};

const buildPrefs = (user: User) => {
  const hardcodedPrefs: any = {
    minAge: undefined,
    maxAge: undefined,
    minHeight: undefined,
    maxHeight: undefined,
    gender: undefined,
    physicalStatus: undefined,
    religion: undefined,
    caste: undefined,
    subCaste: undefined,
    manglik: undefined,
    educationLevels: undefined,
    occupation: undefined,
    minAnnualIncome: undefined,
    maxAnnualIncome: undefined,
    annualIncome: undefined,
    dietaryHabits: undefined,
    smokingHabits: undefined,
    drinkingHabits: undefined,
    aboutMyPartner: undefined,
    maritalStatus: undefined,
    haveChildren: undefined,
    motherTongues: undefined,
    gothras: undefined,
    stars: undefined,
    rashis: undefined,
    educationType: undefined,
    employedIn: undefined,
    citizenships: undefined,
    countriesLivedIn: undefined,
  };

  const apiPref: any = (user as any).preference ?? null;
  const legacyPref: any = (user as any).partnerPreferences ?? null;

  const prefs: any = { ...hardcodedPrefs };

  if (apiPref) {
    prefs.minAge = apiPref.minAge ?? prefs.minAge;
    prefs.maxAge = apiPref.maxAge ?? prefs.maxAge;
    prefs.minHeight = apiPref.minHeight ?? prefs.minHeight;
    prefs.maxHeight = apiPref.maxHeight ?? prefs.maxHeight;
    prefs.gender = apiPref.gender ?? prefs.gender;
    prefs.physicalStatus = Array.isArray(apiPref.physicalStatus) ? apiPref.physicalStatus : apiPref.physicalStatus ? [apiPref.physicalStatus] : prefs.physicalStatus;
    prefs.religion = Array.isArray(apiPref.religion) ? apiPref.religion : apiPref.religion ? [apiPref.religion] : prefs.religion;
    prefs.caste = apiPref.castes ?? apiPref.caste ?? prefs.caste;
    prefs.subCaste = apiPref.subCastes ?? apiPref.subCaste ?? prefs.subCaste;
    prefs.manglik = apiPref.manglik ?? prefs.manglik;
    prefs.educationLevels = apiPref.educationLevels ?? prefs.educationLevels;
    prefs.occupation = apiPref.occupations ?? apiPref.occupation ?? prefs.occupation;
    prefs.annualIncome = apiPref.annualIncome ?? prefs.annualIncome;
    prefs.minAnnualIncome = apiPref.minAnnualIncome ?? prefs.minAnnualIncome;
    prefs.maxAnnualIncome = apiPref.maxAnnualIncome ?? prefs.maxAnnualIncome;
    prefs.dietaryHabits = Array.isArray(apiPref.dietaryHabits) ? apiPref.dietaryHabits : apiPref.dietaryHabits ? [apiPref.dietaryHabits] : prefs.dietaryHabits;
    prefs.smokingHabits = Array.isArray(apiPref.smokingHabits) ? apiPref.smokingHabits : apiPref.smokingHabits ? [apiPref.smokingHabits] : prefs.smokingHabits;
    prefs.drinkingHabits = Array.isArray(apiPref.drinkingHabits) ? apiPref.drinkingHabits : apiPref.drinkingHabits ? [apiPref.drinkingHabits] : prefs.drinkingHabits;
    prefs.aboutMyPartner = apiPref.aboutMyPartner ?? prefs.aboutMyPartner;
    prefs.maritalStatus = apiPref.maritalStatus ?? prefs.maritalStatus;
    prefs.haveChildren = apiPref.haveChildren ?? prefs.haveChildren;
    prefs.motherTongues = Array.isArray(apiPref.motherTongues) ? apiPref.motherTongues : apiPref.motherTongues ? [apiPref.motherTongues] : prefs.motherTongues;
    prefs.gothras = Array.isArray(apiPref.gothras) ? apiPref.gothras : apiPref.gothras ? [apiPref.gothras] : prefs.gothras;
    prefs.stars = Array.isArray(apiPref.stars) ? apiPref.stars : apiPref.stars ? [apiPref.stars] : prefs.stars;
    prefs.rashis = Array.isArray(apiPref.rashis) ? apiPref.rashis : apiPref.rashis ? [apiPref.rashis] : prefs.rashis;
    prefs.educationType = apiPref.educationType ?? prefs.educationType;
    prefs.employedIn = Array.isArray(apiPref.employedIn) ? apiPref.employedIn : apiPref.employedIn ? [apiPref.employedIn] : prefs.employedIn;
    prefs.citizenships = Array.isArray(apiPref.citizenships) ? apiPref.citizenships : apiPref.citizenships ? [apiPref.citizenships] : prefs.citizenships;
    prefs.countriesLivedIn = Array.isArray(apiPref.countriesLivedIn) ? apiPref.countriesLivedIn : apiPref.countriesLivedIn ? [apiPref.countriesLivedIn] : prefs.countriesLivedIn;
  } else if (legacyPref) {
    prefs.minAge = legacyPref.minAge ?? prefs.minAge;
    prefs.maxAge = legacyPref.maxAge ?? prefs.maxAge;
    prefs.minHeight = legacyPref.minHeight ?? prefs.minHeight;
    prefs.maxHeight = legacyPref.maxHeight ?? prefs.maxHeight;
    prefs.gender = legacyPref.gender ?? prefs.gender;
    prefs.physicalStatus = Array.isArray(legacyPref.physicalStatus) ? legacyPref.physicalStatus : legacyPref.physicalStatus ? [legacyPref.physicalStatus] : prefs.physicalStatus;
    prefs.religion = legacyPref.religion ?? prefs.religion;
    prefs.caste = legacyPref.caste ?? prefs.caste;
    prefs.subCaste = legacyPref.subCaste ?? prefs.subCaste;
    prefs.manglik = legacyPref.manglik ?? prefs.manglik;
    prefs.educationLevels = legacyPref.educationLevels ?? prefs.educationLevels;
    prefs.occupation = legacyPref.occupation ?? prefs.occupation;
    prefs.minAnnualIncome = legacyPref.minAnnualIncome ?? prefs.minAnnualIncome;
    prefs.maxAnnualIncome = legacyPref.maxAnnualIncome ?? prefs.maxAnnualIncome;
    prefs.annualIncome = legacyPref.annualIncome ?? prefs.annualIncome;
    prefs.dietaryHabits = Array.isArray(legacyPref.dietaryHabits) ? legacyPref.dietaryHabits : legacyPref.dietaryHabits ? [legacyPref.dietaryHabits] : prefs.dietaryHabits;
    prefs.smokingHabits = Array.isArray(legacyPref.smokingHabits) ? legacyPref.smokingHabits : legacyPref.smokingHabits ? [legacyPref.smokingHabits] : prefs.smokingHabits;
    prefs.drinkingHabits = Array.isArray(legacyPref.drinkingHabits) ? legacyPref.drinkingHabits : legacyPref.drinkingHabits ? [legacyPref.drinkingHabits] : prefs.drinkingHabits;
    prefs.aboutMyPartner = legacyPref.aboutMyPartner ?? prefs.aboutMyPartner;
    prefs.maritalStatus = legacyPref.maritalStatus ?? prefs.maritalStatus;
    prefs.haveChildren = legacyPref.haveChildren ?? prefs.haveChildren;
    prefs.motherTongues = Array.isArray(legacyPref.motherTongues) ? legacyPref.motherTongues : legacyPref.motherTongues ? [legacyPref.motherTongues] : prefs.motherTongues;
    prefs.gothras = Array.isArray(legacyPref.gothras) ? legacyPref.gothras : legacyPref.gothras ? [legacyPref.gothras] : prefs.gothras;
    prefs.stars = Array.isArray(legacyPref.stars) ? legacyPref.stars : legacyPref.stars ? [legacyPref.stars] : prefs.stars;
    prefs.rashis = Array.isArray(legacyPref.rashis) ? legacyPref.rashis : legacyPref.rashis ? [legacyPref.rashis] : prefs.rashis;
    prefs.educationType = legacyPref.educationType ?? prefs.educationType;
    prefs.employedIn = Array.isArray(legacyPref.employedIn) ? legacyPref.employedIn : legacyPref.employedIn ? [legacyPref.employedIn] : prefs.employedIn;
    prefs.citizenships = Array.isArray(legacyPref.citizenships) ? legacyPref.citizenships : legacyPref.citizenships ? [legacyPref.citizenships] : prefs.citizenships;
    prefs.countriesLivedIn = Array.isArray(legacyPref.countriesLivedIn) ? legacyPref.countriesLivedIn : legacyPref.countriesLivedIn ? [legacyPref.countriesLivedIn] : prefs.countriesLivedIn;
  }

  return prefs;
};

const CompactDetailItem = ({ icon: Icon, label, value }: any) => (
  <div className="flex items-start gap-3 py-2 px-3 hover:bg-primary/5 rounded-lg transition-colors group">
    <div className="p-1.5 rounded-md bg-primary/10 group-hover:bg-primary/20 transition-colors flex-shrink-0 mt-0.5">
      <Icon className="w-3.5 h-3.5 text-primary" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</p>
      <p className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">{value}</p>
    </div>
  </div>
);

const AccordionItem = ({ icon: Icon, title, subtitle, children, defaultOpen = false }: any) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-primary/20 shadow-md overflow-hidden rounded-lg border">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-gradient-to-r from-primary/10 to-transparent border-b border-primary/10 hover:from-primary/15 hover:to-primary/5 transition-colors p-4"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 text-left">
            <div className="p-2 rounded-lg bg-primary/20">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">{title}</h3>
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            </div>
          </div>
          <ChevronDown 
            className={`w-5 h-5 text-primary transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </button>
      
      {isOpen && (
        <div className="pt-2 pb-3 animate-in fade-in slide-in-from-top-2 duration-200">
          {children}
        </div>
      )}
    </div>
  );
};

const PartnerPreferenceModal = ({ user }: PartnerPreferenceModalProps) => {
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);

  const renderOrUpgrade = (val: any) => {
    if (val === null || val === undefined || (typeof val === 'string' && val.trim() === '') || (Array.isArray(val) && val.length === 0)) {
      return (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsSubscriptionOpen(true);
          }}
          className="text-primary underline hover:text-primary/80 transition-colors"
        >
          Upgrade to View
        </button>
      );
    }
    return safeJoin(val);
  };

  const prefs = buildPrefs(user);

  const basicDetails = [
    { icon: Users, label: "Age Range (आयु सीमा)", value: `${safeVal(prefs.minAge)} - ${safeVal(prefs.maxAge)} years` },
    { icon: Users, label: "Height Range (कद सीमा)", value: `${safeVal(prefs.minHeight)} - ${safeVal(prefs.maxHeight)}` },
    { icon: Users, label: "Gender (लिंग)", value: safeVal(prefs.gender, "Any") },
    { icon: Users, label: "Marital Status (वैवाहिक स्थिति)", value: safeVal(prefs.maritalStatus, "Any") },
    ...(prefs.haveChildren ? [{ icon: Users, label: "Have Children (बच्चे हैं)", value: safeVal(prefs.haveChildren) }] : []),
  ];

  const physicalDetails = [
    { icon: Users, label: "Physical Status (शारीरिक स्थिति)", value: safeJoin(prefs.physicalStatus) },
  ];

  const religionDetails = [
    { icon: Heart, label: "Religion (धर्म)", value: safeJoin(mapEnumArray(prefs.religion, religionMap)) },
    { icon: Heart, label: "Caste (जाति)", value: renderOrUpgrade(prefs.caste) },
    { icon: Heart, label: "Sub Caste (उप जाति)", value: renderOrUpgrade(prefs.subCaste) },
    { icon: Heart, label: "Manglik (मांगलिक)", value: renderOrUpgrade(prefs.manglik) },
  ];

  const astrologyDetails = [
    { icon: Globe, label: "Gothras (गोत्र)", value: renderOrUpgrade(prefs.gothras) },
    { icon: Globe, label: "Stars (नक्षत्र)", value: renderOrUpgrade(prefs.stars) },
    { icon: Globe, label: "Rashis (राशि)", value: renderOrUpgrade(prefs.rashis) },
    ...(prefs.motherTongues && (Array.isArray(prefs.motherTongues) ? prefs.motherTongues.length > 0 : true) ? [{ icon: Globe, label: "Mother Tongues (मातृभाषा)", value: safeJoin(prefs.motherTongues) }] : []),
  ];

  const educationOccupationDetails = [
    { icon: Briefcase, label: "Education Levels (शिक्षा स्तर)", value: safeJoin(prefs.educationLevels) },
    { icon: Briefcase, label: "Education Type (शिक्षा का प्रकार)", value: safeVal(prefs.educationType, "Any") },
    { icon: Briefcase, label: "Occupation (व्यवसाय)", value: safeJoin(prefs.occupation) },
    ...(prefs.employedIn && (Array.isArray(prefs.employedIn) ? prefs.employedIn.length > 0 : true) ? [{ icon: Briefcase, label: "Employed In (कार्यरत)", value: safeJoin(mapEnumArray(prefs.employedIn, employmentTypeMap)) }] : []),
  ];

  const incomeDetails = [
    ...(prefs.annualIncome || prefs.minAnnualIncome || prefs.maxAnnualIncome ? [{ 
      icon: Briefcase, 
      label: "Income Range (Annual) (आय सीमा (वार्षिक))", 
      value: prefs.annualIncome ? safeVal(prefs.annualIncome) : `${safeVal(prefs.minAnnualIncome)} - ${safeVal(prefs.maxAnnualIncome)}` 
    }] : []),
  ];

  const lifestyleDetails = [
    { icon: Utensils, label: "Dietary Habits (खान-पान की आदतें)", value: safeJoin(prefs.dietaryHabits) },
    { icon: Cigarette, label: "Smoking Habits (धूम्रपान की आदतें)", value: safeJoin(prefs.smokingHabits) },
    { icon: Wine, label: "Drinking Habits (पीने की आदतें)", value: safeJoin(prefs.drinkingHabits) },
  ];

  const locationDetails = [
    ...(prefs.citizenships && (Array.isArray(prefs.citizenships) ? prefs.citizenships.length > 0 : true) ? [{ icon: Globe, label: "Citizenships (नागरिकता)", value: safeJoin(prefs.citizenships) }] : []),
    ...(prefs.countriesLivedIn && (Array.isArray(prefs.countriesLivedIn) ? prefs.countriesLivedIn.length > 0 : true) ? [{ icon: Globe, label: "Countries Lived In (देशों में रहे)", value: safeJoin(prefs.countriesLivedIn) }] : []),
  ];

  return (
    <div className="space-y-3 animate-fade-in">
      {/* Basic Preferences Accordion */}
      <AccordionItem
        icon={Users}
        title="Basic Preferences (बुनियादी प्राथमिकताएं)"
        subtitle="Age, gender & marital status"
        defaultOpen={true}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 px-3">
          {basicDetails.map((detail, idx) => (
            <CompactDetailItem key={idx} {...detail} />
          ))}
        </div>
      </AccordionItem>

      {/* Physical & Religion Accordion */}
      <AccordionItem
        icon={Heart}
        title="Religion & Physical (धर्म और शारीरिक)"
        subtitle="Religious & physical preferences"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 px-3">
          {physicalDetails.map((detail, idx) => (
            <CompactDetailItem key={idx} {...detail} />
          ))}
          {religionDetails.map((detail, idx) => (
            <CompactDetailItem key={idx} {...detail} />
          ))}
        </div>
      </AccordionItem>

      {/* Astrology Accordion */}
      {astrologyDetails.length > 0 && (
        <AccordionItem
          icon={Globe}
          title="Astrology (ज्योतिष)"
          subtitle="Astrological preferences"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 px-3">
            {astrologyDetails.map((detail, idx) => (
              <CompactDetailItem key={idx} {...detail} />
            ))}
          </div>
        </AccordionItem>
      )}

      {/* Education & Occupation Accordion */}
      <AccordionItem
        icon={Briefcase}
        title="Education & Occupation (शिक्षा और व्यवसाय)"
        subtitle="Career preferences"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 px-3">
          {educationOccupationDetails.map((detail, idx) => (
            <CompactDetailItem key={idx} {...detail} />
          ))}
        </div>
      </AccordionItem>

      {/* Income Accordion */}
      {incomeDetails.length > 0 && (
        <AccordionItem
          icon={Briefcase}
          title="Income (आय)"
          subtitle="Annual income range"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 px-3">
            {incomeDetails.map((detail, idx) => (
              <CompactDetailItem key={idx} {...detail} />
            ))}
          </div>
        </AccordionItem>
      )}

      {/* Lifestyle Accordion */}
      <AccordionItem
        icon={Utensils}
        title="Lifestyle Habits (जीवनशैली की आदतें)"
        subtitle="Dietary & personal habits"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 px-3">
          {lifestyleDetails.map((detail, idx) => (
            <CompactDetailItem key={idx} {...detail} />
          ))}
        </div>
      </AccordionItem>

      {/* Location Accordion */}
      {locationDetails.length > 0 && (
        <AccordionItem
          icon={Globe}
          title="Location Preferences (स्थान प्राथमिकताएं)"
          subtitle="Citizenship & countries"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 px-3">
            {locationDetails.map((detail, idx) => (
              <CompactDetailItem key={idx} {...detail} />
            ))}
          </div>
        </AccordionItem>
      )}

      {/* About My Partner Accordion */}
      {prefs.aboutMyPartner && (
        <AccordionItem
          icon={Heart}
          title="About My Partner (मेरे साथी के बारे में)"
          subtitle="Partner description"
        >
          <div className="px-3 pb-2">
            <p className="text-sm text-muted-foreground leading-relaxed bg-muted/20 p-3 rounded-lg">{safeVal(prefs.aboutMyPartner, "No details provided.")}</p>
          </div>
        </AccordionItem>
      )}

      <SubscriptionModal isOpen={isSubscriptionOpen} onClose={() => setIsSubscriptionOpen(false)} />
    </div>
  );
};

export default PartnerPreferenceModal;
