import { Dialog, DialogContent } from "@/components/ui/dialog";

interface FullImageViewerProps {
  imageUrl: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shape?: "circle" | "rectangle";
}

const FullImageViewer = ({
  imageUrl,
  open,
  onOpenChange,
  shape = "rectangle",
}: FullImageViewerProps) => {
  if (!imageUrl) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-fit bg-transparent border-0 shadow-none p-0 flex justify-center items-center">
        {shape === "circle" ? (
          <div className="w-[400px] h-[400px] rounded-full overflow-hidden flex justify-center items-center bg-black/10">
            <img
              src={imageUrl}
              alt="Full view"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        ) : (
          <img
            src={imageUrl}
            alt="Full view"
            className="rounded-lg max-h-[85vh] object-contain"
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FullImageViewer;
