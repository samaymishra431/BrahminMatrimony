export interface User {
  id: string;
  email: string;
  username: string;
  
  // Basic Details
  firstName: string;
  lastName: string;
  gender: string;
  profileCreatedFor: string;
  dateOfBirth: string;
  timeOfBirth?: string;
  placeOfBirth: string;
  religion: string;
  caste: string;
  subCaste?: string;
  maritalStatus: string;
  heightIn: string;
  weight?: string;
  physicalStatus: string;
  motherTongue: string;
  gothra?: string;
  star?: string;
  rashi?: string;
  manglik?: string;
  about?: string;
  dietaryHabits: string;
  drinkingHabits: string;
  smokingHabits: string;
  
  // Education & Occupation
  highestEducation: string;
  additionalDegree?: string;
  collegeInstitution?: string;
  educationInDetail?: string;
  employedIn: string;
  occupation: string;
  occupationInDetail?: string;
  annualIncome?: string;
  incomeCurrency: string;
  workCity?: string;
  workCountry?: string;
  
  // Family Details
  familyValue: string;
  familyType: string;
  familyStatus: string;
  fatherOccupation?: string;
  motherOccupation?: string;
  nativePlace?: string;
  noOfBrothers?: string;
  brothersMarried?: string;
  noOfSisters?: string;
  sistersMarried?: string;
  parentsContactNo?: string;
  aboutMyFamily?: string;
  
  // Hobbies & Interests
  hobbies: string[];
  otherHobbies?: string;
  favouriteMusic: string[];
  otherMusic?: string;
  sports: string[];
  otherSports?: string;
  favouriteFood: string[];
  otherFood?: string;
  
  // Partner Preferences (legacy)
  partnerPreferences: {
    minAge: number;
    maxAge: number;
    minHeight: string;
    maxHeight: string;
    gender: string;
    maritalStatus: string[];
    haveChildren?: string;
    physicalStatus: string[];
    motherTongue: string[];
    religion: string[];
    caste: string[];
    subCaste?: string[];
    gothra?: string[];
    manglik?: string;
    educationType?: string;
    educationLevels: string[];
    occupation: string[];
    minAnnualIncome?: string;
    maxAnnualIncome?: string;
    dietaryHabits: string[];
    smokingHabits: string[];
    drinkingHabits: string[];
    city?: string[];
    country?: string[];
    countryLivingIn?: string[];
    citizenship?: string[];
    star?: string[];
    aboutMyPartner?: string;
  };

  // NEW: API response uses "preference" — keep it optional and permissive
  preference?: {
    id?: number;
    minAge?: number;
    maxAge?: number;
    minHeight?: string;
    maxHeight?: string;
    gender?: string;
    maritalStatus?: string | string[]; // API sometimes sends single string
    haveChildren?: string;
    physicalStatus?: string | string[];
    motherTongues?: string[]; // note: api field name
    religion?: string | string[];
    castes?: string[]; // api uses plural
    subCastes?: string[]; // api uses plural
    gothras?: string[];
    stars?: string[];
    rashis?: string[];
    manglik?: string;
    educationType?: string;
    educationLevels?: string[];
    employedIn?: string[] | string;
    occupations?: string[];
    annualIncome?: string;
    dietaryHabits?: string | string[];
    smokingHabits?: string | string[];
    drinkingHabits?: string | string[];
    citizenships?: string[];
    countriesLivedIn?: string[];
    aboutMyPartner?: string;
  };
  
  // Location Details
  city: string;
  state: string;
  country: string;
  postalCode: string;
  citizenship: string;
  residencyStatus: string;
  livingSinceYear?: string;
  
  // Contact
  contactNumber?: string;
  
  // Profile
  profilePhoto?: string;
  photos?: string[];

  // Gallery images from API
  images?: {
    id: number;
    imageUrl: string;
    profileId: string;
    uploadedAt: string;
    imageSize: string;
    imageFormat: string;
  }[];
}
