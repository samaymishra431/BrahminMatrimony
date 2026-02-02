import { User } from "@/types/user";

export const mockUser: User = {
  id: "1",
  email: "rahul.sharma@example.com",
  username: "rahul_sharma",
  
  // Basic Details
  firstName: "Rahul",
  lastName: "Sharma",
  gender: "Male",
  profileCreatedFor: "Self",
  dateOfBirth: "1995-03-15",
  timeOfBirth: "10:30 AM",
  placeOfBirth: "Mumbai, Maharashtra",
  religion: "Hindu",
  caste: "Brahmin",
  subCaste: "Deshastha",
  maritalStatus: "Never Married",
  heightIn: "5'10\"",
  weight: "75 kg",
  physicalStatus: "Normal",
  motherTongue: "Hindi",
  gothra: "Kashyap",
  star: "Rohini",
  rashi: "Taurus",
  manglik: "No",
  about: "A software engineer passionate about technology and innovation. I enjoy traveling, reading, and spending time with family. Looking for a life partner who shares similar values and interests.",
  dietaryHabits: "Vegetarian",
  drinkingHabits: "No",
  smokingHabits: "No",
  
  // Education & Occupation
  highestEducation: "Master's Degree",
  additionalDegree: "M.Tech in Computer Science",
  collegeInstitution: "Indian Institute of Technology, Bombay",
  educationInDetail: "Bachelor's in Computer Engineering from VJTI, Mumbai. Master's in Computer Science from IIT Bombay.",
  employedIn: "Private Sector",
  occupation: "Software Engineer",
  occupationInDetail: "Senior Software Engineer at a leading tech company, working on cloud infrastructure and distributed systems.",
  annualIncome: "15,00,000",
  incomeCurrency: "INR",
  workCity: "Bangalore",
  workCountry: "India",
  
  // Family Details
  familyValue: "Traditional",
  familyType: "Joint Family",
  familyStatus: "Middle Class",
  fatherOccupation: "Business",
  motherOccupation: "Homemaker",
  nativePlace: "Pune, Maharashtra",
  noOfBrothers: "1",
  brothersMarried: "0",
  noOfSisters: "1",
  sistersMarried: "1",
  parentsContactNo: "+91 98765 43210",
  aboutMyFamily: "We are a traditional joint family based in Pune. My father runs a successful textile business, and my mother is a homemaker. My elder sister is happily married and settled in Mumbai. We value education, culture, and family bonds.",
  
  // Hobbies & Interests
  hobbies: ["Reading", "Traveling", "Photography", "Cooking"],
  otherHobbies: "Playing chess, watching documentaries",
  favouriteMusic: ["Classical", "Bollywood", "Indie"],
  otherMusic: "Sufi music",
  sports: ["Cricket", "Badminton", "Swimming"],
  otherSports: "Trekking",
  favouriteFood: ["North Indian", "South Indian", "Chinese"],
  otherFood: "Italian pasta",
  
  // Partner Preferences
  partnerPreferences: {
    minAge: 23,
    maxAge: 28,
    minHeight: "5'2\"",
    maxHeight: "5'8\"",
    gender: "Female",
    maritalStatus: ["Never Married"],
    haveChildren: "No",
    physicalStatus: ["Normal"],
    motherTongue: ["Hindi", "Marathi", "English"],
    religion: ["Hindu"],
    caste: ["Brahmin", "Kshatriya"],
    subCaste: ["Deshastha", "Kokanastha"],
    gothra: [],
    manglik: "No",
    educationType: "Graduate",
    educationLevels: ["Bachelor's Degree", "Master's Degree"],
    occupation: ["Software Engineer", "Teacher", "Doctor", "Chartered Accountant"],
    minAnnualIncome: "3,00,000",
    maxAnnualIncome: "12,00,000",
    dietaryHabits: ["Vegetarian"],
    smokingHabits: ["No"],
    drinkingHabits: ["No", "Occasionally"],
    city: ["Bangalore", "Mumbai", "Pune", "Hyderabad"],
    country: ["India"],
    countryLivingIn: ["India"],
    citizenship: ["India"],
    star: [],
    aboutMyPartner: "Looking for an educated, independent, and family-oriented person who values tradition while being open to modern thinking. Someone who is supportive, understanding, and shares similar life goals."
  },
  
  // Location Details
  city: "Bangalore",
  state: "Karnataka",
  country: "India",
  postalCode: "560001",
  citizenship: "India",
  residencyStatus: "Citizen",
  livingSinceYear: "2018",
  
  // Contact
  contactNumber: "+91 98765 43210",
  
  // Profile
  profilePhoto: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul",
  photos: [
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul1",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul2"
  ]
};
