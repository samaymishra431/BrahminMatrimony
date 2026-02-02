import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

interface Milestone {
  year: string;
  title: string;
  position: "top" | "bottom";
}

const milestones: Milestone[] = [
  {
    year: "2026",
    title: "Brahmin Matrimony Platform officially launched as a social initiative",
    position: "bottom",
  },
  {
    year: "2026",
    title: "First group of Brahmin families and volunteers joined the platform",
    position: "top",
  },
  {
    year: "2026",
    title: "Started helping families connect based on culture and values",
    position: "bottom",
  },
  {
    year: "2026",
    title: "Community awareness and outreach began across regions",
    position: "top",
  },
  {
    year: "2026",
    title: "Continuing our journey with trust, service, and cultural responsibility",
    position: "bottom",
  },
];


export function MilestoneTimeline() {
  return (
    <section className="py-20 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-saffron font-semibold text-sm uppercase tracking-wider">Our Journey</span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mt-2 mb-4">
            Our Milestones
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Beginning a meaningful journey for the Brahmin community
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-8 relative">
            {/* Dotted connecting line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 border-t-2 border-dotted border-saffron/30 -translate-y-1/2" />
            
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, y: milestone.position === "top" ? -30 : 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                viewport={{ once: true }}
                className="relative flex flex-col items-center"
              >
                {milestone.position === "bottom" && (
                  <>
                    <Card className="mb-4 md:mb-6 hover:shadow-lg transition-all w-full">
                      <CardContent className="p-3 md:p-4 text-center">
                        <div className="text-2xl md:text-3xl font-bold text-saffron">{milestone.year}</div>
                      </CardContent>
                    </Card>
                    <div className="relative">
                      <div className="w-4 h-4 rounded-full bg-saffron border-4 border-background shadow-lg" />
                    </div>
                    <div className="h-6 md:h-8 w-0.5 border-l-2 border-dotted border-saffron/50" />
                    <Card className="mt-4 md:mt-6 hover:shadow-lg transition-all w-full">
                      <CardContent className="p-3 md:p-4">
                        <p className="text-xs md:text-sm text-muted-foreground text-center leading-snug">{milestone.title}</p>
                      </CardContent>
                    </Card>
                  </>
                )}
                {milestone.position === "top" && (
                  <>
                    <Card className="mb-4 md:mb-6 hover:shadow-lg transition-all w-full">
                      <CardContent className="p-3 md:p-4">
                        <p className="text-xs md:text-sm text-muted-foreground text-center leading-snug">{milestone.title}</p>
                      </CardContent>
                    </Card>
                    <div className="h-6 md:h-8 w-0.5 border-l-2 border-dotted border-saffron/50" />
                    <div className="relative">
                      <div className="w-4 h-4 rounded-full bg-saffron border-4 border-background shadow-lg" />
                    </div>
                    <Card className="mt-4 md:mt-6 hover:shadow-lg transition-all w-full">
                      <CardContent className="p-3 md:p-4 text-center">
                        <div className="text-2xl md:text-3xl font-bold text-saffron">{milestone.year}</div>
                      </CardContent>
                    </Card>
                  </>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
