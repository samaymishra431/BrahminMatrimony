import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageBanner from "@/components/PageBanner";
import { Shield, Lock, Eye, FileText, Server, UserCheck, Gavel, Globe, AlertTriangle, Smartphone } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <PageBanner
        title="Privacy Policy"
        subtitle="Your trust is our priority. We are committed to protecting your personal information and privacy."
        backgroundImage="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1920&h=600&fit=crop"
      />

      <div className="container mx-auto px-4 py-16 max-w-5xl">
        <div className="grid gap-12">
          
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              Our Commitment to Your Privacy
            </h2>
            <p className="text-muted-foreground text-justify leading-relaxed">
              BrahminMatrimony.com is an online matrimonial portal endeavouring constantly to provide you with matrimonial services. This privacy statement is common to all the matrimonial Website/apps operated under BrahminMatrimony.com. Since we are strongly committed to your right to privacy, we have drawn out a privacy statement with regard to the information we collect from you. You acknowledge that you are disclosing information voluntarily. By accessing /using the website/apps and/or by providing your information, you consent to the collection and use of the info you disclose on the website/apps in accordance with this Privacy Policy. If you do not agree for use of your information, please do not use or access this website/apps.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6 text-primary" />
              What information you need to give in to use this Website/apps?
            </h2>
            <p className="text-muted-foreground mb-4">
              The information we gather from members and visitors who apply for the various services our Website/Apps offers includes, but may not be limited to:
            </p>
            <ul className="list-disc list-inside space-y-3 text-muted-foreground ml-4">
              <li><strong>User Provided Information:</strong> Photo of the user, email address, name, date of birth, educational qualifications, a user-specified password, mailing address, zip/pin code and telephone/mobile number.</li>
              <li><strong>Credit Account Information:</strong> If you establish a credit account with us to pay the fees we charge, we collect additional information, including a billing address, a credit/debit card number and expiration date, and tracking information from cheques or demand drafts.</li>
              <li><strong>Social Media Registration:</strong> If you register using social networking platforms like Facebook or Google, we may collect personal data you choose to allow us to access through their APIs.</li>
              <li><strong>Automatically Collected Information:</strong> When you access our websites or apps, data relating to device ID, log files, geographic location, and device information/specification are also collected automatically.</li>
              <li><strong>Cookies:</strong> We use cookies to store login information and assist in providing our services. You may encounter cookies from third parties on certain pages, which we do not control.</li>
            </ul>
          </section>

          {/* How We Use Your Information */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <UserCheck className="w-6 h-6 text-primary" />
              How the website/apps uses the information it collects/tracks?
            </h2>
            <p className="text-muted-foreground text-justify leading-relaxed mb-4">
              Brahmin Matrimony.com collects information for data analysis, identifying usage trends, determining the effectiveness of our promotional campaigns and to evaluate and improve our websites or apps, products, and services ,marketing research from our users primarily to ensure that we are able to fulfil your requirements and to deliver Personalised experience.
            </p>
            <p className="text-muted-foreground text-justify leading-relaxed">
              We may use also your personal information for analysis of data, usage trends and to evaluate and improve our site/App, marketing research, preventing of frauds. In our efforts to continually improve our product and service offerings, we collect and analyse demographic and profile data about our users' activity on our website/apps. We identify and use your IP address to help diagnose problems with our server, and to administer our website/apps. Your IP address is also used to help identify you and to gather broad demographic information.
            </p>
          </section>

          {/* Mobile App Permissions */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Smartphone className="w-6 h-6 text-primary" />
              Why does our mobile application require permissions from you?
            </h2>
            <p className="text-muted-foreground mb-4">
              Our services help connect users to their matches based on several parameters and preferences. To fix bugs within the application and improve the user experience, we require users to grant us access to the following:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li><strong>Camera:</strong> Access to the device's camera allows users to take their picture, and upload it as their profile picture on our portal.</li>
              <li><strong>Contacts:</strong> The mobile application will obtain the user accounts that are associated with Facebook or Google+ for a quick signup process.</li>
              <li><strong>Location:</strong> Based on their GPS coordinates, users are served with profiles of members located in the same vicinity.</li>
              <li><strong>Phone:</strong> Device information and network details help analyze and fix issues that are isolated to a particular device or a particular network.</li>
              {/* <li><strong>SMS:</strong> The mobile application detects SMS(s) and auto-fills the OTP / PIN details for a faster and better user experience.</li> */}
              <li><strong>Storage:</strong> Users can upload pictures from their device memory and use it as their profile picture.</li>
            </ul>
          </section>

          {/* Data Protection */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Lock className="w-6 h-6 text-primary" />
              What are the Security Precautions in respect of your personal information?
            </h2>
            <p className="text-muted-foreground text-justify leading-relaxed">
              We aim to protect your personal information through a system of organizational and technical security measures. We have implemented appropriate internal control measures designed to protect the security of any personal information we process. However, please also remember that we cannot guarantee that the internet itself is 100% secure. Once your information is in our possession, we adhere to security guidelines protecting it against unauthorised access.
            </p>
          </section>

          {/* Data Sharing */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Eye className="w-6 h-6 text-primary" />
              With whom the website/apps shares the information it collects/tracks?
            </h2>
            <p className="text-muted-foreground text-justify leading-relaxed mb-4">
              We may share such identifiable information with our associates/affiliates/subsidiaries and such associates/affiliates/subsidiaries may market to you as a result of such sharing. Any information you give us is held with the utmost care and security. We are also bound to cooperate fully should a situation arise where we are required by law or legal process to provide information about a customer/visitor.
            </p>
            <p className="text-muted-foreground text-justify leading-relaxed mb-4">
              Where required or permitted by law, information may be provided to others, such as regulators and law enforcement agencies or to protect the rights, property or personal safety of other members or the general public. We may voluntarily share your information with law enforcement agencies / Gateway service providers / anti-fraud solution provider(s) if we feel that the transaction is of suspicious nature.
            </p>
            <p className="text-muted-foreground text-justify leading-relaxed mb-4">
              From time to time, we may consider corporate transactions such as a merger, acquisition, reorganization, asset sale, or similar. In these instances, we may transfer or allow access to information to enable the assessment and undertaking of that transaction. If we buy or sell any business or assets, personal information may be transferred to third parties involved in the transaction.
            </p>
            <p className="text-muted-foreground text-justify leading-relaxed">
              Our website/apps link to other website/apps and may collect personally identifiable information about you. We are not responsible for the privacy policy or the contents of those linked website/apps.
            </p>
          </section>

          {/* For EU Members */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Globe className="w-6 h-6 text-primary" />
              For European Union Members (EU)
            </h2>
            <p className="text-muted-foreground text-justify leading-relaxed">
              If you are located in the EU, you will be asked to provide consent to the collection, processing, and sharing of your personal information. Personal information means any information related to an identified or identifiable natural person. You have the right to share and access your personal information and right to withdraw consent for sharing your personal information at any point of time and right to erase your personal information subject to applicable laws. for sharing your personal information at any point of time. You can withdraw your consent provided by contacting us. Your personal information may be stored in databases located outside of the EU including in India. Where we transfer personal data outside of EU, we either transfer personal information to countries that provide an adequate level of protection or we have appropriate safeguards in place. We may require proof of or need to verify your identity before we can give effect to these rights. To request to review, update, or delete your personal information, please submit a request form by sending an email to privacy@matrimony.com. We may share your information with third parties who are an anti-fraud solution provider(s) located in UK. They help us to ensure we keep you safe from scammers and fraudster.
            </p>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Server className="w-6 h-6 text-primary" />
              How Long Do We Keep Your Information?
            </h2>
            <p className="text-muted-foreground text-justify leading-relaxed">
              As stipulated in the Privacy Policy we will retain the information we collect from users under the following circumstances:
            </p>
            <p className="text-muted-foreground text-justify leading-relaxed mt-2">
              For as long as the users subscribe to our services to meet their suitable purpose(s) for which it was collected, for the sake of enforcing agreements, for performing audits, for resolving any form of disputes, for establishing legal defences, for pursuing legitimate businesses and to comply with the relevant applicable laws.
            </p>
          </section>

          {/* Change of Policy */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-primary" />
              Change of Privacy Policy
            </h2>
            <p className="text-muted-foreground text-justify leading-relaxed">
              We may change this Privacy Policy without notice from time to time without any notice to you. However, changes will be updated in the Privacy Policy page.
            </p>
          </section>

          {/* Grievance Officer */}
          {/* <section className="bg-card p-8 rounded-2xl border border-border">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Gavel className="w-6 h-6 text-primary" />
              How to address your Grievance
            </h2>
            <p className="text-muted-foreground mb-6">
              The Grievance officer shall be available between 10 am to 6 pm IST from Monday to Saturday excluding Sunday's and Public Holidays in India. The Grievance officer is appointed as per Section 5 (9) of the Information Technology ( Reasonable Security & Procedures and Sensitive Personal data or Information ) Rule, 2011.
            </p>
            <div className="space-y-2">
              <p className="font-semibold">Grievance Officer : Mr. Durairaj Thulasidoss.</p>
              <p className="text-muted-foreground">Matrimony.com Limited,</p>
              <p className="text-muted-foreground">No.94, TVH Beliciaa Towers, Tower - 2,</p>
              <p className="text-muted-foreground">5th Floor, MRC Nagar, Chennai,</p>
              <p className="text-muted-foreground">Tamil Nadu - 600028.</p>
              <p className="text-muted-foreground">Email: grievanceofficer@matrimony.com</p>
            </div>
          </section> */}

          <div className="text-sm text-muted-foreground pt-8 border-t border-border">
            Last Updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;