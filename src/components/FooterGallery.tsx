import happyMem1 from "@/images/happy-mem1.png";
import happyMem2 from "@/images/happy-mem2.png";
import happyMem3 from "@/images/happy-mem3.png";
import happyMem4 from "@/images/happy-mem4.png";
import happyMem5 from "@/images/happy-mem5.png";
import happyMem6 from "@/images/happy-mem6.png";

const galleryImages = [
  happyMem1,
  happyMem2,
  happyMem3,
  happyMem4,
  happyMem5,
  happyMem6,
];

const FooterGallery = () => {
  return (
    <section className="py-12 bg-card">
      <div className="container mx-auto px-4">
        <h3 className="text-2xl font-bold text-center mb-8">
          Happy <span className="text-primary">Moments</span>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {galleryImages.map((image, index) => (
            <div 
              key={index} 
              className="aspect-[3/2] rounded-xl overflow-hidden group cursor-pointer"
            >
              <img
                src={image}
                alt={`Gallery ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FooterGallery;
