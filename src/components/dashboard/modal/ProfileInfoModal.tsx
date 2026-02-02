import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User as UserType } from "@/types/user";
import { MapPin, Briefcase, GraduationCap } from "lucide-react";
import FullImageViewer from "@/components/common/FullImageViewer";

interface ProfileInfoModalProps {
  user: UserType;
}

const ProfileInfoModal = ({ user }: ProfileInfoModalProps) => {
  // Gallery images state for modal
  const [galleryImages, setGalleryImages] = useState<
    { id: number; url: string; loading: boolean }[]
  >([]);
  const [loadingGallery, setLoadingGallery] = useState(true);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (!user.images || user.images.length === 0) {
      setLoadingGallery(false);
      return;
    }
    const token = sessionStorage.getItem("token");
    if (!token) {
      setLoadingGallery(false);
      return;
    }
    // Prepare shimmer placeholders
    setGalleryImages(
      user.images.map((img: any) => ({
        id: img.id,
        url: "",
        loading: true,
      }))
    );
    // Fetch each image blob
    user.images.forEach((img: any) => {
      fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/images/getGalleryImageById?id=${img.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
        .then((res) => (res.ok ? res.blob() : Promise.reject()))
        .then((blob) => {
          const imgUrl = URL.createObjectURL(blob);
          setGalleryImages((prev) =>
            prev.map((i) =>
              i.id === img.id ? { ...i, url: imgUrl, loading: false } : i
            )
          );
        })
        .catch(() => {
          setGalleryImages((prev) =>
            prev.map((i) =>
              i.id === img.id ? { ...i, loading: false } : i
            )
          );
        });
    });
    setLoadingGallery(false);
  }, [user.images]);

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setViewerOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="border-0 shadow-large">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Profile Picture */}
            <div className="flex flex-col items-center gap-4">
              <Avatar
                className="w-40 h-40 border-4 border-primary cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => handleImageClick(user.profilePhoto)}
              >
                <AvatarImage src={user.profilePhoto} alt={user.firstName} />
                <AvatarFallback className="text-4xl bg-gradient-primary text-primary-foreground">
                  {user.firstName[0]}
                  {user.lastName[0]}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Profile Details */}
            <div className="flex-1 space-y-6">
              <div>
                <h2 className="text-3xl font-bold">
                  {user.firstName} {user.lastName}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location (स्थान)</p>
                    <p className="font-medium">
                      {user.city || "N/A"}, {user.state || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Occupation (व्यवसाय)</p>
                    <p className="font-medium">{user.occupation || "N/A"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Education (शिक्षा)</p>
                    <p className="font-medium">
                      {user.highestEducation || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-bold text-primary">🕉</span>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Religion (धर्म)</p>
                    <p className="font-medium">
                      {user.religion || "N/A"}, {user.caste || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {user.about && (
                <div className="pt-4 border-t">
                  <h3 className="font-semibold mb-2">About Me (मेरे बारे में)</h3>
                  <p className="text-muted-foreground">{user.about}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Card className="border-0 shadow-soft hover:shadow-medium transition-smooth">
          <CardContent className="pt-4 md:pt-6">
            <div className="text-center">
              <p className="text-xl md:text-2xl font-bold text-primary">
                {user.heightIn || "N/A"}
              </p>
              <p className="text-xs md:text-sm text-muted-foreground">
                Height (कद)
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-soft hover:shadow-medium transition-smooth">
          <CardContent className="pt-4 md:pt-6">
            <div className="text-center">
              <p className="text-xl md:text-2xl font-bold text-primary">
                {user.dateOfBirth
                  ? new Date().getFullYear() - new Date(user.dateOfBirth).getFullYear()
                  : "N/A"}
              </p>
              <p className="text-xs md:text-sm text-muted-foreground">Age (आयु)</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-soft hover:shadow-medium transition-smooth">
          <CardContent className="pt-4 md:pt-6">
            <div className="text-center">
              <p className="text-lg md:text-xl font-bold text-primary truncate px-2">
                {user.maritalStatus || "N/A"}
              </p>
              <p className="text-xs md:text-sm text-muted-foreground">Status (स्थिति)</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-soft hover:shadow-medium transition-smooth">
          <CardContent className="pt-4 md:pt-6">
            <div className="text-center">
              <p className="text-lg md:text-xl font-bold text-primary truncate px-2">
                {user.motherTongue || "N/A"}
              </p>
              <p className="text-xs md:text-sm text-muted-foreground">Language (भाषा)</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gallery Images Section */}
      <Card className="border-0 shadow-soft mt-4">
        <CardHeader>
          <CardTitle>Gallery Photos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {loadingGallery
              ? Array.from({ length: user.images?.length || 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-lg bg-gray-200 animate-pulse"
                  ></div>
                ))
              : galleryImages.length > 0
              ? galleryImages.map((img, i) => (
                  <div key={img.id || i} className="relative">
                    {img.loading ? (
                      <div className="aspect-square rounded-lg bg-gray-200 animate-pulse"></div>
                    ) : img.url ? (
                      <img
                        src={img.url}
                        alt={`Gallery ${i + 1}`}
                        className="w-full aspect-square object-cover rounded-lg border-2 border-border cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handleImageClick(img.url)}
                      />
                    ) : (
                      <div className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center text-muted-foreground">
                        Failed to load
                      </div>
                    )}
                  </div>
                ))
              : (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  No gallery images uploaded.
                </div>
              )}
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Gallery images help others know you better!
          </p>
        </CardContent>
      </Card>

      {/* Full Image Viewer Modal */}
      <FullImageViewer
        imageUrl={selectedImage}
        open={viewerOpen}
        onOpenChange={setViewerOpen}
        shape="rectangle"
      />
    </div>
  );
};

export default ProfileInfoModal;
