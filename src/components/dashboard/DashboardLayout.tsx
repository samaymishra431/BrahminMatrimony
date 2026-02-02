import { ReactNode, useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

interface DashboardLayoutProps {
  children: ReactNode;
  activeSection: string;
  onSectionChange: (section: string) => void;
  autoOpenSubscription?: boolean;
}

const DashboardLayout = ({ children, activeSection, onSectionChange, autoOpenSubscription }: DashboardLayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-warm">
      <Navbar onMobileMenuToggle={() => setIsMobileMenuOpen(true)} />
      <div className="flex">
        <Sidebar
          activeSection={activeSection}
          onSectionChange={onSectionChange}
          isMobileOpen={isMobileMenuOpen}
          onMobileOpenChange={setIsMobileMenuOpen}
        />
        <main className="flex-1 p-4 lg:p-6 lg:ml-64 mt-16">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
