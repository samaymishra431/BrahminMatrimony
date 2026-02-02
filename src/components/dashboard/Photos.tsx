import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Trash2, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { User } from "@/types/user";
import FullImageViewer from "@/components/common/FullImageViewer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

/* ------------------------------------------------------------
 * 🔹 Main Photos Component
 * ------------------------------------------------------------ */
interface PhotosProps {
  user: User;
}

const Photos = ({ user }: PhotosProps) => {
  // Profile Image States
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Gallery Image States
  const [galleryImages, setGalleryImages] = useState<
    { id: number; url: string; loading: boolean }[]
  >([]);
  const [loadingGallery, setLoadingGallery] = useState(true);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const galleryFileInputRef = useRef<HTMLInputElement | null>(null);

  // Full image viewer state
  const [fullImage, setFullImage] = useState<string | null>(null);
  const [viewerShape, setViewerShape] = useState<"circle" | "rectangle">("rectangle");
  const [deletePopoverOpen, setDeletePopoverOpen] = useState<number | null>(null);

  /* ------------------------------------------------------------
   * 🔹 Fetch Logged User Profile Image
   * ------------------------------------------------------------ */
  useEffect(() => {
    const fetchProfileImage = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) {
        setLoadingProfile(false);
        return;
      }

      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/images/getLoggedUserProfileImage`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Failed to load profile image");
        const blob = await res.blob();
        const imgUrl = URL.createObjectURL(blob);
        setProfileImage(imgUrl);
      } catch (err) {
        console.error("Error fetching profile image:", err);
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfileImage();
  }, []);

  /* ------------------------------------------------------------
   * 🔹 Fetch Gallery Images
   * ------------------------------------------------------------ */
  useEffect(() => {
    const fetchGalleryImages = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/images/getAllGalleryImages`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        if (res.ok && data.statusCode === "200") {
          const imgs = data.payload.map((img: any) => ({
            id: img.id,
            url: "",
            loading: true,
          }));
          setGalleryImages(imgs);

          // Load each image blob
          for (const img of imgs) {
            try {
              const imgRes = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/api/images/getGalleryImageById?id=${img.id}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              if (imgRes.ok) {
                const blob = await imgRes.blob();
                const imgUrl = URL.createObjectURL(blob);
                setGalleryImages((prev) =>
                  prev.map((i) =>
                    i.id === img.id ? { ...i, url: imgUrl, loading: false } : i
                  )
                );
              }
            } catch (err) {
              console.error("Error fetching gallery image:", err);
            }
          }
        }
      } catch (err) {
        console.error("Error loading gallery list:", err);
      } finally {
        setLoadingGallery(false);
      }
    };

    fetchGalleryImages();
  }, []);

  /* ------------------------------------------------------------
   * 🔹 Handle Profile Image Upload
   * ------------------------------------------------------------ */
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const token = sessionStorage.getItem("token");
    if (!token) {
      toast({ description: "User not authenticated!", variant: "destructive" });
      return;
    }

    const formData = new FormData();
    formData.append("profilePicture", file);

    try {
      setUploading(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/images/uploadOrUpdateProfilePicture`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      const data = await res.json();
      if (res.ok && data.statusCode === 200) {
        toast({ description: "Profile picture updated successfully!" });
        const imgUrl = URL.createObjectURL(file);
        setProfileImage(imgUrl);
      } else {
        toast({
          description: data.message || "Failed to upload image",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Error uploading image:", err);
      toast({ description: "Error uploading image", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  /* ------------------------------------------------------------
   * 🔹 Handle Gallery Upload
   * ------------------------------------------------------------ */
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (galleryImages.length >= 10) {
      toast({
        description: "You can upload a maximum of 10 photos.",
        variant: "destructive",
      });
      return;
    }

    const token = sessionStorage.getItem("token");
    if (!token) {
      toast({ description: "User not authenticated!", variant: "destructive" });
      return;
    }

    const tempId = Date.now();
    const tempUrl = URL.createObjectURL(file);

    setGalleryImages((prev) => [
      ...prev,
      { id: tempId, url: tempUrl, loading: true },
    ]);

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploadingGallery(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/images/upload-gallery-image`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      const data = await res.json();
      if (res.ok && data.statusCode === 200) {
        toast({ description: "Gallery image uploaded successfully!" });
        setGalleryImages((prev) =>
          prev.map((img) =>
            img.id === tempId
              ? { ...img, id: data.payload.id, loading: false }
              : img
          )
        );
      } else {
        toast({
          description: data.message || "Failed to upload image",
          variant: "destructive",
        });
        setGalleryImages((prev) => prev.filter((img) => img.id !== tempId));
      }
    } catch (err) {
      console.error("Error uploading gallery image:", err);
      toast({
        description: "Error uploading gallery image",
        variant: "destructive",
      });
      setGalleryImages((prev) => prev.filter((img) => img.id !== tempId));
    } finally {
      setUploadingGallery(false);
    }
  };

  /* ------------------------------------------------------------
   * 🔹 Delete Gallery Image
   * ------------------------------------------------------------ */
  const handleDeleteGalleryImage = async (id: number) => {
    const token = sessionStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/images/delete-gallery-image/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      if (res.ok && data.statusCode === 200) {
        toast({ description: "Image deleted successfully!" });
        setGalleryImages((prev) => prev.filter((img) => img.id !== id));
      } else {
        toast({
          description: data.message || "Failed to delete image",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Error deleting image:", err);
      toast({ description: "Error deleting image", variant: "destructive" });
    }
  };

  /* ------------------------------------------------------------
   * 🔹 Render UI
   * ------------------------------------------------------------ */
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <Card className="border-0 shadow-medium">
        <CardHeader className="pb-4">
          <div className="flex flex-row items-center justify-between w-full">
            <CardTitle className="text-2xl md:text-3xl">Photos</CardTitle>
            {/* Gallery file input for header button (shared with gallery section) */}
            <input
              ref={galleryFileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleGalleryUpload}
              disabled={uploadingGallery}
            />
            <Button
              className="bg-gradient-primary w-auto"
              onClick={() => galleryFileInputRef.current?.click()}
              disabled={uploadingGallery}
            >
              <Upload className="w-4 h-4 mr-2" /> Upload Photos
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Profile Photo */}
      <Card className="border-0 shadow-medium">
        <CardHeader>
          <CardTitle className="text-start w-full">Profile Photo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center gap-6">
            {loadingProfile ? (
              <div className="w-32 h-32 rounded-full border-4 border-primary bg-gray-200 animate-pulse shrink-0"></div>
            ) : uploading ? (
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary bg-gray-200 flex items-center justify-center shrink-0">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            ) : profileImage ? (
              <div
                className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary bg-gray-100 cursor-pointer hover:opacity-90 transition shrink-0"
                onClick={() => {
                  setFullImage(profileImage);
                  setViewerShape("circle");
                }}
              >
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-32 h-32 rounded-full border-4 border-primary bg-gray-200 animate-pulse shrink-0"></div>
            )}

            <div className="space-y-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                disabled={uploading}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="inline-flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" /> Change Photo
                  </>
                )}
              </Button>
              <p className="text-sm text-muted-foreground">
                Recommended size: 400x400px
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gallery */}
      <Card className="border-0 shadow-medium">
        <CardHeader>
          <CardTitle>Photo Gallery</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {loadingGallery ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-lg bg-gray-200 animate-pulse"
                ></div>
              ))
            ) : galleryImages.length > 0 ? (
              galleryImages.map((img, i) => (
                <div
                  key={i}
                  className="relative group cursor-pointer"
                  onClick={() => {
                    setFullImage(img.url);
                    setViewerShape("rectangle"); // full screen rectangle
                  }}
                >
                  {img.loading ? (
                    <div className="aspect-square rounded-lg bg-gray-200 animate-pulse"></div>
                  ) : (
                    <img
                      src={img.url}
                      alt={`Gallery ${i + 1}`}
                      className="w-full aspect-square object-cover rounded-lg border-2 border-border transition-transform duration-300 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-smooth rounded-lg flex items-center justify-center">
                    <Popover open={deletePopoverOpen === img.id} onOpenChange={(open) => setDeletePopoverOpen(open ? img.id : null)}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="gap-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeletePopoverOpen(img.id);
                          }}
                        >
                          <Trash2 className="w-4 h-4" /> Delete
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-3">
                        <div className="flex flex-col gap-2">
                          <p className="text-sm font-medium">Delete this image?</p>
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeletePopoverOpen(null);
                              }}
                            >
                              No
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeletePopoverOpen(null);
                                handleDeleteGalleryImage(img.id);
                              }}
                            >
                              Yes
                            </Button>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                No photos uploaded yet. Add photos to enhance your profile!
              </div>
            )}

            {/* Upload new */}
            {galleryImages.length < 10 ? (
              <div>
                <input
                  ref={galleryFileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleGalleryUpload}
                  disabled={uploadingGallery}
                />
                <button
                  onClick={() => galleryFileInputRef.current?.click()}
                  disabled={uploadingGallery}
                  className="aspect-square border-2 border-dashed border-border rounded-lg flex items-center justify-center hover:bg-muted transition-smooth w-full"
                >
                  {uploadingGallery ? (
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                  ) : (
                    <div className="text-center">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Add Photo</p>
                    </div>
                  )}
                </button>
              </div>
            ) : (
              <div className="col-span-full text-center py-6 text-muted-foreground text-sm">
                You’ve reached the 10 photo limit.
              </div>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            You can upload up to 10 photos. Photos help others know you better!
          </p>
        </CardContent>
      </Card>

      {/* 🔹 Full Image Viewer (shared for profile & gallery) */}
      <FullImageViewer
        imageUrl={fullImage}
        open={!!fullImage}
        shape={viewerShape}
        onOpenChange={(open) => {
          if (!open) setFullImage(null);
        }}
      />
    </div>
  );
};

export default Photos;
