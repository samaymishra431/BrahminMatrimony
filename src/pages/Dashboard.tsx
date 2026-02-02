import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ProfileInfo from "@/components/dashboard/ProfileInfo";
import BasicInformation from "@/components/dashboard/BasicInformation";
import EducationOccupation from "@/components/dashboard/EducationOccupation";
import FamilyDetails from "@/components/dashboard/FamilyDetails";
import HobbiesInterests from "@/components/dashboard/HobbiesInterests";
import PartnerPreference from "@/components/dashboard/PartnerPreference";
import ContactDetails from "@/components/dashboard/ContactDetails";
import LocationDetails from "@/components/dashboard/LocationDetails";
import Photos from "@/components/dashboard/Photos";
import Home from "@/components/dashboard/Home";
import Matches from "@/components/dashboard/Matches";
import Interests from "@/components/dashboard/Interests";
import Messages from "@/components/dashboard/Messages";
import AccountSettings from "@/pages/AccountSettings";
import CommunicationSettings from "@/pages/CommunicationSettings";
import PrivacySettings from "@/pages/PrivacySettings";
import HelpCenter from "@/pages/HelpCenter";
import FAQs from "@/pages/FAQs";
import SuccessStories from "@/pages/SuccessStories";
import { mockUser } from "@/data/mockUser";

const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const section = searchParams.get("section");
    if (section) {
      setActiveSection(section);
    }
  }, [searchParams]);

  const renderContent = () => {
    switch (activeSection) {
      case "home":
        return <Home user={mockUser} onSectionChange={setActiveSection} />;
      case "matches":
        return <Matches onViewProfile={(matchId) => setActiveSection("profile-info")} />;
      case "interests":
        return <Interests />;
      case "messages":
        return <Messages />;
      case "profile-info":
        return <ProfileInfo />;
      case "basic-info":
        return <BasicInformation />;
      case "education":
        return <EducationOccupation />;
      case "family":
        return <FamilyDetails />;
      case "hobbies":
        return <HobbiesInterests />;
      case "partner-preference":
        return <PartnerPreference />;
      case "contact":
        return <ContactDetails />;
      case "location":
        return <LocationDetails />;
      case "photos":
        return <Photos user={mockUser} />;
      case "account-settings":
        return <AccountSettings />;
      case "communication-settings":
        return <CommunicationSettings />;
      case "privacy-settings":
        return <PrivacySettings />;
      case "help-center":
        return <HelpCenter />;
      case "faqs":
        return <FAQs />;
      case "success-stories":
        return <SuccessStories />;
      default:
        return <Home user={mockUser} onSectionChange={setActiveSection} />;
    }
  };

  return (
    <DashboardLayout activeSection={activeSection} onSectionChange={setActiveSection}>
      {renderContent()}
    </DashboardLayout>
  );
};

export default Dashboard;
