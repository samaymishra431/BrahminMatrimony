import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageBanner from "@/components/PageBanner";
import FAQSection from "@/components/FAQSection";
import { Button } from "@/components/ui/button";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Play, X } from "lucide-react";
import { Newsletter } from "@/components/Newsletter";

// Community Gallery Images
const communityImages = [
  "https://boindia.org/images/gallery/1.jpg",
  "https://boindia.org/images/gallery/2.jpg",
  "https://boindia.org/images/gallery/3.jpg",
  "https://boindia.org/images/gallery/4.jpg",
  "https://boindia.org/images/gallery/5.jpg",
  "https://boindia.org/images/gallery/6.jpg",
  "https://boindia.org/images/gallery/7.jpg",
  "https://boindia.org/images/gallery/8.jpg",
  "https://boindia.org/images/gallery/9.jpg",
  "https://boindia.org/images/gallery/10.jpg",
  "https://boindia.org/images/gallery/11.jpg",
  "https://boindia.org/images/gallery/13.jpg",
  "https://boindia.org/images/gallery/201.png",
  "https://boindia.org/images/gallery/202.png",
  "https://boindia.org/images/gallery/203.png",
  "https://boindia.org/images/gallery/206.png",
  "https://boindia.org/images/gallery/207.png",
  "https://boindia.org/images/gallery/208.png",
  "https://boindia.org/images/gallery/209.png",
  "https://boindia.org/images/gallery/210.png",
  "https://boindia.org/images/gallery/211.png",
  "https://boindia.org/images/gallery/212.png",
  "https://boindia.org/images/gallery/213.png",
  "https://boindia.org/images/gallery/214.png",
  "https://boindia.org/images/gallery/215.png",
  "https://boindia.org/images/gallery/216.png",
  "https://boindia.org/images/gallery/217.png",
  "https://boindia.org/images/gallery/218.png",
  "https://boindia.org/images/gallery/219.png",
  "https://boindia.org/images/gallery/220.png",
  "https://boindia.org/images/gallery/221.png",
  "https://boindia.org/images/gallery/222.png",
  "https://boindia.org/images/gallery/224.png",
  "https://boindia.org/images/gallery/225.png",
  "https://boindia.org/images/gallery/226.png",
  "https://boindia.org/images/gallery/227.png",
  "https://boindia.org/images/gallery/228.png",
  "https://boindia.org/images/gallery/229.png",
  "https://boindia.org/images/gallery/230.png",
  "https://boindia.org/images/gallery/231.png",
  "https://boindia.org/images/gallery/232.png",
  "https://boindia.org/images/gallery/233.png",
  "https://boindia.org/images/gallery/234.png",
  "https://boindia.org/images/gallery/235.png",
  "https://boindia.org/images/gallery/236.png",
  "https://boindia.org/images/gallery/237.png",
  "https://boindia.org/images/gallery/238.png",
  "https://boindia.org/images/gallery/239.png",
  "https://boindia.org/images/gallery/240.png",
  "https://boindia.org/images/gallery/241.png",
  "https://boindia.org/images/gallery/242.png",
  "https://boindia.org/images/gallery/243.png",
  "https://boindia.org/images/gallery/244.png",
  "https://boindia.org/images/gallery/245.png",
  "https://boindia.org/images/gallery/246.png",
  "https://boindia.org/images/gallery/247.png",
  "https://boindia.org/images/gallery/248.png",
  "https://boindia.org/images/gallery/51.png",
  "https://boindia.org/images/gallery/52.png",
  "https://boindia.org/images/gallery/53.png",
  "https://boindia.org/images/gallery/54.png",
  "https://boindia.org/images/gallery/55.png",
  "https://boindia.org/images/gallery/56.png",
  "https://boindia.org/images/gallery/57.png",
  "https://boindia.org/images/gallery/58.png",
  "https://boindia.org/images/gallery/59.png",  
  "https://boindia.org/images/gallery/60.png",
  "https://boindia.org/images/gallery/61.png",
  "https://boindia.org/images/gallery/62.png",
  "https://boindia.org/images/gallery/63.png",
  "https://boindia.org/images/gallery/64.png",
  "https://boindia.org/images/gallery/66.png",
  "https://boindia.org/images/gallery/67.png",
  "https://boindia.org/images/gallery/68.png",
  "https://boindia.org/images/gallery/69.png",
  "https://boindia.org/images/gallery/70.png",
  "https://boindia.org/images/gallery/71.png",
  "https://boindia.org/images/gallery/72.png",
  "https://boindia.org/images/gallery/73.png",
  "https://boindia.org/images/gallery/74.png",
  "https://boindia.org/images/gallery/75.png",
  "https://boindia.org/images/gallery/76.png",
  "https://boindia.org/images/gallery/77.png",  
  "https://boindia.org/images/gallery/78.png",
  "https://boindia.org/images/gallery/79.png",
  "https://boindia.org/images/gallery/80.png",
  "https://boindia.org/images/gallery/81.png",
  "https://boindia.org/images/gallery/82.png",
  "https://boindia.org/images/gallery/83.png",
  "https://boindia.org/images/gallery/84.png",
  "https://boindia.org/images/gallery/85.png",
  "https://boindia.org/images/gallery/86.png",
  "https://boindia.org/images/gallery/87.png",
  "https://boindia.org/images/gallery/88.png",
  "https://boindia.org/images/gallery/89.png",
  "https://boindia.org/images/gallery/90.png",
  "https://boindia.org/images/gallery/91.png",
  "https://boindia.org/images/gallery/92.png",
  "https://boindia.org/images/gallery/93.png",
  "https://boindia.org/images/gallery/94.png",
  "https://boindia.org/images/gallery/96.png",
  "https://boindia.org/images/gallery/97.png",
  "https://boindia.org/images/gallery/98.png",  
  "https://boindia.org/images/gallery/99.png",
  "https://boindia.org/images/gallery/100.png",
  "https://boindia.org/images/gallery/152.png",
  "https://boindia.org/images/gallery/153.png",
  "https://boindia.org/images/gallery/154.png",
  "https://boindia.org/images/gallery/155.png",
  "https://boindia.org/images/gallery/158.png",
  "https://boindia.org/images/gallery/159.png",
  "https://boindia.org/images/gallery/160.png",
  "https://boindia.org/images/gallery/161.png",
  "https://boindia.org/images/gallery/162.png",
  "https://boindia.org/images/gallery/163.png",
  "https://boindia.org/images/gallery/164.png",
  "https://boindia.org/images/gallery/165.png",
  "https://boindia.org/images/gallery/166.png",
  "https://boindia.org/images/gallery/167.png",
  "https://boindia.org/images/gallery/168.png",
  "https://boindia.org/images/gallery/169.png", 
  "https://boindia.org/images/gallery/170.png",
  "https://boindia.org/images/gallery/171.png",
  "https://boindia.org/images/gallery/172.png",
  "https://boindia.org/images/gallery/173.png",
  "https://boindia.org/images/gallery/174.png",
  "https://boindia.org/images/gallery/175.png",
  "https://boindia.org/images/gallery/176.png",
  "https://boindia.org/images/gallery/177.png",
  "https://boindia.org/images/gallery/178.png",
  "https://boindia.org/images/gallery/179.png", 
  "https://boindia.org/images/gallery/180.png",
  "https://boindia.org/images/gallery/181.png",
  "https://boindia.org/images/gallery/182.png",
  "https://boindia.org/images/gallery/183.png",
  "https://boindia.org/images/gallery/184.png",
  "https://boindia.org/images/gallery/185.png",
  "https://boindia.org/images/gallery/186.png", 
  "https://boindia.org/images/gallery/187.png",
  "https://boindia.org/images/gallery/188.png",
  "https://boindia.org/images/gallery/189.png",
  "https://boindia.org/images/gallery/190.png",
  "https://boindia.org/images/gallery/191.png",
  "https://boindia.org/images/gallery/192.png",
  "https://boindia.org/images/gallery/193.png",
  "https://boindia.org/images/gallery/194.png",
  "https://boindia.org/images/gallery/195.png",
  "https://boindia.org/images/gallery/196.png",
  "https://boindia.org/images/gallery/197.png",
  "https://boindia.org/images/gallery/198.png",
  "https://boindia.org/images/gallery/199.png",
  "https://boindia.org/images/gallery/200.png",
 
  "https://boindia.org/images/gallery/205.png",
  "https://boindia.org/images/gallery/501.png",
  "https://boindia.org/images/gallery/502.png",
  "https://boindia.org/images/gallery/503.png",
  "https://boindia.org/images/gallery/504.png",
  "https://boindia.org/images/gallery/505.png",
  "https://boindia.org/images/gallery/506.png",
  "https://boindia.org/images/gallery/507.png",
  "https://boindia.org/images/gallery/508.png",
  "https://boindia.org/images/gallery/509.png",
  "https://boindia.org/images/gallery/510.png",

  "https://boindia.org/images/gallery/512.png",
  "https://boindia.org/images/gallery/513.png",
  "https://boindia.org/images/gallery/514.png",
  "https://boindia.org/images/gallery/515.png",
  "https://boindia.org/images/gallery/516.png",
  "https://boindia.org/images/gallery/517.png",
  "https://boindia.org/images/gallery/518.png",
  "https://boindia.org/images/gallery/519.png",
  "https://boindia.org/images/gallery/520.png",
  "https://boindia.org/images/gallery/521.png",
  "https://boindia.org/images/gallery/522.png",
  "https://boindia.org/images/gallery/523.png",
  "https://boindia.org/images/gallery/524.png",
  "https://boindia.org/images/gallery/525.png",
  "https://boindia.org/images/gallery/526.png",
  "https://boindia.org/images/gallery/527.png",
  "https://boindia.org/images/gallery/528.png",
  "https://boindia.org/images/gallery/529.png",
  "https://boindia.org/images/gallery/530.png",
  "https://boindia.org/images/gallery/531.png",
  "https://boindia.org/images/gallery/532.png",
  "https://boindia.org/images/gallery/533.png",
  "https://boindia.org/images/gallery/534.png", 
  "https://boindia.org/images/gallery/535.png",
  "https://boindia.org/images/gallery/536.png",
  "https://boindia.org/images/gallery/537.png",
  "https://boindia.org/images/gallery/538.png",
  "https://boindia.org/images/gallery/539.png",
  "https://boindia.org/images/gallery/541.png",
  "https://boindia.org/images/gallery/542.png",
  "https://boindia.org/images/gallery/543.png",
  "https://boindia.org/images/gallery/544.png",
  "https://boindia.org/images/gallery/545.png",
  "https://boindia.org/images/gallery/546.png",
  "https://boindia.org/images/gallery/547.png",
  "https://boindia.org/images/gallery/548.png",
  "https://boindia.org/images/gallery/549.png",
  "https://boindia.org/images/gallery/550.png",
  "https://boindia.org/images/gallery/551.png",
  "https://boindia.org/images/gallery/552.png",
  "https://boindia.org/images/gallery/553.png",
  "https://boindia.org/images/gallery/554.png",
  "https://boindia.org/images/gallery/555.png",
  "https://boindia.org/images/gallery/556.png",
  "https://boindia.org/images/gallery/557.png",
  "https://boindia.org/images/gallery/558.png",
  "https://boindia.org/images/gallery/559.png",
  
];

const videos = [
  { thumbnail: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop", title: "Success Story: Raj & Priya" },
  { thumbnail: "https://images.unsplash.com/photo-1529634597503-139d3726fed5?w=400&h=300&fit=crop", title: "Wedding Highlights" },
  { thumbnail: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&h=300&fit=crop", title: "Customer Testimonial" },
  { thumbnail: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=300&fit=crop", title: "Annual Event 2024" },
];

const Gallery = () => {const [selectedImage, setSelectedImage] = useState(null);
  const IMAGES_PER_LOAD = 8; // 2 rows of 4
  const [visibleImagesCount, setVisibleImagesCount] =
    useState(IMAGES_PER_LOAD);

  const handleLoadMore = () => {
    setVisibleImagesCount((prevCount) => prevCount + IMAGES_PER_LOAD);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

     <PageBanner
  title="Gallery"
  subtitle="A glimpse into sacred unions and cherished moments—celebrating families, timeless traditions, and the bonds that honor our Brahmin heritage. Each photograph tells a story of love, trust, and the harmonious blending of cultural values with life’s modern journey."
  backgroundImage="https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&h=600&fit=crop"
/>


      
      {/* Community Gallery Section */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            How Our <span className="text-primary">Community</span> Makes a Difference
          </h2>

          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-10">
            Images that reflect the collective journey of Brahmin community
            members dedicated to preserving Sanatan culture, honoring classical
            traditions, and nurturing meaningful alliances rooted in shared
            values and cultural harmony.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {communityImages.slice(0, visibleImagesCount).map((image, index) => (
              <div
                key={index}
                className="aspect-[4/3] rounded-xl overflow-hidden cursor-pointer"
                onClick={() => setSelectedImage(image)}
              >
                <img
                  src={image}
                  alt={`Community moment ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
            ))}
          </div>

          {visibleImagesCount < communityImages.length && (
            <div className="text-center mt-12">
              <Button onClick={handleLoadMore} variant="outline" size="lg">
                View More
              </Button>
            </div>
          )}

        </div>
      </section>


      
      {/* Video Gallery */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Video <span className="text-primary">Gallery</span>
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {videos.map((video, index) => (
              <div key={index} className="relative rounded-xl overflow-hidden group cursor-pointer">
                <img 
                  src={video.thumbnail} 
                  alt={video.title}
                  className="w-full aspect-video object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/60 transition-colors">
                  <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center">
                    <Play className="w-8 h-8 text-primary-foreground fill-current" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-white font-medium">{video.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      {/* Lightbox Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-0 border-0 bg-transparent">
          <button 
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          {selectedImage && (
            <img 
              src={selectedImage} 
              alt="Gallery"
              className="w-full rounded-xl"
            />
          )}
        </DialogContent>
      </Dialog>

      <FAQSection />
      <Newsletter />
      <Footer />
    </div>
  );
};
export default Gallery;
